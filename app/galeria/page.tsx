import Header from '../components/Header'
import Footer from '../components/Footer'
import styles from './page.module.css'

export default function GaleriaPage() {
  // Przykładowe zdjęcia - w rzeczywistości można użyć API lub plików statycznych
  const images = [
    { id: 1, src: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800', alt: 'Plaża w Grecji', title: 'Grecja' },
    { id: 2, src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', alt: 'Tropikalna plaża', title: 'Malediwy' },
    { id: 3, src: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800', alt: 'Góry', title: 'Alpy' },
    { id: 4, src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', alt: 'Miasto', title: 'Paryż' },
    { id: 5, src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800', alt: 'Oceany', title: 'Bali' },
    { id: 6, src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', alt: 'Europa', title: 'Wenecja' },
    { id: 7, src: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800', alt: 'Azja', title: 'Tokio' },
    { id: 8, src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', alt: 'Pustynia', title: 'Dubaj' },
    { id: 9, src: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800', alt: 'Góry', title: 'Norwegia' },
  ]

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <h1 className={styles.title}>Galeria</h1>
          <p className={styles.subtitle}>
            Zobacz zdjęcia z podróży naszych klientów
          </p>
          
          <div className={styles.gallery}>
            {images.map((image) => (
              <div key={image.id} className={styles.galleryItem}>
                <div className={styles.imageWrapper}>
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    loading="lazy"
                  />
                  <div className={styles.overlay}>
                    <h3>{image.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

