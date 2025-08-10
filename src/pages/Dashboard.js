import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  CalendarDaysIcon, 
  ExclamationTriangleIcon, 
  CurrencyDollarIcon,
  PlusIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApi } from '../hooks/useApi';
import { reportsAPI } from '../services/api';

const Dashboard = () => {
  const {
    data: dashboardData,
    loading,
    error,
    refetch
  } = useApi(
    () => reportsAPI.getDashboard('month'),
    [],
    {
      transform: (data) => ({
        kpis: data.kpis || {
          totalStudents: 0,
          todayClasses: 0,
          pendingPayments: 0,
          monthlyRevenue: 0
        },
        revenueChart: data.revenueChart || [],
        studentsPerClass: data.studentsPerClass || [],
        upcomingClasses: data.upcomingClasses || [],
        alerts: data.alerts || []
      })
    }
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar el dashboard</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={refetch} variant="primary">
          Reintentar
        </Button>
      </div>
    );
  }

  const { kpis, revenueChart, studentsPerClass, upcomingClasses, alerts } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen general del estudio</p>
        </div>
        <div className="flex space-x-3">
          <Button as={Link} to="/students/new" variant="secondary" icon={PlusIcon}>
            Nuevo Estudiante
          </Button>
          <Button as={Link} to="/payments/new" icon={PlusIcon}>
            Nuevo Pago
          </Button>
        </div>
      </div>

      {/* Alertas */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
              alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' : 'bg-blue-50 border-blue-400'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className={`h-5 w-5 ${
                    alert.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                  }`} />
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${
                    alert.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                  }`}>
                    {alert.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Estudiantes Activos</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalStudents}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <CalendarDaysIcon className="h-6 w-6 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clases Hoy</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.todayClasses}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pagos Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.pendingPayments}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ingresos del Mes</p>
              <p className="text-2xl font-bold text-gray-900">${kpis.monthlyRevenue?.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+8.3%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos Mensuales</h3>
          {revenueChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Ingresos']} />
                <Bar dataKey="revenue" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>No hay datos de ingresos disponibles</p>
            </div>
          )}
        </Card>

        {/* Students per Class */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estudiantes por Clase</h3>
          {studentsPerClass.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentsPerClass}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#a855f7" name="Estudiantes" />
                <Bar dataKey="capacity" fill="#e5e7eb" name="Capacidad" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>No hay datos de clases disponibles</p>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions & Upcoming Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <Button as={Link} to="/students/new" variant="ghost" className="w-full justify-start">
              <PlusIcon className="h-4 w-4 mr-2" />
              Registrar Nuevo Estudiante
            </Button>
            <Button as={Link} to="/payments/new" variant="ghost" className="w-full justify-start">
              <CurrencyDollarIcon className="h-4 w-4 mr-2" />
              Procesar Pago
            </Button>
            <Button as={Link} to="/classes/new" variant="ghost" className="w-full justify-start">
              <CalendarDaysIcon className="h-4 w-4 mr-2" />
              Programar Clase
            </Button>
            <Button as={Link} to="/reports" variant="ghost" className="w-full justify-start">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
              Ver Reportes
            </Button>
          </div>
        </Card>

        {/* Upcoming Classes */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Clases</h3>
          {upcomingClasses && upcomingClasses.length > 0 ? (
            <div className="space-y-3">
              {upcomingClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{classItem.name}</p>
                    <p className="text-sm text-gray-600">{classItem.time} - {classItem.teacher}</p>
                  </div>
                  <Badge variant="primary" size="sm">
                    {classItem.students} estudiantes
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay clases programadas para hoy</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
