import Header from '../components/Header'
import Footer from '../components/Footer'
import TravelForm from '../components/TravelForm'
import styles from './page.module.css'

export default function FormularzPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Kreator podróży</h1>
          <p className={styles.subtitle}>
            Wypełnij formularz, a my przygotujemy dla Ciebie najlepszą ofertę
          </p>
          <TravelForm />
        </div>
      </main>
      <Footer />
    </>
  )
}

