import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  CurrencyDollarIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useApi } from '../hooks/useApi';
import { paymentsAPI } from '../services/api';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [studentFilter, setStudentFilter] = useState('');

  const {
    data: payments,
    loading,
    error,
    refetch
  } = useApi(
    () => paymentsAPI.getAll({
      search: searchTerm,
      status: statusFilter,
      month: monthFilter,
      student: studentFilter
    }),
    [searchTerm, statusFilter, monthFilter, studentFilter]
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success" icon={CheckCircleIcon}>Pagado</Badge>;
      case 'pending':
        return <Badge variant="warning" icon={ClockIcon}>Pendiente</Badge>;
      case 'overdue':
        return <Badge variant="danger" icon={ExclamationTriangleIcon}>Vencido</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateLateFee = (baseAmount, daysOverdue) => {
    if (daysOverdue <= 10) return 0;
    return Math.round(baseAmount * 0.15); // 15% recargo después del día 10
  };

  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Filtrar pagos localmente si hay datos
  const filteredPayments = payments ? payments.filter(payment => {
    const matchesSearch = !searchTerm || 
      payment.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student?.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    
    const matchesMonth = !monthFilter || 
      new Date(payment.dueDate).getMonth() === parseInt(monthFilter);
    
    const matchesStudent = !studentFilter || payment.student?.id === parseInt(studentFilter);
    
    return matchesSearch && matchesStatus && matchesMonth && matchesStudent;
  }) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <CurrencyDollarIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar pagos</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={refetch} variant="primary">
          Reintentar
        </Button>
      </div>
    );
  }

  // Calcular estadísticas
  const stats = filteredPayments.reduce((acc, payment) => {
    acc.total += payment.amount || 0;
    if (payment.status === 'paid') acc.paid += payment.amount || 0;
    if (payment.status === 'pending') acc.pending += payment.amount || 0;
    if (payment.status === 'overdue') acc.overdue += payment.amount || 0;
    return acc;
  }, { total: 0, paid: 0, pending: 0, overdue: 0 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pagos</h1>
          <p className="text-gray-600">Gestión de pagos y facturación</p>
        </div>
        <div className="flex space-x-3">
          <Button as={Link} to="/payments/outstanding" variant="secondary" icon={ExclamationTriangleIcon}>
            Pagos Pendientes
          </Button>
          <Button as={Link} to="/payments/new" icon={PlusIcon}>
            Nuevo Pago
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">${stats.total.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pagado</p>
              <p className="text-2xl font-bold text-gray-900">${stats.paid.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendiente</p>
              <p className="text-2xl font-bold text-gray-900">${stats.pending.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vencido</p>
              <p className="text-2xl font-bold text-gray-900">${stats.overdue.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            placeholder="Buscar por estudiante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={MagnifyingGlassIcon}
          />
          
          <Select
            placeholder="Estado"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'Todos los estados' },
              { value: 'paid', label: 'Pagado' },
              { value: 'pending', label: 'Pendiente' },
              { value: 'overdue', label: 'Vencido' },
              { value: 'cancelled', label: 'Cancelado' }
            ]}
          />
          
          <Select
            placeholder="Mes"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            options={[
              { value: '', label: 'Todos los meses' },
              { value: '0', label: 'Enero' },
              { value: '1', label: 'Febrero' },
              { value: '2', label: 'Marzo' },
              { value: '3', label: 'Abril' },
              { value: '4', label: 'Mayo' },
              { value: '5', label: 'Junio' },
              { value: '6', label: 'Julio' },
              { value: '7', label: 'Agosto' },
              { value: '8', label: 'Septiembre' },
              { value: '9', label: 'Octubre' },
              { value: '10', label: 'Noviembre' },
              { value: '11', label: 'Diciembre' }
            ]}
          />
          
          <Select
            placeholder="Estudiante"
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
            options={[
              { value: '', label: 'Todos los estudiantes' },
              // Aquí se cargarían los estudiantes desde la API
            ]}
          />
          
          <Button
            variant="secondary"
            icon={FunnelIcon}
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
              setMonthFilter('');
              setStudentFilter('');
            }}
          >
            Limpiar Filtros
          </Button>
        </div>
      </Card>

      {/* Payments List */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Lista de Pagos</h3>
        </div>
        
        {filteredPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concepto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => {
                  const daysOverdue = getDaysOverdue(payment.dueDate);
                  const lateFee = calculateLateFee(payment.baseAmount || payment.amount, daysOverdue);
                  const totalAmount = (payment.baseAmount || payment.amount) + lateFee;
                  
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar 
                            src={payment.student?.avatar} 
                            name={payment.student?.name} 
                            size="sm" 
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {payment.student?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.student?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{payment.description}</div>
                        {payment.classes && payment.classes.length > 0 && (
                          <div className="text-sm text-gray-500">
                            {payment.classes.join(', ')}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${totalAmount.toLocaleString()}
                        </div>
                        {lateFee > 0 && (
                          <div className="text-xs text-red-600">
                            +${lateFee.toLocaleString()} recargo
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(payment.dueDate)}
                        </div>
                        {daysOverdue > 0 && (
                          <div className="text-xs text-red-600">
                            {daysOverdue} días vencido
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            as={Link} 
                            to={`/payments/${payment.id}`} 
                            variant="ghost" 
                            size="sm"
                          >
                            Ver
                          </Button>
                          {payment.status !== 'paid' && (
                            <Button 
                              as={Link} 
                              to={`/payments/${payment.id}/pay`} 
                              variant="primary" 
                              size="sm"
                            >
                              Pagar
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <CurrencyDollarIcon className="w-full h-full" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pagos</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter || monthFilter || studentFilter
                ? 'No se encontraron pagos que coincidan con los filtros aplicados.'
                : 'No hay pagos registrados en el sistema.'
              }
            </p>
            <div className="mt-6">
              <Button as={Link} to="/payments/new" icon={PlusIcon}>
                Registrar Primer Pago
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Summary */}
      {filteredPayments.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Mostrando {filteredPayments.length} de {payments?.length || 0} pagos
            </span>
            <div className="flex space-x-4">
              <span>
                Pagados: {filteredPayments.filter(p => p.status === 'paid').length}
              </span>
              <span>
                Pendientes: {filteredPayments.filter(p => p.status === 'pending').length}
              </span>
              <span>
                Vencidos: {filteredPayments.filter(p => p.status === 'overdue').length}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Payments;
