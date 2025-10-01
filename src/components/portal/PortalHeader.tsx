import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, LogOut, Bell, DollarSign, Clock, Sun, Receipt, ShoppingCart } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import sisbLogo from "@/assets/sisb-payment-logo.png";
import { ParentAccountSelector } from "./ParentAccountSelector";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const {
    t,
    language
  } = useLanguage();

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
    }],
    extraActivities: [{
      id: 3,
      message: "Soccer practice cancelled today",
      date: "2024-03-04"
    }, {
      id: 4,
      message: "Art class registration open",
      date: "2024-03-02"
    }],
    others: [{
      id: 5,
      message: "Parent-teacher conference scheduled",
      date: "2024-03-10"
    }, {
      id: 6,
      message: "School holiday announcement",
      date: "2024-03-01"
    }]
  };
  const totalNotifications = notifications.tuitionPayment.length + notifications.extraActivities.length + notifications.others.length;
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
  return <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <img src={sisbLogo} alt="SISB Logo" className="h-10 w-auto" />
              <div>
                <h1 className={`text-lg font-bold text-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>Payment Portal</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              <ParentAccountSelector onLogout={onLogout} />
              <LanguageSelector />
              
              {/* Notification Bell */}
              <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    {totalNotifications > 0 && <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {totalNotifications}
                      </Badge>}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>{t('portal.notifications')}</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="tuitionPayment" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="tuitionPayment" className={`text-xs ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {t('portal.tuitionPayment')}
                        {notifications.tuitionPayment.length > 0 && <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                            {notifications.tuitionPayment.length}
                          </Badge>}
                      </TabsTrigger>
                      <TabsTrigger value="extraActivities" className={`text-xs ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {t('portal.extraActivities')}
                        {notifications.extraActivities.length > 0 && <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                            {notifications.extraActivities.length}
                          </Badge>}
                      </TabsTrigger>
                      <TabsTrigger value="others" className={`text-xs ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {t('portal.others')}
                        {notifications.others.length > 0 && <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                            {notifications.others.length}
                          </Badge>}
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="tuitionPayment" className="space-y-2 mt-4">
                      {notifications.tuitionPayment.map(notification => <div key={notification.id} className="p-3 bg-muted rounded-lg">
                          <p className={`text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{notification.message}</p>
                          <p className={`text-xs text-muted-foreground mt-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{formatDate(notification.date)}</p>
                        </div>)}
                    </TabsContent>
                    
                    <TabsContent value="extraActivities" className="space-y-2 mt-4">
                      {notifications.extraActivities.map(notification => <div key={notification.id} className="p-3 bg-muted rounded-lg">
                          <p className={`text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{notification.message}</p>
                          <p className={`text-xs text-muted-foreground mt-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{formatDate(notification.date)}</p>
                        </div>)}
                    </TabsContent>
                    
                    <TabsContent value="others" className="space-y-2 mt-4">
                      {notifications.others.map(notification => <div key={notification.id} className="p-3 bg-muted rounded-lg">
                          <p className={`text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{notification.message}</p>
                          <p className={`text-xs text-muted-foreground mt-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{formatDate(notification.date)}</p>
                        </div>)}
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-sm">
              <div className="px-2 py-4 space-y-4">
                
                {/* Navigation Menu */}
                <div className="px-2">
                  <h4 className={`font-medium mb-3 text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('nav.home')}</h4>
                  <div className="space-y-1">
                    <button onClick={() => onTabChange?.("dashboard")} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${activeTab === "dashboard" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"} ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                      <GraduationCap className="h-4 w-4" />
                      Dashboard
                    </button>
                    <button onClick={() => onTabChange?.("tuition")} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${activeTab === "tuition" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"} ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                      <DollarSign className="h-4 w-4" />
                      Tuition
                    </button>
                    <button onClick={() => onTabChange?.("afterschool")} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${activeTab === "afterschool" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"} ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                      <Clock className="h-4 w-4" />
                      After School
                    </button>
                    <button onClick={() => onTabChange?.("summer")} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${activeTab === "summer" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"} ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                      <Sun className="h-4 w-4" />
                      Summer
                    </button>
                    <button onClick={() => onTabChange?.("receipts")} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${activeTab === "receipts" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"} ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                      <Receipt className="h-4 w-4" />
                      Receipts
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 pt-3 border-t border-border">
                  <LanguageSelector />
                <div className="flex items-center gap-2">
                    <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="relative">
                          <Bell className="h-4 w-4" />
                          {totalNotifications > 0 && <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                              {totalNotifications}
                            </Badge>}
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>}
        </div>
      </header>
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h2 className={`text-xl font-semibold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {t('portal.welcome')}, John Smith
                </h2>
                <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {t('portal.today')}: {formattedToday}
                </p>
              </div>
              
              {/* Countdown Timer */}
              {showCountdown && onCountdownExpired && onCancelCountdown && <CountdownTimer onTimeExpired={onCountdownExpired} onCancel={onCancelCountdown} additionalCourses={additionalCourses} />}
            </div>
          </div>
        </div>
      </div>
    </>;
};