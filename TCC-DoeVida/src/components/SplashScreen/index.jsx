import { useState, useEffect } from 'react';
import './style.css';
import bloodDropLogo from '../../assets/icons/logo_semfundo.png';

function SplashScreen({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Animação de progresso suave
    const duration = 2500;
    const interval = 20;
    const steps = duration / interval;
    const increment = 100 / steps;

    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += increment;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        clearInterval(timer);
        
        // Fade out suave
        setTimeout(() => {
          setIsComplete(true);
          if (onLoadingComplete) {
            onLoadingComplete();
          }
        }, 500);
      } else {
        setProgress(currentProgress);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <div className={`splash-screen ${isComplete ? 'fade-out' : ''}`}>
      {/* Círculos de fundo animados */}
      <div className="bg-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
        <div className="circle circle-5"></div>
        <div className="circle circle-6"></div>
        <div className="circle circle-7"></div>
        <div className="circle circle-8"></div>
      </div>

      <div className="splash-content">
        {/* Logo/Gota Principal */}
        <div className="logo-container">
          <img 
            src={bloodDropLogo} 
            alt="DoeVida Logo" 
            className="blood-drop-logo"
          />
        </div>

        {/* Texto do App */}
        <h1 className="app-name">DoeVida</h1>
        <p className="app-tagline">Salvando vidas através da doação</p>

        {/* Barra de Progresso Moderna */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-percentage">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Partículas flutuantes */}
      <div className="floating-particles">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              '--delay': `${i * 0.2}s`,
              '--duration': `${3 + Math.random() * 2}s`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default SplashScreen;
