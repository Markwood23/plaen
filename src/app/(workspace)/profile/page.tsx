"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CurrencyCode } from "@/types/database";
import { 
  Edit2, 
  Sms, 
  Call, 
  Building, 
  Location, 
  Wallet, 
  User as UserIcon, 
  Verify,
  CloseCircle,
  TickCircle,
  DocumentText1
} from "iconsax-react";
import { AvatarUpload } from "@/components/ui/avatar-upload";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  business_name: string | null;
  phone: string | null;
  address: Record<string, unknown> | null;
  default_currency: CurrencyCode | null;
  account_type: string | null;
  invoice_prefix: string | null;
  email_verified: boolean | null;
  setup_completed: boolean | null;
  tax_id: string | null;
  avatar_url: string | null;
  logo_url: string | null;
}

export default function WorkspaceProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    business_name: "",
    address: {} as { street?: string; city?: string; country?: string },
    default_currency: "GHS" as CurrencyCode,
    tax_id: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  async function fetchUserProfile() {
    try {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profileError) {
        // If missing, try to create a minimal profile row then retry
        if ((profileError as any)?.code === "PGRST116") {
          const { error: upsertError } = await supabase
            .from("users")
            .upsert(
              {
                id: authUser.id,
                email: authUser.email || "",
              },
              { onConflict: "id" }
            );

          if (!upsertError) {
            const { data: createdProfile } = await supabase
              .from("users")
              .select("*")
              .eq("id", authUser.id)
              .single();

            if (createdProfile) {
              setUser(createdProfile as UserProfile);
              setFormData({
                full_name: createdProfile.full_name || "",
                email: createdProfile.email || "",
                phone: createdProfile.phone || "",
                business_name: createdProfile.business_name || "",
                address:
                  (createdProfile.address as { street?: string; city?: string; country?: string }) || {},
                default_currency: (createdProfile.default_currency || "GHS") as CurrencyCode,
                tax_id: (createdProfile as any).tax_id || "",
              });
              setLoading(false);
              return;
            }
          }
        }

        console.error("Error fetching profile:", profileError);
        setError("Failed to load profile");
        setLoading(false);
        return;
      }

      setUser(profile as UserProfile);
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        business_name: profile.business_name || "",
        address: (profile.address as { street?: string; city?: string; country?: string }) || {},
        default_currency: (profile.default_currency || "GHS") as CurrencyCode,
        tax_id: (profile as any).tax_id || "",
      });
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred");
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!user) return;
    
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      
      const { error: updateError } = await supabase
        .from("users")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          business_name: formData.business_name,
          address: formData.address,
          default_currency: formData.default_currency,
          tax_id: formData.tax_id || null,
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        setError("Failed to save changes");
        setSaving(false);
        return;
      }

      // Refresh the profile
      await fetchUserProfile();
      setEditing(false);
      setSaving(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred");
      setSaving(false);
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#2D2D2D' }}>Profile</h1>
          <p className="text-sm" style={{ color: '#B0B3B8' }}>Manage your profile information and preferences.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-100 bg-gradient-to-r from-[#14462a]/5 to-transparent">
            <div className="flex items-center gap-5 animate-pulse">
              <div className="h-20 w-20 bg-gray-200 rounded-2xl" />
              <div className="space-y-2">
                <div className="h-5 w-40 bg-gray-200 rounded" />
                <div className="h-4 w-48 bg-gray-200 rounded" />
                <div className="h-6 w-32 bg-gray-200 rounded-lg" />
              </div>
            </div>
          </div>
          <div className="p-6 animate-pulse">
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="h-11 w-11 bg-gray-200 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                    <div className="h-5 w-32 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#2D2D2D' }}>Profile</h1>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 flex items-center gap-3">
          <CloseCircle size={20} color="#DC2626" variant="Bold" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const addressStr = formData.address 
    ? [formData.address.street, formData.address.city, formData.address.country].filter(Boolean).join(", ")
    : "";

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#2D2D2D' }}>Profile</h1>
          <p className="text-sm" style={{ color: '#B0B3B8' }}>Manage your profile information and preferences.</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Edit2 size={16} variant="Linear" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
          <TickCircle size={20} color="#14462a" variant="Bold" />
          <p className="text-sm text-green-800 font-medium">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3">
          <CloseCircle size={20} color="#DC2626" variant="Bold" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Profile Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="px-6 py-6 border-b border-gray-100 bg-gradient-to-r from-[#14462a]/5 to-transparent">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <AvatarUpload
              currentUrl={user?.avatar_url}
              showName={user?.full_name || user?.business_name || undefined}
              size="xl"
              editable={editing}
              onUploadComplete={(url) => {
                setUser(prev => prev ? { ...prev, avatar_url: url } : null);
                setSuccessMessage("Profile photo updated!");
                setTimeout(() => setSuccessMessage(null), 3000);
              }}
              onDeleteComplete={() => {
                setUser(prev => prev ? { ...prev, avatar_url: null } : null);
                setSuccessMessage("Profile photo removed");
                setTimeout(() => setSuccessMessage(null), 3000);
              }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.full_name || user?.business_name || 'Your Profile'}
                </h2>
                {user?.email_verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    <Verify size={12} variant="Bold" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium capitalize">
                  <UserIcon size={12} />
                  {user?.account_type || 'Personal'} Account
                </span>
                {user?.invoice_prefix && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#14462a]/10 text-[#14462a] text-xs font-medium">
                    <DocumentText1 size={12} />
                    {user.invoice_prefix}-XXXX
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {editing ? (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#14462a] focus:outline-none focus:ring-2 focus:ring-[#14462a]/10 transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                />
                <p className="mt-1.5 text-xs text-gray-400">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#14462a] focus:outline-none focus:ring-2 focus:ring-[#14462a]/10 transition-all"
                  placeholder="+233 XX XXX XXXX"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Business Name</label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#14462a] focus:outline-none focus:ring-2 focus:ring-[#14462a]/10 transition-all"
                  placeholder="Your business name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Default Currency</label>
                <select
                  value={formData.default_currency}
                  onChange={(e) => setFormData({ ...formData, default_currency: e.target.value as CurrencyCode })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#14462a] focus:outline-none focus:ring-2 focus:ring-[#14462a]/10 transition-all bg-white"
                >
                  <option value="GHS">GHS - Ghanaian Cedi</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="NGN">NGN - Nigerian Naira</option>
                  <option value="KES">KES - Kenyan Shilling</option>
                  <option value="ZAR">ZAR - South African Rand</option>
                </select>
              </div>
              {user?.account_type === 'business' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Tax ID / TIN</label>
                  <input
                    type="text"
                    value={formData.tax_id}
                    onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#14462a] focus:outline-none focus:ring-2 focus:ring-[#14462a]/10 transition-all"
                    placeholder="Your Tax ID"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">City</label>
                <input
                  type="text"
                  value={formData.address.city || ""}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#14462a] focus:outline-none focus:ring-2 focus:ring-[#14462a]/10 transition-all"
                  placeholder="Your city"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Street Address</label>
                <input
                  type="text"
                  value={formData.address.street || ""}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#14462a] focus:outline-none focus:ring-2 focus:ring-[#14462a]/10 transition-all"
                  placeholder="Street address"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                onClick={() => {
                  setEditing(false);
                  setError(null);
                  // Reset form to original values
                  if (user) {
                    setFormData({
                      full_name: user.full_name || "",
                      email: user.email || "",
                      phone: user.phone || "",
                      business_name: user.business_name || "",
                      address: (user.address as { street?: string; city?: string; country?: string }) || {},
                      default_currency: (user.default_currency || "GHS") as CurrencyCode,
                      tax_id: user.tax_id || "",
                    });
                  }
                }}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-[#14462a] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0d3520] transition-colors disabled:opacity-50 shadow-sm"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 flex-shrink-0">
                  <Sms size={20} color="#6B7280" variant="Linear" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Email</p>
                  <p className="mt-1 text-base font-medium text-gray-900">{user?.email || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 flex-shrink-0">
                  <Call size={20} color="#6B7280" variant="Linear" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Phone</p>
                  <p className="mt-1 text-base font-medium text-gray-900">{user?.phone || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 flex-shrink-0">
                  <Building size={20} color="#6B7280" variant="Linear" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Business Name</p>
                  <p className="mt-1 text-base font-medium text-gray-900">{user?.business_name || user?.full_name || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 flex-shrink-0">
                  <Wallet size={20} color="#6B7280" variant="Linear" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Default Currency</p>
                  <p className="mt-1 text-base font-medium text-gray-900">{user?.default_currency || "GHS"}</p>
                </div>
              </div>
              {user?.account_type === 'business' && user?.tax_id && (
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 flex-shrink-0">
                    <DocumentText1 size={20} color="#6B7280" variant="Linear" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Tax ID / TIN</p>
                    <p className="mt-1 text-base font-medium text-gray-900">{user.tax_id}</p>
                  </div>
                </div>
              )}
              {addressStr && (
                <div className="flex items-start gap-4 md:col-span-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 flex-shrink-0">
                    <Location size={20} color="#6B7280" variant="Linear" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Address</p>
                    <p className="mt-1 text-base font-medium text-gray-900">{addressStr}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-600">
              Click &quot;Edit Profile&quot; to update your information. Your email and invoice prefix cannot be changed after registration.
            </div>
          </div>
        )}
      </div>
      </div>
      
      {/* Account Info Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Account Information</h3>
        </div>
        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Account Type</p>
              <p className="text-sm font-medium text-gray-900 capitalize">{user?.account_type || 'Personal'}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Invoice Prefix</p>
              <p className="text-sm font-medium text-gray-900">{user?.invoice_prefix || 'GH'}-XXXX</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Email Status</p>
              <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                {user?.email_verified ? (
                  <>
                    <Verify size={14} color="#14462a" variant="Bold" />
                    <span className="text-green-700">Verified</span>
                  </>
                ) : (
                  <>
                    <CloseCircle size={14} color="#DC2626" />
                    <span className="text-amber-600">Not Verified</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
