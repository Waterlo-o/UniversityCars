import axios from 'axios';
import type { Car, NewCar } from '../models/Car';
import { apiClient } from '../api/apiClient';

function createServiceError(error: unknown, message: string): Error {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return new Error(`${message} Status HTTP: ${error.response.status}.`, {
        cause: error,
      });
    }

    if (error.request) {
      return new Error(`${message} Brak odpowiedzi z serwera.`, {
        cause: error,
      });
    }

    return new Error(`${message} ${error.message}`, {
      cause: error,
    });
  }

  return new Error(message, {
    cause: error,
  });
}

export async function getCars(signal?: AbortSignal): Promise<Car[]> {
  try {
    const response = await apiClient.get<Car[]>('/cars', {
      signal,
    });

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error;
    }

    throw createServiceError(error, 'Nie udalo sie pobrac samochodow.');
  }
}

export async function getCarById(
  id: string,
  signal?: AbortSignal
): Promise<Car> {
  try {
    const response = await apiClient.get<Car>(`/cars/${id}`, {
      signal,
    });

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error;
    }

    throw createServiceError(error, 'Nie udalo sie pobrac samochodu.');
  }
}

export async function createCar(car: NewCar): Promise<Car> {
  try {
    const response = await apiClient.post<Car>('/cars', car);
    return response.data;
  } catch (error) {
    throw createServiceError(error, 'Nie udalo sie dodac samochodu.');
  }
}

export async function updateCar(id: string, car: NewCar): Promise<void> {
  try {
    await apiClient.put(`/cars/${id}`, car);
  } catch (error) {
    throw createServiceError(error, 'Nie udalo sie zaktualizowac samochodu.');
  }
}

export async function deleteCar(id: string): Promise<void> {
  try {
    await apiClient.delete(`/cars/${id}`);
  } catch (error) {
    throw createServiceError(error, 'Nie udalo sie usunac samochodu.');
  }
}
