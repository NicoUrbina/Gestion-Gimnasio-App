# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al proyecto GymPro Manager!

## 🚀 Primeros Pasos

1. **Fork** el repositorio
2. **Clona** tu fork: `git clone https://github.com/TU-USUARIO/Gestion-Gimnasio-App.git`
3. **Configura** el entorno siguiendo el [README.md](README.md)

## 📝 Convenciones de Código

### Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: agregar nueva funcionalidad
fix: corregir bug
docs: cambios en documentación
style: formato, punto y coma faltantes, etc
refactor: refactorización de código
test: agregar o corregir tests
chore: cambios en build, dependencias, etc
```

**Ejemplos:**
```
feat: agregar página de miembros
fix: corregir error de login
docs: actualizar instrucciones de instalación
```

### Python (Backend)

- Seguir PEP 8
- Usar docstrings en funciones y clases
- Nombres de variables en `snake_case`
- Máximo 88 caracteres por línea

### TypeScript (Frontend)

- Usar TypeScript estricto
- Componentes en PascalCase: `MemberList.tsx`
- Hooks personalizados empiezan con `use`: `useMembers.ts`
- Estilos con Tailwind CSS

## 🔀 Flujo de Trabajo

### 1. Crear Rama

```bash
git checkout -b feature/nombre-descriptivo
# o
git checkout -b fix/descripcion-del-bug
```

### 2. Desarrollar

- Escribe código limpio y documentado
- Agrega tests cuando sea posible
- Prueba tus cambios localmente

### 3. Commit

```bash
git add .
git commit -m "feat: descripción del cambio"
```

### 4. Push

```bash
git push origin feature/nombre-descriptivo
```

### 5. Pull Request

1. Ve a GitHub y crea un Pull Request
2. Describe los cambios realizados
3. Espera la revisión del equipo

## 📁 Estructura de Archivos

### Backend (Django)

```
apps/nombre_app/
├── models.py       # Modelos de datos
├── serializers.py  # Serializers para API
├── views.py        # ViewSets y vistas
├── urls.py         # Rutas de la app
├── admin.py        # Registro en admin
└── tests.py        # Tests
```

### Frontend (React)

```
src/
├── components/     # Componentes reutilizables
├── pages/          # Páginas/vistas
├── layouts/        # Layouts
├── services/       # Llamadas a API
├── stores/         # Estado global (Zustand)
├── types/          # Tipos TypeScript
└── hooks/          # Hooks personalizados
```

## 🧪 Tests

### Backend
```bash
cd backend
python manage.py test
```

### Frontend
```bash
cd frontend
npm run test
```

## ❓ ¿Preguntas?

Si tienes dudas, abre un Issue en GitHub o contacta al equipo.

---

¡Gracias por contribuir! 🎉
