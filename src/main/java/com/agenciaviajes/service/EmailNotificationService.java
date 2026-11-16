package com.agenciaviajes.service;

import com.agenciaviajes.entity.Presupuesto;

public interface EmailNotificationService {

    void notificarCliente(Presupuesto presupuesto);

    void notificarAgente(Presupuesto presupuesto);
}
