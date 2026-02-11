# Dashboards a arreglar

-1 Boton en la pagina principal para regresar al dashboard LISTO

## Panel de Admin

- Panel Dashboard principal:
--2 Label de "Ingresos del Mes" no esta cargando la informacion (Archivo StatsCard) LISTO
--3 Label de "Ingresos Hoy" no esta cargando la informacion (Archivo StatsCard) LISTO

- Panel Miembros:
--4 Tabla de miembros la columna "Menu de acciones" no realiza ninguna accion LISTO
--5 Seccion "Nuevo miembro" las letras del formulario estan en negro, no se leen LISTO

- Panel Membresias:
--6 Seccion de Crear Nuevo Plan las letras del formulario estan en negro, no se leen LISTO

- Panel Pagos:
--7 Boton de Exportar Excel no funciona, error de la api: Las credenciales de autenticación no se proveyeron. LISTO

- Panel Clases:
--8 Rediseñar el panel, agregar tabla para visualizar las clases, mantener la informacion mostrada en las cards, que tenga paginacion y se maneje inspirado en un calendario. LISTO
--9 Error al reservar la clase (❌ Error al reservar) Failed to load resource: the server responded with a status of 400 (Bad Request) :8000/api/classes/reservations/:1 LISTO

- Panel Entrenadores:
--10 Diseñar el panel completo, hay que mostarr una tabla con los entrenadores, con columnas de informacion basica y una columna de acciones que permita editar, eliminar y ver detalles. LISTO

- Panel Progreso:
--11 El Registrar progreso, cambiar las letras negras del formulario no se leen LISTO
--12 Al intentar registrar el progreso sale (Error al guardar progreso) 
{
    "message": "Request failed with status code 400",
    "name": "AxiosError",
    "stack": "AxiosError: Request failed with status code 400\n    at settle (http://localhost:5173/node_modules/.vite/deps/axios.js?v=8bba4ce1:1257:12)\n    at XMLHttpRequest.onloadend (http://localhost:5173/node_modules/.vite/deps/axios.js?v=8bba4ce1:1606:7)\n    at Axios.request (http://localhost:5173/node_modules/.vite/deps/axios.js?v=8bba4ce1:2223:41)\n    at async Object.createLog (http://localhost:5173/src/services/progress.ts:13:22)\n    at async handleSubmit (http://localhost:5173/src/pages/progress/UpdateProgressPage.tsx:42:7)",
    "config": {
        "transitional": {
            "silentJSONParsing": true,
            "forcedJSONParsing": true,
            "clarifyTimeoutError": false
        },
        "adapter": [
            "xhr",
            "http",
            "fetch"
        ],
        "transformRequest": [
            null
        ],
        "transformResponse": [
            null
        ],
        "timeout": 0,
        "xsrfCookieName": "XSRF-TOKEN",
        "xsrfHeaderName": "X-XSRF-TOKEN",
        "maxContentLength": -1,
        "maxBodyLength": -1,
        "env": {},
        "headers": {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzcwNzg5MjE3LCJpYXQiOjE3NzA3ODU2MTgsImp0aSI6IjcwZGVkZGQ3MjE1YTQzNTlhYTkwNjBlMTBlNWVjM2ExIiwidXNlcl9pZCI6IjIiLCJlbWFpbCI6ImFkbWluQGdpbW5hc2lvLmNvbSIsInJvbGUiOiJhZG1pbiJ9.Cm47awlCUPyoo8x7uUa6TuejFMcPyFrG8jIr88YGCek"
        },
        "baseURL": "http://localhost:8000/api",
        "method": "post",
        "url": "/progress/logs/",
        "data": "{\"date\":\"2026-02-11\",\"weight\":111,\"height\":11,\"body_fat_percentage\":11,\"muscle_mass\":1,\"chest\":11,\"waist\":11,\"hips\":11,\"notes\":\"dasdsad\"}",
        "allowAbsoluteUrls": true
    },
    "code": "ERR_BAD_REQUEST",
    "status": 400
}
-13 Revisar funcionalidad luego de registrar el progreso inicial, muestreo de datos con estadisticas



## Cambio General para el Panel de Membresias

-14 Scrapear desde el backend la pagina de https://www.bcv.org.ve/ para conseguir el precio del dolar