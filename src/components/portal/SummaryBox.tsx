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
      className={`relative overflow-hidden transition-all hover:shadow-sm border ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} bg-card`}
      onClick={onClick}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-3">
          {/* Icon - Clean circle style */}
          <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full ${iconBgClasses[color]} flex items-center justify-center flex-shrink-0`}>
            <Icon className="h-5 w-5 sm:h-5 sm:w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className={`text-[11px] sm:text-xs font-medium text-muted-foreground truncate ${fontClass}`}>
              {title}
            </p>
            <div className="flex items-baseline gap-1.5">
              <p className={`text-base sm:text-lg font-bold text-foreground truncate ${fontClass}`}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
              {trend && (
                <span className={`text-[10px] font-medium flex-shrink-0 ${
                  trend.isPositive ? 'text-finance-green' : 'text-destructive'
                } ${fontClass}`}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className={`text-[10px] sm:text-xs text-muted-foreground truncate ${fontClass}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};