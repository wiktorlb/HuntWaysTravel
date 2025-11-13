# Szybka instrukcja - Web3Forms (NAJPROSTSZE!)

## Krok 1: Pobierz Access Key (30 sekund)

1. Przejdź do: **https://web3forms.com/**
2. Wpisz swój email: **wiktorlabocha123@gmail.com**
3. Kliknij **"Get Your Access Key"**
4. **Skopiuj klucz** (wygląda tak: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

## Krok 2: Dodaj klucz do .env.local

Otwórz plik `.env.local` i dodaj linię:

```env
WEB3FORMS_ACCESS_KEY=twój-klucz-tutaj
```

**Przykład:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=wiktorlabocha123@gmail.com
SMTP_PASS=
RECIPIENT_EMAIL=wiktorlabocha123@gmail.com
SEND_CONFIRMATION=true
WEB3FORMS_ACCESS_KEY=12345678-1234-1234-1234-123456789abc
```

## Krok 3: Zmień endpoint w TravelForm.tsx

Otwórz plik `app/components/TravelForm.tsx` i znajdź linię 120:

**Zmień z:**
```typescript
const response = await fetch('/api/submit-form', {
```

**Na:**
```typescript
const response = await fetch('/api/submit-form-web3forms', {
```

## Krok 4: Zrestartuj serwer

1. Zatrzymaj serwer (Ctrl+C)
2. Uruchom ponownie: `npm run dev`

## Gotowe! ✅

Teraz formularz będzie działał bez konfiguracji SMTP!

Email będzie przychodził na: **wiktorlabocha123@gmail.com**

---

## Alternatywa: Formspree (również proste)

Jeśli Web3Forms nie działa, użyj Formspree:

1. Zarejestruj się: https://formspree.io/
2. Utwórz formularz
3. Skopiuj Form ID
4. Otwórz `app/api/submit-form-formspree/route.ts`
5. Zamień `YOUR_FORM_ID` na swój ID
6. W `TravelForm.tsx` zmień endpoint na `/api/submit-form-formspree`

