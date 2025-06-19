interface BadgeProps {
  text: string;
}

export const Badge: React.FC<BadgeProps> = ({ text }) => {
  const capitalizedText = text.charAt(0).toUpperCase() + text.slice(1);
  return (
    <span className="inline-block bg-gray-100 text-gray-800 md:text-sm text-xs font-semibold mr-2 px-3 py-1 rounded-full">
      {capitalizedText}
    </span>
  );
};
