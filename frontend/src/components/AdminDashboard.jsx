import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Clock, CheckCircle, AlertTriangle, User, Mail, Phone, 
  Calendar, RefreshCw, Plus, Edit2, Trash2, MapPin, Package, 
  Compass, ExternalLink, X, Image as ImageIcon, DollarSign, Database
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard() {
  const [activeSubTab, setActiveSubTab] = useState('destinos'); // 'destinos' | 'paquetes' | 'excursiones' | 'cotizaciones' | 'api'
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Data states
  const [destinos, setDestinos] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [excursiones, setExcursiones] = useState([]);
  const [presupuestos, setPresupuestos] = useState([]);

  // Presupuestos filter
  const [filterEstado, setFilterEstado] = useState('TODOS');
  const [updatingId, setUpdatingId] = useState(null);

  // Modal / Form state
  const [modalType, setModalType] = useState(null); // 'destino' | 'paquete' | 'excursion' | null
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [destData, pkgData, excData, presData] = await Promise.all([
        api.getDestinos(),
        api.getTodosPaquetes ? api.getTodosPaquetes() : api.getPaquetes(),
        api.getExcursiones(),
        api.getPresupuestos()
      ]);
      setDestinos(destData || []);
      setPaquetes(pkgData || []);
      setExcursiones(excData || []);
      setPresupuestos(presData || []);
    } catch (err) {
      console.error('Error al cargar datos administrativos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // ================= MODAL HANDLERS =================
  const openCreateModal = (type) => {
    setModalType(type);
    setEditingItem(null);
    if (type === 'destino') {
      setFormData({
        nombreCiudad: '',
        pais: '',
        region: '',
        descripcion: '',
        imagenUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
      });
    } else if (type === 'paquete') {
      setFormData({
        destinoId: destinos.length > 0 ? destinos[0].id : '',
        titulo: '',
        descripcion: '',
        precioBase: 499.0,
        duracionDias: 5,
        estado: 'ACTIVO',
        imagenUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'
      });
    } else if (type === 'excursion') {
      setFormData({
        destinoId: destinos.length > 0 ? destinos[0].id : '',
        nombre: '',
        descripcion: '',
        precio: 50.0,
        duracionHoras: 4,
        imagenUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800'
      });
    }
  };

  const openEditModal = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setFormData({ ...item });
  };

  const closeModal = () => {
    setModalType(null);
    setEditingItem(null);
    setFormData({});
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (modalType === 'destino') {
        if (editingItem) {
          await api.actualizarDestino(editingItem.id, formData);
          showToast(`Destino "${formData.nombreCiudad}" actualizado exitosamente.`);
        } else {
          await api.crearDestino(formData);
          showToast(`Destino "${formData.nombreCiudad}" creado exitosamente.`);
        }
      } else if (modalType === 'paquete') {
        const payload = {
          ...formData,
          destinoId: Number(formData.destinoId),
          precioBase: Number(formData.precioBase),
          duracionDias: Number(formData.duracionDias)
        };
        if (editingItem) {
          await api.actualizarPaquete(editingItem.id, payload);
          showToast(`Paquete "${formData.titulo}" actualizado.`);
        } else {
          await api.crearPaquete(payload);
          showToast(`Paquete "${formData.titulo}" creado exitosamente.`);
        }
      } else if (modalType === 'excursion') {
        const payload = {
          ...formData,
          destinoId: Number(formData.destinoId),
          precio: Number(formData.precio),
          duracionHoras: Number(formData.duracionHoras)
        };
        if (editingItem) {
          await api.actualizarExcursion(editingItem.id, payload);
          showToast(`Excursión "${formData.nombre}" actualizada.`);
        } else {
          await api.crearExcursion(payload);
          showToast(`Excursión "${formData.nombre}" creada.`);
        }
      }
      closeModal();
      await loadAllData();
    } catch (err) {
      alert('Error en la operación: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE HANDLERS =================
  const handleDeleteDestino = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar el destino "${nombre}"? Esta acción borrará también sus asociaciones.`)) return;
    try {
      await api.eliminarDestino(id);
      showToast(`Destino #${id} eliminado.`);
      loadAllData();
    } catch (err) {
      alert('Error al eliminar destino: ' + err.message);
    }
  };

  const handleDeletePaquete = async (id, titulo) => {
    if (!window.confirm(`¿Estás seguro de eliminar el paquete "${titulo}"?`)) return;
    try {
      await api.eliminarPaquete(id);
      showToast(`Paquete #${id} eliminado.`);
      loadAllData();
    } catch (err) {
      alert('Error al eliminar paquete: ' + err.message);
    }
  };

  const handleDeleteExcursion = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar la excursión "${nombre}"?`)) return;
    try {
      await api.eliminarExcursion(id);
      showToast(`Excursión #${id} eliminada.`);
      loadAllData();
    } catch (err) {
      alert('Error al eliminar excursión: ' + err.message);
    }
  };

  // Presupuesto status
  const handleStatusChange = async (id, nuevoEstado) => {
    setUpdatingId(id);
    try {
      await api.actualizarEstadoPresupuesto(id, nuevoEstado);
      setPresupuestos(prev => 
        prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p)
      );
      showToast(`Estado de cotización #${id} cambiado a ${nuevoEstado}`);
    } catch (err) {
      alert('Error al actualizar el estado: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Metrics
  const totalCotizaciones = presupuestos.length;
  const pendientes = presupuestos.filter(p => p.estado === 'PENDIENTE').length;
  const enNegociacion = presupuestos.filter(p => p.estado === 'EN_NEGOCIACION' || p.estado === 'CONTACTADO').length;
  const concretados = presupuestos.filter(p => p.estado === 'CONCRETADO').length;

  const filteredPresupuestos = filterEstado === 'TODOS' 
    ? presupuestos 
    : presupuestos.filter(p => p.estado === filterEstado);

  return (
    <div className="admin-dashboard-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast animate-fade">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Admin Header */}
      <div className="admin-header glass-panel">
        <div className="admin-header-left">
          <div className="badge badge-warning">
            <ShieldCheck size={16} />
            <span>Panel de Gestión y Administración de la Agencia</span>
          </div>
          <h2>Control Central & CRUD de Servicios</h2>
          <p>Crea, edita y elimina Destinos, Paquetes Turísticos, Excursiones y gestiona las Cotizaciones de los clientes.</p>
        </div>

        <div className="admin-header-actions">
          <button className="btn-refresh" onClick={loadAllData} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Actualizar Datos</span>
          </button>
          <a 
            href="http://localhost:8080/swagger-ui.html" 
            target="_blank" 
            rel="noreferrer" 
            className="btn-api-swagger"
            title="Abrir Swagger OpenAPI"
          >
            <ExternalLink size={16} />
            <span>Swagger API</span>
          </a>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="admin-tabs-nav">
        <button 
          className={`admin-tab-btn ${activeSubTab === 'destinos' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('destinos')}
        >
          <MapPin size={18} />
          <span>Destinos ({destinos.length})</span>
        </button>

        <button 
          className={`admin-tab-btn ${activeSubTab === 'paquetes' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('paquetes')}
        >
          <Package size={18} />
          <span>Paquetes Turísticos ({paquetes.length})</span>
        </button>

        <button 
          className={`admin-tab-btn ${activeSubTab === 'excursiones' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('excursiones')}
        >
          <Compass size={18} />
          <span>Excursiones ({excursiones.length})</span>
        </button>

        <button 
          className={`admin-tab-btn ${activeSubTab === 'cotizaciones' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('cotizaciones')}
        >
          <Clock size={18} />
          <span>Cotizaciones & Leads ({totalCotizaciones})</span>
        </button>

        <button 
          className={`admin-tab-btn ${activeSubTab === 'api' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('api')}
        >
          <Database size={18} />
          <span>Consola & DB</span>
        </button>
      </div>

      {/* ================= TAB 1: DESTINOS (CRUD) ================= */}
      {activeSubTab === 'destinos' && (
        <div className="admin-crud-section animate-fade">
          <div className="crud-toolbar">
            <div>
              <h3>Gestión de Destinos Turísticos</h3>
              <p>Ciudades, países y puntos de interés disponibles en la plataforma.</p>
            </div>
            <button className="btn-primary-action" onClick={() => openCreateModal('destino')}>
              <Plus size={18} />
              <span>Nuevo Destino</span>
            </button>
          </div>

          <div className="crud-grid">
            {destinos.map(d => (
              <div key={d.id} className="crud-card glass-panel">
                <div className="crud-card-img" style={{ backgroundImage: `url(${d.imagenUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'})` }}>
                  <span className="card-id-tag">ID: #{d.id}</span>
                </div>
                <div className="crud-card-body">
                  <h4>{d.nombreCiudad}</h4>
                  <div className="card-location-tag">
                    <MapPin size={14} />
                    <span>{d.pais} {d.region ? `• ${d.region}` : ''}</span>
                  </div>
                  <p className="crud-desc">{d.descripcion || 'Sin descripción detallada.'}</p>
                  
                  <div className="crud-card-actions">
                    <button className="btn-action-edit" onClick={() => openEditModal('destino', d)}>
                      <Edit2 size={15} />
                      <span>Editar</span>
                    </button>
                    <button className="btn-action-delete" onClick={() => handleDeleteDestino(d.id, d.nombreCiudad)}>
                      <Trash2 size={15} />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: PAQUETES (CRUD) ================= */}
      {activeSubTab === 'paquetes' && (
        <div className="admin-crud-section animate-fade">
          <div className="crud-toolbar">
            <div>
              <h3>Gestión de Paquetes Turísticos</h3>
              <p>Configura ofertas de viaje, precios base, duración en días y estados de disponibilidad.</p>
            </div>
            <button className="btn-primary-action" onClick={() => openCreateModal('paquete')}>
              <Plus size={18} />
              <span>Nuevo Paquete</span>
            </button>
          </div>

          <div className="quotes-table-container glass-panel">
            <table className="quotes-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Paquete</th>
                  <th>Destino</th>
                  <th>Precio Base</th>
                  <th>Duración</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paquetes.map(p => (
                  <tr key={p.id} className="quote-row">
                    <td><span className="quote-id-pill">#{p.id}</span></td>
                    <td>
                      <div className="item-cell-with-img">
                        <img 
                          src={p.imagenUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'} 
                          alt={p.titulo} 
                          className="thumb-table"
                        />
                        <div>
                          <strong>{p.titulo}</strong>
                          <p className="table-subtext">{p.descripcion?.substring(0, 60)}...</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">{p.destinoCiudad || 'Destino ID ' + p.destinoId}</span>
                    </td>
                    <td>
                      <strong className="text-price">${p.precioBase?.toLocaleString()} USD</strong>
                    </td>
                    <td>{p.duracionDias} días</td>
                    <td>
                      <span className={`status-badge status-${p.estado ? p.estado.toLowerCase() : 'activo'}`}>
                        {p.estado || 'ACTIVO'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions-cell">
                        <button className="btn-action-edit" onClick={() => openEditModal('paquete', p)}>
                          <Edit2 size={15} />
                        </button>
                        <button className="btn-action-delete" onClick={() => handleDeletePaquete(p.id, p.titulo)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: EXCURSIONES (CRUD) ================= */}
      {activeSubTab === 'excursiones' && (
        <div className="admin-crud-section animate-fade">
          <div className="crud-toolbar">
            <div>
              <h3>Gestión de Excursiones y Actividades</h3>
              <p>Tours guiados, navegaciones y pases especiales con precios individuales.</p>
            </div>
            <button className="btn-primary-action" onClick={() => openCreateModal('excursion')}>
              <Plus size={18} />
              <span>Nueva Excursión</span>
            </button>
          </div>

          <div className="quotes-table-container glass-panel">
            <table className="quotes-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Excursión</th>
                  <th>Destino</th>
                  <th>Precio USD</th>
                  <th>Duración</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {excursiones.map(e => (
                  <tr key={e.id} className="quote-row">
                    <td><span className="quote-id-pill">#{e.id}</span></td>
                    <td>
                      <div className="item-cell-with-img">
                        <img 
                          src={e.imagenUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800'} 
                          alt={e.nombre} 
                          className="thumb-table"
                        />
                        <div>
                          <strong>{e.nombre}</strong>
                          <p className="table-subtext">{e.descripcion?.substring(0, 50)}...</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">{e.destinoCiudad || 'Destino ID ' + e.destinoId}</span>
                    </td>
                    <td>
                      <strong className="text-price">${e.precio?.toLocaleString()} USD</strong>
                    </td>
                    <td>{e.duracionHoras ? `${e.duracionHoras} hrs` : 'N/A'}</td>
                    <td>
                      <div className="table-actions-cell">
                        <button className="btn-action-edit" onClick={() => openEditModal('excursion', e)}>
                          <Edit2 size={15} />
                        </button>
                        <button className="btn-action-delete" onClick={() => handleDeleteExcursion(e.id, e.nombre)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 4: COTIZACIONES & LEADS ================= */}
      {activeSubTab === 'cotizaciones' && (
        <div className="admin-crud-section animate-fade">
          {/* Metrics Cards */}
          <div className="metrics-grid">
            <div className="metric-card glass-panel">
              <div className="metric-header">
                <span>Total Recibidas</span>
                <ShieldCheck size={20} className="metric-icon" />
              </div>
              <span className="metric-value">{totalCotizaciones}</span>
            </div>

            <div className="metric-card glass-panel border-warning">
              <div className="metric-header">
                <span>Pendientes</span>
                <Clock size={20} className="metric-icon text-warning" />
              </div>
              <span className="metric-value text-warning">{pendientes}</span>
            </div>

            <div className="metric-card glass-panel border-info">
              <div className="metric-header">
                <span>En Negociación</span>
                <AlertTriangle size={20} className="metric-icon text-info" />
              </div>
              <span className="metric-value text-info">{enNegociacion}</span>
            </div>

            <div className="metric-card glass-panel border-success">
              <div className="metric-header">
                <span>Concretadas</span>
                <CheckCircle size={20} className="metric-icon text-success" />
              </div>
              <span className="metric-value text-success">{concretados}</span>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="status-filter-tabs" style={{ marginBottom: '1.5rem' }}>
            {['TODOS', 'PENDIENTE', 'CONTACTADO', 'EN_NEGOCIACION', 'CONCRETADO', 'CERRADO'].map(st => (
              <button 
                key={st}
                className={`tab-btn ${filterEstado === st ? 'active' : ''}`}
                onClick={() => setFilterEstado(st)}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Table */}
          {filteredPresupuestos.length === 0 ? (
            <div className="empty-state glass-panel">
              <Clock size={36} className="empty-icon" />
              <h3>No hay cotizaciones registradas en este estado</h3>
            </div>
          ) : (
            <div className="quotes-table-container glass-panel">
              <table className="quotes-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Contacto</th>
                    <th>Servicios Solicitados</th>
                    <th>Total Estimado</th>
                    <th>Estado Actual</th>
                    <th>Cambiar Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPresupuestos.map(p => (
                    <tr key={p.id} className="quote-row">
                      <td><span className="quote-id-pill">#{p.id}</span></td>
                      <td>
                        <div className="client-cell">
                          <User size={16} className="cell-icon" />
                          <strong>{p.clienteNombre} {p.clienteApellido}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="contact-cell">
                          <div className="contact-line">
                            <Mail size={14} />
                            <span>{p.clienteEmail}</span>
                          </div>
                          {p.clienteTelefono && (
                            <div className="contact-line">
                              <Phone size={14} />
                              <span>{p.clienteTelefono}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="services-cell">
                          {p.detalles && p.detalles.map((d, idx) => (
                            <div key={idx} className="service-chip">
                              {d.paqueteTitulo && <span>📦 {d.paqueteTitulo} ({d.cantidadPersonas} pax)</span>}
                              {d.excursionNombre && <span>🏔️ {d.excursionNombre} ({d.cantidadPersonas} pax)</span>}
                            </div>
                          ))}
                          {p.comentariosCliente && (
                            <p className="client-notes">"{p.comentariosCliente}"</p>
                          )}
                        </div>
                      </td>
                      <td>
                        <strong className="text-price">
                          ${p.precioTotalEstimado ? p.precioTotalEstimado.toLocaleString() : '0'} USD
                        </strong>
                      </td>
                      <td>
                        <span className={`status-badge status-${p.estado?.toLowerCase()}`}>
                          {p.estado}
                        </span>
                      </td>
                      <td>
                        <select 
                          className="status-select"
                          value={p.estado}
                          disabled={updatingId === p.id}
                          onChange={(e) => handleStatusChange(p.id, e.target.value)}
                        >
                          <option value="PENDIENTE">PENDIENTE</option>
                          <option value="CONTACTADO">CONTACTADO</option>
                          <option value="EN_NEGOCIACION">EN_NEGOCIACION</option>
                          <option value="CONCRETADO">CONCRETADO</option>
                          <option value="CERRADO">CERRADO</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 5: API & DEV CONSOLE ================= */}
      {activeSubTab === 'api' && (
        <div className="admin-crud-section animate-fade">
          <div className="crud-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            <div className="crud-card glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <div className="brand-icon-wrapper" style={{ width: '40px', height: '40px' }}>
                  <Database size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>Swagger OpenAPI 3</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Documentación Interactiva</span>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Inspecciona y prueba directamente todos los endpoints REST del backend de Spring Boot: Destinos, Paquetes, Excursiones, Usuarios y Presupuestos con OpenAPI 3.
              </p>
              <a 
                href="http://localhost:8080/swagger-ui.html" 
                target="_blank" 
                rel="noreferrer" 
                className="btn-primary-action"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <ExternalLink size={16} />
                <span>Abrir Swagger UI</span>
              </a>
            </div>

            <div className="crud-card glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <div className="brand-icon-wrapper" style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>H2 In-Memory Database</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Consola SQL en Vivo</span>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Accede a la consola de base de datos SQL H2 para consultar tablas, relaciones y registros almacenados.
                <br/><strong style={{ color: '#ffffff' }}>JDBC URL:</strong> <code>jdbc:h2:mem:agenciadb</code>
              </p>
              <a 
                href="http://localhost:8080/h2-console" 
                target="_blank" 
                rel="noreferrer" 
                className="btn-primary-action"
                style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
              >
                <ExternalLink size={16} />
                <span>Abrir Consola H2</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL DE CREACIÓN / EDICIÓN ================= */}
      {modalType && (
        <div className="admin-modal-overlay animate-fade">
          <div className="admin-modal-content glass-panel">
            <div className="modal-header">
              <h3>
                {editingItem ? 'Editar ' : 'Nuevo '}
                {modalType === 'destino' && 'Destino'}
                {modalType === 'paquete' && 'Paquete Turístico'}
                {modalType === 'excursion' && 'Excursión'}
              </h3>
              <button className="modal-close-btn" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-form">
              {/* Formulario DESTINO */}
              {modalType === 'destino' && (
                <>
                  <div className="form-group">
                    <label>Nombre de la Ciudad *</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.nombreCiudad || ''}
                      onChange={e => setFormData({ ...formData, nombreCiudad: e.target.value })}
                      placeholder="Ej: Ushuaia"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>País *</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.pais || ''}
                        onChange={e => setFormData({ ...formData, pais: e.target.value })}
                        placeholder="Ej: Argentina"
                      />
                    </div>
                    <div className="form-group">
                      <label>Región</label>
                      <input 
                        type="text" 
                        value={formData.region || ''}
                        onChange={e => setFormData({ ...formData, region: e.target.value })}
                        placeholder="Ej: Tierra del Fuego"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>URL de Imagen</label>
                    <input 
                      type="url" 
                      value={formData.imagenUrl || ''}
                      onChange={e => setFormData({ ...formData, imagenUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Descripción del Destino</label>
                    <textarea 
                      rows={3}
                      value={formData.descripcion || ''}
                      onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                      placeholder="Puntos clave, atractivos y clima..."
                    />
                  </div>
                </>
              )}

              {/* Formulario PAQUETE */}
              {modalType === 'paquete' && (
                <>
                  <div className="form-group">
                    <label>Destino Asociado *</label>
                    <select 
                      required
                      value={formData.destinoId || ''}
                      onChange={e => setFormData({ ...formData, destinoId: e.target.value })}
                    >
                      {destinos.map(d => (
                        <option key={d.id} value={d.id}>{d.nombreCiudad} ({d.pais})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Título del Paquete *</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.titulo || ''}
                      onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                      placeholder="Ej: Fin del Mundo Aventura (6 Días)"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Precio Base (USD) *</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        required 
                        value={formData.precioBase || ''}
                        onChange={e => setFormData({ ...formData, precioBase: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Duración (Días) *</label>
                      <input 
                        type="number" 
                        min="1" 
                        required 
                        value={formData.duracionDias || ''}
                        onChange={e => setFormData({ ...formData, duracionDias: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Estado</label>
                      <select 
                        value={formData.estado || 'ACTIVO'}
                        onChange={e => setFormData({ ...formData, estado: e.target.value })}
                      >
                        <option value="ACTIVO">ACTIVO</option>
                        <option value="PAUSADO">PAUSADO</option>
                        <option value="AGOTADO">AGOTADO</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>URL de Imagen</label>
                    <input 
                      type="url" 
                      value={formData.imagenUrl || ''}
                      onChange={e => setFormData({ ...formData, imagenUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Descripción del Paquete</label>
                    <textarea 
                      rows={3}
                      value={formData.descripcion || ''}
                      onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                      placeholder="Detalles del itinerario, hotelería y servicios..."
                    />
                  </div>
                </>
              )}

              {/* Formulario EXCURSIÓN */}
              {modalType === 'excursion' && (
                <>
                  <div className="form-group">
                    <label>Destino Asociado *</label>
                    <select 
                      required
                      value={formData.destinoId || ''}
                      onChange={e => setFormData({ ...formData, destinoId: e.target.value })}
                    >
                      {destinos.map(d => (
                        <option key={d.id} value={d.id}>{d.nombreCiudad} ({d.pais})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Nombre de la Excursión *</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.nombre || ''}
                      onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Ej: Navegación Canal Beagle y Faro Les Eclaireurs"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Precio (USD) *</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        required 
                        value={formData.precio || ''}
                        onChange={e => setFormData({ ...formData, precio: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Duración (Horas)</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={formData.duracionHoras || ''}
                        onChange={e => setFormData({ ...formData, duracionHoras: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>URL de Imagen</label>
                    <input 
                      type="url" 
                      value={formData.imagenUrl || ''}
                      onChange={e => setFormData({ ...formData, imagenUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea 
                      rows={3}
                      value={formData.descripcion || ''}
                      onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                      placeholder="Recorrido, equipamiento incluido y recomendaciones..."
                    />
                  </div>
                </>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-modal-cancel" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary-action" disabled={loading}>
                  {editingItem ? 'Guardar Cambios' : 'Crear Registro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
