import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PaymentForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSuccess, showError } = useNotification();
  const preselectedStudentId = searchParams.get('student');

  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentId: preselectedStudentId || '',
    selectedClasses: [],
    paymentMethod: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const students = [
    { 
      id: '1', 
      name: 'María García',
      avatar: null,
      pendingClasses: [
        { id: 'ballet', name: 'Ballet Clásico', price: 800, dueDate: '2024-02-10' },
        { id: 'jazz', name: 'Jazz', price: 700, dueDate: '2024-02-10' }
      ]
    },
    { 
      id: '2', 
      name: 'Ana López',
      avatar: null,
      pendingClasses: [
        { id: 'hiphop', name: 'Hip Hop', price: 750, dueDate: '2024-01-10', overdue: true }
      ]
    },
    { 
      id: '3', 
      name: 'Carmen Silva',
      avatar: null,
      pendingClasses: [
        { id: 'contemporaneo', name: 'Contemporáneo', price: 800, dueDate: '2024-02-15' },
        { id: 'ballet', name: 'Ballet Clásico', price: 800, dueDate: '2024-02-15' }
      ]
    }
  ];

  const paymentMethods = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'transferencia', label: 'Transferencia Bancaria' },
    { value: 'tarjeta', label: 'Tarjeta de Crédito/Débito' },
    { value: 'cheque', label: 'Cheque' }
  ];

  useEffect(() => {
    if (preselectedStudentId) {
      const student = students.find(s => s.id === preselectedStudentId);
      if (student) {
        setSelectedStudent(student);
        setFormData(prev => ({
          ...prev,
          studentId: preselectedStudentId,
          selectedClasses: student.pendingClasses.map(cls => cls.id)
        }));
      }
    }
  }, [preselectedStudentId]);

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    const student = students.find(s => s.id === studentId);
    
    setSelectedStudent(student);
    setFormData(prev => ({
      ...prev,
      studentId,
      selectedClasses: student ? student.pendingClasses.map(cls => cls.id) : []
    }));
  };

  const handleClassToggle = (classId) => {
    setFormData(prev => ({
      ...prev,
      selectedClasses: prev.selectedClasses.includes(classId)
        ? prev.selectedClasses.filter(id => id !== classId)
        : [...prev.selectedClasses, classId]
    }));
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

  const calculatePayment = () => {
    if (!selectedStudent) return { baseAmount: 0, lateFee: 0, total: 0 };

    const selectedClassesData = selectedStudent.pendingClasses.filter(cls => 
      formData.selectedClasses.includes(cls.id)
    );

    const baseAmount = selectedClassesData.reduce((sum, cls) => sum + cls.price, 0);
    
    // Calcular recargo por mora (15% si hay clases vencidas)
    const hasOverdueClasses = selectedClassesData.some(cls => {
      const dueDate = new Date(cls.dueDate);
      const paymentDate = new Date(formData.paymentDate);
      return paymentDate > dueDate;
    });

    const lateFee = hasOverdueClasses ? Math.round(baseAmount * 0.15) : 0;
    const total = baseAmount + lateFee;

    return { baseAmount, lateFee, total, hasOverdueClasses };
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.studentId) {
      newErrors.studentId = 'Debe seleccionar un estudiante';
    }
    
    if (formData.selectedClasses.length === 0) {
      newErrors.selectedClasses = 'Debe seleccionar al menos una clase';
    }
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Debe seleccionar un método de pago';
    }
    
    if (!formData.paymentDate) {
      newErrors.paymentDate = 'La fecha de pago es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { total } = calculatePayment();
      showSuccess(`Pago de $${total.toLocaleString()} procesado exitosamente`);
      
      navigate('/payments');
    } catch (error) {
      showError('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  const { baseAmount, lateFee, total, hasOverdueClasses } = calculatePayment();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Procesar Pago</h1>
        <p className="text-gray-600">Registra un nuevo pago de estudiante</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selección de Estudiante */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Estudiante</h2>
          
          <Select
            label="Seleccionar Estudiante"
            name="studentId"
            value={formData.studentId}
            onChange={handleStudentChange}
            error={errors.studentId}
            required
            options={students.map(student => ({
              value: student.id,
              label: student.name
            }))}
            placeholder="Buscar estudiante..."
          />

          {selectedStudent && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar src={selectedStudent.avatar} name={selectedStudent.name} size="md" />
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedStudent.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedStudent.pendingClasses.length} clase{selectedStudent.pendingClasses.length > 1 ? 's' : ''} pendiente{selectedStudent.pendingClasses.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Selección de Clases */}
        {selectedStudent && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Clases a Pagar</h2>
            
            <div className="space-y-3">
              {selectedStudent.pendingClasses.map((cls) => (
                <label key={cls.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.selectedClasses.includes(cls.id)}
                      onChange={() => handleClassToggle(cls.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <div className="ml-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{cls.name}</span>
                        {cls.overdue && <Badge variant="danger" size="sm">Vencida</Badge>}
                      </div>
                      <p className="text-xs text-gray-500">
                        Vence: {new Date(cls.dueDate).toLocaleDateString('es-CL')}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">${cls.price.toLocaleString()}</span>
                </label>
              ))}
            </div>
            
            {errors.selectedClasses && (
              <p className="mt-2 text-sm text-red-600">{errors.selectedClasses}</p>
            )}
          </Card>
        )}

        {/* Detalles del Pago */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Pago</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Método de Pago"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              error={errors.paymentMethod}
              required
              options={paymentMethods}
              placeholder="Seleccionar método"
            />
            
            <Input
              label="Fecha de Pago"
              name="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={handleChange}
              error={errors.paymentDate}
              required
            />
            
            <Input
              label="Notas (Opcional)"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Notas adicionales..."
              containerClassName="md:col-span-2"
            />
          </div>
        </Card>

        {/* Resumen del Pago */}
        {formData.selectedClasses.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Pago</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Subtotal ({formData.selectedClasses.length} clase{formData.selectedClasses.length > 1 ? 's' : ''})</span>
                <span className="text-sm font-medium text-gray-900">${baseAmount.toLocaleString()}</span>
              </div>
              
              {hasOverdueClasses && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-red-600">Recargo por mora (15%)</span>
                    <Badge variant="danger" size="sm">Aplicado</Badge>
                  </div>
                  <span className="text-sm font-medium text-red-600">+${lateFee.toLocaleString()}</span>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total a Pagar</span>
                  <span className="text-2xl font-bold text-primary-600">${total.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {hasOverdueClasses && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Nota:</strong> Se aplicó un recargo del 15% por pago tardío en clases vencidas.
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/payments')}
            disabled={loading}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            loading={loading}
            disabled={loading || formData.selectedClasses.length === 0}
          >
            Procesar Pago ${total.toLocaleString()}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
