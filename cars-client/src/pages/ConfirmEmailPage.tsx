import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { confirmEmail } from '../services/authService';

export default function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const token = searchParams.get('token');
  const [message, setMessage] = useState('Potwierdzanie konta...');

  useEffect(() => {
    if (!userId || !token) {
      return;
    }

    async function confirm() {
      try {
        const result = await confirmEmail(userId!, token!);
        setMessage(result);
      } catch {
        setMessage('Nie udało się potwierdzić konta.');
      }
    }

    confirm();
  }, [userId, token]);

  if (!userId || !token) {
    return (
      <section>
        <h1>Nieprawidłowy link</h1>
        <Link to="/login">Przejdź do logowania</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Potwierdzenie konta</h1>
      <p>{message}</p>
      <Link to="/login">Przejdź do logowania</Link>
    </section>
  );
}
