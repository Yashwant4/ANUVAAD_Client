## Anuvaad Matrix Client (Modified Hydrogen)

A modified Hydrogen Matrix web client with integrated, on‑demand translation for Indian languages.

## Features
- **In‑chat translation:** A "Translate" button appears for messages not in the user's native language.  
- **Language metadata:** Outgoing messages are tagged with the sender's language preference.  
- **Automatic detection:** Integrates with the SaralVarta backend to detect language for untagged messages.  
- **Custom UI:** Native‑looking language selector added to the room header.

## Quickstart

### Prerequisites
- Node.js (Latest LTS recommended)  
- Yarn or npm  
- Anuvaad / SaralVarta backend running (default: http://localhost:5000)

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/saralvarta-client.git
cd saralvarta-client
```
2. Install dependencies
```bash
yarn install
```

### Configuration
Make sure the API key used by the client matches the backend key. Example (src/platform/web/ui/session/room/timeline/TextMessageView.js):
```js
const response = await fetch("http://127.0.0.1:5000/translate", {
  headers: { "X-API-KEY": "your-super-secret-key-123" },
  // ...
});
```
Replace "your-super-secret-key-123" with your backend API key and update the URL if your backend uses a different host/port.

### Development
Start the dev server:
```bash
yarn start
```
App available at: http://localhost:3000

## Key Modifications
- **src/.../TextMessageView.js** — Implements fetch logic for language detection and translation.  
- **src/.../RoomView.js** — Adds the "My Language" dropdown UI in the room header.  
- **src/.../RoomViewModel.js** — Injects language metadata into Matrix events.

## Contributors
- Yashwant Kumar Upadhyay  
- Vikrant Kumar  
- Medhabrata Konwar  
- Debashis Bhuyan  
- Bhargab Jyoti Bhuyan  
- Yajant Kumar  

Guides: Anil Kumar Gupta (CDAC), Dr. Nabajyoti Medhi (Tezpur University)

## License
The original Hydrogen client is licensed under **Apache 2.0**.
