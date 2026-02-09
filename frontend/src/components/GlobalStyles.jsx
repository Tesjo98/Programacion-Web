// frontend/src/GlobalStyles.jsx

import React from 'react';

const GlobalStyles = () => (
    <style >{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            background: linear-gradient(to right, #BCBBBA, #777779);
        }
        * {
            box-sizing: border-box;
        }

        /* --- PANTALLA DE BIENVENIDA --- */
        .welcome-container {
            /* ... (resto de estilos welcome-container) ... */
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100%;
            background-color: #1D2C57;
            color: white;
            text-align: center;
        }
        /* ... (resto de estilos de bienvenida, auth-container, footer, login-card, etc.) ... */
        
        .welcome-title { font-size: 3rem; margin-bottom: 30px; }
        /* ... (Todos los estilos que definiste) ... */
        
        .auth-container { 
            background: linear-gradient(to right, #BCBBBA, #777779);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 100vh;
            width: 100%;
        }
        
        /* ... (Mueve AQUÍ **TODOS** los estilos que definiste en tu <style jsx global>) ... */
        /* Dentro de tu bloque de GlobalStyles */

.app-container {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* Dentro de tu bloque de estilos en GlobalStyles.jsx */

.login-card {
    display: flex;
    flex-direction: column; /* Cambia a columna para que sea más estrecho */
    width: 400px;           /* <--- Reduce este valor para hacerlo más delgado */
    max-width: 90%;         /* Para que sea responsivo en móviles */
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin: 20px auto;      /* Lo centra horizontalmente */
    overflow: hidden;
}

.encabezado-img {
    width: 100%;
    height: auto;
    display: block;
}



    `}</style>
);

export default GlobalStyles;