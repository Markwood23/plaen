export default function WorkspaceProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#2D2D2D' }}>Profile</h1>
        <p className="text-sm" style={{ color: '#B0B3B8' }}>Manage the name, email, and signature that appear on shared invoices.</p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Primary contact</p>
            <p className="mt-2 text-lg font-semibold text-black">Ama Mensah</p>
            <p className="text-sm text-gray-500">you@studio-plaen.com</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Workspace</p>
            <p className="mt-2 text-lg font-semibold text-black">Studio Plaen</p>
            <p className="text-sm text-gray-500">Personal + Business modes enabled</p>
          </div>
        </div>
        <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-600">
          Need to update details? Contact Plaen support via Help Center.
        </div>
      </div>
    </div>
  );
}
