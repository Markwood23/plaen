"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, CurrencyCode } from "@/types/database";
import { Edit2, Sms, Call, Building, Location, Wallet } from "iconsax-react";

export default function WorkspaceProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    business_name: "",
    address: {} as { street?: string; city?: string; country?: string },
    default_currency: "GHS" as CurrencyCode,
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
        console.error("Error fetching profile:", profileError);
        setError("Failed to load profile");
        setLoading(false);
        return;
      }

      setUser(profile);
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        business_name: profile.business_name || "",
        address: (profile.address as { street?: string; city?: string; country?: string }) || {},
        default_currency: (profile.default_currency || "GHS") as CurrencyCode,
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
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#2D2D2D' }}>Profile</h1>
          <p className="text-sm" style={{ color: '#B0B3B8' }}>Manage the name, email, and signature that appear on shared invoices.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-40 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#2D2D2D' }}>Profile</h1>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const addressStr = formData.address 
    ? [formData.address.street, formData.address.city, formData.address.country].filter(Boolean).join(", ")
    : "";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#2D2D2D' }}>Profile</h1>
          <p className="text-sm" style={{ color: '#B0B3B8' }}>Manage the name, email, and signature that appear on shared invoices.</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Edit2 size={16} variant="Linear" />
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {editing ? (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-[#D15052] focus:outline-none focus:ring-1 focus:ring-[#D15052]"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500"
                />
                <p className="mt-1 text-xs text-gray-400">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-[#D15052] focus:outline-none focus:ring-1 focus:ring-[#D15052]"
                  placeholder="+233 XX XXX XXXX"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">Business Name</label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-[#D15052] focus:outline-none focus:ring-1 focus:ring-[#D15052]"
                  placeholder="Your business name"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">Default Currency</label>
                <select
                  value={formData.default_currency}
                  onChange={(e) => setFormData({ ...formData, default_currency: e.target.value as CurrencyCode })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-[#D15052] focus:outline-none focus:ring-1 focus:ring-[#D15052]"
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
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">City</label>
                <input
                  type="text"
                  value={formData.address.city || ""}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-[#D15052] focus:outline-none focus:ring-1 focus:ring-[#D15052]"
                  placeholder="Your city"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">Street Address</label>
                <input
                  type="text"
                  value={formData.address.street || ""}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-[#D15052] focus:outline-none focus:ring-1 focus:ring-[#D15052]"
                  placeholder="Street address"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setEditing(false);
                  // Reset form to original values
                  if (user) {
                    setFormData({
                      full_name: user.full_name || "",
                      email: user.email || "",
                      phone: user.phone || "",
                      business_name: user.business_name || "",
                      address: (user.address as { street?: string; city?: string; country?: string }) || {},
                      default_currency: (user.default_currency || "GHS") as CurrencyCode,
                    });
                  }
                }}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-[#D15052] px-4 py-2 text-sm font-medium text-white hover:bg-[#B84345] transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <Sms size={20} color="#6B7280" variant="Linear" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Email</p>
                  <p className="mt-1 text-base font-medium text-gray-900">{user?.email || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <Call size={20} color="#6B7280" variant="Linear" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Phone</p>
                  <p className="mt-1 text-base font-medium text-gray-900">{user?.phone || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <Building size={20} color="#6B7280" variant="Linear" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Business Name</p>
                  <p className="mt-1 text-base font-medium text-gray-900">{user?.business_name || user?.full_name || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <Wallet size={20} color="#6B7280" variant="Linear" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Default Currency</p>
                  <p className="mt-1 text-base font-medium text-gray-900">{user?.default_currency || "GHS"}</p>
                </div>
              </div>
              {addressStr && (
                <div className="flex items-start gap-3 md:col-span-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <Location size={20} color="#6B7280" variant="Linear" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Address</p>
                    <p className="mt-1 text-base font-medium text-gray-900">{addressStr}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-600">
              Click &quot;Edit Profile&quot; to update your information. Your email cannot be changed after registration.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
