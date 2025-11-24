import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmailVerificationProps {
  onEmailVerified: (email: string) => void;
}

// Mock whitelist - ในระบบจริงจะเชื่อมกับ backend
const mockWhitelist = [
  "parent@example.com",
  "test@rugby.ac.th",
  "admin@rugby.ac.th",
];

export const EmailVerification = ({ onEmailVerified }: EmailVerificationProps) => {
  const [email, setEmail] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Email Verification",
      subtitle: "Please enter your email to access the payment portal",
      emailPlaceholder: "Enter your email",
      verifyButton: "Verify Email",
      notFound: "ไม่พบ email นี้",
      contactAdmin: "Please contact school admin",
      invalidEmail: "Please enter a valid email address",
    },
    th: {
      title: "ตรวจสอบอีเมล",
      subtitle: "กรุณากรอกอีเมลเพื่อเข้าสู่ระบบชำระเงิน",
      emailPlaceholder: "กรอกอีเมลของคุณ",
      verifyButton: "ตรวจสอบอีเมล",
      notFound: "ไม่พบ email นี้",
      contactAdmin: "Please contact school admin",
      invalidEmail: "กรุณากรอกอีเมลที่ถูกต้อง",
    },
    zh: {
      title: "电子邮件验证",
      subtitle: "请输入您的电子邮件以访问付款门户",
      emailPlaceholder: "输入您的电子邮件",
      verifyButton: "验证电子邮件",
      notFound: "ไม่พบ email นี้",
      contactAdmin: "Please contact school admin",
      invalidEmail: "请输入有效的电子邮件地址",
    },
  };

  const t = translations[language];

  const handleVerifyEmail = async () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        variant: "destructive",
        title: t.invalidEmail,
      });
      return;
    }

    setIsChecking(true);

    // Simulate API call - BYPASSED: All emails proceed to OTP
    setTimeout(() => {
      // Bypass whitelist check - all emails proceed
      onEmailVerified(email);
      setIsChecking(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <img 
            src="/src/assets/rugby-logo-full.jpg" 
            alt="Rugby School Thailand" 
            className="h-20 w-auto"
          />
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-lg shadow-lg p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
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
                className="w-full"
              />
            </div>

            <Button
              onClick={handleVerifyEmail}
              disabled={isChecking || !email}
              className="w-full"
            >
              {isChecking ? "Checking..." : t.verifyButton}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-xs">
          <p>© 2024 Rugby School Thailand</p>
        </div>
      </div>
    </div>
  );
};
