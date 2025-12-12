import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, CheckCircle2, ArrowLeft, Receipt, User, AlertTriangle, Info, ShoppingCart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PaymentProgressBar } from "./PaymentProgressBar";
import { mockCreditNotes, mockStudents } from "@/data/mockData";

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'course' | 'activity' | 'tuition';
  studentName?: string;
  studentId?: string;
}

interface CartViewProps {
  items: CartItem[];
  onRemoveItem: (itemId: string) => void;
  onCheckout: (selectedItems: CartItem[]) => void;
  onBack: () => void;
}

export const CartView = ({ items, onRemoveItem, onCheckout, onBack }: CartViewProps) => {
  const { t, language, formatCurrency } = useLanguage();
  const [selectedItems, setSelectedItems] = useState<string[]>(items.map(item => item.id));
  
  // Get active credit notes
  const activeCreditNotes = mockCreditNotes.filter(note => note.status === 'active');
  
  // Get unique student IDs from cart items
  const studentsInCart = useMemo(() => {
    const studentIds = new Set<string>();
    items.forEach(item => {
      if (item.studentId) {
        studentIds.add(item.studentId);
      }
    });
    return Array.from(studentIds);
  }, [items]);

  // Filter credit notes to only show those for students in cart
  const applicableCreditNotes = useMemo(() => {
    return activeCreditNotes.filter(note => 
      studentsInCart.includes(note.student_id.toString())
    );
  }, [activeCreditNotes, studentsInCart]);

  // Credit notes that cannot be applied (for students not in cart)
  const nonApplicableCreditNotes = useMemo(() => {
    return activeCreditNotes.filter(note => 
      !studentsInCart.includes(note.student_id.toString())
    );
  }, [activeCreditNotes, studentsInCart]);

  // Group credit notes by student
  const creditNotesByStudent = useMemo(() => {
    const grouped: Record<string, typeof activeCreditNotes> = {};
    applicableCreditNotes.forEach(note => {
      const studentId = note.student_id.toString();
      if (!grouped[studentId]) {
        grouped[studentId] = [];
      }
      grouped[studentId].push(note);
    });
    return grouped;
  }, [applicableCreditNotes]);

  // Initialize selected credit notes with all applicable ones
  const [selectedCreditNotes, setSelectedCreditNotes] = useState<string[]>(
    applicableCreditNotes.map(note => note.id)
  );

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item.id));
    }
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleCreditNoteToggle = (noteId: string) => {
    setSelectedCreditNotes(prev =>
      prev.includes(noteId)
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  // Group items by student
  const groupedItems = items.reduce((groups, item) => {
    const studentName = item.studentName || 'Unknown Student';
    if (!groups[studentName]) {
      groups[studentName] = { items: [], studentId: item.studentId || '' };
    }
    groups[studentName].items.push(item);
    return groups;
  }, {} as Record<string, { items: CartItem[], studentId: string }>);

  const selectedCartItems = items.filter(item => selectedItems.includes(item.id));
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price, 0);

  // Calculate credit applied per student (credit can only apply to same student's items)
  const creditCalculation = useMemo(() => {
    const result: Record<string, { 
      studentTotal: number, 
      creditApplied: number, 
      remainingCredit: number,
      usedCredits: { id: string, amount: number, usedAmount: number }[]
    }> = {};
    
    // Calculate total per student from selected items
    Object.entries(groupedItems).forEach(([studentName, { items: studentItems, studentId }]) => {
      const studentTotal = studentItems
        .filter(item => selectedItems.includes(item.id))
        .reduce((sum, item) => sum + item.price, 0);
      
      // Get selected credit notes for this student - sorted by timestamp (FIFO - oldest first)
      const studentCreditNotes = (creditNotesByStudent[studentId] || [])
        .filter(note => selectedCreditNotes.includes(note.id))
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      let totalCreditAvailable = studentCreditNotes.reduce((sum, note) => sum + note.amount, 0);
      let creditApplied = Math.min(studentTotal, totalCreditAvailable);
      let remainingCredit = totalCreditAvailable - creditApplied;
      
      // Track how much of each credit note was used
      let remainingPrice = studentTotal;
      const usedCredits: { id: string, amount: number, usedAmount: number }[] = [];
      
      studentCreditNotes.forEach(note => {
        if (remainingPrice > 0) {
          const usedAmount = Math.min(note.amount, remainingPrice);
          usedCredits.push({ id: note.id, amount: note.amount, usedAmount });
          remainingPrice -= usedAmount;
        } else {
          usedCredits.push({ id: note.id, amount: note.amount, usedAmount: 0 });
        }
      });
      
      result[studentId] = { 
        studentTotal, 
        creditApplied, 
        remainingCredit,
        usedCredits
      };
    });
    
    return result;
  }, [groupedItems, selectedItems, creditNotesByStudent, selectedCreditNotes]);

  // Calculate totals
  const totalCreditApplied = Object.values(creditCalculation).reduce((sum, calc) => sum + calc.creditApplied, 0);
  const totalRemainingCredit = Object.values(creditCalculation).reduce((sum, calc) => sum + calc.remainingCredit, 0);
  const finalTotal = Math.max(0, subtotal - totalCreditApplied);

  const getStudentInfo = (studentId: string) => {
    return mockStudents.find(s => s.id.toString() === studentId);
  };

  const handleCheckout = () => {
    if (selectedCartItems.length > 0) {
      onCheckout(selectedCartItems);
    }
  };

  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-6">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4 sm:mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={onBack}
                className={`cursor-pointer text-sm ${fontClass}`}
              >
                {t('portal.dashboard')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className={`text-sm ${fontClass}`}>
                {t('portal.cart')}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Progress Bar */}
        <PaymentProgressBar currentStep={1} />

        {items.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="py-10 sm:py-12 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
              <h3 className={`text-base sm:text-lg font-medium mb-2 ${fontClass}`}>
                {t('portal.cartEmpty')}
              </h3>
              <p className={`text-sm text-muted-foreground mb-4 ${fontClass}`}>
                {t('portal.addItemsToCart')}
              </p>
              <Button onClick={onBack} variant="outline" className={`h-11 touch-manipulation ${fontClass}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Main Content - Single column on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
              {/* Left Side - Cart Items */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                {/* Credit Notes - Grouped by Student */}
                {applicableCreditNotes.length > 0 && (
                  <Card>
                    <CardHeader className="px-3 sm:px-6 py-3 sm:py-6">
                      <CardTitle className={`text-base sm:text-lg flex items-center gap-2 ${fontClass}`}>
                        <Receipt className="h-4 w-4 sm:h-5 sm:w-5" />
                        {t('portal.creditNotes')}
                      </CardTitle>
                      <p className={`text-[10px] sm:text-xs text-muted-foreground ${fontClass}`}>
                        {language === 'th' 
                          ? '* Credit Note ใช้ได้เฉพาะนักเรียนที่ได้รับเท่านั้น' 
                          : language === 'zh' 
                          ? '* 信用票据只能用于分配给的学生'
                          : '* Credit notes can only be applied to the assigned student'}
                      </p>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                      {/* Scrollable if more than 5 items */}
                      <ScrollArea className={applicableCreditNotes.length > 5 ? "h-[220px] sm:h-[280px]" : ""}>
                        <div className="space-y-3 sm:space-y-4 pr-2 sm:pr-4">
                          {Object.entries(creditNotesByStudent).map(([studentId, notes]) => {
                            const student = getStudentInfo(studentId);
                            const calc = creditCalculation[studentId];
                            
                            return (
                              <div key={studentId} className="space-y-2">
                                {/* Student Header */}
                                <div className="flex items-center gap-2 py-2 border-b">
                                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                                  <span className={`text-xs sm:text-sm font-medium ${fontClass}`}>
                                    {student?.avatar} {student?.name}
                                  </span>
                                  {calc && calc.remainingCredit > 0 && (
                                    <Badge variant="outline" className="ml-auto text-orange-600 border-orange-300 text-[10px] sm:text-xs">
                                      {language === 'th' ? 'เหลือ: ' : 'Left: '}
                                      {formatCurrency(calc.remainingCredit)}
                                    </Badge>
                                  )}
                                </div>
                                
                                {/* Credit Notes for this student */}
                                <div className="space-y-2 pl-1 sm:pl-2">
                                  {notes.map((note) => {
                                    const usedCredit = calc?.usedCredits.find(uc => uc.id === note.id);
                                    const isPartiallyUsed = usedCredit && usedCredit.usedAmount > 0 && usedCredit.usedAmount < note.amount;
                                    
                                    return (
                                      <div 
                                        key={note.id} 
                                        className={`flex items-start space-x-2 sm:space-x-3 p-2 rounded-lg active:bg-accent/50 transition-colors ${
                                          selectedCreditNotes.includes(note.id) ? 'bg-primary/5 border border-primary/20' : ''
                                        }`}
                                      >
                                        <Checkbox
                                          checked={selectedCreditNotes.includes(note.id)}
                                          onCheckedChange={() => handleCreditNoteToggle(note.id)}
                                          className="mt-0.5"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <p className={`text-xs sm:text-sm font-medium truncate ${fontClass}`}>
                                            {note.details}
                                          </p>
                                          <p className={`text-[10px] sm:text-xs text-muted-foreground ${fontClass}`}>
                                            {note.id}
                                          </p>
                                          {isPartiallyUsed && selectedCreditNotes.includes(note.id) && (
                                            <p className={`text-[10px] sm:text-xs text-orange-600 mt-1 ${fontClass}`}>
                                              {language === 'th' 
                                                ? `ใช้ ${formatCurrency(usedCredit.usedAmount)}`
                                                : `Used ${formatCurrency(usedCredit.usedAmount)}`
                                              }
                                            </p>
                                          )}
                                        </div>
                                        <span className={`text-xs sm:text-sm font-bold text-primary flex-shrink-0 ${fontClass}`}>
                                          -{formatCurrency(note.amount)}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}

                {/* Select All Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Checkbox
                      checked={selectedItems.length === items.length}
                      onCheckedChange={handleSelectAll}
                      id="select-all"
                    />
                    <label 
                      htmlFor="select-all"
                      className={`text-xs sm:text-sm font-medium cursor-pointer ${fontClass}`}
                    >
                      {selectedItems.length}/{items.length} {language === 'th' ? 'รายการ' : 'items'}
                    </label>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleSelectAll} className={`text-xs sm:text-sm h-8 ${fontClass}`}>
                    {t('portal.selectAll')}
                  </Button>
                </div>

                {/* Items by Student */}
                {Object.entries(groupedItems).map(([studentName, { items: studentItems, studentId }]) => {
                  const calc = creditCalculation[studentId];
                  
                  return (
                    <Card key={studentName}>
                      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
                        <div className="flex items-center justify-between">
                          <CardTitle className={`text-sm sm:text-base ${fontClass}`}>
                            {studentName}
                          </CardTitle>
                          {calc && calc.creditApplied > 0 && (
                            <Badge variant="secondary" className="text-primary text-[10px] sm:text-xs">
                              Credit: -{formatCurrency(calc.creditApplied)}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 px-3 sm:px-6 pb-3 sm:pb-6">
                        <div className="space-y-3 sm:space-y-4">
                          {studentItems.map((item, index) => (
                            <div key={item.id}>
                              {index > 0 && <Separator className="my-3 sm:my-4" />}
                              <div className="flex items-start space-x-2 sm:space-x-4">
                                <Checkbox
                                  checked={selectedItems.includes(item.id)}
                                  onCheckedChange={() => handleItemSelect(item.id)}
                                  className="mt-0.5"
                                />
                                
                                {/* Item Details */}
                                <div className="flex-1 min-w-0">
                                  <h4 className={`font-medium text-xs sm:text-sm mb-1 ${fontClass}`}>
                                    {item.name}
                                  </h4>
                                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                                    <Badge variant="secondary" className={`text-[10px] sm:text-xs ${fontClass}`}>
                                      {item.type === 'tuition' 
                                        ? t('portal.tuition')
                                        : item.type === 'course' 
                                        ? t('portal.afterSchool') 
                                        : t('portal.summerActivity')}
                                    </Badge>
                                  </div>
                                  <div className={`text-sm sm:text-lg font-bold text-primary ${fontClass}`}>
                                    {formatCurrency(item.price)}
                                  </div>
                                </div>
                                
                                {/* Remove Button */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onRemoveItem(item.id)}
                                  className="text-muted-foreground hover:text-destructive p-1 min-w-7 h-7 sm:min-w-8 sm:h-8"
                                >
                                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Right Side - Summary - Desktop Only */}
              <div className="hidden lg:block space-y-6">
                {/* Warning for non-applicable credit notes */}
                {nonApplicableCreditNotes.length > 0 && (
                  <Alert variant="default" className="border-orange-300 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className={`text-orange-700 ${fontClass}`}>
                      {language === 'th' 
                        ? `คุณมี Credit Note ${nonApplicableCreditNotes.length} รายการที่ไม่สามารถใช้ได้`
                        : `You have ${nonApplicableCreditNotes.length} credit note(s) that cannot be applied`
                      }
                    </AlertDescription>
                  </Alert>
                )}

                {/* Price Details - Desktop */}
                <Card>
                  <CardHeader>
                    <CardTitle className={`text-lg ${fontClass}`}>
                      {t('portal.priceDetails')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className={`text-muted-foreground ${fontClass}`}>
                          {selectedItems.length} {t('portal.items')}
                        </span>
                        <span className={`font-medium ${fontClass}`}>
                          {formatCurrency(subtotal)}
                        </span>
                      </div>
                      
                      {totalCreditApplied > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className={`text-muted-foreground ${fontClass}`}>
                            {t('portal.creditApplied')}
                          </span>
                          <span className={`font-medium text-primary ${fontClass}`}>
                            -{formatCurrency(totalCreditApplied)}
                          </span>
                        </div>
                      )}

                      {totalRemainingCredit > 0 && (
                        <div className="p-2 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="flex justify-between text-xs">
                            <span className={`text-orange-700 font-medium ${fontClass}`}>
                              {language === 'th' ? 'Credit คงเหลือ' : 'Remaining Credit'}
                            </span>
                            <span className={`font-bold text-orange-600 ${fontClass}`}>
                              {formatCurrency(totalRemainingCredit)}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <span className={`font-semibold ${fontClass}`}>
                          {t('portal.totalAmount')}
                        </span>
                        <span className={`text-xl font-bold text-primary ${fontClass}`}>
                          {formatCurrency(finalTotal)}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleCheckout} 
                      className={`w-full h-12 text-base touch-manipulation ${fontClass}`}
                      disabled={selectedItems.length === 0}
                    >
                      {t('portal.proceedToCheckout')}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={onBack} 
                      className={`w-full ${fontClass}`}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {t('common.back')}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Footer */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-3 sm:p-4 lg:hidden safe-area-bottom shadow-lg z-40">
          <div className="max-w-4xl mx-auto">
            {/* Summary Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                <span className={`text-xs sm:text-sm text-muted-foreground ${fontClass}`}>
                  {selectedItems.length} {language === 'th' ? 'รายการ' : 'items'}
                </span>
              </div>
              <div className="text-right">
                {totalCreditApplied > 0 && (
                  <p className={`text-[10px] sm:text-xs text-primary ${fontClass}`}>
                    Credit: -{formatCurrency(totalCreditApplied)}
                  </p>
                )}
                <p className={`text-lg sm:text-xl font-bold text-primary ${fontClass}`}>
                  {formatCurrency(finalTotal)}
                </p>
              </div>
            </div>
            
            {/* Checkout Button */}
            <Button 
              onClick={handleCheckout} 
              className={`w-full h-12 text-base touch-manipulation ${fontClass}`}
              disabled={selectedItems.length === 0}
            >
              {t('portal.proceedToCheckout')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
