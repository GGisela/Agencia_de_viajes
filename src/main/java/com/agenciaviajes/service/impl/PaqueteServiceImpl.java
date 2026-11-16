package com.agenciaviajes.service.impl;

import com.agenciaviajes.dto.request.PaqueteRequest;
import com.agenciaviajes.dto.response.ExcursionResponse;
import com.agenciaviajes.dto.response.PaqueteResponse;
import com.agenciaviajes.entity.Destino;
import com.agenciaviajes.entity.Excursion;
import com.agenciaviajes.entity.Paquete;
import com.agenciaviajes.entity.enums.EstadoPaquete;
import com.agenciaviajes.exception.ResourceNotFoundException;
import com.agenciaviajes.repository.DestinoRepository;
import com.agenciaviajes.repository.ExcursionRepository;
import com.agenciaviajes.repository.PaqueteRepository;
import com.agenciaviajes.service.PaqueteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PaqueteServiceImpl implements PaqueteService {

    private final PaqueteRepository paqueteRepository;
    private final DestinoRepository destinoRepository;
    private final ExcursionRepository excursionRepository;
    private final ExcursionServiceImpl excursionService;

    @Override
    @Transactional(readOnly = true)
    public List<PaqueteResponse> listarTodos() {
        return paqueteRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaqueteResponse> listarActivos() {
        return paqueteRepository.findByEstado(EstadoPaquete.ACTIVO).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaqueteResponse> listarPorDestino(Long destinoId) {
        return paqueteRepository.findByDestinoIdAndEstado(destinoId, EstadoPaquete.ACTIVO).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PaqueteResponse obtenerPorId(Long id) {
        Paquete paquete = paqueteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paquete", "id", id));
        return mapToResponse(paquete);
    }

    @Override
    @Transactional
    public PaqueteResponse crear(PaqueteRequest request) {
        Destino destino = destinoRepository.findById(request.getDestinoId())
                .orElseThrow(() -> new ResourceNotFoundException("Destino", "id", request.getDestinoId()));

        Set<Excursion> excursiones = new HashSet<>();
        if (request.getExcursionesIds() != null && !request.getExcursionesIds().isEmpty()) {
            excursiones.addAll(excursionRepository.findAllById(request.getExcursionesIds()));
        }

        Paquete paquete = Paquete.builder()
                .destino(destino)
                .titulo(request.getTitulo())
                .descripcion(request.getDescripcion())
                .precioBase(request.getPrecioBase())
                .duracionDias(request.getDuracionDias())
                .estado(request.getEstado() != null ? request.getEstado() : EstadoPaquete.ACTIVO)
                .fechaInicio(request.getFechaInicio())
                .fechaFin(request.getFechaFin())
                .imagenUrl(request.getImagenUrl())
                .excursiones(excursiones)
                .build();

        return mapToResponse(paqueteRepository.save(paquete));
    }

    @Override
    @Transactional
    public PaqueteResponse actualizar(Long id, PaqueteRequest request) {
        Paquete paquete = paqueteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paquete", "id", id));

        if (!paquete.getDestino().getId().equals(request.getDestinoId())) {
            Destino nuevoDestino = destinoRepository.findById(request.getDestinoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Destino", "id", request.getDestinoId()));
            paquete.setDestino(nuevoDestino);
        }

        paquete.setTitulo(request.getTitulo());
        paquete.setDescripcion(request.getDescripcion());
        paquete.setPrecioBase(request.getPrecioBase());
        paquete.setDuracionDias(request.getDuracionDias());
        if (request.getEstado() != null) {
            paquete.setEstado(request.getEstado());
        }
        paquete.setFechaInicio(request.getFechaInicio());
        paquete.setFechaFin(request.getFechaFin());
        paquete.setImagenUrl(request.getImagenUrl());

        if (request.getExcursionesIds() != null) {
            Set<Excursion> nuevasExcursiones = new HashSet<>(excursionRepository.findAllById(request.getExcursionesIds()));
            paquete.setExcursiones(nuevasExcursiones);
        }

        return mapToResponse(paqueteRepository.save(paquete));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!paqueteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Paquete", "id", id);
        }
        paqueteRepository.deleteById(id);
    }

    public PaqueteResponse mapToResponse(Paquete paquete) {
        List<ExcursionResponse> excursionesDto = paquete.getExcursiones().stream()
                .map(excursionService::mapToResponse)
                .toList();

        return PaqueteResponse.builder()
                .id(paquete.getId())
                .destinoId(paquete.getDestino().getId())
                .destinoCiudad(paquete.getDestino().getNombreCiudad())
                .destinoPais(paquete.getDestino().getPais())
                .titulo(paquete.getTitulo())
                .descripcion(paquete.getDescripcion())
                .precioBase(paquete.getPrecioBase())
                .duracionDias(paquete.getDuracionDias())
                .estado(paquete.getEstado())
                .fechaInicio(paquete.getFechaInicio())
                .fechaFin(paquete.getFechaFin())
                .imagenUrl(paquete.getImagenUrl())
                .excursiones(excursionesDto)
                .build();
    }
}
