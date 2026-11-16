import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { Link } from 'react-router';
import { register } from '../services/authService';

export default function RegisterPage() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleUserNameChange(event: ChangeEvent<HTMLInputElement>) {
    setUserName(event.target.value);
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      const result = await register({
        userName,
        email,
        password,
      });

      setMessage(result);
    } catch (caughtError) {
      if (caughtError instanceof Error) {
        setError(caughtError.message);
      } else {
        setError('Nie udało się zarejestrować.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h1>Rejestracja</h1>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {!message && (
        <form className="car-form" onSubmit={handleSubmit}>
          <label>
            Nazwa użytkownika
            <input
              type="text"
              value={userName}
              onChange={handleUserNameChange}
              required
            />
          </label>

          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </label>

          <label>
            Hasło
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Rejestrowanie...' : 'Zarejestruj się'}
          </button>
        </form>
      )}

      <p>
        Masz już konto? <Link to="/login">Zaloguj się</Link>
      </p>
    </section>
  );
}
