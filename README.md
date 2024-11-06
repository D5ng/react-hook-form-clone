# React Hook Form과 유사한 인터페이스 만들기

상태관리를 이용해 React Hook Form과 유사한 인터페이스 구현하기.

| 만드는 이유 => 관리하는 폼이 많다면 사용하는게 이점이 있을 수 있지만 관리하는 폼이 적다면 성능상 이점을 얻기 힘들다.

## 구현할 기능

- `formState`(values, errors, touchedFields, isSubmitting): 폼의 상태를 관리하는 객체로, 입력된 값, 에러, 터치된 필드, 제출 상태 등을 추적
- `register`(name, onChange, onBlur, validation): 각 폼 필드를 등록하고, 해당 필드의 이벤트와 유효성 검사를 처리하는 함수
- `handleSubmit`: 폼 제출 시 호출되는 함수로, 유효성 검사를 통과하면 제출을 처리하는 역할
- `setValue`: 특정 필드의 값을 설정하는 함수
- `setError`: 특정 필드에 에러 메시지를 설정하는 함수

```tsx
const {
  formState: { touchedFields, errors },
  register,
  setValue,
  setError,
  handleSubmit,
} = useForm({ defaultValues })
```
