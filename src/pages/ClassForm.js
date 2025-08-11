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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    durationHours: 1.5,
    schedules: [
      {
        dayOfWeek: '',
        startHour: 18,
        startMinute: 0
      }
    ]
  });
  const [errors, setErrors] = useState({});

  const daysOfWeek = [
    { value: 'MONDAY', label: 'Lunes' },
    { value: 'TUESDAY', label: 'Martes' },
    { value: 'WEDNESDAY', label: 'Miércoles' },
    { value: 'THURSDAY', label: 'Jueves' },
    { value: 'FRIDAY', label: 'Viernes' },
    { value: 'SATURDAY', label: 'Sábado' },
    { value: 'SUNDAY', label: 'Domingo' }
  ];

  const hourOptions = [
    { value: 15, label: '15:00' },
    { value: 16, label: '16:00' },
    { value: 17, label: '17:00' },
    { value: 18, label: '18:00' },
    { value: 19, label: '19:00' },
    { value: 20, label: '20:00' },
    { value: 21, label: '21:00' }
  ];

  const minuteOptions = [
    { value: 0, label: '00' },
    { value: 15, label: '15' },
    { value: 30, label: '30' },
    { value: 45, label: '45' }
  ];

  const durationOptions = [
    { value: 1, label: '1 hora' },
    { value: 1.5, label: '1.5 horas' },
    { value: 2, label: '2 horas' },
    { value: 2.5, label: '2.5 horas' }
  ];

  useEffect(() => {
    if (isEditing) {
      loadClassData();
    }
  }, [isEditing, id]);

  const loadClassData = async () => {
    setInitialLoading(true);
    try {
      const response = await classesAPI.getById(id);
      const classData = response.data;
      
      setFormData({
        name: classData.name || '',
        description: classData.description || '',
        price: classData.price?.toString() || '',
        durationHours: classData.durationHours || 1.5,
        schedules: classData.schedules.map(schedule => ({
          dayOfWeek: schedule.dayOfWeek,
          startHour: schedule.startHour,
          startMinute: schedule.startMinute
        }))
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

  const handleScheduleChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.map((schedule, i) => i === index ? { ...schedule, [field]: value } : schedule)
    }));
  };

  const addSchedule = () => {
    setFormData(prev => ({
      ...prev,
      schedules: [...prev.schedules, { dayOfWeek: '', startHour: 18, startMinute: 0 }]
    }));
  };

  const removeSchedule = (index) => {
    if (formData.schedules.length > 1) {
      setFormData(prev => ({
        ...prev,
        schedules: prev.schedules.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la clase es requerido';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }
    
    if (formData.schedules.length === 0) {
      newErrors.schedules = 'Debe agregar al menos un horario';
    } else {
      formData.schedules.forEach((schedule, index) => {
        if (!schedule.dayOfWeek) {
          newErrors[`schedules.${index}.dayOfWeek`] = 'Debe seleccionar un día';
        }
        
        if (!schedule.startHour) {
          newErrors[`schedules.${index}.startHour`] = 'Debe seleccionar una hora';
        }
        
        if (schedule.startMinute === null || schedule.startMinute === undefined || schedule.startMinute === '') {
          newErrors[`schedules.${index}.startMinute`] = 'Debe seleccionar un minuto';
        }
      });
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
        price: parseFloat(formData.price),
        durationHours: parseFloat(formData.durationHours),
        schedules: formData.schedules.map(schedule => ({
          dayOfWeek: schedule.dayOfWeek,
          startHour: parseInt(schedule.startHour),
          startMinute: parseInt(schedule.startMinute)
        }))
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Horarios</h2>
            <Button
              type="button"
              variant="secondary"
              onClick={addSchedule}
              className="text-sm"
            >
              + Agregar Horario
            </Button>
          </div>
          
          <div className="space-y-6">
            {formData.schedules.map((schedule, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-gray-700">
                    Horario {index + 1}
                  </h3>
                  {formData.schedules.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeSchedule(index)}
                      className="text-xs"
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    label="Día de la Semana"
                    name="dayOfWeek"
                    value={schedule.dayOfWeek}
                    onChange={(e) => handleScheduleChange(index, 'dayOfWeek', e.target.value)}
                    error={errors[`schedules.${index}.dayOfWeek`]}
                    required
                    options={daysOfWeek}
                    placeholder="Seleccionar día"
                  />
                  
                  <Select
                    label="Hora de Inicio"
                    name="startHour"
                    value={schedule.startHour}
                    onChange={(e) => handleScheduleChange(index, 'startHour', e.target.value)}
                    error={errors[`schedules.${index}.startHour`]}
                    required
                    options={hourOptions}
                    placeholder="Seleccionar hora"
                  />
                  
                  <Select
                    label="Minuto de Inicio"
                    name="startMinute"
                    value={schedule.startMinute}
                    onChange={(e) => handleScheduleChange(index, 'startMinute', e.target.value)}
                    error={errors[`schedules.${index}.startMinute`]}
                    required
                    options={minuteOptions}
                    placeholder="Seleccionar minuto"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuración</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Duración de la Clase"
              name="durationHours"
              value={formData.durationHours}
              onChange={handleChange}
              options={durationOptions}
              placeholder="Seleccionar duración"
            />
          </div>
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
