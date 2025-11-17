.PHONY: help deploy deploy-kustomize delete status watch-pods \
        logs-service logs-mysql logs-all \
        describe-service describe-mysql describe-all \
        port-forward-service port-forward-mysql \
        exec-service exec-mysql \
        scale restart-service restart-mysql \
        rollback-service rollback-mysql \
        update-configmap update-secret view-configmap view-secret \
        run-migration cleanup-failed-pods \
        wait-mysql wait-service

# Variables
NAMESPACE := default
SERVICE_LABEL := app=clinical-service
MYSQL_LABEL := app=clinical-mysql

# Colores para output
GREEN := \033[0;32m
BLUE := \033[0;34m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Muestra esta ayuda
	@echo "$(GREEN)Comandos Kubernetes disponibles:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-25s$(NC) %s\n", $$1, $$2}'

# ============================================
# DESPLIEGUE
# ============================================

deploy: ## Despliega todos los recursos en orden
	@echo "$(GREEN)Desplegando MySQL...$(NC)"
	@kubectl apply -f mysql-pvc.yaml
	@kubectl apply -f mysql-configmap.yaml
	@kubectl apply -f mysql-secret.yaml
	@kubectl apply -f mysql-service.yaml
	@kubectl apply -f mysql-deployment.yaml
	@echo "$(YELLOW)Esperando a que MySQL esté listo...$(NC)"
	@kubectl wait --for=condition=ready pod -l $(MYSQL_LABEL) --timeout=300s || true
	@echo "$(GREEN)Desplegando Clinical Service...$(NC)"
	@kubectl apply -f configmap.yaml
	@kubectl apply -f secret.yaml
	@kubectl apply -f service.yaml
	@kubectl apply -f deployment.yaml
	@echo "$(GREEN)Despliegue completado!$(NC)"

deploy-kustomize: ## Despliega usando Kustomize
	@echo "$(GREEN)Desplegando con Kustomize...$(NC)"
	@kubectl apply -k .
	@echo "$(GREEN)Despliegue completado!$(NC)"

delete: ## Elimina todos los recursos
	@echo "$(YELLOW)Eliminando todos los recursos...$(NC)"
	@kubectl delete -f deployment.yaml --ignore-not-found=true
	@kubectl delete -f service.yaml --ignore-not-found=true
	@kubectl delete -f secret.yaml --ignore-not-found=true
	@kubectl delete -f configmap.yaml --ignore-not-found=true
	@kubectl delete -f mysql-deployment.yaml --ignore-not-found=true
	@kubectl delete -f mysql-service.yaml --ignore-not-found=true
	@kubectl delete -f mysql-secret.yaml --ignore-not-found=true
	@kubectl delete -f mysql-configmap.yaml --ignore-not-found=true
	@kubectl delete -f mysql-pvc.yaml --ignore-not-found=true
	@echo "$(GREEN)Recursos eliminados!$(NC)"

# ============================================
# VERIFICACIÓN Y ESTADO
# ============================================

status: ## Muestra el estado de todos los recursos
	@echo "$(BLUE)=== Estado de Pods ===$(NC)"
	@kubectl get pods -l $(SERVICE_LABEL) 2>/dev/null || echo "No hay pods del clinical-service"
	@kubectl get pods -l $(MYSQL_LABEL) 2>/dev/null || echo "No hay pods de MySQL"
	@echo ""
	@echo "$(BLUE)=== Estado de Deployments ===$(NC)"
	@kubectl get deployment clinical-service 2>/dev/null || echo "No hay deployment del clinical-service"
	@kubectl get deployment clinical-mysql 2>/dev/null || echo "No hay deployment de MySQL"
	@echo ""
	@echo "$(BLUE)=== Estado de Services ===$(NC)"
	@kubectl get svc clinical-service 2>/dev/null || echo "No hay service del clinical-service"
	@kubectl get svc clinical-mysql 2>/dev/null || echo "No hay service de MySQL"
	@echo ""
	@echo "$(BLUE)=== Estado de PVCs ===$(NC)"
	@kubectl get pvc mysql-pvc 2>/dev/null || echo "No hay PVC de MySQL"

watch-pods: ## Observa los pods en tiempo real
	@echo "$(GREEN)Observando pods (Ctrl+C para salir)...$(NC)"
	@kubectl get pods -l 'app in (clinical-service,clinical-mysql)' -w

wait-mysql: ## Espera a que MySQL esté listo
	@echo "$(YELLOW)Esperando a que MySQL esté listo...$(NC)"
	@kubectl wait --for=condition=ready pod -l $(MYSQL_LABEL) --timeout=300s

wait-service: ## Espera a que el Clinical Service esté listo
	@echo "$(YELLOW)Esperando a que Clinical Service esté listo...$(NC)"
	@kubectl wait --for=condition=ready pod -l $(SERVICE_LABEL) --timeout=300s

# ============================================
# LOGS
# ============================================

logs-service: ## Muestra logs del Clinical Service (seguimiento)
	@echo "$(GREEN)Logs del Clinical Service (Ctrl+C para salir)...$(NC)"
	@kubectl logs -l $(SERVICE_LABEL) -f --tail=100

logs-mysql: ## Muestra logs de MySQL (seguimiento)
	@echo "$(GREEN)Logs de MySQL (Ctrl+C para salir)...$(NC)"
	@kubectl logs -l $(MYSQL_LABEL) -f --tail=100

logs-all: ## Muestra logs de todos los servicios (seguimiento)
	@echo "$(GREEN)Logs de todos los servicios (Ctrl+C para salir)...$(NC)"
	@kubectl logs -l 'app in (clinical-service,clinical-mysql)' -f --tail=100

# ============================================
# DESCRIBE Y DEBUGGING
# ============================================

describe-service: ## Describe el pod del Clinical Service
	@POD_NAME=$$(kubectl get pods -l $(SERVICE_LABEL) -o jsonpath='{.items[0].metadata.name}' 2>/dev/null); \
	if [ -z "$$POD_NAME" ]; then \
		echo "$(YELLOW)No se encontró ningún pod del clinical-service$(NC)"; \
	else \
		kubectl describe pod $$POD_NAME; \
	fi

describe-mysql: ## Describe el pod de MySQL
	@POD_NAME=$$(kubectl get pods -l $(MYSQL_LABEL) -o jsonpath='{.items[0].metadata.name}' 2>/dev/null); \
	if [ -z "$$POD_NAME" ]; then \
		echo "$(YELLOW)No se encontró ningún pod de MySQL$(NC)"; \
	else \
		kubectl describe pod $$POD_NAME; \
	fi

describe-all: ## Describe todos los recursos principales
	@echo "$(BLUE)=== Clinical Service ===$(NC)"
	@kubectl describe deployment clinical-service 2>/dev/null || echo "No existe"
	@echo ""
	@echo "$(BLUE)=== MySQL ===$(NC)"
	@kubectl describe deployment clinical-mysql 2>/dev/null || echo "No existe"
	@echo ""
	@echo "$(BLUE)=== Services ===$(NC)"
	@kubectl describe svc clinical-service 2>/dev/null || echo "No existe"
	@kubectl describe svc clinical-mysql 2>/dev/null || echo "No existe"

# ============================================
# ACCESO Y PORT-FORWARD
# ============================================

port-forward-service: ## Port-forward del Clinical Service (puerto 3000)
	@echo "$(GREEN)Port-forward del Clinical Service en http://localhost:3000$(NC)"
	@echo "$(YELLOW)Presiona Ctrl+C para detener$(NC)"
	@kubectl port-forward svc/clinical-service 3000:3000

port-forward-mysql: ## Port-forward de MySQL (puerto 3306)
	@echo "$(GREEN)Port-forward de MySQL en localhost:3306$(NC)"
	@echo "$(YELLOW)Presiona Ctrl+C para detener$(NC)"
	@kubectl port-forward svc/clinical-mysql 3306:3306

# ============================================
# EXEC Y SHELL
# ============================================

exec-service: ## Abre shell en el pod del Clinical Service
	@POD_NAME=$$(kubectl get pods -l $(SERVICE_LABEL) -o jsonpath='{.items[0].metadata.name}' 2>/dev/null); \
	if [ -z "$$POD_NAME" ]; then \
		echo "$(YELLOW)No se encontró ningún pod del clinical-service$(NC)"; \
	else \
		echo "$(GREEN)Conectando al pod: $$POD_NAME$(NC)"; \
		kubectl exec -it $$POD_NAME -- /bin/sh; \
	fi

exec-mysql: ## Abre MySQL CLI en el pod de MySQL
	@POD_NAME=$$(kubectl get pods -l $(MYSQL_LABEL) -o jsonpath='{.items[0].metadata.name}' 2>/dev/null); \
	if [ -z "$$POD_NAME" ]; then \
		echo "$(YELLOW)No se encontró ningún pod de MySQL$(NC)"; \
	else \
		echo "$(GREEN)Conectando al pod MySQL: $$POD_NAME$(NC)"; \
		kubectl exec -it $$POD_NAME -- mysql -u root -p; \
	fi

# ============================================
# SCALING
# ============================================

scale: ## Escala el Clinical Service (uso: make scale REPLICAS=3)
	@if [ -z "$(REPLICAS)" ]; then \
		echo "$(YELLOW)Uso: make scale REPLICAS=3$(NC)"; \
	else \
		echo "$(GREEN)Escalando clinical-service a $(REPLICAS) réplicas...$(NC)"; \
		kubectl scale deployment clinical-service --replicas=$(REPLICAS); \
		kubectl get pods -l $(SERVICE_LABEL) -w; \
	fi

# ============================================
# RESTART
# ============================================

restart-service: ## Reinicia el Clinical Service
	@echo "$(GREEN)Reiniciando clinical-service...$(NC)"
	@kubectl rollout restart deployment clinical-service
	@kubectl rollout status deployment clinical-service

restart-mysql: ## Reinicia MySQL
	@echo "$(GREEN)Reiniciando MySQL...$(NC)"
	@kubectl rollout restart deployment clinical-mysql
	@kubectl rollout status deployment clinical-mysql

# ============================================
# ROLLBACK
# ============================================

rollback-service: ## Revierte el deployment del Clinical Service
	@echo "$(YELLOW)Revirtiendo deployment del clinical-service...$(NC)"
	@kubectl rollout undo deployment clinical-service
	@kubectl rollout status deployment clinical-service

rollback-mysql: ## Revierte el deployment de MySQL
	@echo "$(YELLOW)Revirtiendo deployment de MySQL...$(NC)"
	@kubectl rollout undo deployment clinical-mysql
	@kubectl rollout status deployment clinical-mysql

# ============================================
# CONFIGMAP Y SECRETS
# ============================================

update-configmap: ## Actualiza el ConfigMap
	@echo "$(GREEN)Actualizando ConfigMap...$(NC)"
	@kubectl apply -f configmap.yaml
	@echo "$(YELLOW)Reinicia los pods para aplicar los cambios: make restart-service$(NC)"

update-secret: ## Actualiza el Secret
	@echo "$(GREEN)Actualizando Secret...$(NC)"
	@kubectl apply -f secret.yaml
	@echo "$(YELLOW)Reinicia los pods para aplicar los cambios: make restart-service$(NC)"

view-configmap: ## Muestra el ConfigMap
	@kubectl get configmap clinical-service-config -o yaml

view-secret: ## Muestra el Secret (valores codificados en base64)
	@kubectl get secret clinical-service-secret -o yaml

# ============================================
# MIGRACIONES
# ============================================

run-migration: ## Ejecuta migraciones de base de datos
	@echo "$(GREEN)Ejecutando migraciones de base de datos...$(NC)"
	@kubectl run clinical-migration-$$(date +%s) \
		--image=clinical-service:latest \
		--restart=Never \
		--rm -it \
		-- npm run migration:run

# ============================================
# LIMPIEZA
# ============================================

cleanup-failed-pods: ## Limpia pods en estado Error/CrashLoopBackOff
	@echo "$(YELLOW)Limpiando pods en estado Error/CrashLoopBackOff...$(NC)"
	@kubectl get pods --field-selector=status.phase!=Running,status.phase!=Succeeded \
		-l 'app in (clinical-service,clinical-mysql)' \
		-o jsonpath='{.items[*].metadata.name}' 2>/dev/null | \
		xargs -r kubectl delete pod 2>/dev/null || echo "No hay pods fallidos"

