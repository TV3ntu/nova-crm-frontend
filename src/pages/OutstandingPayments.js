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
import { reportsAPI } from '../services/api';

const OutstandingPayments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    // Default to current month in YYYY-MM format
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const {
    data: reportData,
    loading,
    error,
    refetch
  } = useApi(
    () => reportsAPI.getOutstandingPayments(selectedMonth),
    [selectedMonth],
    {
      transform: (data) => data || {
        month: selectedMonth,
        outstandingPayments: [],
        totalOutstandingAmount: 0,
        studentsWithOutstandingPayments: 0
      }
    }
  );

  // Debug logs
  console.log('🔍 OutstandingPayments Debug:', {
    loading,
    error,
    reportData,
    selectedMonth
  });

  if (loading) {
    console.log('⏳ Component is loading...');
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    console.log('❌ Component has error:', error);
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

  console.log('✅ Component rendering with data:', reportData);

  // Filter and sort payments
  const filteredPayments = reportData.outstandingPayments
    .filter(student => {
      const matchesSearch = student.studentName?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      // Sort by total owed amount (descending)
      return (b.totalOwed || 0) - (a.totalOwed || 0);
    });

  const totalOutstanding = filteredPayments.reduce((sum, student) => sum + (student.totalOwed || 0), 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount || 0);
  };

  const getStatusBadge = (totalOwed) => {
    if (totalOwed > 50000) return <Badge variant="danger">Crítico</Badge>;
    if (totalOwed > 25000) return <Badge variant="warning">Alto</Badge>;
    return <Badge variant="info">Pendiente</Badge>;
  };

  // Generate month options for the last 12 months
  const getMonthOptions = () => {
    const options = [];
    const now = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('es-CL', { 
        year: 'numeric', 
        month: 'long' 
      });
      options.push({ value, label });
    }
    
    return options;
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
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.totalOutstandingAmount)}</p>
              <p className="text-sm text-red-600">{reportData.studentsWithOutstandingPayments} estudiantes</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CalendarDaysIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Con Recargos</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOutstanding)}</p>
              <p className="text-sm text-yellow-600">
                Estimado con recargos por mora
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
              <p className="text-sm font-medium text-gray-600">Estudiantes</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredPayments.length}
              </p>
              <p className="text-sm text-blue-600">Con pagos pendientes</p>
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
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              options={getMonthOptions()}
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
              {searchTerm 
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
                    Total Adeudado
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
                {filteredPayments.map((student) => {
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.studentName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {student.studentId || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(student.totalOwed)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(student.totalOwed)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {student.studentPhone && (
                            <a
                              href={`tel:${student.studentPhone}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <PhoneIcon className="h-4 w-4" />
                            </a>
                          )}
                          {student.studentEmail && (
                            <a
                              href={`mailto:${student.studentEmail}`}
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
                            to={`/payments/new?studentId=${student.studentId}`}
                            variant="primary"
                            size="sm"
                          >
                            Registrar Pago
                          </Button>
                          <Button
                            as={Link}
                            to={`/students/${student.studentId}`}
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
