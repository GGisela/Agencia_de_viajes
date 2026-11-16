package com.agenciaviajes.dto.request;

import com.agenciaviajes.entity.enums.EstadoPresupuesto;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarEstadoPresupuestoRequest {

    @NotNull(message = "El nuevo estado es obligatorio")
    private EstadoPresupuesto nuevoEstado;

    private String notasSeguimiento;
}
