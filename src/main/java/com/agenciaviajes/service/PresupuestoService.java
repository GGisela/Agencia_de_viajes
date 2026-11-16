package com.agenciaviajes.service;

import com.agenciaviajes.dto.request.ActualizarEstadoPresupuestoRequest;
import com.agenciaviajes.dto.request.PresupuestoRequest;
import com.agenciaviajes.dto.response.PresupuestoResponse;
import com.agenciaviajes.entity.enums.EstadoPresupuesto;

import java.util.List;

public interface PresupuestoService {

    PresupuestoResponse crearPresupuesto(PresupuestoRequest request);

    List<PresupuestoResponse> listarTodos();

    List<PresupuestoResponse> listarPorEstado(EstadoPresupuesto estado);

    List<PresupuestoResponse> listarPorCliente(Long clienteId);

    PresupuestoResponse obtenerPorId(Long id);

    PresupuestoResponse actualizarEstado(Long id, ActualizarEstadoPresupuestoRequest request);
}
