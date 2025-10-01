import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Trash2, CalendarIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface SignUpProps {
  onSignUp: () => void;
  onBackToLogin: () => void;
}

const campuses = ["Main Campus", "North Campus", "South Campus", "International Campus"];

export const SignUp = ({ onSignUp, onBackToLogin }: SignUpProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { t } = useLanguage();

  const titles = [
    { value: "mr", label: t('auth.titles.mr') },
    { value: "mrs", label: t('auth.titles.mrs') },
    { value: "ms", label: t('auth.titles.ms') },
    { value: "dr", label: t('auth.titles.dr') },
    { value: "prof", label: t('auth.titles.prof') }
  ];


  const signUpSchema = z.object({
    title: z.string().min(1, t('auth.errors.titleRequired')),
    firstName: z.string().min(1, t('auth.errors.firstNameRequired')),
    lastName: z.string().min(1, t('auth.errors.lastNameRequired')),
    phoneNumber: z.string().min(1, t('auth.errors.phoneRequired')),
    email: z.string().email(t('auth.errors.emailInvalid')),
    password: z.string().min(6, t('auth.errors.passwordMin')),
    confirmPassword: z.string().min(1, t('auth.errors.passwordConfirmRequired')),
    children: z.array(z.object({
      firstName: z.string().min(1, t('auth.errors.firstNameRequired')),
      lastName: z.string().min(1, t('auth.errors.lastNameRequired')),
      dateOfBirth: z.date({ required_error: "Date of birth is required" }),
      campus: z.string().min(1, "Campus is required"),
    })).min(1, "At least one child is required"),
    agreeTerms: z.boolean().refine(val => val === true, {
      message: t('auth.errors.agreeTermsRequired'),
    }),
    agreePDPA: z.boolean().refine(val => val === true, {
      message: t('auth.errors.agreePDPARequired'),
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('auth.errors.passwordMismatch'),
    path: ["confirmPassword"],
  });

  type SignUpData = z.infer<typeof signUpSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    setValue,
    trigger,
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      children: [{ firstName: "", lastName: "", dateOfBirth: undefined, campus: "" }],
      agreeTerms: false,
      agreePDPA: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "children",
  });

  const agreeTerms = watch("agreeTerms");
  const agreePDPA = watch("agreePDPA");

  const onSubmit = async (data: SignUpData) => {
    console.log("Sign up data:", { ...data, password: "[HIDDEN]", confirmPassword: "[HIDDEN]" });
    
    // Mock registration delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    onSignUp();
  };

  const nextStep = async () => {
    const isValid = await trigger([
      "title", "firstName", "lastName", "phoneNumber", 
      "email", "password", "confirmPassword"
    ]);
    
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const addChild = () => {
    if (fields.length < 5) {
      append({ firstName: "", lastName: "", dateOfBirth: undefined, campus: "" });
    }
  };

  const removeChild = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={currentStep === 1 ? 50 : 100} className="h-2" />
        <p className="text-sm text-muted-foreground text-center">
          {t('common.step')} {currentStep} {t('common.of')} 2: {currentStep === 1 ? t('auth.step1') : t('auth.step2')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-base">1. {t('auth.step1')}</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t('auth.title')}*</Label>
                <Select onValueChange={(value) => setValue("title", value)}>
                  <SelectTrigger className={errors.title ? "border-red-500" : ""}>
                    <SelectValue placeholder={t('auth.selectTitle')} />
                  </SelectTrigger>
                  <SelectContent>
                    {titles.map((title) => (
                      <SelectItem key={title.value} value={title.value}>{title.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">{t('auth.firstName')}*</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">{t('auth.lastName')}*</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">{t('auth.phoneNumber')}*</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+66 XX XXX XXXX"
                {...register("phoneNumber")}
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}*</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}*</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}*</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="button"
              onClick={nextStep}
              className="w-full"
            >
              {t('auth.nextChildrenInfo')}
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-base">2. {t('auth.step2')}</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addChild}
                disabled={fields.length >= 5}
                className="text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                {t('auth.addChild')} ({fields.length}/5)
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-sm">{t('auth.child')} {index + 1}</h5>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChild(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1">
                     <Label>{t('auth.firstName')}*</Label>
                     <Input
                       {...register(`children.${index}.firstName`)}
                       className={errors.children?.[index]?.firstName ? "border-red-500" : ""}
                     />
                     {errors.children?.[index]?.firstName && (
                       <p className="text-xs text-red-500">{errors.children[index]?.firstName?.message}</p>
                     )}
                   </div>

                   <div className="space-y-1">
                     <Label>{t('auth.lastName')}*</Label>
                     <Input
                       {...register(`children.${index}.lastName`)}
                       className={errors.children?.[index]?.lastName ? "border-red-500" : ""}
                     />
                     {errors.children?.[index]?.lastName && (
                       <p className="text-xs text-red-500">{errors.children[index]?.lastName?.message}</p>
                     )}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Date of Birth*</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !watch(`children.${index}.dateOfBirth`) && "text-muted-foreground",
                            errors.children?.[index]?.dateOfBirth && "border-red-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {watch(`children.${index}.dateOfBirth`) ? (
                            format(watch(`children.${index}.dateOfBirth`), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={watch(`children.${index}.dateOfBirth`)}
                          onSelect={(date) => setValue(`children.${index}.dateOfBirth`, date)}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.children?.[index]?.dateOfBirth && (
                      <p className="text-xs text-red-500">{errors.children[index]?.dateOfBirth?.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                  <Label>{t('auth.campus')}*</Label>
                  <Select onValueChange={(value) => setValue(`children.${index}.campus`, value)}>
                    <SelectTrigger className={errors.children?.[index]?.campus ? "border-red-500" : ""}>
                      <SelectValue placeholder={t('auth.selectCampus')} />
                    </SelectTrigger>
                      <SelectContent>
                        {campuses.map((campus) => (
                          <SelectItem key={campus} value={campus}>{campus}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.children?.[index]?.campus && (
                      <p className="text-xs text-red-500">{errors.children[index]?.campus?.message}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreeTerms"
                  checked={agreeTerms || false}
                  onCheckedChange={(checked) => setValue("agreeTerms", !!checked)}
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="agreeTerms"
                    className="text-sm font-normal cursor-pointer leading-tight"
                  >
                    {t('auth.acceptTerms')}{" "}
                    <Dialog>
                      <DialogTrigger asChild>
                        <button type="button" className="text-primary hover:underline font-medium">
                          {t('auth.termsOfService')}
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{t('auth.termsOfService')}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 text-sm">
                          <h3 className="font-semibold">1. Acceptance of Terms</h3>
                          <p>By registering and using this parent portal, you agree to comply with and be bound by these Terms and Conditions.</p>
                          
                          <h3 className="font-semibold">2. Account Registration</h3>
                          <p>You must provide accurate and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials.</p>
                          
                          <h3 className="font-semibold">3. Use of Service</h3>
                          <p>The parent portal is provided for accessing your children's academic information, making payments, and communicating with the school. Misuse of the service is prohibited.</p>
                          
                          <h3 className="font-semibold">4. Privacy and Data Protection</h3>
                          <p>We are committed to protecting your privacy and handling your personal data in accordance with applicable privacy laws and our Privacy Policy.</p>
                          
                          <h3 className="font-semibold">5. Payment Terms</h3>
                          <p>All fees must be paid in accordance with the school's payment schedule. Late payments may incur additional charges.</p>
                          
                          <h3 className="font-semibold">6. Limitation of Liability</h3>
                          <p>The school shall not be liable for any indirect, incidental, or consequential damages arising from the use of this portal.</p>
                          
                          <h3 className="font-semibold">7. Modifications</h3>
                          <p>We reserve the right to modify these terms at any time. Changes will be effective upon posting to the portal.</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                    *
                  </Label>
                  {errors.agreeTerms && (
                    <p className="text-xs text-red-500">{errors.agreeTerms.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreePDPA"
                  checked={agreePDPA || false}
                  onCheckedChange={(checked) => setValue("agreePDPA", !!checked)}
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="agreePDPA"
                    className="text-sm font-normal cursor-pointer leading-tight"
                  >
                    {t('auth.acceptTerms')}{" "}{t('auth.and')}{" "}
                    <Dialog>
                      <DialogTrigger asChild>
                        <button type="button" className="text-primary hover:underline font-medium">
                          {t('auth.privacyPolicy')}
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{t('auth.privacyPolicy')}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 text-sm">
                          <h3 className="font-semibold">Data Collection and Use</h3>
                          <p>We collect and process your personal data in accordance with the Personal Data Protection Act. This includes information about you and your children for educational and administrative purposes.</p>
                          
                          <h3 className="font-semibold">Types of Data Collected</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Personal identification information (name, address, phone number, email)</li>
                            <li>Student academic records and progress information</li>
                            <li>Financial information for billing and payment processing</li>
                            <li>Emergency contact information</li>
                            <li>Medical information relevant to student care</li>
                          </ul>
                          
                          <h3 className="font-semibold">Purpose of Data Processing</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Providing educational services to your children</li>
                            <li>Communication between school and parents</li>
                            <li>Billing and payment processing</li>
                            <li>Emergency situations and student welfare</li>
                            <li>Compliance with legal and regulatory requirements</li>
                          </ul>
                          
                          <h3 className="font-semibold">Data Security</h3>
                          <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>
                          
                          <h3 className="font-semibold">Your Rights</h3>
                          <p>You have the right to access, correct, or request deletion of your personal data. You may also withdraw consent for certain data processing activities.</p>
                          
                          <h3 className="font-semibold">Data Retention</h3>
                          <p>We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected or as required by law.</p>
                          
                          <h3 className="font-semibold">Contact Information</h3>
                          <p>If you have any questions about our data protection practices, please contact our Data Protection Officer at privacy@school.edu</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                    *
                  </Label>
                  {errors.agreePDPA && (
                    <p className="text-xs text-red-500">{errors.agreePDPA.message}</p>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? `${t('auth.signup')}...` : t('auth.signup')}
            </Button>
          </div>
        )}
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">{t('auth.hasAccount')} </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToLogin}
          className="text-primary hover:text-primary/80 p-0 h-auto underline"
        >
          {t('auth.signInHere')}
        </Button>
      </div>
    </div>
  );
};