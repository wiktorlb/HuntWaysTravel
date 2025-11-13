# Jak przełączyć się na inną metodę wysyłki emaili

## Obecna metoda: SMTP (Gmail)

Wymaga hasła aplikacji Gmail.

## Przełączanie na Web3Forms (NAJPROSTSZE)

### 1. Pobierz Access Key
- Przejdź do: https://web3forms.com/
- Wpisz: wiktorlabocha123@gmail.com
- Skopiuj klucz

### 2. Dodaj do .env.local
```env
WEB3FORMS_ACCESS_KEY=twój-klucz
```

### 3. Zmień endpoint w TravelForm.tsx

Znajdź linię **120** w `app/components/TravelForm.tsx`:

```typescript
// ZMIEŃ Z:
const response = await fetch('/api/submit-form', {

// NA:
const response = await fetch('/api/submit-form-web3forms', {
```

### 4. Zrestartuj serwer
```bash
npm run dev
```

---

## Przełączanie na Formspree

### 1. Zarejestruj się
- Przejdź do: https://formspree.io/
- Utwórz formularz
- Skopiuj Form ID

### 2. Zaktualizuj kod
- Otwórz: `app/api/submit-form-formspree/route.ts`
- Zamień `YOUR_FORM_ID` na swój ID

### 3. Zmień endpoint
W `TravelForm.tsx` linia 120:
```typescript
const response = await fetch('/api/submit-form-formspree', {
```

---

## Powrót do SMTP (Gmail)

Jeśli chcesz wrócić do SMTP:
1. Ustaw hasło aplikacji w `.env.local`
2. W `TravelForm.tsx` użyj: `/api/submit-form`

---

## Która metoda jest najlepsza?

| Metoda | Łatwość | Limit | Rekomendacja |
|--------|---------|-------|--------------|
| **Web3Forms** | ⭐⭐⭐⭐⭐ | Bez limitu | ✅ NAJPROSTSZE |
| **Formspree** | ⭐⭐⭐⭐ | 50/mies | ✅ Bardzo dobra |
| **SMTP (Gmail)** | ⭐⭐ | Bez limitu | ⚠️ Wymaga hasła aplikacji |

