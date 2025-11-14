export function InboxIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Inbox box outline */}
      <path d="M3 10H8L10 14H14L16 10H21V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V10Z" />
      
      {/* Top trapezoid */}
      <path d="M3 10L5 4C5.26522 3.38197 5.88197 3 6.55279 3H17.4472C18.118 3 18.7348 3.38197 19 4L21 10" />
    </svg>
  );
}
