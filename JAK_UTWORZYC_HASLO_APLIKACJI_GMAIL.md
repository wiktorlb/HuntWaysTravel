# Jak utworzyć hasło aplikacji Gmail

## Krok po kroku

### 1. Przejdź do ustawień konta Google

Otwórz w przeglądarce:
**https://myaccount.google.com/apppasswords**

### 2. Zaloguj się

Zaloguj się na konto: **wiktorlabocha123@gmail.com**

### 3. Jeśli nie widzisz opcji "Hasła aplikacji"

Jeśli nie widzisz opcji "Hasła aplikacji", musisz najpierw włączyć weryfikację dwuetapową:

1. Przejdź do: https://myaccount.google.com/security
2. Włącz "Weryfikację dwuetapową" (jeśli nie jest włączona)
3. Wróć do: https://myaccount.google.com/apppasswords

### 4. Utwórz hasło aplikacji

1. W sekcji "Hasła aplikacji" wybierz:
   - **Aplikacja:** Poczta
   - **Urządzenie:** Inne (nazwa niestandardowa)
   - Wpisz: **HuntWays Travel**

2. Kliknij **Generuj**

3. **SKOPIUJ 16-ZNAKOWE HASŁO** (bez spacji!)

   Przykład: `abcd efgh ijkl mnop` → skopiuj jako: `abcdefghijklmnop`

### 5. Wklej hasło do pliku .env.local

Otwórz plik `.env.local` i wklej hasło w miejsce `SMTP_PASS=`:

```env
SMTP_PASS=abcdefghijklmnop
```

**WAŻNE:** 
- Nie dodawaj spacji w hasle
- Nie używaj cudzysłowów
- Hasło ma 16 znaków (bez spacji)

### 6. Zrestartuj serwer

Po zapisaniu pliku `.env.local`:
1. Zatrzymaj serwer (Ctrl+C)
2. Uruchom ponownie: `npm run dev`

## Gotowe!

Teraz formularz powinien działać poprawnie. 

Email będzie wysyłany na:
- **wiktorlabocha123@gmail.com** (Twój adres)
- Adres email wpisany przez użytkownika w formularzu

## Rozwiązywanie problemów

### "Invalid login" / "Authentication failed"
- Sprawdź, czy hasło aplikacji jest prawidłowe (16 znaków, bez spacji)
- Upewnij się, że weryfikacja dwuetapowa jest włączona

### Nie widzę opcji "Hasła aplikacji"
- Musisz najpierw włączyć weryfikację dwuetapową
- Sprawdź: https://myaccount.google.com/security

### Hasło nie działa
- Upewnij się, że skopiowałeś hasło bez spacji
- Sprawdź, czy w pliku `.env.local` nie ma cudzysłowów wokół hasła
- Zrestartuj serwer po zmianie `.env.local`

