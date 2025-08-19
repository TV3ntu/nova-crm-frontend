import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://nova-crm-99ca.onrender.com';

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 segundos para Render
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variable para evitar múltiples redirects simultáneos
let isRedirecting = false;

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nova_crm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores de autenticación (401 y 403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      const originalRequest = error.config;
      
      // Evitar loops infinitos y múltiples redirects
      if (!originalRequest._retry && !isRedirecting) {
        originalRequest._retry = true;
        
        // Para 403, siempre redirigir al login (indica falta de autenticación)
        if (error.response?.status === 403) {
          console.warn('Error 403: Acceso denegado, redirigiendo al login...');
          isRedirecting = true;
          
          // Limpiar token
          localStorage.removeItem('nova_crm_token');
          
          // Redirigir después de un pequeño delay para evitar problemas de estado
          setTimeout(() => {
            isRedirecting = false;
            window.location.href = '/login';
          }, 100);
          
          return Promise.reject(error);
        }
        
        // Para 401, verificar si es un error de token expirado vs credenciales inválidas
        const errorMessage = error.response?.data?.message || '';
        const isTokenExpired = errorMessage.includes('expired') || 
                              errorMessage.includes('invalid') || 
                              errorMessage.includes('token');
        
        // Solo hacer logout automático si es claramente un problema de token
        if (isTokenExpired) {
          console.warn('Token expirado o inválido, cerrando sesión...');
          isRedirecting = true;
          
          // Limpiar token
          localStorage.removeItem('nova_crm_token');
          
          // Redirigir después de un pequeño delay para evitar problemas de estado
          setTimeout(() => {
            isRedirecting = false;
            window.location.href = '/login';
          }, 100);
        } else {
          // Para otros errores 401, no hacer logout automático
          console.warn('Error 401 sin logout automático:', errorMessage);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// ============================================================================
// SERVICIOS DE API
// ============================================================================

// Servicio de Autenticación
export const authAPI = {
  login: async (credentials) => {
    const response = await apiClient.post('/api/auth/login', credentials);
    return response;
  },
  
  logout: async () => {
    try {
      const response = await apiClient.post('/api/auth/logout');
      return response;
    } catch (error) {
      // No lanzar error si el logout falla en el servidor
      console.warn('Logout en servidor falló, continuando con logout local');
      return { data: { message: 'Logout local exitoso' } };
    }
  },
  
  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response;
  },

  refreshToken: async () => {
    const response = await apiClient.post('/api/auth/refresh');
    return response;
  }
};

// Servicio de Estudiantes
export const studentsAPI = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/api/students', { params });
    return response;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/api/students/${id}`);
    return response;
  },
  
  create: async (studentData) => {
    const response = await apiClient.post('/api/students', studentData);
    return response;
  },
  
  update: async (id, studentData) => {
    const response = await apiClient.put(`/api/students/${id}`, studentData);
    return response;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/api/students/${id}`);
    return response;
  },

  getPaymentHistory: async (id) => {
    const response = await apiClient.get(`/api/students/${id}/payments`);
    return response;
  },

  getAssignedClasses: async (id) => {
    const response = await apiClient.get(`/api/students/${id}/classes`);
    return response;
  },

  enrollStudent: async (studentId, classId) => {
    const response = await apiClient.post('/api/students/enroll', {
      studentId: parseInt(studentId),
      classId: parseInt(classId)
    });
    return response;
  },

  unenrollStudent: async (studentId, classId) => {
    const response = await apiClient.delete('/api/students/unenroll', {
      data: {
        studentId: parseInt(studentId),
        classId: parseInt(classId)
      }
    });
    return response;
  },

  getStudentClasses: async (id) => {
    const response = await apiClient.get(`/api/students/${id}/classes`);
    return response;
  },

  getStudentEnrollments: async (id) => {
    const response = await apiClient.get(`/api/students/${id}/enrollments`);
    return response;
  },

  getEnrollmentDetails: async (studentId, classId) => {
    const response = await apiClient.get(`/api/students/${studentId}/enrollment/${classId}`);
    return response;
  },

  getEnrollmentsByDateRange: async (startDate, endDate) => {
    const params = new URLSearchParams({ startDate, endDate });
    return apiClient.get(`/api/students/enrollments/date-range?${params}`);
  },

  getOutstandingPayments: async (id, month) => {
    const response = await apiClient.get(`/api/students/${id}/outstanding-payments/${month}`);
    return response;
  }
};

// Servicio de Profesores
export const teachersAPI = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/api/teachers', { params });
    return response;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/api/teachers/${id}`);
    return response;
  },
  
  create: async (teacherData) => {
    const response = await apiClient.post('/api/teachers', teacherData);
    return response;
  },
  
  update: async (id, teacherData) => {
    const response = await apiClient.put(`/api/teachers/${id}`, teacherData);
    return response;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/api/teachers/${id}`);
    return response;
  },

  getCompensationHistory: async (id, params = {}) => {
    const response = await apiClient.get(`/api/teachers/${id}/compensation`, { params });
    return response;
  },

  getAssignedClasses: async (id) => {
    const response = await apiClient.get(`/api/teachers/${id}/classes`);
    return response;
  }
};

