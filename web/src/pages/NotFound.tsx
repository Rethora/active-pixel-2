export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
        404: Page Not Found
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
        Time to get active and head back to a known location.
      </p>
      <a
        href="/"
        style={{
          backgroundColor: '#1976d2',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '4px',
          textDecoration: 'none',
          fontSize: '1.1rem',
          transition: 'background-color 0.3s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1565c0')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1976d2')}
      >
        Return to Home
      </a>
    </div>
  );
}
