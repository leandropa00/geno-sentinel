.PHONY: help check-k8s diagnose-k8s setup-minikube-docker deploy deploy-all delete delete-all status status-all \
        logs logs-all port-forward restart restart-all scale wait-all cleanup clinical-service genomic-service \
        build-minikube-clinical build-minikube-genomic build-minikube-api-gateway build-minikube-frontend build-all-minikube build-all-docker build-all build-and-deploy-all \
        deploy-from-scratch fresh-deploy deploy-clinical deploy-genomic delete-clinical delete-genomic status-clinical status-genomic

# Variables
NAMESPACE := default
SERVICES := clinical-service genomic-service api-gateway frontend
SKIP_VALIDATION := false
MINIKUBE_PROFILE := minikube
CLINICAL_SERVICE_DIR := ../clinical-service
CLINICAL_IMAGE_NAME := clinical-service
CLINICAL_IMAGE_TAG := latest
CLINICAL_SERVICE_LABEL := app=clinical-service
CLINICAL_MYSQL_LABEL := app=clinical-mysql
GENOMIC_SERVICE_DIR := ../genomic-service
GENOMIC_IMAGE_NAME := genomic-service
GENOMIC_IMAGE_TAG := latest
GENOMIC_SERVICE_LABEL := app=genomic-service
GENOMIC_MONGODB_LABEL := app=genomic-mongodb
API_GATEWAY_DIR := ../api-gateway
API_GATEWAY_IMAGE_NAME := api-gateway
API_GATEWAY_IMAGE_TAG := latest
FRONTEND_DIR := ../frontend
FRONTEND_IMAGE_NAME := geno-sentinel-frontend
FRONTEND_IMAGE_TAG := latest

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
	@echo "  $(GREEN)make deploy-from-scratch$(NC)     - Desplegar todo desde cero (recomendado)"
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
	elif [ "$(SERVICE)" = "genomic-service" ]; then \
		$(MAKE) deploy-genomic; \
	else \
		if [ -f "$(SERVICE)/kustomization.yaml" ]; then \
			if [ "$(SKIP_VALIDATION)" = "true" ]; then \
				kubectl apply -k $(SERVICE)/ --validate=false; \
			else \
				kubectl apply -k $(SERVICE)/; \
			fi; \
		else \
			if [ "$(SKIP_VALIDATION)" = "true" ]; then \
				kubectl apply -f $(SERVICE)/ --validate=false; \
			else \
				kubectl apply -f $(SERVICE)/; \
			fi; \
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
			elif [ "$$service" = "genomic-service" ]; then \
				$(MAKE) deploy-genomic || echo "$(YELLOW)Error desplegando $$service$(NC)"; \
			else \
				if [ -f "$$service/kustomization.yaml" ]; then \
					if [ "$(SKIP_VALIDATION)" = "true" ]; then \
						kubectl apply -k $$service/ --validate=false || echo "$(YELLOW)Error aplicando manifiestos de $$service$(NC)"; \
					else \
						kubectl apply -k $$service/ || echo "$(YELLOW)Error aplicando manifiestos de $$service$(NC)"; \
					fi; \
				else \
					if [ "$(SKIP_VALIDATION)" = "true" ]; then \
						kubectl apply -f $$service/ --validate=false || echo "$(YELLOW)Error aplicando manifiestos de $$service$(NC)"; \
					else \
						kubectl apply -f $$service/ || echo "$(YELLOW)Error aplicando manifiestos de $$service$(NC)"; \
					fi; \
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

