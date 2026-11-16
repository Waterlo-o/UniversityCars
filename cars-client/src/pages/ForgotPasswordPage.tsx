import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { Link } from 'react-router';
import { forgotPassword } from '../services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      const result = await forgotPassword(email);
      setMessage(result);
    } catch (caughtError) {
      if (caughtError instanceof Error) {
        setError(caughtError.message);
      } else {
        setError('Nie udało się wysłać linku resetującego.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h1>Resetowanie hasła</h1>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {!message && (
        <form className="car-form" onSubmit={handleSubmit}>
          <label>
            Podaj adres e-mail przypisany do konta:
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Wysyłanie...' : 'Wyślij link resetujący'}
          </button>
        </form>
      )}

      <p>
        <Link to="/login">Wróć do logowania</Link>
      </p>
    </section>
  );
}
