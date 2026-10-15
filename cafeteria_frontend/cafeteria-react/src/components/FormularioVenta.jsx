import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FormularioVenta({ onVentaCreada }) {
  const [formData, setFormData] = useState({
    estudiante_id: '',
    producto_id: '',
    cantidad: 1,
    fecha: new Date().toISOString().split('T')[0]
  });

  const [estudiantes, setEstudiantes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/estudiantes')
      .then(res => setEstudiantes(res.data))
      .catch(err => console.error('Error al cargar estudiantes:', err));

    axios.get('http://localhost:3000/productos')
      .then(res => setProductos(res.data))
      .catch(err => console.error('Error al cargar productos:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCargando(true);

    axios.post('http://localhost:3000/ventas', formData)
      .then(res => {
        alert(res.data.message || 'Venta registrada con éxito');
        setFormData({
          estudiante_id: '',
          producto_id: '',
          cantidad: 1,
          fecha: new Date().toISOString().split('T')[0]
        });
        if (onVentaCreada) onVentaCreada();
      })
      .catch(err => console.error('Error al registrar venta:', err))
      .finally(() => setCargando(false));
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="icon-badge primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </div>
        <div>
          <h2>Registrar Nueva Venta</h2>
          <p>Selecciona el estudiante y el producto para la transacción</p>
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
              <option key={e.id} value={e.id}>
                {e.nombre} ({e.grupo})
              </option>
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

        <div className="form-actions full-width">
          <button type="submit" className="btn btn-primary" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Confirmar y Registrar Venta'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormularioVenta;