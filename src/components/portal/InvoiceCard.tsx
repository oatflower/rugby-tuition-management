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


  return (
    <Card className={`relative ${isOverdue ? 'border-destructive/50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold text-base ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{invoice.description}</h3>
            </div>
            {studentName && (
              <p className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('portal.student')}: {studentName}
              </p>
            )}
            {invoice.term && (
              <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{invoice.term}</p>
            )}
          </div>
          
          <Badge className={`${statusConfig[invoice.status].color} ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {statusConfig[invoice.status].label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <Calendar className="h-4 w-4" />
            <span>{t('invoice.due')}: {formatDate(invoice.due_date)}</span>
            {isOverdue && <AlertCircle className="h-4 w-4 text-destructive" />}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('invoice.amountDue')}:</span>
            <span className={`text-lg font-bold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {formatCurrency(invoice.amount_due)}
            </span>
          </div>
        </div>

        {invoice.status !== 'paid' && (
          <div className="pt-2 space-y-2">
            
            <Button 
              className={`w-full ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
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