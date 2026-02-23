export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const INDIAN_PHONE_REGEX = /^(\+91)?[6-9]\d{9}$/;
export const TIME_12_HOUR_REGEX = /^(0[1-9]|1[0-2]):[0-5]\d (AM|PM)$/;
export const NAME_REGEX = /^[A-Za-z][A-Za-z\s.'-]{1,99}$/;

export const INDIAN_PHONE_INPUT_PATTERN = "(\\+91)?[6-9]\\d{9}";

export const validateName = (value: string): boolean => NAME_REGEX.test(value.trim());

export const validateEmailAddress = (value: string): boolean => EMAIL_REGEX.test(value.trim());

export const validatePhoneNumber = (value: string): boolean => {
  const normalized = value.replace(/[\s-]/g, "");
  return INDIAN_PHONE_REGEX.test(normalized);
};

export const validateTime = (value: string): boolean => TIME_12_HOUR_REGEX.test(value.trim());
