import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface InvoiceCardProps {
  invoice: {
    id: string;
    type: 'Yearly' | 'Termly' | 'Monthly';
    amount_due: number;
    due_date: string;
    status: 'pending' | 'overdue' | 'paid' | 'partial';
    description: string;
    term?: string;
    student_id?: number;
  };
  onAddToCart?: (invoiceId: string) => void;
  studentName?: string;
}

export const InvoiceCard = ({ invoice, onAddToCart, studentName }: InvoiceCardProps) => {
  const isOverdue = new Date(invoice.due_date) < new Date() && invoice.status !== 'paid';
  const { language, formatCurrency, t } = useLanguage();
  
  const statusConfig = {
    pending: { label: t('invoice.pending'), color: 'bg-warning-orange/20 text-warning-orange' },
    overdue: { label: t('invoice.overdue'), color: 'bg-destructive/20 text-destructive' },
    paid: { label: t('invoice.paid'), color: 'bg-finance-green/20 text-finance-green' },
    partial: { label: t('invoice.partial'), color: 'bg-info-cyan/20 text-info-cyan' },
  };

  const formatDate = (dateString: string) => {
    const locale = language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };


  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  return (
    <Card className={`relative ${isOverdue ? 'border-destructive/50' : ''}`}>
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-start justify-between sm:justify-start gap-2">
              <h3 className={`font-semibold text-sm sm:text-base ${fontClass}`}>{invoice.description}</h3>
              <Badge className={`${statusConfig[invoice.status].color} ${fontClass} flex-shrink-0 sm:hidden text-[10px]`}>
                {statusConfig[invoice.status].label}
              </Badge>
            </div>
            {studentName && (
              <p className={`text-xs text-muted-foreground ${fontClass}`}>
                {t('portal.student')}: {studentName}
                {invoice.student_id && ` (ID: ${invoice.student_id})`}
              </p>
            )}
          </div>
          
          <Badge className={`${statusConfig[invoice.status].color} ${fontClass} hidden sm:inline-flex`}>
            {statusConfig[invoice.status].label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <div className={`flex items-center gap-2 text-xs sm:text-sm text-muted-foreground ${fontClass}`}>
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span>{t('invoice.due')}: {formatDate(invoice.due_date)}</span>
            {isOverdue && <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive" />}
          </div>
          
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <span className={`font-medium text-xs sm:text-sm ${fontClass} sm:hidden`}>{t('invoice.amountDue')}:</span>
            <span className={`text-lg sm:text-xl font-bold text-primary ${fontClass}`}>
              {formatCurrency(invoice.amount_due)}
            </span>
          </div>
        </div>

        {/* Desktop amount display */}
        <div className="hidden sm:block space-y-2">
          <div className="flex items-center justify-between">
            <span className={`font-medium ${fontClass}`}>{t('invoice.amountDue')}:</span>
            <span className={`text-lg font-bold text-primary ${fontClass}`}>
              {formatCurrency(invoice.amount_due)}
            </span>
          </div>
        </div>

        {invoice.status !== 'paid' && (
          <div className="pt-1 sm:pt-2">
            <Button 
              className={`w-full h-11 sm:h-10 text-sm sm:text-base touch-manipulation ${fontClass}`}
              onClick={() => onAddToCart?.(invoice.id)}
              variant={isOverdue ? "destructive" : "default"}
            >
              <span className="mr-2 font-bold">฿</span>
              {language === 'th' ? 'เพิ่มเข้าตะกร้า' : language === 'zh' ? '加入购物车' : 'Add to Cart'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};