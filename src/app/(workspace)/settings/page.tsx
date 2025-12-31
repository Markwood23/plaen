"use client";

import { useState, useEffect } from "react";
import {
  User,
  Notification,
  Card,
  ShieldTick,
  Building,
  Paperclip,
  Wallet,
  Setting2,
  Brush2,
  Data,
  Flash,
  Global,
  Mobile,
  Bitcoin,
  Bank,
  Key,
  Code,
  DocumentUpload,
  DocumentDownload,
  Trash,
  Copy,
  Link2,
  TickCircle,
  Calendar,
  Eye,
  EyeSlash,
  Call,
  PasswordCheck,
  FingerScan,
  Clock,
  Location,
  Lock,
  Warning2,
  InfoCircle,
  Sms,
  Message,
  Timer1,
  Shield,
  CloseCircle,
  Verify,
} from "iconsax-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorPicker } from "@/components/ui/color-picker";
import { CedisCircle } from "@/components/icons/cedis-icon";
import { useSettingsData } from "@/hooks/useSettingsData";

// Security verification types
type VerificationType = "password" | "email-otp" | "sms-otp" | "2fa";
type PendingAction = 
  | { type: "profile"; field: string }
  | { type: "business"; field: string }
  | { type: "email"; newEmail: string }
  | { type: "phone"; newPhone: string }
  | { type: "payment-gateway"; gateway: string }
  | { type: "bank-account" }
  | { type: "api-key" }
  | { type: "delete-account" }
  | null;

// Security badge component
function SecurityBadge({ level }: { level: "low" | "medium" | "high" }) {
  const config = {
    low: { variant: "secondary" as const, color: "#4B5563", icon: InfoCircle, label: "Low Risk" },
    medium: { variant: "warning" as const, color: "#B45309", icon: Warning2, label: "Requires Verification" },
    high: { variant: "destructive" as const, color: "#DC2626", icon: Shield, label: "Sensitive" },
  };
  const { variant, color, icon: Icon, label } = config[level];
  return (
    <Badge variant={variant}>
      <Icon size={12} color={color} />
      {label}
    </Badge>
  );
}

