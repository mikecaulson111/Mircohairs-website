import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import ConstellationCanvas from './components/ConstellationCanvas';
import NewConstellationCanvas from './components/NewConstellationCanvas';

const PLAYABLE_GAMES = [
  {id: 'angle-maker', title: 'Angle Maker', genre: 'Math', rating: '3.5', gameComponent: <ConstellationCanvas />},
  {id: 'new-angle-maker', title: 'Angle Maker Game', genre: 'Math', rating: '3.5', gameComponent: <NewConstellationCanvas />},
];

const STORE_GAMES = [
  { id: 'eldoria', title: 'Chronicles of Eldoria', genre: 'Open World RPG', price: 29.99 },
  { id: 'velocity-drift', title: 'Velocity Drift Unleashed', genre: 'Racing', price: 19.99 },
];

export default function App() {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (game) => {
    setCart((prev) => [...prev, game]);
  };

  return (
    <div style={styles.container}>
      {/* Top Navigation Bar */}
      <header style={styles.navbar}>
        <Link to="/" style={styles.logo}>🎮 Mircohair's Shop</Link>
        <nav style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>Home & Store</Link>
          <Link to="/cart" style={styles.cartBtn}>🛒 Cart ({cart.length})</Link>
        </nav>
      </header>

      {/* Page Routing */}
      <Routes>
        <Route path="/" element={<HomePage onAddToCart={handleAddToCart} />} />
        <Route path="/play/:id" element={<GamePlayerPage />} />
        <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
      </Routes>

      <footer style={styles.footer}>
        <p style={styles.footerText}>© {new Date().getFullYear()} Mircohair's Shop. All rights reserved.</p>
      </footer>
    </div>
  );
}

/* ================= PAGE COMPONENTS ================= */

