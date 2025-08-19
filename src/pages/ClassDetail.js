import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PencilIcon, UserPlusIcon, UserMinusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import TeacherAssignmentModal from '../components/modals/TeacherAssignmentModal';
import StudentEnrollmentModal from '../components/modals/StudentEnrollmentModal';
import { classesAPI, teachersAPI, studentsAPI } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignedTeachers, setAssignedTeachers] = useState([]);
  const [showTeacherAssignmentModal, setShowTeacherAssignmentModal] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [showStudentEnrollmentModal, setShowStudentEnrollmentModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadClass();
  }, [id]);

  useEffect(() => {
    if (classData?.teacherIds?.length >= 0) {
      loadAssignedTeachers();
    }
  }, [classData?.teacherIds]);

  useEffect(() => {
    if (classData) {
      loadEnrolledStudents();
    }
  }, [classData]);

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
        price: apiClassData.price,
        durationHours: apiClassData.durationHours,
        schedules: apiClassData.schedules || [],
        teacherIds: apiClassData.teacherIds || [],
        studentIds: apiClassData.studentIds || [],
        status: apiClassData.status || 'active',
        enrolledStudents: apiClassData.enrolledStudents || [],
        monthlyRevenue: apiClassData.monthlyRevenue || 0,
      });
    } catch (error) {
      console.error('Error loading class:', error);
      setError('Error al cargar los datos de la clase');
    } finally {
      setLoading(false);
    }
  };

  const loadAssignedTeachers = async () => {
    try {
      // Get teacher details for each teacherId from the class
      if (classData?.teacherIds?.length > 0) {
        const teacherPromises = classData.teacherIds.map(teacherId => 
          teachersAPI.getById(teacherId)
        );
        const teacherResponses = await Promise.all(teacherPromises);
        const teachers = teacherResponses.map(response => response.data);
        setAssignedTeachers(teachers);
      } else {
        setAssignedTeachers([]);
      }
    } catch (error) {
      console.error('Error loading assigned teachers:', error);
      setAssignedTeachers([]);
    }
  };

  const loadEnrolledStudents = async () => {
    try {
      // Use the dedicated endpoint to get enrolled students for this class
      const response = await classesAPI.getEnrolledStudents(id);
      const students = response.data;
      setEnrolledStudents(students);
    } catch (error) {
      console.error('Error loading enrolled students:', error);
      // Handle the specific error format mentioned by the user
      if (error.response?.status === 404) {
        console.warn('Class not found:', error.response.data?.message);
        setEnrolledStudents([]);
      } else {
        setEnrolledStudents([]);
      }
    }
  };

  const handleAssignTeacher = async (teacher) => {
    try {
      await classesAPI.assignTeacher(id, teacher.id);
      await loadClass(); // Reload class to get updated teacherIds
      await loadAssignedTeachers(); // Reload assigned teachers
      showSuccess('Profesora asignada exitosamente');
    } catch (error) {
      console.error('Error assigning teacher:', error);
      showError('Error al asignar profesora');
      throw error;
    }
  };

  const handleUnassignTeacher = async (teacherId) => {
    try {
      await classesAPI.unassignTeacher(id, teacherId);
      await loadClass(); // Reload class to get updated teacherIds
      await loadAssignedTeachers(); // Reload assigned teachers
      showSuccess('Profesora desasignada exitosamente');
    } catch (error) {
      console.error('Error unassigning teacher:', error);
      showError('Error al desasignar profesora');
    }
  };

  const handleEnrollStudent = async (student) => {
    try {
      await studentsAPI.enrollStudent(student.id, id);
      await loadClass(); // Reload class to get updated studentIds
      await loadEnrolledStudents(); // Reload enrolled students
      showSuccess('Estudiante inscrito exitosamente');
    } catch (error) {
      console.error('Error enrolling student:', error);
      showError('Error al inscribir estudiante');
      throw error;
    }
  };

  const handleUnenrollStudent = async (studentId) => {
    try {
      await studentsAPI.unenrollStudent(studentId, id);
      await loadClass(); // Reload class to get updated studentIds
      await loadEnrolledStudents(); // Reload enrolled students
      showSuccess('Estudiante desinscrito exitosamente');
    } catch (error) {
      console.error('Error unenrolling student:', error);
      showError('Error al desinscribir estudiante');
    }
  };

  const handleDeleteClass = async () => {
    setDeleting(true);
    try {
      await classesAPI.delete(id);
      showSuccess('Clase eliminada exitosamente');
      navigate('/classes');
    } catch (error) {
      console.error('Error deleting class:', error);
      showError('Error al eliminar clase');
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'overdue':
        return <Badge variant="danger">Atrasado</Badge>;
      case 'pending':
        return <Badge variant="warning">Pendiente</Badge>;
      case 'paid':
        return <Badge variant="success">Pagado</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const formatDayOfWeek = (dayOfWeek) => {
    const dayMap = {
      'MONDAY': 'Lunes',
      'TUESDAY': 'Martes',
      'WEDNESDAY': 'Miércoles',
      'THURSDAY': 'Jueves',
      'FRIDAY': 'Viernes',
      'SATURDAY': 'Sábado',
      'SUNDAY': 'Domingo'
    };
    return dayMap[dayOfWeek] || dayOfWeek;
  };

  const formatTime = (hour, minute) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const calculateEndTime = (startHour, startMinute, durationHours) => {
    const totalStartMinutes = startHour * 60 + startMinute;
    const totalEndMinutes = totalStartMinutes + (durationHours * 60);
    const endHour = Math.floor(totalEndMinutes / 60);
    const endMinute = totalEndMinutes % 60;
    return formatTime(endHour, endMinute);
  };

  const getCapacityPercentage = () => {
    if (!classData) return 0;
    return (classData.enrolledStudents.length / 20) * 100;
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
          <Button variant="secondary" icon={UserPlusIcon} onClick={() => setShowStudentEnrollmentModal(true)}>
            Inscribir Estudiante
          </Button>
          <Button as={Link} to={`/classes/${classData.id}/edit`} variant="secondary" icon={PencilIcon}>
            Editar
          </Button>
          <Button variant="secondary" icon={UserPlusIcon} onClick={() => setShowTeacherAssignmentModal(true)}>
            Asignar Profesora
          </Button>
          <Button variant="danger" icon={TrashIcon} onClick={() => setShowDeleteDialog(true)}>
            Eliminar
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
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Profesoras</p>
                <div className="mt-1">
                  {assignedTeachers.length > 0 ? (
                    <div className="space-y-2">
                      {assignedTeachers.map((teacher) => (
                        <div key={teacher.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Avatar 
                              src={teacher.avatar} 
                              name={teacher.fullName || `${teacher.firstName} ${teacher.lastName}`} 
                              size="sm" 
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-900">
                                {teacher.fullName || `${teacher.firstName} ${teacher.lastName}`}
                              </span>
                              {teacher.isStudioOwner && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Propietaria
                                </span>
                              )}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={UserMinusIcon} 
                            className="text-red-600 hover:text-red-700" 
                            onClick={() => handleUnassignTeacher(teacher.id)}
                          >
                            Quitar
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Sin profesoras asignadas</p>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Horarios</p>
                <ul className="list-none mt-1">
                  {classData.schedules.map((schedule, index) => (
                    <li key={index} className="text-sm text-gray-900">
                      {formatDayOfWeek(schedule.dayOfWeek)} {formatTime(schedule.startHour, schedule.startMinute)} - {calculateEndTime(schedule.startHour, schedule.startMinute, classData.durationHours)}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500">({classData.durationHours} horas)</p>
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
                  {classData.enrolledStudents.length}/20
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
                <span>20</span>
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
                <Button variant="secondary" size="sm" icon={UserPlusIcon} onClick={() => setShowStudentEnrollmentModal(true)}>
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
                  {enrolledStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar 
                            src={student.avatar} 
                            name={student.fullName || `${student.firstName} ${student.lastName}`} 
                            size="sm" 
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {student.fullName || `${student.firstName} ${student.lastName}`}
                            </div>
                            <div className="text-sm text-gray-500">{student.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="text-gray-400 italic">No disponible</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="secondary">Pendiente</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Button as={Link} to={`/students/${student.id}`} variant="ghost" size="sm">
                          Ver
                        </Button>
                        <Button variant="ghost" size="sm" icon={UserMinusIcon} className="text-red-600 hover:text-red-700" onClick={() => handleUnenrollStudent(student.id)}>
                          Desinscribir
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {enrolledStudents.length === 0 && (
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
                  <Button icon={UserPlusIcon} onClick={() => setShowStudentEnrollmentModal(true)}>
                    Inscribir Primer Estudiante
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      <TeacherAssignmentModal
        isOpen={showTeacherAssignmentModal}
        onClose={() => setShowTeacherAssignmentModal(false)}
        onAssign={handleAssignTeacher}
        assignedTeacherIds={classData?.teacherIds || []}
      />
      <StudentEnrollmentModal
        isOpen={showStudentEnrollmentModal}
        onClose={() => setShowStudentEnrollmentModal(false)}
        onEnroll={handleEnrollStudent}
        enrolledStudentIds={classData?.studentIds || []}
      />
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteClass}
        title="Eliminar Clase"
        message={`¿Estás seguro de que quieres eliminar la clase "${classData.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default ClassDetail;
