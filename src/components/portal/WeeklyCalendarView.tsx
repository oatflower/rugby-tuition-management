import { useState } from "react";
import { Calendar, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface CalendarCourse {
  id: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  isInCart?: boolean;
  isMandatory?: boolean;
  studentName?: string;
  studentColor?: string;
}

interface WeeklyCalendarViewProps {
  courses: CalendarCourse[];
  mandatoryCourses?: CalendarCourse[];
}

export const WeeklyCalendarView = ({ courses, mandatoryCourses = [] }: WeeklyCalendarViewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { language, t } = useLanguage();

  // Combine both course types
  const allCourses = [...mandatoryCourses, ...courses];

  const days = [
    { key: 'Mon', label: language === 'th' ? 'จันทร์' : 'Monday', date: '9' },
    { key: 'Tue', label: language === 'th' ? 'อังคาร' : 'Tuesday', date: '10' },
    { key: 'Wed', label: language === 'th' ? 'พุธ' : 'Wednesday', date: '11' },
    { key: 'Thu', label: language === 'th' ? 'พฤหัสบดี' : 'Thursday', date: '12' },
    { key: 'Fri', label: language === 'th' ? 'ศุกร์' : 'Friday', date: '13' },
    { key: 'Sat', label: language === 'th' ? 'เสาร์' : 'Saturday', date: '14' },
    { key: 'Sun', label: language === 'th' ? 'อาทิตย์' : 'Sunday', date: '15' },
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const getCoursePosition = (startTime: string) => {
    const hour = parseInt(startTime.split(':')[0]);
    return (hour - 8) * 80 + 40; // Each hour = 80px, offset by header
  };

  const getCourseHeight = (startTime: string, endTime: string) => {
    const start = parseInt(startTime.split(':')[0]) + parseInt(startTime.split(':')[1]) / 60;
    const end = parseInt(endTime.split(':')[0]) + parseInt(endTime.split(':')[1]) / 60;
    return (end - start) * 80;
  };

  const getCoursesForDay = (dayKey: string) => {
    return allCourses.filter(course => course.day === dayKey);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Toggle Button */}
      <div className="flex justify-center mb-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`rounded-t-lg rounded-b-none shadow-lg ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
        >
          <Calendar className="h-4 w-4 mr-2" />
          {language === 'th' ? 'ปฏิทินรายสัปดาห์' : 'Weekly Schedule'}
          {isExpanded ? <ChevronDown className="ml-2 h-4 w-4" /> : <ChevronUp className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      {/* Calendar View */}
      {isExpanded && (
        <Card className="rounded-none rounded-t-lg shadow-2xl max-h-[70vh] overflow-auto bg-background/95 backdrop-blur-sm">
          <div className="p-4">
            {/* Legend */}
            <div className="mb-4 flex flex-wrap gap-4 items-center justify-center text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-destructive/80 rounded"></div>
                <span className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                  {language === 'th' ? 'วิชาบังคับ (ไม่สามารถยกเลิก)' : 'Mandatory Course (Cannot Cancel)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary rounded"></div>
                <span className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                  {language === 'th' ? 'วิชาที่เลือก (อยู่ในตะกร้า)' : 'Selected Course (In Cart)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-education-blue/80 rounded"></div>
                <span className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                  {language === 'th' ? 'วิชาที่สามารถเลือกได้' : 'Available Course'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-8 gap-2">
              {/* Time Column */}
              <div className="col-span-1">
                <div className="h-10 flex items-center justify-center font-medium text-xs">
                  {language === 'th' ? 'เวลา' : 'Time'}
                </div>
                {timeSlots.map((time) => (
                  <div key={time} className="h-20 flex items-start justify-center text-xs text-muted-foreground border-t pt-1">
                    {time}
                  </div>
                ))}
              </div>

              {/* Day Columns */}
              {days.map((day) => {
                const dayCourses = getCoursesForDay(day.key);
                return (
                  <div key={day.key} className="col-span-1 relative">
                    {/* Day Header */}
                    <div className="h-10 flex flex-col items-center justify-center border-b-2 border-primary/20 bg-primary/5">
                      <div className={`text-sm font-semibold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {day.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {day.date}
                      </div>
                    </div>

                    {/* Time Grid */}
                    <div className="relative" style={{ height: `${timeSlots.length * 80}px` }}>
                      {timeSlots.map((_, index) => (
                        <div
                          key={index}
                          className="absolute w-full h-20 border-t border-border/30"
                          style={{ top: `${index * 80}px` }}
                        />
                      ))}

                      {/* Course Blocks */}
                      {dayCourses.map((course) => (
                        <div
                          key={course.id}
                          className={`absolute w-full px-1 rounded shadow-md overflow-hidden border-2 ${
                            course.isMandatory
                              ? 'bg-destructive/80 text-white border-destructive'
                              : course.isInCart 
                                ? 'bg-primary text-primary-foreground border-primary' 
                                : 'bg-education-blue/80 text-white border-education-blue'
                          }`}
                          style={{
                            top: `${getCoursePosition(course.startTime)}px`,
                            height: `${getCourseHeight(course.startTime, course.endTime)}px`,
                          }}
                        >
                          <div className="p-1 h-full flex flex-col">
                            <div className={`text-xs font-semibold leading-tight line-clamp-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                              {course.name}
                              {course.studentName && (
                                <span className="text-[9px] block opacity-90">({course.studentName})</span>
                              )}
                            </div>
                            <div className="text-[10px] opacity-90 mt-0.5">
                              {course.startTime}-{course.endTime}
                            </div>
                            <div className="text-[10px] opacity-75 truncate mt-auto">
                              📍 {course.location}
                            </div>
                            {course.isMandatory && (
                              <Badge variant="secondary" className="text-[8px] py-0 px-1 mt-1 bg-white/20">
                                🔒 {language === 'th' ? 'บังคับ' : 'Required'}
                              </Badge>
                            )}
                            {course.isInCart && !course.isMandatory && (
                              <Badge variant="secondary" className="text-[8px] py-0 px-1 mt-1">
                                {language === 'th' ? 'ในตะกร้า' : 'In Cart'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};