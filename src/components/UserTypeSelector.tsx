import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users } from "lucide-react";

export const UserTypeSelector = () => {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Access Type</h2>
          <p className="text-muted-foreground text-lg">
            Select how you'd like to access the Schooney payment system
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth">
            <CardHeader className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">SISB Members</CardTitle>
              <CardDescription className="text-base">
                For current students and parents with existing SISB accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Access tuition payment options</li>
                <li>• Register for after-school activities</li>
                <li>• Summer program enrollment</li>
                <li>• Event registration and payment</li>
                <li>• Integration with SchoolBase records</li>
              </ul>
              <Button className="w-full gradient-hero text-white hover:shadow-hover transform hover:scale-105 transition-spring font-semibold">
                Login as SISB Member
              </Button>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-card hover:shadow-hover transition-smooth">
            <CardHeader className="text-center">
              <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-secondary" />
              </div>
              <CardTitle className="text-2xl">External Users</CardTitle>
              <CardDescription className="text-base">
                For non-SISB members interested in activities and events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Register for after-school activities</li>
                <li>• Join summer programs</li>
                <li>• Participate in public events</li>
                <li>• Create new account with approval</li>
                <li>• Access to select programs</li>
              </ul>
              <Button className="w-full gradient-secondary text-white hover:shadow-secondary transform hover:scale-105 transition-spring">
                Register as External User
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};