# Instrukcja konfiguracji - Rozwiązywanie błędu 500

## Problem: Błąd 500 podczas wysyłania formularza

Jeśli widzisz błąd **500 (Internal Server Error)**, oznacza to, że backend nie ma skonfigurowanych danych do wysyłania emaili.

## Szybkie rozwiązanie

### Krok 1: Utwórz plik `.env.local`

W głównym katalogu projektu utwórz plik `.env.local` (jeśli nie istnieje).

### Krok 2: Skopiuj przykładową konfigurację

Otwórz plik `.env.example` (jeśli istnieje) lub użyj poniższej konfiguracji:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=twoj-email@gmail.com
SMTP_PASS=twoje-haslo-aplikacji
RECIPIENT_EMAIL=biuro@huntwaystravel.com
SEND_CONFIRMATION=true
```

### Krok 3: Wypełnij dane

**Dla Gmail (najczęściej używane):**

1. **SMTP_USER** - Twój adres Gmail (np. `mojemail@gmail.com`)

2. **SMTP_PASS** - **WAŻNE:** Musisz użyć hasła aplikacji, nie zwykłego hasła!
   
   Jak wygenerować hasło aplikacji:
   - Przejdź do: https://myaccount.google.com/apppasswords
   - Zaloguj się na swoje konto Google
   - Wybierz "Aplikacja": **Poczta**
   - Wybierz "Urządzenie": **Inne (nazwa niestandardowa)**
   - Wpisz nazwę: `HuntWays Travel`
   - Kliknij **Generuj**
   - Skopiuj 16-znakowe hasło (bez spacji) do `SMTP_PASS`

3. **RECIPIENT_EMAIL** - Email, na który mają przychodzić zgłoszenia (może być ten sam co SMTP_USER)

4. **SEND_CONFIRMATION** - `true` jeśli chcesz wysyłać potwierdzenie klientowi, `false` jeśli nie

### Krok 4: Zrestartuj serwer

Po utworzeniu/zmianie pliku `.env.local`:

1. Zatrzymaj serwer (Ctrl+C)
2. Uruchom ponownie: `npm run dev`

## Przykładowy plik `.env.local`

```env
# Konfiguracja SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mojemail@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
RECIPIENT_EMAIL=biuro@huntwaystravel.com
SEND_CONFIRMATION=true
```

**UWAGA:** 
- Plik `.env.local` jest ignorowany przez git (nie będzie commitowany)
- Nigdy nie commituj prawdziwych haseł!

## Inne dostawcy email

### Outlook / Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=twoj-email@outlook.com
SMTP_PASS=twoje-haslo
```

### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=twoj-email@yahoo.com
SMTP_PASS=twoje-haslo
```

## Sprawdzanie czy działa

1. Uruchom aplikację: `npm run dev`
2. Wypełnij formularz podróży
3. Sprawdź konsolę serwera - powinny pojawić się komunikaty:
   - `Email wysłany pomyślnie do: ...`
   - `Email potwierdzający wysłany do: ...`
4. Sprawdź skrzynkę email na adresie `RECIPIENT_EMAIL`

## Częste błędy

### "Invalid login" / "Authentication failed"
- **Przyczyna:** Nieprawidłowe dane logowania
- **Rozwiązanie:** 
  - Dla Gmail: użyj hasła aplikacji, nie zwykłego hasła
  - Sprawdź, czy SMTP_USER i SMTP_PASS są prawidłowe

### "Connection timeout" / "ECONNREFUSED"
- **Przyczyna:** Nie można połączyć się z serwerem SMTP
- **Rozwiązanie:**
  - Sprawdź SMTP_HOST i SMTP_PORT
  - Sprawdź firewall i czy port nie jest zablokowany

### "Brak konfiguracji email"
- **Przyczyna:** Brak pliku `.env.local` lub brak zmiennych SMTP_USER/SMTP_PASS
- **Rozwiązanie:** Utwórz plik `.env.local` z wymaganymi zmiennymi

## Pomoc

Jeśli nadal masz problemy:
1. Sprawdź konsolę serwera (terminal) - tam są szczegółowe komunikaty błędów
2. Sprawdź, czy plik `.env.local` jest w głównym katalogu projektu
3. Upewnij się, że zrestartowałeś serwer po utworzeniu `.env.local`
4. Sprawdź dokumentację w `KONFIGURACJA_EMAILI.md`

