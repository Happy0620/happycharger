import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Navbar() {
  const location = useLocation();
  const { user, logout, cart } = useAppContext();
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const profilePhoto = user ? localStorage.getItem('feasto_photo_' + user.id) : null;
  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  // JIRA: ADMIN-01 - Dedicated Admin Navbar
  // Completely isolates the admin view by hiding customer features (Cart, Home, Restaurants)
  if (user?.role === 'admin') {
    return (
      <nav className="navbar">
        <Link to="/admin" className="logo">Feasto Admin</Link>
        <div className="nav-links">
          <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Dashboard</Link>
          <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Admin Profile</Link>
        </div>
        <div className="nav-auth">
          <span style={{ fontWeight: 600 }}>Hi, {user.name}</span>
          <Link to="/profile" title={user.name} style={{ textDecoration: 'none' }}>
            {profilePhoto ? (
              <img src={profilePhoto} alt={user.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-color)', cursor: 'pointer', display: 'block' }} />
            ) : (
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #F88435, #FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem', border: '2px solid var(--primary-color)' }}>
                {initials}
              </div>
            )}
          </Link>
          <button onClick={logout} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Logout</button>
        </div>
      </nav>
    );
  }

  // JIRA: CUST-01 - Standard Customer Navbar
  return (
    <nav className="navbar">
      <Link to="/" className="logo">Feasto</Link>
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        <a href="/#restaurants">Restaurants</a>
        {user && <Link to="/orders" className={location.pathname === '/orders' ? 'active' : ''}>Orders</Link>}
        <a href="/#contact">Contact</a>
      </div>
      <div className="nav-auth">
        {user ? (
          <>
            <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <i className="fa-solid fa-cart-shopping" style={{ fontSize: '1.2rem' }}></i>
              {cartItemsCount > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-12px', background: 'var(--primary-color)', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <Link to="/profile" title={user.name} style={{ textDecoration: 'none' }}>
              {profilePhoto ? (
                <img src={profilePhoto} alt={user.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-color)', cursor: 'pointer', display: 'block' }} />
              ) : (
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #F88435, #FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem', border: '2px solid var(--primary-color)' }}>
                  {initials}
                </div>
              )}
            </Link>
            <button onClick={logout} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-dark">Login</Link>
            <Link to="/signup" className="btn btn-primary">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
