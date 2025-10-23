import { useState, useEffect } from 'react';
import './style.css';

function SplashScreen({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0);
  const [isExploding, setIsExploding] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simula o carregamento progressivo (3 segundos)
    const duration = 3000; // 3 segundos
    const interval = 30; // Atualiza a cada 30ms
    const steps = duration / interval;
    const increment = 100 / steps;

    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += increment;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        clearInterval(timer);
        
        // Inicia a explosão
        setTimeout(() => {
          setIsExploding(true);
          
          // Completa a animação após a explosão (tempo maior para ver as gotinhas)
          setTimeout(() => {
            setIsComplete(true);
            if (onLoadingComplete) {
              onLoadingComplete();
            }
          }, 4000); // 4 segundos para ver a explosão completa
        }, 300);
      } else {
        setProgress(currentProgress);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <div className={`splash-screen ${isComplete ? 'fade-out' : ''}`}>
      <div className="splash-content">
        {/* Gotinha de sangue gordinha que enche */}
        <div className={`blood-drop-container ${isExploding ? 'exploding' : ''}`}>
          <svg 
            className={`blood-drop ${isExploding ? 'exploding' : ''}`} 
            viewBox="0 0 240 300" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Definição do gradiente */}
            <defs>
              <linearGradient id="bloodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff1744" />
                <stop offset="50%" stopColor="#d32f2f" />
                <stop offset="100%" stopColor="#990410" />
              </linearGradient>
              
              {/* Máscara para o efeito de preenchimento - Gotinha gordinha */}
              <clipPath id="dropClip">
                <path d="M120,30 C120,30 50,90 50,170 C50,220 80,270 120,270 C160,270 190,220 190,170 C190,90 120,30 120,30 Z" />
              </clipPath>
            </defs>
            
            {/* Contorno da gota gordinha */}
            <path 
              className="drop-outline"
              d="M120,30 C120,30 50,90 50,170 C50,220 80,270 120,270 C160,270 190,220 190,170 C190,90 120,30 120,30 Z"
              fill="none"
              stroke="url(#bloodGradient)"
              strokeWidth="5"
            />
            
            {/* Preenchimento animado */}
            <g clipPath="url(#dropClip)">
              <rect 
                className="drop-fill"
                x="0" 
                y={300 - (progress * 2.7)} 
                width="240" 
                height="300"
                fill="url(#bloodGradient)"
              />
              
              {/* Efeito de onda no topo */}
              <path
                className="wave"
                d={`M0,${300 - (progress * 2.7)} Q60,${290 - (progress * 2.7)} 120,${300 - (progress * 2.7)} T240,${300 - (progress * 2.7)} V300 H0 Z`}
                fill="rgba(255, 255, 255, 0.2)"
              />
            </g>
            
            {/* Brilho na gota */}
            <ellipse
              className="drop-shine"
              cx="95"
              cy="130"
              rx="25"
              ry="35"
              fill="rgba(255, 255, 255, 0.3)"
              opacity={progress / 100}
            />
          </svg>
          
          {/* Porcentagem dentro da gota */}
          <div className="progress-text">
            <span className="percentage">{Math.round(progress)}%</span>
          </div>
          
          {/* Partículas da explosão - MUITAS GOTINHAS DE SANGUE */}
          {isExploding && (
            <>
              {/* Flash de explosão */}
              <div className="explosion-flash"></div>
              
              <div className="explosion-particles">
                {[...Array(400)].map((_, i) => {
                  // Distribuição uniforme em 360 graus
                  const angle = (i * 360) / 400;
                  const randomAngleOffset = (Math.random() - 0.5) * 25;
                  const finalAngle = angle + randomAngleOffset;
                  
                  // Distância aleatória para cada partícula
                  const distance = 60 + Math.random() * 320; // 60-380px
                  
                  // Tamanho aleatório
                  const size = 8 + Math.random() * 16; // 8-24px (maiores!)
                  
                  // Delay aleatório para efeito cascata mais longo
                  const delay = Math.random() * 0.5;
                  
                  // Rotação aleatória
                  const rotation = Math.random() * 1080; // 0-1080 graus (3 voltas!)
                  
                  return (
                    <div 
                      key={i} 
                      className="particle-drop"
                      style={{
                        '--angle': `${finalAngle}deg`,
                        '--delay': `${delay}s`,
                        '--distance': `${distance}px`,
                        '--size': `${size}px`,
                        '--rotation': `${rotation}deg`
                      }}
                    >
                      {/* SVG da gotinha pequena */}
                      <svg viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg">
                        <path 
                          d="M12,3 C12,3 5,9 5,17 C5,22 8,27 12,27 C16,27 19,22 19,17 C19,9 12,3 12,3 Z" 
                          fill="url(#particleGradient)"
                          stroke="#990410"
                          strokeWidth="1"
                        />
                        <defs>
                          <linearGradient id="particleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ff1744" />
                            <stop offset="50%" stopColor="#d32f2f" />
                            <stop offset="100%" stopColor="#990410" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Efeito de pulso de fundo */}
      <div className="background-pulse"></div>
    </div>
  );
}

export default SplashScreen;
