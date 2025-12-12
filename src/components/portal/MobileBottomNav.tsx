import { GraduationCap, DollarSign, Receipt, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileBottomNav = ({ activeTab, onTabChange }: MobileBottomNavProps) => {
  const { language } = useLanguage();
  
  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  const navItems = [
    {
      id: 'dashboard',
      icon: GraduationCap,
      label: language === 'th' ? 'หน้าหลัก' : language === 'zh' ? '首页' : 'Home',
    },
    {
      id: 'tuition',
      icon: DollarSign,
      label: language === 'th' ? 'ใบแจ้งหนี้' : language === 'zh' ? '发票' : 'Invoice',
    },
    {
      id: 'creditNotes',
      icon: FileText,
      label: language === 'th' ? 'Credit' : language === 'zh' ? '信用' : 'Credit',
    },
    {
      id: 'receipts',
      icon: Receipt,
      label: language === 'th' ? 'ใบเสร็จ' : language === 'zh' ? '收据' : 'Receipt',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border md:hidden safe-area-bottom shadow-lg">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all",
                "active:scale-95 touch-manipulation",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-10 h-7 rounded-full transition-colors mb-0.5",
                isActive && "bg-primary/10"
              )}>
                <Icon className={cn(
                  "h-5 w-5 transition-all",
                  isActive && "text-primary"
                )} />
              </div>
              <span className={cn(
                "text-[10px] leading-none",
                fontClass,
                isActive ? "font-semibold text-primary" : "font-medium"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
