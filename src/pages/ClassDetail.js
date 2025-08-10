import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PencilIcon, UserPlusIcon, UserMinusIcon } from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { classesAPI } from '../services/api';

const ClassDetail = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClass();
  }, [id]);

  const loadClass = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await classesAPI.getById(id);
      const apiClassData = response.data;
      
      // Transform API data to match component expectations
      setClassData({
        id: apiClassData.id,
        name: apiClassData.name,
        description: apiClassData.description,
        teacher: {
          id: apiClassData.teacherId,
          name: apiClassData.teacherName || 'Sin asignar',
          avatar: apiClassData.teacherAvatar || null
        },
        schedule: {
          day: apiClassData.day,
          startTime: apiClassData.startTime,
          endTime: apiClassData.endTime || calculateEndTime(apiClassData.startTime, apiClassData.duration),
          duration: apiClassData.duration || 90
        },
        price: apiClassData.price,
        maxStudents: apiClassData.maxStudents || 20,
        currentStudents: apiClassData.enrolledStudents?.length || 0,
        status: apiClassData.status || 'active',
        enrolledStudents: apiClassData.enrolledStudents || [],
        monthlyRevenue: apiClassData.monthlyRevenue || 0,
        attendanceRate: apiClassData.attendanceRate || 0,
        statistics: apiClassData.statistics || {
          totalRevenue: 0,
          averageAttendance: 0,
          retentionRate: 0
        }
      });
    } catch (error) {
      console.error('Error loading class:', error);
      setError('Error al cargar los datos de la clase');
    } finally {
      setLoading(false);
    }
  };

  const calculateEndTime = (startTime, duration) => {
    if (!startTime || !duration) return '';
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + parseInt(duration);
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'overdue':
        return <Badge variant="danger" size="sm">Mora</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm">Pendiente</Badge>;
      default:
        return <Badge variant="success" size="sm">Al día</Badge>;
    }
  };

  const getCapacityPercentage = () => {
    if (!classData) return 0;
    return (classData.currentStudents / classData.maxStudents) * 100;
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
        <Button onClick={loadClass}>Reintentar</Button>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Clase no encontrada</p>
        <Link to="/classes">
          <Button className="mt-4">Volver a Clases</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{classData.name}</h1>
          <p className="text-gray-600 mt-1">{classData.description}</p>
          <div className="flex items-center space-x-4 mt-3">
            <Badge variant={classData.status === 'active' ? 'success' : 'gray'}>
              {classData.status === 'active' ? 'Activa' : 'Inactiva'}
            </Badge>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-600">ID: {classData.id}</span>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="secondary" icon={UserPlusIcon}>
            Inscribir Estudiante
          </Button>
          <Button as={Link} to={`/classes/${classData.id}/edit`} variant="secondary" icon={PencilIcon}>
            Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información de la Clase */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de la Clase</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Profesora</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Avatar src={classData.teacher.avatar} name={classData.teacher.name} size="sm" />
                  <span className="text-sm text-gray-900">{classData.teacher.name}</span>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Horario</p>
                <p className="text-sm text-gray-900 mt-1">
                  {classData.schedule.day} {classData.schedule.startTime} - {classData.schedule.endTime}
                </p>
                <p className="text-xs text-gray-500">({classData.schedule.duration} minutos)</p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Precio Mensual</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">${classData.price.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          {/* Capacidad */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Capacidad</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estudiantes Inscritos</span>
                <span className="text-sm font-semibold text-gray-900">
                  {classData.currentStudents}/{classData.maxStudents}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    getCapacityPercentage() >= 100 
                      ? 'bg-red-500' 
                      : getCapacityPercentage() >= 80 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(getCapacityPercentage(), 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>0</span>
                <span>{Math.round(getCapacityPercentage())}% ocupado</span>
                <span>{classData.maxStudents}</span>
              </div>
            </div>
          </Card>

          {/* Estadísticas */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ingresos Mensuales</span>
                <span className="text-sm font-semibold text-gray-900">
                  ${classData.monthlyRevenue.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Asistencia Promedio</span>
                <span className="text-sm font-semibold text-gray-900">{classData.attendanceRate}%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Retención</span>
                <span className="text-sm font-semibold text-gray-900">{classData.statistics.retentionRate}%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Estudiantes Inscritos */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Estudiantes Inscritos</h2>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  Exportar Lista
                </Button>
                <Button variant="secondary" size="sm" icon={UserPlusIcon}>
                  Inscribir Estudiante
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estudiante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Inscripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado de Pago
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {classData.enrolledStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar src={student.avatar} name={student.name} size="sm" />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(student.enrollmentDate).toLocaleDateString('es-CL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentStatusBadge(student.paymentStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button as={Link} to={`/students/${student.id}`} variant="ghost" size="sm">
                          Ver
                        </Button>
                        <Button variant="ghost" size="sm" icon={UserMinusIcon} className="text-red-600 hover:text-red-700">
                          Desinscribir
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {classData.enrolledStudents.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay estudiantes inscritos</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comienza inscribiendo estudiantes en esta clase.
                </p>
                <div className="mt-6">
                  <Button icon={UserPlusIcon}>
                    Inscribir Primer Estudiante
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;
