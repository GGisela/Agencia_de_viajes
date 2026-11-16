package com.agenciaviajes.service;

import com.agenciaviajes.dto.request.PresupuestoDetalleRequest;
import com.agenciaviajes.dto.request.PresupuestoRequest;
import com.agenciaviajes.dto.response.PresupuestoResponse;
import com.agenciaviajes.entity.Destino;
import com.agenciaviajes.entity.Paquete;
import com.agenciaviajes.entity.Usuario;
import com.agenciaviajes.entity.enums.EstadoPaquete;
import com.agenciaviajes.entity.enums.RolUsuario;
import com.agenciaviajes.repository.DestinoRepository;
import com.agenciaviajes.repository.PaqueteRepository;
import com.agenciaviajes.repository.UsuarioRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class PresupuestoServiceTest {

    @Autowired
    private PresupuestoService presupuestoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private DestinoRepository destinoRepository;

    @Autowired
    private PaqueteRepository paqueteRepository;

    @Test
    @DisplayName("Debe crear una cotización exitosamente y calcular el precio total estimado")
    void testCrearPresupuestoExitoso() {
        // Given
        Usuario cliente = usuarioRepository.save(Usuario.builder()
                .nombre("Carlos")
                .apellido("Gómez")
                .email("carlos.test@example.com")
                .passwordHash("123456")
                .telefono("+54911000000")
                .rol(RolUsuario.CLIENTE)
                .build());

        Destino destino = destinoRepository.save(Destino.builder()
                .nombreCiudad("Mendoza")
                .pais("Argentina")
                .build());

        Paquete paquete = paqueteRepository.save(Paquete.builder()
                .destino(destino)
                .titulo("Caminos del Vino")
                .precioBase(BigDecimal.valueOf(300.00))
                .duracionDias(4)
                .estado(EstadoPaquete.ACTIVO)
                .build());

        PresupuestoDetalleRequest detalle = PresupuestoDetalleRequest.builder()
                .paqueteId(paquete.getId())
                .cantidadPersonas(2)
                .build();

        PresupuestoRequest request = PresupuestoRequest.builder()
                .clienteId(cliente.getId())
                .comentariosCliente("Quisiera hotel cerca del centro")
                .detalles(List.of(detalle))
                .build();

        // When
        PresupuestoResponse response = presupuestoService.crearPresupuesto(request);

        // Then
        assertNotNull(response);
        assertNotNull(response.getId());
        assertEquals("Carlos", response.getClienteNombre());
        assertEquals(1, response.getDetalles().size());
        assertEquals(0, BigDecimal.valueOf(600.00).compareTo(response.getPrecioTotalEstimado()));
    }
}
