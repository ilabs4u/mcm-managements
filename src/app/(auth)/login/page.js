import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Sign In — MCM Franchise',
  description: 'Sign in to your MCM franchise management portal.',
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;
  return <LoginForm errorParam={error} />;
}

