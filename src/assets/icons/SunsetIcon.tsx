interface SunsetIconProps {
  className?: string;
  width?: string;
  height?: string;
}

export const SunsetIcon = ({
  className = "",
  width = "20",
  height = "20",
}: SunsetIconProps) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 10v-6"></path>
      <path d="M12 18a6 6 0 0 1-6-6"></path>
      <path d="M12 18a6 6 0 0 0 6-6"></path>
      <path d="M12 10a6 6 0 0 0-6 6"></path>
      <path d="M12 10a6 6 0 0 1 6 6"></path>
      <path d="M6 21h12"></path>
      <path d="M3 21h18"></path>
    </svg>
  );
};
