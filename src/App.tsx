import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoadingScreen } from "./components/LoadingScreen";
import { ParentPortal } from "./pages/ParentPortal";
import { CartPage } from "./pages/Cart";
import { CheckoutPage } from "./pages/Checkout";
import { ActivityPaymentSuccess } from "./components/portal/ActivityPaymentSuccess";
import { EmailVerification } from "./pages/EmailVerification";
import { OTPVerification } from "./pages/OTPVerification";
import { LanguageProvider } from "./contexts/LanguageContext";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [showOTP, setShowOTP] = useState(false);
  const [currentPage, setCurrentPage] = useState<'portal' | 'cart' | 'checkout' | 'success'>('portal');
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [paymentSuccessData, setPaymentSuccessData] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showCountdown, setShowCountdown] = useState(false);

  // Simulate loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    setCurrentPage('portal');
  };

  const handleGoToCart = () => {
    setCurrentPage('cart');
  };

  const handleAddToCart = (item: any) => {
    // Check if item already exists in cart
    const existingItem = cartItems.find(cartItem => 
      cartItem.id === item.id && 
      cartItem.studentId === item.studentId
    );
    
    if (!existingItem) {
      setCartItems(prev => [...prev, item]);
      
      // Start countdown timer if adding after school or summer items
      if (item.type === 'activity' || item.category === 'after-school' || item.category === 'summer') {
        setShowCountdown(true);
      }
      
      return true;
    }
    return false;
  };

  const handleRemoveFromCart = (itemId: string, studentId?: string) => {
    setCartItems(prev => {
      const newItems = prev.filter(item => 
        !(item.id === itemId && item.studentId === studentId)
      );
      
      // Hide countdown if no after school or summer items left
      const hasActivityItems = newItems.some(item => 
        item.type === 'activity' || item.category === 'after-school' || item.category === 'summer'
      );
      if (!hasActivityItems) {
        setShowCountdown(false);
      }
      
      return newItems;
    });
  };

  const isInCart = (itemId: string, studentId?: string) => {
    return cartItems.some(item => 
      item.id === itemId && 
      (studentId ? item.studentId === studentId : true)
    );
  };

  const handleGoToCheckout = (data: any) => {
    setCheckoutData(data);
    setCurrentPage('checkout');
  };

  const handleBackToPortal = () => {
    setCurrentPage('portal');
  };

  const handleBackToCart = () => {
    setCurrentPage('cart');
  };

  const handlePaymentSuccess = (paymentData: any) => {
    setPaymentSuccessData(paymentData);
    setCurrentPage('success');
    // Clear cart items after successful payment
    setCartItems([]);
    // Hide countdown
    setShowCountdown(false);
  };

  const handleCountdownExpired = () => {
    // Remove all after school and summer items from cart
    setCartItems(prev => prev.filter(item => 
      !(item.type === 'activity' || item.category === 'after-school' || item.category === 'summer')
    ));
    setShowCountdown(false);
  };

  const handleCancelCountdown = () => {
    // Remove all after school and summer items from cart
    setCartItems(prev => prev.filter(item => 
      !(item.type === 'activity' || item.category === 'after-school' || item.category === 'summer')
    ));
    setShowCountdown(false);
  };

  const handleBackToDashboard = () => {
    setCurrentPage('portal');
    setPaymentSuccessData(null);
    setCheckoutData(null);
  };

  const handleEmailVerified = (email: string) => {
    setUserEmail(email);
    // Bypass OTP - go directly to portal
    setIsAuthenticated(true);
  };

  const handleOTPVerified = () => {
    setIsAuthenticated(true);
    setShowOTP(false);
  };

  const handleBackToEmail = () => {
    setShowOTP(false);
    setUserEmail("");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          {isLoading ? (
            <LoadingScreen />
          ) : !isAuthenticated ? (
            showOTP ? (
              <OTPVerification
                email={userEmail}
                onOTPVerified={handleOTPVerified}
                onBack={handleBackToEmail}
              />
            ) : (
              <EmailVerification onEmailVerified={handleEmailVerified} />
            )
          ) : currentPage === 'portal' ? (
            <ParentPortal 
              onLogout={handleLogout} 
              onGoToCart={handleGoToCart}
              onGoToCheckout={handleGoToCheckout}
              cartItems={cartItems}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              isInCart={isInCart}
              showCountdown={showCountdown}
              onCountdownExpired={handleCountdownExpired}
              onCancelCountdown={handleCancelCountdown}
            />
          ) : currentPage === 'cart' ? (
            <CartPage 
              items={cartItems}
              onRemoveItem={(itemId: string) => {
                // Find the item to get its studentId
                const itemToRemove = cartItems.find(item => item.id === itemId);
                if (itemToRemove) {
                  handleRemoveFromCart(itemId, itemToRemove.studentId);
                }
              }}
              onCheckout={(items: any[]) => handleGoToCheckout({ type: 'activities', items })}
              onBackToPortal={handleBackToPortal}
            />
          ) : currentPage === 'checkout' ? (
            <CheckoutPage
              type={checkoutData?.type || 'activities'}
              invoice={checkoutData?.invoice}
              items={checkoutData?.items || cartItems}
              creditBalance={1500}
              onPaymentSuccess={handlePaymentSuccess}
              onCancel={checkoutData?.type === 'activities' ? handleBackToCart : handleBackToPortal}
              onRemoveItem={(itemId: string) => {
                if (checkoutData?.type === 'activities') {
                  const itemToRemove = cartItems.find(item => item.id === itemId);
                  if (itemToRemove) {
                    handleRemoveFromCart(itemId, itemToRemove.studentId);
                  }
                }
              }}
            />
          ) : currentPage === 'success' && paymentSuccessData ? (
            <ActivityPaymentSuccess
              studentName={paymentSuccessData.studentName || "นักเรียน"}
              paymentData={paymentSuccessData}
              onBackToMain={handleBackToDashboard}
            />
          ) : null}
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
