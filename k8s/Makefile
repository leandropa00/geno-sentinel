.PHONY: help check-k8s diagnose-k8s setup-minikube-docker deploy deploy-all delete delete-all status status-all \
        logs logs-all port-forward restart restart-all scale wait-all cleanup clinical-service \
        build-minikube-clinical

# Variables
NAMESPACE := default
SERVICES := clinical-service genomic-service api-gateway
SKIP_VALIDATION := false
MINIKUBE_PROFILE := minikube
CLINICAL_SERVICE_DIR := ../clinical-service
CLINICAL_IMAGE_NAME := clinical-service
CLINICAL_IMAGE_TAG := latest
CLINICAL_SERVICE_LABEL := app=clinical-service
CLINICAL_MYSQL_LABEL := app=clinical-mysql

# Colores para output
GREEN := \033[0;32m
BLUE := \033[0;34m
YELLOW := \033[1;33m
RED := \033[0;31m
CYAN := \033[0;36m
NC := \033[0m # No Color

help: ## Muestra esta ayuda
	@echo "$(GREEN)=== Comandos Kubernetes - Geno Sentinel Infrastructure ===$(NC)\n"
	@echo "$(CYAN)Gestión de toda la infraestructura:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-25s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(CYAN)Ejemplos:$(NC)"
	@echo "  $(GREEN)make deploy-all$(NC)              - Desplegar todos los servicios"
	@echo "  $(GREEN)make deploy SERVICE=clinical-service$(NC)  - Desplegar un servicio específico"
	@echo "  $(GREEN)make status-all$(NC)              - Ver estado de todos los servicios"
	@echo "  $(GREEN)make logs SERVICE=clinical-service$(NC)   - Ver logs de un servicio"
	@echo ""
	@echo "$(CYAN)Verificación:$(NC)"
	@echo "  $(YELLOW)check-k8s$(NC)           - Verifica conexión al cluster de Kubernetes"
	@echo "  $(YELLOW)diagnose-k8s$(NC)       - Diagnostica problemas de conexión"

check-k8s: ## Verifica la conexión al cluster de Kubernetes
	@echo "$(YELLOW)Verificando conexión al cluster de Kubernetes...$(NC)"
	@echo "$(CYAN)Contexto actual:$(NC)"
	@kubectl config current-context 2>/dev/null || echo "$(RED)  No hay contexto configurado$(NC)"
	@echo ""
	@kubectl cluster-info >/dev/null 2>&1 || { \
		echo "$(RED)✗ Error: No se puede conectar al cluster de Kubernetes$(NC)"; \
		echo ""; \
		echo "$(CYAN)Información del contexto actual:$(NC)"; \
		CURRENT_CTX=$$(kubectl config current-context 2>/dev/null || echo "none"); \
		if [ "$$CURRENT_CTX" != "none" ]; then \
			echo "  Contexto: $$CURRENT_CTX"; \
			SERVER=$$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}' 2>/dev/null || echo "desconocido"); \
			echo "  Servidor: $$SERVER"; \
		fi; \
		echo ""; \
		echo "$(YELLOW)Posibles soluciones:$(NC)"; \
		echo ""; \
		echo "$(GREEN)1. Si usas Minikube:$(NC)"; \
		echo "   minikube start"; \
		echo "   minikube status  # Verificar que esté corriendo"; \
		echo ""; \
		echo "$(GREEN)2. Si usas Kind:$(NC)"; \
		echo "   kind get clusters  # Ver clusters disponibles"; \
		echo "   kind create cluster --name geno-sentinel  # Crear nuevo cluster"; \
		echo ""; \
		echo "$(GREEN)3. Si usas Docker Desktop:$(NC)"; \
		echo "   Activa Kubernetes en: Settings → Kubernetes → Enable Kubernetes"; \
		echo ""; \
		echo "$(GREEN)4. Ver contextos disponibles:$(NC)"; \
		echo "   kubectl config get-contexts"; \
		echo ""; \
		echo "$(GREEN)5. Cambiar de contexto:$(NC)"; \
		echo "   kubectl config use-context <nombre-contexto>"; \
		echo ""; \
		echo "$(GREEN)6. Si el contexto está corrupto, crear uno nuevo:$(NC)"; \
		echo "   # Para minikube:"; \
		echo "   minikube update-context"; \
		echo ""; \
		echo "   # Para kind:"; \
		echo "   kind export kubeconfig --name <nombre-cluster>"; \
		exit 1; \
	}
	@echo "$(GREEN)✓ Conexión al cluster verificada$(NC)"
	@echo "$(CYAN)Información del cluster:$(NC)"
	@kubectl cluster-info | head -1
	@echo ""
	@kubectl config current-context

diagnose-k8s: ## Diagnostica problemas de conexión con Kubernetes
	@echo "$(CYAN)=== Diagnóstico de Kubernetes ===$(NC)\n"
	@echo "$(GREEN)1. Verificando kubectl...$(NC)"
	@which kubectl >/dev/null 2>&1 && echo "$(GREEN)  ✓ kubectl está instalado$(NC)" || echo "$(RED)  ✗ kubectl no está instalado$(NC)"
	@kubectl version --client --short 2>/dev/null | head -1 || echo "$(RED)  ✗ Error al obtener versión de kubectl$(NC)"
	@echo ""
	@echo "$(GREEN)2. Contextos disponibles:$(NC)"
	@kubectl config get-contexts 2>/dev/null || echo "$(RED)  ✗ No se pueden listar contextos$(NC)"
	@echo ""
	@echo "$(GREEN)3. Contexto actual:$(NC)"
	@CURRENT=$$(kubectl config current-context 2>/dev/null || echo "ninguno"); \
	echo "  $$CURRENT"
	@if [ "$$CURRENT" != "ninguno" ]; then \
		echo ""; \
		echo "$(GREEN)4. Información del servidor del contexto actual:$(NC)"; \
		SERVER=$$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}' 2>/dev/null || echo "no disponible"); \
		echo "  $$SERVER"; \
	fi
	@echo ""
	@echo "$(GREEN)5. Verificando conexión al cluster...$(NC)"
	@if kubectl cluster-info &>/dev/null 2>&1; then \
		echo "$(GREEN)  ✓ Conexión exitosa$(NC)"; \
		kubectl cluster-info | head -1; \
	else \
		echo "$(RED)  ✗ No se puede conectar al cluster$(NC)"; \
		echo ""; \
		echo "$(YELLOW)6. Verificando servicios locales...$(NC)"; \
		if command -v minikube >/dev/null 2>&1; then \
			echo "$(CYAN)  Minikube detectado:$(NC)"; \
			minikube status 2>/dev/null || echo "$(RED)    ✗ Minikube no está corriendo$(NC)"; \
		fi; \
		if command -v kind >/dev/null 2>&1; then \
			echo "$(CYAN)  Kind detectado:$(NC)"; \
			kind get clusters 2>/dev/null | while read cluster; do \
				echo "    - $$cluster"; \
			done || echo "$(YELLOW)    No hay clusters de kind$(NC)"; \
		fi; \
		if docker info &>/dev/null 2>&1; then \
			echo "$(CYAN)  Docker detectado:$(NC)"; \
			if docker ps | grep -q k8s; then \
				echo "$(GREEN)    ✓ Hay contenedores de Kubernetes corriendo$(NC)"; \
			else \
				echo "$(YELLOW)    No hay contenedores de Kubernetes corriendo$(NC)"; \
			fi; \
		fi; \
	fi
	@echo ""
	@echo "$(CYAN)=== Fin del diagnóstico ===$(NC)"

setup-minikube-docker: ## Configura el entorno de Docker para Minikube
	@if ! command -v minikube >/dev/null 2>&1; then \
		echo "$(RED)Error: Minikube no está instalado$(NC)"; \
		exit 1; \
	fi
	@if ! minikube status -p $(MINIKUBE_PROFILE) &>/dev/null; then \
		echo "$(YELLOW)Minikube no está corriendo. Iniciando...$(NC)"; \
		minikube start -p $(MINIKUBE_PROFILE); \
	fi
	@echo "$(GREEN)Configurando entorno de Docker para Minikube...$(NC)"
	@echo "$(YELLOW)Ejecuta el siguiente comando en tu shell:$(NC)"
	@echo "$(CYAN)eval $$(minikube -p $(MINIKUBE_PROFILE) docker-env)$(NC)"
	@echo ""
	@echo "$(YELLOW)O agrega esta línea a tu ~/.bashrc o ~/.zshrc:$(NC)"
	@echo "$(CYAN)eval $$(minikube -p $(MINIKUBE_PROFILE) docker-env)$(NC)"

# ============================================
# DESPLIEGUE
# ============================================

deploy: check-k8s ## Despliega un servicio específico (uso: make deploy SERVICE=clinical-service)
	@if [ -z "$(SERVICE)" ]; then \
		echo "$(RED)Error: Especifica el servicio con SERVICE=<nombre>$(NC)"; \
		echo "$(YELLOW)Servicios disponibles: $(SERVICES)$(NC)"; \
		exit 1; \
	fi
	@if [ ! -d "$(SERVICE)" ]; then \
		echo "$(RED)Error: El servicio '$(SERVICE)' no existe$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)Desplegando $(SERVICE)...$(NC)"
	@if [ "$(SERVICE)" = "clinical-service" ]; then \
		$(MAKE) deploy-clinical; \
	else \
		if [ "$(SKIP_VALIDATION)" = "true" ]; then \
			kubectl apply -f $(SERVICE)/ --validate=false; \
		else \
			kubectl apply -f $(SERVICE)/; \
		fi; \
	fi
	@echo "$(GREEN)Despliegue de $(SERVICE) completado!$(NC)"

deploy-all: check-k8s ## Despliega todos los servicios disponibles
	@echo "$(GREEN)=== Desplegando toda la infraestructura ===$(NC)\n"
	@for service in $(SERVICES); do \
		if [ -d "$$service" ] && [ -n "$$(ls -A $$service 2>/dev/null)" ]; then \
			echo "$(CYAN)--- Desplegando $$service ---$(NC)"; \
			if [ "$$service" = "clinical-service" ]; then \
				$(MAKE) deploy-clinical || echo "$(YELLOW)Error desplegando $$service$(NC)"; \
			else \
				if [ "$(SKIP_VALIDATION)" = "true" ]; then \
					kubectl apply -f $$service/ --validate=false || echo "$(YELLOW)Error aplicando manifiestos de $$service$(NC)"; \
				else \
					kubectl apply -f $$service/ || echo "$(YELLOW)Error aplicando manifiestos de $$service$(NC)"; \
				fi; \
			fi; \
			echo ""; \
		else \
			echo "$(YELLOW)Saltando $$service (no hay manifiestos)$(NC)"; \
		fi; \
	done
	@echo "$(GREEN)Despliegue de toda la infraestructura completado!$(NC)"

deploy-clinical: check-k8s ## Despliega clinical-service y MySQL en orden
	@echo "$(GREEN)Desplegando MySQL...$(NC)"
	@if ! kubectl get pvc clinical-mysql-pvc >/dev/null 2>&1; then \
		echo "$(YELLOW)Creando PVC de MySQL...$(NC)"; \
		kubectl apply -f clinical-service/mysql-pvc.yaml; \
	else \
		echo "$(YELLOW)PVC de MySQL ya existe, omitiendo creación$(NC)"; \
	fi
	@kubectl apply -f clinical-service/mysql-configmap.yaml
	@kubectl apply -f clinical-service/mysql-secret.yaml
	@kubectl apply -f clinical-service/mysql-service.yaml
	@kubectl apply -f clinical-service/mysql-deployment.yaml
	@echo "$(YELLOW)Esperando a que MySQL esté listo...$(NC)"
	@kubectl wait --for=condition=ready pod -l $(CLINICAL_MYSQL_LABEL) --timeout=300s || true
	@echo "$(GREEN)Desplegando Clinical Service...$(NC)"
	@kubectl apply -f clinical-service/configmap.yaml
	@kubectl apply -f clinical-service/secret.yaml
	@kubectl apply -f clinical-service/service.yaml
	@kubectl apply -f clinical-service/deployment.yaml
	@echo "$(GREEN)Despliegue completado!$(NC)"

# ============================================
# ELIMINACIÓN
# ============================================

delete: ## Elimina un servicio específico (uso: make delete SERVICE=clinical-service)
	@if [ -z "$(SERVICE)" ]; then \
		echo "$(RED)Error: Especifica el servicio con SERVICE=<nombre>$(NC)"; \
		echo "$(YELLOW)Servicios disponibles: $(SERVICES)$(NC)"; \
		exit 1; \
	fi
	@if [ ! -d "$(SERVICE)" ]; then \
		echo "$(RED)Error: El servicio '$(SERVICE)' no existe$(NC)"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Eliminando $(SERVICE)...$(NC)"
	@if [ "$(SERVICE)" = "clinical-service" ]; then \
		$(MAKE) delete-clinical || true; \
	else \
		kubectl delete -f $(SERVICE)/ --ignore-not-found=true; \
	fi
	@echo "$(GREEN)Eliminación de $(SERVICE) completada!$(NC)"

delete-all: ## Elimina todos los servicios
	@echo "$(YELLOW)=== Eliminando toda la infraestructura ===$(NC)\n"
	@for service in $(SERVICES); do \
		if [ -d "$$service" ] && [ -n "$$(ls -A $$service 2>/dev/null)" ]; then \
			echo "$(CYAN)--- Eliminando $$service ---$(NC)"; \
			if [ "$$service" = "clinical-service" ]; then \
				$(MAKE) delete-clinical || true; \
			else \
				kubectl delete -f $$service/ --ignore-not-found=true || true; \
			fi; \
		fi; \
	done
	@echo "$(GREEN)Eliminación de toda la infraestructura completada!$(NC)"

delete-clinical: ## Elimina todos los recursos de clinical-service
	@echo "$(YELLOW)Eliminando todos los recursos de clinical-service...$(NC)"
	@kubectl delete -f clinical-service/deployment.yaml --ignore-not-found=true
	@kubectl delete -f clinical-service/service.yaml --ignore-not-found=true
	@kubectl delete -f clinical-service/secret.yaml --ignore-not-found=true
	@kubectl delete -f clinical-service/configmap.yaml --ignore-not-found=true
	@kubectl delete -f clinical-service/mysql-deployment.yaml --ignore-not-found=true
	@kubectl delete -f clinical-service/mysql-service.yaml --ignore-not-found=true
	@kubectl delete -f clinical-service/mysql-secret.yaml --ignore-not-found=true
	@kubectl delete -f clinical-service/mysql-configmap.yaml --ignore-not-found=true
	@kubectl delete -f clinical-service/mysql-pvc.yaml --ignore-not-found=true
	@echo "$(GREEN)Recursos eliminados!$(NC)"

# ============================================
# ESTADO Y VERIFICACIÓN
# ============================================

status: ## Muestra el estado de un servicio (uso: make status SERVICE=clinical-service)
	@if [ -z "$(SERVICE)" ]; then \
		echo "$(RED)Error: Especifica el servicio con SERVICE=<nombre>$(NC)"; \
		echo "$(YELLOW)Servicios disponibles: $(SERVICES)$(NC)"; \
		exit 1; \
	fi
	@if [ "$(SERVICE)" = "clinical-service" ]; then \
		$(MAKE) status-clinical; \
	else \
		echo "$(BLUE)=== Estado de $(SERVICE) ===$(NC)"; \
		kubectl get all -l app=$(SERVICE) 2>/dev/null || echo "No hay recursos para $(SERVICE)"; \
	fi

status-all: ## Muestra el estado de todos los servicios
	@echo "$(GREEN)=== Estado de toda la infraestructura ===$(NC)\n"
	@for service in $(SERVICES); do \
		if [ -d "$$service" ] && [ -n "$$(ls -A $$service 2>/dev/null)" ]; then \
			echo "$(CYAN)--- $$service ---$(NC)"; \
			if [ "$$service" = "clinical-service" ]; then \
				$(MAKE) status-clinical 2>/dev/null || echo "  No hay recursos desplegados"; \
			else \
				kubectl get all -l app=$$service 2>/dev/null || echo "  No hay recursos desplegados"; \
			fi; \
			echo ""; \
		fi; \
	done
	@echo "$(BLUE)=== Resumen de recursos ===$(NC)"
	@kubectl get pods,svc,deployments --all-namespaces 2>/dev/null | grep -E "(NAME|clinical|genomic|api-gateway)" || echo "No hay recursos relacionados"

status-clinical: ## Muestra el estado de todos los recursos de clinical-service
	@echo "$(BLUE)=== Estado de Pods ===$(NC)"
	@kubectl get pods -l $(CLINICAL_SERVICE_LABEL) 2>/dev/null || echo "No hay pods del clinical-service"
	@kubectl get pods -l $(CLINICAL_MYSQL_LABEL) 2>/dev/null || echo "No hay pods de MySQL"
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
	@kubectl get pvc clinical-mysql-pvc 2>/dev/null || echo "No hay PVC de MySQL"

# ============================================
# LOGS
# ============================================

logs: ## Muestra logs de un servicio (uso: make logs SERVICE=clinical-service)
	@if [ -z "$(SERVICE)" ]; then \
		echo "$(RED)Error: Especifica el servicio con SERVICE=<nombre>$(NC)"; \
		echo "$(YELLOW)Servicios disponibles: $(SERVICES)$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)Logs de $(SERVICE) (Ctrl+C para salir)...$(NC)"
	@kubectl logs -l app=$(SERVICE) -f --tail=100 2>/dev/null || \
	echo "$(YELLOW)No se encontraron pods para $(SERVICE)$(NC)"

logs-all: ## Muestra logs de todos los servicios
	@echo "$(GREEN)Logs de todos los servicios (Ctrl+C para salir)...$(NC)"
	@kubectl logs -l 'app in ($(SERVICES))' -f --tail=100 2>/dev/null || \
	echo "$(YELLOW)No se encontraron pods$(NC)"

# ============================================
# PORT-FORWARD
# ============================================

port-forward: ## Port-forward de un servicio (uso: make port-forward SERVICE=clinical-service PORT=3000)
	@if [ -z "$(SERVICE)" ]; then \
		echo "$(RED)Error: Especifica el servicio con SERVICE=<nombre>$(NC)"; \
		exit 1; \
	fi
	@if [ -z "$(PORT)" ]; then \
		echo "$(YELLOW)Usando puerto por defecto 3000. Especifica PORT=<puerto> para cambiar$(NC)"; \
		PORT=3000; \
	fi
	@echo "$(GREEN)Port-forward de $(SERVICE) en http://localhost:$(PORT)$(NC)"
	@echo "$(YELLOW)Presiona Ctrl+C para detener$(NC)"
	@kubectl port-forward svc/$(SERVICE) $(PORT):$(PORT) 2>/dev/null || \
	echo "$(RED)Error: No se pudo hacer port-forward$(NC)"

# ============================================
# RESTART
# ============================================

restart: ## Reinicia un servicio (uso: make restart SERVICE=clinical-service)
	@if [ -z "$(SERVICE)" ]; then \
		echo "$(RED)Error: Especifica el servicio con SERVICE=<nombre>$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)Reiniciando $(SERVICE)...$(NC)"
	@kubectl rollout restart deployment $(SERVICE) 2>/dev/null || \
	echo "$(YELLOW)No se encontró deployment para $(SERVICE)$(NC)"

restart-all: ## Reinicia todos los servicios
	@echo "$(GREEN)Reiniciando todos los servicios...$(NC)"
	@for service in $(SERVICES); do \
		if [ -d "$$service" ] && [ -n "$$(ls -A $$service 2>/dev/null)" ]; then \
			echo "$(CYAN)Reiniciando $$service...$(NC)"; \
			kubectl rollout restart deployment $$service 2>/dev/null || true; \
		fi; \
	done
	@echo "$(GREEN)Reinicio completado!$(NC)"

# ============================================
# SCALING
# ============================================

scale: ## Escala un servicio (uso: make scale SERVICE=clinical-service REPLICAS=3)
	@if [ -z "$(SERVICE)" ]; then \
		echo "$(RED)Error: Especifica el servicio con SERVICE=<nombre>$(NC)"; \
		exit 1; \
	fi
	@if [ -z "$(REPLICAS)" ]; then \
		echo "$(RED)Error: Especifica el número de réplicas con REPLICAS=<número>$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)Escalando $(SERVICE) a $(REPLICAS) réplicas...$(NC)"
	@kubectl scale deployment $(SERVICE) --replicas=$(REPLICAS) 2>/dev/null || \
	echo "$(YELLOW)No se encontró deployment para $(SERVICE)$(NC)"

# ============================================
# WAIT
# ============================================

wait-all: ## Espera a que todos los servicios estén listos
	@echo "$(YELLOW)Esperando a que todos los servicios estén listos...$(NC)"
	@for service in $(SERVICES); do \
		if [ -d "$$service" ] && [ -n "$$(ls -A $$service 2>/dev/null)" ]; then \
			echo "$(CYAN)Esperando $$service...$(NC)"; \
			kubectl wait --for=condition=ready pod -l app=$$service --timeout=300s 2>/dev/null || true; \
		fi; \
	done
	@echo "$(GREEN)Todos los servicios están listos!$(NC)"

# ============================================
# LIMPIEZA
# ============================================

cleanup: ## Limpia recursos fallidos de todos los servicios
	@echo "$(YELLOW)Limpiando recursos fallidos...$(NC)"
	@for service in $(SERVICES); do \
		kubectl get pods --field-selector=status.phase!=Running,status.phase!=Succeeded \
			-l app=$$service \
			-o jsonpath='{.items[*].metadata.name}' 2>/dev/null | \
			xargs -r kubectl delete pod 2>/dev/null || true; \
	done
	@echo "$(GREEN)Limpieza completada!$(NC)"

# ============================================
# AYUDA DE SERVICIOS
# ============================================

build-minikube-clinical: ## Construye la imagen Docker usando el entorno de Minikube
	@if [ ! -d "$(CLINICAL_SERVICE_DIR)" ]; then \
		echo "$(RED)Error: No se encuentra el directorio del servicio en $(CLINICAL_SERVICE_DIR)$(NC)"; \
		exit 1; \
	fi
	@if ! command -v minikube >/dev/null 2>&1; then \
		echo "$(RED)Error: Minikube no está instalado$(NC)"; \
		exit 1; \
	fi
	@if ! minikube status -p $(MINIKUBE_PROFILE) &>/dev/null; then \
		echo "$(YELLOW)Minikube no está corriendo. Iniciando...$(NC)"; \
		minikube start -p $(MINIKUBE_PROFILE); \
	fi
	@echo "$(GREEN)Construyendo imagen $(CLINICAL_IMAGE_NAME):$(CLINICAL_IMAGE_TAG) en Minikube...$(NC)"
	@echo "$(YELLOW)Configurando entorno de Docker de Minikube...$(NC)"
	@bash -c "eval \$$(minikube -p $(MINIKUBE_PROFILE) docker-env) && \
		cd $(CLINICAL_SERVICE_DIR) && \
		docker build -f Dockerfile -t $(CLINICAL_IMAGE_NAME):$(CLINICAL_IMAGE_TAG) ."
	@echo "$(GREEN)Imagen construida exitosamente en Minikube!$(NC)"
	@echo "$(CYAN)La imagen está disponible en el cluster de Minikube$(NC)"

clinical-service: ## Muestra información sobre clinical-service
	@echo "$(CYAN)=== Clinical Service ===$(NC)"
	@echo ""
	@echo "$(GREEN)Comandos principales:$(NC)"
	@echo "  $(YELLOW)make deploy SERVICE=clinical-service$(NC)  - Desplegar servicio y MySQL"
	@echo "  $(YELLOW)make status SERVICE=clinical-service$(NC)  - Ver estado"
	@echo "  $(YELLOW)make logs SERVICE=clinical-service$(NC)   - Ver logs"
	@echo "  $(YELLOW)make port-forward SERVICE=clinical-service$(NC)  - Port-forward (puerto 3000)"
	@echo ""
	@echo "$(GREEN)Comandos específicos:$(NC)"
	@echo "  $(YELLOW)make deploy-clinical$(NC)  - Desplegar con orden correcto (MySQL primero)"
	@echo "  $(YELLOW)make status-clinical$(NC)  - Estado detallado (incluye MySQL)"
	@echo "  $(YELLOW)make delete-clinical$(NC)   - Eliminar todos los recursos"
	@echo "  $(YELLOW)make build-minikube-clinical$(NC)  - Construir imagen Docker en Minikube"
	@echo ""
	@echo "$(GREEN)Comandos kubectl útiles:$(NC)"
	@echo "  $(CYAN)kubectl logs -l app=clinical-mysql -f$(NC)  - Logs de MySQL"
	@echo "  $(CYAN)kubectl port-forward svc/clinical-mysql 3306:3306$(NC)  - Port-forward MySQL"
	@echo "  $(CYAN)kubectl exec -it <pod-name> -- /bin/sh$(NC)  - Shell en pod"
	@echo "  $(CYAN)kubectl describe pod <pod-name>$(NC)  - Detalles del pod"
