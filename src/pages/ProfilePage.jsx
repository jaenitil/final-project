import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { updateProfile, changePassword } from '../api/userApi'

const ProfileSchema = Yup.object({
  userName: Yup.string().max(100, 'Занадто довге імʼя'),
  country: Yup.string().max(150, 'Занадто довга назва'),
  aboutMe: Yup.string().max(500, 'Максимум 500 символів'),
})

const PasswordSchema = Yup.object({
  oldPassword: Yup.string().required("Введіть поточний пароль"),
  newPassword: Yup.string().min(6, 'Мінімум 6 символів').required("Введіть новий пароль"),
})

export default function ProfilePage() {
  const { user } = useAuth()
  const [profileMsg, setProfileMsg] = useState(null)
  const [passwordMsg, setPasswordMsg] = useState(null)

  return (
    <div className="form-page" style={{ maxWidth: 480 }}>
      <h1>Кабінет</h1>
      <p className="form-page__sub">Керуйте своїми даними та паролем.</p>

      {profileMsg && (
        <div className={profileMsg.ok ? 'form-banner-success' : 'form-banner-error'}>
          {profileMsg.text}
        </div>
      )}

      <Formik
        initialValues={{
          userName: user?.userName || '',
          country: user?.country || '',
          aboutMe: user?.aboutMe || '',
        }}
        validationSchema={ProfileSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setProfileMsg(null)
          try {
            await updateProfile({ userId: user?.id, ...values })
            setProfileMsg({ ok: true, text: 'Дані оновлено.' })
          } catch (err) {
            setProfileMsg({
              ok: false,
              text: err.response?.data?.title || 'Не вдалося оновити дані.',
            })
          }
          setSubmitting(false)
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="userName">Імʼя користувача</label>
              <Field id="userName" name="userName" type="text" />
              <ErrorMessage name="userName" component="div" className="form-error" />
            </div>
            <div className="form-group">
              <label htmlFor="country">Країна</label>
              <Field id="country" name="country" type="text" />
              <ErrorMessage name="country" component="div" className="form-error" />
            </div>
            <div className="form-group">
              <label htmlFor="aboutMe">Про себе</label>
              <Field id="aboutMe" name="aboutMe" as="textarea" rows={3} />
              <ErrorMessage name="aboutMe" component="div" className="form-error" />
            </div>
            <button className="btn" type="submit" disabled={isSubmitting}>
              Зберегти
            </button>
          </Form>
        )}
      </Formik>

      <hr style={{ margin: '36px 0', border: 'none', borderTop: '1px solid var(--line)' }} />

      <h1 style={{ fontSize: '1.5rem' }}>Зміна пароля</h1>

      {passwordMsg && (
        <div className={passwordMsg.ok ? 'form-banner-success' : 'form-banner-error'}>
          {passwordMsg.text}
        </div>
      )}

      <Formik
        initialValues={{ oldPassword: '', newPassword: '' }}
        validationSchema={PasswordSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setPasswordMsg(null)
          try {
            await changePassword(values)
            setPasswordMsg({ ok: true, text: 'Пароль змінено.' })
            resetForm()
          } catch (err) {
            setPasswordMsg({
              ok: false,
              text: err.response?.data?.title || 'Не вдалося змінити пароль.',
            })
          }
          setSubmitting(false)
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="oldPassword">Поточний пароль</label>
              <Field id="oldPassword" name="oldPassword" type="password" />
              <ErrorMessage name="oldPassword" component="div" className="form-error" />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">Новий пароль</label>
              <Field id="newPassword" name="newPassword" type="password" />
              <ErrorMessage name="newPassword" component="div" className="form-error" />
            </div>
            <button className="btn" type="submit" disabled={isSubmitting}>
              Змінити пароль
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
