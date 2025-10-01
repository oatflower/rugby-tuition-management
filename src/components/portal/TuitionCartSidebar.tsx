import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, ShoppingCart, AlertCircle } from "lucide-react";
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
  campus: string;
}

export const TuitionCartSidebar = ({ items, onRemoveItem, onCheckout, campus }: TuitionCartSidebarProps) => {
  const { t, language, formatCurrency } = useLanguage();
  
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="sticky top-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className={`text-lg flex items-center gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <ShoppingCart className="h-5 w-5" />
            {language === 'th' ? 'รายการชำระเงิน' : 'Payment Cart'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' ? 'ยังไม่มีรายการที่เลือก' : 'No items selected'}
              </p>
              <p className={`text-xs text-muted-foreground mt-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' ? 'กดปุ่ม "เพิ่มเข้าตะกร้า" เพื่อเลือกรายการที่ต้องการชำระ' : 'Click "Add to Cart" to select items'}
              </p>
            </div>
          ) : (
            <>
              {/* Campus Info */}
              <div className="bg-primary/5 p-3 rounded-lg">
                <p className={`text-xs text-muted-foreground mb-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' ? 'Campus' : 'Campus'}
                </p>
                <p className={`font-medium text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {campus}
                </p>
              </div>

              {/* Important Note */}
              <div className="bg-warning-orange/10 border border-warning-orange/20 p-3 rounded-lg flex gap-2">
                <AlertCircle className="h-4 w-4 text-warning-orange flex-shrink-0 mt-0.5" />
                <p className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' 
                    ? 'ค่าเล่าเรียนจะแยกจาก After School และ Summer Camp' 
                    : 'Tuition fees are separate from After School and Summer Camp'}
                </p>
              </div>

              <Separator />

              {/* Cart Items */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.id}-${item.studentId}`} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium text-sm mb-1 truncate ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {item.name}
                      </h4>
                      {item.studentName && (
                        <Badge variant="outline" className={`text-xs mb-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          {item.studentName}
                        </Badge>
                      )}
                      <div className={`text-sm font-bold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {formatCurrency(item.price)}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id, item.studentId)}
                      className="text-muted-foreground hover:text-destructive p-1 h-8 w-8 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Total */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {language === 'th' ? 'รายการ' : 'Items'}: {items.length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                  <span className={`font-semibold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {language === 'th' ? 'ยอดรวม' : 'Total'}
                  </span>
                  <span className={`text-xl font-bold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button 
                onClick={onCheckout} 
                className={`w-full h-11 text-base ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
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
