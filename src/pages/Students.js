import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');

  useEffect(() => {
    // Simular carga de estudiantes
    const loadStudents = async () => {
      setLoading(true);
      
      setTimeout(() => {
        setStudents([
          {
            id: 1,
            name: 'María García',
            email: 'maria.garcia@email.com',
            phone: '+56 9 1234 5678',
            avatar: null,
            status: 'active',
            classes: ['Ballet Clásico', 'Jazz'],
            paymentStatus: 'up_to_date',
            nextPayment: '2024-02-15',
            totalOwed: 0
          },
          {
            id: 2,
            name: 'Ana López',
            email: 'ana.lopez@email.com',
            phone: '+56 9 8765 4321',
            avatar: null,
            status: 'active',
            classes: ['Hip Hop'],
            paymentStatus: 'overdue',
            nextPayment: '2024-01-10',
            totalOwed: 1200
          },
          {
            id: 3,
            name: 'Carmen Silva',
            email: 'carmen.silva@email.com',
            phone: '+56 9 5555 1234',
            avatar: null,
            status: 'active',
            classes: ['Contemporáneo', 'Ballet Clásico'],
            paymentStatus: 'up_to_date',
            nextPayment: '2024-02-20',
            totalOwed: 0
          },
          {
            id: 4,
            name: 'Isabella Rodríguez',
            email: 'isabella.rodriguez@email.com',
            phone: '+56 9 9999 8888',
            avatar: null,
            status: 'inactive',
            classes: ['Salsa'],
            paymentStatus: 'up_to_date',
            nextPayment: null,
            totalOwed: 0
          }
        ]);
        setLoading(false);
      }, 1000);
    };

    loadStudents();
  }, []);

  const getPaymentStatusBadge = (status, totalOwed) => {
    if (status === 'overdue') {
      return <Badge variant="danger">Mora ${totalOwed}</Badge>;
    }
    if (status === 'pending') {
      return <Badge variant="warning">Pendiente</Badge>;
    }
    return <Badge variant="success">Al día</Badge>;
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? <Badge variant="success">Activo</Badge>
      : <Badge variant="gray">Inactivo</Badge>;
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || student.status === statusFilter;
    const matchesClass = !classFilter || student.classes.some(cls => cls.includes(classFilter));
    
    return matchesSearch && matchesStatus && matchesClass;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estudiantes</h1>
          <p className="text-gray-600">Gestiona los estudiantes del estudio</p>
        </div>
        <Button as={Link} to="/students/new" icon={PlusIcon}>
          Nuevo Estudiante
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar estudiantes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            placeholder="Estado"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'active', label: 'Activo' },
              { value: 'inactive', label: 'Inactivo' }
            ]}
          />
          
          <Select
            placeholder="Clase"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            options={[
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
            Limpiar
          </Button>
        </div>
      </Card>

      {/* Students List */}
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
                  {student.classes.map((cls, index) => (
                    <Badge key={index} variant="primary" size="sm">{cls}</Badge>
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

      {filteredStudents.length === 0 && (
        <Card className="p-12 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay estudiantes</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron estudiantes que coincidan con los filtros aplicados.
          </p>
          <div className="mt-6">
            <Button as={Link} to="/students/new" icon={PlusIcon}>
              Agregar Estudiante
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Students;
