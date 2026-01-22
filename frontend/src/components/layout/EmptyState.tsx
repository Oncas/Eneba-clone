interface EmptyStateProps {
  message: string;
  className?: string;
}

export const EmptyState = ({ message, className = '' }: EmptyStateProps) => {
  return (
    <div className={`text-center py-20 text-gray-400 ${className}`}>
      {message}
    </div>
  );
};
