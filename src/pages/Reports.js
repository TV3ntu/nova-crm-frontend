import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon, 
  ExclamationTriangleIcon, 
  CurrencyDollarIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportData, setReportData] = useState({});

  useEffect(() => {
    const loadReportData = async () => {
      setLoading(true);
      
      setTimeout(() => {
        setReportData({
          summary: {
            totalRevenue: 456000,
            totalStudents: 118,
            totalClasses: 25,
            averageClassSize: 14.2,
            outstandingPayments: 23,
            outstandingAmount: 28750
          },
          monthlyRevenue: [
            { month: 'Jul', revenue: 380000, target: 400000 },
            { month: 'Ago', revenue: 420000, target: 400000 },
            { month: 'Sep', revenue: 395000, target: 400000 },
            { month: 'Oct', revenue: 445000, target: 400000 },
            { month: 'Nov', revenue: 430000, target: 400000 },
            { month: 'Dic', revenue: 456000, target: 400000 }
          ],
          classPerformance: [
            { name: 'Ballet Clásico', students: 35, revenue: 28000, capacity: 85 },
            { name: 'Jazz', students: 28, revenue: 19600, capacity: 93 },
            { name: 'Hip Hop', students: 22, revenue: 16500, capacity: 88 },
            { name: 'Contemporáneo', students: 18, revenue: 14400, capacity: 75 },
            { name: 'Salsa', students: 15, revenue: 9000, capacity: 94 }
          ],
          paymentStatus: [
            { name: 'Al día', value: 95, color: '#10B981' },
            { name: 'Pendiente', value: 15, color: '#F59E0B' },
            { name: 'Vencido', value: 8, color: '#EF4444' }
          ],
          teacherCompensation: [
            { name: 'Elena Martínez', compensation: 450000, classes: 4, students: 47 },
            { name: 'Carmen López', compensation: 285000, classes: 3, students: 38 },
            { name: 'Ana Rodríguez', compensation: 225000, classes: 2, students: 29 }
          ]
        });
        setLoading(false);
      }, 1000);
    };

    loadReportData();
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const { summary, monthlyRevenue, classPerformance, paymentStatus, teacherCompensation } = reportData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes y Analytics</h1>
          <p className="text-gray-600">Análisis detallado del rendimiento del estudio</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-field"
          >
            <option value="week">Esta Semana</option>
            <option value="month">Este Mes</option>
            <option value="quarter">Este Trimestre</option>
            <option value="year">Este Año</option>
          </select>
          <Button variant="secondary" icon={DocumentArrowDownIcon}>
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900">${summary.totalRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12.5%</span>
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
              <p className="text-sm font-medium text-gray-600">Estudiantes Activos</p>
              <p className="text-2xl font-bold text-gray-900">{summary.totalStudents}</p>
              <div className="flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+8.3%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Promedio por Clase</p>
              <p className="text-2xl font-bold text-gray-900">{summary.averageClassSize}</p>
              <p className="text-sm text-gray-500">estudiantes</p>
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
              <p className="text-2xl font-bold text-gray-900">{summary.outstandingPayments}</p>
              <p className="text-sm text-red-600">${summary.outstandingAmount.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/reports/outstanding" className="block">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pagos Pendientes</h3>
                <p className="text-sm text-gray-600">Ver estudiantes con pagos vencidos</p>
                <Badge variant="danger" className="mt-2">{summary.outstandingPayments} pendientes</Badge>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            </div>
          </Card>
        </Link>

        <Link to="/reports/teacher-compensation" className="block">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Compensación Profesoras</h3>
                <p className="text-sm text-gray-600">Análisis de compensaciones mensuales</p>
                <Badge variant="info" className="mt-2">3 profesoras</Badge>
              </div>
              <AcademicCapIcon className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
        </Link>

        <Link to="/reports/financial" className="block">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Reporte Financiero</h3>
                <p className="text-sm text-gray-600">Análisis financiero detallado</p>
                <Badge variant="success" className="mt-2">+12.5% crecimiento</Badge>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Ingresos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Ingresos']} />
              <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} />
              <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Payment Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Pagos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentStatus}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {paymentStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Class Performance */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento por Clase</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={classPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#f59e0b" name="Estudiantes" />
              <Bar dataKey="capacity" fill="#a855f7" name="Capacidad %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Teacher Performance Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Rendimiento de Profesoras</h3>
          <Button as={Link} to="/reports/teacher-compensation" variant="ghost" size="sm">
            Ver Detalle
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profesora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clases
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiantes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compensación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promedio/Clase
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teacherCompensation.map((teacher, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {teacher.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {teacher.classes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {teacher.students}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${teacher.compensation.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {Math.round(teacher.students / teacher.classes)} estudiantes
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
