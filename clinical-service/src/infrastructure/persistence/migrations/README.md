# Migraciones de Base de Datos

Este directorio contiene las migraciones de base de datos para el servicio clínico.

## Ubicación en Arquitectura Hexagonal

Las migraciones pertenecen a la **capa de infraestructura**, específicamente a la persistencia, ya que:

- Son detalles de implementación de cómo se almacenan los datos
- No forman parte del dominio (que debe ser agnóstico de la base de datos)
- No forman parte de la lógica de aplicación
- Son específicas del ORM y la base de datos utilizada

```
src/
└── infrastructure/          # Capa de infraestructura
    └── persistence/        # Persistencia de datos
        ├── migrations/     # ← Migraciones aquí
        ├── repositories/   # Adaptadores de repositorio
        └── typeorm/        # Configuración de TypeORM
            ├── entities/   # Entidades de TypeORM
            └── typeorm.config.ts
```

## Comandos Disponibles

### Generar una nueva migración automáticamente
```bash
npm run migration:generate -- src/infrastructure/persistence/migrations/NombreMigracion
```

### Crear una migración vacía
```bash
npm run migration:create -- src/infrastructure/persistence/migrations/NombreMigracion
```

### Ejecutar migraciones pendientes
```bash
npm run migration:run
```

### Revertir la última migración
```bash
npm run migration:revert
```

### Ver el estado de las migraciones
```bash
npm run migration:show
```

## Convenciones

- Nombre de archivo: `TIMESTAMP-NombreDescriptivo.ts`
- Ejemplo: `1234567890-CreatePatientTable.ts`
- Las migraciones se ejecutan en orden cronológico según el timestamp

## Notas

- En **desarrollo**: Se puede usar `synchronize: true` para desarrollo rápido
- En **producción**: Siempre usar migraciones (`synchronize: false`)
- Las migraciones deben ser reversibles cuando sea posible
- Nunca modificar migraciones ya ejecutadas en producción

