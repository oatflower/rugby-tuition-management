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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full py-2 px-1 transition-colors min-w-0",
                "active:bg-muted/50 touch-manipulation",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 mb-1 transition-transform",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-[10px] leading-tight truncate w-full text-center",
                fontClass,
                isActive && "font-semibold"
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
