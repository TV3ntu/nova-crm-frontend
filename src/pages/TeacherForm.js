import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { teachersAPI } from '../services/api';

const TeacherForm = () => {
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
    isOwner: false,
    selectedSpecialties: []
  });
  const [errors, setErrors] = useState({});

  const availableSpecialties = [
    'Ballet Clásico',
    'Jazz',
    'Hip Hop',
    'Contemporáneo',
    'Salsa',
    'Bachata',
    'Tango',
    'Danza Moderna',
    'Folclore',
    'Reggaeton'
  ];

  useEffect(() => {
    if (isEditing) {
      loadTeacherData();
    }
  }, [isEditing, id]);

  const loadTeacherData = async () => {
    setInitialLoading(true);
    try {
      const response = await teachersAPI.getById(id);
      const teacher = response.data;
      
      setFormData({
        name: teacher.name || '',
        email: teacher.email || '',
        phone: teacher.phone || '',
        isOwner: teacher.isOwner || false,
        selectedSpecialties: teacher.specialties || []
      });
    } catch (error) {
      console.error('Error loading teacher:', error);
      showError('Error al cargar los datos de la profesora');
      navigate('/teachers');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSpecialtyToggle = (specialty) => {
    setFormData(prev => ({
      ...prev,
      selectedSpecialties: prev.selectedSpecialties.includes(specialty)
        ? prev.selectedSpecialties.filter(s => s !== specialty)
        : [...prev.selectedSpecialties, specialty]
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
    
    if (formData.selectedSpecialties.length === 0) {
      newErrors.selectedSpecialties = 'Debe seleccionar al menos una especialidad';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const teacherData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        isOwner: formData.isOwner,
        specialties: formData.selectedSpecialties
      };

      if (isEditing) {
        await teachersAPI.update(id, teacherData);
        showSuccess('Profesora actualizada exitosamente');
      } else {
        await teachersAPI.create(teacherData);
        showSuccess('Profesora creada exitosamente');
      }
      
      navigate('/teachers');
    } catch (error) {
      console.error('Error saving teacher:', error);
      const errorMessage = error.response?.data?.message || 'Error al guardar la profesora';
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
          {isEditing ? 'Editar Profesora' : 'Nueva Profesora'}
        </h1>
        <p className="text-gray-600">
          {isEditing ? 'Actualiza la información de la profesora' : 'Agrega una nueva profesora al equipo'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Ej: Elena Martínez"
            />
            
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              placeholder="elena@novadance.com"
            />
            
            <Input
              label="Teléfono"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
              placeholder="+56 9 1111 2222"
            />
            
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isOwner"
                  checked={formData.isOwner}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-900">Es dueña del estudio</span>
              </label>
            </div>
          </div>
          
          {formData.isOwner && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> Las dueñas del estudio reciben 100% de compensación por sus clases.
              </p>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Especialidades</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableSpecialties.map((specialty) => (
              <label key={specialty} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.selectedSpecialties.includes(specialty)}
                  onChange={() => handleSpecialtyToggle(specialty)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-900">{specialty}</span>
              </label>
            ))}
          </div>
          
          {errors.selectedSpecialties && (
            <p className="mt-2 text-sm text-red-600">{errors.selectedSpecialties}</p>
          )}
          
          {formData.selectedSpecialties.length > 0 && (
            <div className="mt-4 p-4 bg-primary-50 rounded-lg">
              <h3 className="text-sm font-medium text-primary-900">Especialidades Seleccionadas</h3>
              <p className="text-sm text-primary-700 mt-1">
                {formData.selectedSpecialties.join(', ')}
              </p>
              <p className="text-xs text-primary-600 mt-1">
                Compensación: {formData.isOwner ? '100%' : '50%'} de los ingresos por clase
              </p>
            </div>
          )}
        </Card>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/teachers')}
            disabled={loading}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {isEditing ? 'Actualizar Profesora' : 'Crear Profesora'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TeacherForm;
