package com.agenciaviajes.repository;

import com.agenciaviajes.entity.Paquete;
import com.agenciaviajes.entity.enums.EstadoPaquete;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaqueteRepository extends JpaRepository<Paquete, Long> {

    List<Paquete> findByEstado(EstadoPaquete estado);

    List<Paquete> findByDestinoId(Long destinoId);

    List<Paquete> findByDestinoIdAndEstado(Long destinoId, EstadoPaquete estado);
}
