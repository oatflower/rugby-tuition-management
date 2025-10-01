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

  return (
    <Card 
      className={`relative overflow-hidden transition-all hover:shadow-md border-2 ${colorClasses[color]} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={`text-2xl font-bold mb-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <p className={`text-2xl font-bold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
              {trend && (
                <span className={`text-xs font-medium ${
                  trend.isPositive ? 'text-finance-green' : 'text-destructive'
                } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className={`text-xs text-muted-foreground mt-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {subtitle}
              </p>
            )}
          </div>
          
          <div className={`w-12 h-12 rounded-lg ${iconBgClasses[color]} flex items-center justify-center`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};