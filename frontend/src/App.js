import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';

// --- IMPORTACIONES DE CONTEXTO Y ESTILOS ---
import { AuthProvider } from './context/AuthContext';
import { Colors, Typography } from './components/generalStyle/StylesConfig';
import './components/generalStyle/LayoutStyles.css';

// --- IMPORTACIONES DE COMPONENTES GENERALES ---
import LoginForm from './components/LoginForm';
import RegisterPage from './pages/RegisterPage';
import MainLayout from './menu/MainLayout';

// --- IMPORTACIONES DE DIRECCIÓN ACADÉMICA ---
import AcademicaHome from './desarrollo/DireccionAcademica/AcademicaHome';
import DesarrolloAcademicoLayout from './desarrollo/DireccionAcademica/subareas/DesarrolloAcademico/DesarrolloAcademicoLayout';
import PeriodoSelector from './desarrollo/DireccionAcademica/subareas/DesarrolloAcademico/PeriodoSelector';
import EvaluacionDocente from './desarrollo/DireccionAcademica/subareas/DesarrolloAcademico/formatos/EvaluacionDocente';

/**
 * COMPONENTE: DashboardHome
 * Renderiza los botones azules principales del sistema.
 */
const DashboardHome = () => {
  const navigate = useNavigate();

  const opciones = [
    { nombre: "Dirección y Vinculación", ruta: "vinculacion" },
    { nombre: "Unidad Jurídica y de Igualdad de Género", ruta: "juridica" },
    { nombre: "Unidad de Planeación", ruta: "planeacion" },
    { nombre: "Dirección Académica", ruta: "direccion-academica" },
    { nombre: "Dirección de Vinculación y Extensión", ruta: "extension" },
    { nombre: "Subdirección de Servicios Administrativos", ruta: "administrativos" },
    { nombre: "Extensión Aculco", ruta: "aculco" },
    { nombre: "RIP", ruta: "rip" }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        gap: '12px',
        padding: '40px 0',
        fontFamily: Typography.principal
      }}
    >
      {opciones.map((opcion, index) => (
        <button
          key={index}
          onClick={() => navigate(`/dashboard/${opcion.ruta}`)}
          style={{
            width: '90%',
            maxWidth: '550px',
            padding: '18px',
            backgroundColor: '#0066cc',
            color: Colors.textoBlanco,
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 'bold',
            fontFamily: Typography.principal,
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#0052a3')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#0066cc')}
        >
          {opcion.nombre}
        </button>
      ))}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* ESTILOS GLOBALES DINÁMICOS */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body, #root {
                margin: 0 !important;
                padding: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                box-sizing: border-box !important;
                overflow-x: hidden !important;
                font-family: ${Typography.principal} !important; 
                background-color: ${Colors.fondoGris};
              }
              *, button, input, select, textarea {
                font-family: ${Typography.principal} !important;
                box-sizing: border-box;
              }
            `
          }}
        />

        <Routes>
          {/* 1. RUTAS PÚBLICAS (Sin Sidebar/Navbar del Dashboard) */}
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 2. RUTA RAÍZ DEL DASHBOARD (Usa MainLayout) */}
          <Route path="/dashboard" element={<MainLayout />}>
            
            {/* Inicio: Los botones azules principales */}
            <Route index element={<DashboardHome />} />

            {/* ÁREA: DIRECCIÓN ACADÉMICA */}
            <Route path="direccion-academica">
              {/* Menú de Subáreas */}
              <Route index element={<AcademicaHome />} />

              {/* SUBÁREA: DESARROLLO ACADÉMICO (Tiene su propio Layout/Sidebar interno) */}
              <Route path="desarrollo-academico" element={<DesarrolloAcademicoLayout />}>
                
                <Route
                  path="evaluacion-docente"
                  element={
                    <PeriodoSelector
                      tituloFormato="Evaluación Docente"
                      rutaBase="/dashboard/direccion-academica/desarrollo-academico/evaluacion-docente"
                    />
                  }
                />
                
                <Route
                  path="evaluacion-docente/:periodoId"
                  element={<EvaluacionDocente />}
                />
              </Route>

              {/* Otras subáreas de Académica (placeholders) */}
              <Route path="capacitacion" element={<div>Interfaz Capacitación</div>} />
              <Route path="evaluacion" element={<div>Interfaz Evaluación</div>} />
            </Route>

            {/* OTRAS ÁREAS DEL DASHBOARD (Ejemplos para las rutas de los botones) */}
            <Route path="vinculacion" element={<div>Interfaz Dirección y Vinculación</div>} />
            <Route path="juridica" element={<div>Interfaz Unidad Jurídica</div>} />
            <Route path="planeacion" element={<div>Interfaz Unidad de Planeación</div>} />
            <Route path="extension" element={<div>Interfaz Vinculación y Extensión</div>} />
            <Route path="administrativos" element={<div>Interfaz Servicios Administrativos</div>} />
            <Route path="aculco" element={<div>Interfaz Extensión Aculco</div>} />
            <Route path="rip" element={<div>Interfaz RIP</div>} />

          </Route>

          {/* 3. MANEJO DE RUTAS NO ENCONTRADAS */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;