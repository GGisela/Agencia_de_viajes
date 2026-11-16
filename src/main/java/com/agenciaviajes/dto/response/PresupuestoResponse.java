package com.agenciaviajes.dto.response;

import com.agenciaviajes.entity.enums.EstadoPresupuesto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PresupuestoResponse {

    private Long id;
    private Long clienteId;
    private String clienteNombre;
    private String clienteApellido;
    private String clienteEmail;
    private String clienteTelefono;
    private LocalDateTime fechaSolicitud;
    private EstadoPresupuesto estado;
    private String comentariosCliente;
    private BigDecimal precioTotalEstimado;
    private List<PresupuestoDetalleResponse> detalles;
}
