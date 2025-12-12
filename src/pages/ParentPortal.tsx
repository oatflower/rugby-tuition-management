import { useState } from "react";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { MobileBottomNav } from "@/components/portal/MobileBottomNav";
import { SummaryBox } from "@/components/portal/SummaryBox";
import { InvoiceCard } from "@/components/portal/InvoiceCard";
import { TuitionCartSidebar } from "@/components/portal/TuitionCartSidebar";
import { ReceiptList } from "@/components/portal/ReceiptList";
import { CreditNoteHistory } from "@/components/portal/CreditNoteHistory";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  DollarSign,
  CreditCard,
  GraduationCap,
  Receipt,
  AlertCircle
} from "lucide-react";
import { mockStudents, getMockDataForStudent, mockInvoices, mockReceipts, mandatoryCourses, mockCreditNotes } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { CreditNoteModal } from "@/components/portal/CreditNoteModal";

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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tuition' | 'creditNotes' | 'receipts'>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<string>(mockStudents[0]?.id.toString() || '1');
  const [isCreditNoteModalOpen, setIsCreditNoteModalOpen] = useState(false);
  const [highlightedCreditNoteId, setHighlightedCreditNoteId] = useState<string | null>(null);
  
  const { t, language, formatCurrency } = useLanguage();

  // Count course items in cart (excluding tuition)
  const courseItemsCount = cartItems.filter(item => item.type === 'course' || item.type === 'activity').length;
  
  // Get combined data for all students
  const allInvoices = mockInvoices;
  const allReceipts = mockReceipts;
  const allCreditNotes = mockCreditNotes;
  
  // Calculate combined statistics
  const stats = {
    outstandingInvoices: allInvoices.filter(inv => inv.status === 'pending').length,
    paidThisTerm: allInvoices.filter(inv => inv.status === 'paid').length,
    availableCourses: 15,
  };
  
  const outstandingAmount = allInvoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount_due, 0);
    
  const paidThisTerm = allReceipts
    .filter(rec => rec.status === 'completed')
    .reduce((sum, rec) => sum + rec.amount, 0);
    
  const totalCreditNotes = allCreditNotes
    .filter(note => note.status === 'active')
    .reduce((sum, note) => sum + note.amount, 0);
    
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

  const handleCreditNoteClick = (creditNoteId: string) => {
    setActiveTab('creditNotes');
    setHighlightedCreditNoteId(creditNoteId);
    // Clear highlight after animation completes (5 blinks × 0.5s = 2.5s)
    setTimeout(() => setHighlightedCreditNoteId(null), 2500);
  };

  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  return (
    <div className="min-h-screen bg-muted/20 pb-20 md:pb-6">
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
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as 'dashboard' | 'tuition' | 'creditNotes' | 'receipts')}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'dashboard' | 'tuition' | 'creditNotes' | 'receipts')} className="space-y-4 sm:space-y-6">
          {/* Desktop Navigation - Tabs */}
          <TabsList className="hidden md:grid w-full grid-cols-4 gap-1">
            <TabsTrigger value="dashboard" className={fontClass}>
              <GraduationCap className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t('portal.dashboard')}</span>
            </TabsTrigger>
            <TabsTrigger value="tuition" className={fontClass}>
              <DollarSign className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t('portal.tuition')}</span>
            </TabsTrigger>
            <TabsTrigger value="creditNotes" className={fontClass}>
              <Receipt className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{language === 'th' ? 'Credit Note' : language === 'zh' ? '信用票据' : 'Credit Note'}</span>
            </TabsTrigger>
            <TabsTrigger value="receipts" className={fontClass}>
              <Receipt className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t('portal.receipts')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab - Combined data for all students with student tags */}
          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
            {/* Summary Stats - 2 columns on mobile, 3 on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
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
              />

              <SummaryBox
                title={t('portal.creditNotes')}
                value={formatCurrency(totalCreditNotes)}
                subtitle={`${allCreditNotes.filter(n => n.status === 'active').length} ${t('portal.available')}`}
                icon={Receipt}
                color="info"
                onClick={() => setIsCreditNoteModalOpen(true)}
              />
            </div>

            {/* Upcoming Deadlines - Combined with student identification */}
            <Card>
              <CardHeader className="px-3 sm:px-6 py-3 sm:py-6">
                <CardTitle className={`flex items-center gap-2 text-base sm:text-lg ${fontClass}`}>
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  {t('portal.upcomingDeadlines')}
                </CardTitle>
                <CardDescription className={`text-xs sm:text-sm ${fontClass}`}>
                  {t('portal.importantDates')} {t('portal.allStudents')}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="space-y-2 sm:space-y-3">
                  {allInvoices
                    .filter(inv => inv.status === 'pending')
                    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                    .slice(0, 5)
                    .map(invoice => {
                      const student = mockStudents.find(s => s.id === invoice.student_id);
                      return (
                        <div key={invoice.id} className="flex items-start sm:items-center justify-between p-2 sm:p-3 bg-muted/50 rounded-lg gap-2">
                          <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0 mt-0.5 sm:mt-0" />
                            <div className="min-w-0 flex-1">
                              <p className={`font-medium text-xs sm:text-base truncate ${fontClass}`}>
                                {invoice.description}
                              </p>
                              <p className={`text-[10px] sm:text-sm text-muted-foreground ${fontClass}`}>
                                {student?.name} • {t('portal.due')}: {new Date(invoice.due_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant="default" className="text-[10px] sm:text-xs flex-shrink-0">
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
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 sm:gap-6">
              {/* Left 70% - Invoice List */}
              <div className="lg:col-span-7 space-y-3 sm:space-y-4">
                <div className="mb-3 sm:mb-6">
                  <h2 className={`text-lg sm:text-2xl font-bold ${fontClass}`}>
                    {language === 'th' ? 'ใบแจ้งหนี้ปัจจุบัน' : language === 'zh' ? '当前发票' : 'Current Invoice'}
                  </h2>
                </div>
                {allInvoices.map(invoice => {
                  const student = mockStudents.find(s => s.id === invoice.student_id);
                  return (
                    <InvoiceCard
                      key={invoice.id}
                      invoice={invoice}
                      onAddToCart={(invoiceId) => handleAddToCart(invoiceId, 'tuition')}
                      studentName={student?.name}
                    />
                  );
                })}
              </div>

              {/* Right 30% - Tuition Cart Sidebar - Hidden on mobile, shown at bottom */}
              <div className="hidden lg:block lg:col-span-3">
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
                />
              </div>
              
              {/* Mobile Cart Summary - Fixed at bottom */}
              <div className="lg:hidden">
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
                />
              </div>
            </div>
          </TabsContent>

          {/* Credit Notes Tab */}
          <TabsContent value="creditNotes" className="space-y-6">
            <CreditNoteHistory 
              creditNotes={allCreditNotes}
              students={mockStudents}
              highlightedCreditNoteId={highlightedCreditNoteId}
            />
          </TabsContent>

          {/* Receipts Tab - Combined data with student identification */}
          <TabsContent value="receipts" className="space-y-6">
            <ReceiptList 
              receipts={allReceipts}
              onDownload={handleDownloadReceipt}
              onCreditNoteClick={handleCreditNoteClick}
            />
          </TabsContent>
        </Tabs>
      </main>

      <CreditNoteModal
        isOpen={isCreditNoteModalOpen}
        onClose={() => setIsCreditNoteModalOpen(false)}
        creditNotes={allCreditNotes}
        students={mockStudents}
      />
    </div>
  );
};