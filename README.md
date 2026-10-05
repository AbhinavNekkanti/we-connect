# We-Connect - Friends Chatting App

Friends:
ABHI, GAYATRI, KOUSHIK, BILL, PRIYANKA, HARSHITHA, CHANDANA

Features:
- Real-time two-way private chat with Socket.IO
- Profile photos
- Online/offline status
- Typing indicator
- Message likes
- 20 emojis
- Responsive component-based React UI

## Run

1. Open this folder in VS Code.
2. Open the terminal.
3. Run:
   npm install
4. Run:
   npm run start
5. Open the Vite URL shown in the terminal, normally:
   http://localhost:5173

## Test two-way chat

Open the app in two browser windows.

Window 1:
- Select "ABHI" in "You are chatting as"
- Click GAYATRI
- Send a message

Window 2:
- Select "GAYATRI"
- Click ABHI
- You should receive the message and can reply.

Messages are stored in server memory while the server is running. Restarting the server clears chat history.

## Message sending fix

The message input now waits for the Socket.IO connection before sending. The first message will not be lost if the connection is still starting.
