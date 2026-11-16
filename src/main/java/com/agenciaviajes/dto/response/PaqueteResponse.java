package com.agenciaviajes.dto.response;

import com.agenciaviajes.entity.enums.EstadoPaquete;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaqueteResponse {

    private Long id;
    private Long destinoId;
    private String destinoCiudad;
    private String destinoPais;
    private String titulo;
    private String descripcion;
    private BigDecimal precioBase;
    private Integer duracionDias;
    private EstadoPaquete estado;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String imagenUrl;
    private List<ExcursionResponse> excursiones;
}
