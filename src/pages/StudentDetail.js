import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PencilIcon, CreditCardIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { studentsAPI } from '../services/api';

const StudentDetail = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await studentsAPI.getById(id);
      const studentData = response.data;
      
      // Transform API data to match component expectations
      setStudent({
        id: studentData.id,
        name: studentData.name,
        email: studentData.email,
        phone: studentData.phone,
        birthDate: studentData.birthDate,
        address: studentData.address,
        emergencyContact: studentData.emergencyContact,
        emergencyPhone: studentData.emergencyPhone,
        avatar: studentData.avatar || null,
        status: studentData.status || 'active',
        enrolledClasses: studentData.enrolledClasses || [],
        paymentHistory: studentData.paymentHistory || [],
        upcomingPayments: studentData.upcomingPayments || []
      });
    } catch (error) {
      console.error('Error loading student:', error);
      setError('Error al cargar los datos del estudiante');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadStudent}>Reintentar</Button>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Estudiante no encontrado</p>
        <Link to="/students">
          <Button className="mt-4">Volver a Estudiantes</Button>
        </Link>
      </div>
    );
  }

  const totalMonthlyFee = student.enrolledClasses.reduce((sum, cls) => sum + cls.monthlyFee, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <Avatar src={student.avatar} name={student.name} size="xl" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-gray-600">{student.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant={student.status === 'active' ? 'success' : 'gray'}>
                {student.status === 'active' ? 'Activo' : 'Inactivo'}
              </Badge>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-600">ID: {student.id}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button as={Link} to={`/payments/new?student=${student.id}`} icon={CreditCardIcon}>
            Procesar Pago
          </Button>
          <Button as={Link} to={`/students/${student.id}/edit`} variant="secondary" icon={PencilIcon}>
            Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Personal */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Teléfono</p>
                <p className="text-sm text-gray-900 mt-1">{student.phone}</p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fecha de Nacimiento</p>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(student.birthDate).toLocaleDateString('es-CL')}
                </p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Dirección</p>
                <p className="text-sm text-gray-900 mt-1">{student.address}</p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Contacto de Emergencia</p>
                <p className="text-sm text-gray-900 mt-1">{student.emergencyContact}</p>
                <p className="text-sm text-gray-600">{student.emergencyPhone}</p>
              </div>
            </div>
          </Card>

          {/* Resumen de Pagos */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Pagos</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cuota Mensual</span>
                <span className="text-sm font-semibold text-gray-900">${totalMonthlyFee.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Próximo Pago</span>
                <span className="text-sm font-semibold text-gray-900">
                  {student.upcomingPayments[0]?.dueDate ? 
                    new Date(student.upcomingPayments[0].dueDate).toLocaleDateString('es-CL') : 
                    'N/A'
                  }
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-sm text-gray-600">Estado</span>
                <Badge variant="success">Al día</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Clases y Historial */}
        <div className="lg:col-span-2 space-y-6">
          {/* Clases Inscritas */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Clases Inscritas</h2>
              <Button variant="ghost" size="sm" icon={CalendarDaysIcon}>
                Ver Horarios
              </Button>
            </div>
            
            <div className="space-y-4">
              {student.enrolledClasses.map((cls) => (
                <div key={cls.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{cls.name}</h3>
                      <p className="text-sm text-gray-600">{cls.teacher}</p>
                      <p className="text-sm text-gray-500 mt-1">{cls.schedule}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${cls.monthlyFee.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">por mes</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Historial de Pagos */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Historial de Pagos</h2>
              <Button as={Link} to="/payments" variant="ghost" size="sm">
                Ver Todos
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clases
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Método
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {student.paymentHistory.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.date).toLocaleDateString('es-CL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {payment.classes.join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {payment.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="success">Completado</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