deploy-genomic: check-k8s ## Despliega genomic-service y MongoDB en orden
	@echo "$(GREEN)Desplegando MongoDB...$(NC)"
	@if ! kubectl get pvc genomic-mongodb-pvc >/dev/null 2>&1; then \
		echo "$(YELLOW)Creando PVC de MongoDB...$(NC)"; \
		kubectl apply -f genomic-service/mongodb-pvc.yaml; \
	else \
		echo "$(YELLOW)PVC de MongoDB ya existe, omitiendo creación$(NC)"; \
	fi
	@kubectl apply -f genomic-service/mongodb-configmap.yaml
	@kubectl apply -f genomic-service/mongodb-secret.yaml
	@kubectl apply -f genomic-service/mongodb-service.yaml
	@kubectl apply -f genomic-service/mongodb-deployment.yaml
	@echo "$(YELLOW)Esperando a que MongoDB esté listo...$(NC)"
	@kubectl wait --for=condition=ready pod -l $(GENOMIC_MONGODB_LABEL) --timeout=300s || true
	@echo "$(GREEN)Desplegando Genomic Service...$(NC)"
	@kubectl apply -f genomic-service/configmap.yaml
	@kubectl apply -f genomic-service/secret.yaml
	@kubectl apply -f genomic-service/service.yaml
	@kubectl apply -f genomic-service/deployment.yaml
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
	elif [ "$(SERVICE)" = "genomic-service" ]; then \
		$(MAKE) delete-genomic || true; \
	else \
		if [ -f "$(SERVICE)/kustomization.yaml" ]; then \
			kubectl delete -k $(SERVICE)/ --ignore-not-found=true; \
		else \
			kubectl delete -f $(SERVICE)/ --ignore-not-found=true; \
		fi; \
	fi
	@echo "$(GREEN)Eliminación de $(SERVICE) completada!$(NC)"

delete-all: ## Elimina todos los servicios
	@echo "$(YELLOW)=== Eliminando toda la infraestructura ===$(NC)\n"
	@for service in $(SERVICES); do \
		if [ -d "$$service" ] && [ -n "$$(ls -A $$service 2>/dev/null)" ]; then \
			echo "$(CYAN)--- Eliminando $$service ---$(NC)"; \
			if [ "$$service" = "clinical-service" ]; then \
				$(MAKE) delete-clinical || true; \
			elif [ "$$service" = "genomic-service" ]; then \
				$(MAKE) delete-genomic || true; \
			else \
				if [ -f "$$service/kustomization.yaml" ]; then \
					kubectl delete -k $$service/ --ignore-not-found=true || true; \
				else \
					kubectl delete -f $$service/ --ignore-not-found=true || true; \
				fi; \
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

delete-genomic: ## Elimina todos los recursos de genomic-service
	@echo "$(YELLOW)Eliminando todos los recursos de genomic-service...$(NC)"
	@kubectl delete -f genomic-service/deployment.yaml --ignore-not-found=true
	@kubectl delete -f genomic-service/service.yaml --ignore-not-found=true
	@kubectl delete -f genomic-service/secret.yaml --ignore-not-found=true
	@kubectl delete -f genomic-service/configmap.yaml --ignore-not-found=true
	@kubectl delete -f genomic-service/mongodb-deployment.yaml --ignore-not-found=true
	@kubectl delete -f genomic-service/mongodb-service.yaml --ignore-not-found=true
	@kubectl delete -f genomic-service/mongodb-secret.yaml --ignore-not-found=true
	@kubectl delete -f genomic-service/mongodb-configmap.yaml --ignore-not-found=true
	@kubectl delete -f genomic-service/mongodb-pvc.yaml --ignore-not-found=true
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
	elif [ "$(SERVICE)" = "genomic-service" ]; then \
		$(MAKE) status-genomic; \
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
			elif [ "$$service" = "genomic-service" ]; then \
				$(MAKE) status-genomic 2>/dev/null || echo "  No hay recursos desplegados"; \
			else \
				kubectl get all -l app=$$service 2>/dev/null || echo "  No hay recursos desplegados"; \
			fi; \
			echo ""; \
		fi; \
	done
	@echo "$(BLUE)=== Resumen de recursos ===$(NC)"
	@kubectl get pods,svc,deployments --all-namespaces 2>/dev/null | grep -E "(NAME|clinical|genomic|api-gateway|frontend)" || echo "No hay recursos relacionados"

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

