import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser, clearAuthError } from '../features/auth/authSlice'
import { useState } from 'react'

const DEFAULT_AVATAR = 'https://placehold.co/200x200/ece5d6/6e5228?text=User'

const RegisterSchema = Yup.object({
  username: Yup.string().min(3, 'Мінімум 3 символи').required("Ім'я користувача обов'язкове"),
  firstName: Yup.string().required("Ім'я обов'язкове"),
  lastName: Yup.string().required("Прізвище обов'язкове"),
  email: Yup.string().email('Некоректний email').required("Email обов'язковий"),
  password: Yup.string().min(6, 'Мінімум 6 символів').required("Пароль обов'язковий"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Паролі не збігаються')
    .required('Підтвердіть пароль'),
      image: Yup.string().test(
    'is-url-or-empty',
    'Вкажи посилання на фото (https://…) або лиши порожнім',
    (value) => !value || /^https?:\/\//.test(value)
  ),
})

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { error } = useSelector((state) => state.auth)
  const [success, setSuccess] = useState(false)

  return (
    <div className="form-page">
      <h1>Реєстрація</h1>
      <p className="form-page__sub">
        Створіть акаунт, щоб зберігати вироби в обраному та першими дізнаватись про знижки.
      </p>

      {error && <div className="form-banner-error">{String(error)}</div>}
      {success && (
        <div className="form-banner-success">
          Акаунт створено! Тепер увійдіть, використовуючи свій email і пароль.
        </div>
      )}

      <Formik
        initialValues={{
          username: '',
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          image: '',
        }}
        validationSchema={RegisterSchema}
        onSubmit={async (values, { setSubmitting }) => {
          dispatch(clearAuthError())
          const { confirmPassword, ...rest } = values
          const payload = { ...rest, image: rest.image || DEFAULT_AVATAR }
          const result = await dispatch(registerUser(payload))
          setSubmitting(false)
          if (registerUser.fulfilled.match(result)) {
            setSuccess(true)
            setTimeout(() => navigate('/login'), 1200)
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="username">Імʼя користувача</label>
              <Field id="username" name="username" type="text" />
              <ErrorMessage name="username" component="div" className="form-error" />
            </div>

            <div className="form-group">
              <label htmlFor="firstName">Імʼя</label>
              <Field id="firstName" name="firstName" type="text" />
              <ErrorMessage name="firstName" component="div" className="form-error" />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Прізвище</label>
              <Field id="lastName" name="lastName" type="text" />
              <ErrorMessage name="lastName" component="div" className="form-error" />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field id="email" name="email" type="email" />
              <ErrorMessage name="email" component="div" className="form-error" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <Field id="password" name="password" type="password" />
              <ErrorMessage name="password" component="div" className="form-error" />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Підтвердження пароля</label>
              <Field id="confirmPassword" name="confirmPassword" type="password" />
              <ErrorMessage name="confirmPassword" component="div" className="form-error" />
            </div>
                        <div className="form-group">
              <label htmlFor="image">Фото профілю (необов'язково)</label>
              <Field id="image" name="image" type="text" placeholder="https://… (можна лишити порожнім)" />
              <ErrorMessage name="image" component="div" className="form-error" />
            </div>

            <button className="btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Реєструємо…' : 'Зареєструватися'}
            </button>
          </Form>
        )}
      </Formik>

      <p className="form-page__foot">
        Вже є акаунт? <Link to="/login">Увійти</Link>
      </p>
    </div>
  )
}
