import { ChangeEventHandler, FocusEventHandler, useCallback, useEffect, useRef, useState } from "react"
import type {
  FieldElement,
  FieldState,
  FieldValues,
  RegisterOptions,
  UseFormParams,
  UseFormRegister,
  UseFormReturn,
  UseFormState,
} from "@/types/form"
import { validateField } from "@/utils/validation"

export default function useForm<TFieldValues extends FieldValues = FieldValues>({
  defaultValues,
}: UseFormParams<TFieldValues>): UseFormReturn<TFieldValues> {
  const [formState, setFormState] = useState<UseFormState<TFieldValues>>({
    values: defaultValues,
    touchedFields: {},
    errors: {},
    isSubmitting: false,
  })

  const validateOptions = useRef<Partial<Record<keyof TFieldValues, RegisterOptions>>>({})

  const handleChange: ChangeEventHandler<FieldElement> = useCallback(
    (event) =>
      setFormState((prevFormState) => ({
        ...prevFormState,
        values: { ...prevFormState.values, [event.target.name]: event.target.value },
      })),
    []
  )

  const handleBlur: FocusEventHandler<FieldElement> = useCallback((event) => {
    setFormState((prevFormState) => ({
      ...prevFormState,
      touchedFields: { ...prevFormState.touchedFields, [event.target.name]: true },
    }))
  }, [])

  const handleError = useCallback(
    (error: FieldState<TFieldValues, string>) =>
      setFormState((prevFormState) => ({
        ...prevFormState,
        errors: { ...prevFormState.errors, ...error },
      })),
    []
  )

  const validateForm = useCallback((values: TFieldValues) => {
    let errors: FieldState<TFieldValues, string> = {}

    for (const field in values) {
      const fieldErrors = validateField(
        values[field],
        field as keyof TFieldValues,
        validateOptions.current[field] as RegisterOptions
      )

      errors = { ...errors, ...fieldErrors }
    }

    return errors
  }, [])

  useEffect(() => {
    const errors = validateForm(formState.values)
    handleError(errors)
  }, [formState.values, handleError, validateForm])

  const register: UseFormRegister<TFieldValues> = useCallback(
    (name, options) => {
      if (options) {
        validateOptions.current[name] = options
      }

      return {
        name,
        value: formState.values[name],
        onChange: handleChange,
        onBlur: handleBlur,
      }
    },
    [formState.values, handleBlur, handleChange]
  )

  return {
    formState,
    register,
  }
}
