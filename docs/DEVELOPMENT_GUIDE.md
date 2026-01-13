# 👨‍💻 Guía de Desarrollo - GymPro Manager

## Para el Equipo de Desarrollo

Esta guía te ayudará a entender cómo desarrollar nuevos módulos y componentes siguiendo los estándares del proyecto.

---

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico

**Backend:**

- Django 5.2 + Django REST Framework
- PostgreSQL 16 con encoding UTF-8
- JWT para autenticación (SimpleJWT)

**Frontend:**

- React 19 + TypeScript 5.9
- Vite 7 como build tool
- Tailwind CSS v4 para estilos
- Zustand para estado global
- React Query para caché de servidor
- React Router v7 para navegación
- React Hook Form + Zod para formularios

---

## 📋 Cómo Crear un Nuevo Módulo

### Ejemplo: Módulo de Membresías

#### 1️⃣ Backend (Ya está hecho ✅)

El backend ya tiene todo configurado. Solo necesitas conocer los endpoints:

```python
# Endpoints disponibles
GET    /api/memberships/plans/      # Listar planes
POST   /api/memberships/plans/      # Crear plan
GET    /api/memberships/            # Listar membresías
POST   /api/memberships/            # Crear membresía
PUT    /api/memberships/{id}/       # Actualizar
DELETE /api/memberships/{id}/       # Eliminar
```

#### 2️⃣ Frontend - Paso a Paso

##### A. Crear el Servicio API

**Archivo:** `frontend/src/services/memberships.ts`

```typescript
import api from './api';
import type { MembershipPlan, Membership } from '../types';

export const membershipsService = {
  // Planes
  getPlans: () => api.get<MembershipPlan[]>('/memberships/plans/'),
  createPlan: (data: Partial<MembershipPlan>) => 
    api.post('/memberships/plans/', data),
  
  // Membresías
  getMemberships: (params?: any) => 
    api.get<Membership[]>('/memberships/', { params }),
  createMembership: (data: any) => 
    api.post('/memberships/', data),
};
```

##### B. Crear el Store (Opcional)

**Archivo:** `frontend/src/stores/membershipsStore.ts`

```typescript
import { create } from 'zustand';
import { membershipsService } from '../services/memberships';
import type { MembershipPlan } from '../types';

interface MembershipsState {
  plans: MembershipPlan[];
  isLoading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
}

export const useMembershipsStore = create<MembershipsState>((set) => ({
  plans: [],
  isLoading: false,
  error: null,
  
  fetchPlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await membershipsService.getPlans();
      set({ plans: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
```

##### C. Crear la Página de Lista

**Archivo:** `frontend/src/pages/memberships/PlansPage.tsx`

```typescript
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMembershipsStore } from '../../stores/membershipsStore';

export default function PlansPage() {
  const { plans, isLoading, fetchPlans } = useMembershipsStore();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  if (isLoading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Planes de Membresía
        </h1>
        <Link
          to="/memberships/plans/new"
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
        >
          + Nuevo Plan
        </Link>
      </div>

      {/* Grid de planes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {plan.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {plan.description}
            </p>
            <p className="text-3xl font-bold text-indigo-600 mb-4">
              ${plan.price}
              <span className="text-sm text-gray-500">/mes</span>
            </p>
            <button className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
              Ver Detalles
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

##### D. Agregar Ruta en App.tsx

```typescript
// En App.tsx, agregar:
import PlansPage from './pages/memberships/PlansPage';

// Dentro de <Route element={<MainLayout />}>
<Route path="/memberships/plans" element={<PlansPage />} />
```

##### E. Agregar Link en Sidebar

```typescript
// En MainLayout o Sidebar
<Link to="/memberships/plans">
  📋 Planes de Membresía
</Link>
```

---

## 🎨 Guía de Estilos con Tailwind

### Botones

```tsx
{/* Botón Primario */}
<button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-sm">
  Guardar
</button>

{/* Botón Secundario */}
<button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
  Cancelar
</button>

{/* Botón Peligro */}
<button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
  Eliminar
</button>
```

### Cards

```tsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
  <h3 className="text-lg font-semibold text-gray-900 mb-2">Título</h3>
  <p className="text-gray-600">Contenido...</p>
</div>
```

### Inputs

```tsx
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Email
  </label>
  <input
    type="email"
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
    placeholder="ejemplo@email.com"
  />
</div>
```

### Loading States

```tsx
{isLoading ? (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
) : (
  // Contenido
)}
```

---

## 🔧 Patrones Comunes

### 1. Fetch de Datos con React Query

```typescript
import { useQuery } from '@tanstack/react-query';
import { membershipsService } from '../services/memberships';

function PlansPage() {
  const { data: plans, isLoading, error } = useQuery({
    queryKey: ['plans'],
    queryFn: () => membershipsService.getPlans().then(res => res.data),
  });

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {plans?.map(plan => (
        <div key={plan.id}>{plan.name}</div>
      ))}
    </div>
  );
}
```

### 2. Formularios con React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  price: z.number().positive('El precio debe ser positivo'),
});

type FormData = z.infer<typeof schema>;

function PlanForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <p className="text-red-600">{errors.name.message}</p>}
      
      <button type="submit">Guardar</button>
    </form>
  );
}
```

### 3. Manejo de Errores

```typescript
import toast from 'react-hot-toast';

try {
  await membershipsService.createPlan(data);
  toast.success('Plan creado exitosamente');
  navigate('/memberships/plans');
} catch (error: any) {
  const message = error.response?.data?.detail || 'Error al crear plan';
  toast.error(message);
}
```

---

## 📦 Estructura Recomendada para un Módulo

```
memberships/
├── services/
│   └── memberships.ts          # API calls
├── stores/
│   └── membershipsStore.ts     # Estado global (opcional)
├── pages/
│   └── memberships/
│       ├── PlansPage.tsx       # Lista de planes
│       ├── PlanFormPage.tsx    # Crear/Editar plan
│       └── MembershipsPage.tsx # Lista de membresías
├── components/
│   └── memberships/
│       ├── PlanCard.tsx        # Card de plan
│       └── MembershipBadge.tsx # Badge de estado
└── types/
    └── index.ts                # Ya están en types/index.ts
```

---

## ✅ Checklist para Nuevo Módulo

- [ ] Crear servicio API en `services/`
- [ ] Crear store si maneja estado complejo
- [ ] Crear página de lista
- [ ] Crear página de formulario (crear/editar)
- [ ] Crear página de detalle (opcional)
- [ ] Agregar rutas en `App.tsx`
- [ ] Agregar links en sidebar/navegación
- [ ] Probar flujo completo (CRUD)
- [ ] Manejo de errores
- [ ] Loading states
- [ ] Responsive design

---

## 🆘 Problemas Comunes

### CORS Errors

Si ves errores de CORS, verifica que el backend tenga configurado:

```python
# backend/config/settings.py
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]
```

### Token Expirado

El interceptor de axios maneja automáticamente el refresh. Si sigue fallando, limpia localStorage:

```javascript
localStorage.clear();
```

### TypeScript Errors

Asegúrate de que los types estén definidos en `frontend/src/types/index.ts`

---

## 📚 Recursos

- [Django REST Framework Docs](https://www.django-rest-framework.org/)
- [React Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Zustand Docs](https://github.com/pmndrs/zustand)

---

**¿Dudas?** Consulta los módulos existentes como referencia:

- `pages/MembersPage.tsx` - Ejemplo completo de lista
- `pages/MemberFormPage.tsx` - Ejemplo de formulario complejo
- `stores/authStore.ts` - Ejemplo de store con persist

**Última actualización**: 2026-01-12
