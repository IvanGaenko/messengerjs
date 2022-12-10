import bcrypt from 'bcryptjs';
import { saltRows } from '../config/env';

export const comparePassword = (password, dbPassword) =>
  bcrypt.compare(password, dbPassword);

export const hashPassword = (password) => bcrypt.hash(password, saltRows);
