interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage = ({ message, className = '' }: ErrorMessageProps) => {
  return (
    <div className={`bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg ${className}`}>
      {message}
    </div>
  );
};
