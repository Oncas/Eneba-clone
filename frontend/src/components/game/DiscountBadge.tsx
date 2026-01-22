interface DiscountBadgeProps {
  discount: number;
  className?: string;
}

export const DiscountBadge = ({
  discount,
  className = "",
}: DiscountBadgeProps) => {
  if (discount <= 0) {
    return null;
  }

  const discountPercentage = `-${Math.round(discount)}%`;

  return (
    <div
      className={`absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold z-10 ${className}`}
    >
      {discountPercentage}
    </div>
  );
};
