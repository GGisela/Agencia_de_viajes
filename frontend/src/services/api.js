// Cliente API para comunicarse con el Backend de Spring Boot (CRUD completo y Presupuestos)

const API_BASE = '/api/v1';

export const api = {
  // ================= DESTINOS =================
  async getDestinos() {
    try {
      const res = await fetch(`${API_BASE}/destinos`);
      if (!res.ok) throw new Error('Error al obtener destinos');
      return await res.json();
    } catch (err) {
      console.warn('Usando fallback local para destinos:', err);
      return [
        { id: 1, nombreCiudad: 'San Carlos de Bariloche', pais: 'Argentina', region: 'Patagonia', descripcion: 'Lagos y montañas andinas', imagenUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800' },
        { id: 2, nombreCiudad: 'Cancún', pais: 'México', region: 'Riviera Maya', descripcion: 'Playas caribeñas y ruinas mayas', imagenUrl: 'https://images.unsplash.com/photo-1510414842594-a61752d5ab5a?w=800' },
        { id: 3, nombreCiudad: 'Río de Janeiro', pais: 'Brasil', region: 'Sudeste', descripcion: 'Playas, samba y Cristo Redentor', imagenUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800' }
      ];
    }
  },

  async crearDestino(data) {
    const res = await fetch(`${API_BASE}/destinos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al crear destino');
    }
    return await res.json();
  },

  async actualizarDestino(id, data) {
    const res = await fetch(`${API_BASE}/destinos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al actualizar destino');
    }
    return await res.json();
  },

  async eliminarDestino(id) {
    const res = await fetch(`${API_BASE}/destinos/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar destino');
    return true;
  },

  // ================= PAQUETES =================
  async getPaquetes() {
    try {
      const res = await fetch(`${API_BASE}/paquetes/activos`);
      if (!res.ok) throw new Error('Error al obtener paquetes activos');
      return await res.json();
    } catch (err) {
      console.warn('Fallback de paquetes activos:', err);
      return [];
    }
  },

  async getTodosPaquetes() {
    try {
      const res = await fetch(`${API_BASE}/paquetes`);
      if (!res.ok) throw new Error('Error al listar todos los paquetes');
      return await res.json();
    } catch (err) {
      console.warn('Fallback al obtener todos los paquetes:', err);
      return this.getPaquetes();
    }
  },

  async crearPaquete(data) {
    const res = await fetch(`${API_BASE}/paquetes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al crear paquete');
    }
    return await res.json();
  },

  async actualizarPaquete(id, data) {
    const res = await fetch(`${API_BASE}/paquetes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al actualizar paquete');
    }
    return await res.json();
  },

  async eliminarPaquete(id) {
    const res = await fetch(`${API_BASE}/paquetes/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar paquete');
    return true;
  },

  // ================= EXCURSIONES =================
  async getExcursiones() {
    try {
      const res = await fetch(`${API_BASE}/excursiones`);
      if (!res.ok) throw new Error('Error al obtener excursiones');
      return await res.json();
    } catch (err) {
      console.warn('Fallback de excursiones:', err);
      return [];
    }
  },

  async crearExcursion(data) {
    const res = await fetch(`${API_BASE}/excursiones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al crear excursión');
    }
    return await res.json();
  },

  async actualizarExcursion(id, data) {
    const res = await fetch(`${API_BASE}/excursiones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al actualizar excursión');
    }
    return await res.json();
  },

  async eliminarExcursion(id) {
    const res = await fetch(`${API_BASE}/excursiones/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar excursión');
    return true;
  },

  // ================= PRESUPUESTOS =================
  async crearPresupuesto(data) {
    const res = await fetch(`${API_BASE}/presupuestos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al enviar la solicitud de cotización');
    }
    return await res.json();
  },

  async getPresupuestos(estado = null) {
    try {
      const url = estado ? `${API_BASE}/presupuestos?estado=${estado}` : `${API_BASE}/presupuestos`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al obtener presupuestos');
      return await res.json();
    } catch (err) {
      console.warn('Backend offline, usando presupuestos de prueba:', err);
      return [];
    }
  },

  async actualizarEstadoPresupuesto(id, nuevoEstado, notasSeguimiento = '') {
    const res = await fetch(`${API_BASE}/presupuestos/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nuevoEstado, notasSeguimiento })
    });
    if (!res.ok) throw new Error('Error al actualizar estado');
    return await res.json();
  }
};
