# Genomic Service (Django)

Microservicio responsable de la gestión de genes, variantes genéticas y reportes de pacientes oncológicos. Sigue una arquitectura por capas (Domain ➜ Application ➜ Infrastructure ➜ Presentation) y persiste información en MongoDB.

## Características principales

- **Catálogo de genes** con campos `symbol`, `fullName`, `functionSummary`.
- **Gestión de variantes genéticas** relacionadas a genes, con impacto e información cromosómica.
- **Reportes de variantes por paciente**, integrándose con el microservicio clínico para validar y enriquecer datos del paciente.
- **DTOs y validaciones** dedicadas mediante serializers + dataclasses.
- **Documentación OpenAPI/Swagger** disponible en `/docs/` y esquema en `/schema/`.
- **Compatibilidad con el frontend Angular actual** (`/genomic/...` endpoints).

## Estructura de carpetas

```
genomics/
  domain/                # Entidades puras
  application/
    dto/                 # DTOs de entrada/salida
    services/            # Casos de uso
  infrastructure/
    persistence/         # Cliente MongoDB
    repositories/        # Implementaciones de repositorio
    clients/             # Integraciones externas (Clínica)
  presentation/
    serializers/         # Validaciones HTTP
    viewsets/            # Controladores DRF
    routers/             # Rutas registradas
```

## Requisitos

- Python 3.12+
- MongoDB 7+

Instalar dependencias localmente:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Aplicar migraciones básicas (solo para módulos core de Django) y ejecutar el servidor:

```bash
source .venv/bin/activate
python manage.py migrate
python manage.py runserver 0.0.0.0:8001
```

Variables de entorno principales (`.env`):

| Variable | Descripción | Valor por defecto |
| --- | --- | --- |
| `DJANGO_SECRET_KEY` | Clave secreta | `django-insecure-genomic-service` |
| `DJANGO_DEBUG` | Activa modo debug | `true` |
| `DJANGO_ALLOWED_HOSTS` | Hosts permitidos | `*` |
| `MONGO_URI` | URI de MongoDB | `mongodb://localhost:27017` |
| `MONGO_DB_NAME` | Base de datos | `geno_sentinel_genomics` |
| `CLINICAL_SERVICE_BASE_URL` | URL del microservicio clínico | `http://localhost:3000/clinical` |

## Docker / Compose

Construir imagen y levantar servicio + MongoDB:

```bash
docker compose up --build
```

El servicio quedará disponible en `http://localhost:8001`.

## Endpoints relevantes

| Recurso | Ruta base |
| --- | --- |
| Genes | `/genomic/genes` |
| Variantes genéticas | `/genomic/genetic-variants` |
| Reportes de pacientes | `/genomic/patient-variant-reports` |
| Documentación Swagger | `/docs/` |
| Esquema OpenAPI | `/schema/` |

Cada recurso expone operaciones CRUD y endpoints adicionales (por ejemplo, `/genomic/genetic-variants/gene/{geneId}` o `/genomic/patient-variant-reports/patient/{patientId}`).

## Tests

Actualmente no hay pruebas unitarias dedicadas; se recomienda agregar pruebas para los servicios de aplicación y los repositorios contra una instancia de Mongo en memoria (por ejemplo, `mongomock`).
