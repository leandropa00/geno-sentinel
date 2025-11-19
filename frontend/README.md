# Geno Sentinel Frontend

Frontend Angular para el sistema Geno Sentinel - Gestión de datos genómicos y clínicos.

## Características

- **Gestión de Genes**: Catálogo de genes de interés oncológico con sus funciones y descripciones
- **Gestión de Variantes Genéticas**: Registro de mutaciones específicas, incluyendo ubicación, referencia y efecto
- **Gestión de Reportes de Pacientes**: Asociación de variantes genéticas a pacientes específicos, obteniendo información clínica vía el Microservicio de Clínica
- **Gestión de Pacientes**: Integración con el microservicio clínico para consulta y gestión de pacientes
- **Autenticación JWT**: Sistema de autenticación mediante tokens
- **Interfaz Moderna**: UI responsive y fácil de usar

## Desarrollo

### Prerrequisitos

- Node.js 18+ y npm
- Angular CLI 17+ (instalado globalmente o vía npx)

### Instalación

```bash
npm install
```

### Ejecución en Desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### Build para Producción

```bash
npm run build
```

Los archivos compilados se generarán en `dist/geno-sentinel-frontend/`

## Configuración

### Variables de Entorno

La URL del API Gateway se configura en:
- `src/environments/environment.ts` - Desarrollo (por defecto: `http://localhost:8080/api`)
- `src/environments/environment.prod.ts` - Producción (por defecto: `/api`)

### Autenticación

El frontend se conecta al API Gateway en:
- Login: `POST /api/auth/login`
- Todas las demás peticiones requieren un token JWT en el header `Authorization: Bearer <token>`

### Endpoints del API Gateway

El frontend utiliza los siguientes endpoints a través del API Gateway:

#### Clínico (Microservicio de Clínica)
- `GET /api/clinical/patients` - Listar pacientes
- `GET /api/clinical/patients/:id` - Obtener paciente por ID
- `POST /api/clinical/patients` - Crear paciente
- `PUT /api/clinical/patients/:id` - Actualizar paciente
- `PUT /api/clinical/patients/:id/deactivate` - Desactivar paciente
- `GET /api/clinical/patients/status/:status` - Obtener pacientes por estado

#### Genómico (Microservicio de Genómica)
- `GET /api/genomic/genes` - Listar genes
- `GET /api/genomic/genes/:id` - Obtener gen por ID
- `POST /api/genomic/genes` - Crear gen
- `PUT /api/genomic/genes/:id` - Actualizar gen
- `DELETE /api/genomic/genes/:id` - Eliminar gen

- `GET /api/genomic/genetic-variants` - Listar variantes genéticas
- `GET /api/genomic/genetic-variants/:id` - Obtener variante por ID
- `GET /api/genomic/genetic-variants/gene/:geneId` - Obtener variantes por gen
- `POST /api/genomic/genetic-variants` - Crear variante
- `PUT /api/genomic/genetic-variants/:id` - Actualizar variante
- `DELETE /api/genomic/genetic-variants/:id` - Eliminar variante

- `GET /api/genomic/patient-variant-reports` - Listar reportes
- `GET /api/genomic/patient-variant-reports/:id` - Obtener reporte por ID
- `GET /api/genomic/patient-variant-reports/patient/:patientId` - Obtener reportes por paciente
- `GET /api/genomic/patient-variant-reports/variant/:variantId` - Obtener reportes por variante
- `POST /api/genomic/patient-variant-reports` - Crear reporte
- `PUT /api/genomic/patient-variant-reports/:id` - Actualizar reporte
- `DELETE /api/genomic/patient-variant-reports/:id` - Eliminar reporte

## Estructura del Proyecto

```
src/
├── app/
│   ├── models/                    # Interfaces y modelos TypeScript
│   │   ├── auth.model.ts
│   │   ├── gene.model.ts
│   │   ├── genetic-variant.model.ts
│   │   ├── patient.model.ts
│   │   └── patient-variant-report.model.ts
│   ├── services/                  # Servicios para comunicación con API
│   │   ├── auth.service.ts
│   │   ├── gene.service.ts
│   │   ├── genetic-variant.service.ts
│   │   ├── patient.service.ts
│   │   └── patient-variant-report.service.ts
│   ├── guards/                    # Guards de autenticación
│   │   └── auth.guard.ts
│   ├── interceptors/              # Interceptores HTTP
│   │   └── auth.interceptor.ts
│   ├── components/                # Componentes reutilizables
│   │   └── layout/
│   │       └── layout.component.ts
│   ├── pages/                     # Páginas principales
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── patients/
│   │   ├── genes/
│   │   ├── genetic-variants/
│   │   └── patient-variant-reports/
│   ├── app.component.ts           # Componente raíz
│   └── app.routes.ts              # Configuración de rutas
├── environments/                  # Configuración de entornos
├── assets/                        # Recursos estáticos
├── styles.css                     # Estilos globales
├── index.html                     # HTML principal
└── main.ts                        # Punto de entrada
```

## Docker

### Desarrollo Local con Docker

Para ejecutar en modo desarrollo con hot-reload:

```bash
# Usando docker compose
docker compose up --build

# O usando Makefile
make dev
```

La aplicación estará disponible en `http://localhost:4200` con hot-reload habilitado.

Para ejecutar en segundo plano:

```bash
docker compose up -d
# O
make up
```

#### Ver logs

```bash
docker compose logs -f frontend
# O
make logs
```

#### Detener contenedores

```bash
docker compose down
# O
make down
```

### Construcción de Imagen para Kubernetes

Para construir la imagen Docker que se usará en Kubernetes:

```bash
# Construir la imagen
docker build -t geno-sentinel-frontend:latest .

# O usando Makefile
make build
```

**Nota**: El despliegue de producción se realiza mediante Kubernetes. Ver la documentación en `k8s/frontend/` para más detalles.

### Makefile

El proyecto incluye un Makefile con comandos útiles:

- `make build` - Construir imagen Docker para Kubernetes
- `make dev` - Ejecutar en modo desarrollo con Docker
- `make up` - Ejecutar en modo desarrollo (detached)
- `make down` - Detener contenedores
- `make logs` - Ver logs
- `make clean` - Limpiar contenedores e imágenes
- `make install` - Instalar dependencias localmente
- `make build-local` - Build local sin Docker
- `make run-local` - Ejecutar localmente sin Docker

### Configuración de Nginx (Producción)

El contenedor de producción usa Nginx con:
- Compresión gzip habilitada
- Headers de seguridad
- Cache para assets estáticos
- Soporte para SPA routing (Angular Router)
- Health check endpoint en `/health`

## Notas de Desarrollo

### Estado del Microservicio Genómico

El microservicio genómico aún no está completamente implementado. El frontend está preparado para integrarse con él cuando esté listo. Los endpoints esperados son:

- `/api/genomic/genes/**`
- `/api/genomic/genetic-variants/**`
- `/api/genomic/patient-variant-reports/**`

### Manejo de Errores

El frontend maneja errores de manera consistente:
- Muestra mensajes de error al usuario
- Maneja errores de autenticación redirigiendo al login
- Valida datos antes de enviarlos al servidor

### Validación de Datos

Los formularios incluyen validación básica:
- Campos requeridos
- Tipos de datos correctos
- Rangos válidos (ej: VAF entre 0 y 1)

## Usuarios de Prueba

Según la configuración del API Gateway, los usuarios de prueba son:
- `admin` / `admin123`
- `user` / `user123`
- `clinician` / `clinician123`

