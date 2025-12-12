import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Download, Receipt, CreditCard, DollarSign, CalendarIcon, X, Smartphone, QrCode, ArrowDownCircle, Flame, Wallet, ExternalLink, Filter, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface CreditNoteHistoryEvent {
  event: 'received' | 'burned' | 'paid';
  credit_note_id?: string;
  amount: number;
  timestamp: string;
  payment_method?: string;
  details: string;
}

interface Receipt {
  id: string;
  invoice_id: string;
  student_id: number;
  studentName: string;
  year: string;
  amount: number;
  payment_method: 'credit_card' | 'bank_transfer' | 'cash' | 'bbl_app' | 'promptpay' | 'wechat' | 'alipay';
  paid_at: string;
  receipt_url: string;
  status: 'completed' | 'processing' | 'failed';
  description: string;
  reference_number: string;
  type?: 'tuition' | 'activity' | 'course';
  applied_credit_notes?: Array<{
    id: string;
    amount: number;
    details: string;
  }>;
  credit_note_history?: CreditNoteHistoryEvent[];
}

interface ReceiptListProps {
  receipts: Receipt[];
  onDownload?: (receiptId: string) => void;
  onCreditNoteClick?: (creditNoteId: string) => void;
}

export const ReceiptList = ({ receipts, onDownload, onCreditNoteClick }: ReceiptListProps) => {
  const { language, formatCurrency, t } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(undefined);
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("tuition");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Extract unique students for filters
  const students = Array.from(new Set(receipts.map(r => ({ id: r.student_id, name: r.studentName }))))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Filter receipts based on selected month, student, and type
  const filteredReceipts = receipts.filter(receipt => {
    const monthMatch = !selectedMonth || (
      new Date(receipt.paid_at).getMonth() === selectedMonth.getMonth() &&
      new Date(receipt.paid_at).getFullYear() === selectedMonth.getFullYear()
    );
    const studentMatch = selectedStudent === "all" || receipt.student_id.toString() === selectedStudent;
    const typeMatch = selectedType === "all" || receipt.type === selectedType;
    return monthMatch && studentMatch && typeMatch;
  });

  const paymentMethodConfig: Record<string, { label: string; icon: any; gradient: string }> = {
    credit_card: { 
      label: t('payment.creditCard'), 
      icon: CreditCard, 
      gradient: 'from-blue-500 to-purple-600' 
    },
    bank_transfer: { 
      label: t('payment.bankTransfer'), 
      icon: DollarSign, 
      gradient: 'from-green-500 to-emerald-600' 
    },
    cash: { 
      label: t('payment.cash'), 
      icon: DollarSign, 
      gradient: 'from-gray-500 to-slate-600' 
    },
    bbl_app: {
      label: 'BBL App',
      icon: Smartphone,
      gradient: 'from-blue-600 to-blue-800'
    },
    promptpay: {
      label: 'PromptPay',
      icon: QrCode,
      gradient: 'from-orange-500 to-orange-700'
    },
    wechat: {
      label: 'WeChat Pay',
      icon: Smartphone,
      gradient: 'from-green-500 to-green-700'
    },
    alipay: {
      label: 'Alipay',
      icon: Smartphone,
      gradient: 'from-blue-400 to-blue-600'
    },
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString(language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventIcon = (event: string, isMobile: boolean = false) => {
    const size = isMobile ? "h-3 w-3" : "h-4 w-4";
    switch (event) {
      case 'received':
        return <ArrowDownCircle className={`${size} text-green-600`} />;
      case 'burned':
        return <Flame className={`${size} text-orange-600`} />;
      case 'paid':
        return <Wallet className={`${size} text-blue-600`} />;
      default:
        return <Receipt className={size} />;
    }
  };

  const getEventColor = (event: string) => {
    switch (event) {
      case 'received':
        return 'border-green-500 bg-green-500';
      case 'burned':
        return 'border-orange-500 bg-orange-500';
      case 'paid':
        return 'border-blue-500 bg-blue-500';
      default:
        return 'border-gray-500 bg-gray-500';
    }
  };

  const getEventLabel = (event: string, short: boolean = false) => {
    if (short) {
      switch (event) {
        case 'burned':
          return language === 'th' ? 'ใช้ Credit' : 'Credit Used';
        case 'paid':
          return language === 'th' ? 'ชำระ' : 'Paid';
        default:
          return event;
      }
    }
    switch (event) {
      case 'received':
        return language === 'th' ? 'ได้รับ Credit Note' : language === 'zh' ? '收到信用票据' : 'Received Credit Note';
      case 'burned':
        return language === 'th' ? 'ใช้ Credit Note' : language === 'zh' ? '使用信用票据' : 'Used Credit Note';
      case 'paid':
        return language === 'th' ? 'ชำระเงิน' : language === 'zh' ? '付款' : 'Payment';
      default:
        return event;
    }
  };

  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  // Count active filters
  const activeFiltersCount = [
    selectedMonth !== undefined,
    selectedStudent !== "all",
    selectedType !== "tuition" && selectedType !== "all"
  ].filter(Boolean).length;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Mobile: Collapsible Filters */}
      <div className="sm:hidden">
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between h-10">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className={`text-sm ${fontClass}`}>
                  {language === 'th' ? 'ตัวกรอง' : 'Filters'}
                </span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                    {activeFiltersCount}
                  </Badge>
                )}
              </div>
              <ChevronDown className={cn("h-4 w-4 transition-transform", filtersOpen && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-3">
            {/* Month Filter */}
            <div className="space-y-1.5">
              <label className={`text-xs font-medium ${fontClass}`}>
                {language === 'th' ? 'เดือน' : 'Month'}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-10",
                      !selectedMonth && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedMonth ? (
                      format(selectedMonth, "MMMM yyyy")
                    ) : (
                      <span>{language === 'th' ? 'เลือกเดือน' : 'Pick a month'}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedMonth}
                    onSelect={setSelectedMonth}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                  {selectedMonth && (
                    <div className="p-3 border-t">
                      <Button
                        variant="ghost"
                        className="w-full justify-center h-9"
                        onClick={() => setSelectedMonth(undefined)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        {language === 'th' ? 'ล้าง' : 'Clear'}
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>

            {/* Student Filter */}
            <div className="space-y-1.5">
              <label className={`text-xs font-medium ${fontClass}`}>
                {language === 'th' ? 'นักเรียน' : 'Student'}
              </label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="all">{language === 'th' ? 'ทั้งหมด' : 'All Students'}</SelectItem>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id.toString()}>{student.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div className="space-y-1.5">
              <label className={`text-xs font-medium ${fontClass}`}>
                {language === 'th' ? 'ประเภท' : 'Type'}
              </label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="all">{language === 'th' ? 'ทั้งหมด' : 'All Types'}</SelectItem>
                  <SelectItem value="tuition">{language === 'th' ? 'ค่าเล่าเรียน' : 'Tuition'}</SelectItem>
                  <SelectItem value="activity">{language === 'th' ? 'กิจกรรม' : 'Activity'}</SelectItem>
                  <SelectItem value="course">{language === 'th' ? 'คอร์ส' : 'Course'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Desktop: Inline Filters */}
      <div className="hidden sm:flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${fontClass}`}>
            {language === 'th' ? 'เดือน:' : 'Month:'}
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !selectedMonth && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedMonth ? (
                  format(selectedMonth, "MMMM yyyy")
                ) : (
                  <span>{language === 'th' ? 'เลือกเดือน' : 'Pick a month'}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedMonth}
                onSelect={setSelectedMonth}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
              {selectedMonth && (
                <div className="p-3 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-center"
                    onClick={() => setSelectedMonth(undefined)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    {language === 'th' ? 'ล้างตัวกรอง' : 'Clear filter'}
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${fontClass}`}>
            {language === 'th' ? 'นักเรียน:' : 'Student:'}
          </span>
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="all">{language === 'th' ? 'ทั้งหมด' : 'All Students'}</SelectItem>
              {students.map(student => (
                <SelectItem key={student.id} value={student.id.toString()}>{student.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${fontClass}`}>
            {language === 'th' ? 'ประเภท:' : 'Type:'}
          </span>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="all">{language === 'th' ? 'ทั้งหมด' : 'All Types'}</SelectItem>
              <SelectItem value="tuition">{language === 'th' ? 'ค่าเล่าเรียน' : 'Tuition'}</SelectItem>
              <SelectItem value="activity">{language === 'th' ? 'กิจกรรม' : 'Activity'}</SelectItem>
              <SelectItem value="course">{language === 'th' ? 'คอร์ส' : 'Course'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className={`text-sm text-muted-foreground ml-auto ${fontClass}`}>
          {language === 'th' ? `แสดง ${filteredReceipts.length} รายการ` : `Showing ${filteredReceipts.length} receipts`}
        </div>
      </div>

      {/* Results count - Mobile */}
      <div className={`text-xs text-muted-foreground sm:hidden ${fontClass}`}>
        {language === 'th' ? `แสดง ${filteredReceipts.length} รายการจากทั้งหมด ${receipts.length}` : `Showing ${filteredReceipts.length} of ${receipts.length}`}
      </div>

      {filteredReceipts.length === 0 ? (
        <div className={`text-center py-8 text-muted-foreground ${fontClass}`}>
          <Receipt className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">{t('portal.noReceipts')}</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredReceipts.map((receipt) => {
            const PaymentIcon = paymentMethodConfig[receipt.payment_method]?.icon || DollarSign;
            const iconGradient = paymentMethodConfig[receipt.payment_method]?.gradient || 'from-gray-500 to-slate-600';
            const hasTimeline = receipt.credit_note_history && receipt.credit_note_history.length > 0;
            const timelineEvents = receipt.credit_note_history?.filter(event => event.event !== 'received') || [];

            return (
              <Card key={receipt.id} className="overflow-hidden">
                <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-br ${iconGradient} flex-shrink-0`}>
                        <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className={`text-sm sm:text-base truncate ${fontClass}`}>
                          {receipt.description}
                        </CardTitle>
                        <p className={`text-[10px] sm:text-xs text-muted-foreground ${fontClass}`}>
                          Ref: {receipt.reference_number}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 flex-shrink-0">
                      <Badge variant="secondary" className="font-medium text-[10px] sm:text-xs">
                        {receipt.studentName}
                      </Badge>
                      {receipt.type && (
                        <Badge variant="outline" className="text-[10px] sm:text-xs hidden sm:inline-flex">
                          {receipt.type === 'tuition' 
                            ? (language === 'th' ? 'ค่าเล่าเรียน' : 'Tuition')
                            : receipt.type === 'activity'
                            ? (language === 'th' ? 'กิจกรรม' : 'Activity')
                            : (language === 'th' ? 'คอร์ส' : 'Course')
                          }
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 px-3 sm:px-6 pb-3 sm:pb-6">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    {/* Payment info row */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-lg sm:text-2xl font-bold ${fontClass}`}>
                          {formatCurrency(receipt.amount)}
                        </div>
                        <p className={`text-[10px] sm:text-sm text-muted-foreground ${fontClass}`}>
                          {formatDate(receipt.paid_at)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          variant="outline" 
                          className={`gap-1 text-[10px] sm:text-xs ${
                            receipt.payment_method === 'credit_card' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                            receipt.payment_method === 'bbl_app' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                            receipt.payment_method === 'promptpay' ? 'border-orange-200 text-orange-700 bg-orange-50' :
                            'border-green-200 text-green-700 bg-green-50'
                          }`}
                        >
                          <PaymentIcon className="h-3 w-3" />
                          <span className={fontClass}>
                            {paymentMethodConfig[receipt.payment_method]?.label || receipt.payment_method}
                          </span>
                        </Badge>
                        {receipt.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs touch-manipulation"
                            onClick={() => onDownload?.(receipt.id)}
                          >
                            <Download className="h-3.5 w-3.5 mr-1.5" />
                            {language === 'th' ? 'ดาวน์โหลด' : 'Download'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Timeline - Compact on mobile */}
                    {hasTimeline && timelineEvents.length > 0 && (
                      <div className="border-t pt-3 sm:pt-4">
                        <p className={`text-xs sm:text-sm font-medium mb-2 sm:mb-3 ${fontClass}`}>
                          {language === 'th' ? 'ประวัติ' : 'Timeline'}
                        </p>
                        
                        {/* Mobile: Simplified compact view */}
                        <div className="sm:hidden space-y-2">
                          {timelineEvents
                            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                            .map((event, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getEventColor(event.event)}`} />
                                <span className="text-muted-foreground">{formatDateShort(event.timestamp)}</span>
                                <span className={`font-medium ${
                                  event.event === 'burned' ? 'text-orange-600' : 'text-blue-600'
                                } ${fontClass}`}>
                                  {getEventLabel(event.event, true)}
                                </span>
                                <span className={`ml-auto font-bold ${
                                  event.event === 'burned' ? 'text-orange-600' : 'text-blue-600'
                                } ${fontClass}`}>
                                  {event.event === 'burned' ? '-' : ''}{formatCurrency(event.amount)}
                                </span>
                                {event.credit_note_id && (
                                  <button
                                    onClick={() => onCreditNoteClick?.(event.credit_note_id!)}
                                    className="text-orange-600 active:text-orange-700"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            ))}
                        </div>
                        
                        {/* Desktop: Full timeline view */}
                        <div className="hidden sm:block">
                          <ScrollArea className={timelineEvents.length > 3 ? "h-[150px]" : ""}>
                            <div className="space-y-0 relative">
                              {timelineEvents
                                .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                                .map((event, index, arr) => (
                                  <div key={index} className="flex gap-3 pb-3 last:pb-0">
                                    {/* Timeline line and dot */}
                                    <div className="flex flex-col items-center">
                                      <div className={`w-3 h-3 rounded-full border-2 ${getEventColor(event.event)}`} />
                                      {index < arr.length - 1 && (
                                        <div className="w-0.5 flex-1 bg-muted-foreground/20 mt-1" />
                                      )}
                                    </div>
                                    
                                    {/* Event content */}
                                    <div className="flex-1 pb-2">
                                      <div className="flex items-center gap-2">
                                        {getEventIcon(event.event)}
                                        <span className={`text-sm font-medium ${fontClass}`}>
                                          {getEventLabel(event.event)}
                                        </span>
                                      </div>
                                      <p className={`text-xs text-muted-foreground ${fontClass}`}>
                                        {formatDateTime(event.timestamp)}
                                      </p>
                                      <p className={`text-sm ${
                                        event.event === 'received' ? 'text-green-600' :
                                        event.event === 'burned' ? 'text-orange-600' :
                                        'text-blue-600'
                                      } ${fontClass}`}>
                                        {event.event === 'received' ? '+' : event.event === 'burned' ? '-' : ''}
                                        {formatCurrency(event.amount)}
                                        {event.credit_note_id && (
                                          <button
                                            onClick={() => onCreditNoteClick?.(event.credit_note_id!)}
                                            className="ml-1 text-orange-600 hover:underline cursor-pointer font-medium inline-flex items-center gap-0.5 hover:text-orange-700 transition-colors"
                                          >
                                            ({event.credit_note_id})
                                            <ExternalLink className="h-3 w-3" />
                                          </button>
                                        )}
                                      </p>
                                      <p className={`text-xs text-muted-foreground ${fontClass}`}>
                                        {event.details}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
