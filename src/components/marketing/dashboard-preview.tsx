export function DashboardPreview() {
  return (
    <div className="relative w-full max-w-3xl">
      {/* Dashboard mockup illustration */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_40px_120px_rgba(15,15,15,0.15)]">
        {/* Header bar */}
        <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50/50 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="ml-auto flex gap-2">
            <div className="h-2 w-16 rounded bg-gray-200" />
            <div className="h-2 w-12 rounded bg-gray-200" />
          </div>
        </div>
        
        {/* Dashboard content */}
        <div className="p-6 space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="h-2 w-16 rounded bg-gray-200 mb-3" />
              <div className="h-6 w-24 rounded bg-gray-900 mb-2" />
              <div className="h-2 w-12 rounded bg-green-500" />
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="h-2 w-16 rounded bg-gray-200 mb-3" />
              <div className="h-6 w-24 rounded bg-gray-900 mb-2" />
              <div className="h-2 w-12 rounded bg-blue-500" />
            </div>
            <div className="rounded-xl border border-gray-200 bg-black p-4">
              <div className="h-2 w-16 rounded bg-white/20 mb-3" />
              <div className="h-6 w-20 rounded bg-white mb-2" />
              <div className="h-2 w-16 rounded bg-white/40" />
            </div>
          </div>
          
          {/* Chart area */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="h-3 w-32 rounded bg-gray-900" />
              <div className="h-2 w-16 rounded bg-gray-200" />
            </div>
            <div className="h-32 w-full rounded bg-gradient-to-t from-gray-100 to-transparent" />
          </div>
          
          {/* Table preview */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="h-2 w-12 rounded bg-gray-200" />
                <div className="h-2 flex-1 rounded bg-gray-900" />
                <div className="h-5 w-16 rounded-full bg-black" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-12 rounded bg-gray-200" />
                <div className="h-2 flex-1 rounded bg-gray-900" />
                <div className="h-5 w-16 rounded-full bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute -right-8 top-12 h-20 w-20 rounded-2xl border border-gray-200 bg-white shadow-lg p-3 rotate-6">
        <div className="h-2 w-8 rounded bg-gray-200 mb-2" />
        <div className="h-4 w-12 rounded bg-green-500" />
      </div>
      <div className="absolute -left-6 bottom-16 h-16 w-16 rounded-full border border-gray-200 bg-white shadow-lg flex items-center justify-center -rotate-12">
        <div className="h-8 w-8 rounded-full bg-blue-500" />
      </div>
    </div>
  );
}
