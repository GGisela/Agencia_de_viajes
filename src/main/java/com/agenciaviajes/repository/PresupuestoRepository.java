package com.agenciaviajes.repository;

import com.agenciaviajes.entity.Presupuesto;
import com.agenciaviajes.entity.enums.EstadoPresupuesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PresupuestoRepository extends JpaRepository<Presupuesto, Long> {

    List<Presupuesto> findByClienteId(Long clienteId);

    List<Presupuesto> findByEstado(EstadoPresupuesto estado);

    List<Presupuesto> findAllByOrderByFechaSolicitudDesc();
}
