import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useExport from '../../../../../hooks/useExport';
import { Colors, Assets, Typography } from '../../../../../components/generalStyle/StylesConfig';
import { fetchEvaluaciones, saveEvaluacion } from '../../../../../api/firebaseService';

// IMPORTACIÓN DEL HOOK DE LÓGICA DE TABLA
import { useTableLogic } from '../../../../../hooks/useTableLogic';

// IMPORTACIÓN DE TODOS LOS COMPONENTES REUTILIZABLES
import {
  BotonSincronizar,
  BotonAgregar,
  BotonLimpiar,
  BotonNuevaColumna
} from '../../../../../components/BotonesTablas';

// IMPORTACIÓN DEL MODAL DE IA
import ModalCargaIA from '../../../../../components/Estractor/EstractorIA';

const EvaluacionDocente = () => {
  const { periodoId } = useParams();
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [modalIAOpen, setModalIAOpen] = useState(false);

  const { exportToPDF, exportToExcel } = useExport();
  const periodoActual = periodoId || "Septiembre 2025 – Febrero 2026";

  const programasBase = [
    "INGENIERÍA ELECTROMECÁNICA IEME-2010-210", "INGENIERÍA INDUSTRIAL IIND-2010-227",
    "INGENIERÍA INDUSTRIAL IIND-2010-227. EXTENSIÓN ACULCO", "INGENIERÍA EN SISTEMAS COMPUTACIONALES ISIC-2010-224",
    "INGENIERÍA EN SISTEMAS COMPUTACIONALES ISIC-2010-224. EXTENSIÓN ACULCO", "INGENIERÍA MECATRÓNICA IMCT-2010-229",
    "ARQUITECTURA ARQU-2010-204", "CONTADOR PÚBLICO COPU-2010-205",
    "CONTADOR PÚBLICO COPU-2010-205. EXTENSIÓN ACULCO", "INGENIERÍA EN GESTIÓN EMPRESARIAL IGEM-2009-201",
    "INGENIERÍA QUÍMICA IQUI-2010-232", "INGENIERÍA EN MATERIALES IMAT-2010-222",
    "INGENIERÍA EN ANIMACIÓN DIGITAL Y EFECTOS VISUALES IAEV-2012-238", "LICENCIATURA EN TURISMO LTUR-2012-237",
    "LICENCIATURA EN TURISMO LTUR-2012-237. EXTENSIÓN ACULCO"
  ];

  const [columnasExtra, setColumnasExtra] = useState([]);

  // Lógica de tabla
  const { handleKeyDown, handleBlurCell } = useTableLogic(datos, setDatos, 3 + columnasExtra.length);

  useEffect(() => {
    const handlePDF = () => exportToPDF('area-oficial-impresion', `Evaluación Docente - ${periodoActual}`);
    const handleExcel = () => exportToExcel(datos, `Evaluación Docente - ${periodoActual}`);
    const handleIA = () => setModalIAOpen(true);
    window.addEventListener('descargar-pdf-global', handlePDF);
    window.addEventListener('descargar-excel-global', handleExcel);
    window.addEventListener('extraer-ia-global', handleIA);
    return () => {
      window.removeEventListener('descargar-pdf-global', handlePDF);
      window.removeEventListener('descargar-excel-global', handleExcel);
      window.removeEventListener('extraer-ia-global', handleIA);
    };
  }, [datos, periodoActual]);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const registrosFirebase = await fetchEvaluaciones(periodoActual);
        if (registrosFirebase && registrosFirebase.length > 0) {
          setDatos(registrosFirebase);
        } else {
          const iniciales = programasBase.map(prog => ({
            id: Math.random(),
            programaAcademico: prog,
            periodo: periodoActual,
            calificacion: 0,
            totalDocentes: 0
          }));
          setDatos(iniciales);
        }
      } catch (error) { console.error("Error:", error); }
      finally { setLoading(false); }
    };
    cargarDatos();
  }, [periodoActual]);

  const agregarFila = () => {
    const nuevoPrograma = prompt("Ingrese el nombre del programa académico adicional:");
    if (nuevoPrograma) {
      setDatos([...datos, {
        id: Date.now(),
        programaAcademico: nuevoPrograma.toUpperCase(),
        periodo: periodoActual,
        calificacion: 0,
        totalDocentes: 0
      }]);
    }
  };

  const handleAgregarColumna = () => {
    const nombre = prompt("Ingrese el nombre del nuevo criterio de evaluación:");
    if (nombre) {
      const key = nombre.toLowerCase().replace(/\s+/g, '_');
      setColumnasExtra([...columnasExtra, { key, label: nombre.toUpperCase() }]);
      setDatos(datos.map(item => ({ ...item, [key]: 0 })));
    }
  };

  const handleLimpiarTabla = () => {
    if (window.confirm("¿Deseas vaciar todas las calificaciones de la tabla?")) {
      setDatos(datos.map(item => ({ ...item, calificacion: 0, totalDocentes: 0 })));
    }
  };

  const handleSincronizar = async () => {
    setActualizando(true);
    try {
      const promesas = datos.map(item => saveEvaluacion(item));
      await Promise.all(promesas);
      alert("¡Sincronización completa!");
    } catch (error) { alert("Error al guardar."); }
    finally { setActualizando(false); }
  };

  const handleIADataSuccess = (datosIA) => {
    const nuevosDatos = datos.map(fila => {
      const match = datosIA.find(d =>
        d.programaAcademico?.trim().toUpperCase() === fila.programaAcademico?.trim().toUpperCase()
      );
      if (match) {
        return {
          ...fila,
          calificacion: Number(match.calificacion) || 0,
          totalDocentes: Number(match.totalDocentes) || 0
        };
      }
      return fila;
    });
    setDatos(nuevosDatos);
    setModalIAOpen(false);
    alert("Datos extraídos y aplicados a la tabla.");
  };

  const totalDocentesDoc = datos.reduce((acc, curr) => acc + (Number(curr.totalDocentes) || 0), 0);
  const calificacionesValidas = datos.map(d => Number(d.calificacion)).filter(v => v > 0);
  const promedioGral = calificacionesValidas.length > 0
    ? (calificacionesValidas.reduce((a, b) => a + b, 0) / calificacionesValidas.length).toFixed(2)
    : "0.00";

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando datos...</div>;

  return (
    <div className="container">
      <style>
        {`
          @media screen { .solo-pdf-captura { position: absolute; left: -9999px; } }
          .no_imprimir_botones_ia { display: flex; }
          td[contenteditable="true"]:focus { background-color: ${Colors.accent || '#fff9c4'} !important; outline: none; }
        `}
      </style>

      {modalIAOpen && (
        <ModalCargaIA
          onClose={() => setModalIAOpen(false)}
          onSuccess={handleIADataSuccess}
        />
      )}

      <div id="area-oficial-impresion" style={styles.pageWrapper}>
        <div className="solo-pdf-captura" style={styles.fullImageContainer}>
          <img src={Assets.header} alt="Header" style={styles.fullWidthImg} />
        </div>

        <div style={styles.marginContent}>
          <div style={styles.contentHeader}>
            <h2 style={styles.titlePrincipal}>EVALUACIÓN DOCENTE</h2>
            <p style={styles.subtitlePeriodo}>Periodo: {periodoActual}</p>
            <div style={styles.divider} />
          </div>

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={{ backgroundColor: Colors.barraTitulo || '#00264D', color: 'white' }}>
                  <th style={styles.th}>PROGRAMA ACADÉMICO</th>
                  <th style={styles.th}>CALIFICACIÓN</th>
                  <th style={styles.th}>TOTAL DE DOCENTES</th>
                  {columnasExtra.map(col => (
                    <th key={col.key} style={styles.th}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datos.map((item, index) => {
                  if (!item.programaAcademico || item.programaAcademico.trim() === "") return null;

                  return (
                    <tr key={item.id || index} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={styles.tdNombre}>{item.programaAcademico}</td>

                      <td
                        style={styles.td}
                        contentEditable
                        suppressContentEditableWarning
                        tabIndex={0}
                        onKeyDown={(e) => handleKeyDown(e, index, 1)}
                        onBlur={(e) => handleBlurCell(index, 'calificacion', Number(e.target.innerText) || 0)}
                      >
                        {item.calificacion}
                      </td>

                      <td
                        style={styles.td}
                        contentEditable
                        suppressContentEditableWarning
                        tabIndex={0}
                        onKeyDown={(e) => handleKeyDown(e, index, 2)}
                        onBlur={(e) => handleBlurCell(index, 'totalDocentes', Number(e.target.innerText) || 0)}
                      >
                        {item.totalDocentes}
                      </td>

                      {columnasExtra.map((col, colIdx) => (
                        <td
                          key={col.key}
                          style={styles.td}
                          contentEditable
                          suppressContentEditableWarning
                          tabIndex={0}
                          onKeyDown={(e) => handleKeyDown(e, index, 3 + colIdx)}
                          onBlur={(e) => handleBlurCell(index, col.key, e.target.innerText)}
                        >
                          {item[col.key]}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: '#f0f4f8', fontWeight: 'bold' }}>
                  <td style={styles.tdNombre}>TOTAL DOCENTES INSTITUCIONAL</td>
                  <td style={styles.td}>—</td>
                  <td style={styles.td}>{totalDocentesDoc}</td>
                  {columnasExtra.map(c => <td key={c.key} style={styles.td}>—</td>)}
                </tr>
                <tr style={{ backgroundColor: '#e1e8f0', fontWeight: 'bold' }}>
                  <td style={styles.tdNombre}>PROMEDIO GENERAL DE EVALUACIÓN</td>
                  <td style={styles.td}>{promedioGral}</td>
                  <td style={styles.td}>—</td>
                  {columnasExtra.map(c => <td key={c.key} style={styles.td}>—</td>)}
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="no_imprimir_botones_ia" style={{ justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
            <BotonLimpiar onClick={handleLimpiarTabla} />
            <BotonNuevaColumna onClick={handleAgregarColumna} />
            <BotonAgregar onClick={agregarFila} />
            <BotonSincronizar onClick={handleSincronizar} loading={actualizando} />
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { backgroundColor: 'white', width: '100%', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '297mm', position: 'relative', boxShadow: '0 0 15px rgba(0,0,0,0.1)' },
  fullImageContainer: { width: '100%' },
  marginContent: { padding: '20px 2cm', flex: 1, display: 'flex', flexDirection: 'column' },
  fullWidthImg: { width: '100%', display: 'block' },
  contentHeader: { textAlign: 'center', marginBottom: '20px' },
  titlePrincipal: { ...Typography.titlePrincipal, margin: '0' },
  subtitlePeriodo: { ...Typography.subtitlePeriodo },
  divider: { height: '3px', backgroundColor: Colors.barraTitulo || '#00264D', width: '100%', marginTop: '10px' },
  tableContainer: { border: `1px solid ${Colors.border || '#ccc'}`, borderRadius: '4px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { ...Typography.tableHeader, padding: '12px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.1)' },
  tdNombre: { ...Typography.tableCell, padding: '10px 12px', textAlign: 'left', borderRight: '1px solid #eee', fontWeight: '400' },
  td: { ...Typography.tableCell, padding: '10px', textAlign: 'center', outline: 'none', borderRight: '1px solid #eee', fontWeight: '400' }
};

export default EvaluacionDocente;