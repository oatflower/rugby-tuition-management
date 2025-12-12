import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, DollarSign, Receipt, Calendar, MapPin, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockStudents, mockInvoices, mockCreditNotes } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface MobileDashboardProps {
  outstandingAmount: number;
  pendingCount: number;
  totalCreditNotes: number;
  activeCreditCount: number;
  onViewInvoices: () => void;
  onViewCreditNotes: () => void;
  upcomingInvoices: Array<{
    id: string;
    description: string;
    due_date: string;
    amount_due: number;
    student_id: number;
  }>;
}

export const MobileDashboard = ({
  outstandingAmount,
  pendingCount,
  totalCreditNotes,
  activeCreditCount,
  onViewInvoices,
  onViewCreditNotes,
  upcomingInvoices,
}: MobileDashboardProps) => {
  const { t, language, formatCurrency } = useLanguage();
  const [currentCard, setCurrentCard] = useState(0);
  const [isStudentSelectorOpen, setIsStudentSelectorOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  const studentNames = mockStudents.map((s, i) => `${i + 1}. ${s.name}`).join(", ");

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = scrollContainerRef.current.offsetWidth - 32;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentCard(newIndex);
    }
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
      <Card className="mx-4 mt-4">
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
                Rugby School Thailand
              </p>
              <p className={`text-sm text-muted-foreground truncate ${fontClass}`}>
                {studentNames}
              </p>
            </div>
            <ChevronDown className={cn(
              "h-5 w-5 text-muted-foreground transition-transform",
              isStudentSelectorOpen && "rotate-180"
            )} />
          </button>
        </CardContent>
      </Card>

      {/* Horizontal Swipeable Summary Cards */}
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 gap-3 pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card 
                key={card.id}
                onClick={card.onClick}
                className="flex-shrink-0 w-[calc(50%-6px)] snap-start cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", card.iconBg)}>
                      <Icon className={cn("h-5 w-5", card.iconColor)} />
                    </div>
                    {card.badge && (
                      <Badge variant="secondary" className="text-primary bg-primary/10">
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
                  <div className="flex items-center justify-end mt-2 text-muted-foreground">
                    <span className={`text-xs ${fontClass}`}>
                      {language === 'th' ? 'ดูรายละเอียด' : language === 'zh' ? '查看详情' : 'View Details'}
                    </span>
                    <ChevronRight className="h-4 w-4" />
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
                "h-1.5 rounded-full transition-all",
                currentCard === index ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <Card className="mx-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <h3 className={`font-semibold text-foreground ${fontClass}`}>
              {language === 'th' ? 'กำหนดชำระเร็วๆนี้' : language === 'zh' ? '即将到期' : 'Upcoming Deadlines'}
            </h3>
          </div>
          <p className={`text-xs text-muted-foreground mb-4 ${fontClass}`}>
            {language === 'th' ? 'วันที่สำคัญสำหรับนักเรียนทุกคน' : language === 'zh' ? '所有学生的重要日期' : 'Important dates for All Students'}
          </p>
          
          <div className="space-y-2">
            {upcomingInvoices.slice(0, 4).map((invoice) => {
              const student = mockStudents.find(s => s.id === invoice.student_id);
              return (
                <div 
                  key={invoice.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium text-sm text-foreground ${fontClass}`}>
                          {language === 'th' ? 'ค่าเทอม' : language === 'zh' ? '学费' : 'Tuition'}
                        </span>
                        <Badge variant="secondary" className="text-xs">1</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/10 text-primary border-0">
                      {formatCurrency(invoice.amount_due)}
                    </Badge>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
