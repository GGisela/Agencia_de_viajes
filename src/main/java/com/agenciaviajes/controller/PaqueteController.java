package com.agenciaviajes.controller;

import com.agenciaviajes.dto.request.PaqueteRequest;
import com.agenciaviajes.dto.response.PaqueteResponse;
import com.agenciaviajes.service.PaqueteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/paquetes")
@RequiredArgsConstructor
@Tag(name = "Paquetes", description = "Catálogo y gestión de paquetes turísticos")
public class PaqueteController {

    private final PaqueteService paqueteService;

    @GetMapping
    @Operation(summary = "Listar todos los paquetes (Admin/Agente)")
    public ResponseEntity<List<PaqueteResponse>> listarTodos() {
        return ResponseEntity.ok(paqueteService.listarTodos());
    }

    @GetMapping("/activos")
    @Operation(summary = "Listar solo paquetes activos y vigentes (Público / Portal Cliente)")
    public ResponseEntity<List<PaqueteResponse>> listarActivos() {
        return ResponseEntity.ok(paqueteService.listarActivos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener paquete por ID con sus excursiones incluidas")
    public ResponseEntity<PaqueteResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(paqueteService.obtenerPorId(id));
    }

    @GetMapping("/destino/{destinoId}")
    @Operation(summary = "Listar paquetes filtrados por destino")
    public ResponseEntity<List<PaqueteResponse>> listarPorDestino(@PathVariable Long destinoId) {
        return ResponseEntity.ok(paqueteService.listarPorDestino(destinoId));
    }

    @PostMapping
    @Operation(summary = "Crear nuevo paquete turístico (Admin/Agente)")
    public ResponseEntity<PaqueteResponse> crear(@Valid @RequestBody PaqueteRequest request) {
        return new ResponseEntity<>(paqueteService.crear(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar paquete turístico (Admin/Agente)")
    public ResponseEntity<PaqueteResponse> actualizar(@PathVariable Long id, @Valid @RequestBody PaqueteRequest request) {
        return ResponseEntity.ok(paqueteService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar paquete turístico (Admin)")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        paqueteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
