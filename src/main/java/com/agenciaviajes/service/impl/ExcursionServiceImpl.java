package com.agenciaviajes.service.impl;

import com.agenciaviajes.dto.request.ExcursionRequest;
import com.agenciaviajes.dto.response.ExcursionResponse;
import com.agenciaviajes.entity.Destino;
import com.agenciaviajes.entity.Excursion;
import com.agenciaviajes.exception.ResourceNotFoundException;
import com.agenciaviajes.repository.DestinoRepository;
import com.agenciaviajes.repository.ExcursionRepository;
import com.agenciaviajes.service.ExcursionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExcursionServiceImpl implements ExcursionService {

    private final ExcursionRepository excursionRepository;
    private final DestinoRepository destinoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ExcursionResponse> listarTodas() {
        return excursionRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExcursionResponse> listarPorDestino(Long destinoId) {
        return excursionRepository.findByDestinoId(destinoId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ExcursionResponse obtenerPorId(Long id) {
        Excursion excursion = excursionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Excursion", "id", id));
        return mapToResponse(excursion);
    }

    @Override
    @Transactional
    public ExcursionResponse crear(ExcursionRequest request) {
        Destino destino = destinoRepository.findById(request.getDestinoId())
                .orElseThrow(() -> new ResourceNotFoundException("Destino", "id", request.getDestinoId()));

        Excursion excursion = Excursion.builder()
                .destino(destino)
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .precio(request.getPrecio())
                .duracionHoras(request.getDuracionHoras())
                .imagenUrl(request.getImagenUrl())
                .build();

        return mapToResponse(excursionRepository.save(excursion));
    }

    @Override
    @Transactional
    public ExcursionResponse actualizar(Long id, ExcursionRequest request) {
        Excursion excursion = excursionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Excursion", "id", id));

        if (!excursion.getDestino().getId().equals(request.getDestinoId())) {
            Destino nuevoDestino = destinoRepository.findById(request.getDestinoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Destino", "id", request.getDestinoId()));
            excursion.setDestino(nuevoDestino);
        }

        excursion.setNombre(request.getNombre());
        excursion.setDescripcion(request.getDescripcion());
        excursion.setPrecio(request.getPrecio());
        excursion.setDuracionHoras(request.getDuracionHoras());
        excursion.setImagenUrl(request.getImagenUrl());

        return mapToResponse(excursionRepository.save(excursion));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!excursionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Excursion", "id", id);
        }
        excursionRepository.deleteById(id);
    }

    public ExcursionResponse mapToResponse(Excursion excursion) {
        return ExcursionResponse.builder()
                .id(excursion.getId())
                .destinoId(excursion.getDestino().getId())
                .destinoCiudad(excursion.getDestino().getNombreCiudad())
                .destinoPais(excursion.getDestino().getPais())
                .nombre(excursion.getNombre())
                .descripcion(excursion.getDescripcion())
                .precio(excursion.getPrecio())
                .duracionHoras(excursion.getDuracionHoras())
                .imagenUrl(excursion.getImagenUrl())
                .build();
    }
}
