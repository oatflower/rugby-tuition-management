import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Receipt, CreditCard, DollarSign } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Receipt {
  id: string;
  invoice_id: string;
  student_id: number;
  studentName: string;
  year: string;
  amount: number;
  payment_method: 'credit_card' | 'bank_transfer' | 'cash';
  paid_at: string;
  receipt_url: string;
  status: 'completed' | 'processing' | 'failed';
  description: string;
  reference_number: string;
}

interface ReceiptListProps {
  receipts: Receipt[];
  onDownload?: (receiptId: string) => void;
}

export const ReceiptList = ({ receipts, onDownload }: ReceiptListProps) => {
  const { language, formatCurrency, t } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<string>("all");

  // Extract unique years and students for filters
  const years = Array.from(new Set(receipts.map(r => r.year))).sort((a, b) => b.localeCompare(a));
  const students = Array.from(new Set(receipts.map(r => ({ id: r.student_id, name: r.studentName }))))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Filter receipts based on selected year and student
  const filteredReceipts = receipts.filter(receipt => {
    const yearMatch = selectedYear === "all" || receipt.year === selectedYear;
    const studentMatch = selectedStudent === "all" || receipt.student_id.toString() === selectedStudent;
    return yearMatch && studentMatch;
  });

  const paymentMethodConfig = {
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
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {language === 'th' ? 'ปี:' : 'Year:'}
          </span>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="all">{language === 'th' ? 'ทั้งหมด' : 'All Years'}</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
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

        <div className={`text-sm text-muted-foreground ml-auto ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
          {language === 'th' ? `แสดง ${filteredReceipts.length} รายการจากทั้งหมด ${receipts.length}` : `Showing ${filteredReceipts.length} of ${receipts.length} receipts`}
        </div>
      </div>

      {filteredReceipts.length === 0 ? (
        <div className={`text-center py-8 text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
          <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{t('portal.noReceipts')}</p>
        </div>
      ) : (
        <div className="space-y-1">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground">
            <div className={`col-span-3 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {t('portal.receiptName')}
            </div>
            <div className={`col-span-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {language === 'th' ? 'นักเรียน' : 'Student'}
            </div>
            <div className={`col-span-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {t('portal.dateOfPurchase')}
            </div>
            <div className={`col-span-2 text-right ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {t('portal.amount')}
            </div>
            <div className={`col-span-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {t('portal.category')}
            </div>
            <div className="col-span-1"></div>
          </div>

          {/* Receipts */}
          {filteredReceipts.map((receipt) => {
        const PaymentIcon = paymentMethodConfig[receipt.payment_method].icon;
        const iconGradient = paymentMethodConfig[receipt.payment_method].gradient;

            return (
              <div
                key={receipt.id}
                className="grid grid-cols-12 gap-4 px-4 py-4 bg-card rounded-lg border hover:bg-accent/50 transition-colors"
              >
                {/* Receipt Name with Icon */}
                <div className="col-span-3 flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${iconGradient} flex-shrink-0`}>
                    <Receipt className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className={`font-semibold text-sm truncate ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                      {receipt.description}
                    </p>
                    <p className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                      Ref: {receipt.reference_number}
                    </p>
                  </div>
                </div>

                {/* Student Name */}
                <div className={`col-span-2 flex items-center text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  <Badge variant="secondary" className="font-medium">
                    {receipt.studentName}
                  </Badge>
                </div>

                {/* Date */}
                <div className={`col-span-2 flex items-center text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {formatDate(receipt.paid_at)}
                </div>

                {/* Amount */}
                <div className={`col-span-2 flex items-center justify-end text-sm font-semibold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {formatCurrency(receipt.amount)}
                </div>

                {/* Category (Payment Method) */}
                <div className="col-span-2 flex items-center">
                  <Badge 
                    variant="outline" 
                    className={`gap-1 ${
                      receipt.payment_method === 'credit_card' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                      receipt.payment_method === 'bank_transfer' ? 'border-green-200 text-green-700 bg-green-50' :
                      'border-gray-200 text-gray-700 bg-gray-50'
                    }`}
                  >
                    <PaymentIcon className="h-3 w-3" />
                    <span className={`text-xs ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                      {paymentMethodConfig[receipt.payment_method].label}
                    </span>
                  </Badge>
                </div>

                {/* Action */}
                <div className="col-span-1 flex items-center justify-end">
                  {receipt.status === 'completed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-primary/10"
                      onClick={() => onDownload?.(receipt.id)}
                      title={t('portal.downloadReceipt')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};