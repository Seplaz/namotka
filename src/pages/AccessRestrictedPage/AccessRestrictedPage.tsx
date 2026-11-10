import { ShieldAlert } from 'lucide-react';
import { PageState } from '@/components/PageState/PageState';

type AccessRestrictedPageProps = {
  message: string;
  onLogout: () => void;
};

export function AccessRestrictedPage({
  message,
  onLogout,
}: AccessRestrictedPageProps) {
  return (
    <PageState
      icon={<ShieldAlert size={28} />}
      title="Доступ ограничен"
      description={message}
      actionLabel="Выйти из аккаунта"
      onAction={onLogout}
      variant="warning"
    />
  );
}