import axios from 'axios';
import type { LoginData, RegisterData, User } from '../models/Auth';
import { apiClient } from '../api/apiClient';

function createServiceError(error: unknown, fallbackMessage: string): Error {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = error.response.data;
      if (typeof data === 'string' && data.length > 0) {
        return new Error(data);
      }
      if (Array.isArray(data) && data.length > 0) {
        return new Error(data.join(' '));
      }
      if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
        return new Error(data.message);
      }
      return new Error(`Błąd serwera (${error.response.status}).`);
    }
    if (error.request) {
      return new Error('Brak odpowiedzi z serwera.');
    }
  }
  return new Error(fallbackMessage);
}

export async function login(data: LoginData): Promise<User> {
  try {
    const response = await apiClient.post<User>('/account/login', data);
    return response.data;
  } catch (error) {
    throw createServiceError(error, 'Nie udało się zalogować.');
  }
}

export async function register(data: RegisterData): Promise<string> {
  try {
    const response = await apiClient.post<{ message: string }>('/account/register', data);
    return response.data.message;
  } catch (error) {
    throw createServiceError(error, 'Nie udało się zarejestrować.');
  }
}

export async function confirmEmail(userId: string, token: string): Promise<string> {
  try {
    const response = await apiClient.get<{ message: string }>('/account/confirm-email', {
      params: {
        userId,
        token,
      },
    });
    return response.data.message;
  } catch (error) {
    throw createServiceError(error, 'Nie udało się potwierdzić konta.');
  }
}

export async function forgotPassword(email: string): Promise<string> {
  try {
    const response = await apiClient.post<{ message: string }>('/account/forgot-password', {
      email,
    });
    return response.data.message;
  } catch (error) {
    throw createServiceError(error, 'Nie udało się wysłać linku resetującego.');
  }
}

export async function resetPassword(
  email: string,
  token: string,
  newPassword: string,
): Promise<string> {
  try {
    const response = await apiClient.post<{ message: string }>('/account/reset-password', {
      email,
      token,
      newPassword,
    });
    return response.data.message;
  } catch (error) {
    throw createServiceError(error, 'Nie udało się zmienić hasła.');
  }
}
