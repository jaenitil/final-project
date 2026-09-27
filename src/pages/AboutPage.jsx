export default function AboutPage() {
  return (
    <div className="container static-page">
      <section className="hero" style={{ padding: '48px 0 24px', border: 'none' }}>
        <h1>Про нас</h1>
        <p>
          Прикраси з характером. Без зайвого обрамлення.
        </p>
      </section>

      <div className="about-layout">
        <div className="about-photo">
          <img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/Een_edelsmid_aan_het_werk%2C_Bestanddeelnr_190-0470.jpg/500px-Een_edelsmid_aan_het_werk%2C_Bestanddeelnr_190-0470.jpg?utm_source=ru.wikipedia.org&utm_campaign=parser&utm_content=thumbnail" alt="Майстер за роботою" />
        </div>

        <div className="about-text">
          <h2>Історія</h2>
          <p>
            Спочатку була ідея. Потім - форма. А далі все склалося в "Оправа". Назва з'явилась не випадково. Бо ми любимо те, що обрамляє, але не перекриває головного.
          </p>

          <h2>Підхід до роботи</h2>
          <p>
            Кожна колекція народжується з конкретної ідеї чи спогаду. Метал підбирається під
            задум, а не навпаки - тому вироби виходять не схожими на щось, що вже було.
          </p>

          <h2>Матеріали</h2>
          <p>
            У роботі використовується золото 585 і 750 проби, срібло 925 проби, а також
            природне каміння з перевіреним походженням. 
          </p>
        </div>
      </div>
    </div>
  )
}
