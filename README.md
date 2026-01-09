# 🏋️ GymPro Manager - Sistema de Gestión de Gimnasio

Sistema completo para la gestión de gimnasios con Django REST Framework y React.

## 🚀 Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| **Backend** | Django 5.2 + Django REST Framework |
| **Frontend** | React 18 + TypeScript + Vite |
| **Base de Datos** | PostgreSQL 16 |
| **Autenticación** | JWT (SimpleJWT) |
| **Estilos** | Tailwind CSS v4 |
| **Estado** | Zustand |

## 📁 Estructura del Proyecto

```
Gestion-Gimnasio-App/
├── backend/                    # API Django
│   ├── apps/                   # Aplicaciones Django
│   │   ├── users/              # Usuarios y roles
│   │   ├── members/            # Miembros del gimnasio
│   │   ├── memberships/        # Planes y membresías
│   │   ├── classes/            # Clases y reservas
│   │   ├── payments/           # Pagos y facturas
│   │   ├── staff/              # Personal y horarios
│   │   ├── progress/           # Progreso y logros
│   │   ├── access/             # Control de acceso
│   │   ├── analytics/          # Métricas del atleta
│   │   └── ...                 # Más apps
│   ├── config/                 # Configuración Django
│   ├── venv/                   # Entorno virtual (no versionado)
│   └── manage.py
├── frontend/                   # App React
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   ├── layouts/            # Layouts (MainLayout)
│   │   ├── pages/              # Páginas (Login, Dashboard)
│   │   ├── services/           # Cliente API (axios)
│   │   ├── stores/             # Estado global (Zustand)
│   │   └── types/              # Tipos TypeScript
│   └── ...
└── docs/                       # Documentación adicional
```

## 🛠️ Configuración Inicial

### Requisitos Previos

- Python 3.11+
- Node.js 18+
- PostgreSQL 16+

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/Gestion-Gimnasio-App.git
cd Gestion-Gimnasio-App
```

### 2️⃣ Configurar Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno (Windows)
venv\Scripts\activate
# Activar entorno (Linux/Mac)
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Copiar variables de entorno
cp .env.example .env
# Editar .env con tus datos de PostgreSQL

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario (opcional)
python manage.py createsuperuser

# Ejecutar servidor
python manage.py runserver
```

### 3️⃣ Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Ejecutar en desarrollo
npm run dev
```

### 4️⃣ Acceder a la Aplicación

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api/
- **Admin Django:** http://localhost:8000/admin/

### 5️⃣ Credenciales de Prueba

```
Email: admin@gimnasio.com
Password: admin123
```

## 📡 API Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login/` | Login (JWT) |
| POST | `/api/auth/refresh/` | Refrescar token |
| GET | `/api/users/me/` | Usuario actual |

### Miembros
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/members/` | Listar miembros |
| POST | `/api/members/` | Crear miembro |
| GET | `/api/members/{id}/` | Detalle miembro |
| GET | `/api/members/stats/` | Estadísticas |
| GET | `/api/members/expiring_soon/` | Por vencer |

### Membresías
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/memberships/plans/` | Listar planes |
| GET | `/api/memberships/` | Listar membresías |
| POST | `/api/memberships/{id}/freeze/` | Congelar |
| POST | `/api/memberships/{id}/unfreeze/` | Descongelar |

### Clases
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/classes/` | Listar clases |
| GET | `/api/classes/types/` | Tipos de clase |
| GET | `/api/classes/reservations/` | Reservaciones |
| POST | `/api/classes/reservations/{id}/cancel/` | Cancelar reserva |

### Pagos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/payments/` | Listar pagos |
| POST | `/api/payments/` | Registrar pago |
| GET | `/api/payments/stats/` | Estadísticas |

## 🗃️ Modelos de Datos

El sistema cuenta con 40+ modelos organizados en las siguientes categorías:

- **Usuarios:** User, Role
- **Miembros:** Member, MembershipPlan, Membership
- **Clases:** ClassType, GymClass, Reservation, Routine
- **Pagos:** Payment, Invoice
- **Personal:** Staff, Schedule
- **Progreso:** ProgressLog, Achievement
- **Analytics:** MetricType, AthleteMetric, PerformanceGoal
- **Documentos:** Contract, Waiver, Feedback
- **Equipamiento:** Equipment, MaintenanceRecord
- **Notificaciones:** Notification, EmailLog, NotificationPreference

## 🔐 Roles del Sistema

| Rol | Permisos |
|-----|----------|
| **admin** | Acceso total al sistema |
| **manager** | Gestión de miembros, clases, pagos |
| **trainer** | Gestión de clases y rutinas |
| **receptionist** | Registro de accesos y pagos |
| **member** | Acceso a su perfil y reservas |

## 🧪 Ejecutar Tests

```bash
# Backend
cd backend
python manage.py test

# Frontend
cd frontend
npm run test
```

## 📦 Build para Producción

```bash
# Frontend
cd frontend
npm run build
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: descripción'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.
