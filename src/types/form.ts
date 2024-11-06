// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FieldValues = Record<any, string>

export type FieldState<TFieldValues, FieldStateType> = Partial<Record<keyof TFieldValues, FieldStateType>>

export interface UseFormState<TFieldValues> {
  values: TFieldValues
  touchedFields: FieldState<TFieldValues, boolean>
  errors: FieldState<TFieldValues, string>
  isSubmitting: boolean
}

export interface UseFormParams<TFieldValues> {
  defaultValues: TFieldValues
}

export interface UseFormReturn<TFieldValues> {
  formState: UseFormState<TFieldValues>
}
