import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  CalendarDaysIcon, 
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useApi } from '../hooks/useApi';
import { classesAPI } from '../services/api';

const Classes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dayFilter, setDayFilter] = useState('');

  const {
    data: classes,
    loading,
    error,
    refetch
  } = useApi(
    () => classesAPI.getAll({
      search: searchTerm,
      type: typeFilter,
      status: statusFilter,
      day: dayFilter
    }),
    [searchTerm, typeFilter, statusFilter, dayFilter]
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Activa</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelada</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completada</Badge>;
      case 'scheduled':
        return <Badge variant="warning">Programada</Badge>;
      default:
        return <Badge variant="secondary">Sin estado</Badge>;
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

  const formatSchedules = (schedules, durationHours) => {
    if (!schedules || schedules.length === 0) return 'Sin horario';
    
    if (schedules.length === 1) {
      const schedule = schedules[0];
      return `${formatDayOfWeek(schedule.dayOfWeek)} ${formatTime(schedule.startHour, schedule.startMinute)} - ${calculateEndTime(schedule.startHour, schedule.startMinute, durationHours)}`;
    }
    
    return `${schedules.length} horarios`;
  };

  const getScheduleDays = (schedules) => {
    if (!schedules || schedules.length === 0) return 'Sin programar';
    
    if (schedules.length === 1) {
      return formatDayOfWeek(schedules[0].dayOfWeek);
    }
    
    // Para múltiples horarios, mostrar todos los días
    const days = schedules.map(schedule => formatDayOfWeek(schedule.dayOfWeek));
    
    if (days.length <= 2) {
      return days.join(' y ');
    } else {
      return `${days.slice(0, 2).join(', ')} y ${days.length - 2} más`;
    }
  };

  const getCapacityBadge = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) {
      return <Badge variant="danger">Llena ({current}/{max})</Badge>;
    } else if (percentage >= 70) {
      return <Badge variant="warning">Casi llena ({current}/{max})</Badge>;
    } else {
      return <Badge variant="success">Disponible ({current}/{max})</Badge>;
    }
  };

  // Filtrar clases localmente si hay datos
  const filteredClasses = classes ? classes.filter(classItem => {
    const matchesSearch = !searchTerm || 
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.teacher?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !typeFilter || classItem.type === typeFilter;
    const matchesStatus = !statusFilter || classItem.status === statusFilter;
    const matchesDay = !dayFilter || classItem.schedules?.some(schedule => formatDayOfWeek(schedule.dayOfWeek) === dayFilter);
    
    return matchesSearch && matchesType && matchesStatus && matchesDay;
  }) : [];

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
        <CalendarDaysIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar clases</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={refetch} variant="primary">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clases</h1>
          <p className="text-gray-600">Gestión de clases y horarios</p>
        </div>
        <div className="flex space-x-3">
          <Button as={Link} to="/classes/calendar" variant="secondary" icon={CalendarDaysIcon}>
            Ver Calendario
          </Button>
          <Button as={Link} to="/classes/new" icon={PlusIcon}>
            Nueva Clase
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            placeholder="Buscar por nombre o profesor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={MagnifyingGlassIcon}
          />
          
          <Select
            placeholder="Tipo de clase"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { value: '', label: 'Todos los tipos' },
              { value: 'Ballet Clásico', label: 'Ballet Clásico' },
              { value: 'Jazz', label: 'Jazz' },
              { value: 'Hip Hop', label: 'Hip Hop' },
              { value: 'Contemporáneo', label: 'Contemporáneo' },
              { value: 'Salsa', label: 'Salsa' },
              { value: 'Bachata', label: 'Bachata' }
            ]}
          />
          
          <Select
            placeholder="Estado"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'Todos los estados' },
              { value: 'active', label: 'Activa' },
              { value: 'scheduled', label: 'Programada' },
              { value: 'cancelled', label: 'Cancelada' },
              { value: 'completed', label: 'Completada' }
            ]}
          />
          
          <Select
            placeholder="Día"
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
            options={[
              { value: '', label: 'Todos los días' },
              { value: 'Lunes', label: 'Lunes' },
              { value: 'Martes', label: 'Martes' },
              { value: 'Miércoles', label: 'Miércoles' },
              { value: 'Jueves', label: 'Jueves' },
              { value: 'Viernes', label: 'Viernes' },
              { value: 'Sábado', label: 'Sábado' },
              { value: 'Domingo', label: 'Domingo' }
            ]}
          />
          
          <Button
            variant="secondary"
            icon={FunnelIcon}
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('');
              setStatusFilter('');
              setDayFilter('');
            }}
          >
            Limpiar Filtros
          </Button>
        </div>
      </Card>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((classItem) => (
          <Card key={classItem.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{classItem.name}</h3>
                <p className="text-sm text-gray-600">{classItem.type}</p>
              </div>
              {getStatusBadge(classItem.status)}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2">
                <AcademicCapIcon className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {classItem.teacherIds && classItem.teacherIds.length > 0 
                      ? `${classItem.teacherIds.length} profesor${classItem.teacherIds.length > 1 ? 'es' : ''} asignado${classItem.teacherIds.length > 1 ? 's' : ''}`
                      : classItem.teacher?.name || 'Sin asignar'
                    }
                  </p>
                  <p className="text-xs text-gray-500">Profesor</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {getScheduleDays(classItem.schedules)}
                  </p>
                  <p className="text-xs text-gray-500">Día de la semana</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <ClockIcon className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatSchedules(classItem.schedules, classItem.durationHours)}
                  </p>
                  <p className="text-xs text-gray-500">Horario</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <UserGroupIcon className="h-4 w-4 text-gray-400" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Estudiantes</p>
                    {getCapacityBadge(classItem.enrolledStudents || 0, classItem.maxCapacity || 0)}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min(((classItem.enrolledStudents || 0) / (classItem.maxCapacity || 1)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {classItem.description && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Descripción</p>
                  <p className="text-sm text-gray-900 mt-1">{classItem.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Precio</p>
                  <p className="text-sm font-semibold text-gray-900">
                    ${classItem.price?.toLocaleString() || 'No definido'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Duración</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {classItem.durationHours || 'No definida'} min
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <Button as={Link} to={`/classes/${classItem.id}`} variant="ghost" size="sm">
                Ver Detalle
              </Button>
              <Button as={Link} to={`/classes/${classItem.id}/edit`} variant="secondary" size="sm">
                Editar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredClasses.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <CalendarDaysIcon className="w-full h-full" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay clases</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || typeFilter || statusFilter || dayFilter
              ? 'No se encontraron clases que coincidan con los filtros aplicados.'
              : 'No hay clases registradas en el sistema.'
            }
          </p>
          <div className="mt-6">
            <Button as={Link} to="/classes/new" icon={PlusIcon}>
              Crear Primera Clase
            </Button>
          </div>
        </Card>
      )}

      {/* Summary */}
      {filteredClasses.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Mostrando {filteredClasses.length} de {classes?.length || 0} clases
            </span>
            <div className="flex space-x-4">
              <span>
                Activas: {filteredClasses.filter(c => c.status === 'active').length}
              </span>
              <span>
                Programadas: {filteredClasses.filter(c => c.status === 'scheduled').length}
              </span>
              <span>
                Total estudiantes: {filteredClasses.reduce((total, c) => total + (c.enrolledStudents || 0), 0)}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Classes;
