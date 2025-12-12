import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, ShoppingCart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TuitionCartItem {
  id: string;
  name: string;
  price: number;
  studentName?: string;
  studentId?: string;
}

interface TuitionCartSidebarProps {
  items: TuitionCartItem[];
  onRemoveItem: (itemId: string, studentId?: string) => void;
  onCheckout: () => void;
}

export const TuitionCartSidebar = ({ items, onRemoveItem, onCheckout }: TuitionCartSidebarProps) => {
  const { t, language, formatCurrency } = useLanguage();
  
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  return (
    <div className="lg:sticky lg:top-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className={`text-base sm:text-lg flex items-center gap-2 ${fontClass}`}>
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            {language === 'th' ? 'รายการชำระเงิน' : 'Payment Cart'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 pb-3 sm:pb-6">
          {items.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-2 sm:mb-3 opacity-50" />
              <p className={`text-xs sm:text-sm text-muted-foreground ${fontClass}`}>
                {language === 'th' ? 'ยังไม่มีรายการที่เลือก' : 'No items selected'}
              </p>
              <p className={`text-[10px] sm:text-xs text-muted-foreground mt-1 ${fontClass}`}>
                {language === 'th' ? 'กดปุ่ม "เพิ่มเข้าตะกร้า" เพื่อเลือกรายการที่ต้องการชำระ' : 'Click "Add to Cart" to select items'}
              </p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-2 sm:space-y-3 max-h-[200px] sm:max-h-[300px] overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.id}-${item.studentId}`} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium text-xs sm:text-sm mb-1 truncate ${fontClass}`}>
                        {item.name}
                      </h4>
                      {item.studentName && (
                        <Badge variant="outline" className={`text-[10px] sm:text-xs mb-1 sm:mb-2 ${fontClass}`}>
                          {item.studentName}
                        </Badge>
                      )}
                      <div className={`text-xs sm:text-sm font-bold text-primary ${fontClass}`}>
                        {formatCurrency(item.price)}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id, item.studentId)}
                      className="text-muted-foreground hover:text-destructive p-1 h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0"
                    >
                      <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Total */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-xs sm:text-sm text-muted-foreground ${fontClass}`}>
                    {language === 'th' ? 'รายการ' : 'Items'}: {items.length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-2 sm:p-3 bg-primary/5 rounded-lg">
                  <span className={`font-semibold text-sm sm:text-base ${fontClass}`}>
                    {language === 'th' ? 'ยอดรวม' : 'Total'}
                  </span>
                  <span className={`text-lg sm:text-xl font-bold text-primary ${fontClass}`}>
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button 
                onClick={onCheckout} 
                className={`w-full h-10 sm:h-11 text-sm sm:text-base touch-manipulation ${fontClass}`}
                disabled={items.length === 0}
              >
                {language === 'th' ? 'ดำเนินการชำระเงิน' : 'Proceed to Payment'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
