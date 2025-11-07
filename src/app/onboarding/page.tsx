'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { User, Building2, ArrowRight, Check, CreditCard, Smartphone, Bitcoin, Globe } from 'lucide-react';
import Link from 'next/link';
import type { UserType, PaymentMethod } from '@/lib/mock-data';

type OnboardingStep = 'choose-type' | 'personal-details' | 'business-details' | 'payment-setup' | 'complete';

const paymentMethods: { value: PaymentMethod; label: string; description: string }[] = [
  { value: 'mobile_money', label: 'Mobile Money', description: 'MTN, Vodafone, AirtelTigo' },
  { value: 'bank_transfer', label: 'Bank Transfer', description: 'Direct bank account' },
  { value: 'crypto', label: 'Cryptocurrency', description: 'Bitcoin, USDC' },
];

const currencies = [
  { value: 'GHS', label: 'Ghanaian Cedi (GHS)' },
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
];

export default function Onboarding() {
  const [step, setStep] = useState<OnboardingStep>('choose-type');
  const [userType, setUserType] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    // Personal
    name: '',
    email: '',
    phone: '',
    // Business
    companyName: '',
    address: '',
    taxId: '',
    // Common
    selectedPaymentMethods: [] as PaymentMethod[],
    preferredCurrency: 'GHS',
  });

  const handlePaymentMethodChange = (method: PaymentMethod, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedPaymentMethods: checked
        ? [...prev.selectedPaymentMethods, method]
        : prev.selectedPaymentMethods.filter(m => m !== method)
    }));
  };

  const handleNext = () => {
    switch (step) {
      case 'choose-type':
        setStep(userType === 'personal' ? 'personal-details' : 'business-details');
        break;
      case 'personal-details':
      case 'business-details':
        setStep('payment-setup');
        break;
      case 'payment-setup':
        setStep('complete');
        break;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'choose-type':
        return userType !== null;
      case 'personal-details':
        return formData.name && formData.email;
      case 'business-details':
        return formData.companyName && formData.email;
      case 'payment-setup':
        return formData.selectedPaymentMethods.length > 0;
      default:
        return false;
    }
  };

  const getStepProgress = () => {
    const steps = ['choose-type', 'personal-details', 'business-details', 'payment-setup', 'complete'];
    const currentIndex = steps.indexOf(step);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const getStepTitle = () => {
    switch (step) {
      case 'choose-type':
        return 'Choose Account Type';
      case 'personal-details':
        return 'Personal Information';
      case 'business-details':
        return 'Business Information';
      case 'payment-setup':
        return 'Payment Methods';
      case 'complete':
        return 'Setup Complete';
      default:
        return '';
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      {/* Floating Gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/4 top-[-15%] h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-gray-200/40 to-transparent blur-3xl"
          style={{ animation: "floatBlob 28s ease-in-out infinite" }}
        />
        <div
          className="absolute right-1/4 bottom-[-10%] h-[400px] w-[500px] translate-x-1/2 rounded-full bg-gradient-to-l from-gray-100/30 to-transparent blur-3xl"
          style={{ animation: "floatBlob 32s ease-in-out infinite", animationDelay: "-18s" }}
        />
      </div>

      {/* Header */}
      <header className="relative border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="text-xl font-medium text-black">
            plæn.
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {step !== 'complete' && (
        <div className="border-b border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-2xl px-6 py-6">
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-900">{getStepTitle()}</span>
                <span className="text-gray-500">Step {['choose-type', 'personal-details', 'business-details', 'payment-setup'].indexOf(step) + 1} of 4</span>
              </div>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-6 py-12">
        {step === 'choose-type' && (
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-medium text-black">
              Welcome to Plaen.
            </h1>
            <p className="mb-12 text-lg text-gray-600">
              Choose how you'll use Plaen to get started.
            </p>

            <div className="grid gap-8 md:grid-cols-2">
              <Card 
                className={`group relative cursor-pointer border-2 transition-all duration-300 hover:shadow-lg ${
                  userType === 'personal' 
                    ? 'border-black bg-black text-white shadow-lg' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:-translate-y-1'
                }`}
                onClick={() => setUserType('personal')}
              >
                <CardHeader className="text-center p-8">
                  <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
                    userType === 'personal' ? 'bg-white text-black' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}>
                    <User className="h-8 w-8" />
                  </div>
                  <CardTitle className={`text-2xl font-medium mb-3 ${
                    userType === 'personal' ? 'text-white' : 'text-black'
                  }`}>
                    Personal
                  </CardTitle>
                  <CardDescription className={`text-base leading-relaxed ${
                    userType === 'personal' ? 'text-gray-200' : 'text-gray-600'
                  }`}>
                    Perfect for freelancers and individuals sending invoices for projects or services.
                  </CardDescription>
                  <div className="mt-6 space-y-2">
                    <div className={`flex items-center justify-center text-sm ${
                      userType === 'personal' ? 'text-gray-200' : 'text-gray-500'
                    }`}>
                      <Check className="mr-2 h-4 w-4" />
                      Quick setup
                    </div>
                    <div className={`flex items-center justify-center text-sm ${
                      userType === 'personal' ? 'text-gray-200' : 'text-gray-500'
                    }`}>
                      <Check className="mr-2 h-4 w-4" />
                      Personal branding
                    </div>
                  </div>
                </CardHeader>
                {userType === 'personal' && (
                  <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </Card>

              <Card 
                className={`group relative cursor-pointer border-2 transition-all duration-300 hover:shadow-lg ${
                  userType === 'business' 
                    ? 'border-black bg-black text-white shadow-lg' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:-translate-y-1'
                }`}
                onClick={() => setUserType('business')}
              >
                <CardHeader className="text-center p-8">
                  <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
                    userType === 'business' ? 'bg-white text-black' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}>
                    <Building2 className="h-8 w-8" />
                  </div>
                  <CardTitle className={`text-2xl font-medium mb-3 ${
                    userType === 'business' ? 'text-white' : 'text-black'
                  }`}>
                    Business
                  </CardTitle>
                  <CardDescription className={`text-base leading-relaxed ${
                    userType === 'business' ? 'text-gray-200' : 'text-gray-600'
                  }`}>
                    For companies and organizations with branding, tax details, and team workflows.
                  </CardDescription>
                  <div className="mt-6 space-y-2">
                    <div className={`flex items-center justify-center text-sm ${
                      userType === 'business' ? 'text-gray-200' : 'text-gray-500'
                    }`}>
                      <Check className="mr-2 h-4 w-4" />
                      Company branding
                    </div>
                    <div className={`flex items-center justify-center text-sm ${
                      userType === 'business' ? 'text-gray-200' : 'text-gray-500'
                    }`}>
                      <Check className="mr-2 h-4 w-4" />
                      Tax management
                    </div>
                  </div>
                </CardHeader>
                {userType === 'business' && (
                  <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </Card>
            </div>

            <Button 
              className="mt-8 bg-black text-white hover:bg-gray-800"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 'personal-details' && (
          <div>
            <div className="text-center mb-8">
              <h1 className="mb-2 text-2xl font-medium text-black">
                Personal Details
              </h1>
              <p className="text-gray-600">
                This information will appear on your invoices.
              </p>
            </div>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <User className="mr-2 h-5 w-5 text-gray-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Enter your details as you'd like them to appear on invoices.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-2 border-gray-200 focus:border-black focus:ring-black"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-2 border-gray-200 focus:border-black focus:ring-black"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-2 border-gray-200 focus:border-black focus:ring-black"
                    placeholder="+233 20 123 4567"
                  />
                  <p className="mt-1 text-xs text-gray-500">Optional - will appear on your invoices</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-8">
              <Button 
                variant="outline"
                onClick={() => setStep('choose-type')}
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                Back
              </Button>
              <Button 
                className="bg-black text-white hover:bg-gray-800"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 'business-details' && (
          <div>
            <div className="text-center mb-8">
              <h1 className="mb-2 text-2xl font-medium text-black">
                Business Details
              </h1>
              <p className="text-gray-600">
                This information will appear on your invoices and help with branding.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Building2 className="mr-2 h-5 w-5 text-gray-600" />
                    Company Information
                  </CardTitle>
                  <CardDescription>
                    Basic details about your business.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <Label htmlFor="companyName" className="text-sm font-medium">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                        className="mt-2 border-gray-200 focus:border-black focus:ring-black"
                        placeholder="Your company name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">Business Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-2 border-gray-200 focus:border-black focus:ring-black"
                        placeholder="hello@yourcompany.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">Business Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="mt-2 border-gray-200 focus:border-black focus:ring-black"
                      placeholder="+233 20 123 4567"
                    />
                    <p className="mt-1 text-xs text-gray-500">Optional - will appear on your invoices</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Globe className="mr-2 h-5 w-5 text-gray-600" />
                    Additional Details
                  </CardTitle>
                  <CardDescription>
                    Optional information for professional invoices.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="address" className="text-sm font-medium">Business Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="mt-2 border-gray-200 focus:border-black focus:ring-black"
                      placeholder="Your business address"
                      rows={3}
                    />
                    <p className="mt-1 text-xs text-gray-500">Will appear on invoices for professional presentation</p>
                  </div>

                  <div>
                    <Label htmlFor="taxId" className="text-sm font-medium">Tax ID / Registration Number</Label>
                    <Input
                      id="taxId"
                      value={formData.taxId}
                      onChange={(e) => setFormData(prev => ({ ...prev, taxId: e.target.value }))}
                      className="mt-2 border-gray-200 focus:border-black focus:ring-black"
                      placeholder="GH-123456789"
                    />
                    <p className="mt-1 text-xs text-gray-500">For tax compliance and professional invoices</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between mt-8">
              <Button 
                variant="outline"
                onClick={() => setStep('choose-type')}
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                Back
              </Button>
              <Button 
                className="bg-black text-white hover:bg-gray-800"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 'payment-setup' && (
          <div>
            <div className="text-center mb-8">
              <h1 className="mb-2 text-2xl font-medium text-black">
                Payment Setup
              </h1>
              <p className="text-gray-600">
                Choose how you'd like to receive payments from your clients.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Payment Methods</Label>
                <p className="mb-4 text-sm text-gray-600">
                  Select all methods you want to offer to clients.
                </p>
                <div className="grid gap-4 md:grid-cols-1">
                  {paymentMethods.map((method) => {
                    const isSelected = formData.selectedPaymentMethods.includes(method.value);
                    const IconComponent = method.value === 'mobile_money' ? Smartphone : 
                                        method.value === 'bank_transfer' ? CreditCard : Bitcoin;
                    
                    return (
                      <Card 
                        key={method.value}
                        className={`cursor-pointer border-2 transition-all duration-200 hover:shadow-md ${
                          isSelected 
                            ? 'border-black bg-gray-50 shadow-sm' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handlePaymentMethodChange(method.value, !isSelected)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                              isSelected ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <Label htmlFor={method.value} className="font-medium text-black cursor-pointer">
                                  {method.label}
                                </Label>
                                {isSelected && (
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                                    <Check className="h-3 w-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {method.description}
                              </p>
                            </div>
                            <Checkbox
                              id={method.value}
                              checked={isSelected}
                              onCheckedChange={(checked) => 
                                handlePaymentMethodChange(method.value, checked as boolean)
                              }
                              className="pointer-events-none"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Globe className="mr-2 h-5 w-5 text-gray-600" />
                    Currency Settings
                  </CardTitle>
                  <CardDescription>
                    Choose your default currency for invoices.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="currency" className="text-sm font-medium">Preferred Currency</Label>
                    <Select 
                      value={formData.preferredCurrency} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, preferredCurrency: value }))}
                    >
                      <SelectTrigger className="mt-2 border-gray-200 focus:border-black focus:ring-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="mt-1 text-xs text-gray-500">You can change this later in settings</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between mt-8">
              <Button 
                variant="outline"
                onClick={() => setStep(userType === 'personal' ? 'personal-details' : 'business-details')}
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                Back
              </Button>
              <Button 
                className="bg-black text-white hover:bg-gray-800"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Complete Setup
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center">
            <Card className="border-gray-200 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-12">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="mb-4 text-3xl font-medium text-black">
                  Setup complete.
                </h1>
                <p className="mb-8 text-lg text-gray-600 max-w-md mx-auto">
                  Your workspace is ready. Start creating professional invoices with Plaen's clean, structured approach.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href="/invoices/new">
                    <Button size="lg" variant="outline" className="border-gray-200 text-black hover:bg-gray-50 w-full sm:w-auto">
                      Create First Invoice
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Welcome to Plaen — where structure meets accessibility.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      
      <style jsx>{`
        @keyframes floatBlob {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}
