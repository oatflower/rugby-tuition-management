import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { X, CheckCircle2, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PaymentProgressBar } from "./PaymentProgressBar";

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'course' | 'activity';
  studentName?: string;
}

interface CartViewProps {
  items: CartItem[];
  onRemoveItem: (itemId: string) => void;
  onCheckout: (selectedItems: CartItem[]) => void;
  onBack: () => void;
}

export const CartView = ({ items, onRemoveItem, onCheckout, onBack }: CartViewProps) => {
  const { t, language, formatCurrency } = useLanguage();
  const [selectedItems, setSelectedItems] = useState<string[]>(items.map(item => item.id));

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item.id));
    }
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectedCartItems = items.filter(item => selectedItems.includes(item.id));
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price, 0);

  // Group items by student
  const groupedItems = items.reduce((groups, item) => {
    const studentName = item.studentName || 'Unknown Student';
    if (!groups[studentName]) {
      groups[studentName] = [];
    }
    groups[studentName].push(item);
    return groups;
  }, {} as Record<string, CartItem[]>);

  const handleCheckout = () => {
    if (selectedCartItems.length > 0) {
      onCheckout(selectedCartItems);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={onBack}
                className={`cursor-pointer ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              >
                {t('portal.dashboard')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                {t('portal.cart')}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Progress Bar */}
        <PaymentProgressBar currentStep={1} />

        {items.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('portal.cartEmpty')}
              </h3>
              <p className={`text-muted-foreground mb-4 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('portal.addItemsToCart')}
              </p>
              <Button onClick={onBack} variant="outline" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Select All Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={selectedItems.length === items.length}
                    onCheckedChange={handleSelectAll}
                    id="select-all"
                  />
                  <label 
                    htmlFor="select-all"
                    className={`text-sm font-medium cursor-pointer ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                  >
                    {selectedItems.length}/{items.length} {t('portal.itemsSelected')}
                  </label>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSelectAll} className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                  {t('portal.selectAll')}
                </Button>
              </div>

              {/* Items by Student */}
              {Object.entries(groupedItems).map(([studentName, studentItems]) => (
                <Card key={studentName}>
                  <CardHeader className="pb-3">
                    <CardTitle className={`text-base ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                      {studentName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {studentItems.map((item, index) => (
                        <div key={item.id}>
                          {index > 0 && <Separator className="my-4" />}
                          <div className="flex items-start space-x-4">
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={() => handleItemSelect(item.id)}
                              className="mt-1"
                            />
                            
                            {/* Item Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-medium text-sm mb-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className={`text-xs ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                  {item.type === 'course' ? t('portal.afterSchool') : t('portal.summerActivity')}
                                </Badge>
                              </div>
                              <div className={`text-lg font-bold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {formatCurrency(item.price)}
                              </div>
                            </div>
                            
                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveItem(item.id)}
                              className="text-muted-foreground hover:text-destructive p-1 min-w-8 h-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right Side - Summary */}
            <div className="space-y-6">
              {/* Price Details */}
              <Card>
                <CardHeader>
                  <CardTitle className={`text-lg ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {t('portal.priceDetails')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {selectedItems.length} {t('portal.items')} {language === 'th' ? 'ที่เลือก' : language === 'zh' ? '已选择' : 'selected'}
                      </span>
                      <span className={`font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {t('portal.totalAmount')}
                      </span>
                      <span className={`text-xl font-bold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout} 
                    className={`w-full h-12 text-base ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                    disabled={selectedItems.length === 0}
                  >
                    {t('portal.proceedToCheckout')}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={onBack} 
                    className={`w-full ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('common.back')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};