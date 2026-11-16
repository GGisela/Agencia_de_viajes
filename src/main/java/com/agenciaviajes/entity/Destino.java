package com.agenciaviajes.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "destinos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Destino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre de la ciudad es obligatorio")
    @Column(name = "nombre_ciudad", nullable = false, length = 120)
    private String nombreCiudad;

    @NotBlank(message = "El país es obligatorio")
    @Column(nullable = false, length = 100)
    private String pais;

    @Column(length = 100)
    private String region;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;
}
