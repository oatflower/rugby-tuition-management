import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, GraduationCap, Clock, Sun, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { mockStudents, getMockDataForStudent, mockSummerActivities } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";

export const ChildrenOverview = () => {
  const [open, setOpen] = useState(false);
  const { t, language } = useLanguage();

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const getEnrollmentStatus = (studentId: number) => {
    const studentData = getMockDataForStudent(studentId);
    const { invoices, courses } = studentData;

    // Tuition status
    let tuitionStatus: 'paid' | 'pending' | 'none' = 'none';
    if (invoices.length > 0) {
      const hasPaidInvoice = invoices.find(inv => inv.status === 'paid');
      tuitionStatus = hasPaidInvoice ? 'paid' : 'pending';
    }

    // Afterschool activities (assuming some are enrolled based on mock data)
    const afterschoolActivities = courses.filter(course => 
      // Simulate some enrolled activities based on student ID
      (studentId === 1 && ['course-002'].includes(course.id)) ||
      (studentId === 2 && ['course-001', 'course-003'].includes(course.id)) ||
      (studentId === 3 && ['course-004'].includes(course.id))
    );

    // Summer activities (simulate enrollment)
    const summerActivities = mockSummerActivities.filter(activity =>
      (studentId === 1 && ['summer-001'].includes(activity.id)) ||
      (studentId === 2 && ['summer-002', 'summer-003'].includes(activity.id)) ||
      (studentId === 3 && ['summer-001'].includes(activity.id))
    );

    return {
      tuitionStatus,
      afterschoolActivities,
      summerActivities
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-finance-green" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-warning-orange" />;
      default:
        return <XCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className={`bg-finance-green/20 text-finance-green ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.paid')}</Badge>;
      case 'pending':
        return <Badge className={`bg-warning-orange/20 text-warning-orange ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.pendingStatus')}</Badge>;
      default:
        return <Badge variant="outline" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>{t('portal.noInvoice')}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={`gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
          <Eye className="h-4 w-4" />
          {t('portal.viewAllChildren')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <GraduationCap className="h-5 w-5" />
            {t('portal.childrenOverviewTitle')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {mockStudents.map((student) => {
            const enrollment = getEnrollmentStatus(student.id);
            
            return (
              <Card key={student.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                          {getInitials(student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className={`text-lg ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{student.name}</CardTitle>
                        <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          {student.class} • {student.year}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Tuition Status */}
                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                        <GraduationCap className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">{t('portal.tuitionStatus')}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className={`flex items-center gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {getStatusIcon(enrollment.tuitionStatus)}
                        <span>{t('portal.academicYear')}</span>
                      </div>
                      {getStatusBadge(enrollment.tuitionStatus)}
                    </div>
                  </div>

                  {/* Afterschool Activities */}
                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">{t('portal.afterSchoolActivities')}</span>
                    </div>
                    {enrollment.afterschoolActivities.length > 0 ? (
                      <div className="space-y-2">
                        {enrollment.afterschoolActivities.map((activity) => (
                          <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <span className={`font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{activity.name}</span>
                              <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{activity.schedule}</p>
                            </div>
                            <Badge className={`bg-finance-green/20 text-finance-green ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.enrolled')}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`p-3 bg-muted/50 rounded-lg text-center text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {t('portal.noAfterSchoolEnrolled')}
                      </div>
                    )}
                  </div>

                  {/* Summer Activities */}
                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                        <Sun className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">{t('portal.summerActivities')}</span>
                    </div>
                    {enrollment.summerActivities.length > 0 ? (
                      <div className="space-y-2">
                        {enrollment.summerActivities.map((activity) => (
                          <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <span className={`font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{activity.name}</span>
                              <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{activity.schedule}</p>
                            </div>
                            <Badge className={`bg-finance-green/20 text-finance-green ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.enrolled')}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`p-3 bg-muted/50 rounded-lg text-center text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {t('portal.noSummerEnrolled')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};