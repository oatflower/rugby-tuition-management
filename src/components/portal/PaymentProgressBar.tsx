import { useLanguage } from "@/contexts/LanguageContext";

interface PaymentProgressBarProps {
  currentStep: 1 | 2 | 3;
}

export const PaymentProgressBar = ({ currentStep }: PaymentProgressBarProps) => {
  const { language, t } = useLanguage();

  const getStepLabel = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return language === 'th' ? 'ตะกร้า' : 
               language === 'zh' ? '购物车' : 'Cart';
      case 2:
        return language === 'th' ? 'ชำระเงิน' : 
               language === 'zh' ? '支付' : 'Payment';
      case 3:
        return language === 'th' ? 'สำเร็จ' : 
               language === 'zh' ? '完成' : 'Success';
      default:
        return '';
    }
  };

  const steps = [
    { number: 1 },
    { number: 2 },
    { number: 3 }
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  step.number <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.number}
              </div>
              <span
                className={`mt-2 text-xs text-center ${
                  language === 'th' ? 'font-sukhumvit' : 
                  language === 'zh' ? 'font-noto-sc' : 'font-lato'
                } ${
                  step.number <= currentStep
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                {getStepLabel(step.number)}
              </span>
            </div>
            
            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 mt-[-20px]">
                <div
                  className={`h-full rounded ${
                    step.number < currentStep
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};