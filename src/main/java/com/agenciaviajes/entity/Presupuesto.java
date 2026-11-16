package com.agenciaviajes.entity;

import com.agenciaviajes.entity.enums.EstadoPresupuesto;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "presupuestos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Presupuesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", nullable = false)
    @NotNull(message = "El cliente es obligatorio")
    private Usuario cliente;

    @Column(name = "fecha_solicitud", nullable = false, updatable = false)
    private LocalDateTime fechaSolicitud;

    @NotNull(message = "El estado del presupuesto es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private EstadoPresupuesto estado = EstadoPresupuesto.PENDIENTE;

    @Column(name = "comentarios_cliente", columnDefinition = "TEXT")
    private String comentariosCliente;

    @Column(name = "precio_total_estimado", precision = 12, scale = 2)
    private BigDecimal precioTotalEstimado;

    @OneToMany(mappedBy = "presupuesto", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    @Builder.Default
    private List<PresupuestoDetalle> detalles = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (this.fechaSolicitud == null) {
            this.fechaSolicitud = LocalDateTime.now();
        }
        if (this.estado == null) {
            this.estado = EstadoPresupuesto.PENDIENTE;
        }
    }

    public void addDetalle(PresupuestoDetalle detalle) {
        detalles.add(detalle);
        detalle.setPresupuesto(this);
    }

    public void removeDetalle(PresupuestoDetalle detalle) {
        detalles.remove(detalle);
        detalle.setPresupuesto(null);
    }

    public void recalcularTotal() {
        this.precioTotalEstimado = detalles.stream()
                .map(d -> {
                    if (d.getSubtotal() != null) return d.getSubtotal();
                    if (d.getPrecioUnitario() != null && d.getCantidadPersonas() != null) {
                        return d.getPrecioUnitario().multiply(BigDecimal.valueOf(d.getCantidadPersonas()));
                    }
                    return BigDecimal.ZERO;
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
