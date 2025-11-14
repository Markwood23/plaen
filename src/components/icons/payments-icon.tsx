export function PaymentsIcon({ className }: { className?: string }) {
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
      {/* Wallet outline */}
      <path d="M19 7V6C19 4.89543 18.1046 4 17 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H17C18.1046 20 19 19.1046 19 18V17" />
      
      {/* Card section */}
      <path d="M19 10H21V14H19C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10Z" />
      
      {/* Horizontal line in wallet */}
      <line x1="7" y1="10" x2="13" y2="10" />
    </svg>
  );
}
