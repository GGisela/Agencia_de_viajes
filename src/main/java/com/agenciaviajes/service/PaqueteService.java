package com.agenciaviajes.service;

import com.agenciaviajes.dto.request.PaqueteRequest;
import com.agenciaviajes.dto.response.PaqueteResponse;

import java.util.List;

public interface PaqueteService {

    List<PaqueteResponse> listarTodos();

    List<PaqueteResponse> listarActivos();

    List<PaqueteResponse> listarPorDestino(Long destinoId);

    PaqueteResponse obtenerPorId(Long id);

    PaqueteResponse crear(PaqueteRequest request);

    PaqueteResponse actualizar(Long id, PaqueteRequest request);

    void eliminar(Long id);
}
