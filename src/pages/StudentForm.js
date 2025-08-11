import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
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
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    address: ''
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
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        email: student.email || '',
        phone: student.phone || '',
        birthDate: student.birthDate || '',
        address: student.address || ''
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }
    
    // Email is optional - no validation needed
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es requerida';
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
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        birthDate: formData.birthDate,
        address: formData.address.trim()
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
              label="Nombre"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required
              placeholder="Ej: María"
            />
            
            <Input
              label="Apellido"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required
              placeholder="Ej: García"
            />
            
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
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
