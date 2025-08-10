import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon, CreditCardIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';

const OutstandingPayments = () => {
  const [loading, setLoading] = useState(true);
  const [outstandingPayments, setOutstandingPayments] = useState([]);

  useEffect(() => {
    const loadOutstandingPayments = async () => {
      setLoading(true);
      
      setTimeout(() => {
        setOutstandingPayments([
          {
            id: 1,
            student: {
              id: 2,
              name: 'Ana López',
              email: 'ana.lopez@email.com',
              phone: '+56 9 8765 4321',
              avatar: null
            },
            classes: ['Hip Hop'],
            baseAmount: 800,
            lateFee: 120,
            totalAmount: 920,
            dueDate: '2024-01-10',
            daysOverdue: 15,
            lastReminder: '2024-01-20'
          },
          {
            id: 2,
            student: {
              id: 5,
              name: 'Sofía Martín',
              email: 'sofia.martin@email.com',
              phone: '+56 9 5555 7777',
              avatar: null
            },
            classes: ['Jazz'],
            baseAmount: 700,
            lateFee: 105,
            totalAmount: 805,
            dueDate: '2024-01-10',
            daysOverdue: 15,
            lastReminder: null
          },
          {
            id: 3,
            student: {
              id: 7,
              name: 'Valentina Torres',
              email: 'valentina.torres@email.com',
              phone: '+56 9 9999 1111',
              avatar: null
            },
            classes: ['Ballet Clásico', 'Contemporáneo'],
            baseAmount: 1600,
            lateFee: 240,
            totalAmount: 1840,
            dueDate: '2024-01-05',
            daysOverdue: 20,
            lastReminder: '2024-01-18'
          },
          {
            id: 4,
            student: {
              id: 8,
              name: 'Camila Herrera',
              email: 'camila.herrera@email.com',
              phone: '+56 9 3333 8888',
              avatar: null
            },
            classes: ['Salsa'],
            baseAmount: 600,
            lateFee: 90,
            totalAmount: 690,
            dueDate: '2024-01-12',
            daysOverdue: 13,
            lastReminder: null
          }
        ]);
        setLoading(false);
      }, 1000);
    };

    loadOutstandingPayments();
  }, []);

  const totalOutstanding = outstandingPayments.reduce((sum, payment) => sum + payment.totalAmount, 0);
  const totalLateFees = outstandingPayments.reduce((sum, payment) => sum + payment.lateFee, 0);

  const getSeverityBadge = (daysOverdue) => {
    if (daysOverdue >= 20) return <Badge variant="danger">Crítico</Badge>;
    if (daysOverdue >= 10) return <Badge variant="warning">Urgente</Badge>;
    return <Badge variant="info">Reciente</Badge>;
  };

  const handleSendReminder = async (studentId) => {
    // Simular envío de recordatorio
    console.log(`Enviando recordatorio a estudiante ${studentId}`);
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Pagos Pendientes</h1>
          <p className="text-gray-600">Estudiantes con pagos vencidos y por vencer</p>
        </div>
        <Button as={Link} to="/reports" variant="secondary">
          Volver a Reportes
        </Button>
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
              <p className="text-2xl font-bold text-gray-900">${totalOutstanding.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CreditCardIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recargos por Mora</p>
              <p className="text-2xl font-bold text-gray-900">${totalLateFees.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <EnvelopeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Estudiantes Afectados</p>
              <p className="text-2xl font-bold text-gray-900">{outstandingPayments.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Outstanding Payments List */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Lista de Pagos Vencidos</h2>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm">
              Enviar Recordatorios Masivos
            </Button>
            <Button variant="secondary" size="sm">
              Exportar Lista
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {outstandingPayments.map((payment) => (
            <div key={payment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar src={payment.student.avatar} name={payment.student.name} size="md" />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{payment.student.name}</h3>
                      {getSeverityBadge(payment.daysOverdue)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><strong>Email:</strong> {payment.student.email}</p>
                        <p><strong>Teléfono:</strong> {payment.student.phone}</p>
                      </div>
                      <div>
                        <p><strong>Fecha Vencimiento:</strong> {new Date(payment.dueDate).toLocaleDateString('es-CL')}</p>
                        <p><strong>Días de Retraso:</strong> {payment.daysOverdue} días</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2"><strong>Clases:</strong></p>
                      <div className="flex flex-wrap gap-1">
                        {payment.classes.map((cls, index) => (
                          <Badge key={index} variant="primary" size="sm">{cls}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-red-600">${payment.totalAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">
                      Base: ${payment.baseAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-red-600">
                      Recargo: +${payment.lateFee.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      as={Link} 
                      to={`/payments/new?student=${payment.student.id}`}
                      size="sm" 
                      className="w-full"
                    >
                      Procesar Pago
                    </Button>
                    
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleSendReminder(payment.student.id)}
                    >
                      Enviar Recordatorio
                    </Button>
                    
                    <Button 
                      as={Link}
                      to={`/students/${payment.student.id}`}
                      variant="ghost" 
                      size="sm" 
                      className="w-full"
                    >
                      Ver Estudiante
                    </Button>
                  </div>
                </div>
              </div>
              
              {payment.lastReminder && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Último recordatorio enviado: {new Date(payment.lastReminder).toLocaleDateString('es-CL')}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {outstandingPayments.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <ExclamationTriangleIcon />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pagos pendientes</h3>
            <p className="mt-1 text-sm text-gray-500">
              ¡Excelente! Todos los estudiantes están al día con sus pagos.
            </p>
            <div className="mt-6">
              <Button as={Link} to="/payments">
                Ver Historial de Pagos
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Action Summary */}
      {outstandingPayments.length > 0 && (
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">Acciones Recomendadas</h3>
              <ul className="mt-2 text-sm text-red-800 space-y-1">
                <li>• Contactar a los estudiantes con más de 15 días de retraso</li>
                <li>• Enviar recordatorios por email y WhatsApp</li>
                <li>• Considerar planes de pago para montos altos</li>
                <li>• Revisar políticas de mora si es necesario</li>
              </ul>
              <div className="mt-4 flex space-x-3">
                <Button size="sm">
                  Enviar Recordatorios Masivos
                </Button>
                <Button variant="secondary" size="sm">
                  Generar Reporte PDF
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default OutstandingPayments;
