import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, DollarSign, CreditCard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Receipt {
  id: string;
  invoice_id: string;
  amount: number;
  payment_method: 'credit_card' | 'bank_transfer' | 'cash';
  paid_at: string;
  receipt_url: string;
  status: 'completed' | 'processing' | 'failed';
  description: string;
  reference_number: string;
}

interface ReceiptCardProps {
  receipt: Receipt;
  onDownload?: (receiptId: string) => void;
}

export const ReceiptCard = ({ receipt, onDownload }: ReceiptCardProps) => {
  const { language } = useLanguage();
  const paymentMethodConfig = {
    credit_card: { label: 'Credit Card', icon: CreditCard, color: 'bg-primary/20 text-primary' },
    bank_transfer: { label: 'Bank Transfer', icon: DollarSign, color: 'bg-finance-green/20 text-finance-green' },
    cash: { label: 'Cash', icon: DollarSign, color: 'bg-warning-orange/20 text-warning-orange' },
  };

  const statusConfig = {
    completed: { label: 'Completed', color: 'bg-finance-green/20 text-finance-green' },
    processing: { label: 'Processing', color: 'bg-warning-orange/20 text-warning-orange' },
    failed: { label: 'Failed', color: 'bg-destructive/20 text-destructive' },
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const { formatCurrency } = useLanguage();

  const PaymentIcon = paymentMethodConfig[receipt.payment_method].icon;

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className={`font-semibold text-base ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{receipt.description}</h3>
            <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              Ref: {receipt.reference_number}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Badge className={statusConfig[receipt.status].color}>
              {statusConfig[receipt.status].label}
            </Badge>
            <span className={`text-lg font-bold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {formatCurrency(receipt.amount)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className={`flex items-center gap-2 text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <Calendar className="h-4 w-4" />
            <span>{formatDate(receipt.paid_at)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <PaymentIcon className="h-4 w-4" />
            <Badge variant="outline" className={paymentMethodConfig[receipt.payment_method].color}>
              {paymentMethodConfig[receipt.payment_method].label}
            </Badge>
          </div>
        </div>

        {receipt.status === 'completed' && (
          <div className="pt-2">
            <Button 
              variant="outline" 
              className={`w-full gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              onClick={() => onDownload?.(receipt.id)}
            >
              <Download className="h-4 w-4" />
              Download Receipt PDF
            </Button>
          </div>
        )}

        {receipt.status === 'processing' && (
          <div className={`text-sm text-muted-foreground bg-muted/50 p-3 rounded ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <p>Payment is being processed. Receipt will be available once completed.</p>
          </div>
        )}

        {receipt.status === 'failed' && (
          <div className={`text-sm text-destructive bg-destructive/10 p-3 rounded ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <p>Payment failed. Please contact support if you believe this is an error.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};