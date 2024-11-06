import { useState } from "react"
import type { FieldValues, UseFormParams, UseFormReturn, UseFormState } from "@/types/form"

export default function useForm<TFieldValues extends FieldValues = FieldValues>({
  defaultValues,
}: UseFormParams<TFieldValues>): UseFormReturn<TFieldValues> {
  const [formState, setFormState] = useState<UseFormState<TFieldValues>>({
    values: defaultValues,
    touchedFields: {},
    errors: {},
    isSubmitting: false,
  })

  return {
    formState,
  }
}
