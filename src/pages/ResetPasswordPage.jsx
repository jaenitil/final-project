import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { resetPassword } from '../features/auth/authSlice'

const Schema = Yup.object({
  newPassword: Yup.string().min(6, 'Мінімум 6 символів').required("Пароль обов'язковий"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Паролі не збігаються')
    .required('Підтвердіть пароль'),
})

export default function ResetPasswordPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [errorMsg, setErrorMsg] = useState(null)

  
  const userId = Number(searchParams.get('userId'))
  const token = searchParams.get('token') || ''

  return (
    <div className="form-page">
      <h1>Новий пароль</h1>
      <p className="form-page__sub">
        Ця сторінка відкривається за посиланням з листа відновлення пароля.
      </p>

      {!token && (
        <div className="form-banner-error">
          У посиланні відсутній токен — перевір, що ти перейшов(-ла) за повним посиланням з
          листа.
        </div>
      )}
      {errorMsg && <div className="form-banner-error">{errorMsg}</div>}

      <Formik
        initialValues={{ newPassword: '', confirmPassword: '' }}
        validationSchema={Schema}
        onSubmit={async (values, { setSubmitting }) => {
          const result = await dispatch(
            resetPassword({ userId, token, newPassword: values.newPassword })
          )
          setSubmitting(false)
          if (resetPassword.fulfilled.match(result)) {
            navigate('/login')
          } else {
            setErrorMsg(String(result.payload || 'Щось пішло не так'))
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="newPassword">Новий пароль</label>
              <Field id="newPassword" name="newPassword" type="password" />
              <ErrorMessage name="newPassword" component="div" className="form-error" />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Підтвердження</label>
              <Field id="confirmPassword" name="confirmPassword" type="password" />
              <ErrorMessage name="confirmPassword" component="div" className="form-error" />
            </div>
            <button className="btn" type="submit" disabled={isSubmitting || !token}>
              {isSubmitting ? 'Зберігаємо…' : 'Зберегти новий пароль'}
            </button>
          </Form>
        )}
      </Formik>

      <p className="form-page__foot">
        <Link to="/login">Повернутися до входу</Link>
      </p>
    </div>
  )
}
