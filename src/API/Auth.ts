import { LoginResponse, RegisterResponse } from '../Types/AuthTypes'
import {API} from './index.ts';

export const RegisterRequest = async (
  username: string,
  password: string,
  fullName: string
): Promise<RegisterResponse> => {
  return await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password, fullName })
  }).then((response) => response.json())
}

export const LoginRequest = async (username: string, password: string): Promise<LoginResponse> => {
  return await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  }).then((response) => response.json())
}

export const CheckAuth = async (token: string): Promise<boolean> => {
  const response = await fetch(`${API}/auth`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      token: token
    }
  })

  return response.status === 200
}
