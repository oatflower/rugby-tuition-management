import { useState, useEffect } from "react";
import { Clock, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

interface CountdownTimerProps {
  onTimeExpired: () => void;
  onCancel: () => void;
  additionalCourses?: number; // Number of additional courses added
}

export const CountdownTimer = ({ onTimeExpired, onCancel, additionalCourses = 0 }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(10 * 60 + (additionalCourses * 5 * 60)); // 10 minutes + 5 minutes per course
  const { t, language } = useLanguage();

  // Update time when additional courses are added
  useEffect(() => {
    setTimeLeft(prev => prev + (5 * 60)); // Add 5 minutes when course count increases
  }, [additionalCourses]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeExpired();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeExpired]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isWarning = timeLeft <= 2 * 60; // Last 2 minutes
  const isCritical = timeLeft <= 60; // Last minute

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
      isCritical 
        ? 'bg-destructive/10 border-destructive text-destructive' 
        : isWarning 
        ? 'bg-yellow-500/10 border-yellow-500 text-yellow-600 dark:text-yellow-400'
        : 'bg-primary/10 border-primary text-primary'
    }`}>
      <Clock className={`h-4 w-4 ${isCritical ? 'animate-pulse' : ''}`} />
      <div className="flex flex-col">
        <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
          {formatTime(timeLeft)}
        </span>
        <span className={`text-xs opacity-75 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
          {t('cart.timeRemaining')}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 ml-1 hover:bg-current/20"
        onClick={onCancel}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};