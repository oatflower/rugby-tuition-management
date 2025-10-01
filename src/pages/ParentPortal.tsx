import { useState } from "react";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { ChildrenOverview } from "@/components/portal/ChildrenOverview";
import { SummaryBox } from "@/components/portal/SummaryBox";
import { InvoiceCard } from "@/components/portal/InvoiceCard";
import { TuitionCartSidebar } from "@/components/portal/TuitionCartSidebar";
import { ReceiptList } from "@/components/portal/ReceiptList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Calendar, 
  MapPin, 
  Users,
  DollarSign,
  CreditCard,
  GraduationCap,
  Receipt,
  AlertCircle,
  ChevronDown
} from "lucide-react";
import { mockStudents, getMockDataForStudent, mockInvoices, mockCreditNotes, mockReceipts, campusList, mandatoryCourses } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ParentPortalProps {
  onLogout: () => void;
  onGoToCart: () => void;
  onGoToCheckout: (data: any) => void;
  cartItems: any[];
  onAddToCart: (item: any) => boolean;
  onRemoveFromCart: (itemId: string, studentId?: string) => void;
  isInCart: (itemId: string, studentId?: string) => boolean;
  showCountdown?: boolean;
  onCountdownExpired?: () => void;
  onCancelCountdown?: () => void;
}

