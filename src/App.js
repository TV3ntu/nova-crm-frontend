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
import PaymentDetail from './pages/PaymentDetail';
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
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Students Routes */}
              <Route path="/students" element={
                <ProtectedRoute>
                  <Layout>
                    <Students />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/students/new" element={
                <ProtectedRoute>
                  <Layout>
                    <StudentForm />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/students/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <StudentDetail />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/students/:id/edit" element={
                <ProtectedRoute>
                  <Layout>
                    <StudentForm />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Teachers Routes */}
              <Route path="/teachers" element={
                <ProtectedRoute>
                  <Layout>
                    <Teachers />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/teachers/new" element={
                <ProtectedRoute>
                  <Layout>
                    <TeacherForm />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/teachers/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <TeacherDetail />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/teachers/:id/edit" element={
                <ProtectedRoute>
                  <Layout>
                    <TeacherForm />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Classes Routes */}
              <Route path="/classes" element={
                <ProtectedRoute>
                  <Layout>
                    <Classes />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/classes/new" element={
                <ProtectedRoute>
                  <Layout>
                    <ClassForm />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/classes/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <ClassDetail />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/classes/:id/edit" element={
                <ProtectedRoute>
                  <Layout>
                    <ClassForm />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Payments Routes */}
              <Route path="/payments" element={
                <ProtectedRoute>
                  <Layout>
                    <Payments />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/payments/new" element={
                <ProtectedRoute>
                  <Layout>
                    <PaymentForm />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/payments/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <PaymentDetail />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/payments/quick" element={
                <ProtectedRoute>
                  <Layout>
                    <QuickPayment />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Reports Routes */}
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Layout>
                    <Reports />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reports/outstanding" element={
                <ProtectedRoute>
                  <Layout>
                    <OutstandingPayments />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reports/teacher-compensation" element={
                <ProtectedRoute>
                  <Layout>
                    <TeacherCompensation />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reports/financial" element={
                <ProtectedRoute>
                  <Layout>
                    <FinancialReports />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Settings */}
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
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
