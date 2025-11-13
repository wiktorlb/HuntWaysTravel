import { NextRequest, NextResponse } from 'next/server'

// OPCJA 1: Formspree - najprostsze rozwiązanie
// Nie wymaga konfiguracji SMTP, działa od razu
// Rejestracja: https://formspree.io/ (darmowy plan: 50 formularzy/miesiąc)

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

    // Generowanie tekstu podsumowania
    const summaryText = generateSummaryText(formData)

    // Formspree endpoint - ZMIEŃ NA SWÓJ FORM_ID
    // 1. Zarejestruj się na https://formspree.io/
    // 2. Utwórz nowy formularz
    // 3. Skopiuj Form ID (np. "xyznljqn")
    // 4. Wklej poniżej zamiast "YOUR_FORM_ID"
    const formspreeEndpoint = `https://formspree.io/f/YOUR_FORM_ID`

    // Wysyłka do Formspree
    const response = await fetch(formspreeEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        _subject: 'Nowe zgłoszenie - Kreator podróży',
        _replyto: formData.email,
        email: formData.email,
        message: summaryText,
        // Dodatkowe pola
        from: formData.from,
        to: formData.to,
        tripType: formData.tripType,
        dateFrom: formData.dateFrom,
        dateTo: formData.dateTo,
        adults: formData.adults,
        children: formData.children,
        infants: formData.infants,
        budget: `${formData.budget} ${formData.currency}`,
        // Wszystkie dane jako JSON
        fullData: JSON.stringify(formData, null, 2),
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Błąd podczas wysyłania do Formspree')
    }

    return NextResponse.json(
      { message: 'Formularz został wysłany pomyślnie' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Błąd podczas wysyłania formularza:', error)
    return NextResponse.json(
      { 
        error: 'Wystąpił błąd podczas wysyłania formularza',
        details: error.message
      },
      { status: 500 }
    )
  }
}

function generateSummaryText(formData: any): string {
  const lines: string[] = []
  lines.push('PODSUMOWANIE REZERWACJI')
  lines.push('')
  lines.push('— SZCZEGÓŁY LOTU —')
  lines.push(`Skąd: ${formData.from || '-'}`)
  lines.push(`Dokąd: ${formData.to || '-'}`)
  lines.push(`Typ podróży: ${formData.tripType || '-'}`)
  lines.push(`Data wyjazdu: ${formData.dateFrom || '-'}`)
  if (formData.dateTo) lines.push(`Data powrotu: ${formData.dateTo}`)
  lines.push(`Ilość osób: ${formData.adults || 0} dorośli, ${formData.children || 0} dzieci, ${formData.infants || 0} niemowlęta`)
  lines.push('')
  lines.push('— SZCZEGÓŁY HOTELU —')
  lines.push(`Jakość hotelu: ${formData.hotelQuality || '-'}`)
  lines.push(`Ilość pokoi: ${formData.rooms || '-'}`)
  lines.push('')
  lines.push('— DODATKI —')
  lines.push(`Budżet: ${formData.budget || '-'} ${formData.currency || 'PLN'}`)
  lines.push(`Email: ${formData.email || '-'}`)
  
  return lines.join('\n')
}

