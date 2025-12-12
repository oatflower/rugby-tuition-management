import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SummaryBoxProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'primary' | 'success' | 'warning' | 'destructive' | 'info' | 'education' | 'secondary';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export const SummaryBox = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'primary',
  trend,
  onClick 
}: SummaryBoxProps) => {
  const { language } = useLanguage();
  const colorClasses = {
    primary: 'bg-primary/10 text-primary border-primary/30',
    success: 'bg-finance-green/10 text-finance-green border-finance-green/30',
    warning: 'bg-warning-orange/10 text-warning-orange border-warning-orange/30',
    destructive: 'bg-destructive/10 text-destructive border-destructive/30',
    info: 'bg-info-cyan/10 text-info-cyan border-info-cyan/30',
    education: 'bg-education-blue/10 text-education-blue border-education-blue/30',
    secondary: 'bg-secondary/10 text-secondary-foreground border-secondary/30',
  };

  const iconBgClasses = {
    primary: 'bg-primary/20 text-primary',
    success: 'bg-finance-green/20 text-finance-green',
    warning: 'bg-warning-orange/20 text-warning-orange',
    destructive: 'bg-destructive/20 text-destructive',
    info: 'bg-info-cyan/20 text-info-cyan',
    education: 'bg-education-blue/20 text-education-blue',
    secondary: 'bg-secondary/20 text-secondary-foreground',
  };

  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  return (
    <Card 
      className={`relative overflow-hidden transition-all hover:shadow-md border-2 ${colorClasses[color]} ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className={`text-xs sm:text-sm font-medium text-muted-foreground mb-0.5 sm:mb-1 truncate ${fontClass}`}>
              {title}
            </p>
            <div className="flex items-baseline gap-1 sm:gap-2">
              <p className={`text-base sm:text-xl font-bold truncate ${fontClass}`}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
              {trend && (
                <span className={`text-[10px] sm:text-xs font-medium flex-shrink-0 ${
                  trend.isPositive ? 'text-finance-green' : 'text-destructive'
                } ${fontClass}`}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className={`text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate ${fontClass}`}>
                {subtitle}
              </p>
            )}
          </div>
          
          <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg ${iconBgClasses[color]} flex items-center justify-center flex-shrink-0`}>
            <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};