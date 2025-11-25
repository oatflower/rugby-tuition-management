import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileText, Calendar } from "lucide-react";

interface CreditNote {
  id: string;
  student_id: number;
  amount: number;
  details: string;
  timestamp: string;
  status: 'active' | 'used' | 'expired';
  expiry_date: string;
}

interface CreditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditNotes: CreditNote[];
  students: Array<{ id: number; name: string }>;
}

export const CreditNoteModal = ({ isOpen, onClose, creditNotes, students }: CreditNoteModalProps) => {
  const { t, language, formatCurrency } = useLanguage();

  const getStudentName = (studentId: number) => {
    return students.find(s => s.id === studentId)?.name || '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 text-2xl ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <FileText className="h-6 w-6" />
            {t('portal.creditNotes')}
          </DialogTitle>
          <DialogDescription className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
            {t('portal.creditNotesDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {creditNotes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('portal.noCreditNotes')}
            </div>
          ) : (
            creditNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-2">
                      <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm sm:text-base ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          {note.details}
                        </p>
                        <p className={`text-xs text-muted-foreground mt-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          {getStudentName(note.student_id)} • {note.id}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                        {t('portal.issued')}: {new Date(note.timestamp).toLocaleDateString(
                          language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-US',
                          { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                        )}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                        {t('portal.expires')}: {new Date(note.expiry_date).toLocaleDateString(
                          language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-US',
                          { year: 'numeric', month: 'short', day: 'numeric' }
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="default" className="text-base font-bold px-3 py-1">
                      {formatCurrency(note.amount)}
                    </Badge>
                    <Badge 
                      variant={note.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {t(`portal.creditStatus.${note.status}`)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {creditNotes.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className={`text-lg font-semibold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('portal.totalCredit')}
              </span>
              <span className={`text-2xl font-bold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {formatCurrency(
                  creditNotes
                    .filter(note => note.status === 'active')
                    .reduce((sum, note) => sum + note.amount, 0)
                )}
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
