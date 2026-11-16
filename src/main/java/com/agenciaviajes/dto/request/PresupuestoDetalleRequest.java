package com.agenciaviajes.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PresupuestoDetalleRequest {

    private Long paqueteId;

    private Long excursionId;

    @NotNull(message = "La cantidad de personas es obligatoria")
    @Min(value = 1, message = "Debe ser al menos 1 persona")
    private Integer cantidadPersonas;
}
