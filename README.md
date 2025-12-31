# Anuvaad Matrix Client (Modified Hydrogen)

This is a modified version of the Hydrogen Matrix web client, enhanced with an integrated, on-demand translation system for Indian languages.

## 🌟 Custom Features

In-Chat Translation: A "Translate" button appears for messages not in your native language.

Language Metadata: Automatically tags outgoing messages with the sender's language preference.

Automatic Detection: Seamlessly integrates with the SaralVarta Backend to detect languages for untagged messages.

Custom UI: A native-looking language selector in the room header.

🛠️ Setup Instructions

1. Prerequisites

Node.js (Latest LTS recommended)

Yarn or npm

Anuvaad Backend running at http://localhost:5000

2. Installation

## Clone the repository
git clone [https://github.com/yourusername/saralvarta-client.git](https://github.com/yourusername/saralvarta-client.git)
cd saralvarta-client

## Install dependencies
yarn install


3. Configuration

Ensure your API Key in src/platform/web/ui/session/room/timeline/TextMessageView.js matches the one set in your backend:

const response = await fetch("[http://127.0.0.1:5000/translate](http://127.0.0.1:5000/translate)", {
    headers: { "X-API-KEY": "your-super-secret-key-123" },
    // ...
});


4. Development

yarn start


The app will be available at http://localhost:3000.

##📂 Key Modifications

TextMessageView.js: Implements the fetch logic for detection and translation.

RoomView.js: Adds the "My Language" dropdown UI.

RoomViewModel.js: Handles the injection of language metadata into Matrix events.

##👥 Contributors

Yashwant Kumar Upadhyay

Vikrant Kumar

Medhabrata Konwar

Debashis Bhuyan

Bhargab Jyoti Bhuyan

Yajant Kumar

Guides: Anil Kumar Gupta (CDAC), Dr. Nabajyoti Medhi (Tezpur University)

##📄 License

The original Hydrogen client is licensed under Apache 2.0.
