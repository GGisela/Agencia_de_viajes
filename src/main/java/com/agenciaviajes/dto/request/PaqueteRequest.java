package com.agenciaviajes.dto.request;

import com.agenciaviajes.entity.enums.EstadoPaquete;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaqueteRequest {

    @NotNull(message = "El id del destino es obligatorio")
    private Long destinoId;

    @NotBlank(message = "El título del paquete es obligatorio")
    private String titulo;

    private String descripcion;

    @NotNull(message = "El precio base es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio base debe ser mayor a 0")
    private BigDecimal precioBase;

    @NotNull(message = "La duración en días es obligatoria")
    private Integer duracionDias;

    private EstadoPaquete estado;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String imagenUrl;
    private Set<Long> excursionesIds;
}
