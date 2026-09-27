import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { forgotPassword } from '../features/auth/authSlice'

const Schema = Yup.object({
  email: Yup.string().email('Некоректний email').required("Email обов'язковий"),
})

export default function ForgotPasswordPage() {
  const dispatch = useDispatch()
  const [sent, setSent] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  return (
    <div className="form-page">
      <h1>Відновлення пароля</h1>
      <p className="form-page__sub">
        Введіть email — надішлемо посилання для скидання пароля.
      </p>

      {sent && (
        <div className="form-banner-success">
          Якщо такий email зареєстровано, лист із подальшими інструкціями вже в дорозі.
        </div>
      )}
      {errorMsg && <div className="form-banner-error">{errorMsg}</div>}

      <Formik
        initialValues={{ email: '' }}
        validationSchema={Schema}
        onSubmit={async (values, { setSubmitting }) => {
          const result = await dispatch(forgotPassword(values))
          setSubmitting(false)
          if (forgotPassword.fulfilled.match(result)) {
            setSent(true)
          } else {
            setErrorMsg(String(result.payload || 'Щось пішло не так'))
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field id="email" name="email" type="email" />
              <ErrorMessage name="email" component="div" className="form-error" />
            </div>
            <button className="btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Надсилаємо…' : 'Надіслати'}
            </button>
          </Form>
        )}
      </Formik>

      <p className="form-page__foot">
        Згадали пароль? <Link to="/login">Увійти</Link>
      </p>
    </div>
  )
}
