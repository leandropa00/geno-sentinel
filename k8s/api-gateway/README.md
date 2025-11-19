# API Gateway - Kubernetes Deployment

Este directorio contiene los manifiestos de Kubernetes para desplegar el API Gateway en un cluster de Kubernetes.

## 📋 Descripción

El API Gateway es el punto de entrada único para todos los microservicios de Geno Sentinel. Proporciona:
- **Autenticación JWT**: Autenticación de usuarios y emisión de tokens
- **Enrutamiento**: Distribución de peticiones a los microservicios backend
- **CORS**: Configuración de Cross-Origin Resource Sharing
- **Health Checks**: Endpoints de monitoreo y estado

## 📁 Estructura de Archivos

```
k8s/api-gateway/
├── deployment.yaml      # Deployment con configuración de pods
├── service.yaml         # Service para exponer el API Gateway
├── configmap.yaml       # Configuración no sensible (variables de entorno)
├── secret.yaml          # Secretos (JWT_SECRET)
├── kustomization.yaml   # Configuración de Kustomize
└── README.md           # Esta documentación
```

## 🔧 Configuración

### ConfigMap (`configmap.yaml`)

Contiene la configuración no sensible del API Gateway:

- `SPRING_PROFILES_ACTIVE`: Perfil de Spring Boot (production)
- `JWT_EXPIRATION`: Tiempo de expiración del token JWT (86400000 ms = 24 horas)
- `CLINICAL_SERVICE_HOST`: Host del servicio clínico (clinical-service)
- `CLINICAL_SERVICE_PORT`: Puerto del servicio clínico (3000)
- `GENOMIC_SERVICE_HOST`: Host del servicio genómico (genomic-service)
- `GENOMIC_SERVICE_PORT`: Puerto del servicio genómico (3001)

### Secret (`secret.yaml`)

Contiene información sensible:

- `JWT_SECRET`: Clave secreta para firmar tokens JWT (mínimo 32 caracteres)

**⚠️ IMPORTANTE**: En producción, cambia el `JWT_SECRET` en `secret.yaml` por una clave segura y única.

### Deployment (`deployment.yaml`)

Configuración del despliegue:

- **Réplicas**: 2 (alta disponibilidad)
- **Puerto**: 8080
- **Recursos**:
  - Requests: 512Mi memoria, 500m CPU
  - Limits: 1Gi memoria, 1000m CPU
- **Health Checks**:
  - Liveness: `/actuator/health` (inicio después de 40s)
  - Readiness: `/actuator/health` (inicio después de 10s)
- **Seguridad**: Ejecuta como usuario no-root (UID 1000)

### Service (`service.yaml`)

Expone el API Gateway dentro del cluster:

- **Tipo**: ClusterIP (solo accesible dentro del cluster)
- **Puerto**: 8080
- **Selector**: `app: api-gateway`

## 🚀 Despliegue

### Opción 1: Usando Make (Recomendado)

Desde el directorio raíz del proyecto:

```bash
cd k8s
make deploy SERVICE=api-gateway
```

O desplegar todo junto:

```bash
make deploy-all
```

### Opción 2: Usando Kustomize

```bash
kubectl apply -k k8s/api-gateway/
```

### Opción 3: Usando kubectl directamente

```bash
kubectl apply -f k8s/api-gateway/configmap.yaml
kubectl apply -f k8s/api-gateway/secret.yaml
kubectl apply -f k8s/api-gateway/service.yaml
kubectl apply -f k8s/api-gateway/deployment.yaml
```

## ✅ Verificación

### Verificar el estado del despliegue

```bash
# Ver pods
kubectl get pods -l app=api-gateway

# Ver servicio
kubectl get svc api-gateway

# Ver detalles del deployment
kubectl describe deployment api-gateway
```

### Verificar logs

```bash
# Logs de todos los pods
kubectl logs -l app=api-gateway --tail=50

# Logs de un pod específico
kubectl logs <pod-name> -f
```

### Verificar health check

```bash
# Port-forward temporal
kubectl port-forward svc/api-gateway 8080:8080

# En otra terminal, verificar health
curl http://localhost:8080/actuator/health
```

### Verificar autenticación

