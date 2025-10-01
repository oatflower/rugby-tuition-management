import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { ForgotPassword } from "@/components/auth/ForgotPassword";
import { SignUp } from "@/components/auth/SignUp";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import schoolBuilding from "@/assets/rugby-school-building.jpg";
import sisbLogo from "@/assets/sisb-logo-new.png";

interface LoginProps {
  onLogin: () => void;
}

type AuthView = "login" | "forgot-password" | "signup";

export const Login = ({ onLogin }: LoginProps) => {
  const [currentView, setCurrentView] = useState<AuthView>("login");
  const [isForgotPasswordSuccess, setIsForgotPasswordSuccess] = useState(false);
  const [resetEmail, setResetEmail] = useState<string>("");
  const { t, getFontClass } = useLanguage();

  const handleLogin = () => {
    onLogin();
  };

  const handleSignUp = () => {
    // After successful signup, redirect to login or directly login
    setCurrentView("login");
    // Could also call onLogin() to auto-login after signup
  };

  const renderAuthView = () => {
    switch (currentView) {
      case "forgot-password":
        return (
          <ForgotPassword
            onBackToLogin={() => {
              setCurrentView("login");
              setIsForgotPasswordSuccess(false);
              setResetEmail("");
            }}
            onStateChange={(isSuccess, email) => {
              setIsForgotPasswordSuccess(isSuccess);
              if (email) setResetEmail(email);
            }}
          />
        );
      case "signup":
        return (
          <SignUp
            onSignUp={handleSignUp}
            onBackToLogin={() => setCurrentView("login")}
          />
        );
      default:
        return (
          <LoginForm
            onLogin={handleLogin}
            onForgotPassword={() => setCurrentView("forgot-password")}
            onSignUp={() => setCurrentView("signup")}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Language Switcher - Top Right */}
      <div className="absolute top-6 right-6 z-10">
        <LanguageSelector />
      </div>

      {/* Left Side - School Building Image */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center lg:fixed lg:h-screen lg:left-0 lg:top-0"
        style={{ backgroundImage: `url(${schoolBuilding})` }}
      >
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* SISB Logo - Top Left */}
        <div className="absolute top-6 left-6 z-10">
          <img 
            src={sisbLogo} 
            alt="SISB International Schools"
            className="h-20 w-auto"
          />
        </div>
        
        {/* Content - Bottom Center */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-white z-10 max-w-md px-4">
          <h2 className="text-2xl font-bold mb-2">Parent Portal</h2>
          <p className="text-lg mb-4">Manage your child's education journey</p>
          <p className="text-sm mb-6">Secure authentication powered by your school</p>
          <p className="text-xs opacity-80">© 2024 Schooney Educational System</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className={`w-full lg:w-1/2 lg:ml-[50%] flex items-center justify-center p-6 bg-background ${getFontClass()}`}>
        <Card className="w-full max-w-md border-0 shadow-none lg:shadow-lg lg:border">
          <CardHeader className="text-center space-y-4 pb-8">
            {/* Mobile Hero Image */}
            <div className="lg:hidden mb-6">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <img 
                  src={sisbLogo} 
                  alt="SISB International Schools"
                  className="h-24 w-auto"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-foreground">
                {currentView === "signup" ? t('auth.signupTitle') : 
                 currentView === "forgot-password" && isForgotPasswordSuccess ? t('auth.emailSent') :
                 currentView === "forgot-password" ? t('auth.resetPasswordTitle') : 
                 t('portal.loginTitle')}
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                {currentView === "login" && t('portal.loginSubtitle')}
                {currentView === "forgot-password" && isForgotPasswordSuccess && (
                  <span>
                    {t('auth.emailSentMessage')}<br />
                    <span className="font-medium">{resetEmail}</span>
                  </span>
                )}
                {currentView === "forgot-password" && !isForgotPasswordSuccess && t('auth.resetPasswordSubtitle')}
                {currentView === "signup" && t('auth.signupSubtitle')}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            {renderAuthView()}
            
            {currentView === "login" && (
              <div className="lg:hidden text-xs text-muted-foreground text-center mt-6 space-y-1">
                <p>Secure authentication powered by your school</p>
                <p>© 2024 Schooney Educational System</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};