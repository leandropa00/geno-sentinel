.PHONY: help dev-build dev-up dev-down dev-logs dev-restart dev-clean dev-up-build \
        prod-build prod-up prod-down prod-logs prod-restart prod-clean prod-up-build \
        clean-all status

# Variables
SERVICE := clinical-service
COMPOSE_FILE := $(SERVICE)/docker-compose.yml
IMAGE_NAME := $(SERVICE)
IMAGE_TAG := latest

# Colores para output
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Muestra esta ayuda
	@echo "$(GREEN)Comandos disponibles:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

# ============================================
# COMANDOS DE DESARROLLO
# ============================================

dev-build: ## Construye la imagen de desarrollo
	@echo "$(GREEN)Construyendo imagen de desarrollo...$(NC)"
	cd $(SERVICE) && docker-compose build

dev-up: ## Inicia los contenedores en modo desarrollo
	@echo "$(GREEN)Iniciando servicios en modo desarrollo...$(NC)"
	cd $(SERVICE) && docker-compose up -d
	@echo "$(GREEN)Servicios iniciados. Ver logs con: make dev-logs$(NC)"

dev-up-build: ## Construye e inicia los contenedores en modo desarrollo
	@echo "$(GREEN)Construyendo e iniciando servicios en modo desarrollo...$(NC)"
	cd $(SERVICE) && docker-compose up -d --build

dev-down: ## Detiene los contenedores de desarrollo
	@echo "$(YELLOW)Deteniendo contenedores de desarrollo...$(NC)"
	cd $(SERVICE) && docker-compose down
	@echo "$(GREEN)Contenedores detenidos$(NC)"

dev-logs: ## Muestra los logs de desarrollo
	@echo "$(GREEN)Logs de los servicios de desarrollo:$(NC)"
	cd $(SERVICE) && docker-compose logs -f

dev-restart: dev-down dev-up ## Reinicia los contenedores de desarrollo

dev-clean: dev-down ## Limpia contenedores e imágenes de desarrollo
	@echo "$(YELLOW)Eliminando contenedores, volúmenes e imágenes de desarrollo...$(NC)"
	cd $(SERVICE) && docker-compose down -v --rmi local
	@echo "$(GREEN)Limpieza completada$(NC)"

# ============================================
# COMANDOS DE PRODUCCIÓN
# ============================================

prod-build: ## Construye la imagen de producción
	@echo "$(GREEN)Construyendo imagen de producción...$(NC)"
	cd $(SERVICE) && docker build -f Dockerfile -t $(IMAGE_NAME):$(IMAGE_TAG) .

prod-up: ## Inicia el contenedor en modo producción
	@echo "$(GREEN)Iniciando servicio en modo producción...$(NC)"
	@echo "$(YELLOW)Nota: Asegúrate de tener MySQL corriendo y configurado$(NC)"
	docker run -d \
		--name $(SERVICE)-prod \
		--restart unless-stopped \
		-p 3000:3000 \
		-e DB_HOST=$${DB_HOST:-localhost} \
		-e DB_PORT=$${DB_PORT:-3306} \
		-e DB_USERNAME=$${DB_USERNAME:-root} \
		-e DB_PASSWORD=$${DB_PASSWORD} \
		-e DB_DATABASE=$${DB_DATABASE:-clinical_db} \
		-e PORT=3000 \
		-e NODE_ENV=production \
		$(IMAGE_NAME):$(IMAGE_TAG)
	@echo "$(GREEN)Servicio iniciado. Ver logs con: make prod-logs$(NC)"

prod-up-build: prod-build prod-up ## Construye e inicia el contenedor en modo producción

prod-down: ## Detiene el contenedor de producción
	@echo "$(YELLOW)Deteniendo contenedor de producción...$(NC)"
	-docker stop $(SERVICE)-prod 2>/dev/null || true
	-docker rm $(SERVICE)-prod 2>/dev/null || true
	@echo "$(GREEN)Contenedor detenido$(NC)"

prod-logs: ## Muestra los logs de producción
	@echo "$(GREEN)Logs del servicio de producción:$(NC)"
	docker logs -f $(SERVICE)-prod

prod-restart: prod-down prod-up ## Reinicia el contenedor de producción

prod-clean: prod-down ## Limpia contenedor e imagen de producción
	@echo "$(YELLOW)Eliminando contenedor e imagen de producción...$(NC)"
	-docker rmi $(IMAGE_NAME):$(IMAGE_TAG) 2>/dev/null || true
	@echo "$(GREEN)Limpieza completada$(NC)"

# ============================================
# COMANDOS GENERALES
# ============================================

clean-all: dev-clean prod-clean ## Limpia todo (desarrollo y producción)
	@echo "$(GREEN)Limpieza completa finalizada$(NC)"

status: ## Muestra el estado de los contenedores
	@echo "$(GREEN)Estado de los contenedores:$(NC)"
	@docker ps -a --filter "name=clinical" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

