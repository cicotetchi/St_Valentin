import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [sparkles, setSparkles] = useState([]);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [showPhotos, setShowPhotos] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const flowerRef = useRef(null);
  const noButtonRef = useRef(null);

  // Liste des photos
  const images = [];
  for (let i = 1; i <= 10; i++) {
    images.push(`/images/photo${i}.jpg`);
  }

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
      setTimeout(() => setShowPhotos(true), 1500);
    }
  };

  const moveNoButtonAway = () => {
    if (noButtonRef.current) {
      const buttonRect = noButtonRef.current.getBoundingClientRect();
      const buttonWidth = buttonRect.width;
      const buttonHeight = buttonRect.height;

      const directions = [
        { x: 1, y: 0 },   // droite
        { x: -1, y: 0 },  // gauche
        { x: 0, y: 1 },   // bas
        { x: 0, y: -1 },  // haut
        { x: 1, y: 1 },   // bas-droite
        { x: 1, y: -1 },  // haut-droite
        { x: -1, y: 1 },  // bas-gauche
        { x: -1, y: -1 }  // haut-gauche
      ];

      const randomDirection = directions[Math.floor(Math.random() * directions.length)];

      const newX = buttonRect.left + randomDirection.x * 15;
      const newY = buttonRect.top + randomDirection.y * 15;

      setNoButtonPosition({ x: newX, y: newY });
    }
  };

  const handleImageClick = (image) => {
    setZoomedImage(image);
  };

  const closeZoomedImage = () => {
    setZoomedImage(null);
  };

  return (
    <div className="app">
      {!isUnlocked ? (
        <div className="gatekeeper-container">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Dit mon nom ? indice je suis le daddy de geo...."
            autoFocus
          />
        </div>
      ) : !showPhotos ? (
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
      ) : (
        <div className="photos-container">
          {zoomedImage ? (
            <div className="zoomed-image-container" onClick={closeZoomedImage}>
              <img src={zoomedImage} alt="Zoomed" className="zoomed-image" />
            </div>
          ) : null}
          <h1>Nos plus beaux souvenirs ❤️</h1>
          <div className="photos-grid">
            {images.map((image, index) => (
              <div key={index} className="photo-wrapper" onClick={() => handleImageClick(image)}>
                <img src={image} alt={`Photo ${index + 1}`} className="photo" onError={() => console.log(`Failed to load image: ${image}`)} />
              </div>
            ))}
          </div>
          <div className="question-overlay">
            <h2>Alors, on se voit demain ?</h2>
            <div className="overlay-buttons">
              <button className="overlay-no-button" onMouseOver={moveNoButtonAway} style={{ position: 'relative', left: `${noButtonPosition.x}px`, top: `${noButtonPosition.y}px` }}>Non</button>
              <button className="overlay-yes-button">Oui !</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
