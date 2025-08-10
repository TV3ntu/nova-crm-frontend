import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useApi } from '../hooks/useApi';
import { studentsAPI } from '../services/api';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');

  const {
    data: students,
    loading,
    error,
    refetch
  } = useApi(
    () => studentsAPI.getAll({
      search: searchTerm,
      status: statusFilter,
      class: classFilter
    }),
    [searchTerm, statusFilter, classFilter]
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Activo</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactivo</Badge>;
      case 'suspended':
        return <Badge variant="danger">Suspendido</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (paymentStatus, totalOwed) => {
    switch (paymentStatus) {
      case 'up_to_date':
        return <Badge variant="success">Al día</Badge>;
      case 'overdue':
        return (
          <div>
            <Badge variant="danger">Vencido</Badge>
            {totalOwed > 0 && (
              <p className="text-xs text-red-600 mt-1">
                Debe: ${totalOwed.toLocaleString()}
              </p>
            )}
          </div>
        );
      case 'pending':
        return <Badge variant="warning">Pendiente</Badge>;
      default:
        return <Badge variant="secondary">{paymentStatus}</Badge>;
    }
  };

  // Filtrar estudiantes localmente si hay datos
  const filteredStudents = students ? students.filter(student => {
    const matchesSearch = !searchTerm || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || student.status === statusFilter;
    
    const matchesClass = !classFilter || 
      (student.classes && student.classes.some(cls => 
        cls.toLowerCase().includes(classFilter.toLowerCase())
      ));
    
    return matchesSearch && matchesStatus && matchesClass;
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
        <UserGroupIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar estudiantes</h3>
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
          <h1 className="text-2xl font-bold text-gray-900">Estudiantes</h1>
          <p className="text-gray-600">Gestión de estudiantes del estudio</p>
        </div>
        <Button as={Link} to="/students/new" icon={PlusIcon}>
          Nuevo Estudiante
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
            placeholder="Estado"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'Todos los estados' },
              { value: 'active', label: 'Activo' },
              { value: 'inactive', label: 'Inactivo' },
              { value: 'suspended', label: 'Suspendido' }
            ]}
          />
          
          <Select
            placeholder="Clase"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            options={[
              { value: '', label: 'Todas las clases' },
              { value: 'Ballet', label: 'Ballet Clásico' },
              { value: 'Jazz', label: 'Jazz' },
              { value: 'Hip Hop', label: 'Hip Hop' },
              { value: 'Contemporáneo', label: 'Contemporáneo' },
              { value: 'Salsa', label: 'Salsa' }
            ]}
          />
          
          <Button
            variant="secondary"
            icon={FunnelIcon}
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
              setClassFilter('');
            }}
          >
            Limpiar Filtros
          </Button>
        </div>
      </Card>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar src={student.avatar} name={student.name} size="md" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.email}</p>
                </div>
              </div>
              {getStatusBadge(student.status)}
            </div>

            <div className="space-y-2 mb-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Teléfono</p>
                <p className="text-sm text-gray-900">{student.phone}</p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Clases</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {student.classes && student.classes.map((className, index) => (
                    <Badge key={index} variant="primary" size="sm">{className}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Estado de Pago</p>
                <div className="mt-1">
                  {getPaymentStatusBadge(student.paymentStatus, student.totalOwed)}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <Button as={Link} to={`/students/${student.id}`} variant="ghost" size="sm">
                Ver Detalle
              </Button>
              <Button as={Link} to={`/students/${student.id}/edit`} variant="secondary" size="sm">
                Editar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay estudiantes</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter || classFilter 
              ? 'No se encontraron estudiantes que coincidan con los filtros aplicados.'
              : 'No hay estudiantes registrados en el sistema.'
            }
          </p>
          <div className="mt-6">
            <Button as={Link} to="/students/new" icon={PlusIcon}>
              Agregar Estudiante
            </Button>
          </div>
        </Card>
      )}

      {/* Summary */}
      {filteredStudents.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Mostrando {filteredStudents.length} de {students?.length || 0} estudiantes
            </span>
            <div className="flex space-x-4">
              <span>
                Activos: {filteredStudents.filter(s => s.status === 'active').length}
              </span>
              <span>
                Con pagos vencidos: {filteredStudents.filter(s => s.paymentStatus === 'overdue').length}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Students;
