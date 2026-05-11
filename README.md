# BüroBrücke

> **Fotografiere deinen Behördenbrief — wir erklären, was du tun musst.**

BüroBrücke hilft Menschen mit Migrationshintergrund in Deutschland, deutsche Behördenbriefe zu verstehen. Lade ein Foto, einen Scan oder ein PDF hoch — die App nutzt Claude (Anthropic) und OCR, um den Brief zu analysieren und in deiner Sprache zu erklären, was zu tun ist.

## Features

- 📸 Upload von Foto, Scan oder PDF
- 🤖 KI-gestützte Analyse mit Claude (Modell: `claude-opus-4-5`)
- 🔍 Automatische OCR für Bilder und bildbasierte PDFs
- 🌍 Erklärungen in **Deutsch, Türkisch, Arabisch, Russisch, Kurmancî**
- 📅 Frist-Erkennung mit Dringlichkeits-Anzeige
- ✉️ Generierung eines höflichen Antwortentwurfs auf Deutsch
- 🔐 Account-System mit JWT-Authentifizierung
- 🌗 Modernes Dark-Mode-Design

## Tech Stack

| Bereich | Technologien |
| --- | --- |
| Backend | Python 3.11+, FastAPI, SQLAlchemy 2.0 (async), SQLite, Anthropic SDK, PyMuPDF, pytesseract |
| Frontend | React 18, Vite, Tailwind CSS, react-router-dom, react-i18next, react-hook-form, react-dropzone |
| Auth | JWT (python-jose) + bcrypt (passlib) |
| KI | `claude-opus-4-5` über das offizielle `anthropic`-SDK |

## Voraussetzungen

- **Python ≥ 3.11**
- **Node.js ≥ 18**
- **Tesseract OCR** mit deutschem Sprachpaket
  - macOS: `brew install tesseract tesseract-lang`
  - Ubuntu/Debian: `sudo apt-get install tesseract-ocr tesseract-ocr-deu`
  - Windows: [Installer von UB Mannheim](https://github.com/UB-Mannheim/tesseract/wiki)

## Projektstruktur

```
buerbruecke/
├── backend/        # FastAPI + SQLAlchemy + Claude
├── frontend/       # React + Vite + Tailwind
├── README.md
└── .gitignore
```

## Setup

### 1. Repository klonen

```bash
git clone <repository-url> buerbruecke
cd buerbruecke
```

### 2. Backend einrichten

```bash
cd backend

# Virtuelle Umgebung anlegen
python3 -m venv .venv
source .venv/bin/activate           # Windows: .venv\Scripts\activate

# Abhängigkeiten installieren
pip install -r requirements.txt

# Konfiguration
cp .env.example .env
# Trage in .env deinen ANTHROPIC_API_KEY und einen sicheren SECRET_KEY ein.
# Tipp: openssl rand -hex 32   liefert einen passenden SECRET_KEY.
```

#### `ANTHROPIC_API_KEY` besorgen

1. Konto auf [console.anthropic.com](https://console.anthropic.com/) anlegen
2. Unter **API Keys** einen neuen Schlüssel erzeugen
3. In `backend/.env` als `ANTHROPIC_API_KEY=...` eintragen

### 3. Frontend einrichten

```bash
cd ../frontend
npm install
cp .env.example .env
# Standardmäßig zeigt VITE_API_BASE_URL auf http://localhost:8000
```

## App starten

### Terminal 1 — Backend

```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload --port 8000
```

→ API erreichbar unter <http://localhost:8000>, Swagger-Doku unter <http://localhost:8000/docs>

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

→ App erreichbar unter <http://localhost:5173>

## API-Endpoints (Übersicht)

### Auth (`/api/auth`)

| Methode | Pfad | Beschreibung |
| --- | --- | --- |
| `POST` | `/register` | Konto erstellen, gibt JWT zurück |
| `POST` | `/login` | Anmelden, gibt JWT zurück |
| `GET` | `/me` | Aktuelles Profil |
| `PATCH` | `/me` | Profil aktualisieren (z. B. Sprache) |

### Dokumente (`/api/documents`)

| Methode | Pfad | Beschreibung |
| --- | --- | --- |
| `POST` | `/upload` | Datei hochladen (multipart/form-data, max 10 MB) |
| `GET` | `/` | Alle eigenen Dokumente |
| `GET` | `/{id}` | Einzelnes Dokument inkl. Analyse |
| `DELETE` | `/{id}` | Dokument löschen |

### Analyse (`/api/analysis`)

| Methode | Pfad | Beschreibung |
| --- | --- | --- |
| `POST` | `/{document_id}` | KI-Analyse starten |
| `GET` | `/{document_id}` | Vorhandene Analyse abrufen |
| `POST` | `/{document_id}/reply` | Antwortentwurf generieren |

## Sicherheit

- Passwörter werden mit **bcrypt** (12 Runden) gehasht
- JWT (HS256), 30 Tage gültig
- Upload-Validierung: Typ (`jpg`/`png`/`pdf`) und Größe (≤ 10 MB)
- Rate-Limit: 10 Uploads pro Minute pro Client-IP
- CORS auf konfigurierte Origins beschränkt
- Originaldateinamen werden nicht im Dateisystem gespeichert (UUID + Extension)

## Mehrsprachigkeit

Die UI und die KI-Erklärungen sind verfügbar in:

- 🇩🇪 Deutsch (`de`)
- 🇹🇷 Türkçe (`tr`)
- 🇸🇦 العربية (`ar`) — RTL-Layout
- 🇷🇺 Русский (`ru`)
- 🏴 Kurmancî (`ku`)

Sprache lässt sich beim Registrieren auswählen und jederzeit über die Navigation ändern.

## Screenshots

> _Hier später Screenshots ergänzen:_
>
> - Landing Page
> - Dashboard mit Dokumenten
> - Upload-Flow
> - Analyse-Ergebnis mit Frist-Badge

## Troubleshooting

| Problem | Lösung |
| --- | --- |
| `tesseract is not installed` | Tesseract OCR und das deutsche Sprachpaket installieren (siehe Voraussetzungen). |
| `RuntimeError: KI-Dienst ist gerade nicht verfügbar` | `ANTHROPIC_API_KEY` in `backend/.env` prüfen. |
| `CORS error` im Browser | `CORS_ORIGINS` in `backend/.env` muss die Frontend-URL enthalten (Komma-Liste). |
| OCR liefert leeren Text | Foto schärfer oder kontrastreicher aufnehmen; ggf. PDF anstelle des Fotos hochladen. |

## Disclaimer

BüroBrücke ist ein Hilfswerkzeug und ersetzt **keine Rechtsberatung**. Bei rechtlich verbindlichen Fragen wende dich an eine Beratungsstelle, einen Anwalt oder die zuständige Behörde.

## Lizenz

MVP — alle Rechte vorbehalten.
