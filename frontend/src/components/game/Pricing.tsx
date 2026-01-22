interface PricingProps {
  price: number;
  discount: number;
  finalPrice: number;
}

export const Pricing = ({ price, discount, finalPrice }: PricingProps) => {
  const discountPercentage = discount > 0 ? `-${Math.round(discount)}%` : '';
  const originalPrice = price.toFixed(2);
  const finalPriceFormatted = finalPrice.toFixed(2);

  return (
    <div className="space-y-1">
      {discount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400 line-through">
            €{originalPrice}
          </span>
          <span className="text-xs text-green-400 font-semibold">
            {discountPercentage}
          </span>
        </div>
      )}
      <div className="text-xl sm:text-2xl font-bold text-white">
        €{finalPriceFormatted}
      </div>
    </div>
  );
};
