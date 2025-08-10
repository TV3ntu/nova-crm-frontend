import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, CalendarDaysIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const timeSlots = ['15:00', '16:30', '18:00', '19:30', '20:00', '21:00'];

  useEffect(() => {
    const loadClasses = async () => {
      setLoading(true);
      
      setTimeout(() => {
        setClasses([
          {
            id: 1,
            name: 'Ballet Clásico Avanzado',
            teacher: 'Elena Martínez',
            teacherId: 1,
            day: 'Lunes',
            startTime: '18:00',
            duration: 90,
            price: 800,
            maxStudents: 20,
            currentStudents: 15,
            status: 'active',
            description: 'Clase avanzada de ballet clásico con técnica refinada'
          },
          {
            id: 2,
            name: 'Jazz Intermedio',
            teacher: 'Carmen López',
            teacherId: 2,
            day: 'Martes',
            startTime: '20:00',
            duration: 90,
            price: 700,
            maxStudents: 15,
            currentStudents: 18,
            status: 'active',
            description: 'Clase de jazz con énfasis en expresión y técnica'
          },
          {
            id: 3,
            name: 'Hip Hop Principiantes',
            teacher: 'Carmen López',
            teacherId: 2,
            day: 'Viernes',
            startTime: '19:30',
            duration: 60,
            price: 750,
            maxStudents: 20,
            currentStudents: 20,
            status: 'active',
            description: 'Introducción al hip hop para principiantes'
          },
          {
            id: 4,
            name: 'Contemporáneo',
            teacher: 'Elena Martínez',
            teacherId: 1,
            day: 'Miércoles',
            startTime: '19:30',
            duration: 90,
            price: 800,
            maxStudents: 15,
            currentStudents: 12,
            status: 'active',
            description: 'Danza contemporánea con técnica moderna'
          },
          {
            id: 5,
            name: 'Salsa Avanzada',
            teacher: 'Ana Rodríguez',
            teacherId: 3,
            day: 'Sábado',
            startTime: '15:00',
            duration: 90,
            price: 600,
            maxStudents: 16,
            currentStudents: 16,
            status: 'active',
            description: 'Salsa avanzada con figuras complejas'
          }
        ]);
        setLoading(false);
      }, 1000);
    };

    loadClasses();
  }, []);

  const getClassesForDayAndTime = (day, time) => {
    return classes.filter(cls => cls.day === day && cls.startTime === time);
  };

  const getCapacityColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 100) return 'text-red-600 bg-red-50';
    if (percentage >= 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusBadge = (current, max) => {
    if (current >= max) return <Badge variant="danger">Llena</Badge>;
    if (current >= max * 0.8) return <Badge variant="warning">Casi llena</Badge>;
    return <Badge variant="success">Disponible</Badge>;
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Clases</h1>
          <p className="text-gray-600">Gestiona las clases y horarios del estudio</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex rounded-lg border border-gray-300">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                viewMode === 'calendar'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CalendarDaysIcon className="h-4 w-4 inline mr-2" />
              Calendario
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg border-l ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Lista
            </button>
          </div>
          <Button as={Link} to="/classes/new" icon={PlusIcon}>
            Nueva Clase
          </Button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        /* Calendar View */
        <Card className="p-6">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="grid grid-cols-8 gap-2 mb-4">
                <div className="font-semibold text-gray-900 p-2">Horario</div>
                {daysOfWeek.map(day => (
                  <div key={day} className="font-semibold text-gray-900 p-2 text-center">
                    {day}
                  </div>
                ))}
              </div>
              
              {timeSlots.map(time => (
                <div key={time} className="grid grid-cols-8 gap-2 mb-2">
                  <div className="p-2 text-sm font-medium text-gray-600 bg-gray-50 rounded">
                    {time}
                  </div>
                  {daysOfWeek.map(day => {
                    const dayClasses = getClassesForDayAndTime(day, time);
                    return (
                      <div key={`${day}-${time}`} className="min-h-[80px] p-1">
                        {dayClasses.map(cls => (
                          <div
                            key={cls.id}
                            className={`
                              p-2 rounded-lg text-xs cursor-pointer hover:shadow-md transition-shadow
                              ${getCapacityColor(cls.currentStudents, cls.maxStudents)}
                            `}
                            onClick={() => window.location.href = `/classes/${cls.id}`}
                          >
                            <div className="font-semibold truncate">{cls.name}</div>
                            <div className="text-xs opacity-75">{cls.teacher}</div>
                            <div className="text-xs mt-1">
                              {cls.currentStudents}/{cls.maxStudents}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        /* List View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <Card key={cls.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{cls.name}</h3>
                  <p className="text-sm text-gray-600">{cls.teacher}</p>
                </div>
                {getStatusBadge(cls.currentStudents, cls.maxStudents)}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarDaysIcon className="h-4 w-4 mr-2" />
                  {cls.day} {cls.startTime} ({cls.duration} min)
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  {cls.currentStudents}/{cls.maxStudents} estudiantes
                </div>
                
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">${cls.price.toLocaleString()}</span> por mes
                </div>
              </div>

              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      cls.currentStudents >= cls.maxStudents 
                        ? 'bg-red-500' 
                        : cls.currentStudents >= cls.maxStudents * 0.8 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((cls.currentStudents / cls.maxStudents) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{cls.description}</p>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <Button as={Link} to={`/classes/${cls.id}`} variant="ghost" size="sm">
                  Ver Detalle
                </Button>
                <Button as={Link} to={`/classes/${cls.id}/edit`} variant="secondary" size="sm">
                  Editar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {classes.length === 0 && (
        <Card className="p-12 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <CalendarDaysIcon />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay clases</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza agregando la primera clase del estudio.
          </p>
          <div className="mt-6">
            <Button as={Link} to="/classes/new" icon={PlusIcon}>
              Crear Primera Clase
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Classes;
