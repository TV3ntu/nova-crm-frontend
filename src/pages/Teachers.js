import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  AcademicCapIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useApi } from '../hooks/useApi';
import { teachersAPI } from '../services/api';

const Teachers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const {
    data: teachers,
    loading,
    error,
    refetch
  } = useApi(
    () => teachersAPI.getAll({
      search: searchTerm,
      specialty: specialtyFilter,
      status: statusFilter
    }),
    [searchTerm, specialtyFilter, statusFilter]
  );

  const getOwnerBadge = (isOwner) => {
    return isOwner 
      ? <Badge variant="primary" icon={StarIcon}>Propietario</Badge>
      : <Badge variant="secondary">Instructor</Badge>;
  };

  const getCompensationRate = (rate) => {
    return rate === 100 ? '100%' : '50%';
  };

  // Filtrar profesores localmente si hay datos
  const filteredTeachers = teachers ? teachers.filter(teacher => {
    const matchesSearch = !searchTerm || 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = !specialtyFilter || 
      (teacher.specialties && teacher.specialties.some(specialty => 
        specialty.toLowerCase().includes(specialtyFilter.toLowerCase())
      ));
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'owner' && teacher.isOwner) ||
      (statusFilter === 'instructor' && !teacher.isOwner);
    
    return matchesSearch && matchesSpecialty && matchesStatus;
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
        <AcademicCapIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar profesores</h3>
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
          <h1 className="text-2xl font-bold text-gray-900">Profesores</h1>
          <p className="text-gray-600">Gestión del equipo docente</p>
        </div>
        <Button as={Link} to="/teachers/new" icon={PlusIcon}>
          Nuevo Profesor
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={MagnifyingGlassIcon}
          />
          
          <Select
            placeholder="Especialidad"
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            options={[
              { value: '', label: 'Todas las especialidades' },
              { value: 'Ballet', label: 'Ballet Clásico' },
              { value: 'Jazz', label: 'Jazz' },
              { value: 'Hip Hop', label: 'Hip Hop' },
              { value: 'Contemporáneo', label: 'Contemporáneo' },
              { value: 'Salsa', label: 'Salsa' }
            ]}
          />
          
          <Select
            placeholder="Tipo"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'Todos' },
              { value: 'owner', label: 'Propietarios' },
              { value: 'instructor', label: 'Instructores' }
            ]}
          />
          
          <Button
            variant="secondary"
            icon={FunnelIcon}
            onClick={() => {
              setSearchTerm('');
              setSpecialtyFilter('');
              setStatusFilter('');
            }}
          >
            Limpiar Filtros
          </Button>
        </div>
      </Card>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar src={teacher.avatar} name={teacher.fullName || `${teacher.firstName} ${teacher.lastName}`} size="md" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{teacher.fullName || `${teacher.firstName} ${teacher.lastName}`}</h3>
                  <p className="text-sm text-gray-600">{teacher.email}</p>
                </div>
              </div>
              {getOwnerBadge(teacher.isOwner)}
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Teléfono</p>
                <p className="text-sm text-gray-900">{teacher.phone}</p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Especialidades</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {teacher.specialties && teacher.specialties.map((specialty, index) => (
                    <Badge key={index} variant="primary" size="sm">{specialty}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Clases Asignadas</p>
                <p className="text-sm text-gray-900 mt-1">
                  {teacher.assignedClasses ? teacher.assignedClasses.length : 0} clases
                </p>
                {teacher.assignedClasses && teacher.assignedClasses.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {teacher.assignedClasses.slice(0, 2).map((classItem, index) => (
                      <div key={index} className="text-xs text-gray-600">
                        <span className="font-medium">{classItem.name}</span>
                        <span className="ml-2">({classItem.students} estudiantes)</span>
                      </div>
                    ))}
                    {teacher.assignedClasses.length > 2 && (
                      <p className="text-xs text-gray-500">
                        +{teacher.assignedClasses.length - 2} más
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Compensación</p>
                  <p className="text-sm font-semibold text-gray-900">
                    ${teacher.monthlyCompensation?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">
                    {getCompensationRate(teacher.compensationRate)} de ingresos
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Estudiantes</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {teacher.assignedClasses ? 
                      teacher.assignedClasses.reduce((total, cls) => total + (cls.students || 0), 0) : 0
                    }
                  </p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <Button as={Link} to={`/teachers/${teacher.id}`} variant="ghost" size="sm">
                Ver Detalle
              </Button>
              <Button as={Link} to={`/teachers/${teacher.id}/edit`} variant="secondary" size="sm">
                Editar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredTeachers.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <AcademicCapIcon className="w-full h-full" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay profesores</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || specialtyFilter || statusFilter 
              ? 'No se encontraron profesores que coincidan con los filtros aplicados.'
              : 'No hay profesores registrados en el sistema.'
            }
          </p>
          <div className="mt-6">
            <Button as={Link} to="/teachers/new" icon={PlusIcon}>
              Agregar Profesor
            </Button>
          </div>
        </Card>
      )}

      {/* Summary */}
      {filteredTeachers.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Mostrando {filteredTeachers.length} de {teachers?.length || 0} profesores
            </span>
            <div className="flex space-x-4">
              <span>
                Propietarios: {filteredTeachers.filter(t => t.isOwner).length}
              </span>
              <span>
                Instructores: {filteredTeachers.filter(t => !t.isOwner).length}
              </span>
              <span>
                Total estudiantes: {filteredTeachers.reduce((total, teacher) => 
                  total + (teacher.assignedClasses ? 
                    teacher.assignedClasses.reduce((sum, cls) => sum + (cls.students || 0), 0) : 0
                  ), 0
                )}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Teachers;
