# Manifiestos Kubernetes para Clinical Service

Este directorio contiene los manifiestos de Kubernetes para desplegar el servicio clínico y su base de datos MySQL.

## Archivos

- `deployment.yaml` - Deployment del servicio clínico
- `service.yaml` - Service para exponer el servicio clínico
- `configmap.yaml` - ConfigMap con variables de entorno no sensibles
- `secret.yaml` - Secret con credenciales de base de datos
- `mysql-deployment.yaml` - Deployment de MySQL
- `mysql-service.yaml` - Service para MySQL
- `mysql-configmap.yaml` - ConfigMap para MySQL
- `mysql-secret.yaml` - Secret con credenciales de MySQL
- `mysql-pvc.yaml` - PersistentVolumeClaim para persistencia de datos
- `Makefile` - Comandos útiles de Kubernetes
- `kustomization.yaml` - Configuración de Kustomize

## Uso rápido con Makefile

El método más sencillo para gestionar el despliegue es usar el Makefile:

```bash
# Ver todos los comandos disponibles
make help

# Desplegar todo
make deploy

# Ver estado
make status

# Ver logs
make logs-service
make logs-mysql

# Port-forward para acceder al servicio
make port-forward-service

# Escalar el servicio
make scale REPLICAS=3

# Reiniciar
make restart-service
```

Para ver todos los comandos disponibles, ejecuta `make help`.

## Despliegue

### 1. Crear los secrets (importante para producción)

**Para el servicio clínico:**
```bash
kubectl create secret generic clinical-service-secret \
  --from-literal=DB_USERNAME=tu_usuario \
  --from-literal=DB_PASSWORD=tu_password_seguro \
  --dry-run=client -o yaml | kubectl apply -f -
```

**Para MySQL:**
```bash
kubectl create secret generic clinical-mysql-secret \
  --from-literal=MYSQL_ROOT_PASSWORD=tu_root_password_seguro \
  --from-literal=MYSQL_PASSWORD=tu_password_seguro \
  --dry-run=client -o yaml | kubectl apply -f -
```

### 2. Aplicar los manifiestos

**Opción A: Usar Makefile (recomendado):**
```bash
cd k8s/clinical-service
make deploy
```

**Opción B: Aplicar todos los recursos con kubectl:**
```bash
kubectl apply -f k8s/clinical-service/
```

**Opción C: Aplicar en orden manualmente:**
```bash
# 1. Base de datos MySQL
kubectl apply -f mysql-pvc.yaml
kubectl apply -f mysql-configmap.yaml
kubectl apply -f mysql-secret.yaml
kubectl apply -f mysql-service.yaml
kubectl apply -f mysql-deployment.yaml

# 2. Esperar a que MySQL esté listo
kubectl wait --for=condition=ready pod -l app=clinical-mysql --timeout=300s

# 3. Servicio clínico
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f service.yaml
kubectl apply -f deployment.yaml
```

**Opción D: Usar Kustomize:**
```bash
kubectl apply -k k8s/clinical-service/
# O con Makefile:
make deploy-kustomize
```

### 3. Verificar el despliegue

**Con Makefile:**
```bash
make status          # Ver estado de todos los recursos
make logs-service     # Ver logs del servicio
make logs-mysql       # Ver logs de MySQL
```

**Con kubectl:**
```bash
# Ver pods
kubectl get pods -l app=clinical-service
kubectl get pods -l app=clinical-mysql

# Ver servicios
kubectl get svc clinical-service
kubectl get svc clinical-mysql

# Ver logs
kubectl logs -l app=clinical-service -f
kubectl logs -l app=clinical-mysql -f

# Verificar estado del deployment
kubectl get deployment clinical-service
kubectl get deployment clinical-mysql
```

## Acceso al servicio

El servicio está expuesto como `ClusterIP` por defecto. Para acceder desde fuera del cluster, puedes:

1. **Port-forward (desarrollo) - Con Makefile:**
```bash
make port-forward-service
# Acceder en http://localhost:3000
```

**O con kubectl:**
```bash
kubectl port-forward svc/clinical-service 3000:3000
# Acceder en http://localhost:3000
```

2. **Cambiar el tipo de Service a NodePort o LoadBalancer:**
Edita `service.yaml` y cambia `type: ClusterIP` a `type: NodePort` o `type: LoadBalancer`.

3. **Usar un Ingress:**
Crea un recurso Ingress para exponer el servicio a través de un controlador de ingress.

## Configuración

### Variables de entorno

Las variables de entorno se configuran a través de:
- **ConfigMap** (`configmap.yaml`): Variables no sensibles
- **Secret** (`secret.yaml`): Credenciales y datos sensibles

### Recursos

Los recursos por defecto son:
- **Clinical Service**: 256Mi-512Mi RAM, 250m-500m CPU
- **MySQL**: 512Mi-1Gi RAM, 250m-500m CPU

Ajusta según las necesidades de tu entorno.

### Persistencia

MySQL usa un PersistentVolumeClaim de 10Gi. Ajusta el tamaño en `mysql-pvc.yaml` según tus necesidades.

## Migraciones de base de datos

Para ejecutar migraciones de TypeORM, puedes usar un Job de Kubernetes:

```bash
kubectl run clinical-migration --image=clinical-service:latest --restart=Never -- \
  npm run migration:run
```

O crear un Job permanente en un archivo separado.

## Notas de seguridad

⚠️ **IMPORTANTE**: Los secrets incluidos contienen credenciales por defecto. En producción:

1. Cambia todas las contraseñas por valores seguros
2. Usa un gestor de secretos (Sealed Secrets, External Secrets Operator, Vault)
3. No commitees secrets con datos reales al repositorio
4. Considera usar RBAC para limitar el acceso a los secrets

## Troubleshooting

### El pod no inicia
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Problemas de conexión a la base de datos
- Verifica que MySQL esté corriendo: `kubectl get pods -l app=clinical-mysql`
- Verifica el service: `kubectl get svc clinical-mysql`
- Revisa los logs: `kubectl logs -l app=clinical-mysql`

### Problemas de persistencia
- Verifica el PVC: `kubectl get pvc mysql-pvc`
- Verifica los PV: `kubectl get pv`

