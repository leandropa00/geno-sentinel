# Geno Sentinel

Sistema de microservicios para la gestión de datos clínicos y genómicos oncológicos.

## Arquitectura

El proyecto está compuesto por los siguientes servicios:

- **API Gateway** (Puerto 8080): Gateway centralizado con autenticación JWT y enrutamiento
- **Clinical Service** (Puerto 3000): Microservicio para gestión de pacientes, tipos de tumor e historias clínicas
- **Genomic Service** (Puerto 3001): Microservicio para análisis genómicos (en desarrollo)

## Documentación de API

### Swagger

El servicio clínico incluye documentación interactiva de Swagger/OpenAPI:

- **URL**: `http://localhost:3000/api`
- **Descripción**: API para la gestión de pacientes, tipos de tumor e historias clínicas oncológicas
- **Versión**: 1.0

La documentación Swagger incluye:
- Gestión de Pacientes
- Gestión de Tipos de Tumor
- Gestión de Historias Clínicas

### Bruno

El proyecto incluye una colección de Bruno para probar los endpoints de la API.

**Ubicación**: `api-collection/`

**Estructura de la colección**:
- **Auth**: Endpoints de autenticación (Login, Status)
- **Clinical**: 
  - **Patients**: CRUD de pacientes
  - **Tumor Types**: CRUD de tipos de tumor
  - **Clinical Records**: CRUD de historias clínicas
- **Status**: Endpoint de estado del gateway

**Configuración del entorno**:
- **Base URL**: `http://localhost:8080`
- **Variable secreta**: `BEARER_TOKEN` (se configura automáticamente después del login)

**Uso**:
1. Abre la colección con [Bruno](https://www.usebruno.com/)
2. Selecciona el entorno "Geno Sentinel"
3. Ejecuta el endpoint de Login para obtener el token JWT
4. El token se guardará automáticamente en la variable `BEARER_TOKEN`
5. Prueba los demás endpoints de la colección

## Endpoints Principales

### Autenticación (API Gateway)
- `POST /api/auth/login` - Iniciar sesión y obtener token JWT
- `GET /api/auth/status` - Estado del servicio de autenticación