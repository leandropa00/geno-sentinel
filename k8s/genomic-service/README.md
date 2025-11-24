# Manifiestos Kubernetes para Genomic Service

Este directorio contiene los manifiestos de Kubernetes para desplegar el servicio genómico y su base de datos MongoDB.

## Archivos

- `deployment.yaml` - Deployment del servicio genómico
- `service.yaml` - Service para exponer el servicio genómico
- `configmap.yaml` - ConfigMap con variables de entorno no sensibles
- `secret.yaml` - Secret con credenciales sensibles (DJANGO_SECRET_KEY)
- `mongodb-deployment.yaml` - Deployment de MongoDB
- `mongodb-service.yaml` - Service para MongoDB
- `mongodb-configmap.yaml` - ConfigMap para MongoDB
- `mongodb-secret.yaml` - Secret con credenciales de MongoDB
- `mongodb-pvc.yaml` - PersistentVolumeClaim para persistencia de datos
- `kustomization.yaml` - Configuración de Kustomize

## Despliegue

### 1. Crear los secrets (importante para producción)

**Para el servicio genómico:**
```bash
kubectl create secret generic genomic-service-secret \
  --from-literal=DJANGO_SECRET_KEY=tu_secret_key_seguro \
  --dry-run=client -o yaml | kubectl apply -f -
```

**Para MongoDB:**
```bash
kubectl create secret generic genomic-mongodb-secret \
  --from-literal=MONGO_INITDB_ROOT_USERNAME=tu_usuario \
  --from-literal=MONGO_INITDB_ROOT_PASSWORD=tu_password_seguro \
  --dry-run=client -o yaml | kubectl apply -f -
```

### 2. Aplicar los manifiestos

**Opción A: Aplicar todos los recursos con kubectl:**
```bash
kubectl apply -f k8s/genomic-service/
```

**Opción B: Aplicar en orden manualmente:**
```bash
# 1. Base de datos MongoDB
kubectl apply -f mongodb-pvc.yaml
kubectl apply -f mongodb-configmap.yaml
kubectl apply -f mongodb-secret.yaml
kubectl apply -f mongodb-service.yaml
kubectl apply -f mongodb-deployment.yaml

# 2. Esperar a que MongoDB esté listo
kubectl wait --for=condition=ready pod -l app=genomic-mongodb --timeout=300s

# 3. Servicio genómico
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f service.yaml
kubectl apply -f deployment.yaml
```

**Opción C: Usar Kustomize:**
```bash
kubectl apply -k k8s/genomic-service/
```

### 3. Verificar el despliegue

**Con kubectl:**
```bash
# Ver pods
kubectl get pods -l app=genomic-service
kubectl get pods -l app=genomic-mongodb

# Ver servicios
kubectl get svc genomic-service
kubectl get svc genomic-mongodb

# Ver logs
kubectl logs -l app=genomic-service -f
kubectl logs -l app=genomic-mongodb -f

# Verificar estado del deployment
kubectl get deployment genomic-service
kubectl get deployment genomic-mongodb
```

## Acceso al servicio

El servicio está expuesto como `ClusterIP` por defecto. Para acceder desde fuera del cluster, puedes:

1. **Port-forward (desarrollo):**
```bash
kubectl port-forward svc/genomic-service 8001:8001
# Acceder en http://localhost:8001
```

2. **Cambiar el tipo de Service a NodePort o LoadBalancer:**
Edita `service.yaml` y cambia `type: ClusterIP` a `type: NodePort` o `type: LoadBalancer`.

3. **Usar un Ingress:**
Crea un recurso Ingress para exponer el servicio a través de un controlador de ingress.

## Endpoints disponibles

- Genes: `http://localhost:8001/genomic/genes`
- Variantes genéticas: `http://localhost:8001/genomic/genetic-variants`
- Reportes de pacientes: `http://localhost:8001/genomic/patient-variant-reports`
- Documentación Swagger: `http://localhost:8001/docs/`
- Esquema OpenAPI: `http://localhost:8001/schema/`

## Configuración

### Variables de entorno

Las variables de entorno se configuran a través de:
- **ConfigMap** (`configmap.yaml`): Variables no sensibles
  - `DJANGO_DEBUG`: Modo debug (por defecto: "false")
  - `DJANGO_ALLOWED_HOSTS`: Hosts permitidos (por defecto: "*")
  - `MONGO_URI`: URI de conexión a MongoDB (por defecto: "mongodb://genomic-mongodb:27017")
  - `MONGO_DB_NAME`: Nombre de la base de datos (por defecto: "geno_sentinel_genomics")
  - `CLINICAL_SERVICE_BASE_URL`: URL del servicio clínico (por defecto: "http://clinical-service:3000/clinical")
- **Secret** (`secret.yaml`): Credenciales y datos sensibles
  - `DJANGO_SECRET_KEY`: Clave secreta de Django

### Recursos

Los recursos por defecto son:
- **Genomic Service**: 256Mi-512Mi RAM, 250m-500m CPU
- **MongoDB**: 512Mi-1Gi RAM, 250m-500m CPU

Ajusta según las necesidades de tu entorno.

### Persistencia

MongoDB usa un PersistentVolumeClaim de 10Gi. Ajusta el tamaño en `mongodb-pvc.yaml` según tus necesidades.

## Migraciones de base de datos

Para ejecutar migraciones de Django (si las hay), puedes usar un Job de Kubernetes:

```bash
kubectl run genomic-migration --image=genomic-service:latest --restart=Never -- \
  python manage.py migrate
```

O crear un Job permanente en un archivo separado.

## Notas de seguridad

⚠️ **IMPORTANTE**: Los secrets incluidos contienen credenciales por defecto. En producción:

1. Cambia todas las contraseñas por valores seguros
2. Usa un gestor de secretos (Sealed Secrets, External Secrets Operator, Vault)
3. No commitees secrets con datos reales al repositorio
4. Considera usar RBAC para limitar el acceso a los secrets
5. Actualiza `DJANGO_SECRET_KEY` con una clave segura generada aleatoriamente

## Troubleshooting

### El pod no inicia
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Problemas de conexión a la base de datos
- Verifica que MongoDB esté corriendo: `kubectl get pods -l app=genomic-mongodb`
- Verifica el service: `kubectl get svc genomic-mongodb`
- Revisa los logs: `kubectl logs -l app=genomic-mongodb`
- Verifica la URI de MongoDB en el ConfigMap

### Problemas de persistencia
- Verifica el PVC: `kubectl get pvc genomic-mongodb-pvc`
- Verifica los PV: `kubectl get pv`

### Problemas de conexión con el servicio clínico
- Verifica que el servicio clínico esté disponible: `kubectl get svc clinical-service`
- Verifica la URL en el ConfigMap: `kubectl get configmap genomic-service-config -o yaml`