// Cooldown indicator component
function CooldownIndicator({ lastChanged, cooldownDays }: { lastChanged: Date | null; cooldownDays: number }) {
  if (!lastChanged) return null;
  
  const now = new Date();
  const daysSinceChange = Math.floor((now.getTime() - lastChanged.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = cooldownDays - daysSinceChange;
  
  if (daysRemaining <= 0) return null;
  
  return (
    <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mt-2">
      <Timer1 size={14} color="#D97706" />
      <span>Can be changed again in {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}</span>
    </div>
  );
}

export default function SettingsPage() {
  // API data hook
  const { settings: apiSettings, loading: settingsLoading, error: settingsError, updateSettings, saving } = useSettingsData();
  
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [showBillingHistoryModal, setShowBillingHistoryModal] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPasswordVisibility, setShowPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  // Security verification states
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationType, setVerificationType] = useState<VerificationType>("password");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [verificationPassword, setVerificationPassword] = useState("");
  const [verificationOTP, setVerificationOTP] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showOTPSent, setShowOTPSent] = useState(false);
  
  // Track pending changes (requires verification before applying)
  const [pendingChanges, setPendingChanges] = useState<{
    email?: { value: string; verifiedAt?: Date; expiresAt?: Date };
    phone?: { value: string; verifiedAt?: Date; expiresAt?: Date };
  }>({});
  
  // Cooldown tracking (normally from backend)
  const [changeCooldowns] = useState({
    businessName: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last changed 30 days ago
    taxId: null as Date | null,
    email: null as Date | null,
  });
  
  // Security audit log (normally from backend)
  const [auditLog] = useState([
    { action: "Password changed", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), ip: "102.89.xxx.xxx" },
    { action: "Email updated", date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), ip: "102.89.xxx.xxx" },
    { action: "2FA enabled", date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), ip: "102.89.xxx.xxx" },
  ]);

  // Function to request verification before sensitive action
  const requestVerification = (type: VerificationType, action: PendingAction) => {
    setVerificationType(type);
    setPendingAction(action);
    setVerificationPassword("");
    setVerificationOTP("");
    setVerificationError("");
    setShowOTPSent(false);
    setShowVerificationModal(true);
  };

  // Function to handle verification submission
  const handleVerification = async () => {
    setIsVerifying(true);
    setVerificationError("");
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock verification - in production, this would call the backend
    if (verificationType === "password" && verificationPassword !== "password123") {
      setVerificationError("Incorrect password. Please try again.");
      setIsVerifying(false);
      return;
    }
    
    if ((verificationType === "email-otp" || verificationType === "sms-otp") && verificationOTP !== "123456") {
      setVerificationError("Invalid verification code. Please try again.");
      setIsVerifying(false);
      return;
    }
    
    // Verification successful - proceed with action
    setIsVerifying(false);
    setShowVerificationModal(false);
    
    // Handle the pending action
    if (pendingAction?.type === "email") {
      setPendingChanges(prev => ({
        ...prev,
        email: { 
          value: pendingAction.newEmail, 
          verifiedAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hour window
        }
      }));
    }
    
    setPendingAction(null);
  };

  // Function to send OTP
  const sendOTP = async () => {
    setShowOTPSent(true);
    // In production, this would trigger backend to send OTP
  };

  const [notifications, setNotifications] = useState({
    invoicePaid: true,
    paymentReceived: true,
    invoiceOverdue: true,
    weeklyReport: false,
    monthlyReport: true,
    remindersSent: true,
    newCustomer: false,
  });

  const [paymentMethods, setPaymentMethods] = useState({
    flutterwaveEnabled: true,
    paystackEnabled: false,
    bankTransferEnabled: true,
    momoEnabled: true,
    cryptoEnabled: false,
  });

  const [invoiceDefaults, setInvoiceDefaults] = useState({
    dueDateDays: 30,
    onTimeThreshold: 3,
    autoReminders: true,
    defaultTaxRate: 0,
    lateFeeEnabled: false,
    lateFeePercent: 0,
  });

  // Sync local state with API settings when they load
  useEffect(() => {
    if (apiSettings) {
      setNotifications({
        invoicePaid: apiSettings.notifications?.invoice_paid ?? true,
        paymentReceived: apiSettings.notifications?.payment_received ?? true,
        invoiceOverdue: apiSettings.notifications?.invoice_overdue ?? true,
        weeklyReport: apiSettings.notifications?.weekly_report ?? false,
        monthlyReport: apiSettings.notifications?.monthly_report ?? true,
        remindersSent: apiSettings.notifications?.reminders_sent ?? true,
        newCustomer: apiSettings.notifications?.new_customer ?? false,
      });
      setPaymentMethods({
        flutterwaveEnabled: apiSettings.payment_methods?.flutterwave_enabled ?? false,
        paystackEnabled: apiSettings.payment_methods?.paystack_enabled ?? false,
        bankTransferEnabled: apiSettings.payment_methods?.bank_transfer_enabled ?? true,
        momoEnabled: apiSettings.payment_methods?.momo_enabled ?? true,
        cryptoEnabled: apiSettings.payment_methods?.crypto_enabled ?? false,
      });
      setInvoiceDefaults({
        dueDateDays: apiSettings.default_payment_terms ?? 30,
        onTimeThreshold: apiSettings.invoice_settings?.on_time_threshold_days ?? 3,
        autoReminders: apiSettings.invoice_settings?.auto_reminders ?? true,
        defaultTaxRate: apiSettings.invoice_settings?.default_tax_rate ?? 0,
        lateFeeEnabled: apiSettings.invoice_settings?.late_fee_enabled ?? false,
        lateFeePercent: apiSettings.invoice_settings?.late_fee_percent ?? 0,
      });
    }
  }, [apiSettings]);

  // Handler to save settings to API
  const handleSaveSettings = async (section: 'notifications' | 'payment_methods' | 'invoice_settings' | 'branding') => {
    let updates: Parameters<typeof updateSettings>[0] = {};
    
    switch (section) {
      case 'notifications':
        updates = {
          notifications: {
            invoice_paid: notifications.invoicePaid,
            payment_received: notifications.paymentReceived,
            invoice_overdue: notifications.invoiceOverdue,
            weekly_report: notifications.weeklyReport,
            monthly_report: notifications.monthlyReport,
            reminders_sent: notifications.remindersSent,
            new_customer: notifications.newCustomer,
          }
        };
        break;
      case 'payment_methods':
        updates = {
          payment_methods: {
            flutterwave_enabled: paymentMethods.flutterwaveEnabled,
            paystack_enabled: paymentMethods.paystackEnabled,
            bank_transfer_enabled: paymentMethods.bankTransferEnabled,
            momo_enabled: paymentMethods.momoEnabled,
            crypto_enabled: paymentMethods.cryptoEnabled,
          }
        };
        break;
      case 'invoice_settings':
        updates = {
          default_payment_terms: invoiceDefaults.dueDateDays,
          invoice_settings: {
            on_time_threshold_days: invoiceDefaults.onTimeThreshold,
            auto_reminders: invoiceDefaults.autoReminders,
            default_tax_rate: invoiceDefaults.defaultTaxRate,
            late_fee_enabled: invoiceDefaults.lateFeeEnabled,
            late_fee_percent: invoiceDefaults.lateFeePercent,
          }
        };
        break;
    }
    
    try {
      await updateSettings(updates);
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  const handleSwitchChange = (key: string, value: boolean) => {
    setNotifications({ ...notifications, [key]: value });
  };

  const handleInvoiceDefaultChange = (key: string, value: boolean | number) => {
    setInvoiceDefaults({ ...invoiceDefaults, [key]: value });
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#2D2D2D" }}>
          Settings
        </h1>
        <p className="text-sm" style={{ color: "#B0B3B8" }}>
          Manage your account, business, and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        {/* Tab Navigation - Scrollable */}
        <TabsList className="mb-8 w-full max-w-full overflow-x-auto flex-nowrap justify-start">
          <TabsTrigger value="profile">
            <User size={16} color="currentColor" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="business">
            <Building size={16} color="currentColor" />
            Business
          </TabsTrigger>
          <TabsTrigger value="payments">
            <Card size={16} color="currentColor" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="invoices">
            <Paperclip size={16} color="currentColor" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="branding">
            <Brush2 size={16} color="currentColor" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Notification size={16} color="currentColor" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Flash size={16} color="currentColor" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="data">
            <Data size={16} color="currentColor" />
            Data & Privacy
          </TabsTrigger>
          <TabsTrigger value="billing">
            <Wallet size={16} color="currentColor" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldTick size={16} color="currentColor" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-8">
          {/* Security Notice */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 flex items-start gap-3">
            <Shield size={20} color="#D97706" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Identity Protection Enabled</p>
              <p className="text-xs text-amber-700 mt-1">
                Changes to your email or phone require verification. Name changes are logged and reviewed for fraud prevention.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              <SecurityBadge level="medium" />
            </div>
            <p className="text-sm text-gray-500 mb-6">Manage your personal profile details</p>

            <div className="flex items-start gap-6 mb-8">
              <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                <User size={28} color="#9CA3AF" />
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="rounded-xl">
                  <DocumentUpload size={16} color="currentColor" className="mr-2" />
                  Upload Photo
                </Button>
                <p className="text-xs text-gray-500">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <span className="text-xs text-gray-400">(Changes are logged)</span>
                </div>
                <Input id="firstName" placeholder="Enter first name" defaultValue={apiSettings.full_name?.split(' ')[0] || ''} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <span className="text-xs text-gray-400">(Changes are logged)</span>
                </div>
                <Input id="lastName" placeholder="Enter last name" defaultValue={apiSettings.full_name?.split(' ').slice(1).join(' ') || ''} />
              </div>
              
              {/* Email with verification */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Lock size={12} color="#D97706" />
                </div>
                <div className="flex gap-2">
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="email@example.com" 
                    defaultValue={apiSettings.email || ''} 
                    disabled
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    className="rounded-xl whitespace-nowrap"
                    onClick={() => requestVerification("password", { type: "email", newEmail: "" })}
                  >
                    <Message size={14} color="currentColor" className="mr-2" />
                    Change
                  </Button>
                </div>
                {pendingChanges.email && (
                  <div className="flex items-center gap-2 text-xs text-teal-600 bg-teal-50 px-3 py-2 rounded-lg">
                    <TickCircle size={14} color="#14462a" />
                    <span>Pending: {pendingChanges.email.value} - Check your new email to confirm</span>
                  </div>
                )}
                <p className="text-xs text-gray-500">Requires password verification + confirmation email to new address</p>
              </div>
              
              {/* Phone with verification */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Lock size={12} color="#D97706" />
                </div>
                <div className="flex gap-2">
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+233 XX XXX XXXX" 
                    defaultValue="+233 24 123 4567" 
                    disabled
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    className="rounded-xl whitespace-nowrap"
                    onClick={() => requestVerification("sms-otp", { type: "phone", newPhone: "" })}
                  >
                    <Message size={14} color="currentColor" className="mr-2" />
                    Change
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Requires SMS verification to both old and new numbers</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-8">
              <Button variant="outline" className="rounded-xl">Cancel</Button>
              <Button 
                className="rounded-xl bg-[#14462a] hover:bg-[#14462a]/90"
                onClick={() => requestVerification("password", { type: "profile", field: "name" })}
              >
                <Lock size={14} color="white" className="mr-2" />
                Save Profile
              </Button>
            </div>
          </div>

          {/* Account Information Section */}
          <div className="border-t border-gray-100 pt-8">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
              <SecurityBadge level="low" />
            </div>
            <p className="text-sm text-gray-500 mb-6">Your Plaen account details and invoice settings</p>

            <div className="grid grid-cols-2 gap-6">
              {/* Account Type */}
              <div className="space-y-2">
                <Label>Account Type</Label>
                <div className="flex items-center gap-3 h-10 px-3 rounded-lg border border-gray-200 bg-gray-50">
                  <Building size={16} className="text-gray-400" />
                  <span className="text-gray-700 capitalize">{apiSettings?.account_type || 'Personal'}</span>
                </div>
                <p className="text-xs text-gray-500">Set during signup. Contact support to change.</p>
              </div>

              {/* Invoice Prefix */}
              <div className="space-y-2">
                <Label>Invoice Prefix</Label>
                <div className="flex items-center gap-3 h-10 px-3 rounded-lg border border-gray-200 bg-gray-50">
                  <Paperclip size={16} className="text-gray-400" />
                  <span className="text-gray-900 font-mono font-semibold">{apiSettings?.invoice_prefix || 'GH'}</span>
                  <span className="text-gray-400 font-mono">-0001</span>
                </div>
                <p className="text-xs text-gray-500">Your invoice numbers will be formatted as {apiSettings?.invoice_prefix || 'GH'}-XXXX</p>
              </div>

              {/* Email Verification Status */}
              <div className="space-y-2">
                <Label>Email Verification</Label>
                <div className="flex items-center gap-3 h-10 px-3 rounded-lg border border-gray-200 bg-gray-50">
                  {apiSettings?.email_verified ? (
                    <>
                      <TickCircle size={16} className="text-green-500" variant="Bold" />
                      <span className="text-green-700 font-medium">Verified</span>
                    </>
                  ) : (
                    <>
                      <CloseCircle size={16} className="text-amber-500" />
                      <span className="text-amber-700 font-medium">Not verified</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-auto h-7 text-xs text-[#14462a] hover:text-[#14462a]/80"
                      >
                        Verify now
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Tax ID */}
              <div className="space-y-2">
                <Label>Tax ID</Label>
                <div className="flex items-center gap-3 h-10 px-3 rounded-lg border border-gray-200 bg-gray-50">
                  <Verify size={16} className="text-gray-400" />
                  <span className="text-gray-700">{apiSettings?.tax_id || 'Not provided'}</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business" className="space-y-8">
          {/* Security Notice */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 flex items-start gap-3">
            <Shield size={20} color="#D97706" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Business Verification Required</p>
              <p className="text-xs text-amber-700 mt-1">
                Business name can only be changed once every 90 days. Tax ID changes require document verification and admin approval.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold text-gray-900">Business Details</h2>
              <SecurityBadge level="high" />
            </div>
            <p className="text-sm text-gray-500 mb-6">Information shown on your invoices</p>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Lock size={12} color="#EF4444" />
                  <span className="text-xs text-gray-400">(90-day cooldown)</span>
                </div>
                <Input id="businessName" placeholder="Your company name" defaultValue={apiSettings.business_name || ''} />
                <CooldownIndicator lastChanged={changeCooldowns.businessName} cooldownDays={90} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select defaultValue="llc">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sole">Sole Proprietor</SelectItem>
                    <SelectItem value="llc">Limited Liability Company (LLC)</SelectItem>
                    <SelectItem value="corp">Corporation</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="nonprofit">Non-Profit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="regNumber">Registration Number</Label>
                <Input id="regNumber" placeholder="Business registration #" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                  <Lock size={12} color="#EF4444" />
                </div>
                <div className="flex gap-2">
                  <Input id="taxId" placeholder="Tax identification number" className="flex-1" defaultValue={apiSettings.tax_id || ''} />
                  <Button 
                    variant="outline" 
                    className="rounded-xl whitespace-nowrap"
                    onClick={() => requestVerification("password", { type: "business", field: "taxId" })}
                  >
                    <Verify size={14} color="currentColor" className="mr-2" />
                    Verify
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Requires document upload for verification</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Business Address</h2>
            <p className="text-sm text-gray-500 mb-6">Your business location</p>

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input id="street" placeholder="123 Main Street" defaultValue={apiSettings.address?.line1 || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Accra" defaultValue={apiSettings.address?.city || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">State/Region</Label>
                <Input id="region" placeholder="Greater Accra" defaultValue={apiSettings.address?.state || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal">Postal Code</Label>
                <Input id="postal" placeholder="00233" defaultValue={apiSettings.address?.postal_code || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select defaultValue="gh">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gh">Ghana</SelectItem>
                    <SelectItem value="ng">Nigeria</SelectItem>
                    <SelectItem value="ke">Kenya</SelectItem>
                    <SelectItem value="za">South Africa</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="gb">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-8">
              <Button variant="outline" className="rounded-xl">Cancel</Button>
              <Button 
                className="rounded-xl bg-[#14462a] hover:bg-[#14462a]/90"
                onClick={() => requestVerification("password", { type: "business", field: "all" })}
              >
                <Lock size={14} color="white" className="mr-2" />
                Save Business Info
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-8">
          {/* Security Notice */}
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 flex items-start gap-3">
            <Shield size={20} color="#DC2626" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Payment Security</p>
              <p className="text-xs text-red-700 mt-1">
                All payment method changes require password verification. New bank accounts have a 48-hour cooling period before funds can be received. API keys are masked and changes are logged.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold text-gray-900">Payment Gateway Integrations</h2>
              <SecurityBadge level="high" />
            </div>
            <p className="text-sm text-gray-500 mb-6">Connect payment processors to accept online payments</p>

            <div className="rounded-2xl border border-gray-200 divide-y divide-gray-100">
              {/* Flutterwave */}
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center">
                      <Flash size={18} color="#F5A623" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Flutterwave</p>
                      <p className="text-xs text-gray-500">Cards · Bank · Mobile Money · USSD</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentMethods.flutterwaveEnabled}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        requestVerification("password", { type: "payment-gateway", gateway: "flutterwave" });
                      } else {
                        setPaymentMethods({ ...paymentMethods, flutterwaveEnabled: false });
                      }
                    }}
                  />
                </div>
                {paymentMethods.flutterwaveEnabled && (
                  <div className="grid grid-cols-2 gap-4 mt-4 pl-13">
                    <div className="space-y-2">
                      <Label className="text-xs">Public Key</Label>
                      <Input placeholder="FLWPUBK-xxxxxxxxxxxxx" className="h-10" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Secret Key</Label>
                        <Lock size={10} color="#EF4444" />
                      </div>
                      <Input type="password" placeholder="FLWSECK-xxxxxxxxxxxxx" className="h-10" />
                      <p className="text-xs text-gray-400">Masked for security</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Paystack */}
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-cyan-50 flex items-center justify-center">
                      <Card size={18} color="#00C3F7" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Paystack</p>
                      <p className="text-xs text-gray-500">Cards · Bank · Mobile Money</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentMethods.paystackEnabled}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        requestVerification("password", { type: "payment-gateway", gateway: "paystack" });
                      } else {
                        setPaymentMethods({ ...paymentMethods, paystackEnabled: false });
                      }
                    }}
                  />
                </div>
                {paymentMethods.paystackEnabled && (
                  <div className="grid grid-cols-2 gap-4 mt-4 pl-13">
                    <div className="space-y-2">
                      <Label className="text-xs">Public Key</Label>
                      <Input placeholder="pk_test_xxxxxxxxxxxxx" className="h-10" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Secret Key</Label>
                        <Lock size={10} color="#EF4444" />
                      </div>
                      <Input type="password" placeholder="sk_test_xxxxxxxxxxxxx" className="h-10" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold text-gray-900">Manual Payment Methods</h2>
              <SecurityBadge level="high" />
            </div>
            <p className="text-sm text-gray-500 mb-6">Bank accounts and mobile money for manual payments</p>

            <div className="rounded-2xl border border-gray-200 divide-y divide-gray-100">
              {/* Bank Transfer */}
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#14462a]/10 flex items-center justify-center">
                      <Bank size={18} color="#14462a" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Bank Transfer</p>
                      <p className="text-xs text-gray-500">Bank account details</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentMethods.bankTransferEnabled}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        requestVerification("password", { type: "bank-account" });
                      } else {
                        setPaymentMethods({ ...paymentMethods, bankTransferEnabled: false });
                      }
                    }}
                  />
                </div>
                {paymentMethods.bankTransferEnabled && (
                  <div className="space-y-4 mt-4 pl-13">
                    {/* 48-hour cooling period notice */}
                    <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                      <Timer1 size={14} color="#D97706" />
                      <span>New bank accounts have a 48-hour verification period before receiving funds</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Bank Name</Label>
                        <Input placeholder="e.g., Zenith Bank" className="h-10" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Account Number</Label>
                        <Input placeholder="0123456789" className="h-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Account Name</Label>
                      <Input placeholder="Plaen Technologies Ltd" className="h-10" />
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Money */}
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#14462a]/10 flex items-center justify-center">
                      <Mobile size={18} color="#14462a" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Mobile Money</p>
                      <p className="text-xs text-gray-500">MTN, Vodafone, Airtel, M-Pesa</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentMethods.momoEnabled}
                    onCheckedChange={(checked) => setPaymentMethods({ ...paymentMethods, momoEnabled: checked })}
                  />
                </div>
                {paymentMethods.momoEnabled && (
                  <div className="space-y-4 mt-4 pl-13">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Provider</Label>
                        <Select defaultValue="mtn">
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                            <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                            <SelectItem value="airtel">AirtelTigo Money</SelectItem>
                            <SelectItem value="mpesa">M-Pesa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Phone Number</Label>
                        <Input type="tel" placeholder="+233 24 123 4567" className="h-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Registered Name</Label>
                      <Input placeholder="Name on mobile money account" className="h-10" />
                    </div>
                  </div>
                )}
              </div>

              {/* Cryptocurrency */}
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#14462a]/10 flex items-center justify-center">
                      <Bitcoin size={18} color="#14462a" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Cryptocurrency</p>
                      <p className="text-xs text-gray-500">USDT, Bitcoin, Ethereum</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentMethods.cryptoEnabled}
                    onCheckedChange={(checked) => setPaymentMethods({ ...paymentMethods, cryptoEnabled: checked })}
                  />
                </div>
                {paymentMethods.cryptoEnabled && (
                  <div className="space-y-4 mt-4 pl-13">
                    <div className="space-y-2">
                      <Label className="text-xs">USDT (TRC20) Address</Label>
                      <Input placeholder="TRC20 wallet address" className="h-10" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Bitcoin Address</Label>
                      <Input placeholder="BTC wallet address" className="h-10" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-8">
              <Button variant="outline" className="rounded-xl">Cancel</Button>
              <Button 
                className="rounded-xl bg-[#14462a] hover:bg-[#14462a]/90"
                onClick={() => requestVerification("password", { type: "bank-account" })}
              >
                <Lock size={14} color="white" className="mr-2" />
                Save Payment Methods
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Invoice Defaults</h2>
            <p className="text-sm text-gray-500 mb-6">Configure default invoice settings</p>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
                  <Lock size={12} color="#EF4444" />
                </div>
                <Input id="invoicePrefix" value={apiSettings.invoice_prefix || 'GH'} readOnly className="bg-gray-50" />
                <p className="text-xs text-gray-500">Format: {apiSettings.invoice_prefix || 'GH'}-0001, {apiSettings.invoice_prefix || 'GH'}-0002, etc.</p>
                <p className="text-xs text-amber-600">
                  Prefix is locked after first invoice. <a href="/support" className="underline hover:text-amber-700">Contact support</a> to request a change.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Default Due Date</Label>
                <Select defaultValue="30" onValueChange={(value) => handleInvoiceDefaultChange("dueDateDays", parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Due on receipt</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days (Net 30)</SelectItem>
                    <SelectItem value="60">60 days (Net 60)</SelectItem>
                    <SelectItem value="90">90 days (Net 90)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate">Default Tax Rate</Label>
                <div className="flex items-center gap-2">
                  <Input id="taxRate" type="number" placeholder="0" defaultValue="0" className="flex-1" />
                  <span className="text-sm text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500">Applied to all line items by default</p>
              </div>
              <div className="space-y-2">
                <Label>On-Time Threshold</Label>
                <Select defaultValue="3" onValueChange={(value) => handleInvoiceDefaultChange("onTimeThreshold", parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Same day as invoice date</SelectItem>
                    <SelectItem value="1">≤1 day</SelectItem>
                    <SelectItem value="3">≤3 days (recommended)</SelectItem>
                    <SelectItem value="7">≤7 days</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">For on-time rate calculation</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Additional Options</h2>

            <div className="rounded-2xl border border-gray-200 divide-y divide-gray-100">
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Late Fees</p>
                  <p className="text-xs text-gray-500">Automatically add late fees to overdue invoices</p>
                </div>
                <Switch
                  checked={invoiceDefaults.lateFeeEnabled}
                  onCheckedChange={(checked) => handleInvoiceDefaultChange("lateFeeEnabled", checked)}
                />
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Automatic Reminders</p>
                  <p className="text-xs text-gray-500">Send payment reminders for overdue invoices</p>
                </div>
                <Switch
                  checked={invoiceDefaults.autoReminders}
                  onCheckedChange={(checked) => handleInvoiceDefaultChange("autoReminders", checked)}
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Default Footer</h2>
            <p className="text-sm text-gray-500 mb-4">This text appears at the bottom of all invoices</p>
            <Textarea
              placeholder="Thank you for your business. Payment is due within 30 days."
              defaultValue="Thank you for your business. Payment is due within 30 days."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" className="rounded-xl">Cancel</Button>
            <Button className="rounded-xl bg-[#14462a] hover:bg-[#14462a]/90">Save Invoice Settings</Button>
          </div>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Business Logo</h2>
            <p className="text-sm text-gray-500 mb-6">Upload your company logo</p>

            <div className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-2xl bg-gray-100 flex items-center justify-center">
                <DocumentUpload size={20} color="#9CA3AF" />
              </div>
              <div className="flex-1">
                <Button variant="outline" className="rounded-xl mb-2">
                  <DocumentUpload size={16} color="currentColor" className="mr-2" />
                  Upload Logo
                </Button>
                <p className="text-xs text-gray-500">Square image, PNG or SVG, min 200×200px</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Brand Colors</h2>
            <div className="grid grid-cols-2 gap-6">
              <ColorPicker value="#14462a" label="Primary Brand Color" description="Used for buttons and highlights" />
              <ColorPicker value="#2D2D2D" label="Accent Color" description="Used for headings and text" />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Invoice Appearance</h2>
            <div className="max-w-sm space-y-2">
              <Label>Invoice Template</Label>
              <Select defaultValue="modern">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern (Default)</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Email Signature</h2>
            <p className="text-sm text-gray-500 mb-4">Appears in all outgoing invoice emails</p>
            <Textarea
              placeholder="Best regards,&#10;Your Name&#10;Your Company"
              defaultValue={`Best regards,\n${apiSettings.full_name || 'Your Name'}\n${apiSettings.business_name || 'Your Business'}`}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" className="rounded-xl">Cancel</Button>
            <Button className="rounded-xl bg-[#14462a] hover:bg-[#14462a]/90">Save Branding</Button>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Email Notifications</h2>
            <p className="text-sm text-gray-500 mb-6">Configure which notifications you receive</p>

            <div className="rounded-2xl border border-gray-200 divide-y divide-gray-100">
              {[
                { key: "invoicePaid", label: "Invoice Paid", description: "Notify when an invoice is marked as paid" },
                { key: "paymentReceived", label: "Payment Received", description: "Notify when a payment is received" },
                { key: "invoiceOverdue", label: "Invoice Overdue", description: "Notify when an invoice becomes overdue" },
                { key: "remindersSent", label: "Reminders Sent", description: "Notify when automatic reminders are sent" },
                { key: "newCustomer", label: "New Customer", description: "Notify when a new customer is added" },
                { key: "weeklyReport", label: "Weekly Report", description: "Receive weekly AR summary reports" },
                { key: "monthlyReport", label: "Monthly Report", description: "Receive monthly financial reports" },
              ].map((item) => (
                <div key={item.key} className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) => handleSwitchChange(item.key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Reminder Preferences</h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Preferred Channel</Label>
                <Select defaultValue="email">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="both">Email + WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Reminder Before Due Date</Label>
                <Select defaultValue="3">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No advance reminder</SelectItem>
                    <SelectItem value="1">1 day before</SelectItem>
                    <SelectItem value="3">3 days before</SelectItem>
                    <SelectItem value="7">7 days before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Overdue Reminder Frequency</Label>
                <Select defaultValue="7">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No automatic reminders</SelectItem>
                    <SelectItem value="3">Every 3 days</SelectItem>
                    <SelectItem value="7">Every 7 days</SelectItem>
                    <SelectItem value="14">Every 14 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Maximum Reminders</Label>
                <Select defaultValue="3">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 reminder</SelectItem>
                    <SelectItem value="3">3 reminders</SelectItem>
                    <SelectItem value="5">5 reminders</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" className="rounded-xl">Cancel</Button>
            <Button className="rounded-xl bg-[#14462a] hover:bg-[#14462a]/90">Save Notifications</Button>
          </div>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Connected Apps</h2>
            <p className="text-sm text-gray-500 mb-6">Manage third-party integrations</p>

            <div className="rounded-2xl border border-gray-200 divide-y divide-gray-100">
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Global size={18} color="#4285F4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Google Calendar</p>
                    <p className="text-xs text-gray-500">Sync payment due dates to your calendar</p>
                  </div>
                </div>
                <Button className="rounded-xl bg-[#14462a] hover:bg-[#14462a]/90">Connect</Button>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Code size={18} color="#333" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Slack</p>
                    <p className="text-xs text-gray-500">Get payment notifications in Slack</p>
                  </div>
                </div>
                <Button className="rounded-xl bg-[#14462a] hover:bg-[#14462a]/90">Connect</Button>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                    <Link2 size={18} color="#6366F1" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Zapier</p>
                    <p className="text-xs text-gray-500">Automate workflows with 5000+ apps</p>
                  </div>
                </div>
                <Button className="rounded-xl bg-[#14462a] hover:bg-[#14462a]/90">Connect</Button>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold text-gray-900">API Access</h2>
              <SecurityBadge level="high" />
            </div>
            <p className="text-sm text-gray-500 mb-6">Manage API keys for custom integrations</p>

            {/* Security Warning */}
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 flex items-start gap-3 mb-6">
              <Shield size={20} color="#DC2626" className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">API Key Security</p>
                <p className="text-xs text-red-700 mt-1">
                  API keys provide full access to your account. Keep them secret and never share them. Generating a new key will invalidate the old one after 24 hours.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">API Key</p>
                  <p className="text-xs text-gray-500">Use this key to authenticate API requests</p>
                </div>
                <Button 
                  variant="outline" 
                  className="rounded-xl"
                  onClick={() => requestVerification("password", { type: "api-key" })}
                >
                  <Key size={14} color="currentColor" className="mr-2" />
                  Generate New Key
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  value="sk_live_••••••••••••••••••••••••" 
                  readOnly
                  className="font-mono text-sm flex-1 bg-gray-50" 
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-xl h-11 w-11"
                  onClick={() => requestVerification("password", { type: "api-key" })}
                >
                  <Eye size={16} color="currentColor" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-xl h-11 w-11">
                  <Copy size={16} color="currentColor" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Last used: 2 hours ago · Created: Nov 15, 2024</p>
            </div>
          </div>
        </TabsContent>

        {/* Data & Privacy Tab */}
        <TabsContent value="data" className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Export Data</h2>
            <p className="text-sm text-gray-500 mb-6">Download your data in various formats</p>

            <div className="grid grid-cols-3 gap-4">
              <Button variant="outline" className="rounded-2xl h-20 flex-col gap-2">
                <DocumentDownload size={20} color="#14462a" />
                <span className="text-sm">Export Invoices</span>
              </Button>
              <Button variant="outline" className="rounded-2xl h-20 flex-col gap-2">
                <DocumentDownload size={20} color="#14462a" />
                <span className="text-sm">Export Payments</span>
              </Button>
              <Button variant="outline" className="rounded-2xl h-20 flex-col gap-2">
                <DocumentDownload size={20} color="#14462a" />
                <span className="text-sm">Export Contacts</span>
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Data Retention</h2>
            <p className="text-sm text-gray-500 mb-6">Control how long your data is stored</p>

            <div className="rounded-2xl border border-gray-200 divide-y divide-gray-100">
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Auto-delete old drafts</p>
                  <p className="text-xs text-gray-500">Automatically remove draft invoices older than 90 days</p>
                </div>
                <Switch />
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Archive paid invoices</p>
                  <p className="text-xs text-gray-500">Move fully paid invoices to archive after 1 year</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Danger Zone</h2>
            <p className="text-sm text-gray-500 mb-6">Irreversible and destructive actions</p>

            <div className="rounded-2xl border border-red-200 bg-red-50/30 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Delete Account</p>
                  <p className="text-xs text-gray-500">Permanently delete your account and all data</p>
                </div>
                <Button 
                  variant="outline" 
                  className="rounded-xl border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => requestVerification("password", { type: "delete-account" })}
                >
                  <Trash size={14} color="#DC2626" className="mr-2" />
                  Delete Account
                </Button>
              </div>
              
              {/* Security requirements for deletion */}
              <div className="bg-white rounded-lg p-4 border border-red-100">
                <p className="text-xs font-medium text-gray-700 mb-2">Before deleting, you must:</p>
                <ul className="space-y-1">
                  {[
                    "Settle all outstanding invoices",
                    "Download your data export",
                    "Confirm via email verification",
                    "Wait 7-day cooling period",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                      <CloseCircle size={12} color="#F87171" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Current Plan</h2>
                <p className="text-sm text-gray-500">Your subscription details</p>
              </div>
              <Button variant="outline" className="rounded-xl" onClick={() => setShowChangePlanModal(true)}>
                Change Plan
              </Button>
            </div>

            <div className="rounded-2xl border border-gray-200 p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[#14462a]/10 flex items-center justify-center">
                  <CedisCircle className="h-6 w-6 text-[#14462a]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-gray-900">Plaen Pro</p>
                    <Badge variant="paid">
                      <TickCircle size={14} color="#14462a" variant="Bold" />
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">Renews on December 1, 2024</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ₵99<span className="text-sm font-normal text-gray-500">/mo</span>
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Payment Method</h2>
                <p className="text-sm text-gray-500">Manage your payment method</p>
              </div>
              <Button variant="outline" className="rounded-xl" onClick={() => setShowPaymentMethodModal(true)}>Update</Button>
            </div>

            <div className="rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Card size={18} color="#2D2D2D" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                <p className="text-xs text-gray-500">Expires 12/2025</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Billing History</h2>
                <p className="text-sm text-gray-500">View past invoices</p>
              </div>
              <Button variant="outline" className="rounded-xl" onClick={() => setShowBillingHistoryModal(true)}>
                View All
              </Button>
            </div>

            <div className="rounded-2xl border border-gray-200 divide-y divide-gray-100">
              {[
                { date: "Nov 1, 2024", amount: "₵99.00", status: "Paid" },
                { date: "Oct 1, 2024", amount: "₵99.00", status: "Paid" },
                { date: "Sep 1, 2024", amount: "₵99.00", status: "Paid" },
              ].map((invoice, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} color="#9CA3AF" />
                    <span className="text-sm text-gray-900">{invoice.date}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-900">{invoice.amount}</span>
                    <Badge variant="paid">
                      <TickCircle size={14} color="#14462a" variant="Bold" />
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-8">
          {/* Security Overview */}
          <div className="rounded-xl border border-[#14462a]/20 bg-[#14462a]/5 p-4 flex items-start gap-3">
            <ShieldTick size={20} color="#14462a" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#14462a]">Account Security Status: Good</p>
              <p className="text-xs text-[#14462a]/70 mt-1">
                Password strength is strong. Enable 2FA for maximum protection.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Change Password</h2>
            <p className="text-sm text-gray-500 mb-6">Update your account password</p>

            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswordVisibility.current ? "text" : "password"}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswordVisibility.current ? <EyeSlash size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswordVisibility.new ? "text" : "password"}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswordVisibility.new ? <EyeSlash size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Min 8 characters, include uppercase, lowercase, number, and symbol</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswordVisibility.confirm ? "text" : "password"}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswordVisibility.confirm ? <EyeSlash size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                  </button>
                </div>
              </div>
              <Button className="rounded-xl bg-[#14462a] hover:bg-[#14462a]/90">
                <PasswordCheck size={16} color="white" className="mr-2" />
                Update Password
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Two-Factor Authentication</h2>
            <p className="text-sm text-gray-500 mb-6">Add an extra layer of security</p>

            <div className="rounded-2xl border border-gray-200 p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <FingerScan size={24} color="#14462a" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Protect your account with 2FA</p>
                </div>
              </div>
              <Button className="rounded-xl bg-[#14462a] hover:bg-[#14462a]/90" onClick={() => setShow2FAModal(true)}>
                Enable 2FA
              </Button>
            </div>
          </div>

          {/* Security Audit Log */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold text-gray-900">Security Activity Log</h2>
              <Button variant="ghost" className="text-sm text-[#14462a]">View All</Button>
            </div>
            <p className="text-sm text-gray-500 mb-6">Recent security-related changes to your account</p>

            <div className="rounded-2xl border border-gray-200 divide-y divide-gray-100">
              {auditLog.map((log, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <ShieldTick size={14} color="#14462a" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{log.action}</p>
                      <p className="text-xs text-gray-500">
                        IP: {log.ip} · {log.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Active Sessions</h2>
            <p className="text-sm text-gray-500 mb-6">Manage devices where you&apos;re logged in</p>

            <div className="rounded-2xl border border-gray-200 divide-y divide-gray-100">
              {[
                { device: "MacBook Pro - Chrome", location: "Accra, Ghana", time: "Current session", current: true },
                { device: "iPhone 15 Pro - Safari", location: "Accra, Ghana", time: "2 hours ago", current: false },
                { device: "Windows PC - Firefox", location: "Lagos, Nigeria", time: "3 days ago", current: false },
              ].map((session, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Setting2 size={18} color="#2D2D2D" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{session.device}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <Location size={12} color="#9CA3AF" /> {session.location} · <Clock size={12} color="#9CA3AF" /> {session.time}
                      </p>
                    </div>
                  </div>
                  {session.current ? (
                    <Badge variant="paid">
                      <TickCircle size={14} color="#14462a" variant="Bold" />
                      Current
                    </Badge>
                  ) : (
                    <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 rounded-xl">
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" className="rounded-xl text-red-600 border-red-200 hover:bg-red-50">
                <CloseCircle size={14} color="#DC2626" className="mr-2" />
                Revoke All Other Sessions
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Change Plan Modal */}
      {showChangePlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowChangePlanModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Choose Your Plan</h2>
            <p className="text-sm text-gray-500 mb-6">Select the plan that works best for your business</p>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {[
                { name: "Free", price: "₵0", features: ["Unlimited invoices", "Basic features", "Email support"], current: false },
                { name: "Pro", price: "₵99", features: ["Everything in Free", "Advanced analytics", "Priority support"], current: true },
                { name: "Enterprise", price: "Custom", features: ["Everything in Pro", "Custom integration", "Dedicated support"], current: false },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-xl p-6 cursor-pointer transition-all ${
                    plan.current ? "border-2 border-[#14462a] bg-[#14462a]/5" : "border border-gray-200 hover:border-[#14462a]/50"
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-3xl font-bold text-gray-900 mb-4">
                    {plan.price}
                    {plan.price !== "Custom" && <span className="text-sm font-normal text-gray-500">/mo</span>}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                        <TickCircle size={16} color="#14462a" className="mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full rounded-xl ${
                      plan.current ? "bg-[#14462a] hover:bg-[#14462a]/90" : ""
                    }`}
                    variant={plan.current ? "default" : "outline"}
                  >
                    {plan.current ? "Current Plan" : plan.name === "Free" ? "Downgrade" : "Upgrade"}
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button variant="outline" className="rounded-xl" onClick={() => setShowChangePlanModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Billing History Modal */}
      {showBillingHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowBillingHistoryModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Billing History</h2>
            <p className="text-sm text-gray-500 mb-6">Download your past invoices and receipts</p>

            <div className="space-y-3">
              {[
                { id: "inv_2024_11", date: "Nov 1, 2024", description: "Plaen Pro - November 2024", amount: "₵99.00" },
                { id: "inv_2024_10", date: "Oct 1, 2024", description: "Plaen Pro - October 2024", amount: "₵99.00" },
                { id: "inv_2024_09", date: "Sep 1, 2024", description: "Plaen Pro - September 2024", amount: "₵99.00" },
                { id: "inv_2024_08", date: "Aug 1, 2024", description: "Plaen Pro - August 2024", amount: "₵99.00" },
                { id: "inv_2024_07", date: "Jul 1, 2024", description: "Plaen Pro - July 2024", amount: "₵99.00" },
              ].map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-[#14462a]/10">
                      <Calendar size={18} color="#14462a" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{invoice.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{invoice.amount}</p>
                      <Badge variant="paid" className="mt-1">
                        <TickCircle size={14} color="#14462a" variant="Bold" />
                        Paid
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9" onClick={() => alert(`Download invoice: ${invoice.description}`)}>
                      <DocumentDownload size={16} color="currentColor" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="outline" className="rounded-xl" onClick={() => setShowBillingHistoryModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentMethodModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPaymentMethodModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Update Payment Method</h2>
            <p className="text-sm text-gray-500 mb-6">Add or update your payment method for subscriptions</p>

            {/* Current Card */}
            <div className="mb-6">
              <Label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Current Method</Label>
              <div className="rounded-xl border border-gray-200 p-4 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-gray-200">
                    <Card size={18} color="#2D2D2D" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                    <p className="text-xs text-gray-500">Expires 12/2025</p>
                  </div>
                </div>
                <Badge variant="paid">
                  <TickCircle size={14} color="#14462a" variant="Bold" />
                  Active
                </Badge>
              </div>
            </div>

            {/* New Card Form */}
            <div className="space-y-4">
              <Label className="text-xs text-gray-500 uppercase tracking-wider block">New Payment Method</Label>
              
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  className="rounded-xl"
                />
              </div>
            </div>

            {/* Mobile Money Option */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">Or Pay with Mobile Money</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="rounded-xl h-12 flex items-center justify-center gap-2">
                  <Mobile size={18} color="#FFCC00" />
                  <span className="text-sm font-medium">MTN MoMo</span>
                </Button>
                <Button variant="outline" className="rounded-xl h-12 flex items-center justify-center gap-2">
                  <Mobile size={18} color="#E60000" />
                  <span className="text-sm font-medium">Vodafone Cash</span>
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button variant="outline" className="rounded-xl" onClick={() => setShowPaymentMethodModal(false)}>
                Cancel
              </Button>
              <Button className="rounded-xl" style={{ backgroundColor: '#14462a' }} onClick={() => {
                alert('Payment method updated successfully!');
                setShowPaymentMethodModal(false);
              }}>
                Update Payment Method
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShow2FAModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="h-16 w-16 rounded-full bg-[#14462a]/10 flex items-center justify-center mx-auto mb-4">
                <FingerScan size={32} color="#14462a" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Enable Two-Factor Authentication</h2>
              <p className="text-sm text-gray-500 mt-2">Scan the QR code with your authenticator app</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6 text-center">
              <div className="h-40 w-40 bg-white rounded-lg mx-auto flex items-center justify-center border border-gray-200">
                <p className="text-sm text-gray-400">QR Code</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <Label htmlFor="twoFactorCode">Enter 6-digit code</Label>
              <Input id="twoFactorCode" placeholder="000000" className="text-center tracking-widest" />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShow2FAModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1 rounded-xl bg-[#14462a] hover:bg-[#14462a]/90">
                Verify & Enable
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Security Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowVerificationModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Lock size={32} color="#D97706" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {verificationType === "password" && "Verify Your Identity"}
                {verificationType === "email-otp" && "Email Verification"}
                {verificationType === "sms-otp" && "Phone Verification"}
                {verificationType === "2fa" && "Two-Factor Authentication"}
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {verificationType === "password" && "Enter your password to confirm this action"}
                {verificationType === "email-otp" && "We've sent a code to your email address"}
                {verificationType === "sms-otp" && "We've sent a code to your phone number"}
                {verificationType === "2fa" && "Enter the code from your authenticator app"}
              </p>
            </div>

            {/* Action being performed */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-xs text-gray-500 mb-1">You are about to:</p>
              <p className="text-sm font-medium text-gray-900">
                {pendingAction?.type === "profile" && "Update your profile information"}
                {pendingAction?.type === "business" && "Update business details"}
                {pendingAction?.type === "email" && "Change your email address"}
                {pendingAction?.type === "phone" && "Change your phone number"}
                {pendingAction?.type === "payment-gateway" && `Enable ${(pendingAction as { gateway: string }).gateway}`}
                {pendingAction?.type === "bank-account" && "Update payment methods"}
                {pendingAction?.type === "api-key" && "Generate or view API key"}
                {pendingAction?.type === "delete-account" && "Delete your account permanently"}
              </p>
            </div>

            {verificationType === "password" && (
              <div className="space-y-2 mb-6">
                <Label htmlFor="verifyPassword">Password</Label>
                <div className="relative">
                  <Input
                    id="verifyPassword"
                    type="password"
                    placeholder="Enter your password"
                    value={verificationPassword}
                    onChange={(e) => setVerificationPassword(e.target.value)}
                  />
                </div>
                {verificationError && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <Warning2 size={12} color="#DC2626" />
                    {verificationError}
                  </p>
                )}
              </div>
            )}

            {(verificationType === "email-otp" || verificationType === "sms-otp") && (
              <div className="space-y-4 mb-6">
                {!showOTPSent ? (
                  <Button 
                    variant="outline" 
                    className="w-full rounded-xl"
                    onClick={sendOTP}
                  >
                    <Message size={16} color="currentColor" className="mr-2" />
                    Send Verification Code
                  </Button>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-xs text-teal-600 bg-teal-50 px-3 py-2 rounded-lg">
                      <TickCircle size={14} color="#14462a" />
                      <span>Code sent! Check your {verificationType === "email-otp" ? "email" : "phone"}</span>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="verifyOTP">Verification Code</Label>
                      <Input
                        id="verifyOTP"
                        placeholder="Enter 6-digit code"
                        value={verificationOTP}
                        onChange={(e) => setVerificationOTP(e.target.value)}
                        className="text-center tracking-widest"
                        maxLength={6}
                      />
                    </div>
                    {verificationError && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <Warning2 size={12} color="#DC2626" />
                        {verificationError}
                      </p>
                    )}
                    <button className="text-xs text-[#14462a] hover:underline" onClick={sendOTP}>
                      Didn&apos;t receive code? Send again
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl" 
                onClick={() => setShowVerificationModal(false)}
                disabled={isVerifying}
              >
                Cancel
              </Button>
              <Button 
                className={`flex-1 rounded-xl ${
                  pendingAction?.type === "delete-account" 
                    ? "bg-red-600 hover:bg-red-700" 
                    : "bg-[#14462a] hover:bg-[#14462a]/90"
                }`}
                onClick={handleVerification}
                disabled={isVerifying || (verificationType === "password" && !verificationPassword) || ((verificationType === "email-otp" || verificationType === "sms-otp") && !verificationOTP)}
              >
                {isVerifying ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldTick size={16} color="white" className="mr-2" />
                    {pendingAction?.type === "delete-account" ? "Confirm Deletion" : "Verify & Continue"}
                  </>
                )}
              </Button>
            </div>

            {/* Security note */}
            <p className="text-xs text-gray-400 text-center mt-4">
              This verification helps protect your account from unauthorized changes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
