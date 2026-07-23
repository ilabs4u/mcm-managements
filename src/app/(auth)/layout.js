// Auth layout — centered, minimal shell for login/register/pending pages
export default function AuthLayout({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      {children}
    </div>
  );
}

