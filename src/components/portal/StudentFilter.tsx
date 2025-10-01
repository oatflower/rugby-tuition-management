import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockStudents } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";

const getInitials = (name: string) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase();
};

interface StudentFilterProps {
  onStudentChange?: (student: typeof mockStudents[0]) => void;
  selectedStudent?: typeof mockStudents[0];
  showAllOption?: boolean;
}

export const StudentFilter = ({ onStudentChange, selectedStudent, showAllOption = false }: StudentFilterProps) => {
  const [selected, setSelected] = useState(selectedStudent || mockStudents[0]);
  const { t, language } = useLanguage();

  const handleStudentChange = (student: typeof mockStudents[0]) => {
    setSelected(student);
    onStudentChange?.(student);
  };

  const handleShowAll = () => {
    onStudentChange?.(null as any); // Signal to show all students
  };

  const allOption = {
    id: 'all',
    name: t('portal.allStudents'),
    class: '',
    year: '',
    avatar: '👥'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 h-auto px-3 py-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
              {showAllOption && !selected ? 
                <Users className="h-3 w-3" /> : 
                getInitials(selected?.name || '')
              }
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {showAllOption && !selected ? allOption.name : selected?.name}
            </span>
            {selected && (
              <span className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {selected.class}
              </span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-background/95 backdrop-blur-sm border">
        {showAllOption && (
          <DropdownMenuItem
            onClick={handleShowAll}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2 w-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                  <Users className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {allOption.name}
                </span>
              </div>
            </div>
          </DropdownMenuItem>
        )}
        {mockStudents.map((student) => (
          <DropdownMenuItem
            key={student.id}
            onClick={() => handleStudentChange(student)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2 w-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                  {getInitials(student.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {student.name}
                </span>
                <span className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {student.class}
                </span>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};