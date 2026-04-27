import React from 'react';

const GlobalStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        /* 1. REGLA UNIVERSAL: Todo a Montserrat por defecto */
        * {
            box-sizing: border-box;
            font-family: 'Montserrat', sans-serif !important;
        }

        body {
            margin: 0;
            padding: 0;
            background: linear-gradient(to right, #BCBBBA, #777779);
            font-family: 'Montserrat', sans-serif !important;
        }

        /* 2. TEXTOS DE DATOS Y TABLAS: Usamos Inter */
        td, th, p, span, input, textarea, select, option, .celda-espaciada {
            font-family: 'Inter', sans-serif !important;
        }

        /* 3. TÍTULOS Y BOTONES: Montserrat Bold */
        h1, h2, h3, h4, .titulo-layout-oficial, .titulo-seccion, button, .sidebar-item, .welcome-title {
            font-family: 'Montserrat', sans-serif !important;
            font-weight: 700 !important;
        }

        /* 4. COMPONENTES ESPECÍFICOS (Chat e Interfaz) */
        .chat-ia-input, .chat-ia-bubble, .menu-desplegable, strong {
            font-family: 'Montserrat', sans-serif !important;
        }

        /* --- ESTILOS DE CONTENEDORES --- */
        .welcome-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #1D2C57;
            color: white;
            text-align: center;
        }

        .login-card {
            display: flex;
            flex-direction: column;
            width: 400px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            margin: 20px auto;
            overflow: hidden;
        }

            /* Dentro de GlobalStyles.jsx */
* {
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif !important;
}

/* Solo los TH (encabezados) llevan negrita */
th {
    font-family: 'Montserrat', sans-serif !important;
    font-weight: 700 !important;
}

/* Los TD (celdas) NUNCA llevan negrita a menos que lo pidamos */
td, p, span, input {
    font-family: 'Inter', sans-serif !important;
    font-weight: 400 !important; /* Esto quita lo "gordito" de la letra */
}
    `}</style>
);

export default GlobalStyles;