import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Smartphone, QrCode } from "lucide-react";

const paymentMethods = [
  {
    id: 'credit-card',
    title: 'Credit Card',
    description: 'Visa, MasterCard, JCB',
    icon: CreditCard,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'wechat',
    title: 'WeChat Pay',
    description: 'Quick mobile payment',
    icon: Smartphone,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'alipay',
    title: 'Alipay',
    description: 'Secure digital wallet',
    icon: Smartphone,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'bbl-app',
    title: 'BBL App',
    description: 'Bangkok Bank Mobile Banking',
    icon: Smartphone,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'promptpay',
    title: 'PromptPay',
    description: 'QR code payment',
    icon: QrCode,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

export const PaymentMethods = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Flexible Payment Options</h2>
          <p className="text-muted-foreground text-lg">
            Choose from multiple secure payment methods for your convenience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <Card 
                key={method.id} 
                className="gradient-card shadow-card hover:shadow-hover transition-smooth transform hover:scale-105 cursor-pointer"
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 rounded-full ${method.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className={`h-8 w-8 ${method.color}`} />
                  </div>
                  <CardTitle className="text-lg">{method.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <CardDescription className="text-sm">
                    {method.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
