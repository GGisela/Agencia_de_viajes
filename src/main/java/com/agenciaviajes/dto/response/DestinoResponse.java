package com.agenciaviajes.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DestinoResponse {

    private Long id;
    private String nombreCiudad;
    private String pais;
    private String region;
    private String descripcion;
    private String imagenUrl;
}
