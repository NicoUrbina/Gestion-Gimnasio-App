# 📋 Arquitectura del Proyecto - GymPro Manager

## Stack Tecnológico

### Backend

- **Django 5.2.10** - Framework web
- **Django REST Framework 3.16.1** - API REST
- **PostgreSQL 16+** - Base de datos
- **SimpleJWT** - Autenticación JWT
- **Python 3.11.9** - Lenguaje

### Frontend

- **React 19.2** - Librería UI
- **TypeScript 5.9** - Tipado estático
- **Vite 7.2** - Build tool
- **Tailwind CSS 4.1** - Estilos
- **Zustand 5.0** - Estado global
- **React Query 5.90** - Gestión de datos servidor
- **React Router 7.12** - Enrutamiento
- **React Hook Form 7.70** - Formularios
- **Zod 4.3** - Validación de esquemas

---

## Estructura de Aplicaciones Django

### Core Modules (Prioridad Alta)

#### 1. **users** - Autenticación y Usuarios

- Modelo: `User` (personalizado)
- Roles: admin, manager, trainer, receptionist, member
- Autenticación JWT
- Gestión de permisos

#### 2. **members** - Miembros del Gimnasio

- Modelo: `Member`
- CRUD completo
- Búsqueda y filtros
- Estadísticas de membresía

#### 3. **memberships** - Planes y Membresías

- Modelos: `MembershipPlan`, `Membership`
- Planes disponibles
- Asignación de membresías
- Estados: activa, congelada, vencida
- Renovaciones

#### 4. **Dashboard** (Frontend)

- Resumen general del gimnasio
- Estadísticas clave
- Acceso rápido a módulos

---

### Operational Modules

#### 5. **classes** - Clases Grupales

- Modelos: `ClassType`, `GymClass`, `Reservation`, `Routine`
- Horarios de clases
- Sistema de reservas
- Capacidad máxima
- Asistencia

#### 6. **payments** - Pagos y Facturación

- Modelos: `Payment`, `Invoice`
- Registro de pagos
- Métodos de pago
- Historial de transacciones
- Reportes financieros

#### 7. **staff** - Personal

- Modelos: `Staff`, `Schedule`
- Gestión de empleados
- Horarios de trabajo
- Roles y responsabilidades

#### 8. **access** - Control de Acceso

- Modelo: `AccessLog`
- Registro de entradas/salidas
- Validación de membresías
- Reporte de asistencia

---

### Analytics & Progress Modules

#### 9. **progress** - Progreso de Miembros

- Modelos: `ProgressLog`, `Achievement`
- Seguimiento de objetivos
- Logros y medallas
- Historial de progreso

#### 10. **analytics** - Métricas del Atleta

- Modelos: `MetricType`, `AthleteMetric`, `PerformanceGoal`
- Métricas personalizadas
- Análisis de rendimiento
- Gráficos y visualizaciones

#### 11. **reports** - Reportes

- Generación de reportes
- Exportación a PDF/Excel
- Reportes personalizados

#### 12. **assessments** - Evaluaciones Físicas

- Evaluaciones periódicas
- Mediciones corporales
- Composición corporal

---

### Support Modules

#### 13. **documents** - Documentos

- Modelos: `Contract`, `Waiver`, `Feedback`
- Contratos digitales
- Formularios de exención
- Feedback de clientes

#### 14. **equipment** - Equipamiento

- Modelos: `Equipment`, `MaintenanceRecord`
- Inventario de equipos
- Mantenimiento preventivo
- Historial de reparaciones

#### 15. **notifications** - Notificaciones

- Modelos: `Notification`, `EmailLog`, `NotificationPreference`
- Sistema de alertas
- Emails automáticos
- Preferencias de usuario

---

## Arquitectura Frontend

### Estructura de Carpetas

```
frontend/src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Botones, inputs, cards
│   └── common/         # Header, Sidebar, Footer
├── layouts/            # Layouts principales
│   └── MainLayout.tsx  # Layout con sidebar
├── pages/              # Páginas por módulo
│   ├── auth/           # Login, Register
│   ├── dashboard/      # Dashboard principal
│   ├── members/        # Lista, crear, editar
│   ├── memberships/    # Planes, asignar
│   ├── classes/        # Clases y reservas
│   └── ...
├── services/           # Cliente API
│   ├── api.ts          # Configuración axios
│   └── modules/        # Servicios por módulo
├── stores/             # Estado global (Zustand)
│   ├── authStore.ts    # Estado de autenticación
│   └── ...
└── types/              # Tipos TypeScript
    └── models.ts       # Interfaces de modelos
```

---

## Flujo de Desarrollo Recomendado

### Fase 1: Core (Semanas 1-2) 🎯

1. **Autenticación** - Login/Logout con JWT
2. **Dashboard** - Vista principal con estadísticas
3. **Layout** - Sidebar y navegación

### Fase 2: Gestión Básica (Semanas 3-4)

4. **Miembros** - CRUD completo
2. **Membresías** - Planes y asignación

### Fase 3: Operaciones (Semanas 5-6)

6. **Clases** - Gestión y reservas
2. **Pagos** - Registro de pagos

### Fase 4: Avanzado (Semanas 7+)

8. **Personal** - Gestión de staff
2. **Acceso** - Control de entrada
3. **Analytics** - Métricas y reportes

---

## Convenciones de Código

### Backend

- PEP 8 para Python
- Nombres de clases en PascalCase
- Nombres de funciones en snake_case
- Docstrings en español
- ViewSets para APIs REST

### Frontend

- Componentes en PascalCase
- Hooks personalizados con prefijo `use`
- Tipos TypeScript explícitos
- Atomic design pattern
- Tailwind CSS para estilos

---

## APIs y Endpoints Principales

### Autenticación

- `POST /api/auth/login/` - Login con email/password
- `POST /api/auth/refresh/` - Renovar token
- `GET /api/users/me/` - Usuario actual

### Miembros

- `GET /api/members/` - Listar miembros
- `POST /api/members/` - Crear miembro
- `GET /api/members/{id}/` - Detalle
- `PUT /api/members/{id}/` - Actualizar
- `DELETE /api/members/{id}/` - Eliminar
- `GET /api/members/stats/` - Estadísticas

### Membresías

- `GET /api/memberships/plans/` - Planes disponibles
- `GET /api/memberships/` - Membresías activas
- `POST /api/memberships/` - Crear membresía
- `POST /api/memberships/{id}/freeze/` - Congelar
- `POST /api/memberships/{id}/unfreeze/` - Descongelar

---

**Última actualización**: 2026-01-12  
**Versión**: 1.0
