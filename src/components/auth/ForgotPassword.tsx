import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import emailSentIcon from "@/assets/email-sent-icon.png";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordProps {
  onBackToLogin: () => void;
  onStateChange?: (isSuccess: boolean, email?: string) => void;
}

export const ForgotPassword = ({ onBackToLogin, onStateChange }: ForgotPasswordProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useLanguage();

  const forgotPasswordSchema = z.object({
    email: z.string().email(t('auth.errors.emailInvalid')),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    console.log("Password reset request for:", data.email);
    
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    onStateChange?.(true, data.email);
  };

  const handleBackToLogin = () => {
    setIsSubmitted(false);
    onStateChange?.(false);
    onBackToLogin();
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-20 h-20 mx-auto animate-bounce">
          <img 
            src={emailSentIcon} 
            alt="Email Sent" 
            className="w-full h-full object-contain animate-pulse"
          />
        </div>

        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            {t('auth.checkInboxMessage')}
          </p>
          
          <Button
            variant="ghost"
            onClick={handleBackToLogin}
            className="w-full text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('auth.backToLogin')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('auth.email')}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t('auth.email')}
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? `${t('auth.sendResetLink')}...` : t('auth.sendResetLink')}
        </Button>
      </form>

      <div className="text-center">
        <Button
          variant="ghost"
          onClick={handleBackToLogin}
          className="text-primary hover:text-primary/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('auth.backToLogin')}
        </Button>
      </div>
    </div>
  );
};