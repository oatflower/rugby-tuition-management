import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface OTPVerificationProps {
  email: string;
  onOTPVerified: () => void;
  onBack: () => void;
}

// Mock OTP - ในระบบจริงจะส่งทาง email
const MOCK_OTP = "123456";

export const OTPVerification = ({ email, onOTPVerified, onBack }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Enter OTP",
      subtitle: "We've sent a 6-digit code to",
      otpLabel: "OTP Code",
      verifyButton: "Verify & Login",
      backButton: "Back",
      invalidOTP: "Invalid OTP code",
      tryAgain: "Please try again",
      otpSent: "For demo: OTP is 123456",
    },
    th: {
      title: "กรอกรหัส OTP",
      subtitle: "เราได้ส่งรหัส 6 หลักไปยัง",
      otpLabel: "รหัส OTP",
      verifyButton: "ยืนยันและเข้าสู่ระบบ",
      backButton: "ย้อนกลับ",
      invalidOTP: "รหัส OTP ไม่ถูกต้อง",
      tryAgain: "กรุณาลองอีกครั้ง",
      otpSent: "สำหรับทดสอบ: OTP คือ 123456",
    },
    zh: {
      title: "输入 OTP",
      subtitle: "我们已向以下地址发送了 6 位数代码",
      otpLabel: "OTP 代码",
      verifyButton: "验证并登录",
      backButton: "返回",
      invalidOTP: "OTP 代码无效",
      tryAgain: "请重试",
      otpSent: "演示用：OTP 为 123456",
    },
  };

  const t = translations[language];

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      return;
    }

    setIsVerifying(true);

    // Simulate API call
    setTimeout(() => {
      if (otp === MOCK_OTP) {
        // OTP correct - proceed to portal
        toast({
          title: "Success!",
          description: "Login successful",
        });
        onOTPVerified();
      } else {
        // OTP incorrect
        toast({
          variant: "destructive",
          title: t.invalidOTP,
          description: t.tryAgain,
        });
        setOtp("");
      }

      setIsVerifying(false);
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
            <p className="text-sm font-medium text-foreground">{email}</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t.otpLabel}
              </label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={isVerifying}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                {t.otpSent}
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleVerifyOTP}
                disabled={isVerifying || otp.length !== 6}
                className="w-full"
              >
                {isVerifying ? "Verifying..." : t.verifyButton}
              </Button>

              <Button
                onClick={onBack}
                variant="outline"
                disabled={isVerifying}
                className="w-full"
              >
                {t.backButton}
              </Button>
            </div>
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
