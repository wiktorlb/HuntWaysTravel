import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const DEFAULT_ADMIN_EMAIL = 'wiktorlabocha123@gmail.com'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Walidacja danych
    if (!formData.email || !formData.from || !formData.to) {
      return NextResponse.json(
        { error: 'Brakuje wymaganych pól' },
        { status: 400 }
      )
    }

    // Sprawdzenie konfiguracji SMTP
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('Brak konfiguracji SMTP - sprawdź plik .env.local')
      return NextResponse.json(
        { 
          error: 'Brak konfiguracji email. Skontaktuj się z administratorem.',
          details: 'SMTP nie jest skonfigurowany. Sprawdź plik .env.local'
        },
        { status: 500 }
      )
    }

    // Konfiguracja transporter email
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10)
    const smtpSecureEnv = process.env.SMTP_SECURE ?? (smtpPort === 465 ? 'true' : 'false')
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: smtpPort,
      secure: smtpSecureEnv === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Weryfikacja połączenia SMTP
    try {
      await transporter.verify()
    } catch (verifyError: any) {
      console.error('Błąd weryfikacji SMTP:', verifyError)
      return NextResponse.json(
        { 
          error: 'Błąd konfiguracji email',
          details: verifyError.message || 'Nie można połączyć się z serwerem SMTP. Sprawdź dane w .env.local'
        },
        { status: 500 }
      )
    }

    // Generowanie tekstu podsumowania
    const summaryText = generateSummaryText(formData)

    // Konfiguracja emaila - wysyłamy na dwa adresy
    const adminRecipients = new Set<string>([DEFAULT_ADMIN_EMAIL])
    if (process.env.RECIPIENT_EMAIL) {
      process.env.RECIPIENT_EMAIL
        .split(',')
        .map((email) => email.trim())
        .filter(Boolean)
        .forEach((email) => adminRecipients.add(email))
    }

    const clientEmail = (formData.email || '').trim()

    if (!clientEmail) {
      return NextResponse.json(
        { error: 'Brak adresu email klienta w formularzu' },
        { status: 400 }
      )
    }

    const recipients = Array.from(new Set<string>([...adminRecipients, clientEmail]))

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'Brak adresów email do wysyłki' },
        { status: 500 }
      )
    }

    const fromAddress = getSenderAddress()

    // Email do administratora (na stały adres + adres z formularza)
    const mailOptions = {
      from: fromAddress,
      to: recipients.join(', '),
      replyTo: clientEmail,
      subject: 'Nowe zgłoszenie - Kreator podróży',
      text: summaryText,
      html: generateSummaryHTML(formData),
    }

    // Wysyłanie emaila
    try {
      await transporter.sendMail(mailOptions)
      console.log('Email wysłany pomyślnie do:', recipients.join(', '))
    } catch (sendError: any) {
      console.error('Błąd podczas wysyłania emaila:', sendError)
      throw new Error(`Nie można wysłać emaila: ${sendError.message}`)
    }

    // Opcjonalnie: wyślij potwierdzenie do klienta (tylko na jego adres)
    if (process.env.SEND_CONFIRMATION === 'true') {
      try {
        const confirmationMail = {
          from: fromAddress,
          to: clientEmail, // Tylko na adres klienta
          subject: 'Potwierdzenie otrzymania zgłoszenia - HuntWays Travel',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1976d2;">Dziękujemy za zgłoszenie!</h2>
              <p>Otrzymaliśmy Twoje zgłoszenie dotyczące planowania podróży. Skontaktujemy się z Tobą wkrótce z najlepszą ofertą.</p>
              <p>Szczegóły Twojego zgłoszenia:</p>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                ${generateSummaryHTML(formData)}
              </div>
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Pozdrawiamy,<br>
                Zespół HuntWays Travel
              </p>
            </div>
          `,
        }
        await transporter.sendMail(confirmationMail)
        console.log('Email potwierdzający wysłany do:', clientEmail)
      } catch (confirmationError: any) {
        // Nie przerywamy procesu jeśli potwierdzenie się nie powiodło
        console.error('Błąd podczas wysyłania emaila potwierdzającego:', confirmationError)
      }
    }

    return NextResponse.json(
      { message: 'Formularz został wysłany pomyślnie' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Błąd podczas wysyłania formularza:', error)
    
    // Bardziej szczegółowe komunikaty błędów
    let errorMessage = 'Wystąpił błąd podczas wysyłania formularza'
    let errorDetails = error.message || 'Nieznany błąd'
    
    if (error.message?.includes('Invalid login') || error.message?.includes('authentication')) {
      errorMessage = 'Błąd uwierzytelniania email'
      errorDetails = 'Nieprawidłowe dane logowania SMTP. Sprawdź SMTP_USER i SMTP_PASS w .env.local'
    } else if (error.message?.includes('timeout') || error.message?.includes('ECONNREFUSED')) {
      errorMessage = 'Błąd połączenia z serwerem email'
      errorDetails = 'Nie można połączyć się z serwerem SMTP. Sprawdź SMTP_HOST i SMTP_PORT w .env.local'
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    )
  }
}

function getSenderAddress(): string {
  const rawFrom = process.env.MAIL_FROM?.trim()
  if (rawFrom && rawFrom.length > 0) {
    return rawFrom.replace(/^['"]|['"]$/g, '')
  }

  const smtpUser = process.env.SMTP_USER
  if (!smtpUser) {
    throw new Error('Brak konfiguracji MAIL_FROM oraz SMTP_USER')
  }

  return `"HuntWays Travel" <${smtpUser}>`
}

function generateSummaryText(formData: any): string {
  const lines: string[] = []
  lines.push('PODSUMOWANIE REZERWACJI')
  lines.push('')
  lines.push('— SZCZEGÓŁY LOTU —')
  lines.push(`Skąd: ${formData.from || '-'}`)
  lines.push(`Dokąd: ${formData.to || '-'}`)
  lines.push(`Typ podróży: ${formData.tripType || '-'}`)
  lines.push(`Rodzaj lotu: ${formData.flightType || '-'}`)
  lines.push(`Data wyjazdu: ${formData.dateFrom || '-'}`)
  
  if (formData.tripType === 'roundtrip' && formData.dateTo) {
    lines.push(`Data powrotu: ${formData.dateTo}`)
  }
  
  if (formData.tripType === 'multicity' && formData.multiCity) {
    lines.push(`Miasta Multi City: ${formData.multiCity.map((c: any) => `${c.city} (${c.date})`).join(', ')}`)
    if (formData.multiCityReturn && formData.multiCityReturnDate) {
      lines.push(`Data powrotu: ${formData.multiCityReturnDate}`)
    }
  }
  
  lines.push(`Ilość osób: ${formData.adults || 0} dorośli, ${formData.children || 0} dzieci, ${formData.infants || 0} niemowlęta`)
  lines.push(`Preferowana pora dnia wylotu: ${formData.departureTime || '-'}`)
  
  if (formData.handLuggage && formData.handLuggage.length > 0) {
    const handLuggageList = formData.handLuggage
      .filter((item: any) => parseInt(item.count || 0) > 0)
      .map((item: any) => `${item.type === 'plecak' ? 'Plecak' : 'Walizka kabinowa'} x${item.count}`)
    if (handLuggageList.length > 0) {
      lines.push(`Bagaż podręczny: ${handLuggageList.join(', ')}`)
    }
  }
  
  if (formData.checkedLuggage && formData.checkedLuggage.length > 0) {
    const checkedLuggageList = formData.checkedLuggage
      .filter((item: any) => item.weight)
      .map((item: any) => `Walizka ${item.weight}kg`)
    if (checkedLuggageList.length > 0) {
      lines.push(`Bagaż rejestrowany: ${checkedLuggageList.join(', ')}`)
    }
  }
  
  lines.push(`Wybór miejsca: ${formData.seatChoice === 'tak' ? 'Tak' : 'Nie'}`)
  
  if (formData.specialNeedsMain === 'tak') {
    const specialNeeds: string[] = []
    if (formData.airportAssist) {
      if (formData.maas) specialNeeds.push('Opiekun na lotnisku (MAAS)')
      if (formData.wchr) specialNeeds.push('WCHR')
      if (formData.wchs) specialNeeds.push('WCHS')
      if (formData.wchc) specialNeeds.push('WCHC')
      if (formData.deaf) specialNeeds.push('DEAF')
      if (formData.blnd) specialNeeds.push('BLND')
      if (formData.manualWheelchair) specialNeeds.push('Wózek inwalidzki manualny')
      if (formData.electricWheelchair) specialNeeds.push('Wózek inwalidzki elektryczny')
    }
    if (formData.dietaryRestrictions) specialNeeds.push('Ograniczenia dietetyczne')
    if (formData.medicalEquipment) specialNeeds.push('Sprzęt medyczny')
    if (formData.mobilityAssistance) specialNeeds.push('Pomoc w poruszaniu się')
    if (formData.visualAssistance) specialNeeds.push('Pomoc dla osób niewidomych')
    if (formData.hearingAssistance) specialNeeds.push('Pomoc dla osób niesłyszących')
    if (formData.cognitiveAssistance) specialNeeds.push('Pomoc dla osób z zaburzeniami poznawczymi')
    if (formData.petTravel) specialNeeds.push('Podróż z zwierzęciem')
    if (formData.infantTravel) specialNeeds.push('Podróż z niemowlęciem')
    
    lines.push(`Potrzeby specjalne: ${specialNeeds.length > 0 ? specialNeeds.join(', ') : 'Brak'}`)
  } else {
    lines.push('Potrzeby specjalne: Brak')
  }
  
  lines.push('')
  lines.push('— SZCZEGÓŁY HOTELU —')
  lines.push(`Jakość hotelu: ${formData.hotelQuality || '-'}`)
  lines.push(`Odległość od centrum: ${formData.distanceCenter || '-'}`)
  lines.push(`Odległość od plaży: ${formData.distanceBeach || '-'}`)
  lines.push(`Ilość pokoi: ${formData.rooms || '-'}`)
  
  if (formData.beds && formData.beds.length > 0) {
    const bedsList = formData.beds
      .filter((bed: any) => parseInt(bed.count || 0) > 0)
      .map((bed: any) => {
        const typeName = bed.type === 'pojedyncze' ? 'Łóżko pojedyncze' : 
                        bed.type === 'podwójne' ? 'Łóżko podwójne' : 'Łóżko małżeńskie'
        const roomInfo = parseInt(formData.rooms || 1) > 1 ? ` (Pokój ${bed.room})` : ''
        return `${typeName} x${bed.count}${roomInfo}`
      })
    if (bedsList.length > 0) {
      lines.push(`Łóżka: ${bedsList.join(', ')}`)
    }
  }
  
  const mealsText = formData.meals && formData.meals.length > 0 
    ? formData.meals.join(', ') 
    : 'Brak'
  lines.push(`Wyżywienie: ${mealsText}`)
  
  lines.push('')
  lines.push('— DODATKI —')
  lines.push(`Ubezpieczenie turystyczne: ${formData.insurance || '-'}`)
  lines.push(`Bilety wstępu (na atrakcje): ${formData.tickets || '-'}`)
  lines.push(`Budżet: ${formData.budget || '-'} ${formData.currency || 'PLN'}`)
  lines.push(`Email: ${formData.email || '-'}`)
  
  return lines.join('\n')
}

function generateSummaryHTML(formData: any): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; color: #333;">
      <h2 style="color: #1976d2; border-bottom: 2px solid #1976d2; padding-bottom: 10px;">
        Podsumowanie rezerwacji
      </h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
        <div style="background: #f7f7fa; padding: 20px; border-radius: 8px;">
          <h3 style="color: #1976d2; margin-top: 0;">Szczegóły lotu</h3>
          <p><strong>Skąd:</strong> ${formData.from || '-'}</p>
          <p><strong>Dokąd:</strong> ${formData.to || '-'}</p>
          <p><strong>Typ podróży:</strong> ${formData.tripType || '-'}</p>
          <p><strong>Rodzaj lotu:</strong> ${formData.flightType || '-'}</p>
          <p><strong>Data wyjazdu:</strong> ${formData.dateFrom || '-'}</p>
          ${formData.tripType === 'roundtrip' && formData.dateTo ? `<p><strong>Data powrotu:</strong> ${formData.dateTo}</p>` : ''}
          ${formData.tripType === 'multicity' && formData.multiCity ? `
            <p><strong>Miasta Multi City:</strong> ${formData.multiCity.map((c: any) => `${c.city} (${c.date})`).join(', ')}</p>
            ${formData.multiCityReturn && formData.multiCityReturnDate ? `<p><strong>Data powrotu:</strong> ${formData.multiCityReturnDate}</p>` : ''}
          ` : ''}
          <p><strong>Ilość osób:</strong> ${formData.adults || 0} dorośli, ${formData.children || 0} dzieci, ${formData.infants || 0} niemowlęta</p>
          <p><strong>Preferowana pora dnia wylotu:</strong> ${formData.departureTime || '-'}</p>
        </div>
        
        <div style="background: #f7f7fa; padding: 20px; border-radius: 8px;">
          <h3 style="color: #1976d2; margin-top: 0;">Szczegóły hotelu</h3>
          <p><strong>Jakość hotelu:</strong> ${formData.hotelQuality || '-'}</p>
          <p><strong>Odległość od centrum:</strong> ${formData.distanceCenter || '-'}</p>
          <p><strong>Odległość od plaży:</strong> ${formData.distanceBeach || '-'}</p>
          <p><strong>Ilość pokoi:</strong> ${formData.rooms || '-'}</p>
          <p><strong>Wyżywienie:</strong> ${formData.meals && formData.meals.length > 0 ? formData.meals.join(', ') : 'Brak'}</p>
        </div>
      </div>
      
      <div style="background: #f7f7fa; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <h3 style="color: #1976d2; margin-top: 0;">Dodatki</h3>
        <p><strong>Ubezpieczenie turystyczne:</strong> ${formData.insurance || '-'}</p>
        <p><strong>Bilety wstępu (na atrakcje):</strong> ${formData.tickets || '-'}</p>
        <p><strong>Budżet:</strong> ${formData.budget || '-'} ${formData.currency || 'PLN'}</p>
        <p><strong>Email klienta:</strong> ${formData.email || '-'}</p>
      </div>
    </div>
  `
}