status-genomic: ## Muestra el estado de todos los recursos de genomic-service
	@echo "$(BLUE)=== Estado de Pods ===$(NC)"
	@kubectl get pods -l $(GENOMIC_SERVICE_LABEL) 2>/dev/null || echo "No hay pods del genomic-service"
	@kubectl get pods -l $(GENOMIC_MONGODB_LABEL) 2>/dev/null || echo "No hay pods de MongoDB"
	@echo ""
	@echo "$(BLUE)=== Estado de Deployments ===$(NC)"
	@kubectl get deployment genomic-service 2>/dev/null || echo "No hay deployment del genomic-service"
	@kubectl get deployment genomic-mongodb 2>/dev/null || echo "No hay deployment de MongoDB"
	@echo ""
	@echo "$(BLUE)=== Estado de Services ===$(NC)"
	@kubectl get svc genomic-service 2>/dev/null || echo "No hay service del genomic-service"
	@kubectl get svc genomic-mongodb 2>/dev/null || echo "No hay service de MongoDB"
	@echo ""
	@echo "$(BLUE)=== Estado de PVCs ===$(NC)"
	@kubectl get pvc genomic-mongodb-pvc 2>/dev/null || echo "No hay PVC de MongoDB"

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

port-forward: ## Port-forward de un servicio (uso: make port-forward SERVICE=clinical-service)
	@if [ -z "$(SERVICE)" ]; then \
		echo "$(RED)Error: Especifica el servicio con SERVICE=<nombre>$(NC)"; \
		exit 1; \
	fi
	@bash -c '\
	SVC_PORT=$$(kubectl get svc $(SERVICE) -o jsonpath="{.spec.ports[0].port}" 2>/dev/null); \
	if [ -z "$$SVC_PORT" ]; then \
		if [ "$(SERVICE)" = "frontend" ]; then \
			SVC_PORT=80; \
		elif [ "$(SERVICE)" = "api-gateway" ]; then \
			SVC_PORT=8080; \
		elif [ "$(SERVICE)" = "clinical-service" ]; then \
			SVC_PORT=3000; \
		elif [ "$(SERVICE)" = "genomic-service" ]; then \
			SVC_PORT=8001; \
		else \
			SVC_PORT=3000; \
		fi; \
	fi; \
	if [ "$$SVC_PORT" = "80" ]; then \
		LOCAL_PORT=8080; \
		echo "$(YELLOW)Nota: Puerto 80 requiere permisos root. Usando puerto local 8080$(NC)"; \
	else \
		LOCAL_PORT=$$SVC_PORT; \
	fi; \
	echo "$(GREEN)Port-forward de $(SERVICE) en http://localhost:$$LOCAL_PORT$(NC)"; \
	echo "$(YELLOW)Puerto local: $$LOCAL_PORT -> Puerto servicio: $$SVC_PORT$(NC)"; \
	echo "$(YELLOW)Presiona Ctrl+C para detener$(NC)"; \
	kubectl port-forward svc/$(SERVICE) $$LOCAL_PORT:$$SVC_PORT 2>/dev/null || \
	echo "$(RED)Error: No se pudo hacer port-forward$(NC)"'

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
			if [ "$$service" = "clinical-service" ]; then \
				echo "$(YELLOW)  Esperando MySQL...$(NC)"; \
				kubectl wait --for=condition=ready pod -l app=clinical-mysql --timeout=300s 2>/dev/null || echo "$(YELLOW)    MySQL aún no está listo (continuando...)$(NC)"; \
				echo "$(YELLOW)  Esperando Clinical Service...$(NC)"; \
				kubectl wait --for=condition=ready pod -l app=$$service --timeout=300s 2>/dev/null || echo "$(YELLOW)    $$service aún no está listo (continuando...)$(NC)"; \
			elif [ "$$service" = "genomic-service" ]; then \
				echo "$(YELLOW)  Esperando MongoDB...$(NC)"; \
				kubectl wait --for=condition=ready pod -l app=genomic-mongodb --timeout=300s 2>/dev/null || echo "$(YELLOW)    MongoDB aún no está listo (continuando...)$(NC)"; \
				echo "$(YELLOW)  Esperando Genomic Service...$(NC)"; \
				kubectl wait --for=condition=ready pod -l app=$$service --timeout=300s 2>/dev/null || echo "$(YELLOW)    $$service aún no está listo (continuando...)$(NC)"; \
			else \
				kubectl wait --for=condition=ready pod -l app=$$service --timeout=300s 2>/dev/null || echo "$(YELLOW)    $$service aún no está listo (continuando...)$(NC)"; \
			fi; \
		fi; \
	done
	@echo "$(GREEN)✓ Espera completada$(NC)"

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
# CONSTRUCCIÓN DE IMÁGENES
# ============================================

