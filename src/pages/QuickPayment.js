import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import { MagnifyingGlassIcon, BoltIcon } from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';

const QuickPayment = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [processing, setProcessing] = useState(false);

  // Estudiantes con pagos pendientes
  const studentsWithPendingPayments = [
    {
      id: 1,
      name: 'María García',
      avatar: null,
      pendingAmount: 1500,
      classes: ['Ballet Clásico', 'Jazz'],
      dueDate: '2024-02-10',
      isOverdue: false
    },
    {
      id: 2,
      name: 'Ana López',
      avatar: null,
      pendingAmount: 920,
      baseAmount: 800,
      lateFee: 120,
      classes: ['Hip Hop'],
      dueDate: '2024-01-10',
      isOverdue: true
    },
    {
      id: 3,
      name: 'Carmen Silva',
      avatar: null,
      pendingAmount: 1600,
      classes: ['Contemporáneo', 'Ballet Clásico'],
      dueDate: '2024-02-15',
      isOverdue: false
    },
    {
      id: 4,
      name: 'Isabella Rodríguez',
      avatar: null,
      pendingAmount: 600,
      classes: ['Salsa'],
      dueDate: '2024-02-10',
      isOverdue: false
    },
    {
      id: 5,
      name: 'Sofía Martín',
      avatar: null,
      pendingAmount: 920,
      baseAmount: 800,
      lateFee: 120,
      classes: ['Jazz'],
      dueDate: '2024-01-10',
      isOverdue: true
    }
  ];

  const filteredStudents = studentsWithPendingPayments.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuickPayment = async (student) => {
    setProcessing(true);
    
    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showSuccess(
        `Pago de $${student.pendingAmount.toLocaleString()} procesado para ${student.name}`
      );
      
      // En una implementación real, aquí se actualizaría el estado
      // y se removería el estudiante de la lista
      
    } catch (error) {
      showError('Error al procesar el pago');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BoltIcon className="h-8 w-8 text-primary-600 mr-3" />
            Pago Rápido
          </h1>
          <p className="text-gray-600">Procesa pagos pendientes con un solo click</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate('/payments')}
        >
          Ver Todos los Pagos
        </Button>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar estudiante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Students with Pending Payments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar src={student.avatar} name={student.name} size="md" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-600">
                    Vence: {new Date(student.dueDate).toLocaleDateString('es-CL')}
                  </p>
                </div>
              </div>
              {student.isOverdue && (
                <Badge variant="danger" size="sm">Vencido</Badge>
              )}
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Clases</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {student.classes.map((cls, index) => (
                    <Badge key={index} variant="primary" size="sm">{cls}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Monto a Pagar</p>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-gray-900">
                    ${student.pendingAmount.toLocaleString()}
                  </span>
                  {student.lateFee && (
                    <div className="text-sm text-red-600 mt-1">
                      Incluye ${student.lateFee} de recargo por mora
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => handleQuickPayment(student)}
                loading={processing}
                disabled={processing}
                icon={BoltIcon}
              >
                Pago Rápido
              </Button>
              
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => navigate(`/payments/new?student=${student.id}`)}
                disabled={processing}
              >
                Pago Detallado
              </Button>
            </div>

            {student.isOverdue && (
              <div className="mt-3 p-2 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  <strong>Pago vencido:</strong> Se aplicará recargo del 15%
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card className="p-12 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <BoltIcon />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm ? 'No se encontraron estudiantes' : 'No hay pagos pendientes'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? 'Intenta con otro término de búsqueda'
              : '¡Excelente! Todos los estudiantes están al día con sus pagos.'
            }
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Button onClick={() => navigate('/payments')}>
                Ver Historial de Pagos
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Summary */}
      {filteredStudents.length > 0 && (
        <Card className="p-6 bg-primary-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary-900">Resumen</h3>
              <p className="text-sm text-primary-700">
                {filteredStudents.length} estudiante{filteredStudents.length > 1 ? 's' : ''} con pagos pendientes
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-900">
                ${filteredStudents.reduce((sum, student) => sum + student.pendingAmount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-primary-700">Total pendiente</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default QuickPayment;
