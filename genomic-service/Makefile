.PHONY: help build up down logs restart clean up-build \
        prod-build prod-up prod-down prod-logs prod-restart prod-clean prod-up-build \
        clean-all status

# Variables
SERVICE := genomic-service
COMPOSE_FILE := docker-compose.yml
IMAGE_NAME := $(SERVICE)
IMAGE_TAG := latest
PORT := 8001

# Colores
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m

help: ## Muestra esta ayuda
	@echo "$(GREEN)Comandos disponibles:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

# ============================================
# DESARROLLO
# ============================================

build: ## Construye la imagen para desarrollo
	@echo "$(GREEN)Construyendo imagen de desarrollo...$(NC)"
	docker compose -f $(COMPOSE_FILE) build

up: ## Levanta los contenedores en modo desarrollo
	@echo "$(GREEN)Iniciando servicios (API + Mongo) en modo desarrollo...$(NC)"
	docker compose -f $(COMPOSE_FILE) up -d
	@echo "$(GREEN)Servicios iniciados. Ver logs con: make logs$(NC)"

up-build: ## Construye e inicia los contenedores de desarrollo
	@echo "$(GREEN)Construyendo e iniciando servicios en modo desarrollo...$(NC)"
	docker compose -f $(COMPOSE_FILE) up -d --build

down: ## Detiene los contenedores de desarrollo
	@echo "$(YELLOW)Deteniendo contenedores de desarrollo...$(NC)"
	docker compose -f $(COMPOSE_FILE) down
	@echo "$(GREEN)Contenedores detenidos$(NC)"

logs: ## Muestra los logs de desarrollo
	@echo "$(GREEN)Logs de los servicios de desarrollo:$(NC)"
	docker compose -f $(COMPOSE_FILE) logs -f

restart: down up ## Reinicia los contenedores de desarrollo

clean: down ## Limpia contenedores/imágenes de desarrollo
	@echo "$(YELLOW)Eliminando contenedores, volúmenes e imágenes de desarrollo...$(NC)"
	docker compose -f $(COMPOSE_FILE) down -v --rmi local
	@echo "$(GREEN)Limpieza completada$(NC)"

# ============================================
# PRODUCCIÓN
# ============================================

prod-build: ## Construye la imagen de producción
	@echo "$(GREEN)Construyendo imagen de producción...$(NC)"
	docker build -f Dockerfile -t $(IMAGE_NAME):$(IMAGE_TAG) .

prod-up: ## Inicia el servicio en modo producción
	@echo "$(GREEN)Iniciando servicio en modo producción...$(NC)"
	docker run -d \
		--name $(SERVICE)-prod \
		--restart unless-stopped \
		-p $(PORT):8001 \
		-e DJANGO_SECRET_KEY=$${DJANGO_SECRET_KEY:-change-me} \
		-e DJANGO_DEBUG=$${DJANGO_DEBUG:-false} \
		-e DJANGO_ALLOWED_HOSTS=$${DJANGO_ALLOWED_HOSTS:-*} \
		-e MONGO_URI=$${MONGO_URI:-mongodb://mongodb:27017} \
		-e MONGO_DB_NAME=$${MONGO_DB_NAME:-geno_sentinel_genomics} \
		-e CLINICAL_SERVICE_BASE_URL=$${CLINICAL_SERVICE_BASE_URL:-http://clinical-service:3000/clinical} \
		$(IMAGE_NAME):$(IMAGE_TAG)
	@echo "$(GREEN)Servicio iniciado. Ver logs con: make prod-logs$(NC)"

prod-up-build: prod-build prod-up ## Construye e inicia el servicio en producción

prod-down: ## Detiene el servicio de producción
	@echo "$(YELLOW)Deteniendo servicio de producción...$(NC)"
	-docker stop $(SERVICE)-prod 2>/dev/null || true
	-docker rm $(SERVICE)-prod 2>/dev/null || true
	@echo "$(GREEN)Servicio detenido$(NC)"

prod-logs: ## Muestra logs del servicio en producción
	@echo "$(GREEN)Logs del servicio de producción:$(NC)"
	docker logs -f $(SERVICE)-prod

prod-restart: prod-down prod-up ## Reinicia el servicio de producción

prod-clean: prod-down ## Elimina contenedor e imagen de producción
	@echo "$(YELLOW)Eliminando imagen de producción...$(NC)"
	-docker rmi $(IMAGE_NAME):$(IMAGE_TAG) 2>/dev/null || true
	@echo "$(GREEN)Limpieza completada$(NC)"

# ============================================
# GENERALES
# ============================================

clean-all: clean prod-clean ## Limpia todo (desarrollo y producción)
	@echo "$(GREEN)Limpieza completa finalizada$(NC)"

status: ## Muestra el estado de los contenedores
	@echo "$(GREEN)Estado de los contenedores:$(NC)"
	@docker ps -a --filter "name=$(SERVICE)" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
