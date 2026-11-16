package com.agenciaviajes.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "excursiones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Excursion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "destino_id", nullable = false)
    @NotNull(message = "El destino es obligatorio")
    private Destino destino;

    @NotBlank(message = "El nombre de la excursión es obligatorio")
    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal precio;

    @Column(name = "duracion_horas")
    private Integer duracionHoras;

    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;
}