```bash
# Port-forward activo (ver comando anterior)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

## 🔍 Troubleshooting

### Pods en estado CrashLoopBackOff

1. Ver logs del pod:
   ```bash
   kubectl logs <pod-name> --previous
   ```

2. Verificar eventos:
   ```bash
   kubectl describe pod <pod-name>
   ```

3. Verificar configuración:
   ```bash
   kubectl get configmap api-gateway-config -o yaml
   kubectl get secret api-gateway-secret -o yaml
   ```

### Pods no inician (ImagePullBackOff)

1. Verificar que la imagen existe en Minikube:
   ```bash
   eval $(minikube docker-env)
   docker images | grep api-gateway
   ```

2. Reconstruir la imagen:
   ```bash
   cd k8s
   make build-minikube-api-gateway
   ```

### Health checks fallan

1. Verificar que el endpoint responde:
   ```bash
   kubectl exec -it <pod-name> -- curl http://localhost:8080/actuator/health
   ```

2. Ajustar tiempos de inicio en `deployment.yaml` si el servicio tarda más en iniciar.

### No se puede conectar a servicios backend

1. Verificar que los servicios backend están desplegados:
   ```bash
   kubectl get svc clinical-service
   kubectl get svc genomic-service
   ```

2. Verificar DNS dentro del pod:
   ```bash
   kubectl exec -it <pod-name> -- nslookup clinical-service
   ```

## 📊 Monitoreo

### Métricas disponibles

- **Health Check**: `GET /actuator/health`
- **Info**: `GET /actuator/info`
- **Status**: `GET /api/status`

### Ver métricas con port-forward

```bash
# Iniciar port-forward
kubectl port-forward svc/api-gateway 8080:8080

# Verificar health
curl http://localhost:8080/actuator/health

# Verificar status
curl http://localhost:8080/api/status
```

## 🔐 Seguridad

### Cambiar JWT Secret en producción

1. Editar `secret.yaml`:
   ```yaml
   stringData:
     JWT_SECRET: "tu-clave-secreta-super-segura-minimo-32-caracteres"
   ```

2. Aplicar cambios:
   ```bash
   kubectl apply -f k8s/api-gateway/secret.yaml
   ```

3. Reiniciar pods:
   ```bash
   kubectl rollout restart deployment api-gateway
   ```

### Usuarios por defecto

El API Gateway incluye usuarios de prueba en memoria:
- `admin` / `admin123`
- `user` / `user123`
- `clinician` / `clinician123`

**⚠️ IMPORTANTE**: En producción, implementa un sistema de autenticación con base de datos.

## 🔄 Actualización

### Actualizar la imagen

1. Reconstruir la imagen en Minikube:
   ```bash
   cd k8s
   make build-minikube-api-gateway
   ```

2. Reiniciar el deployment:
   ```bash
   kubectl rollout restart deployment api-gateway
   ```

3. Verificar el rollout:
   ```bash
   kubectl rollout status deployment api-gateway
   ```

### Actualizar configuración

1. Editar `configmap.yaml` o `secret.yaml`
2. Aplicar cambios:
   ```bash
   kubectl apply -f k8s/api-gateway/configmap.yaml
   kubectl apply -f k8s/api-gateway/secret.yaml
   ```
3. Reiniciar pods para aplicar cambios:
   ```bash
   kubectl rollout restart deployment api-gateway
   ```

## 🗑️ Eliminación

### Eliminar el despliegue

```bash
# Opción 1: Usando Make
cd k8s
make delete SERVICE=api-gateway

# Opción 2: Usando Kustomize
kubectl delete -k k8s/api-gateway/

# Opción 3: Manualmente
kubectl delete deployment api-gateway
kubectl delete service api-gateway
kubectl delete configmap api-gateway-config
kubectl delete secret api-gateway-secret
```

## 📚 Comandos Útiles

### Ver estado completo

```bash
make status SERVICE=api-gateway
```

### Ver logs en tiempo real

```bash
make logs SERVICE=api-gateway
```

### Escalar el deployment

```bash
kubectl scale deployment api-gateway --replicas=3
```

### Port-forward para desarrollo

```bash
make port-forward SERVICE=api-gateway
```

O manualmente:

```bash
kubectl port-forward svc/api-gateway 8080:8080
```

### Ejecutar shell en el pod

```bash
kubectl exec -it <pod-name> -- /bin/sh
```

## 🔗 Referencias

- [Documentación del API Gateway](../api-gateway/README.md)
- [Makefile principal](../Makefile) - Comandos de automatización
- [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway)
- [Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)

## 📝 Notas

- El API Gateway requiere que los servicios backend (`clinical-service`, `genomic-service`) estén desplegados y accesibles.
- El puerto 8080 es el puerto estándar del API Gateway.
- Los health checks están configurados para iniciar después de 10 segundos (readiness) y 40 segundos (liveness).
- El servicio se ejecuta con 2 réplicas por defecto para alta disponibilidad.

