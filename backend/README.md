# 🏋️‍♂️ Backend - Gestión Gimnasio App

Bienvenido al backend del Sistema de Gestión de Gimnasio. Este proyecto está construido con **Django 5** y **Django Rest Framework (DRF)**.

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una estructura modular donde cada carpeta dentro de `apps/` representa un módulo de negocio:

```text
backend/
├── apps/
│   ├── users/        # Autenticación, Roles y Usuarios
│   ├── members/      # Gestión de Clientes/Miembros
│   ├── memberships/  # Planes y Membresías
│   └── common/       # 🛠️ Utilidades y Sistema de Seeders
├── config/           # Configuración global (settings, urls)
└── manage.py         # Comando principal de Django
```

## 🚀 Guía de Inicio Rápido (Setup)

Sigue estos pasos para levantar el proyecto en tu máquina local:

### 1. Entorno Virtual

Crea y activa tu entorno virtual:

```bash
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

### 2. Instalar Dependencias

```bash
pip install -r requirements.txt
```

### 3. Variables de Entorno

Copia el archivo de ejemplo y configúralo (si es necesario):

```bash
# Windows
copy .env.example .env
```

> Asegúrate de que las credenciales de Base de Datos en `.env` coincidan con tu PostgreSQL local.

### 4. Base de Datos y Seeders

Este comando aplica migraciones y **crea datos de prueba automáticamente** (Roles, Admin, Planes):

```bash
python manage.py migrate
python manage.py seed_db
```

### 5. Correr el Servidor

```bash
python manage.py runserver
```

Visita: `http://127.0.0.1:8000/api/`

---

## 🔑 API & Endpoints Clave

La API está protegida con **JWT**. Necesitas un token para la mayoría de peticiones.

### Autenticación

- **Login**: `POST /api/auth/login/`
  - Body: `{"email": "admin@gym.com", "password": "adminpassword123"}`
  - Respuesta: `{ "access": "...", "refresh": "..." }`

### Miembros

- **Listar**: `GET /api/members/` (Requiere Header: `Authorization: Bearer <token>`)
- **Crear**: `POST /api/members/`

---

## 💡 Guía de Desarrollo

### Seeders (Datos de Prueba)

Si necesitas agregar más datos iniciales, no los crees manualmente.

1. Ve a `backend/apps/common/seeds/`.
2. Crea un archivo nuevo (ej: `004_ejercicios.py`).
3. Define una función `run()`.
4. Ejecuta `python manage.py seed_db`.

### Versionamiento

- **Commits Ordenados**: Usa prefijos como `feat:`, `fix:`, `chore:`, `docs:`.
- **Ramas**: Trabaja en ramas separadas (`feature/nueva-funcionalidad`) antes de unir a `main`.

---

_Equipo de Desarrollo Backend_
