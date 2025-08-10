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
    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      localStorage.removeItem('nova_crm_token');
      window.location.href = '/login';
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
    const response = await apiClient.post('/api/auth/logout');
    return response;
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

  enrollInClass: async (studentId, classId) => {
    const response = await apiClient.post(`/api/students/${studentId}/enroll`, { classId });
    return response;
  },

  unenrollFromClass: async (studentId, classId) => {
    const response = await apiClient.delete(`/api/students/${studentId}/enroll/${classId}`);
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
    const response = await apiClient.get(`/api/reports/dashboard?period=${period}`);
    return response;
  },
  
  getFinancial: async (params = {}) => {
    const response = await apiClient.get('/api/reports/financial', { params });
    return response;
  },
  
  getTeacherCompensation: async (params = {}) => {
    const response = await apiClient.get('/api/reports/teacher-compensation', { params });
    return response;
  },

  getStudentAnalytics: async (params = {}) => {
    const response = await apiClient.get('/api/reports/student-analytics', { params });
    return response;
  },

  getClassPerformance: async (params = {}) => {
    const response = await apiClient.get('/api/reports/class-performance', { params });
    return response;
  },

  getPaymentAnalytics: async (params = {}) => {
    const response = await apiClient.get('/api/reports/payment-analytics', { params });
    return response;
  },

  exportReport: async (reportType, params = {}) => {
    const response = await apiClient.get(`/api/reports/export/${reportType}`, {
      params,
      responseType: 'blob'
    });
    return response;
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
