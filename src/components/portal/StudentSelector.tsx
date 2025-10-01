import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock student data
const mockStudents = [
  { id: 1, name: "Emma Johnson", class: "Grade 5A", year: "2024" },
  { id: 2, name: "Liam Johnson", class: "Grade 8B", year: "2024" },
  { id: 3, name: "Sophia Johnson", class: "Grade 11C", year: "2024" },
];

const getInitials = (name: string) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase();
};

interface StudentSelectorProps {
  onStudentChange?: (student: typeof mockStudents[0]) => void;
}

export const StudentSelector = ({ onStudentChange }: StudentSelectorProps) => {
  const [selectedStudent, setSelectedStudent] = useState(mockStudents[0]);
  const { t, language } = useLanguage();

  const handleStudentChange = (student: typeof mockStudents[0]) => {
    setSelectedStudent(student);
    onStudentChange?.(student);
    // TODO: Update all portal data based on selected student
    // await fetchStudentData(student.id);
  };

  // If only one student, show simple display
  if (mockStudents.length === 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
            {getInitials(selectedStudent.name)}
          </AvatarFallback>
        </Avatar>
        <div className={`text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
          <div className="font-medium">{selectedStudent.name}</div>
          <div className="text-muted-foreground text-xs">{selectedStudent.class}</div>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`gap-2 justify-start min-w-[200px] h-auto p-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
              {getInitials(selectedStudent.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-left flex-1">
            <div className="font-medium text-sm">{selectedStudent.name}</div>
            <div className="text-muted-foreground text-xs">{selectedStudent.class}</div>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-background/95 backdrop-blur-sm border">
        {mockStudents.map((student) => (
          <DropdownMenuItem
            key={student.id}
            onClick={() => handleStudentChange(student)}
            className={`gap-2 cursor-pointer p-3 ${
              selectedStudent.id === student.id ? 'bg-accent' : ''
            } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium text-sm">{student.name}</div>
              <div className="text-muted-foreground text-xs">
                {student.class} • {student.year}
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};