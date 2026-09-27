import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { loginUser, clearAuthError } from '../features/auth/authSlice'

const LoginSchema = Yup.object({
  email: Yup.string().email('Некоректний email').required("Email обов'язковий"),
  password: Yup.string().min(6, 'Мінімум 6 символів').required("Пароль обов'язковий"),
})

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { status, error } = useSelector((state) => state.auth)

  const redirectTo = location.state?.from?.pathname || '/'

  return (
    <div className="form-page">
      <h1>Вхід</h1>
      <p className="form-page__sub">Увійдіть, щоб зберігати вироби в обраному.</p>

      {error && <div className="form-banner-error">{String(error)}</div>}

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          dispatch(clearAuthError())
          const result = await dispatch(loginUser(values))
          setSubmitting(false)
          if (loginUser.fulfilled.match(result)) {
            navigate(redirectTo, { replace: true })
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field id="email" name="email" type="email" placeholder="you@example.com" />
              <ErrorMessage name="email" component="div" className="form-error" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <Field id="password" name="password" type="password" placeholder="••••••••" />
              <ErrorMessage name="password" component="div" className="form-error" />
            </div>

            <button className="btn" type="submit" disabled={isSubmitting || status === 'loading'}>
              {isSubmitting || status === 'loading' ? 'Входимо…' : 'Увійти'}
            </button>
          </Form>
        )}
      </Formik>

      <p className="form-page__foot">
        Забули пароль? <Link to="/forgot-password">Відновити</Link>
        <br />
        Немає акаунту? <Link to="/register">Зареєструватися</Link>
      </p>
    </div>
  )
}
