import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { classesAPI, teachersAPI } from '../services/api';

const ClassForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useNotification();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teacherId: '',
    day: '',
    startTime: '',
    duration: 90,
    price: '',
    maxStudents: 20
  });
  const [errors, setErrors] = useState({});

  const daysOfWeek = [
    { value: 'Lunes', label: 'Lunes' },
    { value: 'Martes', label: 'Martes' },
    { value: 'Miércoles', label: 'Miércoles' },
    { value: 'Jueves', label: 'Jueves' },
    { value: 'Viernes', label: 'Viernes' },
    { value: 'Sábado', label: 'Sábado' },
    { value: 'Domingo', label: 'Domingo' }
  ];

  const timeSlots = [
    { value: '15:00', label: '15:00' },
    { value: '16:30', label: '16:30' },
    { value: '18:00', label: '18:00' },
    { value: '19:30', label: '19:30' },
    { value: '20:00', label: '20:00' },
    { value: '21:00', label: '21:00' }
  ];

  useEffect(() => {
    loadTeachers();
    if (isEditing) {
      loadClassData();
    }
  }, [isEditing, id]);

  const loadTeachers = async () => {
    try {
      const response = await teachersAPI.getAll();
      const teacherOptions = response.data.map(teacher => ({
        value: teacher.id.toString(),
        label: teacher.name
      }));
      setTeachers(teacherOptions);
    } catch (error) {
      console.error('Error loading teachers:', error);
      // Fallback to empty array if teachers can't be loaded
      setTeachers([]);
    }
  };

  const loadClassData = async () => {
    setInitialLoading(true);
    try {
      const response = await classesAPI.getById(id);
      const classData = response.data;
      
      setFormData({
        name: classData.name || '',
        description: classData.description || '',
        teacherId: classData.teacherId?.toString() || '',
        day: classData.day || '',
        startTime: classData.startTime || '',
        duration: classData.duration || 90,
        price: classData.price?.toString() || '',
        maxStudents: classData.maxStudents || 20
      });
    } catch (error) {
      console.error('Error loading class:', error);
      showError('Error al cargar los datos de la clase');
      navigate('/classes');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la clase es requerido';
    }
    
    if (!formData.teacherId) {
      newErrors.teacherId = 'Debe seleccionar una profesora';
    }
    
    if (!formData.day) {
      newErrors.day = 'Debe seleccionar un día';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Debe seleccionar una hora';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }
    
    if (!formData.maxStudents || formData.maxStudents <= 0) {
      newErrors.maxStudents = 'El máximo de estudiantes debe ser mayor a 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const classData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        teacherId: parseInt(formData.teacherId),
        day: formData.day,
        startTime: formData.startTime,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        maxStudents: parseInt(formData.maxStudents)
      };

      if (isEditing) {
        await classesAPI.update(id, classData);
        showSuccess('Clase actualizada exitosamente');
      } else {
        await classesAPI.create(classData);
        showSuccess('Clase creada exitosamente');
      }
      
      navigate('/classes');
    } catch (error) {
      console.error('Error saving class:', error);
      const errorMessage = error.response?.data?.message || 'Error al guardar la clase';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getEndTime = () => {
    if (!formData.startTime || !formData.duration) return '';
    
    const [hours, minutes] = formData.startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + parseInt(formData.duration);
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Editar Clase' : 'Nueva Clase'}
        </h1>
        <p className="text-gray-600">
          {isEditing ? 'Actualiza la información de la clase' : 'Crea una nueva clase en el horario'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombre de la Clase"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              placeholder="Ej: Ballet Clásico Avanzado"
              containerClassName="md:col-span-2"
            />
            
            <Input
              label="Descripción"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción de la clase..."
              containerClassName="md:col-span-2"
            />
            
            <Select
              label="Profesora"
              name="teacherId"
              value={formData.teacherId}
              onChange={handleChange}
              error={errors.teacherId}
              required
              options={teachers}
              placeholder="Seleccionar profesora"
            />
            
            <Input
              label="Precio Mensual"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={errors.price}
              required
              placeholder="800"
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Horario</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select
              label="Día de la Semana"
              name="day"
              value={formData.day}
              onChange={handleChange}
              error={errors.day}
              required
              options={daysOfWeek}
              placeholder="Seleccionar día"
            />
            
            <Select
              label="Hora de Inicio"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              error={errors.startTime}
              required
              options={timeSlots}
              placeholder="Seleccionar hora"
            />
            
            <Input
              label="Duración (minutos)"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              placeholder="90"
              min="30"
              step="15"
            />
          </div>
          
          {formData.day && formData.startTime && formData.duration && (
            <div className="mt-4 p-4 bg-primary-50 rounded-lg">
              <h3 className="text-sm font-medium text-primary-900">Preview del Horario</h3>
              <p className="text-sm text-primary-700 mt-1">
                <strong>{formData.day}</strong> de <strong>{formData.startTime}</strong> a <strong>{getEndTime()}</strong>
              </p>
              <p className="text-xs text-primary-600 mt-1">
                Duración: {formData.duration} minutos
              </p>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuración</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Máximo de Estudiantes"
              name="maxStudents"
              type="number"
              value={formData.maxStudents}
              onChange={handleChange}
              error={errors.maxStudents}
              required
              placeholder="20"
              min="1"
            />
          </div>
          
          {formData.price && formData.maxStudents && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-medium text-green-900">Proyección de Ingresos</h3>
              <p className="text-sm text-green-700 mt-1">
                Ingresos máximos mensuales: <strong>${(formData.price * formData.maxStudents).toLocaleString()}</strong>
              </p>
              <p className="text-xs text-green-600 mt-1">
                Basado en {formData.maxStudents} estudiantes a ${formData.price} c/u
              </p>
            </div>
          )}
        </Card>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/classes')}
            disabled={loading}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {isEditing ? 'Actualizar Clase' : 'Crear Clase'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClassForm;
