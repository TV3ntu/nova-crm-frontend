import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  CurrencyDollarIcon, 
  CalendarDaysIcon,
  UserIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { paymentsAPI } from '../services/api';

const PaymentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPaymentDetail();
  }, [id]);

  const loadPaymentDetail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await paymentsAPI.getById(id);
      setPayment(response.data);
    } catch (error) {
      console.error('Error loading payment detail:', error);
      setError('Error al cargar los detalles del pago');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar pago</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadPaymentDetail} variant="primary">
          Reintentar
        </Button>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="text-center py-12">
        <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Pago no encontrado</h3>
        <p className="text-gray-600 mb-4">El pago solicitado no existe o ha sido eliminado.</p>
        <Link to="/payments">
          <Button variant="primary">Volver a Pagos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            icon={ArrowLeftIcon}
            onClick={() => navigate('/payments')}
          >
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detalle de Pago #{payment.id}
            </h1>
            <p className="text-gray-600">
              Información completa del pago
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Status elements removed - payments don't have status */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Payment Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Summary */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Resumen del Pago
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Monto Total
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {formatCurrency(payment.amount)}
                </p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Fecha de Pago
                </p>
                <p className="text-lg text-gray-900 mt-1">
                  {formatDate(payment.paymentDate)}
                </p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Mes de Pago
                </p>
                <p className="text-lg text-gray-900 mt-1">
                  {payment.paymentMonth || 'No especificado'}
                </p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Método de Pago
                </p>
                <p className="text-lg text-gray-900 mt-1">
                  {payment.paymentMethod || 'No especificado'}
                </p>
              </div>
            </div>
            
            {payment.notes && (
              <div className="mt-6">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Notas
                </p>
                <p className="text-gray-900 mt-1">
                  {payment.notes}
                </p>
              </div>
            )}
          </Card>

          {/* Student Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Información del Estudiante
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Nombre Completo
                </p>
                <p className="text-lg text-gray-900 mt-1">
                  {payment.studentName || 'No especificado'}
                </p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  ID del Estudiante
                </p>
                <p className="text-lg text-gray-900 mt-1">
                  #{payment.studentId}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <Link 
                to={`/students/${payment.studentId}`}
                className="inline-flex items-center text-primary-600 hover:text-primary-700"
              >
                Ver perfil del estudiante →
              </Link>
            </div>
          </Card>

          {/* Class Information */}
          {payment.className && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AcademicCapIcon className="h-5 w-5 mr-2" />
                Información de la Clase
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Nombre de la Clase
                  </p>
                  <p className="text-lg text-gray-900 mt-1">
                    {payment.className}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    ID de la Clase
                  </p>
                  <p className="text-lg text-gray-900 mt-1">
                    #{payment.classId}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <Link 
                  to={`/classes/${payment.classId}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700"
                >
                  Ver detalles de la clase →
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Estado del Pago
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Método de Pago:</span>
                <span className="font-medium">{payment.paymentMethod || 'No especificado'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Notas:</span>
                <span className="font-medium text-right max-w-xs">
                  {payment.notes || 'Sin notas adicionales'}
                </span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Acciones
            </h3>
            
            <div className="space-y-3">
              <Link to={`/students/${payment.studentId}`}>
                <Button variant="secondary" className="w-full">
                  Ver Estudiante
                </Button>
              </Link>
              
              {payment.classId && (
                <Link to={`/classes/${payment.classId}`}>
                  <Button variant="secondary" className="w-full">
                    Ver Clase
                  </Button>
                </Link>
              )}
              
              <Link to="/payments">
                <Button variant="primary" className="w-full">
                  Volver a Pagos
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetail;
