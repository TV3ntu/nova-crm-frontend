import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  CurrencyDollarIcon, 
  UserIcon,
  AcademicCapIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { paymentsAPI } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

const PaymentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadPaymentDetail();
  }, [id]);

  const loadPaymentDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await paymentsAPI.getById(id);
      console.log('Payment detail response:', response);
      
      if (response && response.data) {
        setPayment(response.data);
      } else {
        setError('No se encontraron datos del pago');
      }
    } catch (error) {
      console.error('Error loading payment detail:', error);
      setError(error.response?.data?.message || 'Error al cargar el detalle del pago');
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

  const handleDeletePayment = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este pago? Esta acción no se puede deshacer.')) {
      try {
        await paymentsAPI.delete(id);
        showSuccess('Pago eliminado exitosamente');
        navigate('/payments');
      } catch (error) {
        console.error('Error deleting payment:', error);
        showError('Error al eliminar el pago. Por favor, intente nuevamente.');
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
        <Button
          variant="danger"
          icon={TrashIcon}
          onClick={handleDeletePayment}
        >
          Eliminar Pago
        </Button>
      </div>

      {/* Main Payment Info */}
      <div className="space-y-6">
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
                {payment.paymentMonth}
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
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Notas
              </p>
              <p className="text-gray-900">
                {payment.notes}
              </p>
            </div>
          )}
        </Card>

        {/* Student Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información del Estudiante
          </h3>
          
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{payment.studentName}</p>
              <p className="text-sm text-gray-600">ID: {payment.studentId}</p>
            </div>
          </div>
        </Card>

        {/* Class Information */}
        {payment.className && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información de la Clase
            </h3>
            
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <AcademicCapIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{payment.className}</p>
                <p className="text-sm text-gray-600">ID: {payment.classId}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PaymentDetail;
