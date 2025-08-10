import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { studentsAPI } from '../services/api';

const StudentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useNotification();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
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
    { value: 'hip-hop', label: 'Hip Hop - $650/mes' },
    { value: 'contemporaneo', label: 'Contemporáneo - $750/mes' },
    { value: 'salsa', label: 'Salsa - $600/mes' },
    { value: 'bachata', label: 'Bachata - $600/mes' },
    { value: 'tango', label: 'Tango - $700/mes' }
  ];

  useEffect(() => {
    if (isEditing) {
      loadStudentData();
    }
  }, [isEditing, id]);

  const loadStudentData = async () => {
    setInitialLoading(true);
    try {
      const response = await studentsAPI.getById(id);
      const student = response.data;
      
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        birthDate: student.birthDate || '',
        address: student.address || '',
        emergencyContact: student.emergencyContact || '',
        emergencyPhone: student.emergencyPhone || '',
        selectedClasses: student.classes?.map(cls => cls.id) || []
      });
    } catch (error) {
      console.error('Error loading student:', error);
      showError('Error al cargar los datos del estudiante');
      navigate('/students');
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
      const studentData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        birthDate: formData.birthDate,
        address: formData.address.trim(),
        emergencyContact: formData.emergencyContact.trim(),
        emergencyPhone: formData.emergencyPhone.trim(),
        classes: formData.selectedClasses
      };

      if (isEditing) {
        await studentsAPI.update(id, studentData);
        showSuccess('Estudiante actualizado exitosamente');
      } else {
        await studentsAPI.create(studentData);
        showSuccess('Estudiante creado exitosamente');
      }
      
      navigate('/students');
    } catch (error) {
      console.error('Error saving student:', error);
      const errorMessage = error.response?.data?.message || 'Error al guardar el estudiante';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyTotal = () => {
    const classPrices = {
      'ballet-clasico': 800,
      'jazz': 700,
      'hip-hop': 650,
      'contemporaneo': 750,
      'salsa': 600,
      'bachata': 600,
      'tango': 700
    };
    
    return formData.selectedClasses.reduce((total, classValue) => {
      return total + (classPrices[classValue] || 0);
    }, 0);
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