build-all-minikube: ## Construye todas las imágenes Docker usando el entorno de Minikube
	@if ! command -v minikube >/dev/null 2>&1; then \
		echo "$(RED)Error: Minikube no está instalado$(NC)"; \
		exit 1; \
	fi
	@if ! minikube status -p $(MINIKUBE_PROFILE) &>/dev/null; then \
		echo "$(YELLOW)Minikube no está corriendo. Iniciando...$(NC)"; \
		minikube start -p $(MINIKUBE_PROFILE); \
	fi
	@if [ ! -d "$(CLINICAL_SERVICE_DIR)" ]; then \
		echo "$(RED)Error: No se encuentra el directorio del servicio en $(CLINICAL_SERVICE_DIR)$(NC)"; \
		exit 1; \
	fi
	@if [ ! -d "$(GENOMIC_SERVICE_DIR)" ]; then \
		echo "$(RED)Error: No se encuentra el directorio del servicio en $(GENOMIC_SERVICE_DIR)$(NC)"; \
		exit 1; \
	fi
	@if [ ! -d "$(API_GATEWAY_DIR)" ]; then \
		echo "$(RED)Error: No se encuentra el directorio del servicio en $(API_GATEWAY_DIR)$(NC)"; \
		exit 1; \
	fi
	@if [ ! -d "$(FRONTEND_DIR)" ]; then \
		echo "$(RED)Error: No se encuentra el directorio del servicio en $(FRONTEND_DIR)$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)=== Construyendo todas las imágenes en Minikube ===$(NC)\n"
	@echo "$(YELLOW)Configurando entorno de Docker de Minikube...$(NC)"
	@bash -c "eval \$$(minikube -p $(MINIKUBE_PROFILE) docker-env) && \
		echo \"$(CYAN)--- Construyendo Clinical Service ---$(NC)\" && \
		cd $(CLINICAL_SERVICE_DIR) && \
		docker build -f Dockerfile -t $(CLINICAL_IMAGE_NAME):$(CLINICAL_IMAGE_TAG) . && \
		echo \"$(GREEN)✓ Clinical Service construido$(NC)\" && \
		echo \"\" && \
		echo \"$(CYAN)--- Construyendo Genomic Service ---$(NC)\" && \
		cd $(GENOMIC_SERVICE_DIR) && \
		docker build -f Dockerfile -t $(GENOMIC_IMAGE_NAME):$(GENOMIC_IMAGE_TAG) . && \
		echo \"$(GREEN)✓ Genomic Service construido$(NC)\" && \
		echo \"\" && \
		echo \"$(CYAN)--- Construyendo API Gateway ---$(NC)\" && \
		cd $(API_GATEWAY_DIR) && \
		docker build -f Dockerfile -t $(API_GATEWAY_IMAGE_NAME):$(API_GATEWAY_IMAGE_TAG) . && \
		echo \"$(GREEN)✓ API Gateway construido$(NC)\" && \
		echo \"\" && \
		echo \"$(CYAN)--- Construyendo Frontend ---$(NC)\" && \
		cd $(FRONTEND_DIR) && \
		docker build -f Dockerfile -t $(FRONTEND_IMAGE_NAME):$(FRONTEND_IMAGE_TAG) . && \
		echo \"$(GREEN)✓ Frontend construido$(NC)\""
	@echo ""
	@echo "$(GREEN)✓ Todas las imágenes construidas exitosamente!$(NC)"

