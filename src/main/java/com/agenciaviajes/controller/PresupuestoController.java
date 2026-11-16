package com.agenciaviajes.controller;

import com.agenciaviajes.dto.request.ActualizarEstadoPresupuestoRequest;
import com.agenciaviajes.dto.request.PresupuestoRequest;
import com.agenciaviajes.dto.response.PresupuestoResponse;
import com.agenciaviajes.entity.enums.EstadoPresupuesto;
import com.agenciaviajes.service.PresupuestoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/presupuestos")
@RequiredArgsConstructor
@Tag(name = "Presupuestos / Cotizaciones", description = "Cotizador interactivo y gestión de presupuestos de viaje")
public class PresupuestoController {

    private final PresupuestoService presupuestoService;

    @PostMapping
    @Operation(summary = "Solicitar cotización / presupuesto (Portal Cliente)", description = "Registra la cotización solicitada y dispara notificaciones automáticas por correo electrónico al cliente y al agente.")
    public ResponseEntity<PresupuestoResponse> solicitarCotizacion(@Valid @RequestBody PresupuestoRequest request) {
        return new ResponseEntity<>(presupuestoService.crearPresupuesto(request), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Listar presupuestos con opción de filtro por estado (Panel de Administración)")
    public ResponseEntity<List<PresupuestoResponse>> listarPresupuestos(
            @RequestParam(required = false) EstadoPresupuesto estado) {
        if (estado != null) {
            return ResponseEntity.ok(presupuestoService.listarPorEstado(estado));
        }
        return ResponseEntity.ok(presupuestoService.listarTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener el desglose completo de un presupuesto por su ID")
    public ResponseEntity<PresupuestoResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(presupuestoService.obtenerPorId(id));
    }

    @GetMapping("/cliente/{clienteId}")
    @Operation(summary = "Listar presupuestos solicitados por un cliente específico")
    public ResponseEntity<List<PresupuestoResponse>> listarPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(presupuestoService.listarPorCliente(clienteId));
    }

    @PatchMapping("/{id}/estado")
    @Operation(summary = "Actualizar estado de una cotización (Ej: EN_NEGOCIACION, CONCRETADO, CERRADO)")
    public ResponseEntity<PresupuestoResponse> actualizarEstado(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarEstadoPresupuestoRequest request) {
        return ResponseEntity.ok(presupuestoService.actualizarEstado(id, request));
    }
}
