package com.agenciaviajes.service.impl;

import com.agenciaviajes.entity.Presupuesto;
import com.agenciaviajes.entity.PresupuestoDetalle;
import com.agenciaviajes.entity.Usuario;
import com.agenciaviajes.service.EmailNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailNotificationServiceImpl implements EmailNotificationService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:gomezgisela70@gmail.com}")
    private String senderEmail;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${app.admin.email:gomezgisela70@gmail.com}")
    private String adminEmail;

    @Value("${app.frontend.admin-url:http://localhost:3000}")
    private String adminDashboardUrl;

    @Async
    @Override
    public void notificarCliente(Presupuesto presupuesto) {
        Usuario cliente = presupuesto.getCliente();
        String destinatario = cliente.getEmail();
        String asunto = "¡Hemos recibido tu solicitud de cotización! - Referencia #" + presupuesto.getId();

        StringBuilder cuerpo = new StringBuilder();
        cuerpo.append("Hola ").append(cliente.getNombre()).append(",\n\n");
        cuerpo.append("Muchas gracias por ponerte en contacto con nuestra Agencia de Viajes.\n");
        cuerpo.append("Hemos recibido exitosamente tu solicitud de cotización con número de referencia #")
                .append(presupuesto.getId()).append(".\n\n");
        cuerpo.append("Resumen de los servicios solicitados:\n");

        for (PresupuestoDetalle detalle : presupuesto.getDetalles()) {
            if (detalle.getPaquete() != null) {
                cuerpo.append(" - [Paquete] ").append(detalle.getPaquete().getTitulo())
                        .append(" (").append(detalle.getCantidadPersonas()).append(" personas)\n");
            }
            if (detalle.getExcursion() != null) {
                cuerpo.append(" - [Excursión] ").append(detalle.getExcursion().getNombre())
                        .append(" (").append(detalle.getCantidadPersonas()).append(" personas)\n");
            }
        }

        if (presupuesto.getComentariosCliente() != null && !presupuesto.getComentariosCliente().isBlank()) {
            cuerpo.append("\nTus comentarios: ").append(presupuesto.getComentariosCliente()).append("\n");
        }

        cuerpo.append("\nUn agente de viajes dedicado está revisando tu itinerario para ofrecerte la mejor tarifa personalizada y opciones de financiación.");
        cuerpo.append("\nNos comunicaremos contigo a la brevedad.\n\n");
        cuerpo.append("Saludos cordiales,\nEquipo de Agencia de Viajes.");

        enviarCorreo(destinatario, asunto, cuerpo.toString());
    }

    @Async
    @Override
    public void notificarAgente(Presupuesto presupuesto) {
        Usuario cliente = presupuesto.getCliente();
        String destinatario = adminEmail;
        String asunto = "¡NUEVO LEAD DE VIAJE! - Cotización #" + presupuesto.getId();

        StringBuilder cuerpo = new StringBuilder();
        cuerpo.append("ALERTA DE NUEVA SOLICITUD DE COTIZACIÓN\n");
        cuerpo.append("=========================================\n\n");
        cuerpo.append("Datos del Cliente:\n");
        cuerpo.append(" - Nombre: ").append(cliente.getNombre()).append(" ").append(cliente.getApellido()).append("\n");
        cuerpo.append(" - Email: ").append(cliente.getEmail()).append("\n");
        cuerpo.append(" - Teléfono: ").append(cliente.getTelefono() != null ? cliente.getTelefono() : "No especificado").append("\n\n");

        cuerpo.append("Desglose del Presupuesto (Precios Base):\n");
        for (PresupuestoDetalle detalle : presupuesto.getDetalles()) {
            if (detalle.getPaquete() != null) {
                cuerpo.append(" - [Paquete] ").append(detalle.getPaquete().getTitulo())
                        .append(" | Destino: ").append(detalle.getPaquete().getDestino().getNombreCiudad())
                        .append(" | Pasajeros: ").append(detalle.getCantidadPersonas())
                        .append(" | Precio Base Unitario: $").append(detalle.getPrecioUnitario())
                        .append(" | Subtotal: $").append(detalle.getSubtotal()).append("\n");
            }
            if (detalle.getExcursion() != null) {
                cuerpo.append(" - [Excursión] ").append(detalle.getExcursion().getNombre())
                        .append(" | Pasajeros: ").append(detalle.getCantidadPersonas())
                        .append(" | Precio Unitario: $").append(detalle.getPrecioUnitario())
                        .append(" | Subtotal: $").append(detalle.getSubtotal()).append("\n");
            }
        }

        cuerpo.append("\nPrecio Total Estimado: $").append(presupuesto.getPrecioTotalEstimado()).append(" USD\n");

        if (presupuesto.getComentariosCliente() != null && !presupuesto.getComentariosCliente().isBlank()) {
            cuerpo.append("Comentarios del cliente: ").append(presupuesto.getComentariosCliente()).append("\n");
        }

        cuerpo.append("\nEnlace para gestionar propuesta: ").append(adminDashboardUrl).append(" (Panel Agente)\n");

        enviarCorreo(destinatario, asunto, cuerpo.toString());
    }

    private void enviarCorreo(String destinatario, String asunto, String texto) {
        // Si no se configuró contraseña SMTP real, se simula y registra inmediatamente sin demoras
        if (mailPassword == null || mailPassword.isBlank() || mailPassword.equals("secret")) {
            log.info("\n======================================================\n" +
                     "[SIMULACIÓN DE ENVÍO DE EMAIL]\n" +
                     "Para: {}\n" +
                     "De: {}\n" +
                     "Asunto: {}\n" +
                     "Contenido:\n{}\n" +
                     "======================================================", 
                     destinatario, senderEmail, asunto, texto);
            return;
        }

        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setFrom(senderEmail);
            mensaje.setTo(destinatario);
            mensaje.setSubject(asunto);
            mensaje.setText(texto);
            mailSender.send(mensaje);
            log.info(" Correo despachado exitosamente vía SMTP a: {}", destinatario);
        } catch (Exception e) {
            log.warn(" No se pudo despachar el correo SMTP a {}: {}", destinatario, e.getMessage());
            log.info("\n======================================================\n" +
                     "[LOG LOCAL DE CORREO - FALLBACK]\n" +
                     "Para: {}\n" +
                     "Asunto: {}\n" +
                     "Contenido:\n{}\n" +
                     "======================================================", 
                     destinatario, asunto, texto);
        }
    }
}
