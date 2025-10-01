import { HeroSection } from "@/components/HeroSection";
import { Header } from "@/components/Header";
import { UserTypeSelector } from "@/components/UserTypeSelector";
import { PaymentMethods } from "@/components/PaymentMethods";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <UserTypeSelector />
        <PaymentMethods />
      </main>
    </div>
  );
};

export default Index;
