# Guía de Instalación de Dependencias

## Estado del Sistema

| Herramienta | Versión  |
| ----------- | -------- |
| Python      | 3.11+    |
| PostgreSQL  | 18.x     |
| Node.js     | 24.x LTS |

---

## 1. Instalar PostgreSQL

1. Descargar de: https://www.postgresql.org/download/windows/
2. Instalar **PostgreSQL 16** con todos los componentes
3. Establecer contraseña para usuario `postgres` (¡recuérdala!)
4. Puerto: `5432` (por defecto)
5. Agregar al PATH: `C:\Program Files\PostgreSQL\16\bin`
6. Reiniciar terminal y verificar: `psql --version`

---

## 2. Instalar Node.js

1. Descargar de: https://nodejs.org/ (versión **LTS**)
2. Instalar con opciones por defecto
3. Reiniciar terminal y verificar: `node --version`

---

## 3. Crear Base de Datos

```sql
psql -U postgres
CREATE DATABASE gimnasio_db;
CREATE USER gimnasio_user WITH PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE gimnasio_db TO gimnasio_user;
\q
```

Verificar si se creo exitosamente:
ejecutar en terminal:
psql -U gimnasio_user -d gimnasio_db -h localhost

Te pedirá la contraseña de la BD, ingresa la contraseña que estableciste en el paso 3.

Si todo esta bien, deberias ver algo como esto:
psql (server 18.1)
Type "help" for help.

gimnasio_db= >
