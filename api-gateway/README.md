# API Gateway Service

Microservicio de autenticación y gateway desarrollado con Spring Boot y Spring Cloud Gateway.

## Características

- **Autenticación JWT**: Autenticación de usuarios mediante credenciales y emisión de tokens JWT
- **Autorización**: Sistema de un único rol de usuario con acceso a todas las funcionalidades
- **API Gateway**: Enrutamiento de peticiones hacia los microservicios de Clínica y Genómica
- **Health Checks**: Endpoints de monitoreo básico de estado (health check y status)
- **Spring Cloud Gateway**: Gateway reactivo para enrutamiento de peticiones

## Arquitectura

El proyecto utiliza Spring Cloud Gateway para el enrutamiento y Spring Security para la autenticación:

```
src/
├── main/
│   ├── java/com/genosentinel/gateway/
│   │   ├── config/          # Configuraciones (Security, etc.)
│   │   ├── controller/      # Controladores REST
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── security/        # Filtros de seguridad JWT
│   │   └── service/         # Servicios de negocio
│   └── resources/
│       └── application.yml  # Configuración de la aplicación
```

## Endpoints

### Autenticación
- `POST /api/auth/login` - Autenticación de usuario y obtención de token JWT
- `GET /api/auth/status` - Estado del servicio de autenticación

### Status
- `GET /api/status` - Estado general del gateway

### Health Checks
- `GET /actuator/health` - Health check de Spring Boot Actuator
- `GET /actuator/info` - Información del servicio

### Enrutamiento
- `/api/clinical/**` - Enrutado al servicio clínico
- `/api/genomic/**` - Enrutado al servicio genómico

## Configuración

### Variables de Entorno

- `SERVER_PORT`: Puerto del servidor (default: 8080)
- `JWT_SECRET`: Clave secreta para firmar tokens JWT (mínimo 32 caracteres)
- `JWT_EXPIRATION`: Tiempo de expiración del token en milisegundos (default: 86400000 = 24 horas)
- `CLINICAL_SERVICE_HOST`: Host del servicio clínico (default: clinical-service)
- `CLINICAL_SERVICE_PORT`: Puerto del servicio clínico (default: 3000)
- `GENOMIC_SERVICE_HOST`: Host del servicio genómico (default: genomic-service)
- `GENOMIC_SERVICE_PORT`: Puerto del servicio genómico (default: 3001)

### Usuarios por Defecto

El servicio incluye usuarios de prueba en memoria:
- `admin` / `admin123`
- `user` / `user123`
- `clinician` / `clinician123`

**Nota**: En producción, estos usuarios deben estar almacenados en una base de datos.

## Ejecución

### Desarrollo Local

```bash
mvn spring-boot:run
```

### Producción Local

```bash
mvn clean package
java -jar target/api-gateway-1.0.0.jar
```

## Docker

### Construcción de la imagen

```bash
docker build -t api-gateway .
```

### Ejecución con Docker

```bash
docker run -p 8080:8080 \
  -e JWT_SECRET="your-secret-key-minimum-32-characters" \
  -e CLINICAL_SERVICE_HOST="clinical-service" \
  -e CLINICAL_SERVICE_PORT="3000" \
  -e GENOMIC_SERVICE_HOST="genomic-service" \
  -e GENOMIC_SERVICE_PORT="3001" \
  api-gateway
```

## Uso de la API

### 1. Autenticación

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

Respuesta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer"
}
```

### 2. Acceso a servicios protegidos

```bash
curl -X GET http://localhost:8080/api/clinical/patients \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Health Check

```bash
curl http://localhost:8080/actuator/health
```

## Kubernetes

Los manifiestos de Kubernetes están disponibles en `k8s/api-gateway/`.

### Despliegue

```bash
kubectl apply -k k8s/api-gateway/
```

### Verificación

```bash
kubectl get pods -l app=api-gateway
kubectl get svc api-gateway
```

## Seguridad

- Todos los endpoints excepto `/api/auth/**`, `/actuator/health`, `/actuator/info` y `/api/status` requieren autenticación JWT
- El token JWT debe enviarse en el header `Authorization: Bearer <token>`
- El sistema utiliza un único rol (`ROLE_USER`) para todos los usuarios autenticados

