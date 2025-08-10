import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useApi } from '../hooks/useApi';
import { reportsAPI } from '../services/api';

const Reports = () => {
  const [period, setPeriod] = useState('month');

  const {
    data: reportsData,
    loading,
    error,
    refetch
  } = useApi(
    () => reportsAPI.getDashboard(period),
    [period],
    {
      transform: (data) => ({
        kpis: data.kpis || {
          totalStudents: 0,
          totalRevenue: 0,
          totalClasses: 0,
          averageAttendance: 0
        },
        revenueChart: data.revenueChart || [],
        studentsPerClass: data.studentsPerClass || [],
        paymentStatus: data.paymentStatus || [],
        monthlyGrowth: data.monthlyGrowth || [],
        topClasses: data.topClasses || []
      })
    }
  );

  const COLORS = ['#f59e0b', '#a855f7', '#ec4899', '#10b981', '#3b82f6'];

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
        <ChartBarIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar reportes</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={refetch} variant="primary">
          Reintentar
        </Button>
      </div>
    );
  }

  const { kpis, revenueChart, studentsPerClass, paymentStatus, monthlyGrowth, topClasses } = reportsData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes y Análisis</h1>
          <p className="text-gray-600">Análisis detallado del rendimiento del estudio</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            options={[
              { value: 'week', label: 'Esta semana' },
              { value: 'month', label: 'Este mes' },
              { value: 'quarter', label: 'Este trimestre' },
              { value: 'year', label: 'Este año' }
            ]}
          />
          <Button as={Link} to="/reports/export" variant="secondary" icon={DocumentTextIcon}>
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalStudents}</p>
              <div className="flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12% vs mes anterior</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900">${kpis.totalRevenue?.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+8.3% vs mes anterior</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <CalendarDaysIcon className="h-6 w-6 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clases Activas</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalClasses}</p>
              <div className="flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+2 nuevas</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Asistencia Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.averageAttendance}%</p>
              <div className="flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+3.2% vs mes anterior</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos por Período</h3>
          {revenueChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
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

        {/* Payment Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Pagos</h3>
          {paymentStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>No hay datos de pagos disponibles</p>
            </div>
          )}
        </Card>
      </div>

      {/* Students per Class */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estudiantes por Clase</h3>
        {studentsPerClass.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
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

      {/* Quick Reports */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/reports/outstanding-payments">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Pagos Pendientes</h3>
                <p className="text-sm text-gray-600">Ver estudiantes con pagos vencidos</p>
                <div className="mt-2">
                  <Badge variant="danger">
                    {paymentStatus.find(p => p.name === 'Vencido')?.value || 0} pagos
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/reports/teacher-compensation">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Compensación Profesores</h3>
                <p className="text-sm text-gray-600">Reporte de pagos a profesores</p>
                <div className="mt-2">
                  <Badge variant="primary">Mensual</Badge>
                </div>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/reports/financial">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Reporte Financiero</h3>
                <p className="text-sm text-gray-600">Análisis completo de ingresos y gastos</p>
                <div className="mt-2">
                  <Badge variant="success">Actualizado</Badge>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Top Classes */}
      {topClasses.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Clases Más Populares</h3>
          <div className="space-y-3">
            {topClasses.map((classItem, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Badge variant="primary">#{index + 1}</Badge>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{classItem.name}</p>
                    <p className="text-sm text-gray-600">{classItem.teacher}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{classItem.students} estudiantes</p>
                  <p className="text-sm text-gray-600">{classItem.occupancy}% ocupación</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Reports;
