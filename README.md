# Sistema de Gestión de Gimnasio

Sistema web integral para gestión de gimnasio desarrollado con Django (Backend) y React + Vite (Frontend).

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Backend | Python 3.11+ / Django 5.x / DRF |
| Frontend | React 18+ / Vite / Tailwind CSS |
| Auth | JWT (SimpleJWT) |
| DB | PostgreSQL 15+ (SQLite para desarrollo) |

## 📁 Estructura del Proyecto

```
├── backend/                 # API Django
│   ├── apps/               # Aplicaciones Django
│   │   ├── users/          # Autenticación y roles
│   │   ├── members/        # Gestión de miembros
│   │   ├── memberships/    # Planes y suscripciones
│   │   ├── classes/        # Clases y reservas
│   │   ├── payments/       # Pagos
│   │   ├── staff/          # Personal
│   │   ├── progress/       # Seguimiento físico
│   │   ├── access/         # Control de acceso
│   │   ├── reports/        # Reportes
│   │   └── notifications/  # Notificaciones
│   ├── config/             # Configuración Django
│   └── core/               # Utilidades
├── frontend/               # React + Vite
└── docs/                   # Documentación
```

## 🛠️ Configuración Inicial

### 1. Backend (Django)

```bash
cd backend

# Activar entorno virtual
# Windows:
venv\bin\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias (si es necesario)
pip install -r requirements.txt

# Ejecutar migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Ejecutar servidor
python manage.py runserver
```

### 2. Frontend (React) - Pendiente

```bash
cd frontend
npm install
npm run dev
```

## ⚙️ Variables de Entorno

Copiar `.env.example` a `.env` y configurar:

```env
SECRET_KEY=tu-clave-secreta
DEBUG=True
DB_ENGINE=django.db.backends.sqlite3
```

## 📋 Requisitos Pendientes

- [ ] Instalar PostgreSQL
- [ ] Instalar Node.js
- [ ] Configurar frontend React

## 👥 Roles del Sistema

- **Administrador**: Acceso completo
- **Empleado**: CRUD miembros + lectura
- **Entrenador**: Gestión de clases propias
- **Miembro**: Portal personal

## 📄 Licencia

Proyecto privado - Todos los derechos reservados
