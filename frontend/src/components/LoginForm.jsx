import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// Importamos auth y la función de login con Microsoft desde tu servicio
import { auth, loginWithMicrosoft } from '../api/firebaseService';
// IMPORTANTE: Importamos la función de Firebase Auth
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginForm = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleMicrosoftLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await loginWithMicrosoft();
            navigate('/dashboard');
        } catch (err) {
            setError('Error al acceder con la cuenta institucional de Microsoft.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Autenticación con Firebase usando el objeto auth importado
            await signInWithEmailAndPassword(auth, email, password);

            // 2. Actualizar el estado global en tu Contexto
            await login({ email, password });

            alert("¡Acceso correcto! Entrando al sistema...");
            navigate('/dashboard');

        } catch (err) {
            console.error("Error detectado:", err);

            // Manejo de errores específicos de Firebase para que el usuario entienda qué pasó
            if (err.code === 'auth/invalid-credential') {
                setError('Correo o contraseña incorrectos.');
            } else if (err.code === 'auth/user-not-found') {
                setError('El usuario no existe.');
            } else if (err.code === 'auth/wrong-password') {
                setError('Contraseña incorrecta.');
            } else {
                setError('Error al iniciar sesión: ' + (err.message || 'Intente de nuevo.'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="top-bar">
                <img src="/assets/header-bg.png" alt="Encabezado TESJO" className="encabezado-img" />
            </div>

            <div className="main-content-area">
                <div className="login-box-container">
                    <div className="welcome-panel">
                        <h1 className="welcome-title">BIENVENIDO</h1>
                        <p className="description-text">
                            Programa para la Sistematización y Consolidación de la Estadística
                            Institucional (PSICEI)
                        </p>
                        <p className="sicei-text">
                            Sistema de Consulta de Estadísticas Institucionales
                        </p>
                        <img src="/assets/TESJo_ Blanco.png" alt="Logo TESJO" className="logo-img" />
                    </div>

                    <div className="login-form-panel">
                        <p className="form-title">Usuario:</p>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Correo institucional"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="input-group">
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <button type="submit" id="btnlogin" disabled={loading}>
                                {loading ? 'Verificando...' : 'Iniciar Sesión'}
                            </button>

                            <button
                                type="button"
                                className="btn-microsoft"
                                onClick={handleMicrosoftLogin}
                                disabled={loading}
                            >
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/960px-Microsoft_logo.svg.png"
                                    alt="MS Logo"
                                    style={{ width: '18px', marginRight: '10px' }}
                                />
                                Entrar con @tesjo.edu.mx
                            </button>

                            {error && <p className="error-msg">{error}</p>}

                            <p className="register-link">
                                ¿Aún no tienes cuenta?
                                <a href="/register"> Regístrate</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            <div className="footer">
                <p className="copyright-text">
                    © Copyright 2025 TecNM - Todos los Derechos Reservados
                </p>
                <img src="/assets/pagg.png" alt="Logo Pie de Página" className="footer-img" />
            </div>

            <style jsx="true">{`
                html, body, #root, .login-page {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100vw !important;
                    height: 100vh !important;
                    box-sizing: border-box !important;
                    overflow-x: hidden !important;
                    background-color: #f4f4f4;
                }
                .login-page {
                    font-family: Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                }
                .top-bar, .footer {
                    width: 100%;
                    background-color: #1c3170;
                }
                .encabezado-img, .footer-img {
                    width: 100%;
                    height: auto;
                    display: block;
                }
                .encabezado-img { max-height: 120px; object-fit: cover; }
                .footer-img { max-height: 280px; object-fit: cover; }
                .copyright-text {
                    color: white;
                    text-align: center;
                    padding: 5px 0;
                    font-size: 0.85rem;
                    background-color: #1c3170;
                    margin: 0;
                }
                .main-content-area {
                    flex-grow: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }
                .login-box-container {
                    display: flex;
                    max-width: 620px;
                    width: 100%;
                    border-radius: 4px;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                    height: 480px;
                }
                .welcome-panel {
                    flex: 1;
                    background-color: #213c7a;
                    color: white;
                    text-align: center;
                    padding: 30px 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .welcome-title { font-size: 2rem; margin-bottom: 20px; }
                .description-text { font-size: 0.85rem; margin-bottom: 5px; }
                .sicei-text { font-size: 0.75rem; margin-bottom: 20px; }
                .logo-img { width: 100px; align-self: center; }
                .login-form-panel {
                    flex: 1;
                    background-color: white;
                    padding: 30px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .input-group { margin-bottom: 15px; }
                .input-field {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                }
                #btnlogin {
                    width: 100%;
                    padding: 10px;
                    background-color: #1c3170;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1rem;
                    margin-bottom: 10px;
                }
                .btn-microsoft {
                    width: 100%;
                    padding: 10px;
                    background-color: #ffffff;
                    color: #5e5e5e;
                    border: 1px solid #8c8c8c;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                }
                .error-msg {
                    color: #c0392b;
                    background-color: #fadbd8;
                    padding: 8px;
                    border-radius: 4px;
                    margin-top: 10px;
                    text-align: center;
                    font-size: 0.85rem;
                }
                .register-link { text-align: center; margin-top: 15px; font-size: 0.8rem; }
                @media (max-width: 600px) {
                    .welcome-panel { display: none; }
                    .login-box-container { height: auto; }
                }
            `}</style>
        </div>
    );
};

export default LoginForm;