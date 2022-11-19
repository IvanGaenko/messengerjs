import bcrypt from 'bcryptjs';
import { salt_rows } from '../config/env';

export const comparePassword = (password, dbPassword) =>
  bcrypt.compare(password, dbPassword);

export const hashPassword = (password) => bcrypt.hash(password, salt_rows);
