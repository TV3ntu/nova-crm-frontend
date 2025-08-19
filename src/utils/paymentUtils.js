import Badge from '../components/common/Badge';

/**
 * Generates a payment status badge component
 * @param {string} status - Payment status ('paid', 'pending', 'overdue', 'up_to_date', etc.)
 * @param {number} totalOwed - Optional: Amount owed (for overdue payments)
 * @returns {JSX.Element} Badge component with appropriate styling
 */
export const getPaymentStatusBadge = (status, totalOwed = 0) => {
  switch (status) {
    case 'paid':
      return <Badge variant="success">Pagado</Badge>;
    case 'up_to_date':
      return <Badge variant="success">Al día</Badge>;
    case 'pending':
      return <Badge variant="warning">Pendiente</Badge>;
    case 'overdue':
      if (totalOwed > 0) {
        return (
          <div>
            <Badge variant="danger">Vencido</Badge>
            <p className="text-xs text-red-600 mt-1">
              Debe: ${totalOwed.toLocaleString()}
            </p>
          </div>
        );
      }
      return <Badge variant="danger">Atrasado</Badge>;
    default:
      return <Badge variant="secondary">{status || 'Desconocido'}</Badge>;
  }
};

/**
 * Formats day of week from English to Spanish
 * @param {string} dayOfWeek - Day in English (e.g., 'MONDAY')
 * @returns {string} Day in Spanish (e.g., 'Lunes')
 */
export const formatDayOfWeek = (dayOfWeek) => {
  const dayMap = {
    'MONDAY': 'Lunes',
    'TUESDAY': 'Martes',
    'WEDNESDAY': 'Miércoles',
    'THURSDAY': 'Jueves',
    'FRIDAY': 'Viernes',
    'SATURDAY': 'Sábado',
    'SUNDAY': 'Domingo'
  };
  return dayMap[dayOfWeek] || dayOfWeek;
};
