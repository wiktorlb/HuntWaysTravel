'use client'

import Link from 'next/link'
import Newsletter from './Newsletter'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.title}>HuntWays Travel</h3>
            <p className={styles.description}>
              Twój kreator wymarzonych podróży. Planujemy, rezerwujemy, realizujemy.
            </p>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Nawigacja</h4>
            <nav className={styles.footerNav}>
              <Link href="/" className={styles.footerLink}>Strona główna</Link>
              <Link href="/formularz" className={styles.footerLink}>Formularz</Link>
              <Link href="/galeria" className={styles.footerLink}>Galeria</Link>
              <Link href="/opinie" className={styles.footerLink}>Opinie</Link>
            </nav>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Newsletter</h4>
            <Newsletter />
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} HuntWays Travel. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  )
}

