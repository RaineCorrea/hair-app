interface ChevronIconProps {
  className?: string;
  width?: string;
  height?: string;
}

export const ChevronIcon = ({
  className = "",
  width = "16",
  height = "16",
}: ChevronIconProps) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
};
