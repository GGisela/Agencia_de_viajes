package com.agenciaviajes.service;

import com.agenciaviajes.dto.request.UsuarioRequest;
import com.agenciaviajes.dto.response.UsuarioResponse;

import java.util.List;

public interface UsuarioService {

    UsuarioResponse registrar(UsuarioRequest request);

    List<UsuarioResponse> listarTodos();

    UsuarioResponse obtenerPorId(Long id);

    UsuarioResponse obtenerPorEmail(String email);
}
