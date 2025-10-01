import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  QrCode,
  Building2,
  MessageCircle,
  Wallet,
  LoaderCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Clock
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PaymentProcessingProps {
  paymentMethod: {
    id: string;
    name: string;
    icon: any;
    fee: number;
    currency: string;
  };
  amount: number;
  onPaymentComplete: (success: boolean, paymentData?: any) => void;
  onCancel: () => void;
}

const paymentMethodIcons = {
  credit_card: CreditCard,
  promptpay: QrCode,
  wechat: MessageCircle,
  alipay: Wallet,
  bank_counter: Building2
};

export const PaymentProcessing = ({ 
  paymentMethod, 
  amount, 
  onPaymentComplete, 
  onCancel 
}: PaymentProcessingProps) => {
  const [step, setStep] = useState<'confirm' | 'processing' | 'success' | 'failed'>('confirm');
  const [countdown, setCountdown] = useState(10); // 10 seconds max
  const { language, formatCurrency, t } = useLanguage();

  const IconComponent = paymentMethodIcons[paymentMethod.id as keyof typeof paymentMethodIcons] || CreditCard;

  useEffect(() => {
    if (step === 'processing') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Always succeed after countdown for demo
            setStep('success');
            const paymentData = {
              receiptId: `RCP-${Date.now()}`,
              amount: amount,
              paymentDate: new Date().toISOString(),
              paymentMethod: language === 'th' ? paymentMethod.name :
                             language === 'zh' ? (paymentMethod.id === 'credit_card' ? '信用卡' :
                                                  paymentMethod.id === 'promptpay' ? 'PromptPay' :
                                                  paymentMethod.id === 'wechat' ? '微信支付' :
                                                  paymentMethod.id === 'alipay' ? '支付宝' :
                                                  paymentMethod.id === 'bank_counter' ? '银行账户' : paymentMethod.name) :
                             (paymentMethod.id === 'credit_card' ? 'Credit Card' :
                              paymentMethod.id === 'promptpay' ? 'PromptPay' :
                              paymentMethod.id === 'wechat' ? 'WeChat Pay' :
                              paymentMethod.id === 'alipay' ? 'Alipay' :
                              paymentMethod.id === 'bank_counter' ? 'Bank Account' : paymentMethod.name),
              type: 'activities'
            };
            onPaymentComplete(true, paymentData);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step, amount, onPaymentComplete, paymentMethod.name, t]);

  const handleConfirmPayment = () => {
    setStep('processing');
  };

  const formatTime = (seconds: number) => {
    return `${seconds.toString().padStart(2, '0')}`;
  };

  const renderPaymentMethodFlow = () => {
    switch (paymentMethod.id) {
      case 'credit_card':
        return (
          <div className="space-y-4">
            {step === 'confirm' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' ? 'กำลังเปลี่ยนเส้นทางไปยังระบบชำระเงิน...' : 
                   language === 'zh' ? '正在重定向到支付系统...' : 'Redirecting to payment system...'}
                </p>
              </div>
            )}
            {step === 'processing' && (
              <div className="text-center space-y-4">
                <LoaderCircle className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' ? 'กำลังดำเนินการ...' : 
                   language === 'zh' ? '处理中...' : 'Processing...'}
                </p>
                 <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                   {formatTime(countdown)} {language === 'th' ? 'วินาที' : language === 'zh' ? '秒' : 'seconds'}
                 </p>
              </div>
            )}
          </div>
        );

      case 'promptpay':
      case 'wechat':
      case 'alipay':
        return (
          <div className="space-y-4">
            {step === 'confirm' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' ? 'กรุณาสแกน QR Code เพื่อชำระเงิน' : 
                   language === 'zh' ? '请扫描二维码进行支付' : 'Please scan QR code to pay'}
                </p>
              </div>
            )}
            {step === 'processing' && (
              <div className="text-center space-y-4">
                <div className="w-32 h-32 bg-muted border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center mx-auto">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                </div>
                <p className={`font-bold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' ? 'สแกน QR Code' : 
                   language === 'zh' ? '扫描二维码' : 'Scan QR Code'}
                </p>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                   <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                     {formatTime(countdown)} {language === 'th' ? 'วินาที' : language === 'zh' ? '秒' : 'seconds'}
                   </span>
                </div>
                <div className="flex justify-center">
                  <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        );

      case 'bank_counter':
        return (
          <div className="space-y-4">
            {step === 'confirm' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {language === 'th' ? 'หมายเลขบัญชี' : language === 'zh' ? '账号' : 'Account Number'}: 123-456-7890
                  </p>
                  <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {language === 'th' ? 'ชื่อบัญชี' : language === 'zh' ? '账户名称' : 'Account Name'}: SISB School
                  </p>
                  <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {language === 'th' ? 'ธนาคาร' : language === 'zh' ? '银行' : 'Bank'}: {language === 'th' ? 'กสิกรไทย' : language === 'zh' ? '泰国开泰银行' : 'Kasikorn Bank'}
                  </p>
                </div>
              </div>
            )}
            {step === 'processing' && (
              <div className="text-center space-y-4">
                <LoaderCircle className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' ? 'กำลังตรวจสอบการชำระเงิน...' : 
                   language === 'zh' ? '正在检查付款...' : 'Checking payment...'}
                </p>
                 <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                   {formatTime(countdown)} {language === 'th' ? 'วินาที' : language === 'zh' ? '秒' : 'seconds'}
                 </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (step === 'success') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="w-16 h-16 bg-finance-green/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8 text-finance-green" />
          </div>
          <h3 className={`text-xl font-bold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {language === 'th' ? 'ชำระเงินสำเร็จ!' : language === 'zh' ? '支付成功！' : 'Payment Successful!'}
          </h3>
          <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {language === 'th' ? 'กำลังสร้างใบเสร็จรับเงิน...' : language === 'zh' ? '正在生成收据...' : 'Generating receipt...'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (step === 'failed') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <h3 className={`text-xl font-bold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {language === 'th' ? 'ชำระเงินไม่สำเร็จ' : language === 'zh' ? '支付失败' : 'Payment Failed'}
          </h3>
          <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {language === 'th' ? 'หมดเวลาการชำระเงิน กรุณาลองใหม่อีกครั้ง' : language === 'zh' ? '支付超时，请重试' : 'Payment timeout, please try again'}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === 'th' ? 'กลับ' : language === 'zh' ? '返回' : 'Back'}
            </Button>
            <Button onClick={() => setStep('confirm')} className="flex-1">
              {language === 'th' ? 'ลองใหม่' : language === 'zh' ? '重试' : 'Try Again'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className={`text-center ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
          {language === 'th' ? paymentMethod.name :
           language === 'zh' ? (paymentMethod.id === 'credit_card' ? '信用卡' :
                                paymentMethod.id === 'promptpay' ? 'PromptPay' :
                                paymentMethod.id === 'wechat' ? '微信支付' :
                                paymentMethod.id === 'alipay' ? '支付宝' :
                                paymentMethod.id === 'bank_counter' ? '银行账户' : paymentMethod.name) :
           (paymentMethod.id === 'credit_card' ? 'Credit Card' :
            paymentMethod.id === 'promptpay' ? 'PromptPay' :
            paymentMethod.id === 'wechat' ? 'WeChat Pay' :
            paymentMethod.id === 'alipay' ? 'Alipay' :
            paymentMethod.id === 'bank_counter' ? 'Bank Account' : paymentMethod.name)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderPaymentMethodFlow()}
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {language === 'th' ? 'จำนวนเงิน:' : language === 'zh' ? '金额:' : 'Amount:'}
            </span>
            <span className={`font-bold text-lg ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {formatCurrency(amount)}
            </span>
          </div>
        </div>

        {step === 'confirm' && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === 'th' ? 'กลับ' : language === 'zh' ? '返回' : 'Back'}
            </Button>
            <Button onClick={handleConfirmPayment} className="flex-1">
              {language === 'th' ? 'ยืนยันการชำระเงิน' : language === 'zh' ? '确认支付' : 'Confirm Payment'}
            </Button>
          </div>
        )}

        {step === 'processing' && (
          <Button variant="outline" onClick={onCancel} className="w-full">
            {language === 'th' ? 'ยกเลิก' : language === 'zh' ? '取消' : 'Cancel'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};