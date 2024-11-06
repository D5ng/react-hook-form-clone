import React from "react"
import { useForm } from "react-hook-form"

interface DefaultValues {
  email: string
  password: string
}

const defaultValues: DefaultValues = {
  email: "",
  password: "",
}

export default function HookForm() {
  const {
    formState: { touchedFields, errors, isSubmitting },
    register,
    setValue,
    setError,
    handleSubmit,
  } = useForm({ defaultValues })

  return <div>HookForm</div>
}
