# Alternatywne metody wysyłki emaili

## Opcja 1: Formspree (NAJPROSTSZE - REKOMENDOWANE) ⭐

### Zalety:
- ✅ Działa od razu, bez konfiguracji SMTP
- ✅ Darmowy plan: 50 formularzy/miesiąc
- ✅ Nie wymaga hasła aplikacji Gmail
- ✅ Automatyczna ochrona przed spamem
- ✅ Email przychodzi na Twój adres (ustawiasz w panelu Formspree)

### Jak skonfigurować:

1. **Zarejestruj się na Formspree:**
   - Przejdź do: https://formspree.io/
   - Kliknij "Get Started" (darmowe)
   - Zaloguj się przez Google/GitHub/Email

2. **Utwórz nowy formularz:**
   - Kliknij "New Form"
   - Nazwij formularz: "HuntWays Travel"
   - Skopiuj **Form ID** (np. `xyznljqn`)

3. **Skonfiguruj odbiorcę email:**
   - W ustawieniach formularza ustaw:
     - **Email notifications:** `wiktorlabocha123@gmail.com`
     - **Reply-to:** `{{email}}` (email z formularza)

4. **Zaktualizuj kod:**
   - Otwórz: `app/api/submit-form-formspree/route.ts`
   - Zamień `YOUR_FORM_ID` na swój Form ID
   - Zmień w `TravelForm.tsx` endpoint z `/api/submit-form` na `/api/submit-form-formspree`

### Koszt: DARMOWE (do 50 formularzy/miesiąc)

---

## Opcja 2: EmailJS (Działa bez backendu)

### Zalety:
- ✅ Działa całkowicie po stronie klienta (bez API)
- ✅ Darmowy plan: 200 emaili/miesiąc
- ✅ Łatwa konfiguracja
- ✅ Nie wymaga backendu

### Jak skonfigurować:

1. **Zarejestruj się na EmailJS:**
   - Przejdź do: https://www.emailjs.com/
   - Kliknij "Sign Up" (darmowe)
   - Zaloguj się

2. **Dodaj serwis email:**
   - Przejdź do "Email Services"
   - Wybierz "Gmail" (lub inny)
   - Połącz swoje konto Gmail

3. **Utwórz szablon email:**
   - Przejdź do "Email Templates"
   - Kliknij "Create New Template"
   - Ustaw:
     - **To Email:** `wiktorlabocha123@gmail.com`
     - **Reply To:** `{{email}}`
     - **Subject:** `Nowe zgłoszenie - Kreator podróży`
     - **Content:** Skopiuj szablon z instrukcji

4. **Zainstaluj pakiet:**
   ```bash
   npm install @emailjs/browser
   ```

5. **Zaktualizuj komponent:**
   - Użyj kodu z pliku `TravelForm-emailjs.tsx` (utworzę poniżej)

### Koszt: DARMOWE (do 200 emaili/miesiąc)

---

## Opcja 3: Resend (Nowoczesne API)

### Zalety:
- ✅ Nowoczesne API
- ✅ Darmowy plan: 3000 emaili/miesiąc
- ✅ Łatwa integracja
- ✅ Wymaga tylko API key

### Jak skonfigurować:

1. **Zarejestruj się:**
   - Przejdź do: https://resend.com/
   - Kliknij "Get Started" (darmowe)

2. **Utwórz API Key:**
   - Przejdź do "API Keys"
   - Kliknij "Create API Key"
   - Skopiuj klucz

3. **Zainstaluj pakiet:**
   ```bash
   npm install resend
   ```

4. **Dodaj do .env.local:**
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

5. **Użyj endpointu:** `/api/submit-form-resend` (utworzę poniżej)

### Koszt: DARMOWE (do 3000 emaili/miesiąc)

---

## Opcja 4: Web3Forms (Najprostsze, bez rejestracji)

### Zalety:
- ✅ Nie wymaga rejestracji
- ✅ Działa od razu
- ✅ Darmowe, bez limitów
- ✅ Wymaga tylko Access Key

### Jak skonfigurować:

1. **Pobierz Access Key:**
   - Przejdź do: https://web3forms.com/
   - Wpisz swój email: `wiktorlabocha123@gmail.com`
   - Kliknij "Get Your Access Key"
   - Skopiuj klucz

2. **Dodaj do .env.local:**
   ```env
   WEB3FORMS_ACCESS_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

3. **Użyj endpointu:** `/api/submit-form-web3forms` (utworzę poniżej)

### Koszt: DARMOWE (bez limitów)

---

## Którą opcję wybrać?

| Opcja | Łatwość | Limit | Rekomendacja |
|-------|---------|-------|--------------|
| **Formspree** | ⭐⭐⭐⭐⭐ | 50/mies | ✅ NAJLEPSZE |
| **EmailJS** | ⭐⭐⭐⭐ | 200/mies | ✅ Dobra |
| **Resend** | ⭐⭐⭐ | 3000/mies | ✅ Bardzo dobra |
| **Web3Forms** | ⭐⭐⭐⭐⭐ | Bez limitu | ✅ Najprostsze |

## Szybka zmiana metody

Aby przełączyć się na inną metodę, wystarczy zmienić endpoint w `TravelForm.tsx`:

```typescript
// Obecnie:
const response = await fetch('/api/submit-form', { ... })

// Formspree:
const response = await fetch('/api/submit-form-formspree', { ... })

// Resend:
const response = await fetch('/api/submit-form-resend', { ... })

// Web3Forms:
const response = await fetch('/api/submit-form-web3forms', { ... })
```

