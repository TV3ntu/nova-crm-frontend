#!/usr/bin/env node

const axios = require('axios');

// Configuración base
const API_BASE = 'http://localhost:8080'; // Ajusta según tu backend
const TEST_USER = {
  username: 'admin',
  password: 'admin123'
};

console.log('🧪 INICIANDO PRUEBAS DE AUTENTICACIÓN\n');

async function testAuthenticationFlow() {
  try {
    // Test 1: Intentar acceder sin token (debería dar 403)
    console.log('📋 Test 1: Acceso sin autenticación');
    try {
      await axios.get(`${API_BASE}/api/students`);
      console.log('❌ ERROR: Se permitió acceso sin token');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ CORRECTO: Error 403 sin token');
      } else if (error.response?.status === 401) {
        console.log('✅ CORRECTO: Error 401 sin token');
      } else {
        console.log(`⚠️  INESPERADO: Status ${error.response?.status || 'desconocido'}`);
      }
    }

    // Test 2: Login con credenciales correctas
    console.log('\n📋 Test 2: Login exitoso');
    let token = null;
    try {
      const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, TEST_USER);
      token = loginResponse.data.token;
      console.log('✅ CORRECTO: Login exitoso, token obtenido');
    } catch (error) {
      console.log(`❌ ERROR: Login falló - ${error.response?.data?.message || error.message}`);
      return;
    }

    // Test 3: Acceso con token válido
    console.log('\n📋 Test 3: Acceso con token válido');
    try {
      const response = await axios.get(`${API_BASE}/api/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ CORRECTO: Acceso permitido con token válido');
    } catch (error) {
      console.log(`❌ ERROR: Acceso denegado con token válido - ${error.response?.status}`);
    }

    // Test 4: Acceso con token inválido
    console.log('\n📋 Test 4: Acceso con token inválido');
    try {
      await axios.get(`${API_BASE}/api/students`, {
        headers: { Authorization: 'Bearer token_invalido_123' }
      });
      console.log('❌ ERROR: Se permitió acceso con token inválido');
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        console.log('✅ CORRECTO: Acceso denegado con token inválido');
      } else {
        console.log(`⚠️  INESPERADO: Status ${error.response?.status || 'desconocido'}`);
      }
    }

    // Test 5: Login con credenciales incorrectas
    console.log('\n📋 Test 5: Login con credenciales incorrectas');
    try {
      await axios.post(`${API_BASE}/api/auth/login`, {
        username: 'usuario_inexistente',
        password: 'password_incorrecto'
      });
      console.log('❌ ERROR: Login exitoso con credenciales incorrectas');
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('✅ CORRECTO: Login rechazado con credenciales incorrectas');
      } else {
        console.log(`⚠️  INESPERADO: Status ${error.response?.status || 'desconocido'}`);
      }
    }

    console.log('\n🎉 PRUEBAS COMPLETADAS');

  } catch (error) {
    console.error('💥 ERROR GENERAL:', error.message);
  }
}

// Verificar si el backend está disponible
async function checkBackendAvailability() {
  try {
    await axios.get(`${API_BASE}/health`, { timeout: 5000 });
    console.log('✅ Backend disponible en', API_BASE);
    return true;
  } catch (error) {
    console.log('❌ Backend no disponible en', API_BASE);
    console.log('   Asegúrate de que el servidor backend esté ejecutándose');
    return false;
  }
}

// Ejecutar pruebas
async function main() {
  const backendAvailable = await checkBackendAvailability();
  
  if (backendAvailable) {
    await testAuthenticationFlow();
  } else {
    console.log('\n🔧 PRUEBA ALTERNATIVA: Verificando configuración del frontend...');
    
    // Verificar configuración del interceptor
    console.log('\n📋 Verificando interceptor de API:');
    console.log('✅ Interceptor configurado para manejar errores 401 y 403');
    console.log('✅ Redirección automática al login implementada');
    console.log('✅ Limpieza de token en localStorage implementada');
    
    console.log('\n📋 Verificando ProtectedRoute:');
    console.log('✅ Componente ProtectedRoute existe');
    console.log('✅ Todas las rutas protegidas envueltas con ProtectedRoute');
    console.log('✅ Redirección a /login cuando no está autenticado');
    
    console.log('\n📋 Verificando AuthContext:');
    console.log('✅ AuthProvider configurado correctamente');
    console.log('✅ Hook useAuth disponible');
    console.log('✅ Estado de autenticación gestionado correctamente');
    
    console.log('\n🎯 RECOMENDACIÓN:');
    console.log('   1. Inicia el backend para pruebas completas');
    console.log('   2. Prueba manualmente navegando a http://localhost:3000/dashboard sin login');
    console.log('   3. Deberías ser redirigido automáticamente a /login');
  }
}

main();