build-all-docker: ## Construye todas las imágenes Docker usando Docker estándar (para Docker Desktop u otros)
	@if [ ! -d "$(CLINICAL_SERVICE_DIR)" ]; then \
		echo "$(RED)Error: No se encuentra el directorio del servicio en $(CLINICAL_SERVICE_DIR)$(NC)"; \
		exit 1; \
	fi
	@if [ ! -d "$(GENOMIC_SERVICE_DIR)" ]; then \
		echo "$(RED)Error: No se encuentra el directorio del servicio en $(GENOMIC_SERVICE_DIR)$(NC)"; \
		exit 1; \
	fi
	@if [ ! -d "$(API_GATEWAY_DIR)" ]; then \
		echo "$(RED)Error: No se encuentra el directorio del servicio en $(API_GATEWAY_DIR)$(NC)"; \
		exit 1; \
	fi
	@if [ ! -d "$(FRONTEND_DIR)" ]; then \
		echo "$(RED)Error: No se encuentra el directorio del servicio en $(FRONTEND_DIR)$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)=== Construyendo todas las imágenes con Docker ===$(NC)\n"
	@echo "$(CYAN)--- Construyendo Clinical Service ---$(NC)"
	@cd $(CLINICAL_SERVICE_DIR) && \
		docker build -f Dockerfile -t $(CLINICAL_IMAGE_NAME):$(CLINICAL_IMAGE_TAG) . && \
		echo "$(GREEN)✓ Clinical Service construido$(NC)"
	@echo ""
	@echo "$(CYAN)--- Construyendo Genomic Service ---$(NC)"
	@cd $(GENOMIC_SERVICE_DIR) && \
		docker build -f Dockerfile -t $(GENOMIC_IMAGE_NAME):$(GENOMIC_IMAGE_TAG) . && \
		echo "$(GREEN)✓ Genomic Service construido$(NC)"
	@echo ""
	@echo "$(CYAN)--- Construyendo API Gateway ---$(NC)"
	@cd $(API_GATEWAY_DIR) && \
		docker build -f Dockerfile -t $(API_GATEWAY_IMAGE_NAME):$(API_GATEWAY_IMAGE_TAG) . && \
		echo "$(GREEN)✓ API Gateway construido$(NC)"
	@echo ""
	@echo "$(CYAN)--- Construyendo Frontend ---$(NC)"
	@cd $(FRONTEND_DIR) && \
		docker build -f Dockerfile -t $(FRONTEND_IMAGE_NAME):$(FRONTEND_IMAGE_TAG) . && \
		echo "$(GREEN)✓ Frontend construido$(NC)"
	@echo ""
	@echo "$(GREEN)✓ Todas las imágenes construidas exitosamente!$(NC)"

build-all: ## Construye todas las imágenes Docker (detecta automáticamente Minikube o Docker Desktop)
	@bash -c '\
		CURRENT_CTX=$$(kubectl config current-context 2>/dev/null || echo ""); \
		if [ -n "$$CURRENT_CTX" ] && echo "$$CURRENT_CTX" | grep -q "minikube"; then \
			if command -v minikube >/dev/null 2>&1 && minikube status -p $(MINIKUBE_PROFILE) &>/dev/null; then \
				echo "$(CYAN)Detectado Minikube, usando build-all-minikube...$(NC)"; \
				$(MAKE) build-all-minikube; \
			else \
				echo "$(YELLOW)Minikube detectado pero no está corriendo, usando Docker estándar...$(NC)"; \
				$(MAKE) build-all-docker; \
			fi; \
		else \
			echo "$(CYAN)Usando Docker estándar (Docker Desktop u otro)...$(NC)"; \
			$(MAKE) build-all-docker; \
		fi'

build-and-deploy-all: check-k8s ## Construye todas las imágenes y despliega toda la infraestructura
	@echo "$(GREEN)=== Construyendo imágenes y desplegando infraestructura completa ===$(NC)\n"
	@$(MAKE) build-all
	@echo ""
	@echo "$(GREEN)=== Desplegando toda la infraestructura ===$(NC)\n"
	@$(MAKE) deploy-all
	@echo ""
	@echo "$(GREEN)✓ Proceso completado!$(NC)"
	@echo "$(CYAN)Usa 'make status-all' para ver el estado de los servicios$(NC)"

