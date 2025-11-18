# Kubernetes Manifests - Geno Sentinel

Este directorio contiene todos los manifiestos de Kubernetes para la infraestructura de Geno Sentinel.

## Estructura

```
k8s/
├── Makefile              # Makefile central para gestionar toda la infraestructura
├── README.md             # Este archivo
├── api-gateway/          # Manifiestos del API Gateway
├── clinical-service/     # Manifiestos del Clinical Service
└── genomic-service/      # Manifiestos del Genomic Service
```

## Uso rápido

### Verificar conexión al cluster

Antes de desplegar, verifica que tengas un cluster de Kubernetes corriendo:

```bash
cd k8s
make check-k8s
```

Si hay problemas de conexión, usa el diagnóstico completo:

```bash
make diagnose-k8s
```

Este comando te mostrará:
- Estado de kubectl
- Contextos disponibles
- Contexto actual y servidor configurado
- Estado de minikube, kind o Docker Desktop

Si no tienes un cluster, puedes usar:
- **Minikube**: `minikube start`
- **Kind**: `kind create cluster`
- **Docker Desktop**: Activa Kubernetes en la configuración

### Ver todos los comandos disponibles

```bash
cd k8s
make help
```

### Desplegar toda la infraestructura

```bash
make deploy-all
```

### Desplegar un servicio específico

```bash
make deploy SERVICE=clinical-service
make deploy SERVICE=genomic-service
make deploy SERVICE=api-gateway
```

### Ver estado de todos los servicios

```bash
make status-all
```

### Ver estado de un servicio específico

```bash
make status SERVICE=clinical-service
```

## Comandos principales

### Despliegue

| Comando | Descripción |
|---------|-------------|
| `make deploy-all` | Despliega todos los servicios disponibles |
| `make deploy SERVICE=<nombre>` | Despliega un servicio específico |

### Estado y verificación

| Comando | Descripción |
|---------|-------------|
| `make status-all` | Muestra el estado de todos los servicios |
| `make status SERVICE=<nombre>` | Muestra el estado de un servicio específico |
| `make wait-all` | Espera a que todos los servicios estén listos |

### Logs

| Comando | Descripción |
|---------|-------------|
| `make logs SERVICE=<nombre>` | Muestra logs de un servicio (seguimiento) |
| `make logs-all` | Muestra logs de todos los servicios |

### Acceso

| Comando | Descripción |
|---------|-------------|
| `make port-forward SERVICE=<nombre> [PORT=<puerto>]` | Port-forward de un servicio |

### Gestión

| Comando | Descripción |
|---------|-------------|
| `make restart SERVICE=<nombre>` | Reinicia un servicio específico |
| `make restart-all` | Reinicia todos los servicios |
| `make scale SERVICE=<nombre> REPLICAS=<n>` | Escala un servicio a n réplicas |
| `make cleanup` | Limpia recursos fallidos |

### Eliminación

| Comando | Descripción |
|---------|-------------|
| `make delete SERVICE=<nombre>` | Elimina un servicio específico |
| `make delete-all` | Elimina todos los servicios |

### Comandos de servicios individuales

| Comando | Descripción |
|---------|-------------|
| `make clinical-service` | Muestra comandos del clinical-service |
| `make genomic-service` | Muestra comandos del genomic-service |
| `make api-gateway` | Muestra comandos del api-gateway |

## Ejemplos de uso

### Despliegue completo

```bash
# Desplegar toda la infraestructura
make deploy-all

# Verificar que todo esté corriendo
make status-all

# Ver logs de todos los servicios
make logs-all
```

### Gestión de un servicio específico

```bash
# Desplegar solo el clinical-service
make deploy SERVICE=clinical-service

# Ver estado del clinical-service
make status SERVICE=clinical-service

# Ver logs del clinical-service
make logs SERVICE=clinical-service

# Hacer port-forward para acceder al servicio
make port-forward SERVICE=clinical-service PORT=3000

# Escalar el servicio a 3 réplicas
make scale SERVICE=clinical-service REPLICAS=3

# Reiniciar el servicio
make restart SERVICE=clinical-service
```

### Comandos avanzados de un servicio

Cada servicio puede tener su propio Makefile con comandos específicos:

```bash
# Ver comandos específicos del clinical-service
make clinical-service

# Luego puedes usar comandos específicos desde el directorio del servicio
cd clinical-service
make help
make deploy
make logs-service
# etc.
```

