import { useState, useEffect, useCallback } from 'react';
import { useNotification } from '../contexts/NotificationContext';

// Hook para llamadas a API sin fallback - solo datos reales
export const useApi = (apiFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { showError } = useNotification();
  
  const { 
    immediate = true, 
    onSuccess, 
    onError,
    transform,
    showErrorNotification = true
  } = options;

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiFunction(...args);
      let responseData = response.data;
      
      // Aplicar transformación si se proporciona
      if (transform && typeof transform === 'function') {
        responseData = transform(responseData);
      }
      
      setData(responseData);
      
      if (onSuccess) {
        onSuccess(responseData);
      }
      
      return responseData;
    } catch (err) {
      console.error('API Error:', err);
      
      const errorMessage = err.response?.data?.message || err.message || 'Error de conexión con el servidor';
      setError(errorMessage);
      
      if (showErrorNotification) {
        showError(errorMessage);
      }
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError, transform, showError, showErrorNotification]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies);

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  return {
    data,
    loading,
    error,
    execute,
    refetch
  };
};

// Hook para listas de datos con paginación
export const useApiList = (apiFunction, dependencies = [], options = {}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const { showError } = useNotification();
  const { showErrorNotification = true } = options;

  const fetchData = useCallback(async (page = 1, limit = 10, filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFunction({
        page,
        limit,
        ...filters
      });

      const { data, pagination: paginationData } = response.data;
      
      setItems(data || []);
      setPagination(paginationData || {
        page,
        limit,
        total: data?.length || 0,
        totalPages: Math.ceil((data?.length || 0) / limit)
      });

      return response.data;
    } catch (err) {
      console.error('API List Error:', err);
      
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar los datos';
      setError(errorMessage);
      
      if (showErrorNotification) {
        showError(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, showError, showErrorNotification]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    items,
    loading,
    error,
    pagination,
    fetchData,
    refetch: () => fetchData(pagination.page, pagination.limit)
  };
};

// Hook para operaciones CRUD
export const useCrud = (apiService) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { showSuccess, showError } = useNotification();

  const create = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.create(data);
      showSuccess('Registro creado exitosamente');
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al crear el registro';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService, showSuccess, showError]);

  const update = useCallback(async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.update(id, data);
      showSuccess('Registro actualizado exitosamente');
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar el registro';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService, showSuccess, showError]);

  const remove = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await apiService.delete(id);
      showSuccess('Registro eliminado exitosamente');
      
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar el registro';
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService, showSuccess, showError]);

  return {
    create,
    update,
    remove,
    loading,
    error
  };
};

export default useApi;
