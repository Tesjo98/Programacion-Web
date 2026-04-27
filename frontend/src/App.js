import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';

// --- IMPORTACIONES DE CONTEXTO Y ESTILOS ---
import { AuthProvider, useAuth } from './context/AuthContext';
import { Colors } from './components/generalStyle/StylesConfig';
import './components/generalStyle/LayoutStyles.css';

// --- COMPONENTES ---
import LoginForm from './components/LoginForm';
import RegisterPage from './pages/RegisterPage';
import MainLayout from './menu/MainLayout';
import AcademicaHome from './desarrollo/DireccionAcademica/AcademicaHome';
import DesarrolloAcademicoLayout from './desarrollo/DireccionAcademica/subareas/DesarrolloAcademico/DesarrolloAcademicoLayout';
import PeriodoSelector from './desarrollo/DireccionAcademica/subareas/DesarrolloAcademico/PeriodoSelector';
import EvaluacionDocente from './desarrollo/DireccionAcademica/subareas/DesarrolloAcademico/formatos/EvaluacionDocente';
import EstimuloDesempeño from './desarrollo/DireccionAcademica/subareas/DesarrolloAcademico/formatos/EstimuloDesempeño';
import AlumnosEventos from './desarrollo/DireccionAcademica/subareas/DesarrolloAcademico/formatos/AlumnosEventos';
import CapacitacionDocente from './desarrollo/DireccionAcademica/subareas/DesarrolloAcademico/formatos/CapacitacionDocente';
import PersonalDocente from './desarrollo/DireccionAcademica/subareas/DesarrolloAcademico/formatos/PersonalDocente';
import Tutorias from './desarrollo/DireccionAcademica/subareas/DesarrolloAcademico/formatos/Tutorias';
import CentroComputoLayout from './desarrollo/DireccionAcademica/subareas/CentroComputo/CentroComputoLayout';
import AparatosTelefonicos from './desarrollo/DireccionAcademica/subareas/CentroComputo/formatos/AparatosTelefonicos';
import EducacionEspecial from './desarrollo/DireccionAcademica/subareas/CentroComputo/formatos/EducacionEspecial';
import RecursosInformaticos from './desarrollo/DireccionAcademica/subareas/CentroComputo/formatos/RecursosInformaticos';
import TelecomunicacionesHardware from './desarrollo/DireccionAcademica/subareas/CentroComputo/formatos/TelecomunicacionesHardware';
import TelecomunicacionesSoftware from './desarrollo/DireccionAcademica/subareas/CentroComputo/formatos/TelecomunicacionesSoftware';

