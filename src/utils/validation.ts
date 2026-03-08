export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const INDIAN_PHONE_REGEX = /^(\+91)?[6-9]\d{9}$/;
export const TIME_12_HOUR_REGEX = /^(0[1-9]|1[0-2]):[0-5]\d (AM|PM)$/;
export const TIME_24_HOUR_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
export const DATE_ISO_REGEX = /^\d{4}-\d{2}-\d{2}$/;
export const NAME_REGEX = /^[A-Za-z][A-Za-z\s.'-]{1,99}$/;

export const INDIAN_PHONE_INPUT_PATTERN = "(\\+91)?[6-9]\\d{9}";

export const validateName = (value: string): boolean => NAME_REGEX.test(value.trim());

export const validateEmailAddress = (value: string): boolean => EMAIL_REGEX.test(value.trim());

export const validatePhoneNumber = (value: string): boolean => {
  const normalized = value.replace(/[\s-]/g, "");
  return INDIAN_PHONE_REGEX.test(normalized);
};

export const validateTime = (value: string): boolean => TIME_12_HOUR_REGEX.test(value.trim());

export const validateTime24Hour = (value: string): boolean => TIME_24_HOUR_REGEX.test(value.trim());

export const validateISODate = (value: string): boolean => DATE_ISO_REGEX.test(value.trim());

export interface ScheduleVisitFormValues {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  note: string;
}

export type ScheduleVisitFormErrors = Partial<Record<keyof ScheduleVisitFormValues, string>>;

export const sanitizeIndianPhoneLocalInput = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  return (digits.startsWith("91") && digits.length > 10 ? digits.slice(2) : digits).slice(0, 10);
};

export const toIndianE164Phone = (value: string): string | null => {
  const digits = value.replace(/\D/g, "");
  if (!digits) {
    return null;
  }
  if (digits.startsWith("91") && digits.length === 12) {
    const normalized = `+${digits}`;
    return validatePhoneNumber(normalized) ? normalized : null;
  }
  const normalized = `+91${digits}`;
  return validatePhoneNumber(normalized) ? normalized : null;
};

export const validateScheduleVisitForm = (values: ScheduleVisitFormValues): ScheduleVisitFormErrors => {
  const errors: ScheduleVisitFormErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const date = values.date.trim();
  const time = values.time.trim();
  const note = values.note.trim();

  if (!name) {
    errors.name = "Name is required.";
  } else if (!validateName(name)) {
    errors.name = "Please enter a valid name.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!validateEmailAddress(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!phone) {
    errors.phone = "Phone number is required.";
  } else if (!validatePhoneNumber(phone)) {
    errors.phone = "Please enter a valid Indian phone number.";
  }

  if (!date) {
    errors.date = "Preferred date is required.";
  } else if (!validateISODate(date)) {
    errors.date = "Please select a valid preferred date.";
  }

  if (!time) {
    errors.time = "Preferred time is required.";
  } else if (!validateTime24Hour(time)) {
    errors.time = "Please select a valid preferred time.";
  }

  if (!note) {
    errors.note = "Message is required.";
  }

  return errors;
};
