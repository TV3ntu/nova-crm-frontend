import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  ChartBarIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Select from '../components/common/Select';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useApi } from '../hooks/useApi';
import { reportsAPI } from '../services/api';

const TeacherCompensation = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [compensationData, setCompensationData] = useState([]);

  const {
    data: apiData,
    loading,
    error,
    refetch
  } = useApi(
    () => reportsAPI.getTeacherCompensation(selectedPeriod),
    [selectedPeriod],
    {
      transform: (data) => data
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
        <UserGroupIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar compensación de profesores</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={refetch} variant="primary">
          Reintentar
        </Button>
      </div>
    );
  }

  const totalCompensationPaid = compensationData.reduce((sum, teacher) => sum + teacher.totalCompensation, 0);
  const totalRevenueGenerated = compensationData.reduce((sum, teacher) => sum + teacher.totalRevenue, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount || 0);
  };

  const getCompensationRate = (teacher) => {
    // 50% for regular teachers, 100% for studio owners
    return teacher.isOwner ? '100%' : '50%';
  };

  const getCompensationBadge = (amount, average) => {
    if (amount > average * 1.2) return <Badge variant="success">Alto</Badge>;
    if (amount < average * 0.8) return <Badge variant="warning">Bajo</Badge>;
    return <Badge variant="primary">Promedio</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button as={Link} to="/reports" variant="ghost" size="sm" icon={ArrowLeftIcon}>
            Volver a Reportes
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Compensación de Profesores</h1>
            <p className="text-gray-600">Análisis de pagos y rendimiento de profesores</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            options={[
              { value: '2024-01', label: 'Enero 2024' },
              { value: '2023-12', label: 'Diciembre 2023' },
              { value: '2023-11', label: 'Noviembre 2023' }
            ]}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Compensación Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCompensationPaid)}</p>
              <p className="text-sm text-green-600">Período actual</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Clases</p>
              <p className="text-2xl font-bold text-gray-900">{compensationData.reduce((sum, teacher) => sum + teacher.classes.length, 0)}</p>
              <p className="text-sm text-blue-600">Clases impartidas</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
              <p className="text-2xl font-bold text-gray-900">{compensationData.reduce((sum, teacher) => sum + teacher.classes.reduce((sum, cls) => sum + cls.students, 0), 0)}</p>
              <p className="text-sm text-primary-600">Estudiantes atendidos</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Promedio por Clase</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(Math.round(totalCompensationPaid / compensationData.reduce((sum, teacher) => sum + teacher.classes.length, 0)))}</p>
              <p className="text-sm text-secondary-600">Compensación media</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Teacher Compensation Details */}
      <div className="space-y-6">
        {compensationData.map((teacherData) => (
          <Card key={teacherData.id} className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-semibold text-gray-900">{teacherData.teacher.name}</h3>
                    {teacherData.teacher.isOwner && (
                      <StarIcon className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-gray-600">{teacherData.teacher.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant={teacherData.teacher.isOwner ? 'success' : 'info'}>
                      {getCompensationRate(teacherData.teacher)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {teacherData.classes.length} clase{teacherData.classes.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-3xl font-bold text-primary-600">
                  {formatCurrency(teacherData.totalCompensation)}
                </p>
                <p className="text-sm text-gray-600">
                  de {formatCurrency(teacherData.totalRevenue)} generados
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Class Breakdown */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Desglose por Clase</h4>
                <div className="space-y-3">
                  {teacherData.classes.map((cls, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-900">{cls.name}</h5>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(cls.compensation)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{cls.students} estudiantes</span>
                        <span>Ingresos: {formatCurrency(cls.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Trend */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Tendencia Mensual</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={teacherData.monthlyHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value), 'Compensación']} />
                    <Bar dataKey="amount" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
              <div className="flex space-x-4 text-sm text-gray-600">
                <span>
                  <strong>Promedio por estudiante:</strong> 
                  {formatCurrency(Math.round(teacherData.totalCompensation / teacherData.classes.reduce((sum, cls) => sum + cls.students, 0)))}
                </span>
                <span>
                  <strong>Eficiencia:</strong> 
                  {Math.round((teacherData.totalCompensation / teacherData.totalRevenue) * 100)}%
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Button as={Link} to={`/teachers/${teacherData.id}`} variant="ghost" size="sm">
                  Ver Perfil
                </Button>
                <Button variant="secondary" size="sm">
                  Exportar Detalle
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Comparison Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparación de Compensaciones</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={compensationData.map(teacher => ({
            name: teacher.teacher.name,
            compensation: teacher.totalCompensation,
            revenue: teacher.totalRevenue
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="compensation" fill="#f59e0b" name="Compensación" />
            <Bar dataKey="revenue" fill="#a855f7" name="Ingresos Generados" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Summary Analysis */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <AcademicCapIcon className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Análisis de Compensaciones</h3>
            <div className="mt-2 text-sm text-blue-800 space-y-1">
              <p>• <strong>Ratio promedio de compensación:</strong> {Math.round((totalCompensationPaid / totalRevenueGenerated) * 100)}% de los ingresos generados</p>
              <p>• <strong>Profesora más productiva:</strong> {compensationData.reduce((max, teacher) => teacher.totalRevenue > max.totalRevenue ? teacher : max).teacher.name}</p>
              <p>• <strong>Compensación promedio:</strong> {formatCurrency(Math.round(totalCompensationPaid / compensationData.length))} por profesora</p>
            </div>
            <div className="mt-4 flex space-x-3">
              <Button size="sm">
                Generar Reporte Completo
              </Button>
              <Button variant="secondary" size="sm">
                Exportar a Excel
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TeacherCompensation;
