package com.agenciaviajes.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PresupuestoDetalleResponse {

    private Long id;
    private Long paqueteId;
    private String paqueteTitulo;
    private Long excursionId;
    private String excursionNombre;
    private Integer cantidadPersonas;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
}
