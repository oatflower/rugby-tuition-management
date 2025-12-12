import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, ArrowRight, Globe } from "lucide-react";
import rugbyLogo from "@/assets/rugby-logo-full.jpg";
import rugbyLogoWhite from "@/assets/rugby-logo-white.svg";
import schoolBuilding from "@/assets/rugby-school-building.jpg";

interface EmailVerificationProps {
  onEmailVerified: (email: string) => void;
}

export const EmailVerification = ({ onEmailVerified }: EmailVerificationProps) => {
  const [email, setEmail] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();
  const { language, setLanguage } = useLanguage();

  const translations = {
    en: {
      login: "Log in",
      welcome: "Welcome to parent portal",
      emailLabel: "Email",
      emailPlaceholder: "Enter your email address",
      continueButton: "Continue",
      parentPortal: "Parent Portal",
      tagline: "Manage your child's education journey",
      secureAuth: "Secure authentication powered by your school",
      copyright: "© 2024 Schooney Educational System",
      invalidEmail: "Please enter a valid email address",
    },
    th: {
      login: "เข้าสู่ระบบ",
      welcome: "ยินดีต้อนรับสู่ระบบผู้ปกครอง",
      emailLabel: "อีเมล",
      emailPlaceholder: "กรอกอีเมลของคุณ",
      continueButton: "ดำเนินการต่อ",
      parentPortal: "ระบบผู้ปกครอง",
      tagline: "จัดการการศึกษาของบุตรหลานของคุณ",
      secureAuth: "การยืนยันตัวตนที่ปลอดภัยโดยโรงเรียนของคุณ",
      copyright: "© 2024 Schooney Educational System",
      invalidEmail: "กรุณากรอกอีเมลที่ถูกต้อง",
    },
    zh: {
      login: "登录",
      welcome: "欢迎来到家长门户",
      emailLabel: "电子邮件",
      emailPlaceholder: "输入您的电子邮件地址",
      continueButton: "继续",
      parentPortal: "家长门户",
      tagline: "管理您孩子的教育旅程",
      secureAuth: "由您的学校提供安全认证",
      copyright: "© 2024 Schooney Educational System",
      invalidEmail: "请输入有效的电子邮件地址",
    },
  };

  const t = translations[language];

  const languageLabels = {
    en: "English",
    th: "ไทย",
    zh: "中文",
  };

  const handleVerifyEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        variant: "destructive",
        title: t.invalidEmail,
      });
      return;
    }

    setIsChecking(true);
    setTimeout(() => {
      onEmailVerified(email);
      setIsChecking(false);
    }, 1000);
  };

  const cycleLanguage = () => {
    const languages: Array<"en" | "th" | "zh"> = ["en", "th", "zh"];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Image with overlay (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        {/* Background Image */}
        <img 
          src={schoolBuilding} 
          alt="Rugby School Thailand" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        
        {/* Logo top left */}
        <div className="absolute top-6 left-6 z-10">
          <img 
            src={rugbyLogoWhite} 
            alt="Rugby School Thailand" 
            className="h-12 w-auto"
          />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-end p-8 pb-12 text-white w-full">
          <h2 className="text-3xl font-semibold mb-2">{t.parentPortal}</h2>
          <p className="text-lg text-white/80 mb-4">{t.tagline}</p>
          <p className="text-sm text-white/60 mb-2">{t.secureAuth}</p>
          <p className="text-xs text-white/50">{t.copyright}</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0 bg-background">
        {/* Language Selector - Top Right */}
        <div className="flex justify-end p-4 lg:p-6">
          <button
            onClick={cycleLanguage}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span>{languageLabels[language]}</span>
          </button>
        </div>

        {/* Login Form Container */}
        <div className="flex-1 flex items-center justify-center px-4 pb-8 lg:pb-0">
          <div className="w-full max-w-sm space-y-6">
            {/* Logo */}
            <div className="flex justify-center">
              <img 
                src={rugbyLogo} 
                alt="Rugby School Thailand" 
                className="h-20 w-20 rounded-full object-cover shadow-lg"
              />
            </div>

            {/* Title */}
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-semibold text-foreground">{t.login}</h1>
              <p className="text-sm text-muted-foreground">{t.welcome}</p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t.emailLabel}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isChecking) {
                        handleVerifyEmail();
                      }
                    }}
                    disabled={isChecking}
                    className="pl-10 h-11 text-base touch-manipulation"
                  />
                </div>
              </div>

              <Button
                onClick={handleVerifyEmail}
                disabled={isChecking || !email}
                className="w-full h-11 text-base touch-manipulation bg-primary hover:bg-primary/90"
              >
                {isChecking ? "..." : t.continueButton}
                {!isChecking && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Footer - Only visible on mobile */}
        <div className="lg:hidden text-center py-6 px-4 text-xs text-muted-foreground space-y-1">
          <p>{t.secureAuth}</p>
          <p>{t.copyright}</p>
        </div>
      </div>
    </div>
  );
};