export const ParentPortal = ({ 
  onLogout, 
  onGoToCart, 
  onGoToCheckout, 
  cartItems, 
  onAddToCart, 
  onRemoveFromCart, 
  isInCart,
  showCountdown = false,
  onCountdownExpired,
  onCancelCountdown
}: ParentPortalProps) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tuition' | 'receipts'>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<string>(mockStudents[0]?.id.toString() || '1');
  const [currentCampus, setCurrentCampus] = useState<string>(mockStudents[0]?.campus || 'Pracha Uthit');
  const [paymentPeriod, setPaymentPeriod] = useState<'Yearly' | 'Termly'>('Yearly');
  
  const { t, language, formatCurrency } = useLanguage();

  // Count course items in cart (excluding tuition)
  const courseItemsCount = cartItems.filter(item => item.type === 'course' || item.type === 'activity').length;
  
  // Get combined data for all students
  const allInvoices = mockInvoices;
  const allCreditNotes = mockCreditNotes;
  const allReceipts = mockReceipts;
  
  // Calculate combined statistics
  const stats = {
    outstandingInvoices: allInvoices.filter(inv => inv.status === 'pending').length,
    paidThisTerm: allInvoices.filter(inv => inv.status === 'paid').length,
    creditBalance: allCreditNotes.reduce((sum, cn) => sum + cn.balance, 0),
    availableCourses: 15,
  };
  
  const outstandingAmount = allInvoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount_due, 0);
    
  const paidThisTerm = allReceipts
    .filter(rec => rec.status === 'completed')
    .reduce((sum, rec) => sum + rec.amount, 0);
    
  const overdueCount = 0;

  const handleAddToCart = (itemId: string, type: 'course' | 'activity' | 'tuition', studentId?: string) => {
    let item: any;
    let studentInfo: { studentId?: string; studentName?: string } = {};
    
    if (type === 'tuition') {
      const invoice = mockInvoices.find(inv => inv.id === itemId);
      if (!invoice) return;
      
      // Find student info for tuition
      const student = mockStudents.find(s => s.id === invoice.student_id);
      if (student) {
        // Check campus validation
        if (cartItems.length > 0 && student.campus !== currentCampus) {
          toast({
            title: t('portal.campusMismatch') || 'Campus Mismatch',
            description: t('portal.campusMismatchDesc') || `Please switch to ${student.campus} campus or clear your cart`,
            variant: "destructive",
            duration: 4000,
          });
          return;
        }
        studentInfo = { studentId: student.id.toString(), studentName: student.name };
      }
      
      item = {
        id: itemId,
        name: invoice.description,
        price: invoice.amount_due,
        type,
        ...studentInfo
      };
    } else {
      const studentData = getMockDataForStudent(parseInt(studentId || selectedStudent));
      
      // Check if it's from courses (after-school) or summer activities
      let course = studentData.courses.find(c => c.id === itemId);
      let category = 'after-school';
      
      if (!course) {
        course = studentData.summerActivities.find(c => c.id === itemId);
        category = 'summer';
      }
      
      if (!course) return;
      
      // Find student info for courses
      const currentStudent = mockStudents.find(s => s.id.toString() === studentId);
      if (currentStudent) {
        // Check campus validation
        if (cartItems.length > 0 && currentStudent.campus !== currentCampus) {
          toast({
            title: t('portal.campusMismatch') || 'Campus Mismatch',
            description: t('portal.campusMismatchDesc') || `Please switch to ${currentStudent.campus} campus or clear your cart`,
            variant: "destructive",
            duration: 4000,
          });
          return;
        }
        studentInfo = { studentId: currentStudent.id.toString(), studentName: currentStudent.name };
      }
      
      item = {
        id: itemId,
        name: course.name,
        price: course.price,
        type,
        category,
        ...studentInfo
      };
    }
    
    const success = onAddToCart(item);
    if (success) {
      toast({
        title: `${item.name} ${t('portal.addedToCart')}`,
        description: `${item.studentName || ''} - ${t('portal.courseSelected')}`,
        duration: 2000,
      });
    }
  };

  const handleStudentChange = (student: typeof mockStudents[0]) => {
    setSelectedStudent(student.id.toString());
    setCurrentCampus(student.campus);
  };

  const handleRemoveFromCart = (itemId: string, studentId?: string) => {
    onRemoveFromCart(itemId, studentId);
  };

  const handleGoToCart = () => {
    onGoToCart();
  };

  const handleDownloadReceipt = (receiptId: string) => {
    // TODO: Implement PDF download
    toast({
      title: t('payment.downloadReceipt'),
      description: t('payment.downloadStarted'),
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
        <PortalHeader 
          onLogout={onLogout} 
          activeTab={activeTab}
          onTabChange={(tab: string) => setActiveTab(tab as 'dashboard' | 'tuition' | 'receipts')}
          cartItemCount={cartItems.length}
          onGoToCart={handleGoToCart}
          showCountdown={showCountdown}
          onCountdownExpired={onCountdownExpired}
          onCancelCountdown={onCancelCountdown}
          additionalCourses={courseItemsCount}
        />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Campus Overview Banner with Student Switcher */}
        <div className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-primary/10 to-education-blue/5 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className={`text-lg sm:text-xl font-bold truncate ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {language === 'th' ? campusList.find(c => c.nameEn === currentCampus)?.name : currentCampus} Campus
                  </h2>
                </div>
                
                {/* Student Switcher Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
                      <div className="flex items-center gap-2">
                        <p className={`text-muted-foreground text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          {mockStudents
                            .filter(s => s.campus === currentCampus)
                            .map((s, idx) => `${idx + 1}. ${s.name}`)
                            .join(', ')}
                        </p>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[280px]">
                    <DropdownMenuLabel className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                      {language === 'th' ? 'เลือกนักเรียน / Campus' : 'Select Student / Campus'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {mockStudents.map((student, index) => (
                      <DropdownMenuItem
                        key={student.id}
                        onClick={() => handleStudentChange(student)}
                        className={`cursor-pointer ${student.campus === currentCampus ? 'bg-primary/5' : ''}`}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <span className="text-lg">{student.avatar}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {index + 1}. {student.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {student.class}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {language === 'th' ? campusList.find(c => c.nameEn === student.campus)?.name : student.campus}
                              </span>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <ChildrenOverview />
          </div>
          {cartItems.length > 0 && (
            <div className="mt-2 p-2 bg-primary/5 rounded-md">
              <p className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' 
                  ? `📌 ตอนนี้คุณกำลังเพิ่มรายการสำหรับ ${currentCampus} Campus เท่านั้น หากต้องการเปลี่ยน Campus กรุณาเปลี่ยนนักเรียน`
                  : `📌 Currently adding items for ${currentCampus} Campus only. Switch student to change campus.`}
              </p>
            </div>
          )}
        </div>


        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'dashboard' | 'tuition' | 'receipts')} className="space-y-6">
          {/* Desktop Navigation - Tabs */}
          <TabsList className="hidden md:grid w-full grid-cols-3 gap-1">
            <TabsTrigger value="dashboard" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              <GraduationCap className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t('portal.dashboard')}</span>
            </TabsTrigger>
            <TabsTrigger value="tuition" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              <DollarSign className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t('portal.tuition')}</span>
            </TabsTrigger>
            <TabsTrigger value="receipts" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              <Receipt className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t('portal.receipts')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab - Combined data for all students with student tags */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Summary Stats - Combined across all students */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <SummaryBox
                title={t('portal.outstandingInvoices')}
                value={formatCurrency(outstandingAmount)}
                subtitle={`${allInvoices.filter(i => i.status === 'pending').length} ${t('portal.pending')}`}
                icon={DollarSign}
                color={overdueCount > 0 ? 'destructive' : 'warning'}
                onClick={() => setActiveTab('tuition')}
              />
              
              <SummaryBox
                title={t('portal.paidThisTerm')}
                value={formatCurrency(paidThisTerm)}
                subtitle={t('portal.completedPayments')}
                icon={CreditCard}
                color="success"
                onClick={() => setActiveTab('tuition')}
              />
              
              <SummaryBox
                title={language === 'th' ? 'ใบลดหนี้' : 'Credit Note'}
                value={formatCurrency(stats.creditBalance)}
                subtitle={t('portal.availableCredit')}
                icon={Receipt}
                color="info"
                onClick={() => setActiveTab('tuition')}
              />
            </div>

            {/* Upcoming Deadlines - Combined with student identification */}
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  <AlertCircle className="h-5 w-5" />
                  {t('portal.upcomingDeadlines')}
                </CardTitle>
                <CardDescription className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                  {t('portal.importantDates')} {t('portal.allStudents')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allInvoices
                    .filter(inv => inv.status === 'pending')
                    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                    .slice(0, 5)
                    .map(invoice => {
                      const student = mockStudents.find(s => s.id === invoice.student_id);
                      return (
                        <div key={invoice.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted/50 rounded-lg gap-2">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className={`font-medium text-sm sm:text-base truncate ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {invoice.description}
                              </p>
                              <p className={`text-xs sm:text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {student?.name} • {t('portal.due')}: {new Date(invoice.due_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant="default" className="self-start sm:self-center">
                            {formatCurrency(invoice.amount_due)}
                          </Badge>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tuition Tab - Split into 70% invoice list and 30% cart */}
          <TabsContent value="tuition" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
              {/* Left 70% - Invoice List */}
              <div className="lg:col-span-7 space-y-4">
                {/* Payment Period Selector */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <Label className={`text-base font-semibold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {language === 'th' ? 'เลือกรูปแบบการชำระเงิน' : language === 'zh' ? '选择付款方式' : 'Select Payment Period'}
                      </Label>
                      <RadioGroup 
                        value={paymentPeriod} 
                        onValueChange={(value) => setPaymentPeriod(value as 'Yearly' | 'Termly')}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Yearly" id="yearly" />
                          <Label htmlFor="yearly" className={`cursor-pointer ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                            {language === 'th' ? 'รายปี' : language === 'zh' ? '年度' : 'Yearly'}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Termly" id="termly" />
                          <Label htmlFor="termly" className={`cursor-pointer ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                            {language === 'th' ? 'รายเทอม' : language === 'zh' ? '学期' : 'Termly'}
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>

                {allInvoices.filter(invoice => invoice.type === paymentPeriod).map(invoice => {
                  const student = mockStudents.find(s => s.id === invoice.student_id);
                  const creditNote = allCreditNotes.find(cn => cn.student_id === invoice.student_id);
                  return (
                    <div key={invoice.id} className="space-y-2">
                      {/* Student identification tag */}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          {student?.name} - {student?.class}
                        </Badge>
                      </div>
                      <InvoiceCard
                        invoice={invoice}
                        creditBalance={creditNote?.balance || 0}
                        onAddToCart={(invoiceId) => handleAddToCart(invoiceId, 'tuition')}
                        studentName={student?.name}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Right 30% - Tuition Cart Sidebar */}
              <div className="lg:col-span-3">
                <TuitionCartSidebar
                  items={cartItems.filter(item => item.type === 'tuition').map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    studentName: item.studentName,
                    studentId: item.studentId
                  }))}
                  onRemoveItem={handleRemoveFromCart}
                  onCheckout={handleGoToCart}
                  campus={currentCampus}
                />
              </div>
            </div>
          </TabsContent>

          {/* Receipts Tab - Combined data with student identification */}
          <TabsContent value="receipts" className="space-y-6">
            <ReceiptList 
              receipts={allReceipts}
              onDownload={handleDownloadReceipt}
            />
          </TabsContent>
        </Tabs>
      </main>

    </div>
  );
};