## Orden de despliegue recomendado

Para un despliegue completo, se recomienda el siguiente orden:

1. **Base de datos del Clinical Service** (si aplica)
   ```bash
   make deploy SERVICE=clinical-service
   make wait-all
   ```

2. **Base de datos del Genomic Service** (si aplica)
   ```bash
   make deploy SERVICE=genomic-service
   make wait-all
   ```

3. **Servicios de aplicación**
   ```bash
   make restart SERVICE=clinical-service
   make restart SERVICE=genomic-service
   ```

4. **API Gateway** (debe ir al final)
   ```bash
   make deploy SERVICE=api-gateway
   ```

O simplemente usar:
```bash
make deploy-all
make wait-all
```

## Troubleshooting

### Error: "No se puede conectar al cluster de Kubernetes"

Si ves este error, significa que no tienes un cluster de Kubernetes corriendo o kubectl no está configurado:

```bash
# Diagnóstico completo (recomendado)
make diagnose-k8s

# Verificar conexión
make check-k8s
```

El diagnóstico te mostrará:
- Si kubectl está instalado
- Qué contextos tienes disponibles
- Cuál es el contexto actual y a qué servidor apunta
- Si minikube, kind o Docker Desktop están corriendo

**Soluciones comunes:**

1. **Si el contexto apunta a un servidor que no existe:**
   ```bash
   # Ver contextos disponibles
   kubectl config get-contexts
   
   # Cambiar a otro contexto
   kubectl config use-context <nombre-contexto>
   ```

2. **Si usas Minikube y está detenido:**
   ```bash
   minikube start
   minikube status
   ```

3. **Si el contexto de Minikube está corrupto:**
   ```bash
   minikube update-context
   ```

4. **Si usas Kind:**
   ```bash
   kind get clusters
   kind create cluster --name geno-sentinel
   ```

5. **Si usas Docker Desktop:**
   - Activa Kubernetes en: Settings → Kubernetes → Enable Kubernetes

## Minikube

Si usas Minikube para desarrollo local, hay consideraciones especiales:

### Configurar entorno Docker de Minikube

Minikube tiene su propio daemon de Docker. Para construir imágenes que se usarán en Minikube:

```bash
# Configurar el entorno (una vez por sesión)
make setup-minikube-docker

# O ejecutar directamente:
eval $(minikube -p minikube docker-env)
```

### Construir imágenes para Minikube

Cada servicio tiene comandos de build específicos para Minikube:

```bash
# Para clinical-service
cd clinical-service
make build-minikube
```

### Flujo completo con Minikube

```bash
# 1. Iniciar Minikube
minikube start

# 2. Configurar entorno Docker (opcional si usas build-minikube)
make setup-minikube-docker

# 3. Construir imágenes
cd clinical-service
make build-minikube

# 4. Desplegar
cd ../..
make deploy SERVICE=clinical-service
```

**Nota importante:** Si construyes imágenes con Docker normal (sin el entorno de Minikube), el cluster de Minikube no podrá encontrar las imágenes. Siempre usa `build-minikube` o configura el entorno antes de construir.

### Verificar que los servicios estén corriendo

```bash
make status-all
```

### Ver logs de un servicio con problemas

```bash
make logs SERVICE=<nombre-del-servicio>
```

### Limpiar recursos fallidos

```bash
make cleanup
```

### Reiniciar un servicio que no responde

```bash
make restart SERVICE=<nombre-del-servicio>
```

### Ver detalles de un servicio

```bash
# Desde el directorio del servicio
cd <nombre-del-servicio>
make describe-all
# o
make describe-service
```

## Notas

- El Makefile central detecta automáticamente si un servicio tiene su propio Makefile y lo usa.
- Si un servicio no tiene Makefile, se aplican los manifiestos directamente con `kubectl apply`.
- Todos los comandos son idempotentes (puedes ejecutarlos múltiples veces sin problemas).
- Los comandos de eliminación usan `--ignore-not-found=true` para evitar errores si el recurso no existe.

## Servicios individuales

Cada servicio puede tener su propia documentación y comandos específicos:

- [Clinical Service](./clinical-service/README.md)
- [Genomic Service](./genomic-service/README.md) (cuando esté disponible)
- [API Gateway](./api-gateway/README.md) (cuando esté disponible)

