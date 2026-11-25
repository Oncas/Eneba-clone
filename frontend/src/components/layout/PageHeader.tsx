import { BackButton } from '../ui/BackButton';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
}

export const PageHeader = ({ title, subtitle, backTo, backLabel }: PageHeaderProps) => {
  return (
    <div className="mb-6 sm:mb-8">
      {backTo && <BackButton to={backTo} label={backLabel} className="mb-3 sm:mb-4" />}
      <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
      {subtitle && <p className="text-gray-400 mt-2 text-sm sm:text-base">{subtitle}</p>}
    </div>
  );
};
