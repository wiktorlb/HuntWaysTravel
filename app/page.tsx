import Header from './components/Header'
import Footer from './components/Footer'
import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>HuntWays Travel</h1>
            <p className={styles.heroSubtitle}>
              Zaplanuj swoją wymarzoną podróż w kilka prostych kroków
            </p>
            <Link href="/formularz" className={styles.ctaButton}>
              Rozpocznij planowanie
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className={`section ${styles.features}`}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Dlaczego HuntWays Travel?</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>✈️</div>
                <h3>Najlepsze loty</h3>
                <p>Znajdujemy dla Ciebie najlepsze połączenia lotnicze w najlepszych cenach</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🏨</div>
                <h3>Wybór hoteli</h3>
                <p>Dostosowujemy hotel do Twoich potrzeb i preferencji</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🎯</div>
                <h3>Personalizacja</h3>
                <p>Każda podróż jest tworzona specjalnie dla Ciebie</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>💼</div>
                <h3>Wsparcie 24/7</h3>
                <p>Jesteśmy dostępni przez całą dobę, aby Ci pomóc</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className={`section ${styles.howItWorks}`}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Jak to działa?</h2>
            <div className={styles.steps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <h3>Wypełnij formularz</h3>
                <p>Podaj nam podstawowe informacje o swojej podróży</p>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <h3>Wybierz preferencje</h3>
                <p>Określ swoje preferencje dotyczące lotu i hotelu</p>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <h3>Otrzymaj ofertę</h3>
                <p>Skontaktujemy się z Tobą z najlepszą ofertą</p>
              </div>
            </div>
            <div className={styles.ctaSection}>
              <Link href="/formularz" className={styles.ctaButton}>
                Zacznij teraz
              </Link>
            </div>
          </div>
        </section>

        {/* Gallery Preview */}
        <section className={`section ${styles.galleryPreview}`}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Nasze podróże</h2>
            <p className={styles.sectionSubtitle}>
              Zobacz zdjęcia z podróży naszych klientów
            </p>
            <Link href="/galeria" className={styles.galleryLink}>
              Zobacz galerię →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

