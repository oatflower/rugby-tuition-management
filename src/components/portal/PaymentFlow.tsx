import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  DollarSign, 
  CreditCard, 
  QrCode,
  Building2,
  AlertCircle,
  CheckCircle,
  MessageCircle,
  Wallet
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PaymentFlowProps {
  invoice: {
    id: string;
    type: 'Yearly' | 'Termly' | 'Monthly';
    amount_due: number;
    due_date: string;
    status: 'pending' | 'overdue' | 'paid' | 'partial';
    description: string;
    term?: string;
  };
  creditBalance: number;
  onPaymentSuccess: (paymentData: any) => void;
  onCancel: () => void;
}

const paymentMethods = [
  { id: 'credit_card', name: 'payment.creditCard', icon: CreditCard, fee: 2.9, currency: '%' },
  { id: 'promptpay', name: 'payment.promptPay', icon: QrCode, fee: 0, currency: '฿', noFee: true },
  { id: 'wechat', name: 'payment.wechatPay', icon: MessageCircle, fee: 1.5, currency: '%' },
  { id: 'alipay', name: 'payment.alipay', icon: Wallet, fee: 1.5, currency: '%' }
];

export const PaymentFlow = ({ invoice, creditBalance, onPaymentSuccess, onCancel }: PaymentFlowProps) => {
  const [isYearly, setIsYearly] = useState(invoice.type === 'Yearly');
  const [useCreditNote, setUseCreditNote] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0]);
  const { language, formatCurrency, t } = useLanguage();

  // Calculate amounts
  const baseAmount = isYearly ? invoice.amount_due * 3 : invoice.amount_due; // Assuming yearly is 3x termly
  const creditApplied = useCreditNote ? Math.min(creditBalance, baseAmount) : 0;
  const subtotal = baseAmount - creditApplied;
  
  const paymentFee = selectedPaymentMethod.currency === '%' 
    ? subtotal * (selectedPaymentMethod.fee / 100)
    : selectedPaymentMethod.fee;
  
  const totalAmount = subtotal + paymentFee;


  const handlePayment = () => {
    const paymentData = {
      invoiceId: invoice.id,
      receiptId: `RCP-${Date.now()}`,
      amount: totalAmount,
      baseAmount,
      creditApplied,
      paymentFee,
      paymentMethod: t(selectedPaymentMethod.name),
      paymentType: isYearly ? 'Yearly' : 'Termly',
      paymentDate: new Date().toISOString()
    };
    
    onPaymentSuccess(paymentData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {/* Left Column - Payment Options */}
      <div className="lg:col-span-2 space-y-8">
        <Card className="border-none shadow-none bg-transparent p-0">
          <CardContent className="p-0 space-y-8">
            {/* Payment Type Toggle */}
            <div className="space-y-4">
              <h2 className={`text-2xl font-bold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('portal.paymentPeriod')}
              </h2>
              <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                <Label htmlFor="yearly-toggle" className={`${!isYearly ? "text-muted-foreground" : ""} ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {t('portal.termly')}
                </Label>
                <Switch
                  id="yearly-toggle"
                  checked={isYearly}
                  onCheckedChange={setIsYearly}
                />
                <Label htmlFor="yearly-toggle" className={`${isYearly ? "" : "text-muted-foreground"} ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {t('portal.yearly')}
                </Label>
              </div>
            </div>

            {/* Credit Note Application */}
            {creditBalance > 0 && (
              <div className="space-y-4">
                <h2 className={`text-2xl font-bold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {t('portal.applyCreditNote')}
                </h2>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="credit-toggle"
                      checked={useCreditNote}
                      onCheckedChange={setUseCreditNote}
                    />
                    <div>
                      <Label htmlFor="credit-toggle" className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.useCreditNote')}</Label>
                      <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {t('portal.available')}: {formatCurrency(creditBalance)}
                      </p>
                    </div>
                  </div>
                  {useCreditNote && (
                    <Badge variant="outline" className={`bg-finance-green/20 text-finance-green ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                      -{formatCurrency(creditApplied)}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h2 className={`text-2xl font-bold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('portal.paymentMethod')}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-6 rounded-lg cursor-pointer transition-all text-center border-2 ${
                      selectedPaymentMethod.id === method.id
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-muted/20 hover:border-muted/40 hover:bg-muted/10'
                    }`}
                    onClick={() => setSelectedPaymentMethod(method)}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <method.icon className="h-8 w-8" />
                      <span className={`font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {t(method.name)}
                      </span>
                      <div className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {method.fee === 0 ? t('portal.noFees') : `+${method.fee}${method.currency}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Payment Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.paymentSummary')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{isYearly ? t('portal.yearly').split(' ')[0] : t('portal.termly')} {t('portal.tuitionFee')}</span>
                <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{formatCurrency(baseAmount)}</span>
              </div>
              
              {creditApplied > 0 && (
                <div className="flex justify-between text-finance-green">
                  <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.creditNoteApplied')}</span>
                  <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>-{formatCurrency(creditApplied)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.paymentFee')} ({t(selectedPaymentMethod.name)})</span>
                <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{formatCurrency(paymentFee)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.totalAmount')}</span>
                <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button onClick={handlePayment} size="lg" className={`w-full ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                <CreditCard className="h-4 w-4 mr-2" />
                {t('portal.pay')} {formatCurrency(totalAmount)}
              </Button>
              <Button variant="outline" onClick={onCancel} className={`w-full ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('portal.cancel')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};