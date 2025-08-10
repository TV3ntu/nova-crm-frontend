import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  PhoneIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useApi } from '../hooks/useApi';
import { paymentsAPI } from '../services/api';

const OutstandingPayments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('daysOverdue');

  const {
    data: outstandingPayments,
    loading,
    error,
    refetch
  } = useApi(
    () => paymentsAPI.getOutstanding(),
    [],
    {
      transform: (data) => data || []
    }
  );

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
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar pagos pendientes</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={refetch} variant="primary">
          Reintentar
        </Button>
      </div>
    );
  }

  // Filter and sort payments
  const filteredPayments = outstandingPayments
    .filter(payment => {
      const matchesSearch = payment.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.className?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'daysOverdue':
          return (b.daysOverdue || 0) - (a.daysOverdue || 0);
        case 'amount':
          return (b.amount || 0) - (a.amount || 0);
        case 'studentName':
          return (a.studentName || '').localeCompare(b.studentName || '');
        default:
          return 0;
      }
    });

  const totalOutstanding = filteredPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const totalWithLateFees = filteredPayments.reduce((sum, payment) => {
    const lateFee = (payment.daysOverdue || 0) > 10 ? (payment.amount || 0) * 0.15 : 0;
    return sum + (payment.amount || 0) + lateFee;
  }, 0);

  const getStatusBadge = (status, daysOverdue) => {
    if (daysOverdue > 30) return <Badge variant="danger">Crítico</Badge>;
    if (daysOverdue > 10) return <Badge variant="warning">Recargo</Badge>;
    return <Badge variant="info">Pendiente</Badge>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button as={Link} to="/reports" variant="ghost" size="sm" icon={ArrowLeftIcon}>
            Volver a Reportes
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pagos Pendientes</h1>
            <p className="text-gray-600">Gestión de pagos vencidos y recargos</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pendiente</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOutstanding)}</p>
              <p className="text-sm text-red-600">{filteredPayments.length} pagos</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Con Recargos</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalWithLateFees)}</p>
              <p className="text-sm text-yellow-600">
                +{formatCurrency(totalWithLateFees - totalOutstanding)} recargos
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Promedio Días</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredPayments.length > 0 
                  ? Math.round(filteredPayments.reduce((sum, p) => sum + (p.daysOverdue || 0), 0) / filteredPayments.length)
                  : 0
                }
              </p>
              <p className="text-sm text-blue-600">días vencido</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              type="text"
              placeholder="Buscar estudiante o clase..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={MagnifyingGlassIcon}
            />
          </div>
          <div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'Todos los estados' },
                { value: 'pending', label: 'Pendiente' },
                { value: 'overdue', label: 'Vencido' },
                { value: 'critical', label: 'Crítico' }
              ]}
            />
          </div>
          <div>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'daysOverdue', label: 'Días vencido' },
                { value: 'amount', label: 'Monto' },
                { value: 'studentName', label: 'Nombre estudiante' }
              ]}
            />
          </div>
          <div>
            <Button onClick={refetch} variant="secondary" className="w-full">
              Actualizar
            </Button>
          </div>
        </div>
      </Card>

      {/* Payments List */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Pagos Pendientes ({filteredPayments.length})
          </h3>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pagos pendientes</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'No se encontraron pagos con los filtros aplicados'
                : 'Todos los pagos están al día'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clase
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Vencimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Días Vencido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => {
                  const lateFee = (payment.daysOverdue || 0) > 10 ? (payment.amount || 0) * 0.15 : 0;
                  const totalAmount = (payment.amount || 0) + lateFee;

                  return (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.studentName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {payment.studentId || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.className || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </div>
                        {lateFee > 0 && (
                          <div className="text-sm text-red-600">
                            +{formatCurrency(lateFee)} recargo
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('es-CL') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          (payment.daysOverdue || 0) > 30 ? 'text-red-600' :
                          (payment.daysOverdue || 0) > 10 ? 'text-yellow-600' :
                          'text-blue-600'
                        }`}>
                          {payment.daysOverdue || 0} días
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.status, payment.daysOverdue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {payment.studentPhone && (
                            <a
                              href={`tel:${payment.studentPhone}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <PhoneIcon className="h-4 w-4" />
                            </a>
                          )}
                          {payment.studentEmail && (
                            <a
                              href={`mailto:${payment.studentEmail}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <EnvelopeIcon className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            as={Link}
                            to={`/payments/new?studentId=${payment.studentId}`}
                            variant="primary"
                            size="sm"
                          >
                            Registrar Pago
                          </Button>
                          <Button
                            as={Link}
                            to={`/students/${payment.studentId}`}
                            variant="ghost"
                            size="sm"
                          >
                            Ver Estudiante
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default OutstandingPayments;
