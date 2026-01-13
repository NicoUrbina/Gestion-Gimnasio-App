# 🔐 Credenciales del Sistema - GymPro Manager

> [!WARNING]
> **Documento Confidencial**
>
> Este archivo contiene credenciales de desarrollo. NO compartir en repositorios públicos.
> Este archivo ya está en `.gitignore` para evitar commits accidentales.

## Superusuario Django

Credenciales del administrador principal del sistema:

| Campo | Valor |
|-------|-------|
| **Email** | `admin@gimnasio.com` |
| **Username** | `admin` |
| **Password** | `admin123` |
| **Nombre** | Admin Sistema |
| **Rol** | Superusuario (acceso total) |

### Acceso al Panel de Administración

- **URL**: <http://localhost:8000/admin/>
- **Permisos**: Acceso completo a todas las funcionalidades

---

## Base de Datos PostgreSQL

### Credenciales de Conexión

| Parámetro | Valor |
|-----------|-------|
| **Host** | `localhost` |
| **Puerto** | `5432` |
| **Database** | `gimnasio_db` |
| **Usuario** | `gimnasio_user` |
| **Password** | `gimnasio123` |
| **Encoding** | UTF-8 |
| **Locale** | C |

### Usuario Postgres (Administrador)

| Campo | Valor |
|-------|-------|
| **Usuario** | `postgres` |
| **Password** | `lenovo` |

---

## Configuración de Desarrollo

### Backend (Django)

```bash
# Activar entorno virtual
cd backend
.\venv\Scripts\activate

# Iniciar servidor
python manage.py runserver
```

**URL**: <http://localhost:8000>

### Frontend (React)

```bash
cd frontend
npm run dev
```

**URL**: <http://localhost:5173>

---

## Variables de Entorno (.env)

Ubicación: `backend/.env`

```env
SECRET_KEY=django-insecure-dev-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_ENGINE=django.db.backends.postgresql
DB_NAME=gimnasio_db
DB_USER=gimnasio_user
DB_PASSWORD=gimnasio123
DB_HOST=localhost
DB_PORT=5432

JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

---

## Notas de Seguridad

> [!IMPORTANT]
> **Para Producción**
>
> Antes de desplegar a producción, asegúrate de:
>
> - [ ] Cambiar `SECRET_KEY` a un valor aleatorio seguro
> - [ ] Cambiar todas las contraseñas por valores seguros
> - [ ] Configurar `DEBUG=False`
> - [ ] Configurar `ALLOWED_HOSTS` correctamente
> - [ ] Usar variables de entorno en lugar de valores hardcodeados
> - [ ] Configurar SSL/HTTPS
> - [ ] Configurar backup automático de base de datos

---

**Última actualización**: 2026-01-12  
**Entorno**: Desarrollo Local
