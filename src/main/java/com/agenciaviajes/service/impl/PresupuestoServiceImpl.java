package com.agenciaviajes.service.impl;

import com.agenciaviajes.dto.request.ActualizarEstadoPresupuestoRequest;
import com.agenciaviajes.dto.request.PresupuestoDetalleRequest;
import com.agenciaviajes.dto.request.PresupuestoRequest;
import com.agenciaviajes.dto.response.PresupuestoDetalleResponse;
import com.agenciaviajes.dto.response.PresupuestoResponse;
import com.agenciaviajes.entity.*;
import com.agenciaviajes.entity.enums.EstadoPresupuesto;
import com.agenciaviajes.entity.enums.RolUsuario;
import com.agenciaviajes.exception.BadRequestException;
import com.agenciaviajes.exception.ResourceNotFoundException;
import com.agenciaviajes.repository.ExcursionRepository;
import com.agenciaviajes.repository.PaqueteRepository;
import com.agenciaviajes.repository.PresupuestoRepository;
import com.agenciaviajes.repository.UsuarioRepository;
import com.agenciaviajes.service.EmailNotificationService;
import com.agenciaviajes.service.PresupuestoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PresupuestoServiceImpl implements PresupuestoService {

    private final PresupuestoRepository presupuestoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PaqueteRepository paqueteRepository;
    private final ExcursionRepository excursionRepository;
    private final EmailNotificationService emailNotificationService;

    @Override
    @Transactional
    public PresupuestoResponse crearPresupuesto(PresupuestoRequest request) {
        Usuario cliente = resolverCliente(request);

        Presupuesto presupuesto = Presupuesto.builder()
                .cliente(cliente)
                .estado(EstadoPresupuesto.PENDIENTE)
                .comentariosCliente(request.getComentariosCliente())
                .precioTotalEstimado(BigDecimal.ZERO)
                .build();

        if (request.getDetalles() == null || request.getDetalles().isEmpty()) {
            throw new BadRequestException("Debe seleccionar al menos un paquete o excursión");
        }

        for (PresupuestoDetalleRequest detalleReq : request.getDetalles()) {
            if (detalleReq.getPaqueteId() == null && detalleReq.getExcursionId() == null) {
                throw new BadRequestException("Cada ítem del presupuesto debe tener un paquete o una excursión");
            }

            Paquete paquete = null;
            Excursion excursion = null;
            BigDecimal precioUnitario = BigDecimal.ZERO;

            if (detalleReq.getPaqueteId() != null) {
                paquete = paqueteRepository.findById(detalleReq.getPaqueteId())
                        .orElseThrow(() -> new ResourceNotFoundException("Paquete", "id", detalleReq.getPaqueteId()));
                precioUnitario = paquete.getPrecioBase();
            } else if (detalleReq.getExcursionId() != null) {
                excursion = excursionRepository.findById(detalleReq.getExcursionId())
                        .orElseThrow(() -> new ResourceNotFoundException("Excursion", "id", detalleReq.getExcursionId()));
                precioUnitario = excursion.getPrecio();
            }

            int pax = detalleReq.getCantidadPersonas() != null ? detalleReq.getCantidadPersonas() : 1;
            BigDecimal subtotal = precioUnitario.multiply(BigDecimal.valueOf(pax));

            PresupuestoDetalle detalle = PresupuestoDetalle.builder()
                    .paquete(paquete)
                    .excursion(excursion)
                    .cantidadPersonas(pax)
                    .precioUnitario(precioUnitario)
                    .subtotal(subtotal)
                    .build();

            presupuesto.addDetalle(detalle);
        }

        presupuesto.recalcularTotal();
        Presupuesto guardado = presupuestoRepository.save(presupuesto);

        // Disparar las notificaciones por email según el flujo de negocio (Fase 4 y 5)
        emailNotificationService.notificarCliente(guardado);
        emailNotificationService.notificarAgente(guardado);

        return mapToResponse(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PresupuestoResponse> listarTodos() {
        return presupuestoRepository.findAllByOrderByFechaSolicitudDesc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PresupuestoResponse> listarPorEstado(EstadoPresupuesto estado) {
        return presupuestoRepository.findByEstado(estado).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PresupuestoResponse> listarPorCliente(Long clienteId) {
        return presupuestoRepository.findByClienteId(clienteId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PresupuestoResponse obtenerPorId(Long id) {
        Presupuesto presupuesto = presupuestoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Presupuesto", "id", id));
        return mapToResponse(presupuesto);
    }

    @Override
    @Transactional
    public PresupuestoResponse actualizarEstado(Long id, ActualizarEstadoPresupuestoRequest request) {
        Presupuesto presupuesto = presupuestoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Presupuesto", "id", id));

        presupuesto.setEstado(request.getNuevoEstado());
        if (request.getNotasSeguimiento() != null && !request.getNotasSeguimiento().isBlank()) {
            String notasActuales = presupuesto.getComentariosCliente() != null ? presupuesto.getComentariosCliente() + "\n" : "";
            presupuesto.setComentariosCliente(notasActuales + "[Nota Agente]: " + request.getNotasSeguimiento());
        }

        return mapToResponse(presupuestoRepository.save(presupuesto));
    }

    private Usuario resolverCliente(PresupuestoRequest request) {
        if (request.getClienteId() != null) {
            return usuarioRepository.findById(request.getClienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", request.getClienteId()));
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            return usuarioRepository.findByEmail(request.getEmail())
                    .orElseGet(() -> {
                        Usuario nuevo = Usuario.builder()
                                .nombre(request.getNombre() != null ? request.getNombre() : "Cliente")
                                .apellido(request.getApellido() != null ? request.getApellido() : "Cotización")
                                .email(request.getEmail())
                                .telefono(request.getTelefono())
                                .passwordHash("guest_" + System.currentTimeMillis())
                                .rol(RolUsuario.CLIENTE)
                                .build();
                        return usuarioRepository.save(nuevo);
                    });
        }

        throw new BadRequestException("Debe proporcionar un clienteId o datos de contacto (email, nombre)");
    }

    private PresupuestoResponse mapToResponse(Presupuesto presupuesto) {
        List<PresupuestoDetalleResponse> detallesDto = presupuesto.getDetalles().stream()
                .map(d -> PresupuestoDetalleResponse.builder()
                        .id(d.getId())
                        .paqueteId(d.getPaquete() != null ? d.getPaquete().getId() : null)
                        .paqueteTitulo(d.getPaquete() != null ? d.getPaquete().getTitulo() : null)
                        .excursionId(d.getExcursion() != null ? d.getExcursion().getId() : null)
                        .excursionNombre(d.getExcursion() != null ? d.getExcursion().getNombre() : null)
                        .cantidadPersonas(d.getCantidadPersonas())
                        .precioUnitario(d.getPrecioUnitario())
                        .subtotal(d.getSubtotal())
                        .build())
                .toList();

        return PresupuestoResponse.builder()
                .id(presupuesto.getId())
                .clienteId(presupuesto.getCliente().getId())
                .clienteNombre(presupuesto.getCliente().getNombre())
                .clienteApellido(presupuesto.getCliente().getApellido())
                .clienteEmail(presupuesto.getCliente().getEmail())
                .clienteTelefono(presupuesto.getCliente().getTelefono())
                .fechaSolicitud(presupuesto.getFechaSolicitud())
                .estado(presupuesto.getEstado())
                .comentariosCliente(presupuesto.getComentariosCliente())
                .precioTotalEstimado(presupuesto.getPrecioTotalEstimado())
                .detalles(detallesDto)
                .build();
    }
}
