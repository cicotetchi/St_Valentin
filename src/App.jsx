import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [sparkles, setSparkles] = useState([]);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const flowerRef = useRef(null);
  const noButtonRef = useRef(null);

  const correctAnswers = ['jf', 'jean francois', 'tetchi', 'tetchi jean francois'];

  useEffect(() => {
    if (correctAnswers.some(answer => password.toLowerCase().includes(answer))) {
      setTimeout(() => setIsUnlocked(true), 1000);
    }
  }, [password]);

  const handleNoMouseOver = () => {
    if (flowerRef.current) {
      flowerRef.current.style.transform = 'rotate(20deg)';
      flowerRef.current.style.filter = 'grayscale(100%)';
    }
    moveNoButtonAway();
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

  const moveNoButtonAway = () => {
    if (noButtonRef.current) {
      const buttonRect = noButtonRef.current.getBoundingClientRect();
      const buttonWidth = buttonRect.width;
      const buttonHeight = buttonRect.height;

      const maxX = window.innerWidth - buttonWidth - 20;
      const maxY = window.innerHeight - buttonHeight - 20;

      let newX, newY;

      do {
        newX = Math.floor(Math.random() * maxX);
        newY = Math.floor(Math.random() * maxY);
      } while (
        Math.abs(newX - buttonRect.left) < 100 &&
        Math.abs(newY - buttonRect.top) < 100
      );

      setNoButtonPosition({ x: newX, y: newY });
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
          <h1>Veux-tu être ma Valentine ?<br />Rendez-vous demain soir là où tout a commencé ?</h1>
          <div
            className="flower"
            ref={flowerRef}
            style={{ backgroundImage: "url('https://em-content.zobj.net/thumbs/120/apple/325/rose_1f339.png')" }}
          />
          <div className="buttons">
            <button
              ref={noButtonRef}
              onMouseOver={handleNoMouseOver}
              onMouseOut={handleNoMouseOut}
              className="no-button"
              style={{ position: 'absolute', left: `${noButtonPosition.x}px`, top: `${noButtonPosition.y}px` }}
            >
              Non
            </button>
            <button
              onMouseOver={handleYesMouseOver}
              onClick={handleYesClick}
              disabled={sparkles.length > 0}
              className="yes-button"
            >
              {sparkles.length > 0 ? "À demain ! 💖" : "Oui !"}
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
