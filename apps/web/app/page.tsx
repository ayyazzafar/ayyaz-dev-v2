export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      background: '#0a0a0a',
      color: '#ededed'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        ayyaz.dev
      </h1>
      <p style={{ color: '#888', marginBottom: '2rem' }}>
        Portfolio rebuild in progress...
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <a
          href="/api"
          style={{
            padding: '0.75rem 1.5rem',
            background: '#333',
            borderRadius: '8px',
            color: '#fff',
            textDecoration: 'none'
          }}
        >
          Test API →
        </a>
      </div>
      <p style={{ marginTop: '3rem', fontSize: '0.875rem', color: '#666' }}>
        NestJS + Next.js + Prisma + Neon
      </p>
    </main>
  );
}
