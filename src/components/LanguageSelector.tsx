import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const getFontClassForLanguage = (langCode: string) => {
  switch (langCode) {
    case 'th': return 'font-sukhumvit';
    case 'en': return 'font-lato';
    case 'zh': return 'font-noto-sc';
    default: return 'font-lato';
  }
};

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
];

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`gap-2 hover:bg-primary/10 ${getFontClassForLanguage(currentLanguage.code)}`}>
          <Languages className="h-5 w-5" />
          <span className="hidden sm:inline text-sm">{currentLanguage.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as 'en' | 'th' | 'zh')}
            className={`gap-3 cursor-pointer p-3 ${getFontClassForLanguage(lang.code)} ${
              currentLanguage.code === lang.code ? 'bg-accent' : ''
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="font-medium">{lang.nativeName}</span>
            {currentLanguage.code === lang.code && (
              <span className="ml-auto text-xs text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};