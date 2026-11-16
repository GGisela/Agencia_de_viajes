# ✈️ Plataforma Web para Agencia de Viajes con IA y Sistema de Cotizaciones

Backend desarrollado en **Java 21** con **Spring Boot 3.4.2**, siguiendo una arquitectura en capas desacoplada y escalable (Controller - Service - Repository - Entity/DTO).

---

## 🛠️ Tecnologías Utilizadas

- **Java 21 (LTS)**: Eclipse Adoptium OpenJDK 21.
- **Spring Boot 3.4.2**:
  - `spring-boot-starter-web`: API RESTful.
  - `spring-boot-starter-data-jpa`: Persistencia y ORM con Hibernate.
  - `spring-boot-starter-validation`: Validaciones de entrada (`@Valid`, `@NotBlank`, etc.).
  - `spring-boot-starter-mail`: Notificaciones automáticas por correo electrónico para cotizaciones.
- **Bases de Datos**:
  - **H2 Database (In-Memory)**: Perfil `dev` para desarrollo rápido sin dependencias externas.
  - **PostgreSQL**: Perfil `prod` listo para integración con `pgvector` y búsqueda semántica (Spring AI).
- **Lombok**: Reducción de código repetitivo (Getters, Setters, Builders, Constructores).
- **SpringDoc OpenAPI 3 / Swagger**: Documentación interactiva de todos los endpoints.
- **Maven Wrapper (`mvnw`)**: Gestión de dependencias portable y reproducible.

---

## 📂 Arquitectura en Capas

```
src/main/java/com/agenciaviajes/
├── config/                  # Configuraciones (CORS, Swagger/OpenAPI, DataInitializer)
├── controller/              # Capa de presentación REST (Endpoints HTTP)
│   ├── UsuarioController.java
│   ├── DestinoController.java
│   ├── ExcursionController.java
│   ├── PaqueteController.java
│   └── PresupuestoController.java
├── dto/                     # Objetos de Transferencia de Datos
│   ├── request/             # DTOs de entrada validados
│   └── response/            # DTOs de salida enriquecidos
├── entity/                  # Modelos de dominio JPA (Tablas relacionales)
│   ├── Usuario.java
│   ├── Destino.java
│   ├── Excursion.java
│   ├── Paquete.java
│   ├── Presupuesto.java
│   ├── PresupuestoDetalle.java
│   ├── DocumentoIA.java     # Base vectorial para Fase 5 (RAG)
│   └── enums/               # RolUsuario, EstadoPaquete, EstadoPresupuesto
├── exception/               # Manejo global de excepciones (@RestControllerAdvice)
├── repository/              # Acceso a datos con Spring Data JPA
└── service/                 # Lógica de negocio y transacciones
    ├── UsuarioService.java
    ├── DestinoService.java
    ├── ExcursionService.java
    ├── PaqueteService.java
    ├── PresupuestoService.java
    ├── EmailNotificationService.java
    └── impl/                # Implementaciones de servicios
```

---

## 🗄️ Modelo Entidad-Relación (MER)

1. **`usuarios`**: Gestión de clientes, agentes y administradores.
2. **`destinos`**: Catálogo geográfico (ciudad, país, región, imágenes).
3. **`excursiones`**: Actividades y tours asignados a destinos.
4. **`paquetes`**: Paquetes turísticos completos con duración, fechas y precio base.
5. **`paquete_excursion`**: Tabla intermedia N:M entre paquetes y excursiones.
6. **`presupuestos`**: Registro de solicitudes de cotización generadas por los usuarios.
7. **`presupuesto_detalles`**: Desglose de paquetes, excursiones y pasajeros por presupuesto.
8. **`documentos_ia`**: Almacén preparado para embeddings y chunks de texto (RAG con Spring AI).

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Iniciar el Backend (Spring Boot 3 + Java 21)

```powershell
.\mvnw.cmd spring-boot:run
```

El servidor REST iniciará en el puerto **8080**.

### 2. Iniciar el Frontend (React + Vite)

En otra terminal:

```powershell
cd frontend
npm run dev
```

La aplicación web estará disponible en: [http://localhost:3000](http://localhost:3000) (conectada mediante proxy al backend en el puerto 8080).

### 3. Acceso a Swagger UI (Documentación Interactiva)

Abre tu navegador en:
👉 [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

### 4. Consola H2 (Base de datos en memoria)

👉 [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- **JDBC URL**: `jdbc:h2:mem:agenciadb`
- **Usuario**: `sa`
- **Contraseña**: *(vacío)*

---

## 🧪 Datos de Prueba Iniciales (Semillero)

Al iniciar, `DataInitializer` carga automáticamente datos reales de prueba:
- **Destinos**: San Carlos de Bariloche (Argentina), Cancún (México), Río de Janeiro (Brasil).
- **Excursiones**: Circuito Chico, Navegación Isla Victoria, Chichén Itzá, Cristo Redentor.
- **Paquetes**: Paquetes completos listos para cotizar.
- **Usuarios**:
  - `admin@agenciadeviajes.com` (Rol ADMIN)
  - `laura.agente@agenciadeviajes.com` (Rol AGENTE)
  - `juan.perez@example.com` (Rol CLIENTE)

---

## 🔄 Flujo de Cotizaciones (Sección 5 de la Documentación)

1. **El cliente** arma su paquete o excursión y envía una solicitud a `POST /api/v1/presupuestos`.
2. **El sistema**:
   - Calcula el total estimado y almacena el registro en estado `PENDIENTE`.
   - Envía correo de confirmación al cliente con el resumen sin precios finales.
   - Envía alerta de lead al agente de viajes con desglose de precios y enlace directo al panel.
3. **El agente** gestiona el presupuesto con `PATCH /api/v1/presupuestos/{id}/estado` (`EN_NEGOCIACION`, `CONCRETADO`, `CERRADO`).
