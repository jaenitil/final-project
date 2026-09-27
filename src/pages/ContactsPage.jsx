export default function ContactsPage() {
  return (
    <div className="container static-page">
      <section className="hero" style={{ padding: '48px 0 24px', border: 'none' }}>
        <h1>Контакти</h1>
        <p>Є питання щодо виробу чи замовлення на індивідуальний виріб? Пишіть або дзвоніть.</p>
      </section>

      <dl className="contact-list">
        <dt>Телефон</dt>
        <dd>
          <a href="tel:+380000000000">+380 96 518 04 06</a>
        </dd>

        <dt>Email</dt>
        <dd>
          <a href="mailto:hello@oprava.example">oprava@gmail.com</a>
        </dd>

        <dt>Instagram</dt>
        <dd>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            @oprava.jewelry
          </a>
        </dd>

        <dt>Шоурум</dt>
        <dd>м.Львів, вул.Коперника, 23</dd>

        <dt>Графік роботи</dt>
        <dd>Пн–Пт: 10:00–19:00, Сб: 11:00–16:00, Нд — вихідний</dd>
      </dl>
    </div>
  )
}
