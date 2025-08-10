import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  CalendarDaysIcon, 
  CreditCardIcon, 
  CurrencyDollarIcon,
  PlusIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    kpis: {
      totalStudents: 0,
      todayClasses: 0,
      pendingPayments: 0,
      monthlyRevenue: 0
    },
    revenueChart: [],
    studentsPerClass: [],
    paymentStatus: [],
    recentPayments: [],
    upcomingClasses: [],
    alerts: []
  });

  useEffect(() => {
    // Simular carga de datos del dashboard
    const loadDashboardData = async () => {
      setLoading(true);
      
      // Simular datos para el dashboard
      setTimeout(() => {
        setDashboardData({
          kpis: {
            totalStudents: 118,
            todayClasses: 8,
            pendingPayments: 23,
            monthlyRevenue: 45600
          },
          revenueChart: [
            { month: 'Ene', revenue: 38000 },
            { month: 'Feb', revenue: 42000 },
            { month: 'Mar', revenue: 39000 },
            { month: 'Abr', revenue: 45000 },
            { month: 'May', revenue: 43000 },
            { month: 'Jun', revenue: 45600 }
          ],
          studentsPerClass: [
            { name: 'Ballet Clásico', students: 15, max: 20 },
            { name: 'Jazz', students: 12, max: 15 },
            { name: 'Hip Hop', students: 18, max: 20 },
            { name: 'Contemporáneo', students: 10, max: 15 },
            { name: 'Salsa', students: 14, max: 16 }
          ],
          paymentStatus: [
            { name: 'Al día', value: 95, color: '#10B981' },
            { name: 'Con mora', value: 23, color: '#F59E0B' }
          ],
          recentPayments: [
            { id: 1, student: 'María García', amount: 1200, date: '2024-01-15', status: 'completed' },
            { id: 2, student: 'Ana López', amount: 800, date: '2024-01-15', status: 'completed' },
            { id: 3, student: 'Carmen Silva', amount: 1500, date: '2024-01-14', status: 'completed' }
          ],
          upcomingClasses: [
            { id: 1, name: 'Ballet Clásico', time: '18:00', teacher: 'Prof. Elena', students: 15 },
            { id: 2, name: 'Jazz', time: '19:30', teacher: 'Prof. Carmen', students: 12 },
            { id: 3, name: 'Hip Hop', time: '20:00', teacher: 'Prof. Ana', students: 18 }
          ],
          alerts: [
            { id: 1, type: 'warning', message: '23 pagos pendientes este mes' },
            { id: 2, type: 'info', message: 'Clase de Ballet casi llena (15/20)' }
          ]
        });
        setLoading(false);
      }, 1000);
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const { kpis, revenueChart, studentsPerClass, paymentStatus, recentPayments, upcomingClasses, alerts } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen general del estudio</p>
        </div>
        <div className="flex space-x-3">
          <Button as={Link} to="/payments/quick" variant="primary" icon={PlusIcon}>
            Pago Rápido
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div key={alert.id} className={`
              p-4 rounded-lg border-l-4 ${
                alert.type === 'warning' 
                  ? 'bg-yellow-50 border-yellow-400' 
                  : 'bg-blue-50 border-blue-400'
              }
            `}>
              <div className="flex items-center">
                <ExclamationTriangleIcon className={`
                  h-5 w-5 mr-2 ${
                    alert.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                  }
                `} />
                <p className="text-sm font-medium text-gray-900">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CreditCardIcon className="h-6 w-6 text-yellow-600" />
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
              <p className="text-2xl font-bold text-gray-900">${kpis.monthlyRevenue.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos por Mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Ingresos']} />
              <Bar dataKey="revenue" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estudiantes por Clase</h3>
          <div className="space-y-3">
            {studentsPerClass.map((classItem, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{classItem.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${(classItem.students / classItem.max) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{classItem.students}/{classItem.max}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pagos Recientes</h3>
            <Button as={Link} to="/payments" variant="ghost" size="sm">
              Ver todos
            </Button>
          </div>
          <div className="space-y-3">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{payment.student}</p>
                  <p className="text-xs text-gray-500">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">${payment.amount}</p>
                  <Badge variant="success">Completado</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Clases de Hoy</h3>
            <Button as={Link} to="/classes" variant="ghost" size="sm">
              Ver todas
            </Button>
          </div>
          <div className="space-y-3">
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{classItem.name}</p>
                  <p className="text-xs text-gray-500">{classItem.teacher}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{classItem.time}</p>
                  <p className="text-xs text-gray-500">{classItem.students} estudiantes</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
