.PHONY: build dev up down logs clean install

# Build production image (for k8s deployment)
build:
	docker build -t geno-sentinel-frontend:latest .

# Run in development mode
dev:
	docker compose up --build

# Run in development mode (detached)
up:
	docker compose up -d

# Stop containers
down:
	docker compose down

# View logs
logs:
	docker compose logs -f frontend

# Clean up
clean:
	docker compose down -v
	docker rmi geno-sentinel-frontend:latest || true

# Install dependencies locally
install:
	npm install

# Build locally
build-local:
	npm run build

# Run locally
run-local:
	npm start

