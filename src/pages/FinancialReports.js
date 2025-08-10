import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CurrencyDollarIcon, TrendingUpIcon, TrendingDownIcon } from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const FinancialReports = () => {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('year');
  const [financialData, setFinancialData] = useState({});

  useEffect(() => {
    const loadFinancialData = async () => {
      setLoading(true);
      
      setTimeout(() => {
        setFinancialData({
          summary: {
            totalRevenue: 5472000,
            totalExpenses: 2736000,
            netProfit: 2736000,
            profitMargin: 50,
            monthlyGrowth: 12.5,
            yearlyGrowth: 28.3
          },
          monthlyData: [
            { month: 'Ene', revenue: 420000, expenses: 210000, profit: 210000 },
            { month: 'Feb', revenue: 435000, expenses: 217500, profit: 217500 },
            { month: 'Mar', revenue: 440000, expenses: 220000, profit: 220000 },
            { month: 'Abr', revenue: 445000, expenses: 222500, profit: 222500 },
            { month: 'May', revenue: 450000, expenses: 225000, profit: 225000 },
            { month: 'Jun', revenue: 456000, expenses: 228000, profit: 228000 },
            { month: 'Jul', revenue: 462000, expenses: 231000, profit: 231000 },
            { month: 'Ago', revenue: 468000, expenses: 234000, profit: 234000 },
            { month: 'Sep', revenue: 475000, expenses: 237500, profit: 237500 },
            { month: 'Oct', revenue: 482000, expenses: 241000, profit: 241000 },
            { month: 'Nov', revenue: 489000, expenses: 244500, profit: 244500 },
            { month: 'Dic', revenue: 490000, expenses: 245000, profit: 245000 }
          ],
          revenueByClass: [
            { name: 'Ballet Clásico', revenue: 1680000, percentage: 30.7, color: '#ec4899' },
            { name: 'Jazz', revenue: 1314000, percentage: 24.0, color: '#a855f7' },
            { name: 'Hip Hop', revenue: 1095000, percentage: 20.0, color: '#3b82f6' },
            { name: 'Contemporáneo', revenue: 876000, percentage: 16.0, color: '#10b981' },
            { name: 'Salsa', revenue: 507000, percentage: 9.3, color: '#f59e0b' }
          ],
          expenseBreakdown: [
            { category: 'Compensación Profesoras', amount: 1368000, percentage: 50 },
            { category: 'Arriendo Local', amount: 600000, percentage: 22 },
            { category: 'Servicios Básicos', amount: 240000, percentage: 9 },
            { category: 'Marketing', amount: 164000, percentage: 6 },
            { category: 'Equipamiento', amount: 137000, percentage: 5 },
            { category: 'Otros', amount: 227000, percentage: 8 }
          ],
          projections: [
            { month: 'Ene 2024', projected: 510000, actual: null },
            { month: 'Feb 2024', projected: 525000, actual: null },
            { month: 'Mar 2024', projected: 540000, actual: null },
            { month: 'Abr 2024', projected: 555000, actual: null },
            { month: 'May 2024', projected: 570000, actual: null },
            { month: 'Jun 2024', projected: 585000, actual: null }
          ]
        });
        setLoading(false);
      }, 1000);
    };

    loadFinancialData();
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const { summary, monthlyData, revenueByClass, expenseBreakdown, projections } = financialData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reporte Financiero</h1>
          <p className="text-gray-600">Análisis financiero completo del estudio</p>
        </div>
        <div className="flex space-x-3">
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            options={[
              { value: 'month', label: 'Este Mes' },
              { value: 'quarter', label: 'Este Trimestre' },
              { value: 'year', label: 'Este Año' }
            ]}
          />
          <Button variant="secondary">
            Exportar PDF
          </Button>
          <Button as={Link} to="/reports" variant="secondary">
            Volver a Reportes
          </Button>
        </div>
      </div>

      {/* Financial Summary */}
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
                <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{summary.yearlyGrowth}%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gastos Totales</p>
              <p className="text-2xl font-bold text-gray-900">${summary.totalExpenses.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <TrendingUpIcon className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">+15.2%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Utilidad Neta</p>
              <p className="text-2xl font-bold text-gray-900">${summary.netProfit.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{summary.monthlyGrowth}%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Margen de Utilidad</p>
              <p className="text-2xl font-bold text-gray-900">{summary.profitMargin}%</p>
              <p className="text-sm text-gray-500">Muy saludable</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue and Profit Trend */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Ingresos y Utilidades</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
            <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={3} name="Ingresos" />
            <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} name="Utilidad" />
            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Gastos" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Revenue Distribution and Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Class */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos por Clase</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueByClass}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="revenue"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {revenueByClass.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Ingresos']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Expense Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Desglose de Gastos</h3>
          <div className="space-y-4">
            {expenseBreakdown.map((expense, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{expense.category}</span>
                    <span className="text-sm text-gray-600">{expense.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${expense.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="ml-4 text-sm font-semibold text-gray-900">
                  ${expense.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Projections */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Proyecciones 2024</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projections}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Proyectado']} />
            <Bar dataKey="projected" fill="#a855f7" name="Ingresos Proyectados" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Financial Health Analysis */}
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-start space-x-3">
          <CurrencyDollarIcon className="h-6 w-6 text-green-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">Análisis de Salud Financiera</h3>
            <div className="mt-2 text-sm text-green-800 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Fortalezas:</strong></p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    <li>Margen de utilidad saludable (50%)</li>
                    <li>Crecimiento constante mes a mes</li>
                    <li>Diversificación de ingresos por clase</li>
                    <li>Control de gastos operativos</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Oportunidades:</strong></p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    <li>Expandir clases más rentables</li>
                    <li>Optimizar horarios de menor demanda</li>
                    <li>Implementar descuentos por pago anual</li>
                    <li>Considerar nuevas modalidades</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-4 flex space-x-3">
              <Button size="sm">
                Generar Reporte Ejecutivo
              </Button>
              <Button variant="secondary" size="sm">
                Exportar Datos
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinancialReports;
