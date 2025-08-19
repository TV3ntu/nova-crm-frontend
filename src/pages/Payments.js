import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  CurrencyDollarIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SearchableSelect from '../components/common/SearchableSelect'; // Import SearchableSelect component
import { useApi } from '../hooks/useApi';
import { paymentsAPI, studentsAPI } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [studentFilter, setStudentFilter] = useState('');

  // Handle search input change (only updates local state, doesn't trigger API)
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle Enter key press to trigger search
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log(' Búsqueda activada:', searchTerm);
      setSearchQuery(searchTerm);
    }
  };

  // Load payments with search query (only when Enter is pressed)
  const {
    data: payments,
    loading,
    error,
    refetch
  } = useApi(
    () => {
      const params = {
        search: searchQuery,
        month: monthFilter,
        student: studentFilter
      };
      console.log(' Parámetros enviados a la API:', params);
      return paymentsAPI.getAll(params);
    },
    [searchQuery, monthFilter, studentFilter]
  );

  // Debug: Log payments data when it changes
  useEffect(() => {
    if (payments) {
      console.log(' Pagos recibidos de la API:', payments.length, 'pagos');
      console.log(' Primeros 3 pagos:', payments.slice(0, 3));
    }
  }, [payments]);

  // Load students for a dropdown filter
  const {
    data: students
  } = useApi(
    () => studentsAPI.getAll(),
    []
  );

  // Prepare student options for dropdown
  const studentOptions = useMemo(() => {
    const baseOptions = [{ value: '', label: 'Todos los estudiantes' }];
    
    if (students && students.length > 0) {
      const studentOpts = students.map(student => ({
        value: student.id.toString(),
        label: student.fullName || `${student.firstName} ${student.lastName}`
      }));
      return [...baseOptions, ...studentOpts];
    }
    
    return baseOptions;
  }, [students]);
// Filtrar pagos localmente si hay datos (backend ya maneja la búsqueda por texto)
  const filteredPayments = useMemo(() => payments ? payments.filter(payment => {
    // No filtrar por searchQuery aquí - el backend ya lo hace
    const matchesMonth = !monthFilter || 
      new Date(payment.paymentDate).getMonth() === parseInt(monthFilter);
    
    const matchesStudent = !studentFilter || payment.studentId === parseInt(studentFilter);
    
    return matchesMonth && matchesStudent;
  }) : [], [payments, monthFilter, studentFilter]);

  // Calcular estadísticas
  const stats = useMemo(() => filteredPayments.reduce((acc, payment) => {
    acc.total += payment.amount || 0;
    acc.count += 1;
    return acc;
  }, { 
    total: 0, 
    count: 0
  }), [filteredPayments]);

  const { showSuccess, showError } = useNotification();

  const handleDeletePayment = async (paymentId) => {
    if (window.confirm('¿Estás seguro de eliminar este pago?')) {
      try {
        await paymentsAPI.delete(paymentId);
        refetch();
        showSuccess('Pago eliminado con éxito');
      } catch (error) {
        showError('Error al eliminar pago');
      }
    }
  };

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
        <h3 className="text-lg font-medium text-gray-900">Error al cargar pagos</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={refetch} variant="primary">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pagos</h1>
          <p className="text-gray-600">Gestión de pagos y facturación</p>
        </div>
        <div className="flex space-x-3">
          <Button as={Link} to="/reports/outstanding-payments" variant="secondary" icon={ExclamationTriangleIcon}>
            Pagos Pendientes
          </Button>
          <Button as={Link} to="/payments/new" icon={PlusIcon}>
            Nuevo Pago
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <p className="text-sm font-medium text-gray-600">Cantidad de Pagos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.count}</p>
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
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            icon={MagnifyingGlassIcon}
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
          
          <SearchableSelect
            placeholder="Estudiante"
            value={studentFilter}
            onChange={(value) => setStudentFilter(value)}
            options={studentOptions}
            searchPlaceholder="Buscar estudiante..."
            noResultsText="No se encontraron estudiantes"
          />
          
          <Button
            variant="secondary"
            icon={FunnelIcon}
            onClick={() => {
              setSearchTerm('');
              setSearchQuery('');
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => {
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {payment.studentName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {payment.studentId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{payment.className}</div>
                        {payment.notes && (
                          <div className="text-sm text-gray-500">
                            {payment.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${payment.amount.toLocaleString()}
                        </div>
                        {payment.isLatePayment && (
                          <div className="text-xs text-red-600">
                            Pago tardío
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(payment.paymentDate).toLocaleDateString('es-CL')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {payment.paymentMonth}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            as={Link} 
                            to={`/payments/${payment.id}`} 
                            variant="ghost" 
                            size="sm"
                          >
                            Ver Detalle
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm"
                            icon={TrashIcon}
                            onClick={() => handleDeletePayment(payment.id)}
                          >
                            Eliminar
                          </Button>
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
              {searchTerm || monthFilter || studentFilter
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
          </div>
        </Card>
      )}
    </div>
  );
};

export default Payments;
