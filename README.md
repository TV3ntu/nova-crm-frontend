# NOVA Dance Studio CRM - Frontend

Sistema de gestión CRM para NOVA Dance Studio desarrollado en React con diseño moderno y responsivo.

## 🎨 Características

- **Gestión de Estudiantes**: Registro, edición y seguimiento de estudiantes
- **Gestión de Profesores**: Administración de profesores y compensaciones
- **Gestión de Clases**: Programación y seguimiento de clases
- **Sistema de Pagos**: Procesamiento y seguimiento de pagos
- **Reportes y Analytics**: Análisis financiero y de rendimiento
- **Diseño Responsivo**: Optimizado para desktop y móvil
- **Tema NOVA**: Colores amarillo y púrpura siguiendo la identidad de marca

## 🚀 Tecnologías

- **React 18** - Framework principal
- **React Router v6** - Navegación
- **Tailwind CSS** - Estilos y diseño
- **Heroicons** - Iconografía
- **Recharts** - Gráficos y visualizaciones
- **Axios** - Cliente HTTP
- **Headless UI** - Componentes accesibles

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd nova-crm-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus configuraciones

# Iniciar servidor de desarrollo
npm start
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm start                 # Servidor de desarrollo (puerto 3000)

# Build
npm run build            # Build de producción
npm run build:prod       # Build optimizado sin source maps

# Testing
npm test                 # Ejecutar tests
npm run analyze          # Analizar bundle de producción
```

## 🌐 Deploy en Render

Este proyecto está configurado para deploy automático en Render.com:

### Configuración Automática
1. Conecta tu repositorio GitHub a Render
2. Render detectará automáticamente el archivo `render.yaml`
3. El deploy se ejecutará automáticamente

### Variables de Entorno en Render
Configura estas variables en el dashboard de Render:

```
REACT_APP_API_URL=https://nova-crm-99ca.onrender.com
REACT_APP_APP_NAME=NOVA Dance Studio CRM
REACT_APP_VERSION=1.0.0
NODE_ENV=production
GENERATE_SOURCEMAP=false
```

### Características del Deploy
- ✅ Build automático en cada push
- ✅ Preview deployments para Pull Requests
- ✅ Headers de seguridad configurados
- ✅ Routing SPA optimizado
- ✅ Compresión y optimización automática

## 🔐 Seguridad

- Headers de seguridad configurados
- Variables de entorno para datos sensibles
- Validación de formularios
- Protección contra XSS y CSRF

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints optimizados
- Navegación adaptativa
- Componentes responsivos

## 🎨 Sistema de Colores

```css
/* Colores principales NOVA */
--primary: #f59e0b (Amarillo NOVA)
--secondary: #a855f7 (Púrpura)
--accent: #ec4899 (Rosa)
```

## 📊 Páginas Principales

- **Dashboard**: KPIs y resumen general
- **Estudiantes**: Gestión completa de estudiantes
- **Profesores**: Administración de profesores
- **Clases**: Programación y seguimiento
- **Pagos**: Procesamiento y seguimiento de pagos
- **Reportes**: Analytics y reportes financieros
- **Configuración**: Ajustes del sistema

## 🔗 API Integration

El frontend está configurado para conectarse con el backend de NOVA CRM:
- Base URL: `https://nova-crm-99ca.onrender.com`
- Autenticación: JWT tokens
- Endpoints RESTful

## 📝 Desarrollo

### Estructura del Proyecto
```
src/
├── components/          # Componentes reutilizables
│   ├── common/         # Componentes base (Button, Input, etc.)
│   └── layout/         # Componentes de layout
├── pages/              # Páginas principales
├── contexts/           # Context providers (Auth, etc.)
├── hooks/              # Custom hooks
├── utils/              # Utilidades y helpers
└── styles/             # Estilos globales
```

### Convenciones
- Componentes en PascalCase
- Archivos de páginas en PascalCase
- Hooks personalizados con prefijo `use`
- Estilos con Tailwind CSS

## 🐛 Troubleshooting

### Problemas Comunes
1. **Error de routing**: Verificar configuración de React Router
2. **Estilos no cargan**: Verificar configuración de Tailwind
3. **API errors**: Verificar variables de entorno

### Logs y Debug
```bash
# Ver logs de build
npm run build

# Analizar bundle
npm run analyze
```

## 📄 Licencia

Proyecto privado de NOVA Dance Studio.

## 👥 Contribución

Para contribuir al proyecto:
1. Fork del repositorio
2. Crear branch feature
3. Commit cambios
4. Push al branch
5. Crear Pull Request

---

**NOVA Dance Studio CRM** - Sistema de gestión profesional para estudios de danza 💃✨
