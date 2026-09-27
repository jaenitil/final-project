import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addPiece } from '../features/pieces/piecesSlice'

const Schema = Yup.object({
  name: Yup.string().required("Назва обов'язкова"),
  price: Yup.number().typeError('Має бути числом').positive('Має бути більше 0').required("Ціна обов'язкова"),
  color: Yup.string().required("Колір обов'язковий"),
  year: Yup.number().typeError('Має бути числом').min(1900).max(2100),
  volume: Yup.number().typeError('Має бути числом').min(0),
  description: Yup.string().max(1000, 'Максимум 1000 символів'),
  image: Yup.string().test(
    'is-url-or-path',
    'Вкажи посилання (https://…) або локальний шлях, що починається з /',
    (value) => !value || /^https?:\/\//.test(value) || value.startsWith('/')
  ),
})

export default function AddPiecePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { error } = useSelector((state) => state.pieces)

  return (
    <div className="form-page">
      <h1>Новий виріб</h1>
      <p className="form-page__sub">Додайте виріб до каталогу майстерні.</p>

      {error && <div className="form-banner-error">{String(error)}</div>}

      <Formik
        initialValues={{
          name: '',
          price: '',
          color: '',
          year: new Date().getFullYear(),
          volume: '',
          description: '',
          image: '',
        }}
        validationSchema={Schema}
        onSubmit={async (values, { setSubmitting }) => {
          const payload = {
          ...values,
           price: Number(values.price),
           year: Number(values.year),
           volume: values.volume ? Number(values.volume) : 0,
           image: values.image || 'https://placehold.co/600x600/ece5d6/6e5228?text=Photo',
          }
          const result = await dispatch(addPiece(payload))
          setSubmitting(false)
          if (addPiece.fulfilled.match(result)) {
            navigate('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="name">Назва</label>
              <Field id="name" name="name" type="text" />
              <ErrorMessage name="name" component="div" className="form-error" />
            </div>
            <div className="form-group">
              <label htmlFor="price">Ціна, грн</label>
              <Field id="price" name="price" type="number" />
              <ErrorMessage name="price" component="div" className="form-error" />
            </div>
            <div className="form-group">
              <label htmlFor="color">Колір</label>
              <Field id="color" name="color" type="text" placeholder="жовте золото" />
              <ErrorMessage name="color" component="div" className="form-error" />
            </div>
            <div className="form-group">
              <label htmlFor="year">Рік колекції</label>
              <Field id="year" name="year" type="number" />
              <ErrorMessage name="year" component="div" className="form-error" />
            </div>
            <div className="form-group">
              <label htmlFor="volume">Вага, г</label>
              <Field id="volume" name="volume" type="number" step="0.1" />
              <ErrorMessage name="volume" component="div" className="form-error" />
            </div>
            <div className="form-group">
              <label htmlFor="image">Посилання на фото</label>
              {/* Встав сюди пряме посилання на фото (з хостингу) або
                  локальний шлях типу /images/pieces/ring-1.jpg —
                  див. public/images/pieces/README.md */}
              <Field id="image" name="image" type="text" placeholder="https://… або /images/pieces/…" />
              <ErrorMessage name="image" component="div" className="form-error" />
            </div>
            <div className="form-group">
              <label htmlFor="description">Опис</label>
              <Field id="description" name="description" as="textarea" rows={4} />
              <ErrorMessage name="description" component="div" className="form-error" />
            </div>
            <button className="btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Додаємо…' : 'Додати виріб'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
