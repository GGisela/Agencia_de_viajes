package com.agenciaviajes.service.impl;

import com.agenciaviajes.dto.request.DestinoRequest;
import com.agenciaviajes.dto.response.DestinoResponse;
import com.agenciaviajes.entity.Destino;
import com.agenciaviajes.exception.ResourceNotFoundException;
import com.agenciaviajes.repository.DestinoRepository;
import com.agenciaviajes.service.DestinoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DestinoServiceImpl implements DestinoService {

    private final DestinoRepository destinoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DestinoResponse> listarTodos() {
        return destinoRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DestinoResponse obtenerPorId(Long id) {
        Destino destino = destinoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destino", "id", id));
        return mapToResponse(destino);
    }

    @Override
    @Transactional
    public DestinoResponse crear(DestinoRequest request) {
        Destino destino = Destino.builder()
                .nombreCiudad(request.getNombreCiudad())
                .pais(request.getPais())
                .region(request.getRegion())
                .descripcion(request.getDescripcion())
                .imagenUrl(request.getImagenUrl())
                .build();
        return mapToResponse(destinoRepository.save(destino));
    }

    @Override
    @Transactional
    public DestinoResponse actualizar(Long id, DestinoRequest request) {
        Destino destino = destinoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destino", "id", id));

        destino.setNombreCiudad(request.getNombreCiudad());
        destino.setPais(request.getPais());
        destino.setRegion(request.getRegion());
        destino.setDescripcion(request.getDescripcion());
        destino.setImagenUrl(request.getImagenUrl());

        return mapToResponse(destinoRepository.save(destino));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!destinoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Destino", "id", id);
        }
        destinoRepository.deleteById(id);
    }

    public DestinoResponse mapToResponse(Destino destino) {
        return DestinoResponse.builder()
                .id(destino.getId())
                .nombreCiudad(destino.getNombreCiudad())
                .pais(destino.getPais())
                .region(destino.getRegion())
                .descripcion(destino.getDescripcion())
                .imagenUrl(destino.getImagenUrl())
                .build();
    }
}
