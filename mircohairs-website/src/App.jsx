import React, { useState } from 'react';

// Sample data - Replace with your actual backend/API data
const PLAYABLE_GAMES = [
  {
    id: 'p1',
    title: 'Neon Cyber Runner',
    genre: 'Arcade / Platformer',
    rating: '4.8',
    image: 'https://via.placeholder.com/300x180?text=Cyber+Runner',
  },
  {
    id: 'p2',
    title: 'Pixel Dungeon Quest',
    genre: 'RPG / Puzzle',
    rating: '4.5',
    image: 'https://via.placeholder.com/300x180?text=Pixel+Dungeon',
  },
  {
    id: 'p3',
    title: 'Space Defense 2099',
    genre: 'Strategy',
    rating: '4.7',
    image: 'https://via.placeholder.com/300x180?text=Space+Defense',
  },
];

const STORE_GAMES = [
  {
    id: 's1',
    title: 'Chronicles of Eldoria',
    genre: 'Open World RPG',
    price: '$29.99',
    image: 'https://via.placeholder.com/300x180?text=Eldoria',
  },
  {
    id: 's2',
    title: 'Velocity Drift Unleashed',
    genre: 'Racing / Simulation',
    price: '$19.99',
    image: 'https://via.placeholder.com/300x180?text=Velocity+Drift',
  },
  {
    id: 's3',
    title: 'Shadow Realm Tactics',
    genre: 'Turn-Based Strategy',
    price: '$14.99',
    image: 'https://via.placeholder.com/300x180?text=Shadow+Realm',
  },
];

export default function App() {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = (gameTitle) => {
    setCartCount(cartCount + 1);
    alert(`Added "${gameTitle}" to your cart!`);
  };

  const handlePlayNow = (gameTitle) => {
    alert(`Launching browser engine for "${gameTitle}"...`);
    // Here you would navigate to the game player route (e.g., /play/:id)
  };

  return (
    <div style={styles.container}>
      {/* Navigation Bar */}
      <header style={styles.navbar}>
        <div style={styles.logo}>🎮 GamePortal</div>
        <nav style={styles.navLinks}>
          <a href="#play" style={styles.navLink}>Play Online</a>
          <a href="#store" style={styles.navLink}>Store & Downloads</a>
        </nav>
        <div style={styles.cart}>🛒 Cart ({cartCount})</div>
      </header>

      {/* Hero Banner */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Play Instant Games or Download Your Next Favorite</h1>
        <p style={styles.heroSubtitle}>
          Jump right into browser-playable titles or browse our marketplace for full downloadable PC games.
        </p>
        <div style={styles.heroButtons}>
          <a href="#play" style={{ ...styles.button, ...styles.primaryBtn }}>Play Free Online</a>
          <a href="#store" style={{ ...styles.button, ...styles.secondaryBtn }}>Browse Store</a>
        </div>
      </section>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        {/* Playable Games Section */}
        <section id="play" style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2>🕹️ Play in Browser</h2>
            <p>No downloads required. Click to play directly in your browser.</p>
          </div>
          <div style={styles.grid}>
            {PLAYABLE_GAMES.map((game) => (
              <div key={game.id} style={styles.card}>
                <img src={game.image} alt={game.title} style={styles.cardImage} />
                <div style={styles.cardBody}>
                  <h3>{game.title}</h3>
                  <p style={styles.genre}>{game.genre} • ★ {game.rating}</p>
                  <button 
                    style={{ ...styles.button, ...styles.playBtn }}
                    onClick={() => handlePlayNow(game.title)}
                  >
                    Play Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Downloadable Store Section */}
        <section id="store" style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2>🛒 Game Store (Downloadable)</h2>
            <p>Purchase full games and download installer keys instantly.</p>
          </div>
          <div style={styles.grid}>
            {STORE_GAMES.map((game) => (
              <div key={game.id} style={styles.card}>
                <img src={game.image} alt={game.title} style={styles.cardImage} />
                <div style={styles.cardBody}>
                  <h3>{game.title}</h3>
                  <p style={styles.genre}>{game.genre}</p>
                  <div style={styles.priceRow}>
                    <span style={styles.price}>{game.price}</span>
                    <button 
                      style={{ ...styles.button, ...styles.buyBtn }}
                      onClick={() => handleAddToCart(game.title)}
                    >
                      Buy & Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} GamePortal. All rights reserved.</p>
      </footer>
    </div>
  );
}
