import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function OrderConfirmation() {
  const { state } = useLocation() as { state: any };
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const order = state?.order;

  return (
    <>
      <div className="container"><Navbar /></div>
      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>

        {/* Success animation */}
        <div style={{
          width: '100px', height: '100px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #F88435, #FFD93D)',
          margin: '0 auto 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '3rem', boxShadow: '0 8px 32px rgba(248,132,53,0.4)',
          animation: 'pop 0.5s ease'
        }}>
          🎉
        </div>

        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: '2rem', marginBottom: '8px', color: '#1A1208' }}>
          Order Placed!
        </h1>
        <p style={{ color: '#8A7060', fontSize: '1.05rem', marginBottom: '32px' }}>
          Your food is being prepared with love{dots}
        </p>

        {/* Order card */}
        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #EDE8E3', padding: '28px', marginBottom: '24px', textAlign: 'left', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          {order && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #EDE8E3' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#8A7060', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Order ID</div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.1rem' }}>#{order._id?.slice(-6).toUpperCase()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.78rem', color: '#8A7060', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Status</div>
                  <span style={{ background: '#FFF0E6', color: '#F88435', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem' }}>
                    🕐 Pending
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #EDE8E3' }}>
                <div style={{ fontSize: '0.78rem', color: '#8A7060', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Delivery Address</div>
                <div style={{ fontWeight: 500 }}>{order.deliveryAddress}</div>
              </div>

              <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #EDE8E3' }}>
                <div style={{ fontSize: '0.78rem', color: '#8A7060', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Estimated Delivery</div>
                <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#F88435' }}>30–45 minutes 🛵</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                <span>Total Paid</span>
                <span style={{ color: '#F88435' }}>${order.totalAmount?.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        {/* Progress tracker */}
        <div style={{ background: '#FAF8F5', borderRadius: '16px', padding: '20px', marginBottom: '32px', border: '1px solid #EDE8E3' }}>
          <div style={{ fontSize: '0.82rem', color: '#8A7060', marginBottom: '16px', fontWeight: 600 }}>LIVE ORDER TRACKING</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {[
              { label: 'Order Placed', icon: '✅', done: true },
              { label: 'Preparing', icon: '👨‍🍳', done: false },
              { label: 'On the way', icon: '🛵', done: false },
              { label: 'Delivered', icon: '🏠', done: false },
            ].map((step, i, arr) => (
              <React.Fragment key={step.label}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: step.done ? '#F88435' : '#EDE8E3',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem'
                  }}>
                    {step.icon}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: step.done ? '#F88435' : '#8A7060', fontWeight: step.done ? 700 : 400 }}>{step.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ flex: 1, height: '3px', background: step.done ? '#F88435' : '#EDE8E3', margin: '0 6px', marginBottom: '20px', borderRadius: '2px' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/orders" className="btn btn-primary" style={{ padding: '12px 28px' }}>
            📦 Track Orders
          </Link>
          <Link to="/" className="btn btn-outline" style={{ padding: '12px 28px' }}>
            🏠 Back to Home
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}