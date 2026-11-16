package com.agenciaviajes.service;

import com.agenciaviajes.dto.request.ExcursionRequest;
import com.agenciaviajes.dto.response.ExcursionResponse;

import java.util.List;

public interface ExcursionService {

    List<ExcursionResponse> listarTodas();

    List<ExcursionResponse> listarPorDestino(Long destinoId);

    ExcursionResponse obtenerPorId(Long id);

    ExcursionResponse crear(ExcursionRequest request);

    ExcursionResponse actualizar(Long id, ExcursionRequest request);

    void eliminar(Long id);
}
