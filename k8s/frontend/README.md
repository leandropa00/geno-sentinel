# Frontend - Kubernetes Manifests

Manifiestos de Kubernetes para el despliegue del frontend Angular de Geno Sentinel.

## Estructura

- `deployment.yaml` - Deployment del frontend con Nginx
- `service.yaml` - Service ClusterIP para exponer el frontend
- `configmap.yaml` - Configuración del frontend (URL del API Gateway)
- `kustomization.yaml` - Configuración de Kustomize

## Despliegue

### Despliegue Individual

```bash
# Desde el directorio k8s/
kubectl apply -k frontend/
```

### Despliegue con Makefile

```bash
# Desde el directorio k8s/
make deploy SERVICE=frontend
```

### Despliegue de Toda la Infraestructura

```bash
# Desde el directorio k8s/
make deploy-all
```

## Construcción de Imagen

### Con Minikube

```bash
# Configurar entorno de Docker de Minikube
eval $(minikube docker-env)

# Construir imagen
cd ../frontend
docker build -f Dockerfile -t geno-sentinel-frontend:latest .

# O usar el Makefile
make build-minikube-frontend
```

### Construir Todas las Imágenes

```bash
# Desde el directorio k8s/
make build-all-minikube
```

## Configuración

El frontend se conecta al API Gateway a través del servicio de Kubernetes:
- URL del API: `http://api-gateway:8080/api`

Esta configuración se establece en `configmap.yaml` y se usa durante el build de la aplicación Angular.

## Recursos

- **Replicas**: 2
- **Puerto**: 80
- **Recursos**:
  - Requests: 128Mi memoria, 100m CPU
  - Limits: 256Mi memoria, 200m CPU

## Health Checks

- **Liveness Probe**: `/health` cada 30 segundos
- **Readiness Probe**: `/health` cada 10 segundos

## Acceso

El frontend está expuesto como un servicio ClusterIP. Para acceder desde fuera del cluster:

```bash
# Port-forward
kubectl port-forward svc/frontend 8080:80

# O usar el Makefile
make port-forward SERVICE=frontend PORT=8080
```

Luego acceder a `http://localhost:8080`

## Troubleshooting

### Ver logs

```bash
kubectl logs -l app=frontend -f
# O
make logs SERVICE=frontend
```

### Ver estado

```bash
kubectl get pods -l app=frontend
kubectl describe pod <pod-name>
# O
make status SERVICE=frontend
```

### Reiniciar

```bash
kubectl rollout restart deployment frontend
# O
make restart SERVICE=frontend
```

