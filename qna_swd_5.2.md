# Preparation en Q & A voor SWD sessie 5.2

## Vragen over WS

{{exLong "ws question 1" "ws question 1"

How do you install an event listener for the typical web-socket events `open`, `message`, and `close`?

exLong}}

{{exLong "ws question 2" "ws question 2"

Does `ws` have a built-in facility to convert objects and arrays automatically to JSON?

exLong}}

{{exLong "ws question 3" "ws question 3"

What is the name of the event you have to listen for to detect new browsers trying to start communicating over the WebSocket protocol? On what kind of object (server or socket) doe you have to install this event listener?

exLong}}

{{exLong "ws question 4" "ws question 4"

Incoming messages cause 'message' events to be emitted on a WebSocket object. How does your code get access to such a WebSocket object?

exLong}}

{{exLong "ws question 5" "ws question 5"

How can you specify what the URL should be that clients must use to connect to your WebSocket Server?

exLong}}

{{exLong "ws question 6" "ws question 6"

If you want to send a message to all browsers that are connected to a WebSocketServer (broadcasting, like the RandomSocket app did), how would you program that?

exLong}}

{{exLong "ws question 7" "ws question 7"

When a WebSocket message is received, how can your code access the exact message text that was sent by the client?

exLong}}

{{exLong "ws question 8" "ws question 8"

Can `ws` only be used as a WebSocketServer, or is it also possible to use it as a WebSocket client (i.e. make your Node.JS app act as a WebSocket client to some other server)?

exLong}}

{{exLong "ws question 9" "ws question 9"

Perhaps your server does not want to accept all incoming connection requests. Maybe you want to handle only a certain number of clients, or you want the connecting request to have some security code in it's URL, or you only want to accept connections between 9:00 AM and 5:00 PM.

What feature of `ws` should you use to tell `ws` to accept or refuse an incoming request?

exLong}}

## Optionele Q & A

{{qna "swd-4.2" 0

qna}}

## Vragen over Rock-paper-scissors

{{exLong "Question 1: List of Messages" "Messages"

Make a list of all kinds of messages that are sent, and all kinds of messages that are received. What extra field do those messages carry?

exLong}}

{{exLong "Question 2: The trick" "Trick"

Study the source code for the RandomSocket app that you used in session 5-1. There is one particular trick you need to notice: for each client that is connected, the server app needs to keep track of the userName and maxValue (among other data). Where does the server store this information, and how does it associate the right user name (for example) with the right websocket connection?

exLong}}