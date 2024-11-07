import { ChangeEventHandler, FocusEventHandler, useCallback, useEffect, useRef, useState } from "react"
import type {
  FieldElement,
  FieldState,
  FieldValues,
  RegisterOptions,
  UseFormHandleSubmit,
  UseFormParams,
  UseFormRegister,
  UseFormReturn,
  UseFormState,
} from "@/types/form"
import { allFieldsValid, allTouchedFields, hasAnyError, validateField } from "@/utils/validation"

export default function useForm<TFieldValues extends FieldValues = FieldValues>({
  defaultValues,
}: UseFormParams<TFieldValues>): UseFormReturn<TFieldValues> {
  const [formState, setFormState] = useState<UseFormState<TFieldValues>>({
    values: defaultValues,
    touchedFields: {},
    errors: {},
    isSubmitting: false,
    isValid: false,
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
      const fieldValue = values[field]
      const filedValidate = validateOptions.current[field]
      const fieldErrors = validateField(fieldValue, field, filedValidate)
      errors = { ...errors, ...fieldErrors }
    }

    return errors
  }, [])

  const setAllTouchedFields = useCallback(
    () =>
      setFormState((prevFormState) => ({
        ...prevFormState,
        touchedFields: allTouchedFields<TFieldValues>(prevFormState.values),
      })),
    []
  )

  const handleSubmit: UseFormHandleSubmit<TFieldValues> = (onSubmit) => async (event) => {
    event.preventDefault()
    const errors = validateForm(formState.values)

    setAllTouchedFields()

    if (hasAnyError(errors)) {
      handleError(errors)
      return
    }

    setFormState((prevFormState) => ({ ...prevFormState, isSubmitting: true }))

    try {
      await onSubmit(formState.values)
      setFormState((prevFormState) => ({ ...prevFormState, isValid: true, touchedFields: {} }))
    } catch (error) {
      console.log(error)
    } finally {
      setFormState((prevFormState) => ({ ...prevFormState, isSubmitting: false }))
    }
  }

  useEffect(() => {
    const errors = validateForm(formState.values)

    if (allFieldsValid(errors)) {
      setFormState((prevFormState) => ({ ...prevFormState, isValid: true }))
    }

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
    handleSubmit,
  }
}
