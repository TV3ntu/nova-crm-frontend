import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import LoadingSpinner from '../components/common/LoadingSpinner';

const StudentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useNotification();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    selectedClasses: []
  });
  const [errors, setErrors] = useState({});

  const availableClasses = [
    { value: 'ballet-clasico', label: 'Ballet Clásico - $800/mes' },
    { value: 'jazz', label: 'Jazz - $700/mes' },
    { value: 'hip-hop', label: 'Hip Hop - $750/mes' },
    { value: 'contemporaneo', label: 'Contemporáneo - $800/mes' },
    { value: 'salsa', label: 'Salsa - $600/mes' }
  ];

  useEffect(() => {
    if (isEditing) {
      // Simular carga de datos del estudiante
      setLoading(true);
      setTimeout(() => {
        setFormData({
          name: 'María García',
          email: 'maria.garcia@email.com',
          phone: '+56 9 1234 5678',
          birthDate: '1995-03-15',
          address: 'Av. Providencia 1234, Santiago',
          emergencyContact: 'Pedro García',
          emergencyPhone: '+56 9 8765 4321',
          selectedClasses: ['ballet-clasico', 'jazz']
        });
        setLoading(false);
      }, 1000);
    }
  }, [isEditing]);

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

  const handleClassToggle = (classValue) => {
    setFormData(prev => ({
      ...prev,
      selectedClasses: prev.selectedClasses.includes(classValue)
        ? prev.selectedClasses.filter(c => c !== classValue)
        : [...prev.selectedClasses, classValue]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es requerida';
    }
    
    if (formData.selectedClasses.length === 0) {
      newErrors.selectedClasses = 'Debe seleccionar al menos una clase';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showSuccess(
        isEditing 
          ? 'Estudiante actualizado exitosamente' 
          : 'Estudiante creado exitosamente'
      );
      
      navigate('/students');
    } catch (error) {
      showError('Error al guardar el estudiante');
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyTotal = () => {
    const classPrices = {
      'ballet-clasico': 800,
      'jazz': 700,
      'hip-hop': 750,
      'contemporaneo': 800,
      'salsa': 600
    };
    
    return formData.selectedClasses.reduce((total, classValue) => {
      return total + (classPrices[classValue] || 0);
    }, 0);
  };

  if (loading && isEditing) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Editar Estudiante' : 'Nuevo Estudiante'}
        </h1>
        <p className="text-gray-600">
          {isEditing ? 'Actualiza la información del estudiante' : 'Agrega un nuevo estudiante al sistema'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Personal */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombre Completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              placeholder="Ej: María García"
            />
            
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              placeholder="maria@email.com"
            />
            
            <Input
              label="Teléfono"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
              placeholder="+56 9 1234 5678"
            />
            
            <Input
              label="Fecha de Nacimiento"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              error={errors.birthDate}
              required
            />
            
            <Input
              label="Dirección"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Av. Providencia 1234, Santiago"
              containerClassName="md:col-span-2"
            />
          </div>
        </Card>

        {/* Contacto de Emergencia */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contacto de Emergencia</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombre del Contacto"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="Ej: Pedro García"
            />
            
            <Input
              label="Teléfono de Emergencia"
              name="emergencyPhone"
              type="tel"
              value={formData.emergencyPhone}
              onChange={handleChange}
              placeholder="+56 9 8765 4321"
            />
          </div>
        </Card>

        {/* Selección de Clases */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Clases</h2>
          
          <div className="space-y-3">
            {availableClasses.map((classOption) => (
              <label key={classOption.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.selectedClasses.includes(classOption.value)}
                  onChange={() => handleClassToggle(classOption.value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-900">{classOption.label}</span>
              </label>
            ))}
          </div>
          
          {errors.selectedClasses && (
            <p className="mt-2 text-sm text-red-600">{errors.selectedClasses}</p>
          )}
          
          {formData.selectedClasses.length > 0 && (
            <div className="mt-4 p-4 bg-primary-50 rounded-lg">
              <h3 className="text-sm font-medium text-primary-900">Resumen de Costos</h3>
              <p className="text-sm text-primary-700 mt-1">
                Total mensual: <span className="font-semibold">${calculateMonthlyTotal().toLocaleString()}</span>
              </p>
              <p className="text-xs text-primary-600 mt-1">
                {formData.selectedClasses.length} clase{formData.selectedClasses.length > 1 ? 's' : ''} seleccionada{formData.selectedClasses.length > 1 ? 's' : ''}
              </p>
            </div>
          )}
        </Card>

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/students')}
            disabled={loading}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {isEditing ? 'Actualizar Estudiante' : 'Crear Estudiante'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
