'use client'

import { useState } from 'react'
import styles from './TravelForm.module.css'

interface HandLuggage {
  type: 'plecak' | 'walizka'
  count: string
}

interface CheckedLuggage {
  weight: string
}

interface Bed {
  type: 'pojedyncze' | 'podwójne' | 'małżeńskie'
  count: string
  room: string
}

interface MultiCity {
  city: string
  date: string
}

export default function TravelForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  // Form data
  const [formData, setFormData] = useState({
    flightType: 'direct',
    tripType: 'oneway',
    from: '',
    to: '',
    maxStops: '1',
    maxTransitHours: '4',
    dateFrom: '',
    dateTo: '',
    multiCityReturn: false,
    multiCityReturnDate: '',
    adults: '1',
    children: '0',
    infants: '0',
    departureTime: 'rano',
    seatChoice: 'nie',
    specialNeedsMain: 'nie',
    airportAssist: false,
    maas: false,
    wchr: false,
    wchs: false,
    wchc: false,
    deaf: false,
    blnd: false,
    manualWheelchair: false,
    electricWheelchair: false,
    dietaryRestrictions: false,
    medicalEquipment: false,
    mobilityAssistance: false,
    visualAssistance: false,
    hearingAssistance: false,
    cognitiveAssistance: false,
    petTravel: false,
    infantTravel: false,
    hotelQuality: '3',
    distanceCenter: 'dowolna',
    distanceBeach: 'dowolna',
    rooms: '1',
    meals: [] as string[],
    insurance: 'nie',
    tickets: 'nie',
    budget: '',
    currency: 'PLN',
    email: '',
    accept: false,
  })

  const [handLuggage, setHandLuggage] = useState<HandLuggage[]>([
    { type: 'plecak', count: '0' },
    { type: 'walizka', count: '0' },
  ])
  const [checkedLuggage, setCheckedLuggage] = useState<CheckedLuggage[]>([{ weight: '' }])
  const [beds, setBeds] = useState<Bed[]>([{ type: 'pojedyncze', count: '1', room: '1' }])
  const [multiCity, setMultiCity] = useState<MultiCity[]>([])

  const nextStep = (step: number) => {
    if (step < totalSteps) {
      setCurrentStep(step + 1)
      if (step + 1 === 5) {
        // Summary step
      }
    }
  }

  const prevStep = (step: number) => {
    if (step > 1) {
      setCurrentStep(step - 1)
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Przygotowanie danych do wysyłki
      const submitData = {
        ...formData,
        handLuggage,
        checkedLuggage,
        beds,
        multiCity,
      }

      // Wysyłka do API
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (!response.ok) {
        // Wyświetl szczegółowy komunikat błędu z API
        const errorMsg = result.details 
          ? `${result.error}\n\n${result.details}` 
          : result.error || 'Wystąpił błąd podczas wysyłania formularza'
        throw new Error(errorMsg)
      }

      // Sukces - przejdź do strony podziękowania
      setCurrentStep(6)
    } catch (error: any) {
      console.error('Błąd podczas wysyłania formularza:', error)
      setSubmitError(error.message || 'Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const generatePlainTextSummary = () => {
    const lines: string[] = []
    lines.push('Podsumowanie rezerwacji')
    lines.push('')
    lines.push('— Szczegóły lotu —')
    lines.push(`Skąd: ${formData.from || '-'}`)
    lines.push(`Dokąd: ${formData.to || '-'}`)
    lines.push(`Typ podróży: ${formData.tripType}`)
    lines.push(`Rodzaj lotu: ${formData.flightType}`)
    lines.push(`Data wyjazdu: ${formData.dateFrom || '-'}`)
    if (formData.tripType === 'roundtrip') {
      lines.push(`Data powrotu: ${formData.dateTo || '-'}`)
    }
    lines.push(`Ilość osób: ${formData.adults} dorośli, ${formData.children} dzieci, ${formData.infants} niemowlęta`)
    lines.push(`Pora dnia wylotu: ${formData.departureTime}`)
    
    handLuggage.forEach(item => {
      const count = parseInt(item.count, 10) || 0
      if (count > 0) {
        const name = item.type === 'plecak' ? 'Plecak' : 'Walizka kabinowa'
        lines.push(`Bagaż podręczny: ${name} x${count}`)
      }
    })

    checkedLuggage.forEach(item => {
      if (item.weight) {
        lines.push(`Bagaż rejestrowany: Walizka ${item.weight}kg`)
      }
    })

    lines.push(`Wybór miejsca: ${formData.seatChoice === 'tak' ? 'Tak' : 'Nie'}`)
    lines.push('')
    lines.push('— Szczegóły hotelu —')
    lines.push(`Jakość hotelu: ${formData.hotelQuality || '-'}`)
    lines.push(`Odległość od centrum: ${formData.distanceCenter || '-'}`)
    lines.push(`Odległość od plaży: ${formData.distanceBeach || '-'}`)
    lines.push(`Ilość pokoi: ${formData.rooms || '-'}`)
    
    beds.forEach(bed => {
      const count = parseInt(bed.count, 10) || 0
      if (count > 0) {
        const typeName = bed.type === 'pojedyncze' ? 'Łóżko pojedyncze' : 
                        bed.type === 'podwójne' ? 'Łóżko podwójne' : 'Łóżko małżeńskie'
        const roomInfo = parseInt(formData.rooms) > 1 ? ` (Pokój ${bed.room})` : ''
        lines.push(`Łóżka: ${typeName} x${count}${roomInfo}`)
      }
    })

    const mealsText = formData.meals.length > 0 ? formData.meals.join(', ') : 'Brak'
    lines.push(`Wyżywienie: ${mealsText}`)
    lines.push('')
    lines.push('— Dodatki —')
    lines.push(`Ubezpieczenie turystyczne: ${formData.insurance || '-'}`)
    lines.push(`Bilety wstępu (na atrakcje): ${formData.tickets || '-'}`)
    lines.push(`Budżet: ${formData.budget || '-'} ${formData.currency || ''}`)
    lines.push(`Email: ${formData.email || '-'}`)

    return lines.join('\n')
  }

  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100

  const stepLabels = [
    'Podstawowe informacje',
    'Szczegóły lotu',
    'Kreator hotelu',
    'Dodatki',
    'Podsumowanie'
  ]

  return (
    <form className={styles.form} onSubmit={handleSubmit} id="wizardForm">
      <div className={styles.card}>
        {/* Progress Bar */}
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Step Indicator */}
        <div className={styles.stepIndicator}>
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className={`${styles.stepIndicatorItem} ${
                currentStep === step ? styles.active : ''
              } ${currentStep > step ? styles.completed : ''}`}
            >
              <div className={styles.stepIndicatorNumber}>{step}</div>
              <div className={styles.stepIndicatorLabel}>
                {stepLabels[step - 1]}
              </div>
            </div>
          ))}
        </div>

        {/* Step 1 */}
        <div className={`${styles.step} ${currentStep === 1 ? styles.active : ''}`}>
          <div className={styles.stepTitle}>1. Podstawowe informacje o locie</div>
          
          <div className={styles.formRow}>
            <label>Rodzaj lotu:</label>
            <select 
              value={formData.flightType} 
              onChange={(e) => setFormData({...formData, flightType: e.target.value})}
            >
              <option value="direct">Bezpośrednio</option>
              <option value="withstops">Z przesiadkami</option>
            </select>
          </div>

          {formData.flightType === 'withstops' && (
            <div className={styles.stopsOptions}>
              <div className={styles.formRow}>
                <label>Maksymalna liczba przesiadek:</label>
                <input 
                  type="number" 
                  min="1" 
                  max="5" 
                  value={formData.maxStops}
                  onChange={(e) => setFormData({...formData, maxStops: e.target.value})}
                />
              </div>
              <div className={styles.formRow}>
                <label>Maksymalny czas oczekiwania w tranzycie (h):</label>
                <div className={styles.rangeContainer}>
                  <input 
                    type="range" 
                    min="1" 
                    max="24" 
                    value={formData.maxTransitHours}
                    onChange={(e) => setFormData({...formData, maxTransitHours: e.target.value})}
                  />
                  <span>{formData.maxTransitHours}h</span>
                </div>
              </div>
            </div>
          )}

          <div className={styles.formRow}>
            <label>Typ podróży:</label>
            <select 
              value={formData.tripType} 
              onChange={(e) => setFormData({...formData, tripType: e.target.value})}
            >
              <option value="oneway">W jedną stronę</option>
              <option value="roundtrip">W obie strony</option>
              <option value="multicity">Multi City</option>
            </select>
          </div>

          <div className={styles.formRow}>
            <label>Skąd (wylot):</label>
            <input 
              value={formData.from}
              onChange={(e) => setFormData({...formData, from: e.target.value})}
              required 
              placeholder="Wpisz miasto lub nazwę miejsca"
            />
          </div>

          <div className={styles.formRow}>
            <label>Dokąd (przylot):</label>
            <input 
              value={formData.to}
              onChange={(e) => setFormData({...formData, to: e.target.value})}
              required 
              placeholder="Wpisz miasto lub nazwę miejsca"
            />
          </div>

          <div className={styles.formRow}>
            <label>Data wyjazdu:</label>
            <input 
              type="date" 
              value={formData.dateFrom}
              onChange={(e) => setFormData({...formData, dateFrom: e.target.value})}
              required
            />
          </div>

          {formData.tripType === 'roundtrip' && (
            <div className={styles.formRow}>
              <label>Data powrotu:</label>
              <input 
                type="date" 
                value={formData.dateTo}
                onChange={(e) => setFormData({...formData, dateTo: e.target.value})}
              />
            </div>
          )}

          {formData.tripType === 'multicity' && (
            <div className={styles.multiCityOptions}>
              <div className={styles.formRow}>
                <label>Miasta Multi City:</label>
                <div className={styles.multiCityContainer}>
                  {multiCity.map((item, idx) => (
                    <div key={idx} className={styles.luggageRow}>
                      <input 
                        type="text" 
                        value={item.city}
                        onChange={(e) => {
                          const newMultiCity = [...multiCity]
                          newMultiCity[idx].city = e.target.value
                          setMultiCity(newMultiCity)
                        }}
                        placeholder="Nazwa miasta"
                      />
                      <input 
                        type="date" 
                        value={item.date}
                        onChange={(e) => {
                          const newMultiCity = [...multiCity]
                          newMultiCity[idx].date = e.target.value
                          setMultiCity(newMultiCity)
                        }}
                      />
                      <button 
                        type="button" 
                        className={styles.removeBtn}
                        onClick={() => setMultiCity(multiCity.filter((_, i) => i !== idx))}
                      >
                        &minus;
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => setMultiCity([...multiCity, { city: '', date: '' }])}
                    className={styles.addButton}
                  >
                    + Dodaj miasto
                  </button>
                </div>
              </div>
              
              <div className={styles.checkboxRow}>
                <input 
                  type="checkbox" 
                  checked={formData.multiCityReturn}
                  onChange={(e) => setFormData({...formData, multiCityReturn: e.target.checked})}
                />
                <label>Planuję powrót</label>
              </div>
              
              {formData.multiCityReturn && (
                <div className={styles.formRow}>
                  <label>Data powrotu:</label>
                  <input 
                    type="date" 
                    value={formData.multiCityReturnDate}
                    onChange={(e) => setFormData({...formData, multiCityReturnDate: e.target.value})}
                  />
                </div>
              )}
            </div>
          )}

          <div className={styles.formRow}>
            <label style={{ flex: 1 }}>Ilość osób:</label>
            <div className={styles.personsContainer}>
              <div className={styles.personInput}>
                <span>Dorośli</span>
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={formData.adults}
                  onChange={(e) => setFormData({...formData, adults: e.target.value})}
                  required
                />
              </div>
              <div className={styles.personInput}>
                <span>Dzieci</span>
                <input 
                  type="number" 
                  min="0" 
                  max="10" 
                  value={formData.children}
                  onChange={(e) => setFormData({...formData, children: e.target.value})}
                />
              </div>
              <div className={styles.personInput}>
                <span>Niemowlęta</span>
                <input 
                  type="number" 
                  min="0" 
                  max="10" 
                  value={formData.infants}
                  onChange={(e) => setFormData({...formData, infants: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className={styles.formRow}>
            <label>Preferowana pora dnia wylotu:</label>
            <select 
              value={formData.departureTime}
              onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
            >
              <option value="rano">Rano</option>
              <option value="poludnie">Południe</option>
              <option value="wieczor">Wieczór</option>
              <option value="noc">Noc</option>
            </select>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={() => nextStep(1)}>Dalej</button>
          </div>
        </div>

        {/* Step 2 - Flight Details */}
        <div className={`${styles.step} ${currentStep === 2 ? styles.active : ''}`}>
          <div className={styles.stepTitle}>2. Szczegóły lotu</div>
          
          <div className={styles.formRow}>
            <label>Bagaż podręczny:</label>
            <div className={styles.luggageContainer}>
              {handLuggage.map((item, idx) => (
                <div key={idx} className={styles.luggageRow}>
                  <select 
                    value={item.type}
                    onChange={(e) => {
                      const newLuggage = [...handLuggage]
                      newLuggage[idx].type = e.target.value as 'plecak' | 'walizka'
                      setHandLuggage(newLuggage)
                    }}
                  >
                    <option value="plecak">Plecak</option>
                    <option value="walizka">Walizka Kabinowa</option>
                  </select>
                  <input 
                    type="number" 
                    min="0" 
                    value={item.count}
                    onChange={(e) => {
                      const newLuggage = [...handLuggage]
                      newLuggage[idx].count = e.target.value
                      setHandLuggage(newLuggage)
                    }}
                    placeholder="Ilość"
                  />
                  {handLuggage.length > 1 && (
                    <button 
                      type="button" 
                      className={styles.removeBtn}
                      onClick={() => setHandLuggage(handLuggage.filter((_, i) => i !== idx))}
                    >
                      &minus;
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formRow}>
            <label>Bagaż rejestrowany:</label>
            <div className={styles.luggageContainer}>
              {checkedLuggage.map((item, idx) => (
                <div key={idx} className={styles.luggageRow}>
                  <span>Walizka</span>
                  <input 
                    type="number" 
                    min="1" 
                    max="50" 
                    value={item.weight}
                    onChange={(e) => {
                      const newLuggage = [...checkedLuggage]
                      newLuggage[idx].weight = e.target.value
                      setCheckedLuggage(newLuggage)
                    }}
                    placeholder="Waga (kg)"
                  />
                  <button 
                    type="button" 
                    className={styles.removeBtn}
                    onClick={() => setCheckedLuggage(checkedLuggage.filter((_, i) => i !== idx))}
                  >
                    &minus;
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => setCheckedLuggage([...checkedLuggage, { weight: '' }])}
                className={styles.addButton}
              >
                + Dodaj bagaż rejestrowany
              </button>
            </div>
          </div>

          <div className={styles.formRow}>
            <label>Wybór miejsca:</label>
            <select 
              value={formData.seatChoice}
              onChange={(e) => setFormData({...formData, seatChoice: e.target.value})}
            >
              <option value="nie">Nie</option>
              <option value="tak">Tak</option>
            </select>
          </div>

          <div className={styles.formRow}>
            <label>Potrzeby specjalne:</label>
            <select 
              value={formData.specialNeedsMain}
              onChange={(e) => setFormData({...formData, specialNeedsMain: e.target.value})}
            >
              <option value="nie">Nie</option>
              <option value="tak">Tak</option>
            </select>
          </div>

          {formData.specialNeedsMain === 'tak' && (
            <div className={styles.specialNeedsOptions}>
              <div className={styles.checkboxRow}>
                <input 
                  type="checkbox" 
                  checked={formData.airportAssist}
                  onChange={(e) => setFormData({...formData, airportAssist: e.target.checked})}
                />
                <label>Asysta na lotnisku</label>
              </div>

              {formData.airportAssist && (
                <div className={styles.assistOptions}>
                  <div className={styles.checkboxRow}>
                    <input 
                      type="checkbox" 
                      checked={formData.maas}
                      onChange={(e) => setFormData({...formData, maas: e.target.checked})}
                    />
                    <label>Opiekun na lotnisku (MAAS)</label>
                  </div>
                  <div className={styles.checkboxRow}>
                    <input 
                      type="checkbox" 
                      checked={formData.wchr}
                      onChange={(e) => setFormData({...formData, wchr: e.target.checked})}
                    />
                    <label>WCHR</label>
                  </div>
                  <div className={styles.checkboxRow}>
                    <input 
                      type="checkbox" 
                      checked={formData.wchs}
                      onChange={(e) => setFormData({...formData, wchs: e.target.checked})}
                    />
                    <label>WCHS</label>
                  </div>
                  <div className={styles.checkboxRow}>
                    <input 
                      type="checkbox" 
                      checked={formData.wchc}
                      onChange={(e) => setFormData({...formData, wchc: e.target.checked})}
                    />
                    <label>WCHC</label>
                  </div>
                  <div className={styles.checkboxRow}>
                    <input 
                      type="checkbox" 
                      checked={formData.deaf}
                      onChange={(e) => setFormData({...formData, deaf: e.target.checked})}
                    />
                    <label>DEAF</label>
                  </div>
                  <div className={styles.checkboxRow}>
                    <input 
                      type="checkbox" 
                      checked={formData.blnd}
                      onChange={(e) => setFormData({...formData, blnd: e.target.checked})}
                    />
                    <label>BLND</label>
                  </div>
                  <div className={styles.checkboxRow}>
                    <input 
                      type="checkbox" 
                      checked={formData.manualWheelchair}
                      onChange={(e) => setFormData({...formData, manualWheelchair: e.target.checked})}
                    />
                    <label>Posiadam wózek inwalidzki manualny</label>
                  </div>
                  <div className={styles.checkboxRow}>
                    <input 
                      type="checkbox" 
                      checked={formData.electricWheelchair}
                      onChange={(e) => setFormData({...formData, electricWheelchair: e.target.checked})}
                    />
                    <label>Posiadam wózek inwalidzki elektryczny</label>
                  </div>
                </div>
              )}

              <div className={styles.checkboxRow}>
                <input 
                  type="checkbox" 
                  checked={formData.dietaryRestrictions}
                  onChange={(e) => setFormData({...formData, dietaryRestrictions: e.target.checked})}
                />
                <label>Ograniczenia dietetyczne</label>
              </div>
              <div className={styles.checkboxRow}>
                <input 
                  type="checkbox" 
                  checked={formData.medicalEquipment}
                  onChange={(e) => setFormData({...formData, medicalEquipment: e.target.checked})}
                />
                <label>Sprzęt medyczny</label>
              </div>
              <div className={styles.checkboxRow}>
                <input 
                  type="checkbox" 
                  checked={formData.mobilityAssistance}
                  onChange={(e) => setFormData({...formData, mobilityAssistance: e.target.checked})}
                />
                <label>Pomoc w poruszaniu się</label>
              </div>
              <div className={styles.checkboxRow}>
                <input 
                  type="checkbox" 
                  checked={formData.visualAssistance}
                  onChange={(e) => setFormData({...formData, visualAssistance: e.target.checked})}
                />
                <label>Pomoc dla osób niewidomych</label>
              </div>
              <div className={styles.checkboxRow}>
                <input 
                  type="checkbox" 
                  checked={formData.hearingAssistance}
                  onChange={(e) => setFormData({...formData, hearingAssistance: e.target.checked})}
                />
                <label>Pomoc dla osób niesłyszących</label>
              </div>
              <div className={styles.checkboxRow}>
                <input 
                  type="checkbox" 
                  checked={formData.cognitiveAssistance}
                  onChange={(e) => setFormData({...formData, cognitiveAssistance: e.target.checked})}
                />
                <label>Pomoc dla osób z zaburzeniami poznawczymi</label>
              </div>
              <div className={styles.checkboxRow}>
                <input 
                  type="checkbox" 
                  checked={formData.petTravel}
                  onChange={(e) => setFormData({...formData, petTravel: e.target.checked})}
                />
                <label>Podróż z zwierzęciem</label>
              </div>
              <div className={styles.checkboxRow}>
                <input 
                  type="checkbox" 
                  checked={formData.infantTravel}
                  onChange={(e) => setFormData({...formData, infantTravel: e.target.checked})}
                />
                <label>Podróż z niemowlęciem</label>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button type="button" onClick={() => prevStep(2)}>Wstecz</button>
            <button type="button" onClick={() => nextStep(2)}>Dalej</button>
          </div>
        </div>

        {/* Step 3 - Hotel */}
        <div className={`${styles.step} ${currentStep === 3 ? styles.active : ''}`}>
          <div className={styles.stepTitle}>3. Kreator hotelu</div>
          
          <div className={styles.formRow}>
            <label>Jakość hotelu:</label>
            <select 
              value={formData.hotelQuality}
              onChange={(e) => setFormData({...formData, hotelQuality: e.target.value})}
            >
              <option value="2">2 gwiazdki</option>
              <option value="3">3 gwiazdki</option>
              <option value="4">4 gwiazdki</option>
              <option value="5">5 gwiazdek</option>
            </select>
          </div>

          <div className={styles.formRow}>
            <label>Odległość od centrum:</label>
            <select 
              value={formData.distanceCenter}
              onChange={(e) => setFormData({...formData, distanceCenter: e.target.value})}
            >
              <option value="dowolna">Dowolna</option>
              <option value="<1km">&lt;1km</option>
              <option value="1-3km">1-3km</option>
              <option value=">3km">&gt;3km</option>
            </select>
          </div>

          <div className={styles.formRow}>
            <label>Odległość od plaży:</label>
            <select 
              value={formData.distanceBeach}
              onChange={(e) => setFormData({...formData, distanceBeach: e.target.value})}
            >
              <option value="dowolna">Dowolna</option>
              <option value="<500m">&lt;500m</option>
              <option value="500m-1km">500m-1km</option>
              <option value=">1km">&gt;1km</option>
            </select>
          </div>

          <div className={styles.formRow}>
            <label>Ilość pokoi:</label>
            <select 
              value={formData.rooms}
              onChange={(e) => {
                setFormData({...formData, rooms: e.target.value})
                // Update bed rooms
                const roomsCount = parseInt(e.target.value) || 1
                setBeds(beds.map(bed => ({ ...bed, room: Math.min(parseInt(bed.room) || 1, roomsCount).toString() })))
              }}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>

          <div className={styles.formRow}>
            <label>Łóżka:</label>
            <div className={styles.bedsContainer}>
              {beds.map((bed, idx) => (
                <div key={idx} className={styles.luggageRow}>
                  {parseInt(formData.rooms) > 1 && (
                    <select 
                      value={bed.room}
                      onChange={(e) => {
                        const newBeds = [...beds]
                        newBeds[idx].room = e.target.value
                        setBeds(newBeds)
                      }}
                    >
                      {Array.from({ length: parseInt(formData.rooms) || 1 }, (_, i) => (
                        <option key={i + 1} value={(i + 1).toString()}>Pokój {i + 1}</option>
                      ))}
                    </select>
                  )}
                  <select 
                    value={bed.type}
                    onChange={(e) => {
                      const newBeds = [...beds]
                      newBeds[idx].type = e.target.value as 'pojedyncze' | 'podwójne' | 'małżeńskie'
                      setBeds(newBeds)
                    }}
                  >
                    <option value="pojedyncze">Łóżko pojedyncze</option>
                    <option value="podwójne">Łóżko podwójne</option>
                    <option value="małżeńskie">Łóżko małżeńskie</option>
                  </select>
                  <input 
                    type="number" 
                    min="1" 
                    max="10" 
                    value={bed.count}
                    onChange={(e) => {
                      const newBeds = [...beds]
                      newBeds[idx].count = e.target.value
                      setBeds(newBeds)
                    }}
                    placeholder="Ilość"
                  />
                  <button 
                    type="button" 
                    className={styles.removeBtn}
                    onClick={() => setBeds(beds.filter((_, i) => i !== idx))}
                  >
                    &minus;
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => setBeds([...beds, { type: 'pojedyncze', count: '1', room: '1' }])}
                className={styles.addButton}
              >
                + Dodaj łóżko
              </button>
            </div>
          </div>

          <div className={styles.formRow}>
            <label>Wyżywienie:</label>
            <div className={styles.mealsContainer}>
              <div className={styles.checkboxRow}>
                <input 
                  type="checkbox" 
                  checked={formData.meals.includes('śniadanie')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({...formData, meals: [...formData.meals, 'śniadanie']})
                    } else {
                      setFormData({...formData, meals: formData.meals.filter(m => m !== 'śniadanie')})
                    }
                  }}
                />
                <label>Śniadanie</label>
              </div>
              <div className={styles.checkboxRow}>
                <input 
                  type="checkbox" 
                  checked={formData.meals.includes('obiad')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({...formData, meals: [...formData.meals, 'obiad']})
                    } else {
                      setFormData({...formData, meals: formData.meals.filter(m => m !== 'obiad')})
                    }
                  }}
                />
                <label>Obiad</label>
              </div>
              <div className={styles.checkboxRow}>
                <input 
                  type="checkbox" 
                  checked={formData.meals.includes('kolacja')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({...formData, meals: [...formData.meals, 'kolacja']})
                    } else {
                      setFormData({...formData, meals: formData.meals.filter(m => m !== 'kolacja')})
                    }
                  }}
                />
                <label>Kolacja</label>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={() => prevStep(3)}>Wstecz</button>
            <button type="button" onClick={() => nextStep(3)}>Dalej</button>
          </div>
        </div>

        {/* Step 4 - Extras */}
        <div className={`${styles.step} ${currentStep === 4 ? styles.active : ''}`}>
          <div className={styles.stepTitle}>4. Dodatki</div>
          
          <div className={styles.formRow}>
            <label>Ubezpieczenie turystyczne:</label>
            <select 
              value={formData.insurance}
              onChange={(e) => setFormData({...formData, insurance: e.target.value})}
            >
              <option value="nie">Nie</option>
              <option value="tak">Tak</option>
            </select>
          </div>

          <div className={styles.formRow}>
            <label>Czy chcesz, aby za dodatkową opłatą zakupić bilety wstępu (na atrakcje)?</label>
            <select 
              value={formData.tickets}
              onChange={(e) => setFormData({...formData, tickets: e.target.value})}
            >
              <option value="nie">Nie</option>
              <option value="tak">Tak</option>
            </select>
          </div>

          <div className={styles.formRow}>
            <label>Podaj budżet jakim dysponujesz:</label>
            <div className={styles.budgetContainer}>
              <input 
                type="number" 
                min="0" 
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                required
              />
              <select 
                value={formData.currency}
                onChange={(e) => setFormData({...formData, currency: e.target.value})}
              >
                <option value="PLN">PLN</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <label>Podaj swój adres e-mail:</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={() => prevStep(4)}>Wstecz</button>
            <button type="button" onClick={() => nextStep(4)}>Dalej</button>
          </div>
        </div>

        {/* Step 5 - Summary */}
        <div className={`${styles.step} ${currentStep === 5 ? styles.active : ''}`}>
          <div className={styles.stepTitle}>5. Podsumowanie</div>
          <SummaryStep formData={formData} handLuggage={handLuggage} checkedLuggage={checkedLuggage} beds={beds} multiCity={multiCity} />
          
          <div className={styles.checkboxRow}>
            <input 
              type="checkbox" 
              checked={formData.accept}
              onChange={(e) => setFormData({...formData, accept: e.target.checked})}
              required
            />
            <label>Akceptuję regulamin, politykę prywatności oraz zgadzam się na użycie moich danych w celu zakupu usługi</label>
          </div>

          {submitError && (
            <div className={styles.errorMessage}>
              <strong>Błąd:</strong><br />
              {submitError}
            </div>
          )}
          <div className={styles.actions}>
            <button type="button" onClick={() => prevStep(5)} disabled={isSubmitting}>
              Wstecz
            </button>
            <button type="submit" disabled={!formData.accept || isSubmitting}>
              {isSubmitting ? 'Wysyłanie...' : 'Wyślij'}
            </button>
          </div>
        </div>

        {/* Step 6 - Thank You */}
        {currentStep === 6 && (
          <div className={`${styles.step} ${styles.active}`}>
            <div className={styles.stepTitle}>Dziękujemy!</div>
            <div className={styles.thankYou}>
              <p>Twoje zgłoszenie zostało wysłane. Skontaktujemy się z Tobą wkrótce!</p>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}

interface SummaryStepProps {
  formData: any
  handLuggage: HandLuggage[]
  checkedLuggage: CheckedLuggage[]
  beds: Bed[]
  multiCity: MultiCity[]
}

function SummaryStep({ formData, handLuggage, checkedLuggage, beds, multiCity }: SummaryStepProps) {
  const handLuggageList = handLuggage
    .filter((item: HandLuggage) => parseInt(item.count, 10) > 0)
    .map((item: HandLuggage) => `${item.type === 'plecak' ? 'Plecak' : 'Walizka kabinowa'} x${item.count}`)

  const checkedLuggageList = checkedLuggage
    .filter((item: CheckedLuggage) => item.weight)
    .map((item: CheckedLuggage) => `Walizka ${item.weight}kg`)

  const specialNeedsList: string[] = []
  if (formData.specialNeedsMain === 'tak') {
    if (formData.airportAssist) {
      if (formData.maas) specialNeedsList.push('Opiekun na lotnisku (MAAS)')
      if (formData.wchr) specialNeedsList.push('WCHR')
      if (formData.wchs) specialNeedsList.push('WCHS')
      if (formData.wchc) specialNeedsList.push('WCHC')
      if (formData.deaf) specialNeedsList.push('DEAF')
      if (formData.blnd) specialNeedsList.push('BLND')
      if (formData.manualWheelchair) specialNeedsList.push('Wózek inwalidzki manualny')
      if (formData.electricWheelchair) specialNeedsList.push('Wózek inwalidzki elektryczny')
    }
    if (formData.dietaryRestrictions) specialNeedsList.push('Ograniczenia dietetyczne')
    if (formData.medicalEquipment) specialNeedsList.push('Sprzęt medyczny')
    if (formData.mobilityAssistance) specialNeedsList.push('Pomoc w poruszaniu się')
    if (formData.visualAssistance) specialNeedsList.push('Pomoc dla osób niewidomych')
    if (formData.hearingAssistance) specialNeedsList.push('Pomoc dla osób niesłyszących')
    if (formData.cognitiveAssistance) specialNeedsList.push('Pomoc dla osób z zaburzeniami poznawczymi')
    if (formData.petTravel) specialNeedsList.push('Podróż z zwierzęciem')
    if (formData.infantTravel) specialNeedsList.push('Podróż z niemowlęciem')
  }

  const bedsList = beds
    .filter((bed: Bed) => parseInt(bed.count, 10) > 0)
    .map((bed: Bed) => {
      const typeName = bed.type === 'pojedyncze' ? 'Łóżko pojedyncze' : 
                      bed.type === 'podwójne' ? 'Łóżko podwójne' : 'Łóżko małżeńskie'
      const roomInfo = parseInt(formData.rooms) > 1 ? ` (Pokój ${bed.room})` : ''
      return `${typeName} x${bed.count}${roomInfo}`
    })

  const multiCityList = multiCity
    .filter((item: MultiCity) => item.city && item.date)
    .map((item: MultiCity) => `${item.city} (${item.date})`)

  return (
    <div className={styles.summary}>
      <div className={styles.summaryRow}>
        <div className={styles.summaryColumn}>
          <h3>Szczegóły lotu</h3>
          <p><strong>Skąd:</strong> {formData.from || '-'}</p>
          <p><strong>Dokąd:</strong> {formData.to || '-'}</p>
          <p><strong>Typ podróży:</strong> {formData.tripType}</p>
          <p><strong>Rodzaj lotu:</strong> {formData.flightType}</p>
          <p><strong>Data wyjazdu:</strong> {formData.dateFrom || '-'}</p>
          {formData.tripType === 'roundtrip' && (
            <p><strong>Data powrotu:</strong> {formData.dateTo || '-'}</p>
          )}
          {formData.tripType === 'multicity' && (
            <>
              <p><strong>Miasta Multi City:</strong> {multiCityList.length ? multiCityList.join(', ') : 'Brak'}</p>
              {formData.multiCityReturn && (
                <p><strong>Data powrotu:</strong> {formData.multiCityReturnDate || '-'}</p>
              )}
            </>
          )}
          <p><strong>Ilość osób:</strong> {formData.adults} dorośli, {formData.children} dzieci, {formData.infants} niemowlęta</p>
          <p><strong>Preferowana pora dnia wylotu:</strong> {formData.departureTime}</p>
          <p><strong>Bagaż podręczny:</strong> {handLuggageList.length ? handLuggageList.join(', ') : 'Brak'}</p>
          <p><strong>Bagaż rejestrowany:</strong> {checkedLuggageList.length ? checkedLuggageList.join(', ') : 'Brak'}</p>
          <p><strong>Wybór miejsca:</strong> {formData.seatChoice === 'tak' ? 'Tak' : 'Nie'}</p>
          <p><strong>Potrzeby specjalne:</strong> {formData.specialNeedsMain === 'tak' ? (specialNeedsList.length ? specialNeedsList.join(', ') : 'Brak') : 'Brak'}</p>
        </div>

        <div className={styles.summaryColumn}>
          <h3>Szczegóły hotelu</h3>
          <p><strong>Jakość hotelu:</strong> {formData.hotelQuality || '-'}</p>
          <p><strong>Odległość od centrum:</strong> {formData.distanceCenter || '-'}</p>
          <p><strong>Odległość od plaży:</strong> {formData.distanceBeach || '-'}</p>
          <p><strong>Ilość pokoi:</strong> {formData.rooms || '-'}</p>
          <p><strong>Łóżka:</strong> {bedsList.length ? bedsList.join(', ') : 'Brak'}</p>
          <p><strong>Wyżywienie:</strong> {formData.meals.length ? formData.meals.join(', ') : 'Brak'}</p>
        </div>
      </div>

      <div className={styles.summaryBottom}>
        <h3>Dodatki</h3>
        <p><strong>Ubezpieczenie turystyczne:</strong> {formData.insurance || '-'}</p>
        <p><strong>Bilety wstępu (na atrakcje):</strong> {formData.tickets || '-'}</p>
        <p><strong>Budżet:</strong> {formData.budget || '-'} {formData.currency || ''}</p>
        <p><strong>Email:</strong> {formData.email || '-'}</p>
      </div>
    </div>
  )
}