// 1. Home Page View
function HomePage({ onAddToCart }) {
  const navigate = useNavigate();

  return (
    <main style={styles.mainContent}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Play Instant Games or Download Full Titles</h1>
        <p style={styles.heroSubtitle}>Instant browser gaming or downloadable PC releases.</p>
      </section>

      {/* Playable Games */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>🕹️ Play in Browser</h2>
        <div style={styles.grid}>
          {PLAYABLE_GAMES.map((game) => (
            <div key={game.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{game.title}</h3>
              <p style={styles.genre}>{game.genre} • ★ {game.rating}</p>
              <button 
                style={{ ...styles.button, ...styles.playBtn }}
                onClick={() => navigate(`/play/${game.id}`)}
              >
                Play Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Store Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>🛒 Downloadable Store</h2>
        <div style={styles.grid}>
          {STORE_GAMES.map((game) => (
            <div key={game.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{game.title}</h3>
              <p style={styles.genre}>{game.genre}</p>
              <div style={styles.priceRow}>
                <span style={styles.price}>${game.price}</span>
                <button 
                  style={{ ...styles.button, ...styles.buyBtn }}
                  onClick={() => onAddToCart(game)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

// 2. Game Player View (/play/:id)
function GamePlayerPage() {
  const { id } = useParams();
  const game = PLAYABLE_GAMES.find((g) => g.id === id);

  if (!game) {
    return (
      <div style={styles.errorContainer}>
        <h2 style={styles.sectionTitle}>Game Not Found</h2>
        <Link to="/" style={styles.backBtn}>← Back to Home</Link>
      </div>
    );
  }

  return (
    <div style={styles.playerContainer}>
      <div style={styles.playerHeader}>
        <Link to="/" style={styles.backBtn}>← Back to Portal</Link>
        <h2 style={styles.cardTitle}>{game.title}</h2>
      </div>
      {game.gameComponent}
    </div>
  );
}

// 3. Cart & Checkout View (/cart)
function CartPage({ cart, setCart }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <main style={styles.mainContent}>
      <h2 style={styles.sectionTitle}>Your Cart</h2>
      {cart.length === 0 ? (
        <p style={styles.heroSubtitle}>Your cart is empty. <Link to="/" style={styles.inlineLink}>Browse games</Link></p>
      ) : (
        <div style={{ maxWidth: '600px' }}>
          {cart.map((item, index) => (
            <div key={index} style={styles.cartItem}>
              <span style={styles.cartItemName}>{item.title}</span>
              <span style={styles.price}>${item.price}</span>
            </div>
          ))}
          <div style={styles.cartTotal}>
            <span style={styles.cartTotalLabel}>Total:</span>
            <span style={styles.price}>${total.toFixed(2)}</span>
          </div>
          <button 
            style={{ ...styles.button, ...styles.buyBtn, width: '100%', marginTop: '20px' }}
            onClick={() => { alert('Proceeding to checkout payment...'); setCart([]); }}
          >
            Checkout & Receive Downloads
          </button>
        </div>
      )}
    </main>
  );
}

/* ================= HIGH-CONTRAST STYLES ================= */
const styles = {
  container: { 
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', 
    backgroundColor: '#121214', 
    color: '#ffffff', 
    minHeight: '100vh',
    margin: 0,
  },
  navbar: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '20px 40px', 
    backgroundColor: '#1a1a1e', 
    borderBottom: '1px solid #2a2a30' 
  },
  logo: { 
    fontSize: '24px', 
    fontWeight: 'bold', 
    color: '#00d2ff', // High-contrast neon cyan
    textDecoration: 'none' 
  },
  navLinks: { 
    display: 'flex', 
    gap: '20px', 
    alignItems: 'center' 
  },
  navLink: { 
    color: '#ffffff', // Crisp bright white
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '16px',
  },
  cartBtn: { 
    backgroundColor: '#2a2a30', 
    padding: '8px 16px', 
    borderRadius: '20px', 
    color: '#ffffff', 
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  hero: { 
    textAlign: 'center', 
    padding: '50px 20px',
    background: 'linear-gradient(180deg, #1a1a1e 0%, #121214 100%)',
  },
  heroTitle: { 
    fontSize: '38px', 
    color: '#ffffff', 
    margin: '0 0 12px 0' 
  },
  heroSubtitle: { 
    color: '#d0d0d5', // Bright off-white for body copy
    fontSize: '18px', 
    margin: 0 
  },
  mainContent: { 
    maxWidth: '1000px', 
    margin: '0 auto', 
    padding: '20px' 
  },
  section: { 
    marginTop: '40px' 
  },
  sectionTitle: { 
    fontSize: '26px', 
    color: '#ffffff', 
    marginBottom: '20px' 
  },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
    gap: '20px' 
  },
  card: { 
    backgroundColor: '#1a1a1e', 
    padding: '20px', 
    borderRadius: '8px', 
    border: '1px solid #33333d', 
    display: 'flex', 
    flexDirection: 'column' 
  },
  cardTitle: { 
    color: '#ffffff', 
    fontSize: '20px', 
    margin: '0 0 10px 0' 
  },
  genre: { 
    color: '#b0b0b8', // High-visibility light gray
    fontSize: '14px', 
    margin: '0 0 20px 0' 
  },
  priceRow: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 'auto' 
  },
  price: { 
    fontSize: '20px', 
    fontWeight: 'bold', 
    color: '#66bb6a' // Vibrant light green
  },
  button: { 
    padding: '10px 16px', 
    border: 'none', 
    borderRadius: '6px', 
    fontWeight: 'bold', 
    fontSize: '15px', 
    cursor: 'pointer' 
  },
  playBtn: { 
    backgroundColor: '#ff2a6d', // Vivid gaming pink/red
    color: '#ffffff', 
    marginTop: 'auto' 
  },
  buyBtn: { 
    backgroundColor: '#2e7d32', // Deep green with stark white text
    color: '#ffffff' 
  },
  playerContainer: { 
    maxWidth: '1000px', 
    margin: '20px auto', 
    padding: '0 20px' 
  },
  playerHeader: { 
    display: 'flex', 
    gap: '20px', 
    alignItems: 'center', 
    marginBottom: '20px' 
  },
  backBtn: { 
    color: '#00d2ff', 
    textDecoration: 'none', 
    fontWeight: 'bold',
    fontSize: '16px',
  },
  inlineLink: {
    color: '#00d2ff',
    textDecoration: 'underline',
  },
  iframeWrapper: { 
    position: 'relative', 
    width: '100%', 
    paddingTop: '56.25%', 
    backgroundColor: '#000000', 
    borderRadius: '8px', 
    overflow: 'hidden' 
  },
  iframe: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    border: 'none' 
  },
  errorContainer: { 
    textAlign: 'center', 
    padding: '60px' 
  },
  cartItem: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '15px 0', 
    borderBottom: '1px solid #33333d' 
  },
  cartItemName: {
    color: '#ffffff',
    fontSize: '16px',
  },
  cartTotal: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '20px 0', 
    fontWeight: 'bold', 
    fontSize: '20px' 
  },
  cartTotalLabel: {
    color: '#ffffff',
  },
  footer: { 
    textAlign: 'center', 
    padding: '30px', 
    borderTop: '1px solid #2a2a30', 
    marginTop: '60px' 
  },
  footerText: { 
    color: '#90909a', 
    margin: 0 
  },
};
