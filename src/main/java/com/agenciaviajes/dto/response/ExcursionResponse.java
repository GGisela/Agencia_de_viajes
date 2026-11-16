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
public class ExcursionResponse {

    private Long id;
    private Long destinoId;
    private String destinoCiudad;
    private String destinoPais;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer duracionHoras;
    private String imagenUrl;
}