// --- COMPONENTE DE RUTA PROTEGIDA CON ALERTAS ---
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Mientras Firebase está verificando la sesión, mostramos el cargando
  // Esto evita que 'user' sea null temporalmente y dispare la redirección errónea
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Poppins', backgroundColor: Colors.fondoGris }}>
        <div className="spinner"></div>
        <span style={{ marginLeft: '15px' }}>Validando acceso al SICEI...</span>
      </div>
    );
  }

  // Si terminó de cargar y realmente NO hay usuario, entonces redirigimos
  if (!user) {
    console.warn("Acceso denegado: Redirigiendo al Login.");
    return <Navigate to="/login" replace />;
  }

  return children;
};

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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '12px', padding: '40px 0' }}>
      {opciones.map((opcion, index) => (
        <button
          key={index}
          onClick={() => navigate(`/dashboard/${opcion.ruta}`)}
          style={{ width: '90%', maxWidth: '550px', padding: '18px', backgroundColor: '#1c3170', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'all 0.3s ease' }}
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
        <style dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
            html, body, #root { 
              margin: 0; padding: 0; width: 100vw; height: 100vh; overflow-x: hidden; 
              font-family: 'Poppins', sans-serif !important; 
              background-color: ${Colors.fondoGris}; 
            }
            *, *::before, *::after, button, input, select, textarea, span, strong, label { 
              font-family: 'Poppins', sans-serif !important; 
              box-sizing: border-box; 
            }
        `}} />

        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* DASHBOARD PROTEGIDO */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="direccion-academica">
              <Route index element={<AcademicaHome />} />
              <Route path="desarrollo-academico" element={<DesarrolloAcademicoLayout />}>
                <Route path="evaluacion-docente" element={<PeriodoSelector tituloFormato="Evaluación Docente" rutaBase="/dashboard/direccion-academica/desarrollo-academico/evaluacion-docente" />} />
                <Route path="evaluacion-docente/:periodoId" element={<EvaluacionDocente />} />
                <Route path="alumnos-eventos-academicos" element={<PeriodoSelector tituloFormato="Alumnos en Eventos Académicos" rutaBase="/dashboard/direccion-academica/desarrollo-academico/alumnos-eventos-academicos" />} />
                <Route path="alumnos-eventos-academicos/:periodoId" element={<AlumnosEventos />} />
                <Route path="capacitacion-personal-docente" element={<PeriodoSelector tituloFormato="Capacitación Personal Docente" rutaBase="/dashboard/direccion-academica/desarrollo-academico/capacitacion-personal-docente" />} />
                <Route path="capacitacion-personal-docente/:periodoId" element={<CapacitacionDocente />} />
                <Route path="personal-docente-estudia" element={<PeriodoSelector tituloFormato="Personal Docente que Estudia" rutaBase="/dashboard/direccion-academica/desarrollo-academico/personal-docente-estudia" />} />
                <Route path="personal-docente-estudia/:periodoId" element={<PersonalDocente />} />
                <Route path="estimulo-desempeno-docente" element={<PeriodoSelector tituloFormato="Estímulo al Desempeño Docente" rutaBase="/dashboard/direccion-academica/desarrollo-academico/estimulo-desempeno-docente" />} />
                <Route path="estimulo-desempeno-docente/:periodoId" element={<EstimuloDesempeño />} />
                <Route path="tutorias" element={<PeriodoSelector tituloFormato="Tutorias" rutaBase="/dashboard/direccion-academica/desarrollo-academico/tutorias" />} />
                <Route path="tutorias/:periodoId" element={<Tutorias />} />
              </Route>

              <Route path="computo" element={<CentroComputoLayout />}>
                <Route path="aparatos-telefonicos" element={<PeriodoSelector tituloFormato="Líneas y aparatos Teléfonicos." rutaBase="/dashboard/direccion-academica/computo/aparatos-telefonicos" />} />
                <Route path="aparatos-telefonicos/:periodoId" element={<AparatosTelefonicos />} />
                <Route path="educacion-especial" element={<PeriodoSelector tituloFormato="Infraestructura Educación Especial" rutaBase="/dashboard/direccion-academica/computo/educacion-especial" />} />
                <Route path="educacion-especial/:periodoId" element={<EducacionEspecial />} />
                <Route path="recursos-informaticos" element={<PeriodoSelector tituloFormato="Recursos Informáticos" rutaBase="/dashboard/direccion-academica/computo/recursos-informaticos" />} />
                <Route path="recursos-informaticos/:periodoId" element={<RecursosInformaticos />} />
                <Route path="telecomunicaciones-hardware" element={<PeriodoSelector tituloFormato="Telecomunicaciones Hardware" rutaBase="/dashboard/direccion-academica/computo/telecomunicaciones-hardware" />} />
                <Route path="telecomunicaciones-hardware/:periodoId" element={<TelecomunicacionesHardware />} />
                <Route path="telecomunicaciones-software" element={<PeriodoSelector tituloFormato="Telecomunicaciones Software" rutaBase="/dashboard/direccion-academica/computo/telecomunicaciones-software" />} />
                <Route path="telecomunicaciones-software/:periodoId" element={<TelecomunicacionesSoftware />} />
              </Route>
            </Route>
            <Route path="*" element={<div style={{ padding: '20px' }}>Interfaz en Desarrollo</div>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;