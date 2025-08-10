import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, MagnifyingGlassIcon, StarIcon } from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadTeachers = async () => {
      setLoading(true);
      
      setTimeout(() => {
        setTeachers([
          {
            id: 1,
            name: 'Elena Martínez',
            email: 'elena.martinez@novadance.com',
            phone: '+56 9 1111 2222',
            avatar: null,
            isOwner: true,
            specialties: ['Ballet Clásico', 'Contemporáneo'],
            assignedClasses: [
              { name: 'Ballet Clásico Avanzado', students: 15, schedule: 'Lun/Mié 18:00' },
              { name: 'Contemporáneo', students: 12, schedule: 'Mar/Jue 19:30' }
            ],
            monthlyCompensation: 450000,
            compensationRate: 100
          },
          {
            id: 2,
            name: 'Carmen López',
            email: 'carmen.lopez@novadance.com',
            phone: '+56 9 3333 4444',
            avatar: null,
            isOwner: false,
            specialties: ['Jazz', 'Hip Hop'],
            assignedClasses: [
              { name: 'Jazz Intermedio', students: 18, schedule: 'Mar/Jue 20:00' },
              { name: 'Hip Hop Principiantes', students: 20, schedule: 'Vie 19:00' }
            ],
            monthlyCompensation: 285000,
            compensationRate: 50
          },
          {
            id: 3,
            name: 'Ana Rodríguez',
            email: 'ana.rodriguez@novadance.com',
            phone: '+56 9 5555 6666',
            avatar: null,
            isOwner: false,
            specialties: ['Salsa', 'Bachata'],
            assignedClasses: [
              { name: 'Salsa Avanzada', students: 16, schedule: 'Sáb 15:00' },
              { name: 'Bachata', students: 14, schedule: 'Sáb 16:30' }
            ],
            monthlyCompensation: 225000,
            compensationRate: 50
          }
        ]);
        setLoading(false);
      }, 1000);
    };

    loadTeachers();
  }, []);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Profesoras</h1>
          <p className="text-gray-600">Gestiona el equipo de profesoras del estudio</p>
        </div>
        <Button as={Link} to="/teachers/new" icon={PlusIcon}>
          Nueva Profesora
        </Button>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar profesoras o especialidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar src={teacher.avatar} name={teacher.name} size="md" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
                    {teacher.isOwner && (
                      <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{teacher.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Especialidades</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {teacher.specialties.map((specialty, index) => (
                    <Badge key={index} variant="primary" size="sm">{specialty}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Clases Asignadas</p>
                <div className="mt-1 space-y-1">
                  {teacher.assignedClasses.map((cls, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium text-gray-900">{cls.name}</span>
                      <span className="text-gray-500 ml-2">({cls.students} estudiantes)</span>
                      <div className="text-xs text-gray-500">{cls.schedule}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Compensación Mensual</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-lg font-semibold text-gray-900">
                    ${teacher.monthlyCompensation.toLocaleString()}
                  </span>
                  <Badge variant={teacher.isOwner ? 'success' : 'info'}>
                    {teacher.compensationRate}%
                  </Badge>
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

      {filteredTeachers.length === 0 && (
        <Card className="p-12 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay profesoras</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron profesoras que coincidan con la búsqueda.
          </p>
          <div className="mt-6">
            <Button as={Link} to="/teachers/new" icon={PlusIcon}>
              Agregar Profesora
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Teachers;
