import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Receipt, ArrowDownCircle, ArrowUpCircle, Calendar, User, Filter } from "lucide-react";

interface CreditNote {
  id: string;
  student_id: number;
  amount: number;
  details: string;
  timestamp: string;
  status: 'active' | 'used' | 'expired';
  expiry_date: string;
  used_at?: string;
  used_for?: string;
  academic_year?: string;
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
}

export const CreditNoteHistory = ({ creditNotes, students }: CreditNoteHistoryProps) => {
  const { t, language, formatCurrency } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<string>("all");

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

      return true;
    });
  }, [creditNotes, selectedYear, selectedType, selectedStudent]);

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

  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className={`flex items-center gap-2 ${fontClass}`}>
            <Filter className="h-5 w-5" />
            {language === 'th' ? 'ตัวกรอง' : language === 'zh' ? '筛选' : 'Filters'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Academic Year Filter */}
            <div className="space-y-2">
              <label className={`text-sm font-medium ${fontClass}`}>
                {language === 'th' ? 'ปีการศึกษา' : language === 'zh' ? '学年' : 'Academic Year'}
              </label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'th' ? 'เลือกปี' : language === 'zh' ? '选择年份' : 'Select Year'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'th' ? 'ทั้งหมด' : language === 'zh' ? '全部' : 'All Years'}</SelectItem>
                  {academicYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter (In/Out) */}
            <div className="space-y-2">
              <label className={`text-sm font-medium ${fontClass}`}>
                {language === 'th' ? 'ประเภท' : language === 'zh' ? '类型' : 'Type'}
              </label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'th' ? 'เลือกประเภท' : language === 'zh' ? '选择类型' : 'Select Type'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'th' ? 'ทั้งหมด' : language === 'zh' ? '全部' : 'All'}</SelectItem>
                  <SelectItem value="in">{language === 'th' ? 'รับเข้า (Active)' : language === 'zh' ? '收入 (Active)' : 'Received (Active)'}</SelectItem>
                  <SelectItem value="out">{language === 'th' ? 'ใช้ออก (Used)' : language === 'zh' ? '支出 (Used)' : 'Used (Out)'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Student Filter */}
            <div className="space-y-2">
              <label className={`text-sm font-medium ${fontClass}`}>
                {language === 'th' ? 'นักเรียน' : language === 'zh' ? '学生' : 'Student'}
              </label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'th' ? 'เลือกนักเรียน' : language === 'zh' ? '选择学生' : 'Select Student'} />
                </SelectTrigger>
                <SelectContent>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <ArrowDownCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className={`text-sm text-muted-foreground ${fontClass}`}>
                  {language === 'th' ? 'Credit Note คงเหลือ' : language === 'zh' ? '可用信用票据' : 'Available Credit'}
                </p>
                <p className={`text-2xl font-bold text-green-600 ${fontClass}`}>
                  {formatCurrency(totalIn)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-500/10 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <ArrowUpCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className={`text-sm text-muted-foreground ${fontClass}`}>
                  {language === 'th' ? 'Credit Note ที่ใช้ไปแล้ว' : language === 'zh' ? '已使用信用票据' : 'Used Credit'}
                </p>
                <p className={`text-2xl font-bold text-orange-600 ${fontClass}`}>
                  {formatCurrency(totalOut)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Credit Note List */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${fontClass}`}>
            <Receipt className="h-5 w-5" />
            {language === 'th' ? 'รายการ Credit Note' : language === 'zh' ? '信用票据列表' : 'Credit Note History'}
          </CardTitle>
          <CardDescription className={fontClass}>
            {language === 'th' 
              ? '* Credit Note สามารถใช้ได้เฉพาะนักเรียนที่ได้รับเท่านั้น ไม่สามารถใช้ข้ามนักเรียนได้' 
              : language === 'zh' 
              ? '* 信用票据只能用于分配给的学生，不能跨学生使用'
              : '* Credit notes are per student and cannot be used across different students'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCreditNotes.length === 0 ? (
            <div className={`text-center py-8 text-muted-foreground ${fontClass}`}>
              {language === 'th' ? 'ไม่พบรายการ Credit Note' : language === 'zh' ? '未找到信用票据' : 'No credit notes found'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCreditNotes
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map(note => {
                  const student = getStudentInfo(note.student_id);
                  const isUsed = note.status === 'used';

                  return (
                    <div 
                      key={note.id} 
                      className={`p-4 rounded-lg border ${isUsed ? 'bg-muted/30 border-muted' : 'bg-green-500/5 border-green-500/20'}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${isUsed ? 'bg-orange-500/20' : 'bg-green-500/20'}`}>
                            {isUsed ? (
                              <ArrowUpCircle className="h-5 w-5 text-orange-600" />
                            ) : (
                              <ArrowDownCircle className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`font-semibold ${fontClass}`}>{note.id}</span>
                              <Badge 
                                variant={isUsed ? "secondary" : "default"}
                                className={isUsed ? "" : "bg-green-500"}
                              >
                                {isUsed 
                                  ? (language === 'th' ? 'ใช้แล้ว' : language === 'zh' ? '已使用' : 'Used')
                                  : (language === 'th' ? 'คงเหลือ' : language === 'zh' ? '可用' : 'Active')
                                }
                              </Badge>
                            </div>
                            <p className={`text-sm text-muted-foreground ${fontClass}`}>
                              {note.details}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {language === 'th' ? 'วันที่ออก: ' : language === 'zh' ? '发行日期: ' : 'Created: '}
                                {new Date(note.timestamp).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {student?.avatar} {student?.name}
                              </span>
                            </div>
                            {isUsed && note.used_at && (
                              <div className={`text-xs text-orange-600 mt-1 ${fontClass}`}>
                                {language === 'th' ? '✓ ใช้เมื่อ: ' : language === 'zh' ? '✓ 使用于: ' : '✓ Used on: '}
                                {new Date(note.used_at).toLocaleDateString()}
                                {note.used_for && ` - ${note.used_for}`}
                              </div>
                            )}
                            {!isUsed && (
                              <div className={`text-xs text-muted-foreground mt-1 ${fontClass}`}>
                                {language === 'th' ? 'หมดอายุ: ' : language === 'zh' ? '到期日: ' : 'Expires: '}
                                {new Date(note.expiry_date).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xl font-bold ${isUsed ? 'text-orange-600' : 'text-green-600'} ${fontClass}`}>
                            {isUsed ? '-' : '+'}{formatCurrency(note.amount)}
                          </p>
                        </div>
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
