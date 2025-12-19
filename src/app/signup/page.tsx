"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartButton } from "@/components/ui/smart-button";
import { Badge } from "@/components/ui/badge";
import { 
  TickCircle, 
  Lock1, 
  ShieldTick, 
  Mobile, 
  User, 
  Building, 
  ArrowRight2, 
  ArrowLeft2,
  Eye,
  EyeSlash,
  Sms,
  SecuritySafe,
  Verify,
  CloseCircle,
  ArrowDown2,
  Global,
  Briefcase
} from "iconsax-react";

// Types
type AccountType = "personal" | "business" | null;
type Step = 1 | 2 | 3 | 4;

interface FormData {
  accountType: AccountType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  workspaceName: string;
  businessName: string;
  businessType: string;
  country: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptMarketing: boolean;
}

// Password strength checker
const checkPasswordStrength = (password: string) => {
  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  
  Object.values(checks).forEach(passed => { if (passed) score++; });
  
  return {
    score,
    checks,
    label: score <= 1 ? "Weak" : score <= 3 ? "Fair" : score <= 4 ? "Good" : "Strong",
    color: score <= 1 ? "#EF4444" : score <= 3 ? "#F59E0B" : score <= 4 ? "#14462a" : "#14462a"
  };
};

// Validation helpers
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Phone formatting for Ghana numbers
// Supports: 0XX XXX XXXX or +233 XX XXX XXXX
const formatGhanaPhone = (value: string): string => {
  // Remove all non-digits except + at start
  const hasPlus = value.startsWith('+');
  const digits = value.replace(/\D/g, '');
  
  if (!digits) return hasPlus ? '+' : '';
  
  // Handle +233 format
  if (hasPlus || digits.startsWith('233')) {
    const normalized = digits.startsWith('233') ? digits : digits;
    if (normalized.startsWith('233')) {
      const rest = normalized.slice(3);
      if (rest.length === 0) return '+233';
      if (rest.length <= 2) return `+233 ${rest}`;
      if (rest.length <= 5) return `+233 ${rest.slice(0, 2)} ${rest.slice(2)}`;
      return `+233 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5, 9)}`;
    }
    // User typed + but no 233 yet
    if (digits.length <= 3) return `+${digits}`;
    if (digits.length <= 5) return `+${digits.slice(0, 3)} ${digits.slice(3)}`;
    if (digits.length <= 8) return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 12)}`;
  }
  
  // Handle local 0XX format
  if (digits.startsWith('0')) {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
  }
  
  // If starting with other digits (like 2, 5, etc.), assume local without 0
  if (digits.length <= 2) return `0${digits}`;
  if (digits.length <= 5) return `0${digits.slice(0, 2)} ${digits.slice(2)}`;
  return `0${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
};

// Validate formatted phone - must have 10 digits (local) or 12 digits (international)
const isValidPhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '');
  // Local: 0XXXXXXXXX (10 digits) or International: 233XXXXXXXXX (12 digits)
  return digits.length === 10 || (digits.startsWith('233') && digits.length === 12);
};

// Custom Checkbox component
function CustomCheckbox({ 
  checked, 
  onChange, 
  id 
}: { 
  checked: boolean; 
  onChange: (checked: boolean) => void; 
  id: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
        checked 
          ? "bg-[#14462a] border-[#14462a] shadow-md shadow-[#14462a]/20" 
          : "bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50"
      }`}
    >
      <svg
        className={`h-3 w-3 text-white transition-all duration-200 ${checked ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </button>
  );
}

