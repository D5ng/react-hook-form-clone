/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormEvent } from "react"

export type FieldValues = Record<string, any>

export type FieldState<TFieldValues, FieldStateType> = Partial<Record<keyof TFieldValues, FieldStateType>>

export type FieldName<TFieldValues extends FieldValues> = keyof TFieldValues

export type FieldElement = HTMLInputElement | HTMLTextAreaElement

export type ChangeHandler = (event: { target: any; type?: any }) => void

export interface UseFormState<TFieldValues> {
  values: TFieldValues
  touchedFields: FieldState<TFieldValues, boolean>
  errors: FieldState<TFieldValues, string>
  isSubmitting: boolean
  isValid: boolean
  defaultValues: Readonly<TFieldValues>
}

export interface UseFormParams<TFieldValues> {
  defaultValues: TFieldValues
}

export interface UseFormReturn<TFieldValues extends FieldValues> {
  formState: UseFormState<TFieldValues>
  register: UseFormRegister<TFieldValues>
  handleSubmit: UseFormHandleSubmit<TFieldValues>
  setValue: UseFormSetValue<TFieldValues>
  setError: UseFormSetError<TFieldValues>
  reset: () => void
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
  onChange: ChangeHandler
  onBlur: ChangeHandler
  value: TFieldValues[TFieldName]
}

export type SubmitHandler<TFieldValues> = (data: TFieldValues) => Promise<void> | void

export type SubimtErrorHandler = (error: Error) => Promise<void> | void

export type UseFormHandleSubmit<TFieldValues extends FieldValues> = (
  onValid: SubmitHandler<TFieldValues>,
  onInvalid?: SubimtErrorHandler
) => (event: FormEvent) => Promise<void>

export type UseFormSetValue<TFieldValues extends FieldValues> = <TFieldName extends keyof TFieldValues>(
  field: TFieldName,
  value: any
) => void

export type UseFormSetError<TFieldValues extends FieldValues> = <TFieldName extends keyof TFieldValues>(
  field: TFieldName,
  message: string
) => void
