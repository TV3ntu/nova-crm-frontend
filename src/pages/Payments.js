import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, BoltIcon } from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      
      setTimeout(() => {
        setPayments([
          {
            id: 1,
            student: {
              id: 1,
              name: 'María García',
              avatar: null
            },
            amount: 1500,
            baseAmount: 1500,
            lateFeePenalty: 0,
            classes: ['Ballet Clásico', 'Jazz'],
            paymentDate: '2024-01-15',
            dueDate: '2024-01-10',
            month: '2024-01',
            status: 'completed',
            method: 'Transferencia',
            hasLateFee: false
          },
          {
            id: 2,
            student: {
              id: 2,
              name: 'Ana López',
              avatar: null
            },
            amount: 920,
            baseAmount: 800,
            lateFeePenalty: 120,
            classes: ['Hip Hop'],
            paymentDate: '2024-01-18',
            dueDate: '2024-01-10',
            month: '2024-01',
            status: 'completed',
            method: 'Efectivo',
            hasLateFee: true
          },
          {
            id: 3,
            student: {
              id: 3,
              name: 'Carmen Silva',
              avatar: null
            },
            amount: 1600,
            baseAmount: 1600,
            lateFeePenalty: 0,
            classes: ['Contemporáneo', 'Ballet Clásico'],
            paymentDate: '2024-01-08',
            dueDate: '2024-01-10',
            month: '2024-01',
            status: 'completed',
            method: 'Transferencia',
            hasLateFee: false
          },
          {
            id: 4,
            student: {
              id: 4,
              name: 'Isabella Rodríguez',
              avatar: null
            },
            amount: 600,
            baseAmount: 600,
            lateFeePenalty: 0,
            classes: ['Salsa'],
            paymentDate: null,
            dueDate: '2024-02-10',
            month: '2024-02',
            status: 'pending',
            method: null,
            hasLateFee: false
          },
          {
            id: 5,
            student: {
              id: 5,
              name: 'Sofía Martín',
              avatar: null
            },
            amount: 920,
            baseAmount: 800,
            lateFeePenalty: 120,
            classes: ['Jazz'],
            paymentDate: null,
            dueDate: '2024-01-10',
            month: '2024-01',
            status: 'overdue',
            method: null,
            hasLateFee: true
          }
        ]);
        setLoading(false);
      }, 1000);
    };

    loadPayments();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completado</Badge>;
      case 'pending':
        return <Badge variant="warning">Pendiente</Badge>;
      case 'overdue':
        return <Badge variant="danger">Vencido</Badge>;
      default:
        return <Badge variant="gray">Desconocido</Badge>;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    const matchesMonth = !monthFilter || payment.month === monthFilter;
    
    return matchesSearch && matchesStatus && matchesMonth;
  });

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedPayments = filteredPayments.filter(p => p.status === 'completed');
  const pendingPayments = filteredPayments.filter(p => p.status === 'pending' || p.status === 'overdue');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pagos</h1>
          <p className="text-gray-600">Gestiona los pagos de los estudiantes</p>
        </div>
        <div className="flex space-x-3">
          <Button as={Link} to="/payments/quick" variant="secondary" icon={BoltIcon}>
            Pago Rápido
          </Button>
          <Button as={Link} to="/payments/new" icon={PlusIcon}>
            Nuevo Pago
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Recaudado</p>
              <p className="text-2xl font-bold text-gray-900">${totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pagos Completados</p>
              <p className="text-2xl font-bold text-gray-900">{completedPayments.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pagos Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{pendingPayments.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Con Recargo</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredPayments.filter(p => p.hasLateFee).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar estudiante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            placeholder="Estado"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'completed', label: 'Completado' },
              { value: 'pending', label: 'Pendiente' },
              { value: 'overdue', label: 'Vencido' }
            ]}
          />
          
          <Select
            placeholder="Mes"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            options={[
              { value: '2024-01', label: 'Enero 2024' },
              { value: '2024-02', label: 'Febrero 2024' },
              { value: '2024-03', label: 'Marzo 2024' }
            ]}
          />
          
          <Button
            variant="secondary"
            icon={FunnelIcon}
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
              setMonthFilter('');
            }}
          >
            Limpiar
          </Button>

          <Button as={Link} to="/reports/outstanding" variant="ghost">
            Ver Pagos Vencidos
          </Button>
        </div>
      </Card>

      {/* Payments Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clases
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Vencimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar src={payment.student.avatar} name={payment.student.name} size="sm" />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{payment.student.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {payment.classes.map((cls, index) => (
                        <Badge key={index} variant="primary" size="sm">{cls}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(payment.dueDate).toLocaleDateString('es-CL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('es-CL') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ${payment.amount.toLocaleString()}
                    </div>
                    {payment.hasLateFee && (
                      <div className="text-xs text-red-600">
                        +${payment.lateFeePenalty} recargo
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {payment.method || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {payment.status !== 'completed' && (
                      <Button 
                        as={Link} 
                        to={`/payments/new?student=${payment.student.id}`}
                        variant="ghost" 
                        size="sm"
                      >
                        Procesar
                      </Button>
                    )}
                    <Button as={Link} to={`/students/${payment.student.id}`} variant="ghost" size="sm">
                      Ver Estudiante
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pagos</h3>
            <p className="mt-1 text-sm text-gray-500">
              No se encontraron pagos que coincidan con los filtros aplicados.
            </p>
            <div className="mt-6">
              <Button as={Link} to="/payments/new" icon={PlusIcon}>
                Procesar Primer Pago
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Payments;
