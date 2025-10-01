import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Download, ArrowLeft, Calendar, CreditCard, ShoppingBag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { PaymentProgressBar } from "./PaymentProgressBar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface ActivityPaymentSuccessProps {
  studentName: string;
  paymentData: {
    receiptId: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    items: Array<{
      id: string;
      name: string;
      price: number;
      type: 'course' | 'summer';
    }>;
    type: string;
  };
  onBackToMain: () => void;
  onBackToCart?: () => void;
}

export const ActivityPaymentSuccess = ({ studentName, paymentData, onBackToMain, onBackToCart }: ActivityPaymentSuccessProps) => {
  const { t, language, formatCurrency } = useLanguage();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };

  const handleDownloadReceipt = () => {
    toast({
      title: language === 'th' ? 'ดาวน์โหลดใบเสร็จ' : language === 'zh' ? '下载收据' : 'Download Receipt',
      description: language === 'th' ? 'เริ่มดาวน์โหลดแล้ว' : language === 'zh' ? '下载已开始' : 'Download started',
    });
  };

  const getActivityTypeText = () => {
    const courseCount = paymentData.items.filter(item => item.type === 'course').length;
    const summerCount = paymentData.items.filter(item => item.type === 'summer').length;
    
    if (courseCount > 0 && summerCount > 0) {
      return language === 'th' ? "กิจกรรมหลังเลิกเรียนและกิจกรรมช่วงปิดเทอม" :
             language === 'zh' ? "课后活动和夏令营活动" : "After School and Summer Activities";
    } else if (courseCount > 0) {
      return language === 'th' ? "กิจกรรมหลังเลิกเรียน" :
             language === 'zh' ? "课后活动" : "After School Activities";
    } else {
      return language === 'th' ? "กิจกรรมช่วงปิดเทอม" :
             language === 'zh' ? "夏令营活动" : "Summer Activities";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={onBackToMain}
                className={`cursor-pointer ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              >
                {language === 'th' ? 'แดชบอร์ด' : language === 'zh' ? '仪表板' : 'Dashboard'}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={onBackToCart || onBackToMain}
                className={`cursor-pointer ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              >
                {language === 'th' ? 'ตะกร้า' : language === 'zh' ? '购物车' : 'Cart'}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                {language === 'th' ? 'สำเร็จ' : language === 'zh' ? '完成' : 'Complete'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-2xl mx-auto space-y-6">
          <PaymentProgressBar currentStep={3} />
      
      {/* Success Header */}
      <Card className="text-center">
        <CardContent className="pt-8 pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-finance-green/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-finance-green" />
            </div>
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {language === 'th' ? 'ชำระเงินสำเร็จ!' : language === 'zh' ? '支付成功！' : 'Payment Complete!'}
          </h1>
          <p className={`text-lg mb-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {language === 'th' ? 'ขอบคุณสำหรับการชำระเงิน' : language === 'zh' ? '感谢您的付款' : 'Thank you for your payment'}
          </p>
          <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {language === 'th' ? 'การลงทะเบียนเสร็จสิ้น' : language === 'zh' ? '注册完成' : 'Registration Complete'} {studentName} - {getActivityTypeText()}
          </p>
        </CardContent>
      </Card>

      {/* Registered Activities */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <ShoppingBag className="h-5 w-5" />
            {language === 'th' ? 'กิจกรรมที่ลงทะเบียน' : language === 'zh' ? '已注册活动' : 'Registered Activities'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {paymentData.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <h4 className={`font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{item.name}</h4>
                <Badge variant="outline" className={`text-xs mt-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {item.type === 'course' ? 
                    (language === 'th' ? 'หลังเลิกเรียน' : language === 'zh' ? '课后活动' : 'After School') : 
                    (language === 'th' ? 'ช่วงปิดเทอม' : language === 'zh' ? '夏令营' : 'Summer')}
                </Badge>
              </div>
              <span className={`font-bold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{formatCurrency(item.price)}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <CreditCard className="h-5 w-5" />
            {language === 'th' ? 'รายละเอียดการชำระเงิน' : language === 'zh' ? '支付详情' : 'Payment Details'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex justify-between items-center py-2 border-b border-muted">
              <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' ? 'หมายเลขใบเสร็จ:' : language === 'zh' ? '收据号码:' : 'Receipt Number:'}
              </span>
              <Badge variant="outline" className={`font-mono ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {paymentData.receiptId}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-muted">
              <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' ? 'จำนวนเงิน:' : language === 'zh' ? '支付金额:' : 'Payment Amount:'}
              </span>
              <span className={`text-xl font-bold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {formatCurrency(paymentData.amount)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-muted">
              <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' ? 'วันที่ชำระเงิน:' : language === 'zh' ? '支付日期:' : 'Payment Date:'}
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{formatDate(paymentData.paymentDate)}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' ? 'วิธีชำระเงิน:' : language === 'zh' ? '支付方式:' : 'Payment Method:'}
              </span>
              <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{paymentData.paymentMethod}</span>
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
          {language === 'th' ? 'ดาวน์โหลด PDF' : language === 'zh' ? '下载 PDF' : 'Download PDF'}
        </Button>
        
        <Button 
          onClick={onBackToMain}
          className={`flex-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === 'th' ? 'กลับหน้าหลัก' : language === 'zh' ? '返回主页' : 'Back to Main'}
        </Button>
      </div>
      
      {/* Additional Info */}
      <Card className="bg-muted/50">
        <CardContent className="pt-4">
          <p className={`text-sm text-muted-foreground text-center ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {language === 'th' ? 'ใบเสร็จรับเงินและการยืนยันได้ส่งไปยังอีเมลของคุณแล้ว' : 
             language === 'zh' ? '收据和确认信息已发送到您的邮箱' : 
             'Receipt and confirmation have been sent to your email'}
          </p>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
};