import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StickyCartIconProps {
  itemCount: number;
  onClick: () => void;
}

export const StickyCartIcon = ({ itemCount, onClick }: StickyCartIconProps) => {
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={onClick}
        size="lg"
        className="relative rounded-full h-16 w-16 shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 animate-pulse hover:animate-none hover:scale-110"
      >
        <ShoppingCart className="h-7 w-7" />
        {itemCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-7 w-7 flex items-center justify-center p-0 text-sm font-bold animate-bounce"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </Badge>
        )}
      </Button>
    </div>
  );
};