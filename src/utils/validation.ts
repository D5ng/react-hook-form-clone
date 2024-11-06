import { FieldValues, RegisterOptions } from "@/types/form"

export function validateField<TFieldValues extends FieldValues>(
  value: TFieldValues[keyof TFieldValues],
  field: keyof TFieldValues,
  options?: RegisterOptions
) {
  const errors: Partial<Record<keyof TFieldValues, string>> = {}

  if (!options) {
    return errors
  }

  if (options?.required && !value) {
    errors[field] = options.required.message
    return errors
  }

  if (options?.min && options.min.value > value?.length) {
    errors[field] = options.min.message
    return errors
  }

  if (options?.max && options.max.value < value?.length) {
    errors[field] = options.max.message
    return errors
  }

  if (options?.pattern && !options.pattern.value.test(value)) {
    errors[field] = options.pattern.message
    return errors
  }

  errors[field] = ""

  return errors
}