// Custom Select/Dropdown component
function CustomDropdown({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  icon: Icon,
  error 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  options: string[]; 
  placeholder: string;
  icon?: React.ComponentType<{ size: number; color?: string; className?: string }>;
  error?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-11 w-full flex items-center gap-2.5 rounded-xl border-2 bg-gray-50/50 text-sm transition-all duration-200 outline-none cursor-pointer ${
          Icon ? "pl-3 pr-3" : "pl-3.5 pr-3"
        } ${
          error 
            ? "border-red-400 bg-red-50/50" 
            : isOpen
              ? "border-[#14462a] bg-white ring-4 ring-[#14462a]/10"
              : value 
                ? "border-gray-200 bg-white text-gray-900" 
                : "border-gray-200 text-gray-400"
        } hover:border-gray-300 hover:bg-white`}
      >
        {Icon && <Icon size={18} color="#14462a" className="flex-shrink-0" />}
        <span className={`flex-1 text-left truncate ${value ? "text-gray-900" : "text-gray-400"}`}>
          {value || placeholder}
        </span>
        <ArrowDown2 
          size={18}
          color="#6B7280"
          className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg shadow-black/5 py-1.5 max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 text-left text-sm transition-colors flex items-center gap-2 ${
                value === option 
                  ? "bg-[#14462a]/5 text-[#14462a] font-medium" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {value === option && (
                <TickCircle size={16} color="#14462a" variant="Bold" className="flex-shrink-0" />
              )}
              <span className={value === option ? "" : "pl-6"}>{option}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Step indicator component
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const steps = [
    { num: 1, label: "Account", icon: User },
    { num: 2, label: "Profile", icon: User },
    { num: 3, label: "Workspace", icon: Building },
    { num: 4, label: "Security", icon: Lock1 },
  ];

  return (
    <div className="w-full">
      {/* Progress bar background */}
      <div className="relative mx-auto max-w-md">
        {/* Background line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-100 rounded-full" />
        {/* Progress line */}
        <div 
          className="absolute top-6 left-0 h-1 bg-gradient-to-r from-[#14462a] to-[#6B7280] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
        
        {/* Steps */}
        <div className="relative flex items-start justify-between">
          {steps.slice(0, totalSteps).map((step) => {
            const StepIcon = step.icon;
            const isCompleted = step.num < currentStep;
            const isCurrent = step.num === currentStep;
            const isPending = step.num > currentStep;
            
            return (
              <div key={step.num} className="flex flex-col items-center">
                {/* Step circle */}
                <div 
                  className={`relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${
                    isCompleted 
                      ? "bg-[#14462a] shadow-lg shadow-[#14462a]/25" 
                      : isCurrent 
                        ? "bg-gray-500 shadow-lg shadow-gray-500/25 ring-4 ring-gray-500/10" 
                        : "bg-gray-100 border-2 border-gray-200"
                  }`}
                >
                  {isCompleted ? (
                    <div className="flex items-center justify-center">
                      <TickCircle size={24} color="white" variant="Bold" />
                    </div>
                  ) : isCurrent ? (
                    <span className="text-base font-bold text-white">{step.num}</span>
                  ) : (
                    <span className="text-base font-semibold text-gray-400">{step.num}</span>
                  )}
                  
                  {/* Pulse animation for current step */}
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-2xl animate-ping bg-gray-500/20" style={{ animationDuration: '2s' }} />
                  )}
                </div>
                
                {/* Step label */}
                <div className="mt-3 flex flex-col items-center">
                  <span className={`text-xs font-semibold transition-colors duration-300 ${
                    isCompleted 
                      ? "text-[#14462a]" 
                      : isCurrent 
                        ? "text-gray-600" 
                        : "text-gray-400"
                  }`}>
                    {step.label}
                  </span>
                  {isCompleted && (
                    <span className="mt-0.5 text-[10px] text-[#14462a] font-medium">
                      Complete
                    </span>
                  )}
                  {isCurrent && (
                    <span className="mt-0.5 text-[10px] text-gray-500 font-medium">
                      In progress
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Step counter text */}
      <div className="mt-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-sm">
          <span className="font-semibold text-[#14462a]">Step {currentStep}</span>
          <span className="text-gray-400">of</span>
          <span className="font-semibold text-gray-600">{totalSteps}</span>
        </span>
      </div>
    </div>
  );
}

// Account type selection component
function AccountTypeStep({ 
  selected, 
  onSelect 
}: { 
  selected: AccountType; 
  onSelect: (type: AccountType) => void 
}) {
  const options = [
    {
      type: "personal" as const,
      icon: User,
      title: "Personal",
      description: "For freelancers and individuals managing their own invoices",
      features: ["Personal profile", "Unlimited invoices", "All payment methods"],
      color: "#B45309"
    },
    {
      type: "business" as const,
      icon: Building,
      title: "Business",
      description: "For companies and teams with business invoicing needs",
      features: ["Business profile", "Tax documentation", "Multiple users (coming soon)"],
      color: "#14462a"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">Choose your account type</h2>
        <p className="text-gray-600">Select the option that best fits your needs. You can always change this later.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mt-8">
        {options.map(({ type, icon: Icon, title, description, features, color }) => (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            className={`relative rounded-2xl border-2 p-6 text-left transition-all duration-200 hover:shadow-lg ${
              selected === type 
                ? "border-[#14462a] bg-gray-50 shadow-md" 
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {selected === type && (
              <div className="absolute top-4 right-4">
                <TickCircle size={24} color="#14462a" variant="Bold" />
              </div>
            )}
            <div 
              className="h-12 w-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${color}15` }}
            >
              <Icon size={24} color={color} variant="Bulk" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
            <ul className="mt-4 space-y-2">
              {features.map(feature => (
                <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                  <TickCircle size={14} color={color} variant="Bold" />
                  {feature}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </div>
  );
}

// Profile step component
function ProfileStep({ 
  formData, 
  onChange,
  errors 
}: { 
  formData: FormData; 
  onChange: (field: keyof FormData, value: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">Tell us about yourself</h2>
        <p className="text-gray-600">We'll use this to personalize your experience</p>
      </div>

      <div className="space-y-5 mt-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First name</Label>
            <div className="relative">
              <User size={18} color="#14462a" className="absolute left-3 top-1/2 -translate-y-1/2" />
              <Input 
                id="firstName" 
                value={formData.firstName}
                onChange={(e) => onChange("firstName", e.target.value)}
                placeholder="Ama"
                className={`pl-9 ${errors.firstName ? "!border-red-400 !bg-red-50/50" : ""}`}
              />
            </div>
            {errors.firstName && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <CloseCircle size={12} /> {errors.firstName}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last name</Label>
            <div className="relative">
              <User size={18} color="#14462a" className="absolute left-3 top-1/2 -translate-y-1/2" />
              <Input 
                id="lastName" 
                value={formData.lastName}
                onChange={(e) => onChange("lastName", e.target.value)}
                placeholder="Mensah"
                className={`pl-9 ${errors.lastName ? "!border-red-400 !bg-red-50/50" : ""}`}
              />
            </div>
            {errors.lastName && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <CloseCircle size={12} /> {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</Label>
          <div className="relative">
            <Sms size={18} color="#14462a" className="absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              id="email" 
              type="email"
              value={formData.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="you@company.com" 
              className={`pl-9 ${errors.email ? "!border-red-400 !bg-red-50/50" : ""}`}
            />
            {formData.email && isValidEmail(formData.email) && (
              <TickCircle size={18} color="#14462a" variant="Bold" className="absolute right-3 top-1/2 -translate-y-1/2" />
            )}
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <CloseCircle size={12} /> {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone number <span className="text-gray-400 font-normal">(for payment notifications)</span>
          </Label>
          <div className="relative">
            <Mobile size={18} color="#14462a" className="absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              id="phone" 
              type="tel"
              value={formData.phone}
              onChange={(e) => onChange("phone", formatGhanaPhone(e.target.value))}
              placeholder="024 XXX XXXX" 
              className={`pl-9 ${errors.phone ? "!border-red-400 !bg-red-50/50" : ""}`}
            />
            {formData.phone && isValidPhone(formData.phone) && (
              <TickCircle size={18} color="#14462a" variant="Bold" className="absolute right-3 top-1/2 -translate-y-1/2" />
            )}
          </div>
          {errors.phone && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <CloseCircle size={12} /> {errors.phone}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Workspace step component
function WorkspaceStep({ 
  formData, 
  onChange,
  errors 
}: { 
  formData: FormData; 
  onChange: (field: keyof FormData, value: string) => void;
  errors: Record<string, string>;
}) {
  const businessTypes = [
    "Freelancer / Sole Proprietor",
    "Agency / Studio",
    "Consulting Firm",
    "E-commerce / Retail",
    "Technology / SaaS",
    "Other"
  ];

  const countries = [
    "Ghana",
    "Nigeria",
    "Kenya",
    "South Africa",
    "United States",
    "United Kingdom",
    "Other"
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">Set up your workspace</h2>
        <p className="text-gray-600">This is where your invoices and documents will live</p>
      </div>

      <div className="space-y-5 mt-8">
        <div className="space-y-2">
          <Label htmlFor="workspaceName" className="text-sm font-medium text-gray-700">Workspace name</Label>
          <div className="relative">
            <Briefcase size={18} color="#14462a" className="absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              id="workspaceName" 
              value={formData.workspaceName}
              onChange={(e) => onChange("workspaceName", e.target.value)}
              placeholder="Studio Plaen"
              className={`pl-9 ${errors.workspaceName ? "!border-red-400 !bg-red-50/50" : ""}`}
            />
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            This will appear on your invoices and payment pages
          </p>
          {errors.workspaceName && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <CloseCircle size={12} /> {errors.workspaceName}
            </p>
          )}
        </div>

        {formData.accountType === "business" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">Legal business name</Label>
              <div className="relative">
                <Building size={18} color="#14462a" className="absolute left-3 top-1/2 -translate-y-1/2" />
                <Input 
                  id="businessName" 
                  value={formData.businessName}
                  onChange={(e) => onChange("businessName", e.target.value)}
                  placeholder="Plaen Technologies Ltd"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType" className="text-sm font-medium text-gray-700">Business type</Label>
              <CustomDropdown
                value={formData.businessType}
                onChange={(value) => onChange("businessType", value)}
                options={businessTypes}
                placeholder="Select business type"
                icon={Briefcase}
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country</Label>
          <CustomDropdown
            value={formData.country}
            onChange={(value) => onChange("country", value)}
            options={countries}
            placeholder="Select your country"
            icon={Global}
            error={!!errors.country}
          />
          {errors.country && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <CloseCircle size={12} /> {errors.country}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Security step component
function SecurityStep({ 
  formData, 
  onChange,
  errors 
}: { 
  formData: FormData; 
  onChange: (field: keyof FormData, value: string | boolean) => void;
  errors: Record<string, string>;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const strength = checkPasswordStrength(formData.password);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">Secure your account</h2>
        <p className="text-gray-600">Create a strong password to protect your data</p>
      </div>

      <div className="space-y-5 mt-8">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
          <div className="relative">
            <Lock1 size={18} color="#14462a" className="absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => onChange("password", e.target.value)}
              placeholder="Create a strong password" 
              className={`pl-9 pr-11 ${errors.password ? "!border-red-400 !bg-red-50/50" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
            >
              {showPassword ? <EyeSlash size={18} color="#6B7280" /> : <Eye size={18} color="#6B7280" />}
            </button>
          </div>
          
          {/* Password strength indicator */}
          {formData.password && (
            <div className="space-y-3 mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-300 rounded-full"
                    style={{ 
                      width: `${(strength.score / 5) * 100}%`,
                      backgroundColor: strength.color 
                    }}
                  />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: strength.color, backgroundColor: `${strength.color}15` }}>
                  {strength.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div className={`flex items-center gap-2 ${strength.checks.length ? "text-green-600" : "text-gray-400"}`}>
                  {strength.checks.length ? <TickCircle size={14} variant="Bold" /> : <CloseCircle size={14} />}
                  8+ characters
                </div>
                <div className={`flex items-center gap-2 ${strength.checks.uppercase ? "text-green-600" : "text-gray-400"}`}>
                  {strength.checks.uppercase ? <TickCircle size={14} variant="Bold" /> : <CloseCircle size={14} />}
                  Uppercase letter
                </div>
                <div className={`flex items-center gap-2 ${strength.checks.lowercase ? "text-green-600" : "text-gray-400"}`}>
                  {strength.checks.lowercase ? <TickCircle size={14} variant="Bold" /> : <CloseCircle size={14} />}
                  Lowercase letter
                </div>
                <div className={`flex items-center gap-2 ${strength.checks.number ? "text-green-600" : "text-gray-400"}`}>
                  {strength.checks.number ? <TickCircle size={14} variant="Bold" /> : <CloseCircle size={14} />}
                  Number
                </div>
                <div className={`flex items-center gap-2 ${strength.checks.special ? "text-green-600" : "text-gray-400"}`}>
                  {strength.checks.special ? <TickCircle size={14} variant="Bold" /> : <CloseCircle size={14} />}
                  Special character
                </div>
              </div>
            </div>
          )}
          {errors.password && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <CloseCircle size={12} /> {errors.password}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm password</Label>
          <div className="relative">
            <Lock1 size={18} color="#14462a" className="absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              id="confirmPassword" 
              type={showConfirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => onChange("confirmPassword", e.target.value)}
              placeholder="Confirm your password" 
              className={`pl-9 pr-11 ${errors.confirmPassword ? "!border-red-400 !bg-red-50/50" : formData.confirmPassword && formData.password === formData.confirmPassword ? "!border-green-400" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
            >
              {showConfirm ? <EyeSlash size={18} color="#6B7280" /> : <Eye size={18} color="#6B7280" />}
            </button>
          </div>
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100">
              <CloseCircle size={16} color="#EF4444" />
              <p className="text-xs text-red-600 font-medium">Passwords do not match</p>
            </div>
          )}
          {formData.confirmPassword && formData.password === formData.confirmPassword && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-100">
              <TickCircle size={16} color="#14462a" variant="Bold" />
              <p className="text-xs text-green-600 font-medium">Passwords match</p>
            </div>
          )}
        </div>

        <div className="space-y-4 mt-6 pt-6 border-t border-gray-100">
          <div 
            className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              formData.acceptTerms 
                ? "border-[#14462a]/20 bg-[#14462a]/5" 
                : errors.acceptTerms
                  ? "border-red-200 bg-red-50/50"
                  : "border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => onChange("acceptTerms", !formData.acceptTerms)}
          >
            <CustomCheckbox
              checked={formData.acceptTerms}
              onChange={(checked) => onChange("acceptTerms", checked)}
              id="acceptTerms"
            />
            <div className="flex-1">
              <span className="text-sm text-gray-700 leading-relaxed">
                I agree to the{" "}
                <Link 
                  href="/terms" 
                  className="text-[#14462a] font-medium underline underline-offset-2 hover:text-black"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link 
                  href="/privacy" 
                  className="text-[#14462a] font-medium underline underline-offset-2 hover:text-black"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </Link>
              </span>
              <p className="text-xs text-gray-500 mt-1">Required to create your account</p>
            </div>
          </div>
          {errors.acceptTerms && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <CloseCircle size={12} /> {errors.acceptTerms}
            </p>
          )}

          <div 
            className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              formData.acceptMarketing 
                ? "border-[#14462a]/20 bg-[#14462a]/5" 
                : "border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => onChange("acceptMarketing", !formData.acceptMarketing)}
          >
            <CustomCheckbox
              checked={formData.acceptMarketing}
              onChange={(checked) => onChange("acceptMarketing", checked)}
              id="acceptMarketing"
            />
            <div className="flex-1">
              <span className="text-sm text-gray-700 leading-relaxed">
                Send me product updates and tips
              </span>
              <p className="text-xs text-gray-500 mt-1">You can unsubscribe anytime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Success component
function SuccessStep({ email }: { email: string }) {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="mx-auto w-20 h-20 rounded-full bg-[#14462a]/10 flex items-center justify-center">
        <Verify size={40} color="#14462a" variant="Bulk" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">Check your email</h2>
        <p className="text-gray-600 max-w-sm mx-auto">
          We sent a verification link to <span className="font-medium text-gray-900">{email}</span>. 
          Click the link to activate your account.
        </p>
      </div>
      <div className="bg-gray-50 rounded-2xl p-6 max-w-sm mx-auto">
        <div className="flex items-center gap-3 text-left">
          <div className="h-10 w-10 rounded-full bg-[#14462a]/10 flex items-center justify-center flex-shrink-0">
            <Sms size={20} color="#14462a" variant="Bulk" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">Didn't receive the email?</p>
            <p className="text-gray-600">Check spam folder or <button className="text-[#14462a] underline">resend email</button></p>
          </div>
        </div>
      </div>
      <div className="pt-6 flex flex-col items-center gap-4">
        <Link href="/login">
          <SmartButton className="w-full max-w-xs px-8">
            Continue to login
          </SmartButton>
        </Link>
        <p className="text-sm text-gray-500 mt-2">
          You can verify your email later, but some features will be limited
        </p>
      </div>
    </div>
  );
}

// Main signup page
export default function SignupPage() {
  const year = new Date().getFullYear();
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<FormData>({
    accountType: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    workspaceName: "",
    businessName: "",
    businessType: "",
    country: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    acceptMarketing: false,
  });

  const updateField = (field: keyof FormData, value: string | boolean | AccountType) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (currentStep: Step): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.accountType) {
        newErrors.accountType = "Please select an account type";
      }
    }

    if (currentStep === 2) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!isValidEmail(formData.email)) newErrors.email = "Please enter a valid email";
      if (formData.phone && !isValidPhone(formData.phone)) newErrors.phone = "Please enter a valid phone number";
    }

    if (currentStep === 3) {
      if (!formData.workspaceName.trim()) newErrors.workspaceName = "Workspace name is required";
      if (!formData.country) newErrors.country = "Please select your country";
    }

    if (currentStep === 4) {
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
      if (!formData.acceptTerms) newErrors.acceptTerms = "You must accept the terms to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 4) {
        setStep((step + 1) as Step);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsComplete(true);
  };

  // Auto-fill workspace name from user's name
  useEffect(() => {
    if (formData.firstName && !formData.workspaceName) {
      updateField("workspaceName", `${formData.firstName}'s Workspace`);
    }
  }, [formData.firstName]);

  if (isComplete) {
    return (
      <>
        <MarketingHeader />
        <main className="relative bg-white min-h-screen">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-[rgba(0,0,0,0.03)] blur-3xl" />
            <div className="absolute left-0 bottom-0 h-80 w-80 rounded-full bg-[rgba(0,0,0,0.02)] blur-3xl" />
          </div>
          <div className="mx-auto max-w-lg px-6 pt-32 pb-20">
            <SuccessStep email={formData.email} />
          </div>
        </main>
        <MarketingFooter year={year} />
      </>
    );
  }

  return (
    <>
      <MarketingHeader />
      <main className="relative bg-white min-h-screen">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-[rgba(0,0,0,0.03)] blur-3xl" />
          <div className="absolute left-0 bottom-0 h-80 w-80 rounded-full bg-[rgba(0,0,0,0.02)] blur-3xl" />
        </div>
        
        <div className="mx-auto max-w-2xl px-6 pt-32 pb-12">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge variant="outline" className="rounded-full border-gray-200 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-500 mb-4">
              Create account
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-[#14462a]">
              Get started with Plaen
            </h1>
            <p className="mt-2 text-gray-600">
              Free forever. No credit card required.
            </p>
          </div>

          {/* Progress indicator */}
          <div className="mb-10">
            <StepIndicator currentStep={step} totalSteps={4} />
          </div>

          {/* Form container */}
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,15,15,0.06)]">
            {/* Step content */}
            {step === 1 && (
              <AccountTypeStep 
                selected={formData.accountType} 
                onSelect={(type) => updateField("accountType", type)} 
              />
            )}
            {step === 2 && (
              <ProfileStep 
                formData={formData} 
                onChange={updateField}
                errors={errors}
              />
            )}
            {step === 3 && (
              <WorkspaceStep 
                formData={formData} 
                onChange={updateField}
                errors={errors}
              />
            )}
            {step === 4 && (
              <SecurityStep 
                formData={formData} 
                onChange={updateField}
                errors={errors}
              />
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft2 size={18} />
                  Back
                </button>
              ) : (
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Already have an account?
                </Link>
              )}

              <SmartButton
                onClick={handleNext}
                disabled={isLoading || (step === 1 && !formData.accountType)}
                className="min-w-[140px]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </span>
                ) : step === 4 ? (
                  <span className="flex items-center gap-2">
                    Create account
                    <SecuritySafe size={18} variant="Bold" />
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Continue
                    <ArrowRight2 size={18} />
                  </span>
                )}
              </SmartButton>
            </div>
          </div>

          {/* Security badges */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <ShieldTick size={14} color="#14462a" variant="Bulk" />
              256-bit encryption
            </span>
            <span className="flex items-center gap-1.5">
              <Lock1 size={14} color="#14462a" variant="Bulk" />
              SOC2 compliant
            </span>
            <span className="flex items-center gap-1.5">
              <SecuritySafe size={14} color="#14462a" variant="Bulk" />
              GDPR ready
            </span>
          </div>
        </div>
      </main>
      <MarketingFooter year={year} />
    </>
  );
}
