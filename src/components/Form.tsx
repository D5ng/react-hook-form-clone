import useForm from "@/hooks/useForm"
import { useEffect } from "react"

interface DefaultValues {
  email: string
  password: string
}

const emailValidate = {
  required: {
    value: true,
    message: "이메일은 필수 입력 값이에요.",
  },
  min: {
    value: 5,
    message: "이메일은 5글자 이상이여야 해요.",
  },
  max: {
    value: 20,
    message: "이메일은 20글자 미만이여야 해요",
  },
  pattern: {
    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,})$/,
    message: "이메일 형식이 유효하지 않아요",
  },
}

const passwordValidate = {
  required: {
    value: true,
    message: "비밀번호는 필수 입력 값이에요.",
  },
}

const defaultValues: DefaultValues = {
  email: "",
  password: "",
}

export default function Form() {
  const { formState, register, handleSubmit, setError, setValue } = useForm<DefaultValues>({ defaultValues })

  const onSubmit = async (data: DefaultValues) => {
    console.log(data)
    try {
      await fetch("https://jsonplaceholder.typicode.com123/todos/1")
        .then((response) => response.json())
        .then((json) => console.log(json))
    } catch (error) {
      setError("email", "에러가 발생했어요")
    }
  }

  useEffect(() => {
    setValue("email", "test@gmail.com")
  }, [setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input type="text" id="email" {...register("email", emailValidate)} className="border border-slate-700" />
        {formState.errors.email && <p>{formState.errors.email}</p>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          {...register("password", passwordValidate)}
          className="border border-slate-700"
        />
        {formState.errors.password && <p>{formState.errors.password}</p>}
      </div>
      <button disabled={!formState.isValid || formState.isSubmitting}>Submit</button>
    </form>
  )
}
