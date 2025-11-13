import Header from '../components/Header'
import Footer from '../components/Footer'
import styles from './page.module.css'

export default function OpiniePage() {
  const reviews = [
    {
      id: 1,
      name: 'Anna Kowalska',
      location: 'Warszawa',
      rating: 5,
      date: '2024-01-15',
      text: 'Fantastyczna obsługa! Wszystko zostało zorganizowane perfekcyjnie. Hotel był wspaniały, loty punktualne. Polecam z całego serca!',
      trip: 'Grecja - Kreta'
    },
    {
      id: 2,
      name: 'Jan Nowak',
      location: 'Kraków',
      rating: 5,
      date: '2024-01-10',
      text: 'Profesjonalna pomoc w planowaniu podróży. Otrzymaliśmy dokładnie to, czego potrzebowaliśmy. Dziękujemy za wspaniałą przygodę!',
      trip: 'Hiszpania - Majorka'
    },
    {
      id: 3,
      name: 'Maria Wiśniewska',
      location: 'Gdańsk',
      rating: 5,
      date: '2024-01-05',
      text: 'Bardzo zadowolona z usługi. Formularz jest intuicyjny, a obsługa klienta na najwyższym poziomie. Na pewno skorzystam ponownie!',
      trip: 'Włochy - Rzym'
    },
    {
      id: 4,
      name: 'Piotr Zieliński',
      location: 'Wrocław',
      rating: 5,
      date: '2023-12-28',
      text: 'Świetna organizacja wyjazdu. Wszystko przebiegło bez problemów. Szczególnie doceniam indywidualne podejście do potrzeb klienta.',
      trip: 'Portugalia - Lizbona'
    },
    {
      id: 5,
      name: 'Katarzyna Lewandowska',
      location: 'Poznań',
      rating: 5,
      date: '2023-12-20',
      text: 'Polecam wszystkim! Formularz pozwala na dokładne określenie swoich potrzeb, a oferta była idealnie dopasowana do naszych wymagań.',
      trip: 'Chorwacja - Dubrownik'
    },
    {
      id: 6,
      name: 'Tomasz Szymański',
      location: 'Łódź',
      rating: 5,
      date: '2023-12-15',
      text: 'Profesjonalizm i zaangażowanie na każdym etapie. Podróż była wspaniała, a wszystko zostało zaplanowane w najmniejszych szczegółach.',
      trip: 'Turcja - Antalya'
    },
  ]

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <h1 className={styles.title}>Opinie klientów</h1>
          <p className={styles.subtitle}>
            Zobacz, co mówią o nas nasi klienci
          </p>
          
          <div className={styles.reviews}>
            {reviews.map((review) => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewAuthor}>
                    <div className={styles.avatar}>
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h3>{review.name}</h3>
                      <p className={styles.location}>{review.location}</p>
                    </div>
                  </div>
                  <div className={styles.reviewMeta}>
                    <div className={styles.rating}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={i < review.rating ? styles.starFilled : styles.starEmpty}>
                          ★
                        </span>
                      ))}
                    </div>
                    <p className={styles.date}>{new Date(review.date).toLocaleDateString('pl-PL')}</p>
                  </div>
                </div>
                <div className={styles.trip}>
                  <strong>Podróż:</strong> {review.trip}
                </div>
                <p className={styles.reviewText}>{review.text}</p>
              </div>
            ))}
          </div>

          <div className={styles.ctaSection}>
            <h2>Chcesz podzielić się swoją opinią?</h2>
            <p>Skontaktuj się z nami lub wypełnij formularz podróży!</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

