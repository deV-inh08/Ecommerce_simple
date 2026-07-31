type StatusType =
  | 'active'
  | 'pending'
  | 'processing'
  | 'cancelled'
  | 'shipped'
  | 'delivered'
  | 'confirmed'
  | 'out-of-stock'
  | 'draft';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const getStyles = (status: StatusType) => {
    switch (status) {
      case 'active':
      case 'delivered':
      case 'confirmed':
        return {
          backgroundColor: 'rgba(0, 93, 99, 0.1)',
          color: 'var(--primary)',
        };
      case 'pending':
      case 'processing':
        return {
          backgroundColor: 'rgba(245, 197, 24, 0.15)',
          color: 'var(--accent-dark)',
        };
      case 'shipped':
        return {
          backgroundColor: 'rgba(0, 122, 130, 0.1)',
          color: 'var(--primary-light)',
        };
      case 'cancelled':
      case 'out-of-stock':
        return {
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          color: 'var(--sale-red)',
        };
      case 'draft':
        return {
          backgroundColor: 'rgba(107, 114, 128, 0.1)',
          color: 'var(--text-muted)',
        };
      default:
        return {
          backgroundColor: 'rgba(107, 114, 128, 0.1)',
          color: 'var(--text-muted)',
        };
    }
  };

  const styles = getStyles(status);

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
      style={styles}
    >
      {label}
    </span>
  );
}
