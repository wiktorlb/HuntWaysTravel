# HuntWays Travel - Aplikacja Next.js

Nowoczesna aplikacja do planowania podróży zbudowana w Next.js.

## Wymagania

- Node.js (wersja 18 lub nowsza)
- npm, yarn lub pnpm

## Instalacja

### 1. Zainstaluj Node.js (jeśli nie masz)

Pobierz i zainstaluj Node.js z oficjalnej strony: https://nodejs.org/

Po instalacji sprawdź, czy Node.js i npm są dostępne:

```bash
node --version
npm --version
```

### 2. Zainstaluj zależności

W katalogu projektu uruchom:

```bash
npm install
```

lub jeśli masz yarn:

```bash
yarn install
```

lub jeśli masz pnpm:

```bash
pnpm install
```

### 3. Konfiguracja emaili (Backend)

Aby formularz i newsletter działały poprawnie, musisz skonfigurować wysyłanie emaili.

1. Skopiuj plik `.env.example` jako `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Otwórz plik `.env.local` i wypełnij dane:

   **Dla Gmail:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=twoj-email@gmail.com
   SMTP_PASS=twoje-haslo-aplikacji
   RECIPIENT_EMAIL=wiktorlabocha123@gmail.com
   SEND_CONFIRMATION=true
   ```
   
   **Uwaga:** Formularz będzie automatycznie wysyłany na:
   - Adres z `RECIPIENT_EMAIL` (domyślnie: wiktorlabocha123@gmail.com)
   - Adres email wpisany przez użytkownika w formularzu

   **Ważne dla Gmail:**
   - Musisz użyć hasła aplikacji, nie zwykłego hasła
   - Aby wygenerować hasło aplikacji:
     1. Przejdź do https://myaccount.google.com/apppasswords
     2. Wybierz "Aplikacja" i "Poczta"
     3. Wybierz "Urządzenie" i wpisz nazwę (np. "HuntWays Travel")
     4. Skopiuj wygenerowane hasło do `SMTP_PASS`

   **Dla innych dostawców email:**
   - Outlook: `smtp-mail.outlook.com`, port `587`
   - Yahoo: `smtp.mail.yahoo.com`, port `587`
   - Sprawdź dokumentację swojego dostawcy email

### 4. Uruchom serwer deweloperski

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: http://localhost:3000

## Struktura projektu

- `app/` - Główne strony i komponenty aplikacji
  - `page.tsx` - Strona główna
  - `formularz/` - Strona z formularzem podróży
  - `galeria/` - Galeria zdjęć
  - `opinie/` - Opinie klientów
  - `components/` - Komponenty React
  - `api/` - API endpoints (backend)
    - `submit-form/` - Endpoint do wysyłania formularza
    - `newsletter/` - Endpoint do zapisu do newslettera
- `package.json` - Zależności projektu
- `tsconfig.json` - Konfiguracja TypeScript
- `.env.local` - Konfiguracja emaili (nie commitowany)

## Funkcjonalności

- ✅ Responsywny design
- ✅ Wieloetapowy formularz podróży
- ✅ Galeria zdjęć
- ✅ Opinie klientów
- ✅ Newsletter z zapisem do bazy
- ✅ Backend API do obsługi formularzy
- ✅ Wysyłanie emaili (SMTP)
- ✅ Email potwierdzający dla klientów
- ✅ Nowoczesny UI

## Rozwiązywanie problemów

### npm nie jest rozpoznawany

Jeśli otrzymujesz błąd "npm is not recognized", oznacza to, że Node.js nie jest zainstalowany lub nie jest w PATH systemowym.

1. Zainstaluj Node.js z https://nodejs.org/
2. Zrestartuj terminal/PowerShell
3. Sprawdź instalację: `node --version` i `npm --version`

### Błędy TypeScript

Po zainstalowaniu zależności (`npm install`), błędy TypeScript powinny zniknąć. Jeśli nadal występują:

1. Usuń folder `.next` (jeśli istnieje)
2. Uruchom ponownie `npm install`
3. Zrestartuj serwer deweloperski

## API Endpoints

### POST `/api/submit-form`
Wysyła dane z formularza podróży na email.

**Request body:**
```json
{
  "email": "klient@example.com",
  "from": "Warszawa",
  "to": "Paryż",
  "tripType": "roundtrip",
  // ... pozostałe pola formularza
}
```

**Response:**
```json
{
  "message": "Formularz został wysłany pomyślnie"
}
```

### POST `/api/newsletter`
Zapisuje użytkownika do newslettera.

**Request body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Zapisano do newslettera pomyślnie"
}
```

## Build produkcyjny

```bash
npm run build
npm start
```

## Konfiguracja produkcyjna

W środowisku produkcyjnym upewnij się, że:

1. Wszystkie zmienne środowiskowe są ustawione w `.env.local` lub w panelu hostingu
2. `SMTP_USER` i `SMTP_PASS` są prawidłowe
3. `RECIPIENT_EMAIL` wskazuje na właściwy adres do odbierania zgłoszeń
4. `SEND_CONFIRMATION` jest ustawione zgodnie z preferencjami

## Bezpieczeństwo

- Plik `.env.local` jest ignorowany przez git (nie jest commitowany)
- Nigdy nie commituj prawdziwych haseł i danych dostępowych
- Używaj haseł aplikacji zamiast zwykłych haseł (dla Gmail)
- W produkcji używaj zmiennych środowiskowych z panelu hostingu

