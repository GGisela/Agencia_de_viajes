package com.agenciaviajes.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DestinoRequest {

    @NotBlank(message = "El nombre de la ciudad es obligatorio")
    private String nombreCiudad;

    @NotBlank(message = "El país es obligatorio")
    private String pais;

    private String region;
    private String descripcion;
    private String imagenUrl;
}
