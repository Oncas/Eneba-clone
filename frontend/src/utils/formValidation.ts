import { KeyType, KEY_TYPE_OPTIONS } from '../types/keyType';

export interface ValidationErrors {
  name?: string;
  price?: string;
  keyType?: string;
  creatorEmail?: string;
  images?: string;
}

export const validateGameForm = (formData: {
  name: string;
  price: number;
  keyType: KeyType | string;
  creatorEmail: string;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!formData.name.trim()) {
    errors.name = 'Name is required';
  }

  if (formData.price <= 0) {
    errors.price = 'Price must be greater than 0';
  }

  if (!formData.keyType || !formData.keyType.trim()) {
    errors.keyType = 'Key Type is required';
  } else if (!KEY_TYPE_OPTIONS.includes(formData.keyType as KeyType)) {
    errors.keyType = 'Please select a valid key type';
  }

  if (!formData.creatorEmail.trim()) {
    errors.creatorEmail = 'Creator Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.creatorEmail)) {
    errors.creatorEmail = 'Please enter a valid email address';
  }

  return errors;
};
