import { Suspense } from "react";
import NewNoteContent from "./new-note-content";

function LoadingFallback() {
  return (
    <div className="max-w-4xl mx-auto pb-12 px-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-9 w-9 rounded-full bg-gray-100 animate-pulse" />
        <div className="h-6 w-32 rounded bg-gray-100 animate-pulse" />
      </div>
      <div className="h-10 w-full rounded bg-gray-100 animate-pulse mb-6" />
      <div className="h-64 w-full rounded-xl bg-gray-50 animate-pulse" />
    </div>
  );
}

export default function NewNotePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewNoteContent />
    </Suspense>
  );
}
