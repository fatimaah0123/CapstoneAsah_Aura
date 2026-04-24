import { registerUser, loginUser } from './api';

export const register = async (formData) => {
  return await registerUser(formData);
};

export const login = async (formData) => {
  return await loginUser({
    email: formData.userId,
    password: formData.password
  });
};