// Servicio de Clases
export const classesAPI = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/api/classes', { params });
    return response;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/api/classes/${id}`);
    return response;
  },

  create: async (classData) => {
    const response = await apiClient.post('/api/classes', classData);
    return response;
  },

  update: async (id, classData) => {
    const response = await apiClient.put(`/api/classes/${id}`, classData);
    return response;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/api/classes/${id}`);
    return response;
  },

  getEnrolledStudents: async (id) => {
    const response = await apiClient.get(`/api/classes/${id}/students`);
    return response;
  },

  getSchedule: async (params = {}) => {
    const response = await apiClient.get('/api/classes/schedule', { params });
    return response;
  },

  assignTeacher: async (classId, teacherId) => {
    const response = await apiClient.post('/api/teachers/assign', {
      teacherId: parseInt(teacherId),
      classId: parseInt(classId)
    });
    return response;
  },

  unassignTeacher: async (classId, teacherId) => {
    const response = await apiClient.delete('/api/teachers/unassign', {
      data: {
        teacherId: parseInt(teacherId),
        classId: parseInt(classId)
      }
    });
    return response;
  },

  getAssignedTeachers: async (classId) => {
    const response = await apiClient.get(`/api/classes/${classId}/teachers`);
    return response;
  }
};

// Servicio de Pagos
export const paymentsAPI = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/api/payments', { params });
    return response;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/payments/${id}`);
    return response;
  },
  
  create: async (paymentData) => {
    const response = await apiClient.post('/api/payments', paymentData);
    return response;
  },

  createMultiClass: async (paymentData) => {
    const response = await apiClient.post('/api/payments/multi-class', paymentData);
    return response;
  },

  update: async (id, paymentData) => {
    const response = await apiClient.put(`/api/payments/${id}`, paymentData);
    return response;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/api/payments/${id}`);
    return response;
  },
  
  getOutstanding: async (params = {}) => {
    const response = await apiClient.get('/api/payments/outstanding', { params });
    return response;
  },

  processPayment: async (paymentData) => {
    const response = await apiClient.post('/api/payments/process', paymentData);
    return response;
  },

  calculateAmount: async (studentId, classIds) => {
    const response = await apiClient.post('/api/payments/calculate', {
      studentId,
      classIds
    });
    return response;
  },

  sendReminder: async (paymentId) => {
    const response = await apiClient.post(`/api/payments/${paymentId}/reminder`);
    return response;
  }
};

// Servicio de Reportes
export const reportsAPI = {
  getDashboard: async (period = 'month') => {
    const response = await apiClient.get('/api/dashboard');
    return response;
  },

  getDashboardRevenueChart: async () => {
    const response = await apiClient.get('/api/dashboard/revenue-chart');
    return response;
  },

  getDashboardClassDistribution: async () => {
    const response = await apiClient.get('/api/dashboard/class-distribution');
    return response;
  },

  getFinancial: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/api/reports/financial${queryString ? `?${queryString}` : ''}`);
  },
  
  getTeacherCompensation: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/api/reports/teacher-compensation${queryString ? `?${queryString}` : ''}`);
  },
  
  getStudentAnalytics: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/api/reports/student-analytics${queryString ? `?${queryString}` : ''}`);
  },
  
  getClassPerformance: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/api/reports/class-performance${queryString ? `?${queryString}` : ''}`);
  },
  
  getPaymentAnalytics: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/api/reports/payment-analytics${queryString ? `?${queryString}` : ''}`);
  },
  
  getOutstandingPayments: async (month) => {
    // month should be in YYYY-MM format (YearMonth)
    const response = await apiClient.get(`/api/reports/outstanding-payments/${month}`);
    return response;
  },
  
  getRevenue: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/api/reports/revenue${queryString ? `?${queryString}` : ''}`);
  },
  
  exportReport: (reportType, params = {}) => {
    const queryString = new URLSearchParams({
      ...params,
      type: reportType
    }).toString();
    return apiClient.get(`/api/reports/export?${queryString}`, {
      responseType: 'blob'
    });
  }
};

// Servicio de Configuración
export const settingsAPI = {
  getStudioSettings: async () => {
    const response = await apiClient.get('/api/settings/studio');
    return response;
  },

  updateStudioSettings: async (settings) => {
    const response = await apiClient.put('/api/settings/studio', settings);
    return response;
  },

  getPaymentSettings: async () => {
    const response = await apiClient.get('/api/settings/payments');
    return response;
  },

  updatePaymentSettings: async (settings) => {
    const response = await apiClient.put('/api/settings/payments', settings);
    return response;
  },

  getUserSettings: async () => {
    const response = await apiClient.get('/api/settings/user');
    return response;
  },

  updateUserSettings: async (settings) => {
    const response = await apiClient.put('/api/settings/user', settings);
    return response;
  }
};

// Servicio de Notificaciones
export const notificationsAPI = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/api/notifications', { params });
    return response;
  },

  markAsRead: async (id) => {
    const response = await apiClient.put(`/api/notifications/${id}/read`);
    return response;
  },

  markAllAsRead: async () => {
    const response = await apiClient.put('/api/notifications/read-all');
    return response;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/api/notifications/${id}`);
    return response;
  }
};

// Servicio de Archivos/Upload
export const filesAPI = {
  uploadAvatar: async (file, entityType, entityId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', entityType);
    formData.append('entityId', entityId);

    const response = await apiClient.post('/api/files/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  deleteFile: async (fileId) => {
    const response = await apiClient.delete(`/api/files/${fileId}`);
    return response;
  }
};

export default apiClient;
