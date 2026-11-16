package com.agenciaviajes.repository;

import com.agenciaviajes.entity.PresupuestoDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PresupuestoDetalleRepository extends JpaRepository<PresupuestoDetalle, Long> {

    List<PresupuestoDetalle> findByPresupuestoId(Long presupuestoId);
}
