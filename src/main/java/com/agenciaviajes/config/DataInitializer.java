package com.agenciaviajes.config;

import com.agenciaviajes.entity.Destino;
import com.agenciaviajes.entity.Excursion;
import com.agenciaviajes.entity.Paquete;
import com.agenciaviajes.entity.Usuario;
import com.agenciaviajes.entity.enums.EstadoPaquete;
import com.agenciaviajes.entity.enums.RolUsuario;
import com.agenciaviajes.repository.DestinoRepository;
import com.agenciaviajes.repository.ExcursionRepository;
import com.agenciaviajes.repository.PaqueteRepository;
import com.agenciaviajes.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Component
@Slf4j
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final DestinoRepository destinoRepository;
    private final ExcursionRepository excursionRepository;
    private final PaqueteRepository paqueteRepository;

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 0) {
            log.info("Base de datos ya inicializada con datos previos.");
            return;
        }

        log.info("Cargando datos iniciales de prueba para la agencia de viajes...");

        // 1. Usuarios iniciales
        Usuario adminGisela = Usuario.builder()
                .nombre("Gisela")
                .apellido("Gómez")
                .email("gomezgisela70@gmail.com")
                .passwordHash("admin123")
                .telefono("+54 11 5555-0100")
                .rol(RolUsuario.ADMIN)
                .build();

        Usuario admin = Usuario.builder()
                .nombre("Administrador")
                .apellido("Principal")
                .email("admin@agenciadeviajes.com")
                .passwordHash("admin123")
                .telefono("+54 11 5555-0101")
                .rol(RolUsuario.ADMIN)
                .build();

        Usuario agente = Usuario.builder()
                .nombre("Laura")
                .apellido("Gómez")
                .email("laura.agente@agenciadeviajes.com")
                .passwordHash("agente123")
                .telefono("+54 11 5555-0102")
                .rol(RolUsuario.AGENTE)
                .build();

        Usuario cliente = Usuario.builder()
                .nombre("Juan")
                .apellido("Pérez")
                .email("juan.perez@example.com")
                .passwordHash("cliente123")
                .telefono("+54 9 11 4444-2222")
                .rol(RolUsuario.CLIENTE)
                .build();

        usuarioRepository.saveAll(Set.of(adminGisela, admin, agente, cliente));

        // 2. Destinos
        Destino bariloche = Destino.builder()
                .nombreCiudad("San Carlos de Bariloche")
                .pais("Argentina")
                .region("Patagonia")
                .descripcion("Paisajes andinos imponentes, lagos de aguas cristalinas, chocolaterías artesanales y pistas de esquí reconocidas mundialmente.")
                .imagenUrl("https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800")
                .build();

        Destino cancun = Destino.builder()
                .nombreCiudad("Cancún")
                .pais("México")
                .region("Riviera Maya")
                .descripcion("Playas de arena blanca, mar turquesa, fascinantes zonas arqueológicas mayas y una vibrante vida nocturna.")
                .imagenUrl("https://images.unsplash.com/photo-1510414842594-a61752d5ab5a?w=800")
                .build();

        Destino rio = Destino.builder()
                .nombreCiudad("Río de Janeiro")
                .pais("Brasil")
                .region("Sudeste")
                .descripcion("La ciudad maravillosa, famosa por sus playas de Copacabana e Ipanema, el Cristo Redentor y su inigualable cultura festiva.")
                .imagenUrl("https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800")
                .build();

        destinoRepository.saveAll(Set.of(bariloche, cancun, rio));

        // 3. Excursiones
        Excursion circuitoChico = Excursion.builder()
                .destino(bariloche)
                .nombre("Circuito Chico y Punto Panorámico")
                .descripcion("Recorrido clásico bordeando el Lago Nahuel Huapi, ascenso a la cumbre del cerro y vistas inolvidables.")
                .precio(BigDecimal.valueOf(45.00))
                .duracionHoras(4)
                .imagenUrl("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800")
                .build();

        Excursion islaVictoria = Excursion.builder()
                .destino(bariloche)
                .nombre("Navegación Isla Victoria y Bosque de Arrayanes")
                .descripcion("Catamarán por el Nahuel Huapi visitando el milenario bosque único en el mundo.")
                .precio(BigDecimal.valueOf(75.00))
                .duracionHoras(6)
                .imagenUrl("https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800")
                .build();

        Excursion chichenItza = Excursion.builder()
                .destino(cancun)
                .nombre("Chichén Itzá, Cenote Sagrado y Valladolid")
                .descripcion("Tour guiado por la maravilla del mundo moderno con baño refrescante en cenote natural y almuerzo típico yucateco.")
                .precio(BigDecimal.valueOf(95.00))
                .duracionHoras(10)
                .imagenUrl("https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800")
                .build();

        Excursion cristoRedentor = Excursion.builder()
                .destino(rio)
                .nombre("Cristo Redentor del Corcovado y Pan de Azúcar")
                .descripcion("Ascenso en tren por el bosque de Tijuca hasta el Cristo y teleférico al cerro Pan de Azúcar.")
                .precio(BigDecimal.valueOf(80.00))
                .duracionHoras(8)
                .imagenUrl("https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800")
                .build();

        excursionRepository.saveAll(Set.of(circuitoChico, islaVictoria, chichenItza, cristoRedentor));

        // 4. Paquetes turísticos
        Paquete paqueteBariloche = Paquete.builder()
                .destino(bariloche)
                .titulo("Bariloche Aventura & Chocolates (7 Días)")
                .descripcion("Descubre la magia de la Patagonia con hotelería céntrica, traslados in/out y las mejores excursiones lacustres y de montaña.")
                .precioBase(BigDecimal.valueOf(550.00))
                .duracionDias(7)
                .estado(EstadoPaquete.ACTIVO)
                .fechaInicio(LocalDate.now().plusWeeks(2))
                .fechaFin(LocalDate.now().plusWeeks(3))
                .imagenUrl("https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800")
                .excursiones(Set.of(circuitoChico, islaVictoria))
                .build();

        Paquete paqueteCancun = Paquete.builder()
                .destino(cancun)
                .titulo("Caribe Maya: Cancún All Inclusive (8 Días)")
                .descripcion("Descanso total frente al mar Caribe con acceso a excursiones culturales y parques temáticos.")
                .precioBase(BigDecimal.valueOf(990.00))
                .duracionDias(8)
                .estado(EstadoPaquete.ACTIVO)
                .fechaInicio(LocalDate.now().plusWeeks(3))
                .fechaFin(LocalDate.now().plusWeeks(4).plusDays(1))
                .imagenUrl("https://images.unsplash.com/photo-1510414842594-a61752d5ab5a?w=800")
                .excursiones(Set.of(chichenItza))
                .build();

        Paquete paqueteRio = Paquete.builder()
                .destino(rio)
                .titulo("Río de Janeiro Sensacional (5 Días)")
                .descripcion("Samba, playas y vistas panorámicas únicas con estancia en la zona de Ipanema.")
                .precioBase(BigDecimal.valueOf(480.00))
                .duracionDias(5)
                .estado(EstadoPaquete.ACTIVO)
                .fechaInicio(LocalDate.now().plusWeeks(4))
                .fechaFin(LocalDate.now().plusWeeks(4).plusDays(5))
                .imagenUrl("https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800")
                .excursiones(Set.of(cristoRedentor))
                .build();

        paqueteRepository.saveAll(Set.of(paqueteBariloche, paqueteCancun, paqueteRio));

        log.info("¡Datos de prueba inicializados con éxito!");
    }
}
