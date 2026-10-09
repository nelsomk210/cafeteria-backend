import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditarVenta({ venta, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    estudiante_id: venta.estudiante_id || '',
    producto_id: venta.producto_id || '',
    cantidad: venta.cantidad || 1,
    fecha: venta.fecha || ''
  });

  const [estudiantes, setEstudiantes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/estudiantes')
      .then(res => setEstudiantes(res.data))
      .catch(err => console.error('Error al cargar estudiantes:', err));

    axios.get('http://localhost:3000/productos')
      .then(res => setProductos(res.data))
      .catch(err => console.error('Error al cargar productos:', err));
  }, []);

  // Actualiza el formulario si cambia la venta seleccionada
  useEffect(() => {
    setFormData({
      estudiante_id: venta.estudiante_id || '',
      producto_id: venta.producto_id || '',
      cantidad: venta.cantidad || 1,
      fecha: venta.fecha || ''
    });
  }, [venta]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGuardando(true);

    axios.put(`http://localhost:3000/ventas/${venta.id}`, formData)
      .then(res => {
        alert(res.data.message || 'Venta actualizada');
        onUpdate();
      })
      .catch(err => console.error('Error al actualizar venta:', err))
      .finally(() => setGuardando(false));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="card-header">
          <div className="icon-badge primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
          <div>
            <h2>Editar Venta #{venta.id}</h2>
            <p>Modifica los campos necesarios para esta venta</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="form-label">Estudiante</label>
            <select 
              name="estudiante_id" 
              value={formData.estudiante_id}
              onChange={handleChange} 
              className="form-control"
              required
            >
              <option value="">Seleccionar estudiante...</option>
              {estudiantes.map(e => (
                <option key={e.id} value={e.id}>{e.nombre} ({e.grupo})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Producto</label>
            <select 
              name="producto_id" 
              value={formData.producto_id}
              onChange={handleChange} 
              className="form-control"
              required
            >
              <option value="">Seleccionar producto...</option>
              {productos.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre} — ${Number(p.precio).toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Cantidad</label>
            <input 
              type="number" 
              name="cantidad" 
              min="1"
              value={formData.cantidad}
              onChange={handleChange} 
              className="form-control"
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Fecha</label>
            <input 
              type="date" 
              name="fecha" 
              value={formData.fecha}
              onChange={handleChange} 
              className="form-control"
              required 
            />
          </div>

          <div className="form-actions full-width" style={{ marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            {onCancel && (
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarVenta;