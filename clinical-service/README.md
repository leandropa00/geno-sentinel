# Clinical Service

Microservicio de gestión clínica desarrollado con NestJS y arquitectura hexagonal.

## Características

- **Gestión de Pacientes**: Crear, actualizar, consultar y desactivar pacientes
- **Gestión de Tipos de Tumor**: Mantener el catálogo de tumores oncológicos
- **Gestión de Historias Clínicas**: Registrar diagnósticos, tratamientos y evolución de los pacientes
- **Arquitectura Hexagonal**: Separación clara entre dominio, aplicación, infraestructura y presentación
- **Documentación Swagger/OpenAPI**: API completamente documentada
- **MySQL con TypeORM**: Persistencia de datos con ORM

## Arquitectura

El proyecto sigue una arquitectura hexagonal (puertos y adaptadores):

```
src/
├── domain/              # Capa de dominio
│   ├── entities/        # Entidades de dominio
│   └── repositories/    # Interfaces de repositorio (puertos)
├── application/         # Capa de aplicación
│   ├── dto/            # Data Transfer Objects
│   └── use-cases/      # Casos de uso
├── infrastructure/      # Capa de infraestructura
│   └── persistence/    # Implementaciones de repositorios (adaptadores)
└── presentation/       # Capa de presentación
    └── controllers/    # Controladores REST
```

## Instalación

```bash
npm install
```

## Configuración

1. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Configura las variables de entorno según tu entorno:
- `DB_HOST`: Host de MySQL
- `DB_PORT`: Puerto de MySQL (default: 3306)
- `DB_USERNAME`: Usuario de MySQL
- `DB_PASSWORD`: Contraseña de MySQL
- `DB_DATABASE`: Nombre de la base de datos
- `PORT`: Puerto de la aplicación (default: 3000)
- `NODE_ENV`: Entorno de ejecución (development/production)

## Base de Datos

El servicio utiliza MySQL con TypeORM. Las tablas se crean automáticamente en modo desarrollo (`synchronize: true`).

### Entidades

- **Patient**: Datos personales y de identificación del paciente
- **TumorType**: Catálogo de patologías oncológicas
- **ClinicalRecord**: Registros de diagnóstico de cáncer

## Ejecución

### Desarrollo Local
```bash
npm run start:dev
```

### Producción Local
```bash
npm run build
npm run start:prod
```

## Docker

### Construcción de la imagen
```bash
docker build -t clinical-service .
```

### Ejecución con Docker Compose (recomendado)
Docker Compose incluye MySQL y el servicio clínico configurados:

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f clinical-service

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

El servicio estará disponible en `http://localhost:3000` y la documentación Swagger en `http://localhost:3000/api`.

### Desarrollo con Docker
Para desarrollo con hot-reload:

```bash
docker build -f Dockerfile.dev -t clinical-service:dev .
docker run -p 3000:3000 --env-file .env clinical-service:dev
```

### Variables de entorno en Docker
Las variables de entorno se pueden configurar en `docker-compose.yml` o mediante un archivo `.env`:

```bash
# Ejemplo de .env para docker-compose
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=rootpassword
DB_DATABASE=clinical_db
PORT=3000
NODE_ENV=production
```

## API Documentation

Una vez iniciado el servicio, la documentación Swagger está disponible en:
```
http://localhost:3000/api
```

## Endpoints

### Pacientes (`/patients`)
- `POST /patients` - Crear paciente
- `GET /patients` - Listar todos los pacientes
- `GET /patients/:id` - Obtener paciente por ID
- `PUT /patients/:id` - Actualizar paciente
- `PUT /patients/:id/deactivate` - Desactivar paciente
- `GET /patients/status/:status` - Obtener pacientes por estado

### Tipos de Tumor (`/tumor-types`)
- `POST /tumor-types` - Crear tipo de tumor
- `GET /tumor-types` - Listar todos los tipos de tumor
- `GET /tumor-types/:id` - Obtener tipo de tumor por ID
- `PUT /tumor-types/:id` - Actualizar tipo de tumor
- `DELETE /tumor-types/:id` - Eliminar tipo de tumor

### Historias Clínicas (`/clinical-records`)
- `POST /clinical-records` - Crear historia clínica
- `GET /clinical-records` - Listar todas las historias clínicas
- `GET /clinical-records/:id` - Obtener historia clínica por ID
- `GET /clinical-records/patient/:patientId` - Obtener historias clínicas de un paciente
- `PUT /clinical-records/:id` - Actualizar historia clínica
- `DELETE /clinical-records/:id` - Eliminar historia clínica

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

