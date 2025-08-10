import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentDetail from './pages/StudentDetail';
import StudentForm from './pages/StudentForm';
import Teachers from './pages/Teachers';
import TeacherDetail from './pages/TeacherDetail';
import TeacherForm from './pages/TeacherForm';
import Classes from './pages/Classes';
import ClassDetail from './pages/ClassDetail';
import ClassForm from './pages/ClassForm';
import Payments from './pages/Payments';
import PaymentForm from './pages/PaymentForm';
import QuickPayment from './pages/QuickPayment';
import Reports from './pages/Reports';
import OutstandingPayments from './pages/OutstandingPayments';
import TeacherCompensation from './pages/TeacherCompensation';
import FinancialReports from './pages/FinancialReports';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              <Route path="/*" element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      
                      {/* Students Routes */}
                      <Route path="/students" element={<Students />} />
                      <Route path="/students/new" element={<StudentForm />} />
                      <Route path="/students/:id" element={<StudentDetail />} />
                      <Route path="/students/:id/edit" element={<StudentForm />} />
                      
                      {/* Teachers Routes */}
                      <Route path="/teachers" element={<Teachers />} />
                      <Route path="/teachers/new" element={<TeacherForm />} />
                      <Route path="/teachers/:id" element={<TeacherDetail />} />
                      <Route path="/teachers/:id/edit" element={<TeacherForm />} />
                      
                      {/* Classes Routes */}
                      <Route path="/classes" element={<Classes />} />
                      <Route path="/classes/new" element={<ClassForm />} />
                      <Route path="/classes/:id" element={<ClassDetail />} />
                      <Route path="/classes/:id/edit" element={<ClassForm />} />
                      
                      {/* Payments Routes */}
                      <Route path="/payments" element={<Payments />} />
                      <Route path="/payments/new" element={<PaymentForm />} />
                      <Route path="/payments/quick" element={<QuickPayment />} />
                      
                      {/* Reports Routes */}
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/reports/outstanding" element={<OutstandingPayments />} />
                      <Route path="/reports/teacher-compensation" element={<TeacherCompensation />} />
                      <Route path="/reports/financial" element={<FinancialReports />} />
                      
                      {/* Settings */}
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
