import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, DollarSign, Receipt, Calendar, MapPin, ChevronDown, Check, ShoppingCart, ExternalLink, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockStudents } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface Invoice {
  id: string;
  description: string;
  due_date: string;
  amount_due: number;
  student_id: number;
  term?: string;
  status?: string;
}

interface MobileDashboardProps {
  outstandingAmount: number;
  pendingCount: number;
  totalCreditNotes: number;
  activeCreditCount: number;
  onViewInvoices: () => void;
  onViewCreditNotes: () => void;
  upcomingInvoices: Invoice[];
  selectedStudent: string | 'all';
  onStudentChange: (studentId: string | 'all') => void;
  onAddInvoiceToCart: (invoiceId: string) => void;
  isInvoiceInCart: (invoiceId: string) => boolean;
}

export const MobileDashboard = ({
  outstandingAmount,
  pendingCount,
  totalCreditNotes,
  activeCreditCount,
  onViewInvoices,
  onViewCreditNotes,
  upcomingInvoices,
  selectedStudent,
  onStudentChange,
  onAddInvoiceToCart,
  isInvoiceInCart,
}: MobileDashboardProps) => {
  const { t, language, formatCurrency } = useLanguage();
  const [currentCard, setCurrentCard] = useState(0);
  const [isStudentSelectorOpen, setIsStudentSelectorOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  const getStudentDisplayText = () => {
    if (selectedStudent === 'all') {
      return mockStudents.map((s, i) => `${i + 1}. ${s.name}`).join(", ");
    }
    const student = mockStudents.find(s => s.id.toString() === selectedStudent);
    return student ? student.name : '';
  };

  const getStudentSelectorTitle = () => {
    if (selectedStudent === 'all') {
      return language === 'th' ? 'นักเรียนทั้งหมด' : language === 'zh' ? '所有学生' : 'All Students';
    }
    const student = mockStudents.find(s => s.id.toString() === selectedStudent);
    return student?.name || '';
  };

  // Trigger animations on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = scrollContainerRef.current.offsetWidth - 32;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentCard(newIndex);
    }
  };

  const handleStudentSelect = (studentId: string | 'all') => {
    onStudentChange(studentId);
    setIsStudentSelectorOpen(false);
  };

  const getStudentById = (studentId: number) => {
    return mockStudents.find(s => s.id === studentId);
  };

  const summaryCards = [
    {
      id: 'total-due',
      icon: DollarSign,
      iconBg: 'bg-warning-orange/20',
      iconColor: 'text-warning-orange',
      title: language === 'th' ? 'ยอดค้างชำระ' : language === 'zh' ? '待付款' : 'TOTAL DUE',
      amount: formatCurrency(outstandingAmount),
      amountColor: 'text-warning-orange',
      subtitle: `${pendingCount} ${t('portal.pending')}`,
      badge: pendingCount > 0 ? pendingCount : null,
      onClick: onViewInvoices,
    },
    {
      id: 'credit-note',
      icon: Receipt,
      iconBg: 'bg-info-cyan/20',
      iconColor: 'text-info-cyan',
      title: language === 'th' ? 'Credit Note' : language === 'zh' ? '信用票据' : 'CREDIT NOTE',
      amount: formatCurrency(totalCreditNotes),
      amountColor: 'text-info-cyan',
      subtitle: language === 'th' ? 'เครดิตที่ใช้ได้' : language === 'zh' ? '可用信用' : 'Available credit',
      badge: null,
      onClick: onViewCreditNotes,
    },
  ];

  return (
    <div className="space-y-4 md:hidden">
      {/* Student Selector Card */}
      <Card className={cn(
        "mx-4 mt-4 transition-all duration-500 ease-out overflow-hidden",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        <CardContent className="p-4">
          <button 
            onClick={() => setIsStudentSelectorOpen(!isStudentSelectorOpen)}
            className="flex items-center gap-3 w-full text-left"
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-foreground ${fontClass}`}>
                {getStudentSelectorTitle()}
              </p>
              <p className={`text-sm text-muted-foreground truncate ${fontClass}`}>
                Rugby School Thailand
              </p>
            </div>
            <ChevronDown className={cn(
              "h-5 w-5 text-muted-foreground transition-transform duration-300",
              isStudentSelectorOpen && "rotate-180"
            )} />
          </button>

          {/* Dropdown List */}
          <div className={cn(
            "overflow-hidden transition-all duration-300 ease-out",
            isStudentSelectorOpen ? "max-h-[300px] mt-4" : "max-h-0"
          )}>
            <div className="space-y-1 border-t border-border pt-3">
              {/* All Students Option */}
              <button
                onClick={() => handleStudentSelect('all')}
                className={cn(
                  "flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200",
                  selectedStudent === 'all' 
                    ? "bg-primary/10 border border-primary/30" 
                    : "hover:bg-muted/50"
                )}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <span className="text-sm">👨‍👩‍👧‍👦</span>
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-medium text-sm ${fontClass}`}>
                    {language === 'th' ? 'นักเรียนทั้งหมด' : language === 'zh' ? '所有学生' : 'All Students'}
                  </p>
                  <p className={`text-xs text-muted-foreground ${fontClass}`}>
                    {mockStudents.length} {language === 'th' ? 'คน' : language === 'zh' ? '人' : 'students'}
                  </p>
                </div>
                {selectedStudent === 'all' && (
                  <Check className="h-4 w-4 text-primary animate-scale-in" />
                )}
              </button>

              {/* Individual Students */}
              {mockStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => handleStudentSelect(student.id.toString())}
                  className={cn(
                    "flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200",
                    selectedStudent === student.id.toString()
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border",
                    student.color
                  )}>
                    <span className="text-sm">{student.avatar}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium text-sm ${fontClass}`}>{student.name}</p>
                    <p className={`text-xs text-muted-foreground ${fontClass}`}>{student.class}</p>
                  </div>
                  {selectedStudent === student.id.toString() && (
                    <Check className="h-4 w-4 text-primary animate-scale-in" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Horizontal Swipeable Summary Cards */}
      <div className={cn(
        "relative transition-all duration-500 ease-out delay-100",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 gap-3 pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card 
                key={card.id}
                onClick={card.onClick}
                className={cn(
                  "flex-shrink-0 w-[calc(50%-6px)] snap-start cursor-pointer transition-all duration-300",
                  "hover:shadow-md active:scale-[0.98]",
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                )}
                style={{ transitionDelay: `${150 + index * 100}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110",
                      card.iconBg
                    )}>
                      <Icon className={cn("h-5 w-5", card.iconColor)} />
                    </div>
                    {card.badge && (
                      <Badge variant="secondary" className="text-primary bg-primary/10 animate-bounce-in">
                        {card.badge}
                      </Badge>
                    )}
                  </div>
                  <p className={`text-[11px] font-medium text-muted-foreground mb-1 ${fontClass}`}>
                    {card.title}
                  </p>
                  <p className={cn(`text-xl font-bold mb-1 ${fontClass}`, card.amountColor)}>
                    {card.amount}
                  </p>
                  <p className={`text-xs text-muted-foreground ${fontClass}`}>
                    {card.subtitle}
                  </p>
                  <div className="flex items-center justify-end mt-2 text-muted-foreground group">
                    <span className={`text-xs transition-transform duration-200 group-hover:translate-x-1 ${fontClass}`}>
                      {language === 'th' ? 'ดูรายละเอียด' : language === 'zh' ? '查看详情' : 'View Details'}
                    </span>
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-1.5 mt-2">
          {summaryCards.map((_, index) => (
            <div 
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                currentCard === index ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <Card className={cn(
        "mx-4 transition-all duration-500 ease-out delay-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <h3 className={`font-semibold text-foreground ${fontClass}`}>
              {language === 'th' ? 'กำหนดชำระเร็วๆนี้' : language === 'zh' ? '即将到期' : 'Upcoming Deadlines'}
            </h3>
          </div>
          <p className={`text-xs text-muted-foreground mb-4 ${fontClass}`}>
            {language === 'th' ? 'วันที่สำคัญสำหรับ' : language === 'zh' ? '重要日期' : 'Important dates for'} {getStudentSelectorTitle()}
          </p>
          
          <div className="space-y-2">
            {upcomingInvoices.slice(0, 4).map((invoice, index) => {
              const student = getStudentById(invoice.student_id);
              return (
                <button 
                  key={invoice.id}
                  onClick={() => setSelectedInvoice(invoice)}
                  className={cn(
                    "flex items-center justify-between p-3 bg-muted/50 rounded-lg w-full text-left",
                    "transition-all duration-300 hover:bg-muted/70 active:scale-[0.99] cursor-pointer",
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  )}
                  style={{ transitionDelay: `${400 + index * 50}ms` }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border",
                      student?.color || "bg-primary/10"
                    )}>
                      <span className="text-sm">{student?.avatar || '📄'}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium text-sm text-foreground truncate ${fontClass}`}>
                          {student?.name || (language === 'th' ? 'ค่าเทอม' : 'Tuition')}
                        </span>
                      </div>
                      <p className={`text-xs text-muted-foreground ${fontClass}`}>
                        {language === 'th' ? 'ครบกำหนด' : 'Due'}: {new Date(invoice.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/10 text-primary border-0">
                      {formatCurrency(invoice.amount_due)}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Invoice Detail Sheet */}
      <Sheet open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <SheetContent side="bottom" className="rounded-t-2xl h-auto max-h-[80vh]">
          {selectedInvoice && (() => {
            const student = getStudentById(selectedInvoice.student_id);
            const isInCart = isInvoiceInCart(selectedInvoice.id);
            return (
              <>
                <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4" />
                <SheetHeader className="text-left pb-4">
                  <SheetTitle className={`text-lg ${fontClass}`}>
                    {language === 'th' ? 'รายละเอียดใบแจ้งหนี้' : language === 'zh' ? '发票详情' : 'Invoice Details'}
                  </SheetTitle>
                </SheetHeader>
                
                <div className="space-y-4">
                  {/* Student Info */}
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center border text-xl",
                      student?.color || "bg-primary/10"
                    )}>
                      {student?.avatar || '👤'}
                    </div>
                    <div>
                      <p className={`font-semibold ${fontClass}`}>{student?.name}</p>
                      <p className={`text-sm text-muted-foreground ${fontClass}`}>{student?.class}</p>
                    </div>
                  </div>

                  {/* Invoice Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm text-muted-foreground ${fontClass}`}>
                        {language === 'th' ? 'เลขที่ใบแจ้งหนี้' : 'Invoice Number'}
                      </span>
                      <span className={`font-medium ${fontClass}`}>{selectedInvoice.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm text-muted-foreground ${fontClass}`}>
                        {language === 'th' ? 'รายละเอียด' : 'Description'}
                      </span>
                      <span className={`font-medium text-right ${fontClass}`}>{selectedInvoice.description}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm text-muted-foreground ${fontClass}`}>
                        {language === 'th' ? 'ปีการศึกษา' : 'Term'}
                      </span>
                      <span className={`font-medium ${fontClass}`}>{selectedInvoice.term || 'Academic Year 2024-2025'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm text-muted-foreground ${fontClass}`}>
                        {language === 'th' ? 'วันครบกำหนด' : 'Due Date'}
                      </span>
                      <span className={`font-medium ${fontClass}`}>
                        {new Date(selectedInvoice.due_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-border">
                      <span className={`font-semibold ${fontClass}`}>
                        {language === 'th' ? 'จำนวนเงิน' : 'Amount'}
                      </span>
                      <span className={`text-xl font-bold text-primary ${fontClass}`}>
                        {formatCurrency(selectedInvoice.amount_due)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedInvoice(null);
                        onViewInvoices();
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {language === 'th' ? 'ดูทั้งหมด' : 'View All'}
                    </Button>
                    <Button
                      className="flex-1"
                      disabled={isInCart}
                      onClick={() => {
                        onAddInvoiceToCart(selectedInvoice.id);
                        setSelectedInvoice(null);
                      }}
                    >
                      {isInCart ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          {language === 'th' ? 'ในตะกร้าแล้ว' : 'In Cart'}
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {language === 'th' ? 'เพิ่มในตะกร้า' : 'Add to Cart'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
};