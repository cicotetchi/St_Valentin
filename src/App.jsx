import { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';

const TOTAL_PHOTOS = 34;
const HEART_COUNT = 20;
const CONFETTI_COUNT = 50;
const EVASION_DISTANCE = 100;
const TRANSITION_DURATION = 3000;

const images = Array.from({ length: TOTAL_PHOTOS }, (_, i) => `/images/photo${i + 1}.jpg`);

function App() {
  const [phase, setPhase] = useState('question');
  const [zoomedImage, setZoomedImage] = useState(null);
  const [noButtonPos, setNoButtonPos] = useState(null);
  const [confettiHearts, setConfettiHearts] = useState([]);
  const [visiblePhotos, setVisiblePhotos] = useState(new Set());

  const noButtonRef = useRef(null);
  const photoRefs = useRef({});

  // Floating hearts data (generated once)
  const floatingHearts = useRef(
    Array.from({ length: HEART_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 10 + Math.random() * 20,
      duration: 6 + Math.random() * 10,
      delay: Math.random() * 8,
      opacity: 0.1 + Math.random() * 0.3,
    }))
  );

  // Move "Non" button to a random viewport position
  const moveNoButton = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 20;
    const btnW = 100;
    const btnH = 44;
    const newX = margin + Math.random() * (vw - btnW - margin * 2);
    const newY = margin + Math.random() * (vh - btnH - margin * 2);
    setNoButtonPos({ x: newX, y: newY });
  }, []);

  // Unified pointer proximity check
  const handlePointerNear = useCallback(
    (clientX, clientY) => {
      if (phase !== 'question' || !noButtonRef.current) return;
      const rect = noButtonRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      const dist = Math.hypot(clientX - btnCenterX, clientY - btnCenterY);
      if (dist < EVASION_DISTANCE) {
        moveNoButton();
      }
    },
    [phase, moveNoButton]
  );

  const handleMouseMove = (e) => handlePointerNear(e.clientX, e.clientY);

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    if (touch) handlePointerNear(touch.clientX, touch.clientY);
  };

  // Click "Oui" → transition → gallery
  const handleYesClick = () => {
    const hearts = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 10 + Math.random() * 25,
      delay: Math.random() * 0.5,
      duration: 1 + Math.random() * 2,
    }));
    setConfettiHearts(hearts);
    setPhase('transition');

    setTimeout(() => {
      setPhase('gallery');
      setConfettiHearts([]);
    }, TRANSITION_DURATION);
  };

  const handleImageClick = (image) => setZoomedImage(image);
  const closeZoom = () => setZoomedImage(null);

  // Initial "Non" button position
  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setNoButtonPos({ x: vw / 2 - 140, y: vh / 2 + 120 });
  }, []);

  // Body overflow management
  useEffect(() => {
    if (phase === 'gallery') {
      document.body.style.overflow = 'auto';
      document.body.style.overflowX = 'hidden';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, [phase]);

  // Close zoom on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && zoomedImage) closeZoom();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [zoomedImage]);

  // Staggered photo reveal with IntersectionObserver
  useEffect(() => {
    if (phase !== 'gallery') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.dataset.index;
            setVisiblePhotos((prev) => new Set([...prev, index]));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(photoRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [phase]);

  return (
    <div className="app" onMouseMove={handleMouseMove} onTouchMove={handleTouchMove}>
      {/* Floating background hearts */}
      <div className="floating-hearts" aria-hidden="true">
        {floatingHearts.current.map((h) => (
          <div
            key={h.id}
            className="floating-heart"
            style={{
              left: `${h.left}%`,
              fontSize: `${h.size}px`,
              animationDuration: `${h.duration}s`,
              animationDelay: `${h.delay}s`,
              opacity: h.opacity,
            }}
          >
            &#x2764;
          </div>
        ))}
      </div>

      {/* SCREEN 1: Question */}
      {phase === 'question' && (
        <div className="question-screen">
          <div className="question-content">
            <h1 className="question-title">Veux-tu être ma Valentine ?</h1>
            <p className="question-subtitle">
              Rendez-vous demain soir là où tout a commencé...
            </p>
            <div className="rose-emoji" aria-label="Rose">🌹</div>
            <button className="yes-button" onClick={handleYesClick}>
              Oui !
            </button>
          </div>
          {noButtonPos && (
            <button
              ref={noButtonRef}
              className="no-button"
              style={{ left: `${noButtonPos.x}px`, top: `${noButtonPos.y}px` }}
              onTouchStart={moveNoButton}
            >
              Non
            </button>
          )}
        </div>
      )}

      {/* TRANSITION: Hearts explosion + love message */}
      {phase === 'transition' && (
        <div className="transition-screen">
          {confettiHearts.map((h) => (
            <div
              key={h.id}
              className="confetti-heart"
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
                fontSize: `${h.size}px`,
                animationDelay: `${h.delay}s`,
                animationDuration: `${h.duration}s`,
              }}
            >
              &#x2764;
            </div>
          ))}
          <div className="transition-message">
            <span className="love-text">Je t&apos;aime...</span>
          </div>
        </div>
      )}

      {/* SCREEN 2: Gallery */}
      {phase === 'gallery' && (
        <div className="gallery-screen">
          <div className="gallery-header">
            <h1 className="gallery-title">Nos plus beaux souvenirs</h1>
            <p className="love-letter">
              Chaque photo est un moment gravé dans mon cœur.
              <br />
              Merci d&apos;être toi, merci d&apos;être nous.
            </p>
          </div>
          <div className="photos-grid">
            {images.map((image, index) => (
              <div
                key={index}
                ref={(el) => (photoRefs.current[index] = el)}
                data-index={index}
                className={`photo-card ${visiblePhotos.has(String(index)) ? 'photo-visible' : ''}`}
                style={{ animationDelay: `${(index % 6) * 0.1}s` }}
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image}
                  alt={`Souvenir ${index + 1}`}
                  className="photo-img"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <div className="gallery-footer">
            <p>À notre histoire, à nous deux ❤️</p>
          </div>
        </div>
      )}

      {/* Zoom overlay */}
      {zoomedImage && (
        <div className="zoom-overlay" onClick={closeZoom}>
          <img
            src={zoomedImage}
            alt="Photo agrandie"
            className="zoom-image"
          />
        </div>
      )}
    </div>
  );
}

export default App;
