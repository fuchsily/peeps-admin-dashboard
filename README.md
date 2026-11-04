# peeps Admin-Dashboard

Ein webbasiertes Admin-Dashboard für **peeps**, das als Prototyp entwickelt wurde, um administrative Prozesse zentral, übersichtlich und benutzerfreundlich abzubilden.

Das Dashboard ermöglicht die Verwaltung von Nutzern, die Bearbeitung gemeldeter Inhalte sowie die Prüfung von Identitätsverifizierungen.

> **Projektstatus:** UI-Prototyp / Proof of Concept. Die Anwendung kombiniert Firebase-Daten mit simulierten administrativen Funktionen und ist nicht für den produktiven Einsatz vorgesehen.

## Funktionen

### 1. Dashboard-Übersicht

Die Startseite bietet einen zentralen Überblick über wichtige Kennzahlen und offene administrative Aufgaben.

- Anzeige der gesamten, aktiven und gesperrten Nutzer
- Übersicht über offene Nutzer- und Event-Meldungen
- Anzeige ausstehender Nutzerverifizierungen
- Direkte Navigation zu den jeweiligen Verwaltungsbereichen
- Automatische Aktualisierung der Kennzahlen bei Änderungen an den gemeinsamen Mock-Daten

### 2. Meldungsverwaltung (Reports)

Die Reports-Seite dient der Bearbeitung gemeldeter Nutzer und Veranstaltungen.

**Funktionen:**

- Übersicht aller eingegangenen Meldungen
- Such- und Filtermöglichkeiten nach Typ und Status
- Detailansicht mit Meldegrund und zusätzlichen Informationen
- Simuliertes Sperren gemeldeter Nutzer
- Simuliertes Blockieren und Absagen gemeldeter Veranstaltungen
- Schließen unbegründeter Meldungen
- Bestätigungsdialoge für administrative Aktionen
- Warnhinweis bei kostenpflichtigen Veranstaltungen, für die gegebenenfalls Rückerstattungen erforderlich wären

Die Meldungsdaten werden aus Firebase Firestore geladen. Die Bearbeitung der Meldungen erfolgt im Prototyp ausschließlich simuliert im Frontend.

### 3. Nutzerverifizierung

Die Nutzerverifizierung ermöglicht die Prüfung eingereichter Identitätsnachweise.

**Funktionen:**

- Übersicht offener und bereits bearbeiteter Verifizierungsanfragen
- Filterung nach Bearbeitungsstatus
- Detailansicht mit Nutzerinformationen und Dokumenttyp
- Platzhalter für die Vorschau eines Identitätsdokuments
- Annahme oder Ablehnung einer Verifizierungsanfrage
- Bestätigungsdialog vor jeder Entscheidung
- Aktualisierung des Verifizierungsstatus

Für die Nutzerverifizierung werden ausschließlich fiktive Testdaten verwendet. Es werden keine echten Identitätsdokumente verarbeitet.

### 4. Nutzerverwaltung (User Management)

Die Nutzerverwaltung konzentriert sich auf die Verwaltung und Einschränkung von Nutzeraccounts.

**Funktionen:**

- Suchfunktion nach Name, E-Mail-Adresse oder Nutzer-ID
- Separate Tabellen für aktive und gesperrte Nutzer
- Direkte Sperrung und Entsperrung von Nutzeraccounts
- Pflichtfeld zur Angabe einer Begründung
- Anzeige des Sperrdatums und des Sperrgrundes
- Übersicht über die Anzahl aktiver und gesperrter Nutzer
- Dynamische Aktualisierung der Tabellen nach administrativen Aktionen

Alle Sperrungen und Entsperrungen werden im Prototyp simuliert. Es werden keine echten Nutzeraccounts verändert.

## Verwendete Technologien

| Technologie             | Verwendung                                      |
| ----------------------- | ----------------------------------------------- |
| Vue 3                   | Frontend-Framework                              |
| TypeScript              | Typsichere Anwendungsentwicklung                |
| Quasar Framework        | UI-Komponenten und responsives Layout           |
| Vite                    | Entwicklungsserver und Build-Prozess            |
| SCSS                    | Styling und zentrale Designvariablen            |
| Vue Router              | Navigation und Routing                          |
| Firebase Authentication | Admin-Authentifizierung                         |
| Firebase Firestore      | Speicherung und Bereitstellung der Report-Daten |
| Firebase Emulator Suite | Optionale lokale Firebase-Testumgebung          |

## Projektstruktur

