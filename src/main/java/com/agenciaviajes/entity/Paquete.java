package com.agenciaviajes.entity;

import com.agenciaviajes.entity.enums.EstadoPaquete;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "paquetes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Paquete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "destino_id", nullable = false)
    @NotNull(message = "El destino es obligatorio")
    private Destino destino;

    @NotBlank(message = "El título del paquete es obligatorio")
    @Column(nullable = false, length = 180)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @NotNull(message = "El precio base es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio base debe ser mayor a 0")
    @Column(name = "precio_base", nullable = false, precision = 12, scale = 2)
    private BigDecimal precioBase;

    @NotNull(message = "La duración en días es obligatoria")
    @Column(name = "duracion_dias", nullable = false)
    private Integer duracionDias;

    @NotNull(message = "El estado es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private EstadoPaquete estado = EstadoPaquete.ACTIVO;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "paquete_excursion",
            joinColumns = @JoinColumn(name = "paquete_id"),
            inverseJoinColumns = @JoinColumn(name = "excursion_id")
    )
    @Builder.Default
    private Set<Excursion> excursiones = new HashSet<>();
}
