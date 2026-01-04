import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { InvoicePreviewContent } from "./preview-content";

// Loading fallback component
function PreviewLoadingFallback() {
  return (
    <div className="min-h-screen bg-white">
      <div className="print:hidden" style={{ borderBottom: '1px solid #E4E6EB' }}>
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="px-12 py-10">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-48 mb-8" />
          <div className="grid grid-cols-3 gap-8 mb-8">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}

export default async function InvoicePreviewPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<PreviewLoadingFallback />}>
      <InvoicePreviewContent id={id} />
    </Suspense>
  );
}
