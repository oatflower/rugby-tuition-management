import { useState, useMemo, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Receipt, ArrowDownCircle, ArrowUpCircle, Calendar, User, Filter, CreditCard, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CreditNote {
  id: string;
  student_id: number;
  amount: number;
  details: string;
  timestamp: string;
  status: 'active' | 'used' | 'expired';
  used_at?: string;
  used_for?: string;
  academic_year?: string;
  payment_channel?: 'credit_card' | 'bbl_app' | 'promptpay' | 'wechat' | 'alipay';
}

interface Student {
  id: number;
  name: string;
  class: string;
  year: string;
  avatar: string;
  campus: string;
  color: string;
}

interface CreditNoteHistoryProps {
  creditNotes: CreditNote[];
  students: Student[];
  highlightedCreditNoteId?: string | null;
}

const paymentChannelLabels: Record<string, { en: string; th: string; zh: string }> = {
  credit_card: { en: 'Credit Card', th: 'บัตรเครดิต', zh: '信用卡' },
  bbl_app: { en: 'BBL App', th: 'BBL App', zh: 'BBL App' },
  promptpay: { en: 'PromptPay', th: 'พร้อมเพย์', zh: 'PromptPay' },
  wechat: { en: 'WeChat Pay', th: 'WeChat Pay', zh: '微信支付' },
  alipay: { en: 'Alipay', th: 'Alipay', zh: '支付宝' },
};

export const CreditNoteHistory = ({ creditNotes, students, highlightedCreditNoteId }: CreditNoteHistoryProps) => {
  const { t, language, formatCurrency } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const highlightedRef = useRef<HTMLDivElement>(null);

  // Auto-search and scroll when highlightedCreditNoteId changes
  useEffect(() => {
    if (highlightedCreditNoteId) {
      setSearchQuery(highlightedCreditNoteId);
      setSelectedYear("all");
      setSelectedType("all");
      setSelectedStudent("all");
      
      // Scroll to highlighted element after a short delay
      setTimeout(() => {
        highlightedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [highlightedCreditNoteId]);

  // Get unique academic years
  const academicYears = useMemo(() => {
    const years = new Set<string>();
    creditNotes.forEach(note => {
      const year = note.academic_year || new Date(note.timestamp).getFullYear().toString();
      years.add(year);
    });
    return Array.from(years).sort().reverse();
  }, [creditNotes]);


  // Filter credit notes
  const filteredCreditNotes = useMemo(() => {
    return creditNotes.filter(note => {
      // Filter by academic year
      if (selectedYear !== "all") {
        const noteYear = note.academic_year || new Date(note.timestamp).getFullYear().toString();
        if (noteYear !== selectedYear) return false;
      }

      // Filter by type (in = active/received, out = used)
      if (selectedType === "in" && note.status !== "active") return false;
      if (selectedType === "out" && note.status !== "used") return false;

      // Filter by student
      if (selectedStudent !== "all" && note.student_id.toString() !== selectedStudent) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = note.id.toLowerCase().includes(query);
        const matchesDetails = note.details.toLowerCase().includes(query);
        const matchesUsedFor = note.used_for?.toLowerCase().includes(query);
        if (!matchesId && !matchesDetails && !matchesUsedFor) return false;
      }

      return true;
    });
  }, [creditNotes, selectedYear, selectedType, selectedStudent, searchQuery]);

  // Calculate totals
  const totalIn = filteredCreditNotes
    .filter(note => note.status === 'active')
    .reduce((sum, note) => sum + note.amount, 0);

  const totalOut = filteredCreditNotes
    .filter(note => note.status === 'used')
    .reduce((sum, note) => sum + note.amount, 0);

  const getStudentInfo = (studentId: number) => {
    return students.find(s => s.id === studentId);
  };

  const getPaymentChannelLabel = (channel: string) => {
    const labels = paymentChannelLabels[channel];
    if (!labels) return channel;
    return language === 'th' ? labels.th : language === 'zh' ? labels.zh : labels.en;
  };

  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className={`flex items-center gap-2 text-base sm:text-lg ${fontClass}`}>
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            {language === 'th' ? 'ตัวกรอง' : language === 'zh' ? '筛选' : 'Filters'}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          {/* Search Input */}
          <div className="mb-3 sm:mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === 'th' ? 'ค้นหา Credit Note...' : language === 'zh' ? '搜索信用票据...' : 'Search Credit Note...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 h-10 sm:h-9 text-sm ${fontClass}`}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Academic Year Filter */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className={`text-xs sm:text-sm font-medium ${fontClass}`}>
                {language === 'th' ? 'ปีการศึกษา' : language === 'zh' ? '学年' : 'Academic Year'}
              </label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="h-10 sm:h-9 text-sm">
                  <SelectValue placeholder={language === 'th' ? 'เลือกปี' : language === 'zh' ? '选择年份' : 'Select Year'} />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="all">{language === 'th' ? 'ทั้งหมด' : language === 'zh' ? '全部' : 'All Years'}</SelectItem>
                  {academicYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter (In/Out) */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className={`text-xs sm:text-sm font-medium ${fontClass}`}>
                {language === 'th' ? 'ประเภท' : language === 'zh' ? '类型' : 'Type'}
              </label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-10 sm:h-9 text-sm">
                  <SelectValue placeholder={language === 'th' ? 'เลือกประเภท' : language === 'zh' ? '选择类型' : 'Select Type'} />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="all">{language === 'th' ? 'ทั้งหมด' : language === 'zh' ? '全部' : 'All'}</SelectItem>
                  <SelectItem value="in">{language === 'th' ? 'คงเหลือ' : language === 'zh' ? '可用' : 'Active'}</SelectItem>
                  <SelectItem value="out">{language === 'th' ? 'ใช้แล้ว' : language === 'zh' ? '已使用' : 'Used'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Student Filter */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className={`text-xs sm:text-sm font-medium ${fontClass}`}>
                {language === 'th' ? 'นักเรียน' : language === 'zh' ? '学生' : 'Student'}
              </label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger className="h-10 sm:h-9 text-sm">
                  <SelectValue placeholder={language === 'th' ? 'เลือกนักเรียน' : language === 'zh' ? '选择学生' : 'Select Student'} />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="all">{language === 'th' ? 'ทุกคน' : language === 'zh' ? '全部' : 'All Students'}</SelectItem>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.avatar} {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards - 2 columns on mobile */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg flex-shrink-0">
                <ArrowDownCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className={`text-[10px] sm:text-sm text-muted-foreground truncate ${fontClass}`}>
                  {language === 'th' ? 'คงเหลือ' : language === 'zh' ? '可用' : 'Available'}
                </p>
                <p className={`text-base sm:text-2xl font-bold text-green-600 truncate ${fontClass}`}>
                  {formatCurrency(totalIn)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-500/10 border-orange-500/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-orange-500/20 rounded-lg flex-shrink-0">
                <ArrowUpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              </div>
              <div className="min-w-0">
                <p className={`text-[10px] sm:text-sm text-muted-foreground truncate ${fontClass}`}>
                  {language === 'th' ? 'ใช้แล้ว' : language === 'zh' ? '已使用' : 'Used'}
                </p>
                <p className={`text-base sm:text-2xl font-bold text-orange-600 truncate ${fontClass}`}>
                  {formatCurrency(totalOut)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Credit Note List */}
      <Card>
        <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-4">
          <CardTitle className={`flex items-center gap-2 text-base sm:text-lg ${fontClass}`}>
            <Receipt className="h-4 w-4 sm:h-5 sm:w-5" />
            {language === 'th' ? 'รายการ Credit Note' : language === 'zh' ? '信用票据列表' : 'Credit Note History'}
          </CardTitle>
          <CardDescription className={`text-xs sm:text-sm ${fontClass}`}>
            {language === 'th' 
              ? '* Credit Note ใช้ได้เฉพาะนักเรียนที่ได้รับเท่านั้น' 
              : language === 'zh' 
              ? '* 信用票据只能用于分配给的学生'
              : '* Credit notes are per student only'}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          {filteredCreditNotes.length === 0 ? (
            <div className={`text-center py-6 sm:py-8 text-muted-foreground text-sm ${fontClass}`}>
              {language === 'th' ? 'ไม่พบรายการ Credit Note' : language === 'zh' ? '未找到信用票据' : 'No credit notes found'}
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-4">
              {filteredCreditNotes
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map(note => {
                  const student = getStudentInfo(note.student_id);
                  const isUsed = note.status === 'used';

                  return (
                    <div 
                      key={note.id}
                      ref={highlightedCreditNoteId === note.id ? highlightedRef : null}
                      className={cn(
                        "p-3 sm:p-4 rounded-lg border-2 transition-all",
                        isUsed ? 'bg-muted/30 border-muted' : 'bg-green-500/5 border-green-500/20',
                        highlightedCreditNoteId === note.id && "animate-blink-border"
                      )}
                    >
                      <div className="flex flex-col gap-2 sm:gap-3">
                        {/* Header row with icon, ID, badge, and amount */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${isUsed ? 'bg-orange-500/20' : 'bg-green-500/20'}`}>
                              {isUsed ? (
                                <ArrowUpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                              ) : (
                                <ArrowDownCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`font-semibold text-sm sm:text-base truncate ${fontClass}`}>{note.id}</span>
                                <Badge 
                                  variant={isUsed ? "secondary" : "default"}
                                  className={`text-[10px] sm:text-xs ${isUsed ? "" : "bg-green-500"}`}
                                >
                                  {isUsed 
                                    ? (language === 'th' ? 'ใช้แล้ว' : language === 'zh' ? '已使用' : 'Used')
                                    : (language === 'th' ? 'คงเหลือ' : language === 'zh' ? '可用' : 'Active')
                                  }
                                </Badge>
                              </div>
                              <p className={`text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-2 ${fontClass}`}>
                                {note.details}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className={`text-base sm:text-xl font-bold ${isUsed ? 'text-orange-600' : 'text-green-600'} ${fontClass}`}>
                              {isUsed ? '-' : '+'}{formatCurrency(note.amount)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Meta info row */}
                        <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground flex-wrap pl-8 sm:pl-11">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(note.timestamp).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {student?.avatar} {student?.name}
                          </span>
                        </div>
                        
                        {/* Used info */}
                        {isUsed && note.used_at && (
                          <div className={`text-[10px] sm:text-xs text-orange-600 pl-8 sm:pl-11 ${fontClass}`}>
                            ✓ {language === 'th' ? 'ใช้เมื่อ: ' : language === 'zh' ? '使用于: ' : 'Used: '}
                            {new Date(note.used_at).toLocaleDateString()}
                            {note.used_for && ` - ${note.used_for}`}
                          </div>
                        )}
                        {isUsed && note.payment_channel && (
                          <div className={`text-[10px] sm:text-xs text-muted-foreground pl-8 sm:pl-11 flex items-center gap-1 ${fontClass}`}>
                            <CreditCard className="h-3 w-3" />
                            {getPaymentChannelLabel(note.payment_channel)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
