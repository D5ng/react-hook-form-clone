import { FieldState, FieldValues, RegisterOptions } from "@/types/form"

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

export function hasAnyError<TFieldValues extends FieldValues>(errors: FieldState<TFieldValues, string>) {
  return Object.values(errors).some((error) => error) || Object.keys(errors).length === 0
}

export function validateForm<TFieldValues extends FieldValues>(
  values: TFieldValues,
  validateLookup: Partial<FieldState<TFieldValues, RegisterOptions>>
) {
  let errors: FieldState<TFieldValues, string> = {}

  for (const field in values) {
    const fieldValue = values[field]
    const filedValidate = validateLookup[field]
    const fieldErrors = validateField(fieldValue, field, filedValidate)
    errors = { ...errors, ...fieldErrors }
  }

  return errors
}
