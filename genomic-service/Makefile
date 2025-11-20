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
