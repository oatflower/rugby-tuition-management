import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, MapPin, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Course {
  id: string;
  name: string;
  description: string;
  capacity: number;
  enrolled: number;
  schedule: string;
  location: string;
  price: number;
  duration: string;
  instructor: string;
  hasConflict?: boolean;
}

interface CourseCardProps {
  course: Course;
  onAddToCart?: (courseId: string) => void;
  onRemoveFromCart?: (courseId: string) => void;
  isInCart?: boolean;
}

export const CourseCard = ({ course, onAddToCart, onRemoveFromCart, isInCart }: CourseCardProps) => {
  const spotsLeft = course.capacity - course.enrolled;
  const isFullyBooked = spotsLeft <= 0;
  const isLowCapacity = spotsLeft <= 3 && spotsLeft > 0;

  const { language, formatCurrency, t } = useLanguage();

  const getAvailabilityColor = () => {
    if (isFullyBooked) return 'bg-destructive/20 text-destructive';
    if (isLowCapacity) return 'bg-warning-orange/20 text-warning-orange';
    return 'bg-finance-green/20 text-finance-green';
  };

  const getAvailabilityText = () => {
    if (isFullyBooked) return t('portal.fullyBooked');
    if (isLowCapacity) return `${spotsLeft} ${t('portal.spotsLeft')}`;
    return `${spotsLeft} ${t('portal.spotsAvailable')}`;
  };

  return (
    <Card className={`relative ${course.hasConflict ? 'border-warning-orange/50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className={`font-semibold text-base leading-tight flex-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {course.name}
            </h3>
            <span className={`text-xl font-bold text-blue-600 whitespace-nowrap ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {formatCurrency(course.price)}
            </span>
          </div>
          
          <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {course.description}
          </p>
          
          <Badge className={getAvailabilityColor()}>
            <span className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              {getAvailabilityText()}
            </span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm">
          <div className={`flex items-center gap-2 text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <Clock className="h-4 w-4" />
            <span>{course.schedule} • {course.duration}</span>
          </div>
          
          <div className={`flex items-center gap-2 text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <Users className="h-4 w-4" />
            <span>{t('portal.instructor')}: {course.instructor}</span>
          </div>
          
          <div className={`flex items-center gap-2 text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <MapPin className="h-4 w-4" />
            <span>{course.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.capacity')}:</span>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-2 w-20">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
              />
            </div>
            <span className={`font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{course.enrolled}/{course.capacity}</span>
          </div>
        </div>

        {course.hasConflict && (
          <div className={`flex items-center gap-2 text-sm text-warning-orange bg-warning-orange/10 p-2 rounded ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <AlertTriangle className="h-4 w-4" />
            <span>{t('portal.scheduleConflict')}</span>
          </div>
        )}

        <div className="pt-2">
          {isFullyBooked ? (
            <Button variant="outline" className={`w-full ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`} disabled>
              {t('portal.fullyBooked')}
            </Button>
          ) : isInCart ? (
            <Button 
              variant="outline" 
              className={`w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              onClick={() => onRemoveFromCart?.(course.id)}
            >
              {t('portal.removeFromCart')}
            </Button>
          ) : (
            <Button 
              className={`w-full ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              onClick={() => onAddToCart?.(course.id)}
              disabled={course.hasConflict}
            >
              {t('portal.addToCart')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};