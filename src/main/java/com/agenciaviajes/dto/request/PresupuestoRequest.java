package com.agenciaviajes.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PresupuestoRequest {

    // Si el usuario ya está autenticado
    private Long clienteId;

    // O datos de contacto directo si es un lead desde el cotizador web
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;

    private String comentariosCliente;

    @NotEmpty(message = "El presupuesto debe tener al menos un ítem (paquete o excursión)")
    @Valid
    private List<PresupuestoDetalleRequest> detalles;
}
