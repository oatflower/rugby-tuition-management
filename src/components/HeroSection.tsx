import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Globe } from "lucide-react";
import heroImage from "@/assets/v3-copy-scaled.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Schooney Educational Payment System" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero opacity-90" />
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Shield className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="absolute top-40 right-16 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Clock className="h-8 w-8 text-white" />
        </div>
      </div>
      <div className="absolute bottom-32 left-20 animate-float" style={{ animationDelay: '4s' }}>
        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Globe className="h-7 w-7 text-white" />
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
          Welcome to
          <span className="block gradient-text bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Schooney
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-blue-100 text-balance max-w-3xl mx-auto">
          Your comprehensive educational payment system for tuition, activities, and events. 
          Secure, multilingual, and designed for the SISB community.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" className="text-lg px-8 py-6 gradient-hero text-white hover:shadow-hover transform hover:scale-105 transition-spring font-semibold">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20">
            Learn More
          </Button>
        </div>
        
        {/* Key features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 transition-smooth hover:bg-white/20">
            <Shield className="h-8 w-8 mb-4 mx-auto text-blue-200" />
            <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
            <p className="text-blue-100 text-sm">Multiple payment methods with bank-level security</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 transition-smooth hover:bg-white/20">
            <Globe className="h-8 w-8 mb-4 mx-auto text-green-200" />
            <h3 className="text-lg font-semibold mb-2">Multi-Language</h3>
            <p className="text-blue-100 text-sm">Support for Thai, English, and Chinese</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 transition-smooth hover:bg-white/20">
            <Clock className="h-8 w-8 mb-4 mx-auto text-orange-200" />
            <h3 className="text-lg font-semibold mb-2">24/7 Access</h3>
            <p className="text-blue-100 text-sm">Pay anytime, anywhere with instant confirmation</p>
          </div>
        </div>
      </div>
    </section>
  );
};