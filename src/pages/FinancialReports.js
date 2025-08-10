import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Select from '../components/common/Select';
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
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { useApi } from '../hooks/useApi';
import { reportsAPI } from '../services/api';

const FinancialReports = () => {
  const [period, setPeriod] = useState('month');
  const [reportType, setReportType] = useState('summary');

  const {
    data: financialData,
    loading,
    error,
    refetch
  } = useApi(
    () => reportsAPI.getFinancial({ period, reportType }),
    [period, reportType],
    {
      transform: (data) => ({
        summary: data.summary || {
          totalRevenue: 0,
          totalExpenses: 0,
          netProfit: 0,
          profitMargin: 0,
          growth: 0
        },
        revenueBreakdown: data.revenueBreakdown || [],
        expenseBreakdown: data.expenseBreakdown || [],
        monthlyTrend: data.monthlyTrend || [],
        cashFlow: data.cashFlow || [],
        projections: data.projections || [],
        kpis: data.kpis || []
      })
    }
  );

  const COLORS = ['#f59e0b', '#a855f7', '#ec4899', '#10b981', '#3b82f6', '#f97316', '#84cc16'];

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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar reportes financieros</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={refetch} variant="primary">
          Reintentar
        </Button>
      </div>
    );
  }

  const { summary, revenueBreakdown, expenseBreakdown, monthlyTrend, cashFlow, projections, kpis } = financialData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount || 0);
  };

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  const getTrendIcon = (value) => {
    if (value > 0) return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
    if (value < 0) return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
    return null;
  };

  const getTrendColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
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
            <h1 className="text-2xl font-bold text-gray-900">Reportes Financieros</h1>
            <p className="text-gray-600">Análisis completo de ingresos, gastos y rentabilidad</p>
          </div>
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
          <Select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            options={[
              { value: 'summary', label: 'Resumen' },
              { value: 'detailed', label: 'Detallado' },
              { value: 'projections', label: 'Proyecciones' }
            ]}
          />
          <Button variant="secondary" icon={DocumentTextIcon}>
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalRevenue)}</p>
              <div className="flex items-center mt-1">
                {getTrendIcon(summary.growth)}
                <span className={`text-sm ${getTrendColor(summary.growth)} ml-1`}>
                  {formatPercentage(Math.abs(summary.growth))} vs período anterior
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ArrowTrendingDownIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gastos Totales</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalExpenses)}</p>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-600">
                  {formatPercentage((summary.totalExpenses / summary.totalRevenue) * 100)} de ingresos
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Utilidad Neta</p>
              <p className={`text-2xl font-bold ${summary.netProfit >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                {formatCurrency(summary.netProfit)}
              </p>
              <div className="flex items-center mt-1">
                <span className={`text-sm ${summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(summary.profitMargin)} margen
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Crecimiento</p>
              <p className={`text-2xl font-bold ${summary.growth >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                {formatPercentage(summary.growth)}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-sm text-blue-600">vs período anterior</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue vs Expenses Trend */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Ingresos vs Gastos</h3>
        {monthlyTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value)]} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Ingresos"
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ef4444" 
                strokeWidth={3}
                name="Gastos"
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#f59e0b" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Utilidad"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>No hay datos de tendencia disponibles</p>
          </div>
        )}
      </Card>

      {/* Revenue and Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Desglose de Ingresos</h3>
          {revenueBreakdown.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="amount"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(value)]} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-2">
                {revenueBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>No hay datos de ingresos disponibles</p>
            </div>
          )}
        </Card>

        {/* Expense Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Desglose de Gastos</h3>
          {expenseBreakdown.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="amount"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(value)]} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-2">
                {expenseBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>No hay datos de gastos disponibles</p>
            </div>
          )}
        </Card>
      </div>

      {/* Cash Flow */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Flujo de Caja</h3>
        {cashFlow.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={cashFlow}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value)]} />
              <Area 
                type="monotone" 
                dataKey="inflow" 
                stackId="1"
                stroke="#10b981" 
                fill="#10b981"
                fillOpacity={0.6}
                name="Entradas"
              />
              <Area 
                type="monotone" 
                dataKey="outflow" 
                stackId="2"
                stroke="#ef4444" 
                fill="#ef4444"
                fillOpacity={0.6}
                name="Salidas"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>No hay datos de flujo de caja disponibles</p>
          </div>
        )}
      </Card>

      {/* Financial Projections */}
      {projections.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Proyecciones Financieras</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projections}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value)]} />
              <Line 
                type="monotone" 
                dataKey="projected" 
                stroke="#a855f7" 
                strokeWidth={2}
                strokeDasharray="8 8"
                name="Proyectado"
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#f59e0b" 
                strokeWidth={3}
                name="Real"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Key Performance Indicators */}
      {kpis.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicadores Clave de Rendimiento</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kpis.map((kpi, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {kpi.type === 'currency' ? formatCurrency(kpi.value) : 
                   kpi.type === 'percentage' ? formatPercentage(kpi.value) : 
                   kpi.value}
                </div>
                <div className="text-sm font-medium text-gray-600 mb-2">
                  {kpi.label}
                </div>
                <div className="flex items-center justify-center">
                  {getTrendIcon(kpi.trend)}
                  <span className={`text-xs ${getTrendColor(kpi.trend)} ml-1`}>
                    {formatPercentage(Math.abs(kpi.trend || 0))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Financial Health Alert */}
      {summary.profitMargin < 10 && (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900">Alerta de Salud Financiera</h3>
              <div className="mt-2 text-sm text-yellow-800 space-y-1">
                <p>• El margen de utilidad está por debajo del 10% recomendado</p>
                <p>• Considere revisar la estructura de costos y precios</p>
                <p>• Evalúe oportunidades de optimización de gastos</p>
                <p>• Analice la posibilidad de aumentar tarifas de clases</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FinancialReports;
