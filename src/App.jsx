import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [sparkles, setSparkles] = useState([]);
  const flowerRef = useRef(null);

  // Réponses acceptées (ton prénom ou surnom)
  const correctAnswers = ['jf', 'jean francois', 'tetchi', 'tetchi jean francois'];

  // Vérification du mot de passe
  useEffect(() => {
    if (correctAnswers.some(answer => password.toLowerCase().includes(answer))) {
      setTimeout(() => setIsUnlocked(true), 1000);
    }
  }, [password]);

  // Animation de la fleur
  const handleNoMouseOver = () => {
    if (flowerRef.current) {
      flowerRef.current.style.transform = 'rotate(20deg)';
      flowerRef.current.style.filter = 'grayscale(100%)';
    }
  };

  const handleNoMouseOut = () => {
    if (flowerRef.current) {
      flowerRef.current.style.transform = 'rotate(0deg)';
      flowerRef.current.style.filter = 'grayscale(0%)';
    }
  };

  const handleYesMouseOver = () => {
    if (flowerRef.current) {
      flowerRef.current.style.transform = 'scale(1.1)';
      flowerRef.current.style.filter = 'hue-rotate(30deg) drop-shadow(0 0 10px #ff00ff)';
    }
  };

  const handleYesClick = () => {
    if (flowerRef.current) {
      flowerRef.current.style.animation = 'pulse 1s infinite';
      document.body.style.background = 'linear-gradient(135deg, #ff9a9e, #fad0c4)';
      setSparkles(['✨', '💖', '💘', '💕', '🌟']);
    }
  };

  return (
    <div className="app">
      {!isUnlocked ? (
        <div className="gatekeeper-container">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Qui est-ce ?"
            autoFocus
          />
        </div>
      ) : (
        <div className="question-container">
          <h1>Veux-tu être ma Valentine ?</h1>
          <div
            className="flower"
            ref={flowerRef}
            style={{ backgroundImage: "url('https://em-content.zobj.net/thumbs/120/apple/325/rose_1f339.png')" }}
          />
          <div className="buttons">
            <button
              onMouseOver={handleNoMouseOver}
              onMouseOut={handleNoMouseOut}
              disabled={sparkles.length > 0}
            >
              Non
            </button>
            <button
              onMouseOver={handleYesMouseOver}
              onClick={handleYesClick}
              disabled={sparkles.length > 0}
            >
              {sparkles.length > 0 ? "Merci ! 💖" : "Oui !"}
            </button>
          </div>
          {sparkles.length > 0 && (
            <div className="sparkles">
              {sparkles.map((sparkle, index) => (
                <span
                  key={index}
                  className="sparkle"
                  style={{ left: `${Math.random() * 80}%`, animationDelay: `${index * 0.2}s` }}
                >
                  {sparkle}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
