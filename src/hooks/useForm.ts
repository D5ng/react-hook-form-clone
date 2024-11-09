import { useCallback, useEffect, useRef, useState } from "react"
import type {
  FieldState,
  FieldValues,
  RegisterOptions,
  UseFormHandleSubmit,
  UseFormParams,
  UseFormRegister,
  UseFormReturn,
  UseFormSetError,
  UseFormSetValue,
  UseFormState,
  ChangeHandler,
} from "@/types/form"
import { hasAnyError, validateField, validateForm } from "@/utils/validation"

export default function useForm<TFieldValues extends FieldValues = FieldValues>({
  defaultValues,
}: UseFormParams<TFieldValues>): UseFormReturn<TFieldValues> {
  const [formState, setFormState] = useState<UseFormState<TFieldValues>>({
    values: defaultValues,
    touchedFields: {},
    errors: {},
    isSubmitting: false,
    isValid: false,
    defaultValues,
  })

  const validateOptions = useRef<Partial<FieldState<TFieldValues, RegisterOptions>>>({})

  const handleChange: ChangeHandler = useCallback((event) => {
    const field = event.target.name
    const fieldValue = event.target.value
    const filedValidate = validateOptions.current[field]
    const fieldErrors = validateField(fieldValue, field, filedValidate)
    const isBlurEvent = event.type === "blur"

    setFormState((prevFormState) => {
      const isEqualValue = prevFormState.values[field] === fieldValue && fieldValue.trim().length !== 0
      const error = isEqualValue ? { [field]: prevFormState.errors[field] } : fieldErrors

      return {
        ...prevFormState,
        values: { ...prevFormState.values, [field]: fieldValue },
        errors: isBlurEvent ? { ...prevFormState.errors, ...error } : { ...prevFormState.errors, ...fieldErrors },
        touchedFields: isBlurEvent ? { ...prevFormState.touchedFields, [field]: true } : prevFormState.touchedFields,
      }
    })
  }, [])

  const handleError = useCallback(
    (error: FieldState<TFieldValues, string>) =>
      setFormState((prevFormState) => ({
        ...prevFormState,
        errors: { ...prevFormState.errors, ...error },
      })),
    []
  )

  const reset = useCallback(() => {
    setFormState((prevFormState) => ({
      values: prevFormState.defaultValues,
      touchedFields: {},
      errors: {},
      isValid: false,
      isSubmitting: false,
      defaultValues: prevFormState.defaultValues,
    }))
  }, [])

  const handleSubmit: UseFormHandleSubmit<TFieldValues> = (onSubmit, onError) => async (event) => {
    event.preventDefault()
    const errors = validateForm(formState.values, validateOptions.current)

    if (hasAnyError(errors)) {
      handleError(errors)
      return
    }

    setFormState((prevFormState) => ({ ...prevFormState, isSubmitting: true }))

    try {
      await onSubmit(formState.values)
    } catch (error) {
      const err = error as Error
      if (onError) {
        onError(err)
      }
    } finally {
      setFormState((prevFormState) => ({ ...prevFormState, isSubmitting: false }))
    }
  }

  const setValue: UseFormSetValue<TFieldValues> = useCallback((field, value) => {
    setFormState((prevFormState) => ({ ...prevFormState, values: { ...prevFormState.values, [field]: value } }))
  }, [])

  const setError: UseFormSetError<TFieldValues> = useCallback((field, message) => {
    setFormState((prevFormState) => ({ ...prevFormState, errors: { ...prevFormState.errors, [field]: message } }))
  }, [])

  useEffect(() => {
    const errors = validateForm(formState.values, validateOptions.current)

    if (hasAnyError(errors)) {
      setFormState((prevFormState) => ({ ...prevFormState, isValid: false }))
      return
    }

    setFormState((prevFormState) => ({ ...prevFormState, isValid: true }))
  }, [formState.errors, formState.values])

  const register: UseFormRegister<TFieldValues> = useCallback(
    (name, options) => {
      if (options) {
        validateOptions.current[name] = options
      }

      return {
        name,
        value: formState.values[name],
        onChange: handleChange,
        onBlur: handleChange,
      }
    },
    [formState.values, handleChange]
  )

  return {
    formState,
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
  }
}
