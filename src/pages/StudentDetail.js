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
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStudentData();
  }, [id]);

  const loadStudentData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load student basic data
      const studentResponse = await studentsAPI.getById(id);
      const studentData = studentResponse.data;
      
      // Load student enrollments with dates
      const enrollmentsResponse = await studentsAPI.getStudentEnrollments(id);
      const enrollmentsData = enrollmentsResponse.data;
      
      // Transform API data to match component expectations
      setStudent({
        id: studentData.id,
        name: studentData.fullName || `${studentData.firstName} ${studentData.lastName}`,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        fullName: studentData.fullName,
        email: studentData.email,
        phone: studentData.phone,
        birthDate: studentData.birthDate,
        address: studentData.address,
        avatar: studentData.avatar || null,
        status: 'active', // Default status
        classIds: studentData.classIds || []
      });

      // Set enrollments data
      setEnrollments(enrollmentsData.enrollments || []);
      
    } catch (error) {
      console.error('Error loading student data:', error);
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
        <Button onClick={loadStudentData}>Reintentar</Button>
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

  const totalMonthlyFee = 0; // TODO: Calculate from class prices when available

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <Avatar src={student.avatar} name={student.name} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-gray-600">{student.phone}</span>
              {student.email && <span className="text-gray-600">{student.email}</span>}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button as={Link} to={`/students/${student.id}/edit`} variant="secondary" icon={PencilIcon}>
            Editar
          </Button>
          <Button variant="primary" icon={CreditCardIcon}>
            Registrar Pago
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Personal */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fecha de Nacimiento</p>
                <p className="text-sm text-gray-900 mt-1">
                  {student.birthDate ? new Date(student.birthDate).toLocaleDateString('es-CL') : 'No especificada'}
                </p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Dirección</p>
                <p className="text-sm text-gray-900 mt-1">{student.address || 'No especificada'}</p>
              </div>
            </div>
          </Card>

          {/* Resumen Financiero */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen Financiero</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cuota Mensual</span>
                <span className="text-sm font-semibold text-gray-900">
                  {totalMonthlyFee > 0 ? `$${totalMonthlyFee.toLocaleString()}` : 'Por calcular'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Próximo Pago</span>
                <span className="text-sm font-semibold text-gray-900">Por definir</span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-sm text-gray-600">Estado</span>
                <Badge variant="success">Al día</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Clases Inscritas */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Clases Inscritas</h2>
              <Button variant="ghost" size="sm" icon={CalendarDaysIcon}>
                Ver Horarios
              </Button>
            </div>
            
            <div className="space-y-4">
              {enrollments.length > 0 ? (
                enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{enrollment.className}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Fecha de Inscripción: {new Date(enrollment.enrollmentDate).toLocaleDateString('es-CL')}
                        </p>
                        {enrollment.notes && (
                          <p className="text-sm text-gray-600 mt-1">{enrollment.notes}</p>
                        )}
                        <div className="flex items-center mt-2">
                          <Badge variant={enrollment.isActive ? "success" : "secondary"}>
                            {enrollment.isActive ? "Activa" : "Inactiva"}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <Button as={Link} to={`/classes/${enrollment.classId}`} variant="ghost" size="sm">
                          Ver Clase
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>No hay clases inscritas</p>
                  <Button as={Link} to="/classes" variant="secondary" size="sm" className="mt-2">
                    Ver Clases Disponibles
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
