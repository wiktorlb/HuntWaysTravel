# Konfiguracja wysyłania emaili

## Szybki start

1. Skopiuj `.env.example` jako `.env.local`
2. Wypełnij dane w `.env.local`
3. Uruchom aplikację

## Konfiguracja dla różnych dostawców

### Gmail

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=twoj-email@gmail.com
SMTP_PASS=haslo-aplikacji
MAIL_FROM="HuntWays Travel <twoj-email@gmail.com>"
RECIPIENT_EMAIL=biuro@huntwaystravel.com
SEND_CONFIRMATION=true
```

**Ważne:** Dla Gmail musisz użyć hasła aplikacji, nie zwykłego hasła.

**Jak wygenerować hasło aplikacji:**
1. Przejdź do https://myaccount.google.com/apppasswords
2. Zaloguj się na swoje konto Google
3. Wybierz "Aplikacja": Poczta
4. Wybierz "Urządzenie": Inne (nazwa niestandardowa)
5. Wpisz nazwę (np. "HuntWays Travel")
6. Kliknij "Generuj"
7. Skopiuj 16-znakowe hasło do `SMTP_PASS`

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

### Inne dostawcy

Sprawdź dokumentację swojego dostawcy email dla:
- Host SMTP
- Port (zwykle 587 dla TLS lub 465 dla SSL)
- Czy wymagane jest hasło aplikacji

## Zmienne środowiskowe

| Zmienna | Opis | Przykład |
|---------|------|----------|
| `SMTP_HOST` | Host serwera SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Port SMTP | `587` |
| `SMTP_SECURE` | Czy używać połączenia szyfrowanego (SSL) | `false` (ustaw na `true` dla portu 465) |
| `SMTP_USER` | Email używany do wysyłania | `biuro@huntwaystravel.com` |
| `SMTP_PASS` | Hasło do konta email | `haslo-aplikacji` |
| `MAIL_FROM` | Nazwa i adres nadawcy wyświetlany u odbiorcy | `"HuntWays Travel <biuro@huntwaystravel.com>"` |
| `RECIPIENT_EMAIL` | Email, na który przychodzą zgłoszenia | `biuro@huntwaystravel.com` |
| `SEND_CONFIRMATION` | Czy wysyłać potwierdzenie klientowi | `true` lub `false` |

> Jeśli nie ustawisz `RECIPIENT_EMAIL`, zgłoszenia i tak trafią na domyślny adres administratora `wiktorlabocha123@gmail.com`.

## Testowanie

Po skonfigurowaniu:

1. Uruchom aplikację: `npm run dev`
2. Wypełnij formularz podróży
3. Sprawdź, czy email przyszedł na `RECIPIENT_EMAIL`
4. Jeśli `SEND_CONFIRMATION=true`, klient również otrzyma email potwierdzający

> Brak `RECIPIENT_EMAIL`? Wiadomość zostanie wysłana na domyślny adres administracyjny `wiktorlabocha123@gmail.com`.

## Rozwiązywanie problemów

### Błąd: "Invalid login"
- Sprawdź, czy `SMTP_USER` i `SMTP_PASS` są prawidłowe
- Dla Gmail upewnij się, że używasz hasła aplikacji

### Błąd: "Connection timeout"
- Sprawdź, czy port jest prawidłowy
- Sprawdź firewall i czy port nie jest zablokowany

### Błąd: "Authentication failed"
- Dla Gmail: użyj hasła aplikacji zamiast zwykłego hasła
- Sprawdź, czy włączona jest weryfikacja dwuetapowa (wymagana dla haseł aplikacji)

### Email nie przychodzi
- Sprawdź folder SPAM
- Sprawdź, czy `RECIPIENT_EMAIL` jest prawidłowy
- Sprawdź logi w konsoli serwera

## Bezpieczeństwo

⚠️ **WAŻNE:**
- Nigdy nie commituj pliku `.env.local` do repozytorium
- Używaj haseł aplikacji zamiast zwykłych haseł
- W produkcji ustaw zmienne środowiskowe w panelu hostingu
- Regularnie zmieniaj hasła dostępowe

