import React, { useState, useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { Cog6ToothIcon, BuildingStorefrontIcon, CreditCardIcon, UserGroupIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Settings = () => {
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('studio');
  
  const [studioSettings, setStudioSettings] = useState({
    name: 'NOVA Dance Studio',
    address: 'Av. Providencia 1234, Santiago, Chile',
    phone: '+56 2 2345 6789',
    email: 'info@novadance.com',
    website: 'www.novadance.com',
    description: 'Estudio de danza profesional con más de 10 años de experiencia'
  });

  const [paymentSettings, setPaymentSettings] = useState({
    paymentDueDay: '10',
    lateFeePercentage: '15',
    gracePeriodDays: '3',
    acceptedMethods: ['efectivo', 'transferencia', 'tarjeta'],
    bankAccount: 'Banco Estado - 12345678-9',
    paypalEmail: 'pagos@novadance.com'
  });

  const [userSettings, setUserSettings] = useState({
    maxUsers: '5',
    sessionTimeout: '24',
    requirePasswordChange: true,
    enableNotifications: true,
    backupFrequency: 'daily'
  });

  const tabs = [
    { id: 'studio', name: 'Información del Estudio', icon: BuildingStorefrontIcon },
    { id: 'payments', name: 'Configuración de Pagos', icon: CreditCardIcon },
    { id: 'users', name: 'Usuarios y Seguridad', icon: UserGroupIcon },
    { id: 'system', name: 'Sistema', icon: Cog6ToothIcon }
  ];

  const handleStudioChange = (e) => {
    const { name, value } = e.target;
    setStudioSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'acceptedMethods') {
      setPaymentSettings(prev => ({
        ...prev,
        acceptedMethods: checked 
          ? [...prev.acceptedMethods, value]
          : prev.acceptedMethods.filter(method => method !== value)
      }));
    } else {
      setPaymentSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (section) => {
    setLoading(true);
    
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showSuccess(`Configuración de ${section} guardada exitosamente`);
    } catch (error) {
      showError('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const renderStudioSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nombre del Estudio"
            name="name"
            value={studioSettings.name}
            onChange={handleStudioChange}
            required
          />
          
          <Input
            label="Teléfono"
            name="phone"
            value={studioSettings.phone}
            onChange={handleStudioChange}
            required
          />
          
          <Input
            label="Email"
            name="email"
            type="email"
            value={studioSettings.email}
            onChange={handleStudioChange}
            required
          />
          
          <Input
            label="Sitio Web"
            name="website"
            value={studioSettings.website}
            onChange={handleStudioChange}
          />
          
          <Input
            label="Dirección"
            name="address"
            value={studioSettings.address}
            onChange={handleStudioChange}
            containerClassName="md:col-span-2"
            required
          />
          
          <Input
            label="Descripción"
            name="description"
            value={studioSettings.description}
            onChange={handleStudioChange}
            containerClassName="md:col-span-2"
          />
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={() => handleSave('estudio')} loading={loading}>
            Guardar Cambios
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Pagos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Día de Vencimiento"
            name="paymentDueDay"
            type="number"
            min="1"
            max="31"
            value={paymentSettings.paymentDueDay}
            onChange={handlePaymentChange}
            helperText="Día del mes en que vencen los pagos"
            required
          />
          
          <Input
            label="Recargo por Mora (%)"
            name="lateFeePercentage"
            type="number"
            min="0"
            max="100"
            value={paymentSettings.lateFeePercentage}
            onChange={handlePaymentChange}
            helperText="Porcentaje de recargo por pago tardío"
            required
          />
          
          <Input
            label="Días de Gracia"
            name="gracePeriodDays"
            type="number"
            min="0"
            max="30"
            value={paymentSettings.gracePeriodDays}
            onChange={handlePaymentChange}
            helperText="Días adicionales antes del recargo"
          />
        </div>
        
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">Métodos de Pago Aceptados</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: 'efectivo', label: 'Efectivo' },
              { value: 'transferencia', label: 'Transferencia' },
              { value: 'tarjeta', label: 'Tarjeta' },
              { value: 'cheque', label: 'Cheque' }
            ].map((method) => (
              <label key={method.value} className="flex items-center">
                <input
                  type="checkbox"
                  name="acceptedMethods"
                  value={method.value}
                  checked={paymentSettings.acceptedMethods.includes(method.value)}
                  onChange={handlePaymentChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-900">{method.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Cuenta Bancaria"
            name="bankAccount"
            value={paymentSettings.bankAccount}
            onChange={handlePaymentChange}
            helperText="Para transferencias bancarias"
          />
          
          <Input
            label="Email PayPal"
            name="paypalEmail"
            type="email"
            value={paymentSettings.paypalEmail}
            onChange={handlePaymentChange}
            helperText="Para pagos en línea"
          />
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={() => handleSave('pagos')} loading={loading}>
            Guardar Cambios
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderUserSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Usuarios</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Máximo de Usuarios"
            name="maxUsers"
            type="number"
            min="1"
            max="20"
            value={userSettings.maxUsers}
            onChange={handleUserChange}
            helperText="Número máximo de usuarios del sistema"
          />
          
          <Input
            label="Tiempo de Sesión (horas)"
            name="sessionTimeout"
            type="number"
            min="1"
            max="168"
            value={userSettings.sessionTimeout}
            onChange={handleUserChange}
            helperText="Tiempo antes de cerrar sesión automáticamente"
          />
        </div>
        
        <div className="mt-6 space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="requirePasswordChange"
              checked={userSettings.requirePasswordChange}
              onChange={handleUserChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-900">
              Requerir cambio de contraseña cada 90 días
            </span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              name="enableNotifications"
              checked={userSettings.enableNotifications}
              onChange={handleUserChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-900">
              Habilitar notificaciones del sistema
            </span>
          </label>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={() => handleSave('usuarios')} loading={loading}>
            Guardar Cambios
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración del Sistema</h3>
        
        <div className="space-y-6">
          <Select
            label="Frecuencia de Respaldo"
            name="backupFrequency"
            value={userSettings.backupFrequency}
            onChange={handleUserChange}
            options={[
              { value: 'daily', label: 'Diario' },
              { value: 'weekly', label: 'Semanal' },
              { value: 'monthly', label: 'Mensual' }
            ]}
            helperText="Frecuencia de respaldo automático de datos"
          />
          
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Acciones del Sistema</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="secondary" className="justify-start">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Crear Respaldo Manual
              </Button>
              
              <Button variant="secondary" className="justify-start">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Restaurar Respaldo
              </Button>
              
              <Button variant="secondary" className="justify-start">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar Datos
              </Button>
              
              <Button variant="secondary" className="justify-start">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Limpiar Logs
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={() => handleSave('sistema')} loading={loading}>
            Guardar Cambios
          </Button>
        </div>
      </Card>
      
      {/* System Info */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Versión:</strong> 1.0.0</p>
            <p><strong>Último Respaldo:</strong> 15/01/2024 03:00</p>
            <p><strong>Base de Datos:</strong> PostgreSQL 14.2</p>
          </div>
          <div>
            <p><strong>Servidor:</strong> AWS EC2</p>
            <p><strong>Espacio Usado:</strong> 2.3 GB / 10 GB</p>
            <p><strong>Usuarios Activos:</strong> 3 / 5</p>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600">Administra la configuración del sistema</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center py-2 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'studio' && renderStudioSettings()}
        {activeTab === 'payments' && renderPaymentSettings()}
        {activeTab === 'users' && renderUserSettings()}
        {activeTab === 'system' && renderSystemSettings()}
      </div>
    </div>
  );
};

export default Settings;
