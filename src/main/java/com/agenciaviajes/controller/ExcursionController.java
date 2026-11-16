package com.agenciaviajes.controller;

import com.agenciaviajes.dto.request.ExcursionRequest;
import com.agenciaviajes.dto.response.ExcursionResponse;
import com.agenciaviajes.service.ExcursionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/excursiones")
@RequiredArgsConstructor
@Tag(name = "Excursiones", description = "Gestión de excursiones y actividades turísticas")
public class ExcursionController {

    private final ExcursionService excursionService;

    @GetMapping
    @Operation(summary = "Listar todas las excursiones disponibles")
    public ResponseEntity<List<ExcursionResponse>> listarTodas() {
        return ResponseEntity.ok(excursionService.listarTodas());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener excursión por su ID")
    public ResponseEntity<ExcursionResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(excursionService.obtenerPorId(id));
    }

    @GetMapping("/destino/{destinoId}")
    @Operation(summary = "Listar excursiones filtradas por ID de destino")
    public ResponseEntity<List<ExcursionResponse>> listarPorDestino(@PathVariable Long destinoId) {
        return ResponseEntity.ok(excursionService.listarPorDestino(destinoId));
    }

    @PostMapping
    @Operation(summary = "Crear nueva excursión (Admin/Agente)")
    public ResponseEntity<ExcursionResponse> crear(@Valid @RequestBody ExcursionRequest request) {
        return new ResponseEntity<>(excursionService.crear(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar excursión existente (Admin/Agente)")
    public ResponseEntity<ExcursionResponse> actualizar(@PathVariable Long id, @Valid @RequestBody ExcursionRequest request) {
        return ResponseEntity.ok(excursionService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar excursión por ID (Admin)")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        excursionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
