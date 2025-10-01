import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Download, ArrowLeft, Calendar, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface PaymentSuccessProps {
  studentName: string;
  paymentData: {
    receiptId: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    paymentType: string;
  };
  onBackToMain: () => void;
}

export const PaymentSuccess = ({ studentName, paymentData, onBackToMain }: PaymentSuccessProps) => {
  const { language, formatCurrency, t } = useLanguage();

  const formatDate = (dateString: string) => {
    const locale = language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };

  const handleDownloadReceipt = () => {
    toast({
      title: t('payment.downloadReceipt'),
      description: t('payment.downloadStarted'),
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="text-center">
        <CardContent className="pt-8 pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-finance-green/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-finance-green" />
            </div>
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('payment.success')}</h1>
          <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {t('payment.successMessage').replace('{studentName}', studentName)}
          </p>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <CreditCard className="h-5 w-5" />
            {t('payment.paymentDetails')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex justify-between items-center py-2 border-b border-muted">
              <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('payment.receiptNumber')}:</span>
              <Badge variant="outline" className={`font-mono ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {paymentData.receiptId}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-muted">
              <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('payment.amount')}:</span>
              <span className={`text-xl font-bold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {formatCurrency(paymentData.amount)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-muted">
              <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('payment.paymentDate')}:</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{formatDate(paymentData.paymentDate)}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-muted">
              <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('payment.paymentMethod')}:</span>
              <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{paymentData.paymentMethod}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('payment.paymentType')}:</span>
              <Badge variant="secondary" className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{paymentData.paymentType}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={handleDownloadReceipt}
          className={`flex-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
        >
          <Download className="h-4 w-4 mr-2" />
          {t('payment.downloadReceipt')}
        </Button>
        
        <Button 
          onClick={onBackToMain}
          className={`flex-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('payment.backToMain')}
        </Button>
      </div>
      
      {/* Additional Info */}
      <Card className="bg-muted/50">
        <CardContent className="pt-4">
          <p className={`text-sm text-muted-foreground text-center ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {t('payment.emailNotification')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};