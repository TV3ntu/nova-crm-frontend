import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PencilIcon, StarIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { teachersAPI } from '../services/api';

const TeacherDetail = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTeacher();
  }, [id]);

  const loadTeacher = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await teachersAPI.getById(id);
      const teacherData = response.data;
      
      // Transform API data to match component expectations
      setTeacher({
        id: teacherData.id,
        name: teacherData.name,
        email: teacherData.email,
        phone: teacherData.phone,
        avatar: teacherData.avatar || null,
        isOwner: teacherData.isOwner || false,
        specialties: teacherData.specialties || [],
        assignedClasses: teacherData.assignedClasses || [],
        monthlyCompensation: teacherData.monthlyCompensation || 0,
        compensationRate: teacherData.isOwner ? 100 : 50,
        revenueHistory: teacherData.revenueHistory || [
          { month: 'Ene', amount: 420000 },
          { month: 'Feb', amount: 435000 },
          { month: 'Mar', amount: 440000 },
          { month: 'Abr', amount: 445000 },
          { month: 'May', amount: 450000 },
          { month: 'Jun', amount: 450000 }
        ],
        students: teacherData.students || []
      });
    } catch (error) {
      console.error('Error loading teacher:', error);
      setError('Error al cargar los datos de la profesora');
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
        <Button onClick={loadTeacher}>Reintentar</Button>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Profesora no encontrada</p>
        <Link to="/teachers">
          <Button className="mt-4">Volver a Profesoras</Button>
        </Link>
      </div>
    );
  }

  const totalRevenue = teacher.assignedClasses.reduce((sum, cls) => sum + cls.revenue, 0);
  const totalStudents = teacher.assignedClasses.reduce((sum, cls) => sum + cls.students, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <Avatar src={teacher.avatar} name={teacher.name} size="xl" />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">{teacher.name}</h1>
              {teacher.isOwner && (
                <StarIcon className="h-6 w-6 text-yellow-500 fill-current" />
              )}
            </div>
            <p className="text-gray-600">{teacher.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant={teacher.isOwner ? 'success' : 'info'}>
                {teacher.isOwner ? 'Dueña del Estudio' : 'Profesora'}
              </Badge>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-600">ID: {teacher.id}</span>
            </div>
          </div>
        </div>
        
        <Button as={Link} to={`/teachers/${teacher.id}/edit`} variant="secondary" icon={PencilIcon}>
          Editar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Personal */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Teléfono</p>
                <p className="text-sm text-gray-900 mt-1">{teacher.phone}</p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Especialidades</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {teacher.specialties.map((specialty, index) => (
                    <Badge key={index} variant="primary" size="sm">{specialty}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Resumen de Compensación */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Compensación</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tasa de Compensación</span>
                <Badge variant={teacher.isOwner ? 'success' : 'info'}>
                  {teacher.compensationRate}%
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ingresos Generados</span>
                <span className="text-sm font-semibold text-gray-900">${totalRevenue.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-sm text-gray-600">Compensación Mensual</span>
                <span className="text-lg font-bold text-primary-600">
                  ${teacher.monthlyCompensation.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Estadísticas */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Estudiantes</span>
                <span className="text-sm font-semibold text-gray-900">{totalStudents}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Clases Asignadas</span>
                <span className="text-sm font-semibold text-gray-900">{teacher.assignedClasses.length}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Clases y Gráficos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Clases Asignadas */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Clases Asignadas</h2>
              <Button variant="ghost" size="sm" icon={CalendarDaysIcon}>
                Ver Horarios
              </Button>
            </div>
            
            <div className="space-y-4">
              {teacher.assignedClasses.map((cls) => (
                <div key={cls.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{cls.name}</h3>
                      <p className="text-sm text-gray-500">{cls.schedule}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${cls.revenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">ingresos/mes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${(cls.students / cls.maxStudents) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{cls.students}/{cls.maxStudents}</span>
                    </div>
                    <Badge variant="primary" size="sm">${cls.monthlyFee}/mes</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Gráfico de Compensación */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Historial de Compensación</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teacher.revenueHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Compensación']} />
                <Bar dataKey="amount" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Estudiantes */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Estudiantes en sus Clases</h2>
              <Button as={Link} to="/students" variant="ghost" size="sm">
                Ver Todos
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teacher.students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar name={student.name} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.class}</p>
                    </div>
                  </div>
                  <Button as={Link} to={`/students/${student.id}`} variant="ghost" size="sm">
                    Ver
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetail;
