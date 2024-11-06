import { ChangeEventHandler, FocusEventHandler, FormEvent } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FieldValues = Record<string, any>

export type FieldState<TFieldValues, FieldStateType> = Partial<Record<keyof TFieldValues, FieldStateType>>

export type FieldElement = HTMLInputElement | HTMLTextAreaElement

export type FieldName<TFieldValues extends FieldValues> = keyof TFieldValues

export interface UseFormState<TFieldValues> {
  values: TFieldValues
  touchedFields: FieldState<TFieldValues, boolean>
  errors: FieldState<TFieldValues, string>
  isSubmitting: boolean
  isValid: boolean
}

export interface UseFormParams<TFieldValues> {
  defaultValues: TFieldValues
}

export interface UseFormReturn<TFieldValues extends FieldValues> {
  formState: UseFormState<TFieldValues>
  register: UseFormRegister<TFieldValues>
  handleSubmit: UseFormHandleSubmit<TFieldValues>
}

export type RegisterOptions = Partial<{
  required: { value: boolean; message: string }
  min: { value: number; message: string }
  max: { value: number; message: string }
  pattern: { value: RegExp; message: string }
}>

export type UseFormRegister<TFieldValues extends FieldValues> = <TFieldName extends keyof TFieldValues>(
  name: TFieldName,
  options?: RegisterOptions
) => UseFormRegisterReturn<TFieldName, TFieldValues>

export type UseFormRegisterReturn<TFieldName extends keyof TFieldValues, TFieldValues> = {
  name: TFieldName
  onChange: ChangeEventHandler<FieldElement>
  onBlur: FocusEventHandler<FieldElement>
  value: TFieldValues[TFieldName]
}

export type SubmitHandler<TFieldValues> = (data: TFieldValues) => Promise<void> | void

export type UseFormHandleSubmit<TFieldValues extends FieldValues> = (
  onValid: SubmitHandler<TFieldValues>
) => (event: FormEvent) => Promise<void>
