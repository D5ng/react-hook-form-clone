import { ChangeEventHandler, FocusEventHandler } from "react"

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
}

export interface UseFormParams<TFieldValues> {
  defaultValues: TFieldValues
}

export interface UseFormReturn<TFieldValues extends FieldValues> {
  formState: UseFormState<TFieldValues>
  register: UseFormRegister<TFieldValues>
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
