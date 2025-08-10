import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AcademicCapIcon, StarIcon } from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import Select from '../components/common/Select';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TeacherCompensation = () => {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [compensationData, setCompensationData] = useState([]);

  useEffect(() => {
    const loadCompensationData = async () => {
      setLoading(true);
      
      setTimeout(() => {
        setCompensationData([
          {
            id: 1,
            teacher: {
              name: 'Elena Martínez',
              avatar: null,
              isOwner: true,
              email: 'elena.martinez@novadance.com'
            },
            classes: [
              { name: 'Ballet Clásico Avanzado', students: 15, revenue: 12000, compensation: 12000 },
              { name: 'Contemporáneo', students: 12, revenue: 9600, compensation: 9600 }
            ],
            totalRevenue: 21600,
            totalCompensation: 21600,
            compensationRate: 100,
            monthlyHistory: [
              { month: 'Jul', amount: 18000 },
              { month: 'Ago', amount: 19500 },
              { month: 'Sep', amount: 20000 },
              { month: 'Oct', amount: 20500 },
              { month: 'Nov', amount: 21000 },
              { month: 'Dic', amount: 21600 }
            ]
          },
          {
            id: 2,
            teacher: {
              name: 'Carmen López',
              avatar: null,
              isOwner: false,
              email: 'carmen.lopez@novadance.com'
            },
            classes: [
              { name: 'Jazz Intermedio', students: 18, revenue: 12600, compensation: 6300 },
              { name: 'Hip Hop Principiantes', students: 20, revenue: 15000, compensation: 7500 }
            ],
            totalRevenue: 27600,
            totalCompensation: 13800,
            compensationRate: 50,
            monthlyHistory: [
              { month: 'Jul', amount: 11000 },
              { month: 'Ago', amount: 12000 },
              { month: 'Sep', amount: 12500 },
              { month: 'Oct', amount: 13000 },
              { month: 'Nov', amount: 13500 },
              { month: 'Dic', amount: 13800 }
            ]
          },
          {
            id: 3,
            teacher: {
              name: 'Ana Rodríguez',
              avatar: null,
              isOwner: false,
              email: 'ana.rodriguez@novadance.com'
            },
            classes: [
              { name: 'Salsa Avanzada', students: 16, revenue: 9600, compensation: 4800 },
              { name: 'Bachata', students: 14, revenue: 8400, compensation: 4200 }
            ],
            totalRevenue: 18000,
            totalCompensation: 9000,
            compensationRate: 50,
            monthlyHistory: [
              { month: 'Jul', amount: 7500 },
              { month: 'Ago', amount: 8000 },
              { month: 'Sep', amount: 8200 },
              { month: 'Oct', amount: 8500 },
              { month: 'Nov', amount: 8800 },
              { month: 'Dic', amount: 9000 }
            ]
          }
        ]);
        setLoading(false);
      }, 1000);
    };

    loadCompensationData();
  }, [selectedPeriod]);

  const totalCompensationPaid = compensationData.reduce((sum, teacher) => sum + teacher.totalCompensation, 0);
  const totalRevenueGenerated = compensationData.reduce((sum, teacher) => sum + teacher.totalRevenue, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compensación de Profesoras</h1>
          <p className="text-gray-600">Análisis detallado de compensaciones y rendimiento</p>
        </div>
        <div className="flex space-x-3">
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            options={[
              { value: '2024-01', label: 'Enero 2024' },
              { value: '2023-12', label: 'Diciembre 2023' },
              { value: '2023-11', label: 'Noviembre 2023' }
            ]}
          />
          <Button as={Link} to="/reports" variant="secondary">
            Volver a Reportes
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Compensaciones</p>
              <p className="text-2xl font-bold text-gray-900">${totalCompensationPaid.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ingresos Generados</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenueGenerated.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <StarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Profesoras Activas</p>
              <p className="text-2xl font-bold text-gray-900">{compensationData.length}</p>
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
                <Avatar src={teacherData.teacher.avatar} name={teacherData.teacher.name} size="lg" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-semibold text-gray-900">{teacherData.teacher.name}</h3>
                    {teacherData.teacher.isOwner && (
                      <StarIcon className="h-5 w-5 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <p className="text-gray-600">{teacherData.teacher.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant={teacherData.teacher.isOwner ? 'success' : 'info'}>
                      {teacherData.compensationRate}% Compensación
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {teacherData.classes.length} clase{teacherData.classes.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-3xl font-bold text-primary-600">
                  ${teacherData.totalCompensation.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  de ${teacherData.totalRevenue.toLocaleString()} generados
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
                          ${cls.compensation.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{cls.students} estudiantes</span>
                        <span>Ingresos: ${cls.revenue.toLocaleString()}</span>
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
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Compensación']} />
                    <Bar dataKey="amount" fill="#ec4899" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
              <div className="flex space-x-4 text-sm text-gray-600">
                <span>
                  <strong>Promedio por estudiante:</strong> 
                  ${Math.round(teacherData.totalCompensation / teacherData.classes.reduce((sum, cls) => sum + cls.students, 0)).toLocaleString()}
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
            <Bar dataKey="compensation" fill="#ec4899" name="Compensación" />
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
              <p>• <strong>Compensación promedio:</strong> ${Math.round(totalCompensationPaid / compensationData.length).toLocaleString()} por profesora</p>
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
