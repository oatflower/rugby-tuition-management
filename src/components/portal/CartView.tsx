import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, CheckCircle2, ArrowLeft, Receipt, User } from "lucide-react";
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
      
      // Get selected credit notes for this student
      const studentCreditNotes = (creditNotesByStudent[studentId] || [])
        .filter(note => selectedCreditNotes.includes(note.id));
      
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={onBack}
                className={`cursor-pointer ${fontClass}`}
              >
                {t('portal.dashboard')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className={fontClass}>
                {t('portal.cart')}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Progress Bar */}
        <PaymentProgressBar currentStep={1} />

        {items.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${fontClass}`}>
                {t('portal.cartEmpty')}
              </h3>
              <p className={`text-muted-foreground mb-4 ${fontClass}`}>
                {t('portal.addItemsToCart')}
              </p>
              <Button onClick={onBack} variant="outline" className={fontClass}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Credit Notes - Grouped by Student */}
              {applicableCreditNotes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className={`text-lg flex items-center gap-2 ${fontClass}`}>
                      <Receipt className="h-5 w-5" />
                      {t('portal.creditNotes')}
                    </CardTitle>
                    <p className={`text-xs text-muted-foreground ${fontClass}`}>
                      {language === 'th' 
                        ? '* Credit Note สามารถใช้ได้เฉพาะนักเรียนที่ได้รับเท่านั้น' 
                        : language === 'zh' 
                        ? '* 信用票据只能用于分配给的学生'
                        : '* Credit notes can only be applied to the assigned student'}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {/* Scrollable if more than 5 items */}
                    <ScrollArea className={applicableCreditNotes.length > 5 ? "h-[280px]" : ""}>
                      <div className="space-y-4 pr-4">
                        {Object.entries(creditNotesByStudent).map(([studentId, notes]) => {
                          const student = getStudentInfo(studentId);
                          const calc = creditCalculation[studentId];
                          
                          return (
                            <div key={studentId} className="space-y-2">
                              {/* Student Header */}
                              <div className="flex items-center gap-2 py-2 border-b">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className={`text-sm font-medium ${fontClass}`}>
                                  {student?.avatar} {student?.name}
                                </span>
                                {calc && calc.remainingCredit > 0 && (
                                  <Badge variant="outline" className="ml-auto text-orange-600 border-orange-300">
                                    {language === 'th' ? 'เครดิตคงเหลือ: ' : language === 'zh' ? '剩余信用: ' : 'Remaining: '}
                                    {formatCurrency(calc.remainingCredit)}
                                  </Badge>
                                )}
                              </div>
                              
                              {/* Credit Notes for this student */}
                              <div className="space-y-2 pl-2">
                                {notes.map((note) => {
                                  const usedCredit = calc?.usedCredits.find(uc => uc.id === note.id);
                                  const isPartiallyUsed = usedCredit && usedCredit.usedAmount > 0 && usedCredit.usedAmount < note.amount;
                                  
                                  return (
                                    <div 
                                      key={note.id} 
                                      className={`flex items-start space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors ${
                                        selectedCreditNotes.includes(note.id) ? 'bg-primary/5 border border-primary/20' : ''
                                      }`}
                                    >
                                      <Checkbox
                                        checked={selectedCreditNotes.includes(note.id)}
                                        onCheckedChange={() => handleCreditNoteToggle(note.id)}
                                        className="mt-1"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium ${fontClass}`}>
                                          {note.details}
                                        </p>
                                        <p className={`text-xs text-muted-foreground ${fontClass}`}>
                                          {note.id}
                                        </p>
                                        {isPartiallyUsed && selectedCreditNotes.includes(note.id) && (
                                          <p className={`text-xs text-orange-600 mt-1 ${fontClass}`}>
                                            {language === 'th' 
                                              ? `ใช้ ${formatCurrency(usedCredit.usedAmount)} / คงเหลือ ${formatCurrency(note.amount - usedCredit.usedAmount)}`
                                              : language === 'zh'
                                              ? `使用 ${formatCurrency(usedCredit.usedAmount)} / 剩余 ${formatCurrency(note.amount - usedCredit.usedAmount)}`
                                              : `Used ${formatCurrency(usedCredit.usedAmount)} / Remaining ${formatCurrency(note.amount - usedCredit.usedAmount)}`
                                            }
                                          </p>
                                        )}
                                      </div>
                                      <span className={`text-sm font-bold text-primary ${fontClass}`}>
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={selectedItems.length === items.length}
                    onCheckedChange={handleSelectAll}
                    id="select-all"
                  />
                  <label 
                    htmlFor="select-all"
                    className={`text-sm font-medium cursor-pointer ${fontClass}`}
                  >
                    {selectedItems.length}/{items.length} {t('portal.itemsSelected')}
                  </label>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSelectAll} className={fontClass}>
                  {t('portal.selectAll')}
                </Button>
              </div>

              {/* Items by Student */}
              {Object.entries(groupedItems).map(([studentName, { items: studentItems, studentId }]) => {
                const calc = creditCalculation[studentId];
                
                return (
                  <Card key={studentName}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className={`text-base ${fontClass}`}>
                          {studentName}
                        </CardTitle>
                        {calc && calc.creditApplied > 0 && (
                          <Badge variant="secondary" className="text-primary">
                            {language === 'th' ? 'Credit: ' : language === 'zh' ? '信用: ' : 'Credit: '}
                            -{formatCurrency(calc.creditApplied)}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {studentItems.map((item, index) => (
                          <div key={item.id}>
                            {index > 0 && <Separator className="my-4" />}
                            <div className="flex items-start space-x-4">
                              <Checkbox
                                checked={selectedItems.includes(item.id)}
                                onCheckedChange={() => handleItemSelect(item.id)}
                                className="mt-1"
                              />
                              
                              {/* Item Details */}
                              <div className="flex-1 min-w-0">
                                <h4 className={`font-medium text-sm mb-1 ${fontClass}`}>
                                  {item.name}
                                </h4>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="secondary" className={`text-xs ${fontClass}`}>
                                    {item.type === 'tuition' 
                                      ? t('portal.tuition')
                                      : item.type === 'course' 
                                      ? t('portal.afterSchool') 
                                      : t('portal.summerActivity')}
                                  </Badge>
                                </div>
                                <div className={`text-lg font-bold text-primary ${fontClass}`}>
                                  {formatCurrency(item.price)}
                                </div>
                              </div>
                              
                              {/* Remove Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveItem(item.id)}
                                className="text-muted-foreground hover:text-destructive p-1 min-w-8 h-8"
                              >
                                <X className="h-4 w-4" />
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

            {/* Right Side - Summary */}
            <div className="space-y-6">
              {/* Price Details */}
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
                        {selectedItems.length} {t('portal.items')} {language === 'th' ? 'ที่เลือก' : language === 'zh' ? '已选择' : 'selected'}
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
                      <div className="flex justify-between text-sm">
                        <span className={`text-orange-600 ${fontClass}`}>
                          {language === 'th' ? 'Credit คงเหลือ (เก็บไว้ใช้ครั้งหน้า)' : language === 'zh' ? '剩余信用（下次使用）' : 'Remaining Credit (saved for next time)'}
                        </span>
                        <span className={`font-medium text-orange-600 ${fontClass}`}>
                          {formatCurrency(totalRemainingCredit)}
                        </span>
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
                    className={`w-full h-12 text-base ${fontClass}`}
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
        )}
      </div>
    </div>
  );
};
