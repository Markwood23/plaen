"use client";

import { useState, useEffect } from "react";
import {
  User,
  Notification,
  ShieldTick,
  Building,
  Brush2,
  Data,
  Mobile,
  Bank,
  DocumentDownload,
  Trash,
  TickCircle,
  Call,
  Clock,
  Location,
  Warning2,
  Setting2,
  CloseCircle,
  Wallet,
  Bitcoin,
  Eye,
  EyeSlash,
  FingerScan,
  Card,
  Calendar,
} from "iconsax-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettingsData } from "@/hooks/useSettingsData";
import { LogoUpload } from "@/components/ui/logo-upload";

export default function SettingsPage() {
  const { settings: apiSettings, loading, updateSettings } = useSettingsData();
  
  // Local state for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("llc");
  const [taxId, setTaxId] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("gh");
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    invoicePaid: true,
    paymentReceived: true,
    invoiceOverdue: true,
    remindersSent: false,
    newCustomer: true,
    weeklyReport: false,
    monthlyReport: true,
  });

  // Invoice defaults
  const [invoiceDefaults, setInvoiceDefaults] = useState({
    dueDateDays: 30,
    taxRate: 0,
    onTimeThreshold: 3,
    lateFeeEnabled: false,
    autoReminders: true,
    footerText: "Thank you for your business. Payment is due within 30 days.",
  });

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState({
    bankTransferEnabled: true,
    momoEnabled: true,
    cryptoEnabled: false,
  });
  
  // Bank details
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  
  // MoMo details
  const [momoDetails, setMomoDetails] = useState({
    provider: "mtn",
    phoneNumber: "",
    registeredName: "",
  });
  
  // Crypto details
  const [cryptoDetails, setCryptoDetails] = useState({
    usdtAddress: "",
    btcAddress: "",
  });

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  
  // 2FA
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  
  // Billing modals
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("free");

  // Delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Saving states
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingBusiness, setSavingBusiness] = useState(false);
  const [savingPayments, setSavingPayments] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [savingInvoice, setSavingInvoice] = useState(false);
  const [savingBranding, setSavingBranding] = useState(false);

  // Sync from API settings when loaded
  useEffect(() => {
    if (apiSettings) {
      // Profile
      const nameParts = (apiSettings.full_name || "").split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setPhone(apiSettings.phone || "");
      
      // Business
      setBusinessName(apiSettings.business_name || "");
      setBusinessType(apiSettings.business_type || "llc");
      setTaxId(apiSettings.tax_id || "");
      setStreetAddress(apiSettings.address?.line1 || "");
      setCity(apiSettings.address?.city || "");
      setRegion(apiSettings.address?.state || "");
      setPostalCode(apiSettings.address?.postal_code || "");
      setCountry(apiSettings.address?.country || "gh");
      
      // Notifications (API uses snake_case)
      if (apiSettings.notifications) {
        setNotifications({
          invoicePaid: apiSettings.notifications.invoice_paid ?? true,
          paymentReceived: apiSettings.notifications.payment_received ?? true,
          invoiceOverdue: apiSettings.notifications.invoice_overdue ?? true,
          remindersSent: apiSettings.notifications.reminders_sent ?? false,
          newCustomer: apiSettings.notifications.new_customer ?? true,
          weeklyReport: apiSettings.notifications.weekly_report ?? false,
          monthlyReport: apiSettings.notifications.monthly_report ?? true,
        });
      }
      
      // Invoice defaults (API uses snake_case)
      if (apiSettings.invoice_settings) {
        setInvoiceDefaults({
          dueDateDays: apiSettings.default_payment_terms ?? 30,
          taxRate: apiSettings.invoice_settings.default_tax_rate ?? 0,
          onTimeThreshold: apiSettings.invoice_settings.on_time_threshold_days ?? 3,
          lateFeeEnabled: apiSettings.invoice_settings.late_fee_enabled ?? false,
          autoReminders: apiSettings.invoice_settings.auto_reminders ?? true,
          footerText: "Thank you for your business. Payment is due within 30 days.",
        });
      }
      
      // Payment methods
      if (apiSettings.payment_methods) {
        setPaymentMethods({
          bankTransferEnabled: apiSettings.payment_methods.bank_transfer_enabled ?? true,
          momoEnabled: apiSettings.payment_methods.momo_enabled ?? true,
          cryptoEnabled: apiSettings.payment_methods.crypto_enabled ?? false,
        });
      }
      
      // Crypto wallet details
      if (apiSettings.crypto_wallets && apiSettings.crypto_wallets.length > 0) {
        const usdtWallet = apiSettings.crypto_wallets.find((w: { currency: string }) => w.currency === "USDT");
        const btcWallet = apiSettings.crypto_wallets.find((w: { currency: string }) => w.currency === "BTC");
        setCryptoDetails({
          usdtAddress: usdtWallet?.wallet_address || "",
          btcAddress: btcWallet?.wallet_address || "",
        });
      }
      
      // Bank details from root level
      if (apiSettings.bank_details && apiSettings.bank_details.length > 0) {
        const primaryBank = apiSettings.bank_details.find(b => b.is_primary) || apiSettings.bank_details[0];
        setBankDetails({
          bankName: primaryBank.bank_name || "",
          accountNumber: primaryBank.account_number || "",
          accountName: primaryBank.account_name || "",
        });
      }
      
      // MoMo details from root level
      if (apiSettings.mobile_money_details && apiSettings.mobile_money_details.length > 0) {
        const primaryMomo = apiSettings.mobile_money_details.find(m => m.is_primary) || apiSettings.mobile_money_details[0];
        setMomoDetails({
          provider: primaryMomo.provider || "mtn",
          phoneNumber: primaryMomo.phone_number || "",
          registeredName: primaryMomo.account_name || "",
        });
      }
    }
  }, [apiSettings]);

  // Save profile
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await updateSettings({
        full_name: `${firstName} ${lastName}`.trim(),
        phone,
      });
    } finally {
      setSavingProfile(false);
    }
  };

  // Save business info
  const handleSaveBusiness = async () => {
    setSavingBusiness(true);
    try {
      await updateSettings({
        business_name: businessName,
        business_type: businessType,
        tax_id: taxId,
        address: {
          line1: streetAddress,
          city,
          state: region,
          postal_code: postalCode,
          country,
        },
      });
    } finally {
      setSavingBusiness(false);
    }
  };

  // Save payment methods
  const handleSavePaymentMethods = async () => {
    setSavingPayments(true);
    try {
      // Build the bank details array if enabled
      const bankDetailsArray = paymentMethods.bankTransferEnabled && bankDetails.bankName ? [{
        id: "primary",
        bank_name: bankDetails.bankName,
        account_number: bankDetails.accountNumber,
        account_name: bankDetails.accountName,
        is_primary: true,
      }] : [];
      
      // Build the momo details array if enabled
      const momoDetailsArray = paymentMethods.momoEnabled && momoDetails.phoneNumber ? [{
        id: "primary",
        provider: momoDetails.provider,
        phone_number: momoDetails.phoneNumber,
        account_name: momoDetails.registeredName,
        is_primary: true,
      }] : [];
      
      // Build crypto wallets array if enabled
      const cryptoWalletsArray = paymentMethods.cryptoEnabled ? [
        ...(cryptoDetails.usdtAddress ? [{
          id: "usdt",
          currency: "USDT",
          wallet_address: cryptoDetails.usdtAddress,
          network: "TRC20",
          is_primary: true,
        }] : []),
        ...(cryptoDetails.btcAddress ? [{
          id: "btc",
          currency: "BTC",
          wallet_address: cryptoDetails.btcAddress,
          network: "Bitcoin",
          is_primary: false,
        }] : []),
      ] : [];
      
      await updateSettings({
        payment_methods: {
          bank_transfer_enabled: paymentMethods.bankTransferEnabled,
          momo_enabled: paymentMethods.momoEnabled,
          flutterwave_enabled: true, // Always enabled for online payments
          paystack_enabled: false,
          crypto_enabled: paymentMethods.cryptoEnabled,
        },
        bank_details: bankDetailsArray,
        mobile_money_details: momoDetailsArray,
        crypto_wallets: cryptoWalletsArray,
      });
    } finally {
      setSavingPayments(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    setPasswordError("");
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    
    setSavingPassword(true);
    try {
      const response = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          currentPassword, 
          newPassword 
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to change password");
      }
      
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Password changed successfully!");
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  // Save notifications
  const handleSaveNotifications = async () => {
    setSavingNotifications(true);
    try {
      await updateSettings({ 
        notifications: {
          invoice_paid: notifications.invoicePaid,
          payment_received: notifications.paymentReceived,
          invoice_overdue: notifications.invoiceOverdue,
          reminders_sent: notifications.remindersSent,
          new_customer: notifications.newCustomer,
          weekly_report: notifications.weeklyReport,
          monthly_report: notifications.monthlyReport,
        }
      });
    } finally {
      setSavingNotifications(false);
    }
  };

  // Save invoice defaults
  const handleSaveInvoiceDefaults = async () => {
    setSavingInvoice(true);
    try {
      await updateSettings({ 
        invoice_settings: {
          on_time_threshold_days: invoiceDefaults.onTimeThreshold,
          auto_reminders: invoiceDefaults.autoReminders,
          default_tax_rate: invoiceDefaults.taxRate,
          late_fee_enabled: invoiceDefaults.lateFeeEnabled,
          late_fee_percent: 0, // Default late fee percent
        },
        default_payment_terms: invoiceDefaults.dueDateDays,
      });
    } finally {
      setSavingInvoice(false);
    }
  };

  // Save branding
  const handleSaveBranding = async (footerText: string) => {
    setSavingBranding(true);
    try {
      await updateSettings({
        branding: {
          accent_color: apiSettings?.branding?.accent_color || "#14462a",
          theme: apiSettings?.branding?.theme || "light",
          email_signature: footerText,
        },
      });
    } finally {
      setSavingBranding(false);
    }
  };

  // Handle notification toggle
  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: checked }));
  };

  // Handle invoice default change
  const handleInvoiceDefaultChange = (key: string, value: number | boolean | string) => {
    setInvoiceDefaults(prev => ({ ...prev, [key]: value }));
  };

  // Delete account
  const handleDeleteAccount = async () => {
    setDeleteError("");
    setIsDeleting(true);
    
    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete account");
      }
      
      // Redirect to homepage after deletion
      window.location.href = "/";
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#14462a]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="bg-gray-100 rounded-xl p-1 flex-wrap h-auto gap-1">
          <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2">
            <User size={16} className="mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="business" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2">
            <Building size={16} className="mr-2" />
            Business
          </TabsTrigger>
          <TabsTrigger value="payments" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2">
            <Bank size={16} className="mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="invoices" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2">
            <DocumentDownload size={16} className="mr-2" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="branding" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2">
            <Brush2 size={16} className="mr-2" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2">
            <Notification size={16} className="mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2">
            <ShieldTick size={16} className="mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2">
            <Wallet size={16} className="mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="data" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2">
            <Data size={16} className="mr-2" />
            Data
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Personal Information</h2>
            <p className="text-sm text-gray-500 mb-6">Your personal details</p>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center gap-3 h-10 px-3 rounded-lg border border-gray-200 bg-gray-50">
                  <span className="text-gray-700">{apiSettings?.email || "Not set"}</span>
                  <Badge variant="paid" className="ml-auto">
                    <TickCircle size={12} color="#14462a" />
                    Verified
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">Contact support to change your email</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Call size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input 
                    id="phone" 
                    type="tel" 
                    className="pl-10" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+233 24 123 4567" 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-8">
              <Button 
                variant="outline" 
                className="rounded-xl"
                onClick={() => {
                  const nameParts = (apiSettings?.full_name || "").split(" ");
                  setFirstName(nameParts[0] || "");
                  setLastName(nameParts.slice(1).join(" ") || "");
                  setPhone(apiSettings?.phone || "");
                }}
              >
                Cancel
              </Button>
              <Button 
                className="rounded-xl bg-[#14462a] hover:bg-[#14462a]/90"
                onClick={handleSaveProfile}
                disabled={savingProfile}
              >
                {savingProfile ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business" className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Business Details</h2>
            <p className="text-sm text-gray-500 mb-6">Information shown on your invoices</p>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input 
                  id="businessName" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your company name" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select value={businessType} onValueChange={setBusinessType}>
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
              <div className="col-span-2 space-y-2">
                <Label htmlFor="taxId">Tax ID / VAT Number (Optional)</Label>
                <Input 
                  id="taxId" 
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="Tax identification number" 
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Business Address</h2>
            <p className="text-sm text-gray-500 mb-6">Your business location</p>

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input 
                  id="street" 
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="123 Main Street" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Accra" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">State/Region</Label>
                <Input 
                  id="region" 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="Greater Accra" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal">Postal Code</Label>
                <Input 
                  id="postal" 
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="00233" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={country} onValueChange={setCountry}>
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
              <Button 
                variant="outline" 
                className="rounded-xl"
                onClick={() => {
                  setBusinessName(apiSettings?.business_name || "");
                  setBusinessType(apiSettings?.business_type || "llc");
                  setTaxId(apiSettings?.tax_id || "");
                  setStreetAddress(apiSettings?.address?.line1 || "");
                  setCity(apiSettings?.address?.city || "");
                  setRegion(apiSettings?.address?.state || "");
                  setPostalCode(apiSettings?.address?.postal_code || "");
                  setCountry(apiSettings?.address?.country || "gh");
                }}
              >
                Cancel
              </Button>
              <Button 
                className="rounded-xl bg-[#14462a] hover:bg-[#14462a]/90"
                onClick={handleSaveBusiness}
                disabled={savingBusiness}
              >
                {savingBusiness ? "Saving..." : "Save Business Info"}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-8">
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 flex items-start gap-3">
            <Bank size={20} color="#2563EB" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Payment Details</p>
              <p className="text-xs text-blue-700 mt-1">
                These details will be shown on your invoices so clients know where to send payment. Online payments are processed through Flutterwave.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Payment Methods</h2>
            <p className="text-sm text-gray-500 mb-6">Choose which payment options to show on your invoices</p>

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
                      <p className="text-xs text-gray-500">Show bank account details on invoices</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentMethods.bankTransferEnabled}
                    onCheckedChange={(checked) => setPaymentMethods(prev => ({ ...prev, bankTransferEnabled: checked }))}
                  />
                </div>
                {paymentMethods.bankTransferEnabled && (
                  <div className="space-y-4 mt-4 pl-13">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Bank Name</Label>
                        <Input 
                          placeholder="e.g., Ghana Commercial Bank" 
                          className="h-10"
                          value={bankDetails.bankName}
                          onChange={(e) => setBankDetails(prev => ({ ...prev, bankName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Account Number</Label>
                        <Input 
                          placeholder="0123456789" 
                          className="h-10"
                          value={bankDetails.accountNumber}
                          onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Account Name</Label>
                      <Input 
                        placeholder="Name on bank account" 
                        className="h-10"
                        value={bankDetails.accountName}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, accountName: e.target.value }))}
                      />
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
                      <p className="text-xs text-gray-500">Show MoMo number on invoices</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentMethods.momoEnabled}
                    onCheckedChange={(checked) => setPaymentMethods(prev => ({ ...prev, momoEnabled: checked }))}
                  />
                </div>
                {paymentMethods.momoEnabled && (
                  <div className="space-y-4 mt-4 pl-13">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Provider</Label>
                        <Select 
                          value={momoDetails.provider} 
                          onValueChange={(value) => setMomoDetails(prev => ({ ...prev, provider: value }))}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                            <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                            <SelectItem value="airtel">AirtelTigo Money</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Phone Number</Label>
                        <Input 
                          type="tel" 
                          placeholder="+233 24 123 4567" 
                          className="h-10"
                          value={momoDetails.phoneNumber}
                          onChange={(e) => setMomoDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Registered Name</Label>
                      <Input 
                        placeholder="Name on mobile money account" 
                        className="h-10"
                        value={momoDetails.registeredName}
                        onChange={(e) => setMomoDetails(prev => ({ ...prev, registeredName: e.target.value }))}
                      />
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
                      <p className="text-xs text-gray-500">Accept USDT, Bitcoin payments</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentMethods.cryptoEnabled}
                    onCheckedChange={(checked) => setPaymentMethods(prev => ({ ...prev, cryptoEnabled: checked }))}
                  />
                </div>
                {paymentMethods.cryptoEnabled && (
                  <div className="space-y-4 mt-4 pl-13">
                    <div className="space-y-2">
                      <Label className="text-xs">USDT (TRC20) Address</Label>
                      <Input 
                        placeholder="TRC20 wallet address" 
                        className="h-10"
                        value={cryptoDetails.usdtAddress}
                        onChange={(e) => setCryptoDetails(prev => ({ ...prev, usdtAddress: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Bitcoin Address</Label>
                      <Input 
                        placeholder="BTC wallet address" 
                        className="h-10"
                        value={cryptoDetails.btcAddress}
                        onChange={(e) => setCryptoDetails(prev => ({ ...prev, btcAddress: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-8">
              <Button variant="outline" className="rounded-xl">Cancel</Button>
              <Button 
                className="rounded-xl bg-[#14462a] hover:bg-[#14462a]/90"
                onClick={handleSavePaymentMethods}
                disabled={savingPayments}
              >
                {savingPayments ? "Saving..." : "Save Payment Methods"}
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
                <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
                <Input 
                  id="invoicePrefix" 
                  value={apiSettings?.invoice_prefix || "INV"} 
                  readOnly 
                  className="bg-gray-50" 
                />
                <p className="text-xs text-gray-500">Format: {apiSettings?.invoice_prefix || "INV"}-0001</p>
              </div>
              <div className="space-y-2">
                <Label>Default Due Date</Label>
                <Select 
                  value={String(invoiceDefaults.dueDateDays)} 
                  onValueChange={(value) => handleInvoiceDefaultChange("dueDateDays", parseInt(value))}
                >
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
                  <Input 
                    id="taxRate" 
                    type="number" 
                    placeholder="0" 
                    value={invoiceDefaults.taxRate}
                    onChange={(e) => handleInvoiceDefaultChange("taxRate", parseFloat(e.target.value) || 0)}
                    className="flex-1" 
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>On-Time Threshold</Label>
                <Select 
                  value={String(invoiceDefaults.onTimeThreshold)} 
                  onValueChange={(value) => handleInvoiceDefaultChange("onTimeThreshold", parseInt(value))}
                >
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
              value={invoiceDefaults.footerText}
              onChange={(e) => handleInvoiceDefaultChange("footerText", e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" className="rounded-xl">Cancel</Button>
            <Button 
              className="rounded-xl bg-[#14462a] hover:bg-[#14462a]/90"
              onClick={handleSaveInvoiceDefaults}
              disabled={savingInvoice}
            >
              {savingInvoice ? "Saving..." : "Save Invoice Settings"}
            </Button>
          </div>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Business Logo</h2>
            <p className="text-sm text-gray-500 mb-6">Upload your company logo for invoices and emails</p>

            <LogoUpload
              currentUrl={apiSettings?.logo_url || null}
              businessName={apiSettings?.business_name}
              onUploadComplete={(url) => {
                updateSettings({ logo_url: url });
              }}
              onDeleteComplete={() => {
                updateSettings({ logo_url: "" });
              }}
            />
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
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Email Signature</h2>
            <p className="text-sm text-gray-500 mb-4">Appears in all outgoing invoice emails</p>
            <Textarea
              id="emailSignature"
              placeholder="Best regards,&#10;Your Name&#10;Your Company"
              defaultValue={`Best regards,\n${apiSettings?.full_name || "Your Name"}\n${apiSettings?.business_name || "Your Business"}`}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" className="rounded-xl">Cancel</Button>
            <Button 
              className="rounded-xl bg-[#14462a] hover:bg-[#14462a]/90"
              onClick={() => {
                const textarea = document.getElementById("emailSignature") as HTMLTextAreaElement;
                handleSaveBranding(textarea?.value || "");
              }}
              disabled={savingBranding}
            >
              {savingBranding ? "Saving..." : "Save Branding"}
            </Button>
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
                    onCheckedChange={(checked) => handleNotificationChange(item.key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" className="rounded-xl">Cancel</Button>
            <Button 
              className="rounded-xl bg-[#14462a] hover:bg-[#14462a]/90"
              onClick={handleSaveNotifications}
              disabled={savingNotifications}
            >
              {savingNotifications ? "Saving..." : "Save Notifications"}
            </Button>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-8">
          <div className="rounded-xl border border-[#14462a]/20 bg-[#14462a]/5 p-4 flex items-start gap-3">
            <ShieldTick size={20} color="#14462a" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#14462a]">Account Security</p>
              <p className="text-xs text-[#14462a]/70 mt-1">
                Keep your account secure with a strong password and two-factor authentication.
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
                    type={showPasswords.current ? "text" : "password"}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Min 8 characters</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {passwordError && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <Warning2 size={12} color="#DC2626" />
                  {passwordError}
                </p>
              )}
              <Button 
                className="rounded-xl bg-[#14462a] hover:bg-[#14462a]/90"
                onClick={handleChangePassword}
                disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
              >
                {savingPassword ? "Updating..." : "Update Password"}
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
              <Button 
                className="rounded-xl bg-[#14462a] hover:bg-[#14462a]/90"
                onClick={() => setShow2FAModal(true)}
              >
                Enable 2FA
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Active Sessions</h2>
            <p className="text-sm text-gray-500 mb-6">Devices where you&apos;re logged in</p>

            <div className="rounded-2xl border border-gray-200 divide-y divide-gray-100">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Setting2 size={18} color="#2D2D2D" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Current Device</p>
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <Location size={12} color="#9CA3AF" /> Current session
                      <Clock size={12} color="#9CA3AF" /> Now
                    </p>
                  </div>
                </div>
                <Badge variant="paid">
                  <TickCircle size={14} color="#14462a" variant="Bold" />
                  Current
                </Badge>
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
                  <Wallet size={24} color="#14462a" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-gray-900">
                      {currentPlan === "free" ? "Free Plan" : currentPlan === "pro" ? "Plaen Pro" : "Enterprise"}
                    </p>
                    <Badge variant="paid">
                      <TickCircle size={14} color="#14462a" variant="Bold" />
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {currentPlan === "free" ? "Basic features included" : "Full access to all features"}
                  </p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {currentPlan === "free" ? "Free" : currentPlan === "pro" ? "₵99" : "Custom"}
                {currentPlan !== "free" && currentPlan !== "enterprise" && (
                  <span className="text-sm font-normal text-gray-500">/mo</span>
                )}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Payment Method</h2>
                <p className="text-sm text-gray-500">Manage your payment method</p>
              </div>
              <Button variant="outline" className="rounded-xl" onClick={() => setShowPaymentMethodModal(true)}>
                Update
              </Button>
            </div>

            <div className="rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Card size={18} color="#2D2D2D" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">No payment method added</p>
                <p className="text-xs text-gray-500">Add a card or mobile money for Pro plan</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Billing History</h2>
                <p className="text-sm text-gray-500">View past invoices</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-8 text-center">
              <Calendar size={32} color="#9CA3AF" className="mx-auto mb-3" />
              <p className="text-sm text-gray-500">No billing history yet</p>
              <p className="text-xs text-gray-400 mt-1">Upgrade to Pro to see your invoices here</p>
            </div>
          </div>
        </TabsContent>

        {/* Data Tab */}
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Delete Account</p>
                  <p className="text-xs text-gray-500">Permanently delete your account and all data</p>
                </div>
                <Button 
                  variant="outline" 
                  className="rounded-xl border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash size={14} color="#DC2626" className="mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Warning2 size={32} color="#DC2626" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Delete Your Account?</h2>
              <p className="text-sm text-gray-500 mt-2">
                This action is permanent and cannot be undone. All your data will be deleted.
              </p>
            </div>

            <div className="bg-red-50 rounded-xl p-4 mb-6">
              <p className="text-xs font-medium text-red-800 mb-2">This will delete:</p>
              <ul className="space-y-1">
                {["All invoices and payment records", "All contacts", "Your business profile", "All settings and preferences"].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-red-700">
                    <CloseCircle size={12} color="#DC2626" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 mb-6">
              <Label htmlFor="deletePassword">Enter your password to confirm</Label>
              <div className="relative">
                <Input
                  id="deletePassword"
                  type="password"
                  placeholder="Your password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
              </div>
              {deleteError && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <Warning2 size={12} color="#DC2626" />
                  {deleteError}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl" 
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                  setDeleteError("");
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700"
                onClick={handleDeleteAccount}
                disabled={isDeleting || !deletePassword}
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Setup Modal */}
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
              <p className="text-xs text-gray-500 mt-3">Use Google Authenticator, Authy, or similar app</p>
            </div>

            <div className="space-y-2 mb-6">
              <Label htmlFor="twoFactorCode">Enter 6-digit code</Label>
              <Input 
                id="twoFactorCode" 
                placeholder="000000" 
                className="text-center tracking-widest text-lg"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => {
                setShow2FAModal(false);
                setTwoFactorCode("");
              }}>
                Cancel
              </Button>
              <Button 
                className="flex-1 rounded-xl bg-[#14462a] hover:bg-[#14462a]/90"
                disabled={twoFactorCode.length !== 6}
              >
                Verify & Enable
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Change Plan Modal */}
      {showChangePlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowChangePlanModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Choose Your Plan</h2>
            <p className="text-sm text-gray-500 mb-6">Select the plan that works best for your business</p>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {[
                { id: "free", name: "Free", price: "₵0", features: ["Unlimited invoices", "Basic analytics", "Email support"] },
                { id: "pro", name: "Pro", price: "₵99", features: ["Everything in Free", "Advanced analytics", "Priority support", "Custom branding", "WhatsApp reminders"] },
                { id: "enterprise", name: "Enterprise", price: "Custom", features: ["Everything in Pro", "Custom integration", "Dedicated support", "SLA guarantee", "White-label option"] },
              ].map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-xl p-6 cursor-pointer transition-all ${
                    currentPlan === plan.id 
                      ? "border-2 border-[#14462a] bg-[#14462a]/5" 
                      : "border border-gray-200 hover:border-[#14462a]/50"
                  }`}
                  onClick={() => setCurrentPlan(plan.id)}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-3xl font-bold text-gray-900 mb-4">
                    {plan.price}
                    {plan.price !== "Custom" && plan.price !== "₵0" && (
                      <span className="text-sm font-normal text-gray-500">/mo</span>
                    )}
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
                      currentPlan === plan.id ? "bg-[#14462a] hover:bg-[#14462a]/90" : ""
                    }`}
                    variant={currentPlan === plan.id ? "default" : "outline"}
                  >
                    {currentPlan === plan.id ? "Current Plan" : "Select Plan"}
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

      {/* Payment Method Modal */}
      {showPaymentMethodModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPaymentMethodModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Update Payment Method</h2>
            <p className="text-sm text-gray-500 mb-6">Add or update your payment method for subscriptions</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="rounded-xl" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" className="rounded-xl" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input id="cardName" placeholder="John Doe" className="rounded-xl" />
              </div>
            </div>

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
              <Button className="rounded-xl bg-[#14462a] hover:bg-[#14462a]/90">
                Save Payment Method
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