deploy-from-scratch: check-k8s ## Despliega todo desde cero: elimina, construye y despliega (alias: fresh-deploy)
	@echo "$(GREEN)=== Despliegue desde cero ===$(NC)\n"
	@bash -c '\
		CURRENT_CTX=$$(kubectl config current-context 2>/dev/null || echo ""); \
		if [ -n "$$CURRENT_CTX" ] && echo "$$CURRENT_CTX" | grep -q "minikube"; then \
			K8S_PROVIDER="Minikube"; \
		else \
			K8S_PROVIDER="Kubernetes"; \
		fi; \
		echo "$(YELLOW)Este comando hará lo siguiente:$(NC)"; \
		echo "  1. Verificar conexión al cluster de Kubernetes"; \
		echo "  2. Eliminar todos los servicios existentes"; \
		echo "  3. Construir todas las imágenes Docker"; \
		echo "  4. Desplegar todos los servicios"; \
		echo "  5. Esperar a que todo esté listo"; \
		echo "  6. Verificar estado de los pods"; \
		echo "  7. Mostrar el estado final"; \
		echo "  8. Configurar port-forward del frontend"; \
		echo ""; \
		echo "$(CYAN)Proveedor detectado: $$K8S_PROVIDER$(NC)"; \
		echo ""'
	@echo "$(CYAN)=== Paso 1: Verificando conexión al cluster ===$(NC)"
	@bash -c '\
		CURRENT_CTX=$$(kubectl config current-context 2>/dev/null || echo ""); \
		if [ -n "$$CURRENT_CTX" ] && echo "$$CURRENT_CTX" | grep -q "minikube"; then \
			if command -v minikube >/dev/null 2>&1 && minikube status -p $(MINIKUBE_PROFILE) &>/dev/null; then \
				echo -e "\033[0;32m✓ Minikube está corriendo\033[0m"; \
			else \
				echo -e "\033[1;33mMinikube detectado pero no está corriendo\033[0m"; \
				echo -e "\033[1;33mNota: Si necesitas Minikube, ejecuta '\''minikube start'\'' manualmente\033[0m"; \
			fi; \
		else \
			echo -e "\033[0;32m✓ Cluster de Kubernetes disponible (\033[0;36m$$CURRENT_CTX\033[0;32m)\033[0m"; \
		fi'
	@echo ""
	@echo "$(CYAN)=== Paso 2: Eliminando servicios existentes ===$(NC)"
	@$(MAKE) delete-all || echo "$(YELLOW)No hay servicios para eliminar o error al eliminar (continuando...)$(NC)"
	@echo "$(GREEN)✓ Limpieza completada$(NC)"
	@echo ""
	@echo "$(CYAN)=== Paso 3: Construyendo todas las imágenes Docker ===$(NC)"
	@$(MAKE) build-all
	@echo ""
	@echo "$(CYAN)=== Paso 4: Desplegando todos los servicios ===$(NC)"
	@$(MAKE) deploy-all
	@echo ""
	@echo "$(CYAN)=== Paso 5: Esperando a que todos los servicios estén listos ===$(NC)"
	@$(MAKE) wait-all
	@echo ""
	@echo "$(CYAN)=== Paso 6: Verificando estado de los servicios ===$(NC)"
	@echo "$(YELLOW)Verificando que todos los pods estén en estado Running...$(NC)"
	@bash -c ' \
		TIMEOUT=300; \
		ELAPSED=0; \
		while [ $$ELAPSED -lt $$TIMEOUT ]; do \
			READY_PODS=$$(kubectl get pods --no-headers 2>/dev/null | grep -E "(clinical-service|genomic-service|api-gateway|frontend)" | grep -c "Running" || echo "0"); \
			TOTAL_PODS=$$(kubectl get pods --no-headers 2>/dev/null | grep -E "(clinical-service|genomic-service|api-gateway|frontend)" | wc -l || echo "0"); \
			if [ "$$TOTAL_PODS" -gt 0 ] && [ "$$READY_PODS" -eq "$$TOTAL_PODS" ]; then \
				echo -e "\033[0;32m✓ Todos los pods están en estado Running ($$READY_PODS/$$TOTAL_PODS)\033[0m"; \
				break; \
			fi; \
			echo -e "\033[1;33m  Esperando... ($$READY_PODS/$$TOTAL_PODS pods listos) - $$ELAPSED segundos\033[0m"; \
			sleep 5; \
			ELAPSED=$$((ELAPSED + 5)); \
		done'
	@echo ""
	@echo "$(CYAN)=== Paso 7: Estado final de los servicios ===$(NC)"
	@$(MAKE) status-all
	@echo ""
	@echo "$(GREEN)═══════════════════════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)✓ Despliegue desde cero completado exitosamente!$(NC)"
	@echo "$(GREEN)═══════════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@echo "$(CYAN)=== Paso 8: Configurando port-forward del frontend ===$(NC)"
	@echo "$(YELLOW)Iniciando port-forward en segundo plano...$(NC)"
	@pkill -f "kubectl port-forward.*frontend" 2>/dev/null || true
	@sleep 2
	@bash -c '\
		SVC_PORT=80; \
		LOCAL_PORT=4200; \
		echo "$(GREEN)✓ Port-forward configurado: http://localhost:$$LOCAL_PORT -> frontend:$$SVC_PORT$(NC)"; \
		kubectl port-forward svc/frontend $$LOCAL_PORT:$$SVC_PORT > /dev/null 2>&1 & \
		echo "$$!" > /tmp/frontend-port-forward.pid; \
		sleep 2; \
		if ps -p $$(cat /tmp/frontend-port-forward.pid 2>/dev/null) > /dev/null 2>&1; then \
			echo "$(GREEN)✓ Port-forward activo en segundo plano (PID: $$(cat /tmp/frontend-port-forward.pid))$(NC)"; \
		else \
			echo "$(YELLOW)⚠ Port-forward no se pudo iniciar automáticamente$(NC)"; \
		fi'
	@echo ""
	@echo "$(CYAN)Información de acceso:$(NC)"
	@echo "  $(GREEN)Frontend:$(NC) http://localhost:4200"
	@echo "  $(GREEN)API Gateway:$(NC) http://localhost:8080/api"
	@echo "  $(GREEN)Genomic Service:$(NC) http://localhost:8001"
	@echo ""
	@echo "$(YELLOW)Credenciales de acceso:$(NC)"
	@echo "  Usuario: $(GREEN)admin$(NC) / Contraseña: $(GREEN)admin123$(NC)"
	@echo "  Usuario: $(GREEN)user$(NC) / Contraseña: $(GREEN)user123$(NC)"
	@echo ""
	@echo "$(CYAN)Comandos útiles:$(NC)"
	@echo "  $(YELLOW)make status-all$(NC)                      - Ver estado detallado de todos los servicios"
	@echo "  $(YELLOW)make logs SERVICE=<nombre>$(NC)          - Ver logs de un servicio específico"
	@echo "  $(YELLOW)pkill -f "kubectl port-forward.*frontend"$(NC)  - Detener port-forward del frontend"
	@echo ""

fresh-deploy: deploy-from-scratch ## Alias para deploy-from-scratch

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

build-minikube-api-gateway: ## Construye la imagen Docker del API Gateway usando el entorno de Minikube
	@if [ ! -d "$(API_GATEWAY_DIR)" ]; then \
		echo "$(RED)Error: No se encuentra el directorio del servicio en $(API_GATEWAY_DIR)$(NC)"; \
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
	@echo "$(GREEN)Construyendo imagen $(API_GATEWAY_IMAGE_NAME):$(API_GATEWAY_IMAGE_TAG) en Minikube...$(NC)"
	@echo "$(YELLOW)Configurando entorno de Docker de Minikube...$(NC)"
	@bash -c "eval \$$(minikube -p $(MINIKUBE_PROFILE) docker-env) && \
		cd $(API_GATEWAY_DIR) && \
		docker build -f Dockerfile -t $(API_GATEWAY_IMAGE_NAME):$(API_GATEWAY_IMAGE_TAG) ."
	@echo "$(GREEN)Imagen construida exitosamente en Minikube!$(NC)"
	@echo "$(CYAN)La imagen está disponible en el cluster de Minikube$(NC)"

build-minikube-genomic: ## Construye la imagen Docker del Genomic Service usando el entorno de Minikube
	@if [ ! -d "$(GENOMIC_SERVICE_DIR)" ]; then \
		echo "$(RED)Error: No se encuentra el directorio del servicio en $(GENOMIC_SERVICE_DIR)$(NC)"; \
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
	@echo "$(GREEN)Construyendo imagen $(GENOMIC_IMAGE_NAME):$(GENOMIC_IMAGE_TAG) en Minikube...$(NC)"
	@echo "$(YELLOW)Configurando entorno de Docker de Minikube...$(NC)"
	@bash -c "eval \$$(minikube -p $(MINIKUBE_PROFILE) docker-env) && \
		cd $(GENOMIC_SERVICE_DIR) && \
		docker build -f Dockerfile -t $(GENOMIC_IMAGE_NAME):$(GENOMIC_IMAGE_TAG) ."
	@echo "$(GREEN)Imagen construida exitosamente en Minikube!$(NC)"
	@echo "$(CYAN)La imagen está disponible en el cluster de Minikube$(NC)"

build-minikube-frontend: ## Construye la imagen Docker del Frontend usando el entorno de Minikube
	@if [ ! -d "$(FRONTEND_DIR)" ]; then \
		echo "$(RED)Error: No se encuentra el directorio del servicio en $(FRONTEND_DIR)$(NC)"; \
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
	@echo "$(GREEN)Construyendo imagen $(FRONTEND_IMAGE_NAME):$(FRONTEND_IMAGE_TAG) en Minikube...$(NC)"
	@echo "$(YELLOW)Configurando entorno de Docker de Minikube...$(NC)"
	@bash -c "eval \$$(minikube -p $(MINIKUBE_PROFILE) docker-env) && \
		cd $(FRONTEND_DIR) && \
		docker build -f Dockerfile -t $(FRONTEND_IMAGE_NAME):$(FRONTEND_IMAGE_TAG) ."
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

genomic-service: ## Muestra información sobre genomic-service
	@echo "$(CYAN)=== Genomic Service ===$(NC)"
	@echo ""
	@echo "$(GREEN)Comandos principales:$(NC)"
	@echo "  $(YELLOW)make deploy SERVICE=genomic-service$(NC)  - Desplegar servicio y MongoDB"
	@echo "  $(YELLOW)make status SERVICE=genomic-service$(NC)  - Ver estado"
	@echo "  $(YELLOW)make logs SERVICE=genomic-service$(NC)   - Ver logs"
	@echo "  $(YELLOW)make port-forward SERVICE=genomic-service$(NC)  - Port-forward (puerto 8001)"
	@echo ""
	@echo "$(GREEN)Comandos específicos:$(NC)"
	@echo "  $(YELLOW)make deploy-genomic$(NC)  - Desplegar con orden correcto (MongoDB primero)"
	@echo "  $(YELLOW)make status-genomic$(NC)  - Estado detallado (incluye MongoDB)"
	@echo "  $(YELLOW)make delete-genomic$(NC)   - Eliminar todos los recursos"
	@echo "  $(YELLOW)make build-minikube-genomic$(NC)  - Construir imagen Docker en Minikube"
	@echo ""
	@echo "$(GREEN)Comandos kubectl útiles:$(NC)"
	@echo "  $(CYAN)kubectl logs -l app=genomic-mongodb -f$(NC)  - Logs de MongoDB"
	@echo "  $(CYAN)kubectl port-forward svc/genomic-mongodb 27017:27017$(NC)  - Port-forward MongoDB"
	@echo "  $(CYAN)kubectl exec -it <pod-name> -- /bin/sh$(NC)  - Shell en pod"
	@echo "  $(CYAN)kubectl describe pod <pod-name>$(NC)  - Detalles del pod"
	@echo ""
	@echo "$(GREEN)Endpoints disponibles:$(NC)"
	@echo "  $(CYAN)Genes:$(NC) http://localhost:8001/genomic/genes"
	@echo "  $(CYAN)Variantes:$(NC) http://localhost:8001/genomic/genetic-variants"
	@echo "  $(CYAN)Reportes:$(NC) http://localhost:8001/genomic/patient-variant-reports"
	@echo "  $(CYAN)Swagger:$(NC) http://localhost:8001/docs/"
