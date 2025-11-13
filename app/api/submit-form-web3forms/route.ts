import { NextRequest, NextResponse } from 'next/server'

// OPCJA 4: Web3Forms - najprostsze, bez rejestracji
// 1. Przejdź do: https://web3forms.com/
// 2. Wpisz email: wiktorlabocha123@gmail.com
// 3. Skopiuj Access Key
// 4. Dodaj do .env.local: WEB3FORMS_ACCESS_KEY=xxx

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

    // Sprawdzenie Access Key
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY
    if (!accessKey) {
      return NextResponse.json(
        { 
          error: 'Brak konfiguracji Web3Forms',
          details: 'Dodaj WEB3FORMS_ACCESS_KEY do .env.local. Pobierz klucz z https://web3forms.com/'
        },
        { status: 500 }
      )
    }

    // Generowanie tekstu podsumowania
    const summaryText = generateSummaryText(formData)

    // Wysyłka do Web3Forms
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: 'Nowe zgłoszenie - Kreator podróży',
        from_name: 'HuntWays Travel',
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

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Błąd podczas wysyłania do Web3Forms')
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

