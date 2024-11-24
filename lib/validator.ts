export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmail(email: string): ValidationError | null {
  email = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!email)
    return { field: 'email', message: 'Email is required' };
  if(!emailRegex.test(email))
    return { field: 'email', message: 'Invalid email format' };
  return null;
}

export function validatePassword(password: string): ValidationError | null {
  password = password.trim();
  if(!password)
    return { field: 'password', message: 'Password is required' };
  if(password.length < 5)
    return { field: 'password', message: 'Password must be at least 5 characters' };
  return null;
}

export function validateConfirmPassword(password: string, confirmPassword: string): ValidationError | null {
  password = password.trim();
  confirmPassword = confirmPassword.trim();
  if(!confirmPassword)
    return { field: 'confirmPassword', message: 'Please confirm your password' };
  if(password !== confirmPassword)
    return { field: 'confirmPassword', message: 'Passwords do not match' };
  return null;
}

export function validateUsername(username: string): ValidationError | null {
  username = username.trim();
  if(!username)
    return { field: 'username', message: 'Username is required' };
  if(username.length < 4)
    return { field: 'username', message: 'Username must be at least 4 characters' };
  return null;
}