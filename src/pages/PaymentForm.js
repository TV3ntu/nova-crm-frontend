import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import SearchableSelect from '../components/common/SearchableSelect';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { paymentsAPI, studentsAPI, classesAPI } from '../services/api';

const PaymentForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSuccess, showError } = useNotification();
  const preselectedStudentId = searchParams.get('student');

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: preselectedStudentId || '',
    selectedClasses: [],
    customAmounts: {}, // Store custom amounts for each class
    paymentMethod: 'EFECTIVO', // Default payment method
    paymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const paymentMethods = [
    { value: 'EFECTIVO', label: 'Efectivo' },
    { value: 'TRANSFERENCIA', label: 'Transferencia' },
    { value: 'TARJETA', label: 'Tarjeta de Crédito/Débito' }
  ];

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (preselectedStudentId && students.length > 0) {
      const student = students.find(s => s.id.toString() === preselectedStudentId);
      if (student) {
        setSelectedStudent(student);
        
        // Initialize custom amounts with default prices
        const initialAmounts = {};
        if (student.pendingClasses) {
          student.pendingClasses.forEach(cls => {
            initialAmounts[cls.id] = cls.price;
          });
        }
        
        setFormData(prev => ({
          ...prev,
          selectedClasses: student.pendingClasses?.map(cls => cls.id) || [],
          customAmounts: initialAmounts
        }));
      }
    }
  }, [preselectedStudentId, students]);

  const loadStudents = async () => {
    setInitialLoading(true);
    try {
      const response = await studentsAPI.getAll();
      
      // Transform students data to include pending classes information and full name
      const studentsWithPending = await Promise.all(response.data.map(async (student) => {
        
        let pendingClasses = [];
        
        // If student has enrolled classes, fetch their details
        if (student.classIds && student.classIds.length > 0) {
          try {
            const classPromises = student.classIds.map(classId => classesAPI.getById(classId));
            const classResponses = await Promise.all(classPromises);
            
            pendingClasses = classResponses.map((classResponse, index) => {
              const classData = classResponse.data;
              
              // Calculate proper due date - 10th of current month
              const now = new Date();
              const currentMonth = now.getMonth();
              const currentYear = now.getFullYear();
              const dueDate = new Date(currentYear, currentMonth, 10);
              
              // If we're past the 10th, the payment is overdue
              const isOverdue = now.getDate() > 10;
              
              return {
                id: `${student.id}-${classData.id}`,
                classId: classData.id,
                name: classData.name,
                price: classData.price || 25000, // Use actual price or fallback
                dueDate: dueDate.toISOString(),
                overdue: isOverdue
              };
            });
          } catch (error) {
            console.error('Error fetching class details for student:', student.id, error);
            // Fallback to mock data if class fetching fails
            
            // Calculate proper due date - 10th of current month
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            const dueDate = new Date(currentYear, currentMonth, 10);
            const isOverdue = now.getDate() > 10;
            
            pendingClasses = student.classIds.map((classId, index) => ({
              id: `${student.id}-${classId}`,
              classId: classId,
              name: `Clase ${index + 1}`,
              price: 25000,
              dueDate: dueDate.toISOString(),
              overdue: isOverdue
            }));
          }
        }
        
        return {
          ...student,
          name: student.fullName || `${student.firstName} ${student.lastName}`,
          pendingClasses: pendingClasses
        };
      }));
      
      setStudents(studentsWithPending);
    } catch (error) {
      console.error('Error loading students:', error);
      showError('Error al cargar la lista de estudiantes');
      // Fallback to empty array
      setStudents([]);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleStudentChange = (studentId, studentOption) => {
    setSelectedStudent(studentOption);
    
    // Initialize custom amounts with default prices and auto-select ALL classes
    const initialAmounts = {};
    let allClassIds = [];
    
    if (studentOption && studentOption.pendingClasses) {
      studentOption.pendingClasses.forEach(cls => {
        initialAmounts[cls.id] = cls.price;
        allClassIds.push(cls.id);
      });
    }
    
    setFormData(prev => ({
      ...prev,
      studentId,
      selectedClasses: allClassIds, // Auto-select ALL pending classes
      customAmounts: initialAmounts
    }));
  };

  const handleAmountChange = (classId, amount) => {
    const numericAmount = parseFloat(amount) || 0;
    setFormData(prev => ({
      ...prev,
      customAmounts: {
        ...prev.customAmounts,
        [classId]: numericAmount
      }
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
    if (!selectedStudent || !selectedStudent.pendingClasses) return { baseAmount: 0, lateFee: 0, total: 0 };

    // Calculate for all pending classes (auto-selected)
    const baseAmount = selectedStudent.pendingClasses.reduce((sum, cls) => 
      sum + (formData.customAmounts[cls.id] || cls.price), 0
    );
    
    // Calcular recargo por mora (15% si hay clases vencidas)
    const hasOverdueClasses = selectedStudent.pendingClasses.some(cls => {
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
    
    if (!formData.paymentDate) {
      newErrors.paymentDate = 'Debe especificar la fecha de pago';
    }
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Debe seleccionar un método de pago';
    }
    
    // Validate custom amounts for all pending classes (auto-selected)
    if (selectedStudent && selectedStudent.pendingClasses) {
      const invalidAmounts = selectedStudent.pendingClasses.filter(cls => {
        const amount = formData.customAmounts[cls.id];
        return !amount || amount <= 0;
      });
      
      if (invalidAmounts.length > 0) {
        newErrors.customAmounts = 'Todos los montos deben ser mayores a 0';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const { total } = calculatePayment();
      
      // Get the payment month from the payment date (YYYY-MM format)
      const paymentMonth = formData.paymentDate.substring(0, 7); // "2024-01" format
      
      if (formData.selectedClasses.length === 1) {
        // Single class payment - use CreatePaymentRequest format
        const selectedClassId = formData.selectedClasses[0];
        const selectedClass = selectedStudent.pendingClasses.find(cls => cls.id === selectedClassId);
        const amount = parseFloat(formData.customAmounts[selectedClassId] || 0);
        
        const paymentData = {
          studentId: parseInt(formData.studentId),
          classId: selectedClass.classId, // Use the real classId, not the composite id
          amount: parseFloat(amount.toFixed(1)), // Send as decimal number, not string
          paymentMonth: paymentMonth,
          paymentDate: formData.paymentDate,
          paymentMethod: formData.paymentMethod, // Use selected payment method
          notes: formData.notes.trim() || null
        };
        
        console.log(' Enviando pago clase única:', paymentData);
        
        const response = await paymentsAPI.create(paymentData);
        
        showSuccess(`Pago de $${total.toLocaleString()} procesado exitosamente`);
        
        navigate('/payments');
      } else {
        // Multiple classes payment - use CreateMultiClassPaymentRequest format
        const totalAmount = parseFloat(total);
        
        // Convert paymentMonth to YearMonth format (YYYY-MM)
        const paymentMonthFormatted = formData.paymentDate.substring(0, 7); // "2025-08"
        
        const paymentData = {
          studentId: parseInt(formData.studentId),
          totalAmount: parseFloat(totalAmount.toFixed(1)), // BigDecimal as decimal number
          paymentMonth: paymentMonthFormatted, // YearMonth format YYYY-MM
          paymentDate: formData.paymentDate, // LocalDate format YYYY-MM-DD
          paymentMethod: formData.paymentMethod, // Use selected payment method
          notes: formData.notes.trim() || null
        };
        
        console.log(' Enviando pago multi-clase:', paymentData);
        
        const response = await paymentsAPI.createMultiClass(paymentData);
        
        showSuccess(`Pago de $${total.toLocaleString()} procesado exitosamente`);
        
        navigate('/payments');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      
      // Enhanced error handling with structured backend responses
      const handlePaymentError = (error) => {
        const errorData = error.response?.data;
        
        if (!errorData) {
          return 'Error al procesar el pago. Por favor, intente nuevamente.';
        }
        
        // If backend provides structured error with details
        if (errorData.details && errorData.details.errorType) {
          const { errorType, studentId, classId, paymentMonth } = errorData.details;
          
          switch (errorType) {
            case 'DUPLICATE_PAYMENT':
              return `⚠️ Ya existe un pago registrado para este estudiante en esta clase para el mes seleccionado.\n\n${errorData.message}`;
              
            case 'STUDENT_NOT_FOUND':
              return `❌ No se encontró el estudiante seleccionado (ID: ${studentId}). Por favor, seleccione un estudiante válido.`;
              
            case 'CLASS_NOT_FOUND':
              return `❌ No se encontró la clase seleccionada (ID: ${classId}). Por favor, actualice la página e intente nuevamente.`;
              
            case 'INVALID_PAYMENT_AMOUNT':
              return `💰 El monto del pago no es válido. Debe ser mayor a $0 y no exceder los límites permitidos.`;
              
            case 'PAYMENT_MONTH_INVALID':
              return `📅 El mes de pago "${paymentMonth}" no es válido. Por favor, seleccione una fecha válida.`;
              
            case 'STUDENT_NOT_ENROLLED':
              return `📚 El estudiante no está inscrito en la clase seleccionada. Verifique la inscripción antes de registrar el pago.`;
              
            case 'PAYMENT_ALREADY_PROCESSED':
              return `✅ Este pago ya fue procesado anteriormente. No es posible duplicar el registro.`;
              
            case 'INSUFFICIENT_PERMISSIONS':
              return `🔒 No tiene permisos suficientes para registrar este pago. Contacte al administrador.`;
              
            case 'VALIDATION_ERROR':
              return `📝 Error de validación: ${errorData.message}`;
              
            default:
              // For unknown error types, show the backend message
              return errorData.message || 'Error desconocido al procesar el pago.';
          }
        }
        
        // Fallback to backend message or generic error
        return errorData.message || errorData || 'Error al procesar el pago';
      };
      
      const errorMessage = handlePaymentError(error);
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
          
          <SearchableSelect
            label="Seleccionar Estudiante"
            options={students}
            value={formData.studentId}
            onChange={handleStudentChange}
            error={errors.studentId}
            required
            getOptionLabel={(student) => student.name}
            getOptionValue={(student) => student.id.toString()}
            renderOption={(student) => (
              <div className="flex items-center space-x-3">
                <Avatar src={student.avatar} name={student.name} size="sm" />
                <div>
                  <div className="font-medium text-gray-900">{student.name}</div>
                  <div className="text-xs text-gray-500">
                    {student.pendingClasses?.length || 0} clase{(student.pendingClasses?.length || 0) !== 1 ? 's' : ''} pendiente{(student.pendingClasses?.length || 0) !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            )}
            placeholder="Buscar estudiante por nombre..."
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

        {/* Clases a Pagar */}
        {selectedStudent && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Clases a Pagar ({selectedStudent.pendingClasses.length})
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Se procesará el pago de todas las clases pendientes de la estudiante.
            </p>
            
            <div className="space-y-3">
              {selectedStudent.pendingClasses.map((cls) => (
                <div key={cls.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{cls.name}</span>
                          {cls.overdue && <Badge variant="danger" size="sm">Vencida</Badge>}
                        </div>
                        <p className="text-xs text-gray-500">
                          Vence: {new Date(cls.dueDate).toLocaleDateString('es-CL')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Precio original: ${cls.price.toLocaleString()}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm font-medium text-gray-700">$</span>
                          <input
                            type="number"
                            min="0"
                            value={formData.customAmounts[cls.id] || cls.price}
                            onChange={(e) => handleAmountChange(cls.id, e.target.value)}
                            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Monto"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {errors.customAmounts && (
              <p className="mt-2 text-sm text-red-600">{errors.customAmounts}</p>
            )}
          </Card>
        )}

        {/* Detalles del Pago */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Pago</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Fecha de Pago"
              name="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={handleChange}
              error={errors.paymentDate}
              required
            />
            
            <Select
              label="Método de Pago"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              options={paymentMethods}
              error={errors.paymentMethod}
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
        {selectedStudent && selectedStudent.pendingClasses && selectedStudent.pendingClasses.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Pago</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Subtotal ({selectedStudent.pendingClasses.length} clase{selectedStudent.pendingClasses.length > 1 ? 's' : ''})</span>
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
            disabled={loading || !selectedStudent}
          >
            Procesar Pago ${total.toLocaleString()}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
