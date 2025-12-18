"use client";

import { useState } from "react";
import {
  User,
  Notification,
  Card,
  ShieldTick,
  Building,
  DollarSquare,
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
  RefreshCircle,
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
} from "iconsax-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "@/components/ui/color-picker";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [showBillingHistoryModal, setShowBillingHistoryModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPasswordVisibility, setShowPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
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

  const handleSwitchChange = (key: string, value: boolean) => {
    setNotifications({ ...notifications, [key]: value });
  };

  const handlePaymentMethodChange = (key: string, value: boolean) => {
    setPaymentMethods({ ...paymentMethods, [key]: value });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleInvoiceDefaultChange = (key: string, value: boolean) => {
    setInvoiceDefaults({ ...invoiceDefaults, [key]: value });
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2" style={{ color: "#2D2D2D" }}>
          Settings
        </h1>
        <p className="text-base" style={{ color: "#B0B3B8" }}>
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">
            <User size={16} color="#2D2D2D" variant="Linear" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="business">
            <Building size={16} color="#2D2D2D" variant="Linear" />
            Business
          </TabsTrigger>
          <TabsTrigger value="payments">
            <Wallet size={16} color="#2D2D2D" variant="Linear" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="invoices">
            <Setting2 size={16} color="#2D2D2D" variant="Linear" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="branding">
            <Brush2 size={16} color="#2D2D2D" variant="Linear" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Notification size={16} color="#2D2D2D" variant="Linear" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Flash size={16} color="#2D2D2D" variant="Linear" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="data">
            <Data size={16} color="#2D2D2D" variant="Linear" />
            Data & Privacy
          </TabsTrigger>
          <TabsTrigger value="billing">
            <Card size={16} color="#2D2D2D" variant="Linear" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldTick size={16} color="#2D2D2D" variant="Linear" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Section */}
        <TabsContent value="profile" className="space-y-10">
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  First Name
                </Label>
                <Input
                  type="text"
                  defaultValue="John"
                  className="h-11 rounded-full border-0"
                  style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                />
              </div>
              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Last Name
                </Label>
                <Input
                  type="text"
                  defaultValue="Doe"
                  className="h-11 rounded-full border-0"
                  style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                />
              </div>
              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Email Address
                </Label>
                <Input
                  type="email"
                  defaultValue="john@plaen.tech"
                  className="h-11 rounded-full border-0"
                  style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                />
              </div>
              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  defaultValue="+233 24 123 4567"
                  className="h-11 rounded-full border-0"
                  style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                />
              </div>
              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Country
                </Label>
                <Select defaultValue="ghana">
                  <SelectTrigger className="h-11 rounded-full border-0" style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="ghana">Ghana</SelectItem>
                    <SelectItem value="nigeria">Nigeria</SelectItem>
                    <SelectItem value="kenya">Kenya</SelectItem>
                    <SelectItem value="south-africa">South Africa</SelectItem>
                    <SelectItem value="uganda">Uganda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Timezone
                </Label>
                <Select defaultValue="africa-accra">
                  <SelectTrigger className="h-11 rounded-full border-0" style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="africa-accra">Africa/Accra (GMT)</SelectItem>
                    <SelectItem value="africa-lagos">Africa/Lagos (WAT)</SelectItem>
                    <SelectItem value="africa-nairobi">Africa/Nairobi (EAT)</SelectItem>
                    <SelectItem value="africa-johannesburg">Africa/Johannesburg (SAST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                className="rounded-full h-11 px-6 border-0 font-normal"
                style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
              >
                Cancel
              </Button>
              <Button
                className="rounded-full h-11 px-6 font-normal"
                style={{ backgroundColor: "#14462a", color: "white" }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Payment Methods Section */}
        <TabsContent value="payments" className="space-y-12">
          {/* PSP Section */}
          <div className="space-y-6">
            <div className="mb-8">
              <h3 className="text-base font-normal mb-1" style={{ color: "#949494" }}>
                Payment Service Providers
              </h3>
              <p className="text-base" style={{ color: "#B0B3B8" }}>
                Configure payment processors for paylinks
              </p>
            </div>

            {/* Flutterwave */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F9F9F9" }}>
                    <Card size={16} color="#FF6B00" variant="Linear" />
                  </div>
                  <div>
                    <div className="text-base font-normal" style={{ color: "#2D2D2D" }}>
                      Flutterwave
                    </div>
                    <div className="text-sm" style={{ color: "#949494" }}>
                      Cards · Bank · Mobile Money
                    </div>
                  </div>
                </div>
                <Switch
                  checked={paymentMethods.flutterwaveEnabled}
                  onCheckedChange={(checked: boolean) =>
                    setPaymentMethods({ ...paymentMethods, flutterwaveEnabled: checked })
                  }
                />
              </div>
              {paymentMethods.flutterwaveEnabled && (
                <div className="grid grid-cols-2 gap-4 pl-12">
                  <div>
                    <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                      Public Key
                    </Label>
                    <Input
                      type="text"
                      placeholder="FLWPUBK-xxxxxxxxxxxxx"
                      className="h-11 rounded-full text-base border-0"
                      style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                      Secret Key
                    </Label>
                    <Input
                      type="password"
                      placeholder="FLWSECK-xxxxxxxxxxxxx"
                      className="h-11 rounded-full text-base border-0"
                      style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Paystack */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F9F9F9" }}>
                    <Card size={16} color="#00C3F7" variant="Linear" />
                  </div>
                  <div>
                    <div className="text-base font-normal" style={{ color: "#2D2D2D" }}>
                      Paystack
                    </div>
                    <div className="text-sm" style={{ color: "#949494" }}>
                      Cards · Bank · Mobile Money
                    </div>
                  </div>
                </div>
                <Switch
                  checked={paymentMethods.paystackEnabled}
                  onCheckedChange={(checked: boolean) =>
                    setPaymentMethods({ ...paymentMethods, paystackEnabled: checked })
                  }
                />
              </div>
              {paymentMethods.paystackEnabled && (
                <div className="grid grid-cols-2 gap-4 pl-12">
                  <div>
                    <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                      Public Key
                    </Label>
                    <Input
                      type="text"
                      placeholder="pk_test_xxxxxxxxxxxxx"
                      className="h-11 rounded-full text-base border-0"
                      style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                      Secret Key
                    </Label>
                    <Input
                      type="password"
                      placeholder="sk_test_xxxxxxxxxxxxx"
                      className="h-11 rounded-full text-base border-0"
                      style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Manual Payment Methods */}
          <div className="space-y-6">
            <div className="mb-8">
              <h3 className="text-base font-normal mb-1" style={{ color: "#949494" }}>
                Manual Payment Methods
              </h3>
              <p className="text-base" style={{ color: "#B0B3B8" }}>
                Bank accounts and mobile money for "Record Payment"
              </p>
            </div>

            {/* Bank Transfer */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F9F9F9" }}>
                    <Bank size={16} color="#14462a" variant="Linear" />
                  </div>
                  <div>
                    <div className="text-base font-normal" style={{ color: "#2D2D2D" }}>
                      Bank Transfer
                    </div>
                    <div className="text-sm" style={{ color: "#949494" }}>
                      Bank account details
                    </div>
                  </div>
                </div>
                <Switch
                  checked={paymentMethods.bankTransferEnabled}
                  onCheckedChange={(checked: boolean) =>
                    setPaymentMethods({ ...paymentMethods, bankTransferEnabled: checked })
                  }
                />
              </div>
              {paymentMethods.bankTransferEnabled && (
                <div className="space-y-4 pl-12">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                        Bank Name
                      </Label>
                      <Input
                        type="text"
                        placeholder="e.g., Zenith Bank"
                        className="h-11 rounded-full text-base border-0"
                        style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                        Account Number
                      </Label>
                      <Input
                        type="text"
                        placeholder="0123456789"
                        className="h-11 rounded-full text-base border-0"
                        style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                      Account Name
                    </Label>
                    <Input
                      type="text"
                      placeholder="Plaen Technologies Ltd"
                      className="h-11 rounded-full text-base border-0"
                      style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                        SWIFT / Sort Code
                      </Label>
                      <Input
                        type="text"
                        placeholder="Optional"
                        className="h-11 rounded-full text-base border-0"
                        style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                        Branch
                      </Label>
                      <Input
                        type="text"
                        placeholder="Optional"
                        className="h-11 rounded-full text-base border-0"
                        style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Money */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F9F9F9" }}>
                    <Mobile size={16} color="#14462a" variant="Linear" />
                  </div>
                  <div>
                    <div className="text-base font-normal" style={{ color: "#2D2D2D" }}>
                      Mobile Money
                    </div>
                    <div className="text-sm" style={{ color: "#949494" }}>
                      MTN, Vodafone, Airtel, M-Pesa
                    </div>
                  </div>
                </div>
                <Switch
                  checked={paymentMethods.momoEnabled}
                  onCheckedChange={(checked: boolean) =>
                    setPaymentMethods({ ...paymentMethods, momoEnabled: checked })
                  }
                />
              </div>
              {paymentMethods.momoEnabled && (
                <div className="space-y-4 pl-12">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                        Provider
                      </Label>
                      <Select defaultValue="mtn">
                        <SelectTrigger className="h-11 rounded-full text-base border-0" style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                          <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                          <SelectItem value="airtel">AirtelTigo Money</SelectItem>
                          <SelectItem value="mpesa">M-Pesa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                        Phone Number
                      </Label>
                      <Input
                        type="tel"
                        placeholder="+233 24 123 4567"
                        className="h-11 rounded-full text-base border-0"
                        style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                      Registered Name
                    </Label>
                    <Input
                      type="text"
                      placeholder="Name on mobile money account"
                      className="h-11 rounded-full text-base border-0"
                      style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Crypto */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F9F9F9" }}>
                    <Bitcoin size={16} color="#14462a" variant="Linear" />
                  </div>
                  <div>
                    <div className="text-base font-normal" style={{ color: "#2D2D2D" }}>
                      Cryptocurrency
                    </div>
                    <div className="text-sm" style={{ color: "#949494" }}>
                      USDT, Bitcoin, Ethereum
                    </div>
                  </div>
                </div>
                <Switch
                  checked={paymentMethods.cryptoEnabled}
                  onCheckedChange={(checked: boolean) =>
                    setPaymentMethods({ ...paymentMethods, cryptoEnabled: checked })
                  }
                />
              </div>
              {paymentMethods.cryptoEnabled && (
                <div className="space-y-4 pl-12">
                  <div>
                    <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                      USDT (TRC20) Address
                    </Label>
                    <Input
                      type="text"
                      placeholder="TRC20 wallet address"
                      className="h-11 rounded-full text-base border-0"
                      style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                      Bitcoin Address
                    </Label>
                    <Input
                      type="text"
                      placeholder="BTC wallet address"
                      className="h-11 rounded-full text-base border-0"
                      style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                      Ethereum Address
                    </Label>
                    <Input
                      type="text"
                      placeholder="ETH wallet address"
                      className="h-11 rounded-full text-base border-0"
                      style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              className="rounded-full h-11 px-6 border-0 font-normal"
              style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
            >
              Cancel
            </Button>
            <Button
              className="rounded-full h-11 px-6 font-normal"
              style={{ backgroundColor: "#14462a", color: "white" }}
            >
              Save Payment Methods
            </Button>
          </div>
        </TabsContent>

        {/* Invoice Settings Section */}
        <TabsContent value="invoices" className="space-y-10">
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Invoice Number Prefix
                </Label>
                <Input
                  type="text"
                  defaultValue="INV-"
                  placeholder="e.g., INV-"
                  className="h-11 rounded-full border-0"
                  style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                />
                <p className="text-sm mt-1.5" style={{ color: "#B0B3B8" }}>
                  Next invoice: INV-0248
                </p>
              </div>
              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Default Due Date
                </Label>
                <Select 
                  defaultValue="30"
                  onValueChange={(value) => setInvoiceDefaults({ ...invoiceDefaults, dueDateDays: parseInt(value) })}
                >
                  <SelectTrigger className="h-11 rounded-full border-0" style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="0">Due on receipt</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days (Net 30)</SelectItem>
                    <SelectItem value="60">60 days (Net 60)</SelectItem>
                    <SelectItem value="90">90 days (Net 90)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Default Tax Rate
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    defaultValue="0"
                    min="0"
                    max="100"
                    step="0.1"
                    className="h-11 rounded-full border-0"
                    style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                    onChange={(e) => setInvoiceDefaults({ ...invoiceDefaults, defaultTaxRate: parseFloat(e.target.value) })}
                  />
                  <span className="text-sm font-normal" style={{ color: "#2D2D2D" }}>%</span>
                </div>
                <p className="text-sm mt-1.5" style={{ color: "#B0B3B8" }}>
                  Applied to all line items by default
                </p>
              </div>
              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  On-Time Threshold
                </Label>
                <Select 
                  defaultValue="3"
                  onValueChange={(value) => setInvoiceDefaults({ ...invoiceDefaults, onTimeThreshold: parseInt(value) })}
                >
                  <SelectTrigger className="h-11 rounded-full border-0" style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="0">Same day as invoice date</SelectItem>
                    <SelectItem value="1">≤1 day</SelectItem>
                    <SelectItem value="3">≤3 days (recommended)</SelectItem>
                    <SelectItem value="7">≤7 days</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm mt-1.5" style={{ color: "#B0B3B8" }}>
                  For on-time rate calculation
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Late Fees */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-normal" style={{ color: "#2D2D2D" }}>
                      Late Fees
                    </div>
                    <div className="text-sm" style={{ color: "#949494" }}>
                      Automatically add late fees to overdue invoices
                    </div>
                  </div>
                  <Switch
                    checked={invoiceDefaults.lateFeeEnabled}
                    onCheckedChange={(checked: boolean) => handleInvoiceDefaultChange('lateFeeEnabled', checked)}
                  />
                </div>
                {invoiceDefaults.lateFeeEnabled && (
                  <div className="grid grid-cols-2 gap-4 pl-0">
                    <div>
                      <Label className="text-sm font-normal mb-2 block" style={{ color: "#949494" }}>
                        Late Fee Percentage
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          defaultValue="5"
                          min="0"
                          max="50"
                          step="0.5"
                          className="h-10 rounded-full text-sm border-0"
                          style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                          onChange={(e) => setInvoiceDefaults({ ...invoiceDefaults, lateFeePercent: parseFloat(e.target.value) })}
                        />
                        <span className="text-sm font-normal" style={{ color: "#2D2D2D" }}>%</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-normal mb-2 block" style={{ color: "#949494" }}>
                        Grace Period
                      </Label>
                      <Select defaultValue="7">
                        <SelectTrigger className="h-10 rounded-full text-sm border-0" style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="0">No grace period</SelectItem>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              {/* Auto Reminders */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-normal" style={{ color: "#2D2D2D" }}>
                    Automatic Reminders
                  </div>
                  <div className="text-sm" style={{ color: "#949494" }}>
                    Send payment reminders for overdue invoices
                  </div>
                </div>
                <Switch
                  checked={invoiceDefaults.autoReminders}
                  onCheckedChange={(checked: boolean) => handleInvoiceDefaultChange('autoReminders', checked)}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                Default Invoice Footer
              </Label>
              <Textarea
                placeholder="Thank you for your business. Payment is due within 30 days."
                defaultValue="Thank you for your business. Payment is due within 30 days."
                className="rounded-3xl min-h-[90px] border-0 resize-none"
                style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
              />
              <p className="text-sm mt-1.5" style={{ color: "#B0B3B8" }}>
                This text appears at the bottom of all invoices
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                className="rounded-full h-11 px-6 border-0 font-normal"
                style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
              >
                Cancel
              </Button>
              <Button
                className="rounded-full h-11 px-6 font-normal"
                style={{ backgroundColor: "#14462a", color: "white" }}
              >
                Save Invoice Settings
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Branding Section */}
        <TabsContent value="branding" className="space-y-10">
          <div className="space-y-8">
            <div>
              <Label className="text-sm font-normal mb-3 block" style={{ color: "#949494" }}>
                Business Logo
              </Label>
              <div className="flex items-start gap-4">
                <div
                  className="h-20 w-20 rounded-3xl flex items-center justify-center"
                  style={{ backgroundColor: "#F9F9F9" }}
                >
                  <DocumentUpload size={20} color="#B0B3B8" variant="Linear" />
                </div>
                <div className="flex-1">
                  <Button
                    variant="outline"
                    className="rounded-full h-11 px-5 mb-2 border-0 font-normal"
                    style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                  >
                    <DocumentUpload size={16} color="#2D2D2D" variant="Linear" className="mr-2" />
                    Upload Logo
                  </Button>
                  <p className="text-sm" style={{ color: "#B0B3B8" }}>
                    Square image, PNG or SVG, min 200×200px
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <ColorPicker
                value="#14462a"
                label="Primary Brand Color"
                description="Used for buttons and highlights"
              />
              
              <ColorPicker
                value="#2D2D2D"
                label="Accent Color"
                description="Used for headings and text"
              />

              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Invoice Template
                </Label>
                <Select defaultValue="modern">
                  <SelectTrigger className="h-11 rounded-full border-0" style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="modern">Modern (Default)</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                Email Signature
              </Label>
              <Textarea
                placeholder="Best regards,&#10;Your Name&#10;Your Company"
                defaultValue="Best regards,&#10;John Doe&#10;Plaen Technologies"
                className="rounded-3xl min-h-[100px] border-0 resize-none"
                style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
              />
              <p className="text-sm mt-1.5" style={{ color: "#B0B3B8" }}>
                Appears in all outgoing invoice emails
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                className="rounded-full h-11 px-6 border-0 font-normal"
                style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
              >
                Cancel
              </Button>
              <Button
                className="rounded-full h-11 px-6 font-normal"
                style={{ backgroundColor: "#14462a", color: "white" }}
              >
                Save Branding
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Section */}
        <TabsContent value="notifications" className="space-y-12">
          <div className="space-y-4">
            {[
              { key: "invoicePaid", label: "Invoice Paid", description: "Notify when an invoice is marked as paid" },
              { key: "paymentReceived", label: "Payment Received", description: "Notify when a payment is received" },
              { key: "invoiceOverdue", label: "Invoice Overdue", description: "Notify when an invoice becomes overdue" },
              { key: "remindersSent", label: "Reminders Sent", description: "Notify when automatic reminders are sent to clients" },
              { key: "newCustomer", label: "New Customer", description: "Notify when a new customer is added" },
              { key: "weeklyReport", label: "Weekly Report", description: "Receive weekly AR summary reports" },
              { key: "monthlyReport", label: "Monthly Report", description: "Receive monthly financial reports" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <div className="text-sm font-normal mb-0.5" style={{ color: "#2D2D2D" }}>
                    {item.label}
                  </div>
                  <div className="text-sm" style={{ color: "#949494" }}>
                    {item.description}
                  </div>
                </div>
                <Switch
                  checked={notifications[item.key as keyof typeof notifications]}
                  onCheckedChange={(checked: boolean) => handleSwitchChange(item.key, checked)}
                />
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-sm font-normal mb-1" style={{ color: "#949494" }}>
                Reminder Preferences
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Preferred Channel for Reminders
                </Label>
                <Select defaultValue="email">
                  <SelectTrigger className="h-11 rounded-full border-0" style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="both">Email + WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Send Reminder Before Due Date
                </Label>
                <Select defaultValue="3">
                  <SelectTrigger className="h-11 rounded-full border-0" style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="0">No advance reminder</SelectItem>
                    <SelectItem value="1">1 day before</SelectItem>
                    <SelectItem value="3">3 days before</SelectItem>
                    <SelectItem value="7">7 days before</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Overdue Reminder Frequency
                </Label>
                <Select defaultValue="7">
                  <SelectTrigger className="h-11 rounded-full border-0" style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="0">No automatic reminders</SelectItem>
                    <SelectItem value="3">Every 3 days</SelectItem>
                    <SelectItem value="7">Every 7 days</SelectItem>
                    <SelectItem value="14">Every 14 days</SelectItem>
                    <SelectItem value="30">Every 30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Integrations Section */}
        <TabsContent value="integrations" className="space-y-12">
          <div className="space-y-8">
            <div className="space-y-2.5">
              <span className="text-sm font-normal" style={{ color: "#949494" }}>API Access</span>
              <div className="text-sm mb-3" style={{ color: "#B0B3B8" }}>
                Manage API keys for programmatic access to your Plaen account
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start justify-between p-3 rounded-2xl" style={{ backgroundColor: "#F9F9F9" }}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "white" }}>
                      <Key size={16} color="#14462a" variant="Linear" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-normal text-sm" style={{ color: "#2D2D2D" }}>
                          Live API Key
                        </span>
                        <Badge
                          variant="secondary"
                          className="rounded-full px-2 py-0.5 text-sm"
                          style={{ backgroundColor: "rgba(13, 148, 136, 0.08)", color: "#0D9488" }}
                        >
                          Active
                        </Badge>
                      </div>
                      <div className="text-sm font-mono mt-1" style={{ color: "#B0B3B8" }}>
                        pk_live_••••••••••••••••••••••••••••••
                      </div>
                      <div className="text-sm mt-1" style={{ color: "#B0B3B8" }}>
                        Created on Nov 18, 2024 • Last used 2 hours ago
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full h-9 px-4 text-sm border-0 font-normal"
                  style={{ backgroundColor: "white", color: "#2D2D2D" }}
                >
                  Revoke
                </Button>
              </div>

              <Button
                variant="outline"
                className="rounded-full h-10 px-4 border-0 font-normal"
                style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
              >
                <Key size={16} color="#2D2D2D" variant="Linear" className="mr-2" />
                Generate New API Key
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2.5">
              <span className="text-sm font-normal" style={{ color: "#949494" }}>Webhooks</span>
              <div className="text-sm mb-3" style={{ color: "#B0B3B8" }}>
                Configure webhook endpoints to receive real-time updates
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Webhook URL
                </Label>
                <Input
                  type="url"
                  placeholder="https://your-app.com/webhooks/plaen"
                  className="h-11 rounded-full border-0"
                  style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                />
              </div>

              <div>
                <Label className="text-sm font-normal mb-3 block" style={{ color: "#949494" }}>
                  Events to Subscribe
                </Label>
                <div className="space-y-2">
                  {[
                    "invoice.created",
                    "invoice.sent",
                    "invoice.paid",
                    "payment.received",
                    "invoice.overdue",
                  ].map((event) => (
                    <div key={event} className="flex items-center justify-between py-3">
                      <span className="text-sm font-mono font-normal" style={{ color: "#2D2D2D" }}>
                        {event}
                      </span>
                      <Switch />
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className="rounded-full h-11 px-6 font-normal"
                style={{ backgroundColor: "#14462a", color: "white" }}
              >
                <Code size={16} color="white" variant="Linear" className="mr-2" />
                Save Webhook Configuration
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2.5">
              <span className="text-sm font-normal" style={{ color: "#949494" }}>Accounting Software</span>
              <div className="text-sm mb-3" style={{ color: "#B0B3B8" }}>
                Connect your accounting software for automatic sync
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {[
                { name: "QuickBooks", connected: false },
                { name: "Xero", connected: false },
                { name: "Wave", connected: false },
                { name: "FreshBooks", connected: false },
              ].map((software) => (
                <div
                  key={software.name}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F9F9F9" }}>
                      <Building size={16} color="#14462a" variant="Linear" />
                    </div>
                    <span className="font-normal text-sm" style={{ color: "#2D2D2D" }}>
                      {software.name}
                    </span>
                  </div>
                  {software.connected ? (
                    <Badge
                      variant="secondary"
                      className="rounded-full px-2 py-0.5 text-sm"
                      style={{ backgroundColor: "rgba(13, 148, 136, 0.08)", color: "#0D9488" }}
                    >
                      Connected
                    </Badge>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full h-9 px-4 text-sm border-0 font-normal"
                      style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Data & Privacy Section */}
        <TabsContent value="data" className="space-y-12">
          <div className="space-y-8">
            <div className="space-y-2.5">
              <span className="text-sm font-normal" style={{ color: "#949494" }}>Data Export</span>
              <div className="text-sm mb-3" style={{ color: "#B0B3B8" }}>
                Download your data in various formats
              </div>
            </div>

            <div className="grid grid-cols-3 gap-x-6 gap-y-4">
              <Button
                variant="outline"
                className="rounded-full h-11 px-4 border-0 font-normal"
                style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
              >
                <DocumentDownload size={16} color="#14462a" variant="Linear" className="mr-2" />
                <span className="text-sm">Invoices (CSV)</span>
              </Button>
              <Button
                variant="outline"
                className="rounded-full h-11 px-4 border-0 font-normal"
                style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
              >
                <DocumentDownload size={16} color="#14462a" variant="Linear" className="mr-2" />
                <span className="text-sm">Payments (CSV)</span>
              </Button>
              <Button
                variant="outline"
                className="rounded-full h-11 px-4 border-0 font-normal"
                style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
              >
                <DocumentDownload size={16} color="#14462a" variant="Linear" className="mr-2" />
                <span className="text-sm">All Data (JSON)</span>
              </Button>
            </div>

            <div className="p-4 rounded-2xl" style={{ backgroundColor: "#F9F9F9" }}>
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "white" }}>
                  <Paperclip size={16} color="#14462a" variant="Linear" />
                </div>
                <div className="flex-1">
                  <div className="font-normal text-sm mb-1" style={{ color: "#2D2D2D" }}>
                    Evidence Pack
                  </div>
                  <div className="text-sm mb-3" style={{ color: "#B0B3B8" }}>
                    Generate a tamper-evident ZIP archive with invoice, receipts, and snapshots for legal verification
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full h-9 px-4 text-sm border-0 font-normal"
                    style={{ backgroundColor: "white", color: "#2D2D2D" }}
                  >
                    Generate Evidence Pack
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2.5">
              <span className="text-sm font-normal" style={{ color: "#949494" }}>Data Retention</span>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Keep Paid Invoices For
                </Label>
                <Select defaultValue="forever">
                  <SelectTrigger className="h-11 rounded-full border-0" style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="1year">1 year</SelectItem>
                    <SelectItem value="3years">3 years</SelectItem>
                    <SelectItem value="7years">7 years (recommended for tax)</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Delete Canceled/Voided Invoices
                </Label>
                <Select defaultValue="never">
                  <SelectTrigger className="h-11 rounded-full border-0" style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="30days">After 30 days</SelectItem>
                    <SelectItem value="90days">After 90 days</SelectItem>
                    <SelectItem value="1year">After 1 year</SelectItem>
                    <SelectItem value="never">Never (keep all records)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2.5">
              <span className="text-sm font-normal" style={{ color: "#D32F2F" }}>Danger Zone</span>
              <div className="text-sm" style={{ color: "#B0B3B8" }}>
                Irreversible actions that affect your account
              </div>
            </div>

            <div className="p-4 rounded-2xl" style={{ backgroundColor: "rgba(211, 47, 47, 0.04)" }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-normal text-sm mb-1" style={{ color: "#D32F2F" }}>
                    Delete Account
                  </div>
                  <div className="text-sm" style={{ color: "#B0B3B8" }}>
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full h-10 px-4 border-0"
                  style={{ backgroundColor: "rgba(211, 47, 47, 0.08)", color: "#D32F2F" }}
                >
                  <Trash size={16} color="#D32F2F" variant="Linear" className="mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Billing Section */}
        <TabsContent value="billing" className="space-y-12">
          <div className="space-y-8">
            <div className="flex items-start justify-between">
              <div className="space-y-2.5">
                <span className="text-sm font-normal" style={{ color: "#949494" }}>Current Plan</span>
                <div className="text-sm" style={{ color: "#B0B3B8" }}>
                  Manage your subscription and billing
                </div>
              </div>
              <Badge
                variant="secondary"
                className="rounded-full px-3 py-1"
                style={{ backgroundColor: "rgba(20, 70, 42, 0.08)", color: "#14462a" }}
              >
                Pro Plan
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-x-8 gap-y-6">
              {[
                { label: "Monthly Cost", value: "$29/mo", icon: DollarSquare, color: "#14462a" },
                { label: "Next Billing", value: "Dec 18, 2024", icon: Card, color: "#0D9488" },
                { label: "Invoices Sent", value: "247 / ∞", icon: Paperclip, color: "#F59E0B" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F9F9F9" }}>
                        <Icon size={16} color={stat.color} variant="Linear" />
                      </div>
                      <span className="text-sm font-normal" style={{ color: "#949494" }}>
                        {stat.label}
                      </span>
                    </div>
                    <div className="text-2xl font-normal" style={{ color: "#2D2D2D" }}>
                      {stat.value}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="rounded-full h-11 px-6 border-0 font-normal"
                style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                onClick={() => {
                  console.log('Change Plan clicked!');
                  setShowChangePlanModal(true);
                }}
              >
                Change Plan
              </Button>
              <Button
                variant="outline"
                className="rounded-full h-11 px-6 border-0 font-normal"
                style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                onClick={() => {
                  console.log('Billing History clicked!');
                  setShowBillingHistoryModal(true);
                }}
              >
                Billing History
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Business Info Section */}
        <TabsContent value="business" className="space-y-10">
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="col-span-2">
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Business Name
                </Label>
                <Input
                  type="text"
                  defaultValue="Plaen Technologies"
                  className="h-11 rounded-full border-0"
                  style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                />
              </div>
              <div className="col-span-2">
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Business Address
                </Label>
                <Textarea
                  defaultValue="123 Independence Avenue, Accra, Ghana"
                  className="rounded-3xl min-h-[90px] border-0 resize-none"
                  style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                />
              </div>
              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Tax ID / TIN
                </Label>
                <Input
                  type="text"
                  defaultValue="GH-123456789"
                  className="h-11 rounded-full border-0"
                  style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                />
              </div>
              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Registration Number
                </Label>
                <Input
                  type="text"
                  placeholder="Company registration number"
                  className="h-11 rounded-full border-0"
                  style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
                />
              </div>
              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Business Type
                </Label>
                <Select defaultValue="llc">
                  <SelectTrigger className="h-11 rounded-full border-0" style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="individual">Individual / Sole Proprietor</SelectItem>
                    <SelectItem value="llc">Limited Liability Company</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="ngo">Non-Profit / NGO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Default Currency
                </Label>
                <Select defaultValue="usd">
                  <SelectTrigger className="h-11 rounded-full border-0" style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="ghs">GHS (₵)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="ngn">NGN (₦)</SelectItem>
                    <SelectItem value="kes">KES (KSh)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                className="rounded-full h-11 px-6 border-0 font-normal"
                style={{ backgroundColor: "#F9F9F9", color: "#2D2D2D" }}
              >
                Cancel
              </Button>
              <Button
                className="rounded-full h-11 px-6 font-normal"
                style={{ backgroundColor: "#14462a", color: "white" }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Security Section */}
        <TabsContent value="security" className="space-y-12">
          {/* Password Change */}
          <div className="space-y-6">
            <div className="space-y-2.5">
              <span className="text-sm font-normal" style={{ color: "#949494" }}>Change Password</span>
              <div className="text-sm" style={{ color: "#B0B3B8" }}>
                Update your password regularly to keep your account secure
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPasswordVisibility.current ? "text" : "password"}
                    placeholder="Enter current password"
                    className="h-11 rounded-full border-0 pr-12"
                    style={{ backgroundColor: "#FAFBFC", color: "#2D2D2D" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordVisibility(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ color: '#B0B3B8' }}
                  >
                    {showPasswordVisibility.current ? <EyeSlash size={18} color="#B0B3B8" variant="Linear" /> : <Eye size={18} color="#B0B3B8" variant="Linear" />}
                  </button>
                </div>
              </div>
              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPasswordVisibility.new ? "text" : "password"}
                    placeholder="Enter new password"
                    className="h-11 rounded-full border-0 pr-12"
                    style={{ backgroundColor: "#FAFBFC", color: "#2D2D2D" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordVisibility(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ color: '#B0B3B8' }}
                  >
                    {showPasswordVisibility.new ? <EyeSlash size={18} color="#B0B3B8" variant="Linear" /> : <Eye size={18} color="#B0B3B8" variant="Linear" />}
                  </button>
                </div>
                <p className="text-xs mt-2" style={{ color: '#B0B3B8' }}>
                  Must be at least 8 characters with uppercase, lowercase, and numbers
                </p>
              </div>
              <div>
                <Label className="text-sm font-normal mb-2.5 block" style={{ color: "#949494" }}>
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPasswordVisibility.confirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="h-11 rounded-full border-0 pr-12"
                    style={{ backgroundColor: "#FAFBFC", color: "#2D2D2D" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordVisibility(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ color: '#B0B3B8' }}
                  >
                    {showPasswordVisibility.confirm ? <EyeSlash size={18} color="#B0B3B8" variant="Linear" /> : <Eye size={18} color="#B0B3B8" variant="Linear" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                className="rounded-full h-11 px-6 font-normal"
                style={{ backgroundColor: "#14462a", color: "white" }}
              >
                Update Password
              </Button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2.5">
                <span className="text-sm font-normal" style={{ color: "#949494" }}>Two-Factor Authentication</span>
                <div className="text-sm" style={{ color: "#B0B3B8" }}>
                  Add an extra layer of security to your account with 2FA
                </div>
              </div>
              <Badge 
                className="rounded-full px-3 py-1 text-xs"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', border: 'none' }}
              >
                Not Enabled
              </Badge>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#FAFBFC' }}>
                <FingerScan size={20} style={{ color: '#B0B3B8' }} />
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: '#2D2D2D' }}>Authenticator App</p>
                  <p className="text-xs" style={{ color: '#B0B3B8' }}>Use Google Authenticator or similar apps</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#FAFBFC' }}>
                <Mobile size={20} style={{ color: '#B0B3B8' }} />
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: '#2D2D2D' }}>SMS Verification</p>
                  <p className="text-xs" style={{ color: '#B0B3B8' }}>Receive codes via text message</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                className="rounded-full h-11 px-6 font-normal"
                style={{ backgroundColor: "#0D9488", color: "white" }}
                onClick={() => setShow2FAModal(true)}
              >
                Enable 2FA
              </Button>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="space-y-6">
            <div className="space-y-2.5">
              <span className="text-sm font-normal" style={{ color: "#949494" }}>Active Sessions</span>
              <div className="text-sm" style={{ color: "#B0B3B8" }}>
                Manage devices where you're currently logged in
              </div>
            </div>

            <div className="space-y-3">
              {[
                { device: "MacBook Pro 16", location: "Accra, Ghana", time: "Active now", current: true, icon: "💻" },
                { device: "iPhone 15 Pro", location: "Accra, Ghana", time: "2 hours ago", current: false, icon: "📱" },
                { device: "Chrome on Windows", location: "Lagos, Nigeria", time: "Yesterday", current: false, icon: "🖥️" },
              ].map((session, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ backgroundColor: '#FAFBFC' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{session.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium" style={{ color: '#2D2D2D' }}>{session.device}</p>
                        {session.current && (
                          <Badge 
                            className="rounded-full px-2 py-0.5 text-xs"
                            style={{ backgroundColor: 'rgba(13, 148, 136, 0.12)', color: '#0D9488', border: 'none' }}
                          >
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs" style={{ color: '#B0B3B8' }}>{session.location}</p>
                        <span className="text-xs" style={{ color: '#E4E6EB' }}>•</span>
                        <p className="text-xs" style={{ color: '#B0B3B8' }}>{session.time}</p>
                      </div>
                    </div>
                  </div>
                  {!session.current && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-xs h-8 px-3"
                      style={{ color: '#EF4444' }}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                className="rounded-full h-11 px-6 border-0 font-normal"
                style={{ backgroundColor: "#F9F9F9", color: "#EF4444" }}
              >
                Sign Out All Devices
              </Button>
            </div>
          </div>

          {/* Security Activity */}
          <div className="space-y-6">
            <div className="space-y-2.5">
              <span className="text-sm font-normal" style={{ color: "#949494" }}>Recent Security Activity</span>
              <div className="text-sm" style={{ color: "#B0B3B8" }}>
                Review recent security events on your account
              </div>
            </div>

            <div className="space-y-3">
              {[
                { action: "Password changed", time: "2 days ago", status: "success" },
                { action: "Login from new device", time: "3 days ago", status: "info" },
                { action: "API key generated", time: "1 week ago", status: "success" },
                { action: "Failed login attempt", time: "2 weeks ago", status: "warning" },
              ].map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ backgroundColor: '#FAFBFC' }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-2 w-2 rounded-full"
                      style={{ 
                        backgroundColor: activity.status === 'success' ? '#0D9488' : 
                                       activity.status === 'warning' ? '#F59E0B' : '#14462a' 
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#2D2D2D' }}>{activity.action}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#B0B3B8' }}>{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Change Plan Modal */}
      {showChangePlanModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowChangePlanModal(false)}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#2D2D2D' }}>Choose Your Plan</h2>
            <p className="text-sm mb-6" style={{ color: '#B0B3B8' }}>Select the plan that works best for your business</p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {[
                { name: "Free", price: "₵0", features: ["Unlimited invoices", "Basic features", "Email support"] },
                { name: "Pro", price: "₵99", features: ["Everything in Free", "Advanced analytics", "Priority support"] },
                { name: "Enterprise", price: "Custom", features: ["Everything in Pro", "Custom integration", "Dedicated support"] }
              ].map((plan) => (
                <div 
                  key={plan.name}
                  className="border rounded-xl p-6 cursor-pointer"
                  style={{ borderColor: '#E4E6EB' }}
                >
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#2D2D2D' }}>{plan.name}</h3>
                  <p className="text-3xl font-bold mb-4" style={{ color: '#2D2D2D' }}>
                    {plan.price}
                    {plan.price !== "Custom" && <span className="text-sm font-normal" style={{ color: '#B0B3B8' }}>/mo</span>}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm" style={{ color: '#65676B' }}>
                        <TickCircle size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#0D9488' }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full rounded-full h-10"
                    style={{ backgroundColor: plan.name === "Pro" ? '#14462a' : '#F9F9F9', color: plan.name === "Pro" ? 'white' : '#2D2D2D' }}
                  >
                    {plan.name === "Pro" ? "Current Plan" : plan.name === "Free" ? "Downgrade" : "Upgrade"}
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                className="rounded-full px-6 h-10 border-0"
                style={{ backgroundColor: '#F9F9F9', color: '#2D2D2D' }}
                onClick={() => setShowChangePlanModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Billing History Modal */}
      {showBillingHistoryModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowBillingHistoryModal(false)}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#2D2D2D' }}>Billing History</h2>
            <p className="text-sm mb-6" style={{ color: '#B0B3B8' }}>Download your past invoices and receipts</p>
            
            <div className="space-y-3">
              {[
                { id: "inv_2024_11", date: "Nov 1, 2024", description: "Plaen Pro - November 2024", amount: "₵99.00" },
                { id: "inv_2024_10", date: "Oct 1, 2024", description: "Plaen Pro - October 2024", amount: "₵99.00" },
                { id: "inv_2024_09", date: "Sep 1, 2024", description: "Plaen Pro - September 2024", amount: "₵99.00" },
                { id: "inv_2024_08", date: "Aug 1, 2024", description: "Plaen Pro - August 2024", amount: "₵99.00" },
                { id: "inv_2024_07", date: "Jul 1, 2024", description: "Plaen Pro - July 2024", amount: "₵99.00" },
              ].map((invoice) => (
                <div 
                  key={invoice.id}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ backgroundColor: '#FAFBFC' }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="h-10 w-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(20, 70, 42, 0.12)' }}
                    >
                      <Calendar size={18} style={{ color: '#14462a' }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#2D2D2D' }}>{invoice.description}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#B0B3B8' }}>{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold" style={{ color: '#2D2D2D' }}>{invoice.amount}</p>
                      <Badge 
                        className="rounded-full px-2 py-0.5 text-xs mt-1" 
                        style={{ backgroundColor: 'rgba(13, 148, 136, 0.12)', color: '#0D9488', border: 'none' }}
                      >
                        <TickCircle size={12} className="mr-1" />
                        Paid
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full h-9 w-9 p-0"
                      style={{ color: '#B0B3B8' }}
                      onClick={() => {
                        alert(`Download invoice: ${invoice.description}`);
                      }}
                    >
                      <DocumentDownload size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <Button
                variant="outline"
                className="rounded-full px-6 h-10 border-0"
                style={{ backgroundColor: '#F9F9F9', color: '#2D2D2D' }}
                onClick={() => setShowBillingHistoryModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
