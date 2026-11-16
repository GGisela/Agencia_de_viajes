package com.agenciaviajes.service;

import com.agenciaviajes.dto.request.DestinoRequest;
import com.agenciaviajes.dto.response.DestinoResponse;

import java.util.List;

public interface DestinoService {

    List<DestinoResponse> listarTodos();

    DestinoResponse obtenerPorId(Long id);

    DestinoResponse crear(DestinoRequest request);

    DestinoResponse actualizar(Long id, DestinoRequest request);

    void eliminar(Long id);
}
