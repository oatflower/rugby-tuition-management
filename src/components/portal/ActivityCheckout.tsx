import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  CreditCard, 
  QrCode,
  Building2,
  Trash2,
  MessageCircle,
  Wallet
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PaymentProcessing } from "./PaymentProcessing";
import { PaymentProgressBar } from "./PaymentProgressBar";

interface ActivityCheckoutProps {
  items: Array<{
    id: string;
    name: string;
    price: number;
    type: 'course' | 'summer';
  }>;
  creditBalance: number;
  onPaymentSuccess: (paymentData: any) => void;
  onCancel: () => void;
  onRemoveItem: (itemId: string) => void;
}

const paymentMethods = [
  { id: 'credit_card', name: 'บัตรเครดิต', icon: CreditCard, fee: 2.9, currency: '%' },
  { id: 'promptpay', name: 'พร้อมเพย์', icon: QrCode, fee: 0, currency: '฿' },
  { id: 'wechat', name: 'WeChat Pay', icon: MessageCircle, fee: 1.5, currency: '%' },
  { id: 'alipay', name: 'Alipay', icon: Wallet, fee: 1.5, currency: '%' },
  { id: 'bank_counter', name: 'บัญชีธนาคาร', icon: Building2, fee: 25, currency: '฿' }
];

export const ActivityCheckout = ({ 
  items, 
  creditBalance, 
  onPaymentSuccess, 
  onCancel,
  onRemoveItem 
}: ActivityCheckoutProps) => {
  const [useCreditNote, setUseCreditNote] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0]);
  const [showPaymentProcessing, setShowPaymentProcessing] = useState(false);
  const { language, formatCurrency, t } = useLanguage();

  // Calculate amounts
  const subtotalAmount = items.reduce((sum, item) => sum + item.price, 0);
  const creditApplied = useCreditNote ? Math.min(creditBalance, subtotalAmount) : 0;
  const amountAfterCredit = subtotalAmount - creditApplied;
  
  const paymentFee = selectedPaymentMethod.currency === '%' 
    ? amountAfterCredit * (selectedPaymentMethod.fee / 100)
    : selectedPaymentMethod.fee;
  
  const totalAmount = amountAfterCredit + paymentFee;

  const handlePayment = () => {
    setShowPaymentProcessing(true);
  };

  const handlePaymentComplete = (success: boolean, paymentData?: any) => {
    if (success && paymentData) {
      const completePaymentData = {
        ...paymentData,
        items: items,
        subtotalAmount,
        creditApplied,
        paymentFee,
        studentName: language === 'th' ? "นักเรียน" : 
                     language === 'zh' ? "学生" : 
                     "Student" // This should come from props in real implementation
      };
      onPaymentSuccess(completePaymentData);
    }
  };

  const handleBackFromPayment = () => {
    setShowPaymentProcessing(false);
  };

  if (showPaymentProcessing) {
    return (
      <div className="max-w-4xl mx-auto">
        <PaymentProgressBar currentStep={2} />
        <PaymentProcessing
          paymentMethod={selectedPaymentMethod}
          amount={totalAmount}
          onPaymentComplete={handlePaymentComplete}
          onCancel={handleBackFromPayment}
        />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.cartEmpty')}</p>
          <Button onClick={onCancel} className={`mt-4 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {t('portal.backToActivities')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PaymentProgressBar currentStep={2} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Payment Method Selection Only */}
        <div className="lg:col-span-2 space-y-8">
          {/* Payment Method Selection */}
          <div className="space-y-4">
            <h2 className={`text-2xl font-bold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {t('processing.selectPayment')}
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
                      {language === 'th' ? method.name :
                       language === 'zh' ? (method.id === 'credit_card' ? '信用卡' :
                                          method.id === 'promptpay' ? 'PromptPay' :
                                          method.id === 'wechat' ? '微信支付' :
                                          method.id === 'alipay' ? '支付宝' :
                                          method.id === 'bank_counter' ? '银行账户' : method.name) :
                       (method.id === 'credit_card' ? 'Credit Card' :
                        method.id === 'promptpay' ? 'PromptPay' :
                        method.id === 'wechat' ? 'WeChat Pay' :
                        method.id === 'alipay' ? 'Alipay' :
                        method.id === 'bank_counter' ? 'Bank Account' : method.name)}
                    </span>
                    <div className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                      {method.fee === 0 ? t('portal.free') : `+${method.fee}${method.currency}`}
                    </div>
                  </div>
                </div>
              ))}
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
                  <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.subtotal')} ({items.length} {t('portal.items')})</span>
                  <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{formatCurrency(subtotalAmount)}</span>
                </div>
                
                {creditApplied > 0 && (
                  <div className="flex justify-between text-finance-green">
                    <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.creditNoteApplied')}</span>
                    <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>-{formatCurrency(creditApplied)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.paymentFee')} ({language === 'th' ? selectedPaymentMethod.name :
                       language === 'zh' ? (selectedPaymentMethod.id === 'credit_card' ? '信用卡' :
                                          selectedPaymentMethod.id === 'promptpay' ? 'PromptPay' :
                                          selectedPaymentMethod.id === 'wechat' ? '微信支付' :
                                          selectedPaymentMethod.id === 'alipay' ? '支付宝' :
                                          selectedPaymentMethod.id === 'bank_counter' ? '银行账户' : selectedPaymentMethod.name) :
                       (selectedPaymentMethod.id === 'credit_card' ? 'Credit Card' :
                        selectedPaymentMethod.id === 'promptpay' ? 'PromptPay' :
                        selectedPaymentMethod.id === 'wechat' ? 'WeChat Pay' :
                        selectedPaymentMethod.id === 'alipay' ? 'Alipay' :
                        selectedPaymentMethod.id === 'bank_counter' ? 'Bank Account' : selectedPaymentMethod.name)})</span>
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
    </div>
  );
};