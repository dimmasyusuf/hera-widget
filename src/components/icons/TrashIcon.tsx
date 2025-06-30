export default function TrashIcon({
  color = "#C2C6E8",
  className
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5013 18.3337H12.5013C16.668 18.3337 18.3346 16.667 18.3346 12.5003V7.50033C18.3346 3.33366 16.668 1.66699 12.5013 1.66699H7.5013C3.33464 1.66699 1.66797 3.33366 1.66797 7.50033V12.5003C1.66797 16.667 3.33464 18.3337 7.5013 18.3337Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.9154 7.5416C13.0987 7.35827 11.2654 7.2666 9.44036 7.2666C8.35703 7.2666 7.27369 7.32493 6.19869 7.43327L5.08203 7.5416"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.08984 6.99121L8.20651 6.27454C8.28984 5.75787 8.3565 5.36621 9.2815 5.36621H10.7148C11.6398 5.36621 11.7065 5.77454 11.7898 6.27454L11.9065 6.98288"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.7417 7.60742L13.3833 13.1074C13.325 13.9657 13.275 14.6324 11.75 14.6324H8.24167C6.71667 14.6324 6.66666 13.9657 6.60833 13.1074L6.25 7.60742"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
