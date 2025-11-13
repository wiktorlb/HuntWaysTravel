import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Walidacja emaila
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Nieprawidłowy adres email' },
        { status: 400 }
      )
    }

    // Konfiguracja transporter email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Email do administratora o nowym zapisie
    const adminMail = {
      from: `"HuntWays Travel" <${process.env.SMTP_USER}>`,
      to: process.env.RECIPIENT_EMAIL || process.env.SMTP_USER,
      subject: 'Nowy zapis do newslettera',
      text: `Nowy użytkownik zapisał się do newslettera: ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #1976d2;">Nowy zapis do newslettera</h2>
          <p>Adres email: <strong>${email}</strong></p>
          <p>Data zapisu: ${new Date().toLocaleString('pl-PL')}</p>
        </div>
      `,
    }

    await transporter.sendMail(adminMail)

    // Email potwierdzający do użytkownika
    const confirmationMail = {
      from: `"HuntWays Travel" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Dziękujemy za zapisanie się do newslettera!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1976d2;">Dziękujemy za zapisanie się do newslettera!</h2>
          <p>Witaj w społeczności HuntWays Travel!</p>
          <p>Będziemy informować Cię o:</p>
          <ul>
            <li>Najlepszych ofertach podróży</li>
            <li>Promocjach i zniżkach</li>
            <li>Nowościach i inspiracjach podróżniczych</li>
            <li>Poradach dotyczących planowania podróży</li>
          </ul>
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Pozdrawiamy,<br>
            Zespół HuntWays Travel
          </p>
        </div>
      `,
    }

    await transporter.sendMail(confirmationMail)

    return NextResponse.json(
      { message: 'Zapisano do newslettera pomyślnie' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Błąd podczas zapisu do newslettera:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas zapisu do newslettera', details: error.message },
      { status: 500 }
    )
  }
}

