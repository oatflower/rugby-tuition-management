import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, Globe } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Schooney</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Educational Payment System</p>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-smooth">
              Features
            </a>
            <a href="#payments" className="text-muted-foreground hover:text-primary transition-smooth">
              Payment Methods
            </a>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-smooth">
              About
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-primary transition-smooth">
              Contact
            </a>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">English</span>
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Login
            </Button>
            <Button variant="default" size="sm" className="hidden sm:flex">
              Sign Up
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border bg-white/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-muted-foreground hover:text-primary transition-smooth">
                Features
              </a>
              <a href="#payments" className="block px-3 py-2 text-muted-foreground hover:text-primary transition-smooth">
                Payment Methods
              </a>
              <a href="#about" className="block px-3 py-2 text-muted-foreground hover:text-primary transition-smooth">
                About
              </a>
              <a href="#contact" className="block px-3 py-2 text-muted-foreground hover:text-primary transition-smooth">
                Contact
              </a>
              <div className="flex gap-2 px-3 py-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Login
                </Button>
                <Button variant="default" size="sm" className="flex-1">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};