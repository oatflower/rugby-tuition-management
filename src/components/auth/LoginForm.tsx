import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FaGoogle, FaMicrosoft, FaGraduationCap, FaSchool } from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";

const loginSchema = z.object({
  username: z.string().min(1, "Email or phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLogin: () => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
}

const ssoProviders = [
  { 
    name: "Touchline", 
    icon: FaGraduationCap, 
    color: "bg-green-500 hover:bg-green-600 text-white"
  },
];

export const LoginForm = ({ onLogin, onForgotPassword, onSignUp }: LoginFormProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [ssoLoading, setSsoLoading] = useState<string | null>(null);
  const { t } = useLanguage();

  const loginSchema = z.object({
    username: z.string().min(1, t('auth.errors.emailRequired')),
    password: z.string().min(6, t('auth.errors.passwordMin')),
    rememberMe: z.boolean().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: LoginFormData) => {
    setLoading("form");
    console.log("Login attempt:", { ...data, password: "[HIDDEN]" });
    
    // Mock login delay
    setTimeout(() => {
      setLoading(null);
      onLogin();
    }, 1500);
  };

  const handleSSOLogin = async (provider: string) => {
    setSsoLoading(provider);
    console.log(`SSO login with ${provider}`);
    
    // Mock SSO login delay
    setTimeout(() => {
      setSsoLoading(null);
      onLogin();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">{t('auth.email')}</Label>
          <Input
            id="username"
            type="text"
            placeholder={t('auth.email')}
            {...register("username")}
            className={errors.username ? "border-red-500" : ""}
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Input
            id="password"
            type="password"
            placeholder={t('auth.password')}
            {...register("password")}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMe || false}
              onCheckedChange={(checked) => setValue("rememberMe", !!checked)}
            />
            <Label
              htmlFor="rememberMe"
              className="text-sm font-normal cursor-pointer"
            >
              {t('auth.rememberMe')}
            </Label>
          </div>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onForgotPassword}
            className="text-primary hover:text-primary/80 p-0 h-auto"
          >
            {t('auth.forgotPassword')}?
          </Button>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || loading === "form"}
        >
          {loading === "form" ? `${t('auth.login')}...` : t('auth.login')}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">{t('auth.orContinueWith')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {ssoProviders.map((provider) => {
          const IconComponent = provider.icon;
          return (
            <Button
              key={provider.name}
              variant="outline"
              size="sm"
              className={`${
                ssoLoading === provider.name ? "opacity-50" : ""
              }`}
              onClick={() => handleSSOLogin(provider.name)}
              disabled={ssoLoading !== null || loading !== null}
            >
              <IconComponent className="mr-2 h-4 w-4" />
              {ssoLoading === provider.name ? "..." : provider.name}
            </Button>
          );
        })}
      </div>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">{t('auth.noAccount')} </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSignUp}
          className="text-primary hover:text-primary/80 p-0 h-auto underline"
        >
          {t('auth.signUpHere')}
        </Button>
      </div>
    </div>
  );
};