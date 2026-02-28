# NailBook 💅

Sistema de gestión integral para salón de uñas. Permite administrar clientas, servicios y citas, 
llevando un registro detallado de la agenda diaria y un control contable de ingresos por citas atendidas,
con reportes diarios y mensuales.

## Tecnologías

**Backend**
- ASP.NET Core 10
- Entity Framework Core
- SQL Server
- Clean Architecture
- FluentValidation
- Mapster

**Frontend**
- React + TypeScript
- Vite
- Tailwind CSS
- Axios

## Arquitectura

El proyecto sigue los principios de **Clean Architecture** dividido en 4 capas:
```
NailsApi.Domain         → Entidades, Interfaces
NailsApi.Application    → Servicios, DTOs, Validadores
NailsApi.Infrastructure → Repositorios, DbContext
nailsApi                → Controllers, API
```

## Módulos

- ✅ Clientas — CRUD completo con paginación y búsqueda
- 🔄 Servicios — En desarrollo
- 🔄 Citas — En desarrollo
- 🔄 Reportes — En desarrollo

## Instalación

**Backend**
```bash
cd nailsApi
dotnet restore
dotnet ef database update
dotnet run
```

**Frontend**
```bash
cd nailsapp
npm install
npm run dev
```

## Variables de entorno

Crea un archivo `.env` en `nailsapp/`:
```
VITE_API_URL=https://localhost:7175/api
```

