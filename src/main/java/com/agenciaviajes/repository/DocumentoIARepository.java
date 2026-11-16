package com.agenciaviajes.repository;

import com.agenciaviajes.entity.DocumentoIA;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentoIARepository extends JpaRepository<DocumentoIA, Long> {
}