```text
peeps-admin-dashboard/
├── frontend/
│   └── src/
│       ├── assets/          # Logo und weitere Grafiken
│       ├── components/      # Wiederverwendbare UI-Komponenten
│       ├── composables/     # Gemeinsamer reaktiver Zustand
│       ├── css/             # SCSS-Styles und Designvariablen
│       ├── data/            # Zentrale Mock-Daten
│       ├── layouts/         # Hauptlayout mit Navigation
│       ├── pages/           # Einzelne Dashboard-Seiten
│       ├── router/          # Routing und Zugriffskontrolle
│       ├── services/        # Firebase-Anbindung
│       └── types/           # TypeScript-Typdefinitionen
├── functions/               # Experimentelle Firebase Cloud Functions
├── scripts/                 # Setup- und Seeding-Skripte
├── firebase.json
└── README.md
```

## Installation und lokale Ausführung

### Voraussetzungen

Für die lokale Ausführung werden benötigt:

- Node.js und npm
- Ein konfiguriertes Firebase-Projekt
- Firebase Authentication und Firestore
- Ein Admin-Testaccount mit entsprechenden Berechtigungen

### 1. Repository klonen

```bash
git clone <repository-url>
cd peeps-admin-dashboard
```

### 2. Abhängigkeiten installieren

```bash
cd frontend
npm install
```

### 3. Firebase konfigurieren

Im Verzeichnis `frontend/` muss eine `.env`-Datei mit den Firebase-Konfigurationswerten vorhanden sein.

Beispiel:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Die Werte stammen aus der Firebase-Projektkonfiguration.

Je nach lokaler Konfiguration können für den Entwicklungsbetrieb zusätzlich die Firebase Emulatoren erforderlich sein.

### 4. Entwicklungsserver starten

Im Verzeichnis `frontend/`:

```bash
npm run dev
```

Anschließend kann die Anwendung über die im Terminal angezeigte lokale Adresse im Browser geöffnet werden.

### 5. Produktions-Build erstellen

```bash
npm run build
```

Der Build erstellt die Frontend-Dateien. Eine automatische Bereitstellung des Firebase-Backends erfolgt dadurch nicht.

## Mock-Daten und Datenverwaltung

Die Anwendung verwendet eine Kombination aus Firebase-Daten und lokal definierten Testdaten.

### Firebase

Firebase wird für folgende Bereiche eingesetzt:

- Anmeldung und Authentifizierung des Admin-Testaccounts
- Laden vorhandener Nutzer- und Event-Meldungen aus Firestore

### Lokale Mock-Daten

Für die übrigen administrativen Funktionen werden zentral verwaltete Testdaten verwendet.

Dazu gehören:

- Nutzeraccounts
- Aktive und gesperrte Nutzer
- Sperrgründe und Sperrdaten
- Verifizierungsanfragen
- Simulierte Statusänderungen

Die Mock-Daten befinden sich unter anderem in:

```text
frontend/src/data/mockUsers.ts
frontend/src/composables/useDemoUsers.ts
frontend/src/composables/useDemoVerifications.ts
```

Durch die gemeinsame Datenverwaltung können mehrere Seiten auf denselben reaktiven Zustand zugreifen.

Beispielsweise wird die Anzahl gesperrter Nutzer auf der Dashboard-Übersicht automatisch angepasst, wenn ein Nutzer in der Nutzerverwaltung gesperrt wird.

### Einschränkungen

Die simulierten Änderungen werden derzeit ausschließlich im Arbeitsspeicher des Browsers gehalten.

Das bedeutet:

- Statusänderungen bleiben während der aktuellen Anwendungssitzung erhalten.
- Beim vollständigen Neuladen werden die ursprünglichen Mock-Daten wiederhergestellt.
- Änderungen an Mock-Daten werden nicht in Firestore gespeichert.

## Design und Benutzeroberfläche

Das Dashboard orientiert sich an der visuellen Identität von peeps.

Verwendet werden:

- Die peeps-Markenfarbe Violett
- Cremefarbene Hintergründe und weiße Oberflächen
- Die Schriftart Manrope
- Konsistente Karten, Tabellen und Statusanzeigen
- Einheitliche Bestätigungsdialoge
- Responsive Layouts mit Quasar

Die Gestaltung basiert auf zentral definierten SCSS-Variablen.

```text
frontend/src/css/quasar.variables.scss
frontend/src/css/variables.scss
frontend/src/css/app.scss
```

Dadurch lassen sich Farben, Abstände, Schriftgrößen und weitere Gestaltungselemente zentral anpassen.

## Mögliche Weiterentwicklung

Für einen späteren produktiven Einsatz wären unter anderem folgende Erweiterungen denkbar:

- Dauerhafte Speicherung administrativer Entscheidungen in Firestore
- Serverseitige Validierung und Ausführung kritischer Aktionen
- Rollenbasierte Zugriffskontrolle
- Audit-Logging administrativer Aktionen
- Echte Nutzer- und Business-Verifizierung
- Automatisierte Benachrichtigungen
- Anbindung von Event-Stornierungen und Rückerstattungen
- Erweiterte Analytics- und Reporting-Funktionen

Diese Erweiterungen sind nicht Teil des aktuellen Prototyps.
