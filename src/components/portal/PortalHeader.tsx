import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import sisbLogo from "@/assets/rugby-logo.jpg";
import { ParentAccountSelector } from "./ParentAccountSelector";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "./CountdownTimer";

interface PortalHeaderProps {
  onLogout?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  cartItemCount?: number;
  onGoToCart?: () => void;
  showCountdown?: boolean;
  onCountdownExpired?: () => void;
  onCancelCountdown?: () => void;
  additionalCourses?: number;
}

export const PortalHeader = ({
  onLogout,
  activeTab = "dashboard",
  onTabChange,
  cartItemCount = 0,
  onGoToCart,
  showCountdown = false,
  onCountdownExpired,
  onCancelCountdown,
  additionalCourses = 0
}: PortalHeaderProps) => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { t, language } = useLanguage();

  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  // Mock notification data
  const notifications = {
    tuitionPayment: [{
      id: 1,
      message: "Tuition fee for March is due",
      date: "2024-03-01"
    }, {
      id: 2,
      message: "Payment received for February",
      date: "2024-02-15"
    }]
  };
  const totalNotifications = notifications.tuitionPayment.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['day.sunday', 'day.monday', 'day.tuesday', 'day.wednesday', 'day.thursday', 'day.friday', 'day.saturday'];
    const months = ['month.january', 'month.february', 'month.march', 'month.april', 'month.may', 'month.june', 'month.july', 'month.august', 'month.september', 'month.october', 'month.november', 'month.december'];
    const dayName = t(days[date.getDay()]);
    const monthName = t(months[date.getMonth()]);
    if (language === 'en') {
      return `${dayName}, ${monthName} ${date.getDate()}, ${date.getFullYear()}`;
    } else if (language === 'th') {
      return `${dayName}ที่ ${date.getDate()} ${monthName} ${date.getFullYear() + 543}`;
    } else if (language === 'zh') {
      return `${date.getFullYear()}年${monthName}${date.getDate()}日 ${dayName}`;
    }
    return dateString;
  };

  const today = new Date();
  const formattedToday = formatDate(today.toISOString().split('T')[0]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-2 sm:gap-3">
              <img src={sisbLogo} alt="Rugby School Thailand Logo" className="h-8 sm:h-10 w-auto" />
              <div>
                <h1 className={`text-sm sm:text-lg font-bold text-foreground ${fontClass}`}>
                  Payment Portal
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <ParentAccountSelector onLogout={onLogout} />
              <LanguageSelector />
              
              {/* Notification Bell */}
              <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    {totalNotifications > 0 && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {totalNotifications}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className={fontClass}>{t('portal.notifications')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2 mt-4">
                    <h3 className={`font-semibold mb-3 ${fontClass}`}>
                      {t('portal.tuitionPayment')}
                    </h3>
                    {notifications.tuitionPayment.map(notification => (
                      <div key={notification.id} className="p-3 bg-muted rounded-lg">
                        <p className={`text-sm ${fontClass}`}>{notification.message}</p>
                        <p className={`text-xs text-muted-foreground mt-1 ${fontClass}`}>{formatDate(notification.date)}</p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Mobile: Language + Notification only */}
            <div className="flex md:hidden items-center gap-1">
              <LanguageSelector />
              <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
                    <Bell className="h-4 w-4" />
                    {totalNotifications > 0 && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                        {totalNotifications}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[calc(100vw-2rem)] mx-4 rounded-lg">
                  <DialogHeader>
                    <DialogTitle className={fontClass}>{t('portal.notifications')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2 mt-4">
                    <h3 className={`font-semibold mb-3 ${fontClass}`}>
                      {t('portal.tuitionPayment')}
                    </h3>
                    {notifications.tuitionPayment.map(notification => (
                      <div key={notification.id} className="p-3 bg-muted rounded-lg">
                        <p className={`text-sm ${fontClass}`}>{notification.message}</p>
                        <p className={`text-xs text-muted-foreground mt-1 ${fontClass}`}>{formatDate(notification.date)}</p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>
      
      {/* Welcome Section - Compact on mobile */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <div className="min-w-0">
                <h2 className={`text-base sm:text-xl font-semibold text-primary truncate ${fontClass}`}>
                  {t('portal.welcome')}, John
                </h2>
                <p className={`text-xs sm:text-sm text-muted-foreground truncate ${fontClass}`}>
                  {formattedToday}
                </p>
              </div>
              
              {/* Countdown Timer */}
              {showCountdown && onCountdownExpired && onCancelCountdown && (
                <CountdownTimer 
                  onTimeExpired={onCountdownExpired} 
                  onCancel={onCancelCountdown} 
                  additionalCourses={additionalCourses} 
                />
              )}
            </div>
            
            {/* Desktop: Account Selector */}
            <div className="hidden md:block">
              <ParentAccountSelector onLogout={onLogout} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};