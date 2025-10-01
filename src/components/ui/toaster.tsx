import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useLanguage } from "@/contexts/LanguageContext"

export function Toaster() {
  const { toasts } = useToast()
  const { language } = useLanguage()

  const getFontClass = () => {
    switch (language) {
      case 'th': return 'font-sukhumvit';
      case 'zh': return 'font-noto-sc';
      default: return 'font-lato';
    }
  };

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle className={getFontClass()}>{title}</ToastTitle>}
              {description && (
                <ToastDescription className={getFontClass()}>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
