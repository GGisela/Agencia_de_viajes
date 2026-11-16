package com.agenciaviajes.controller;

import com.agenciaviajes.dto.request.DestinoRequest;
import com.agenciaviajes.dto.response.DestinoResponse;
import com.agenciaviajes.service.DestinoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/destinos")
@RequiredArgsConstructor
@Tag(name = "Destinos", description = "Gestión del catálogo geográfico y destinos turísticos")
public class DestinoController {

    private final DestinoService destinoService;

    @GetMapping
    @Operation(summary = "Listar todos los destinos turísticos")
    public ResponseEntity<List<DestinoResponse>> listarTodos() {
        return ResponseEntity.ok(destinoService.listarTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener destino por ID")
    public ResponseEntity<DestinoResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(destinoService.obtenerPorId(id));
    }

    @PostMapping
    @Operation(summary = "Crear nuevo destino (Admin/Agente)")
    public ResponseEntity<DestinoResponse> crear(@Valid @RequestBody DestinoRequest request) {
        return new ResponseEntity<>(destinoService.crear(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar destino existente (Admin/Agente)")
    public ResponseEntity<DestinoResponse> actualizar(@PathVariable Long id, @Valid @RequestBody DestinoRequest request) {
        return ResponseEntity.ok(destinoService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar destino por ID (Admin)")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        destinoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
