import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Receipt, CreditCard, DollarSign, CalendarIcon, X, Smartphone, QrCode, ArrowDownCircle, Flame, Wallet } from "lucide-react";
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString(language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventIcon = (event: string) => {
    switch (event) {
      case 'received':
        return <ArrowDownCircle className="h-4 w-4 text-green-600" />;
      case 'burned':
        return <Flame className="h-4 w-4 text-orange-600" />;
      case 'paid':
        return <Wallet className="h-4 w-4 text-blue-600" />;
      default:
        return <Receipt className="h-4 w-4" />;
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

  const getEventLabel = (event: string) => {
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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${fontClass}`}>
            {language === 'th' ? 'เดือน:' : language === 'zh' ? '月份:' : 'Month:'}
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
                  <span>{language === 'th' ? 'เลือกเดือน' : language === 'zh' ? '选择月份' : 'Pick a month'}</span>
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
                    {language === 'th' ? 'ล้างตัวกรอง' : language === 'zh' ? '清除筛选' : 'Clear filter'}
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
            {language === 'th' ? 'ประเภท:' : language === 'zh' ? '类型:' : 'Type:'}
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
          {language === 'th' ? `แสดง ${filteredReceipts.length} รายการจากทั้งหมด ${receipts.length}` : `Showing ${filteredReceipts.length} of ${receipts.length} receipts`}
        </div>
      </div>

      {filteredReceipts.length === 0 ? (
        <div className={`text-center py-8 text-muted-foreground ${fontClass}`}>
          <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{t('portal.noReceipts')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReceipts.map((receipt) => {
            const PaymentIcon = paymentMethodConfig[receipt.payment_method]?.icon || DollarSign;
            const iconGradient = paymentMethodConfig[receipt.payment_method]?.gradient || 'from-gray-500 to-slate-600';
            const hasTimeline = receipt.credit_note_history && receipt.credit_note_history.length > 0;

            return (
              <Card key={receipt.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${iconGradient} flex-shrink-0`}>
                        <Receipt className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className={`text-base ${fontClass}`}>
                          {receipt.description}
                        </CardTitle>
                        <p className={`text-xs text-muted-foreground ${fontClass}`}>
                          Ref: {receipt.reference_number}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-medium">
                        {receipt.studentName}
                      </Badge>
                      {receipt.type && (
                        <Badge variant="outline" className="text-xs">
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
                <CardContent className="pt-0">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Left side - Payment info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`text-2xl font-bold ${fontClass}`}>
                          {formatCurrency(receipt.amount)}
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`gap-1 ${
                            receipt.payment_method === 'credit_card' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                            receipt.payment_method === 'bbl_app' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                            receipt.payment_method === 'promptpay' ? 'border-orange-200 text-orange-700 bg-orange-50' :
                            'border-green-200 text-green-700 bg-green-50'
                          }`}
                        >
                          <PaymentIcon className="h-3 w-3" />
                          <span className={`text-xs ${fontClass}`}>
                            {paymentMethodConfig[receipt.payment_method]?.label || receipt.payment_method}
                          </span>
                        </Badge>
                      </div>
                      <p className={`text-sm text-muted-foreground ${fontClass}`}>
                        {formatDate(receipt.paid_at)}
                      </p>
                      
                      {/* Download button */}
                      {receipt.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={() => onDownload?.(receipt.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {language === 'th' ? 'ดาวน์โหลด' : 'Download'}
                        </Button>
                      )}
                    </div>

                    {/* Right side - Timeline */}
                    {hasTimeline && (
                      <div className="lg:w-1/2 border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-4">
                        <p className={`text-sm font-medium mb-3 ${fontClass}`}>
                          {language === 'th' ? 'ประวัติการทำรายการ' : language === 'zh' ? '交易历史' : 'Transaction Timeline'}
                        </p>
                        <ScrollArea className={receipt.credit_note_history!.length > 3 ? "h-[150px]" : ""}>
                          <div className="space-y-0 relative">
                            {receipt.credit_note_history!
                              .filter(event => event.event !== 'received')
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
                                          className="ml-1 text-orange-600 hover:underline cursor-pointer font-medium"
                                        >
                                          ({event.credit_note_id})
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
