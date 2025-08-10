import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  AcademicCapIcon, 
  CurrencyDollarIcon, 
  CalendarDaysIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  BanknotesIcon,
  TrophyIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useApi } from '../hooks/useApi';
import { reportsAPI } from '../services/api';

const Dashboard = () => {
  const [period, setPeriod] = useState('month');

  // Main dashboard data
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard
  } = useApi(
    () => reportsAPI.getDashboard(period),
    [period],
    {
      transform: (data) => ({
        kpis: data.kpis || {},
        recentActivity: data.recentActivity || [],
        alerts: data.alerts || [],
        quickStats: data.quickStats || {}
      })
    }
  );

  // Revenue chart data
  const {
    data: revenueData,
    loading: revenueLoading,
    error: revenueError,
    refetch: refetchRevenue
  } = useApi(
    () => reportsAPI.getDashboardRevenueChart(),
    [],
    {
      transform: (data) => ({
        months: data.months || [],
        totalRevenue: data.totalRevenue || 0,
        averageMonthly: data.averageMonthly || 0
      })
    }
  );

  // Class distribution data
  const {
    data: classData,
    loading: classLoading,
    error: classError,
    refetch: refetchClass
  } = useApi(
    () => reportsAPI.getDashboardClassDistribution(),
    [],
    {
      transform: (data) => ({
        classes: data.classes || [],
        totalCapacity: data.totalCapacity || 0,
        totalEnrolled: data.totalEnrolled || 0,
        averageOccupancy: data.averageOccupancy || 0
      })
    }
  );

  const COLORS = ['#f59e0b', '#a855f7', '#ec4899', '#10b981', '#3b82f6', '#f97316', '#84cc16'];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'LATE':
        return <Badge variant="warning">Atrasado</Badge>;
      case 'PAID':
        return <Badge variant="success">Pagado</Badge>;
      case 'PENDING':
        return <Badge variant="primary">Pendiente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const refetchAll = () => {
    refetchDashboard();
    refetchRevenue();
    refetchClass();
  };

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const kpis = dashboardData?.kpis || {};
  const recentActivity = dashboardData?.recentActivity || [];
  const alerts = dashboardData?.alerts || [];
  const quickStats = dashboardData?.quickStats || {};
  const revenueChart = revenueData?.months || [];
  const classes = classData?.classes || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen general del estudio de danza NOVA</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="quarter">Este trimestre</option>
            <option value="year">Este año</option>
          </select>
          <Button onClick={refetchAll} variant="secondary" size="sm">
            Actualizar
          </Button>
        </div>
      </div>

      {/* System Status - Success */}
      {!dashboardError && !revenueError && !classError && (
        <Card className="p-4 border-l-4 border-green-500 bg-green-50">
          <div className="flex items-start space-x-3">
            <CheckCircleIcon className="h-5 w-5 mt-0.5 text-green-500" />
            <div className="flex-1">
              <h3 className="font-medium text-green-900">
                Sistema NOVA CRM - Completamente Operacional
              </h3>
              <p className="text-sm mt-1 text-green-700">
                Todos los endpoints del dashboard están funcionando correctamente. Datos en tiempo real disponibles.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <Card key={index} className={`p-4 border-l-4 ${
              alert.type === 'error' ? 'border-red-500 bg-red-50' :
              alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
              'border-blue-500 bg-blue-50'
            }`}>
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className={`h-5 w-5 mt-0.5 ${
                  alert.type === 'error' ? 'text-red-500' :
                  alert.type === 'warning' ? 'text-yellow-500' :
                  'text-blue-500'
                }`} />
                <div className="flex-1">
                  <h3 className={`font-medium ${
                    alert.type === 'error' ? 'text-red-900' :
                    alert.type === 'warning' ? 'text-yellow-900' :
                    'text-blue-900'
                  }`}>
                    {alert.message}
                  </h3>
                  {alert.count && (
                    <p className={`text-sm mt-1 ${
                      alert.type === 'error' ? 'text-red-700' :
                      alert.type === 'warning' ? 'text-yellow-700' :
                      'text-blue-700'
                    }`}>
                      {alert.count} elementos requieren atención
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalStudents || 0}</p>
              <p className="text-sm text-blue-600">
                {quickStats.activeStudentsPercentage || 0}% activos
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <CalendarDaysIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clases Hoy</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.classesToday || 0}</p>
              <p className="text-sm text-green-600">
                {quickStats.averageClassSize || 0} estudiantes promedio
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-primary-500">
              <CurrencyDollarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ingresos del Mes</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(kpis.monthlyRevenue)}</p>
              <p className="text-sm text-primary-600">
                {quickStats.monthlyGrowth || '0%'} vs mes anterior
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500">
              <BanknotesIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pagos Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.outstandingPayments || 0}</p>
              <p className="text-sm text-red-600">
                {formatCurrency(kpis.outstandingAmount)} total
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-secondary-500">
              <AcademicCapIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Profesores</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalTeachers || 0}</p>
              <p className="text-sm text-secondary-600">Equipo activo</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <CalendarDaysIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Clases</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalClasses || 0}</p>
              <p className="text-sm text-purple-600">Clases programadas</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-indigo-500">
              <TrophyIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ocupación Promedio</p>
              <p className="text-2xl font-bold text-gray-900">
                {classData?.averageOccupancy?.toFixed(1) || 0}%
              </p>
              <p className="text-sm text-indigo-600">
                {classData?.totalEnrolled || 0}/{classData?.totalCapacity || 0} estudiantes
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Ingresos por Mes</h3>
            {revenueLoading && <LoadingSpinner size="sm" />}
          </div>
          {revenueChart && revenueChart.length > 0 ? (
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(value), 'Ingresos']} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total Ingresos</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(revenueData?.totalRevenue)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Promedio Mensual</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(revenueData?.averageMonthly)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p>No hay datos de ingresos disponibles</p>
                {revenueError && (
                  <Button onClick={refetchRevenue} variant="ghost" size="sm" className="mt-2">
                    Reintentar
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Class Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Distribución de Clases</h3>
            {classLoading && <LoadingSpinner size="sm" />}
          </div>
          {classes && classes.length > 0 ? (
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={classes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="className" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Estudiantes']} />
                  <Bar dataKey="studentCount" fill="#a855f7" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
                {classes.slice(0, 3).map((classItem, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{classItem.className}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900 font-medium">
                        {classItem.studentCount}/{classItem.maxStudents}
                      </span>
                      <Badge variant={classItem.occupancyPercentage > 80 ? 'success' : 'primary'} size="sm">
                        {classItem.occupancyPercentage.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p>No hay datos de clases disponibles</p>
                {classError && (
                  <Button onClick={refetchClass} variant="ghost" size="sm" className="mt-2">
                    Reintentar
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <Button
              as={Link}
              to="/students/new"
              variant="primary"
              className="w-full justify-start"
              icon={UserGroupIcon}
            >
              Agregar Nuevo Estudiante
            </Button>
            <Button
              as={Link}
              to="/classes/new"
              variant="secondary"
              className="w-full justify-start"
              icon={CalendarDaysIcon}
            >
              Programar Nueva Clase
            </Button>
            <Button
              as={Link}
              to="/payments/new"
              variant="ghost"
              className="w-full justify-start"
              icon={CurrencyDollarIcon}
            >
              Registrar Pago
            </Button>
            <Button
              as={Link}
              to="/reports"
              variant="ghost"
              className="w-full justify-start"
              icon={ChartBarIcon}
            >
              Ver Reportes
            </Button>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
            <Button as={Link} to="/payments" variant="ghost" size="sm">
              Ver todos
            </Button>
          </div>
          {recentActivity && recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{activity.studentName}</p>
                    <p className="text-sm text-gray-600">{formatDate(activity.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(activity.amount)}</p>
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ClockIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p>No hay actividad reciente</p>
              <p className="text-sm">Las actividades aparecerán aquí cuando uses el sistema</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
