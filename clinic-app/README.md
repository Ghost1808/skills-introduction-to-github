# 🏥 ClinicApp - Sistema de Gestión Clínica

Una aplicación web completa para la gestión integral de clínicas y centros médicos, desarrollada con tecnologías modernas y enfocada en la eficiencia y seguridad.

## 🚀 Características Principales

### 👥 Gestión de Usuarios
- **Roles múltiples**: Administrador, Doctor, Enfermero, Recepcionista, Paciente
- **Autenticación segura** con JWT
- **Perfiles personalizables** con información específica por rol
- **Control de acceso** basado en permisos

### 📅 Sistema de Citas
- **Programación inteligente** de citas médicas
- **Calendario interactivo** con disponibilidad en tiempo real
- **Gestión de estados** (programada, confirmada, en progreso, completada, cancelada)
- **Notificaciones automáticas** por email
- **Control de conflictos** de horarios

### 📋 Historiales Médicos
- **Registros médicos digitales** completos
- **Gestión de medicamentos** y prescripciones
- **Resultados de laboratorio** integrados
- **Signos vitales** y seguimiento de salud
- **Historial de consultas** y tratamientos

### 💰 Facturación y Pagos
- **Generación automática** de facturas
- **Múltiples métodos de pago**
- **Reportes financieros** detallados
- **Gestión de seguros médicos**

### 📊 Inventario y Reportes
- **Control de inventario** de medicamentos y equipos
- **Alertas de stock mínimo**
- **Reportes administrativos** completos
- **Dashboard analítico** con métricas clave

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** con **Express.js**
- **TypeScript** para tipado estático
- **PostgreSQL** como base de datos
- **Sequelize** como ORM
- **JWT** para autenticación
- **bcryptjs** para encriptación de contraseñas
- **Nodemailer** para envío de emails

### Frontend
- **Next.js 14** con App Router
- **React 19** con componentes funcionales
- **TypeScript** para tipado estático
- **Tailwind CSS** para estilos
- **Headless UI** para componentes accesibles
- **React Hook Form** para manejo de formularios
- **React Query** para gestión de estado del servidor
- **Axios** para peticiones HTTP

### DevOps
- **Docker** y **Docker Compose** para containerización
- **PostgreSQL** en contenedor
- **Variables de entorno** para configuración

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- npm o yarn
- PostgreSQL (o usar Docker)
- Git

### Opción 1: Instalación con Docker (Recomendada)

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd clinic-app
```

2. **Configurar variables de entorno**
```bash
# Copiar archivo de ejemplo
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Editar las variables según sea necesario
```

3. **Ejecutar con Docker Compose**
```bash
docker-compose up -d
```

4. **Acceder a la aplicación**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Base de datos: localhost:5432

### Opción 2: Instalación Manual

1. **Configurar la base de datos**
```bash
# Crear base de datos PostgreSQL
createdb clinic_db
```

2. **Configurar el Backend**
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con la configuración de tu base de datos
npm run build
npm start
```

3. **Configurar el Frontend**
```bash
cd frontend
npm install
cp .env.example .env.local
# Editar .env.local con la URL de tu API
npm run build
npm start
```

## 🔧 Configuración

### Variables de Entorno del Backend

```env
# Servidor
PORT=3001
NODE_ENV=development

# Base de Datos
DB_NAME=clinic_db
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Variables de Entorno del Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 👤 Usuarios de Demostración

La aplicación incluye usuarios de demostración para testing:

| Rol | Email | Contraseña | Descripción |
|-----|--------|------------|-------------|
| Administrador | admin@clinic.com | admin123 | Acceso completo al sistema |
| Doctor | doctor@clinic.com | doctor123 | Gestión de pacientes y citas |
| Paciente | patient@clinic.com | patient123 | Vista de paciente |

## 📚 API Documentation

### Endpoints Principales

#### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registro de usuario
- `GET /api/auth/profile` - Obtener perfil del usuario
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/change-password` - Cambiar contraseña

#### Citas
- `GET /api/appointments` - Listar citas
- `POST /api/appointments` - Crear cita
- `GET /api/appointments/:id` - Obtener cita específica
- `PUT /api/appointments/:id` - Actualizar cita
- `PATCH /api/appointments/:id/cancel` - Cancelar cita
- `GET /api/appointments/doctor/:doctorId/availability` - Disponibilidad del doctor

#### Pacientes
- `GET /api/patients` - Listar pacientes
- `POST /api/patients` - Crear paciente
- `GET /api/patients/:id` - Obtener paciente específico
- `PUT /api/patients/:id` - Actualizar paciente

#### Historiales Médicos
- `GET /api/medical-records` - Listar historiales
- `POST /api/medical-records` - Crear historial
- `GET /api/medical-records/:id` - Obtener historial específico
- `PUT /api/medical-records/:id` - Actualizar historial

## 🔒 Seguridad

- **Autenticación JWT** con tokens seguros
- **Encriptación de contraseñas** con bcrypt
- **Validación de datos** en frontend y backend
- **Control de acceso** basado en roles
- **Sanitización de datos** para prevenir inyecciones
- **CORS configurado** para seguridad de dominios cruzados

## 📱 Funcionalidades por Rol

### 👨‍💼 Administrador
- Gestión completa de usuarios
- Configuración del sistema
- Reportes y analytics
- Gestión de departamentos
- Control de inventario

### 👨‍⚕️ Doctor
- Gestión de citas
- Historiales médicos
- Prescripciones
- Comunicación con pacientes
- Resultados de laboratorio

### 👩‍⚕️ Enfermero
- Asistencia en consultas
- Registro de signos vitales
- Gestión de medicamentos
- Apoyo administrativo

### 👥 Recepcionista
- Programación de citas
- Gestión de pacientes
- Facturación básica
- Atención al cliente

### 🤒 Paciente
- Visualización de citas
- Historial médico personal
- Comunicación con doctores
- Gestión de perfil

## 🚀 Despliegue en Producción

### Docker Production

```bash
# Construir imágenes de producción
docker-compose -f docker-compose.prod.yml build

# Ejecutar en producción
docker-compose -f docker-compose.prod.yml up -d
```

### Consideraciones de Producción

1. **Cambiar secretos por defecto**
2. **Configurar SSL/HTTPS**
3. **Usar base de datos externa**
4. **Configurar respaldos automáticos**
5. **Monitoreo y logging**
6. **Configurar dominio personalizado**

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📈 Roadmap

- [ ] Módulo de telemedicina
- [ ] Integración con dispositivos médicos
- [ ] App móvil nativa
- [ ] Inteligencia artificial para diagnósticos
- [ ] Integración con sistemas de salud externos
- [ ] Portal de laboratorio externo
- [ ] Sistema de notificaciones push
- [ ] Reportes avanzados con BI

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte y preguntas:
- Email: support@clinicapp.com
- Documentación: [docs.clinicapp.com](https://docs.clinicapp.com)
- Issues: [GitHub Issues](https://github.com/your-repo/clinic-app/issues)

## 🙏 Agradecimientos

- Equipo de desarrollo
- Comunidad open source
- Profesionales de la salud que proporcionaron feedback
- Usuarios beta testers

---

**ClinicApp** - Transformando la gestión clínica con tecnología moderna. 🏥✨