const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const globalErrorHandler = require('./controllers/error.controller');
const authRouter = require('./routers/auth.router');
const messageRouter = require('./routers/message.router');
const cors = require('cors');
const chatRouter = require('./routers/chat.router');
const cookieParser = require('cookie-parser');
const { v4: uuidV4 } = require('uuid');

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_URI,
    credentials: true
}));

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URI,
        credentials: true,
        methods: ["GET", "POST"]
    }
});

app.use((req, res, next) => {
    req.io = io;

    next();
});

app.use('/api/auth', authRouter);
app.use('/api/messages', messageRouter);
app.use('/api/chat', chatRouter);

app.use(globalErrorHandler);

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`);
});

console.log(uuidV4());

app.use(express.static('public'));

app.get('/:room', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    socket.on('join', (chatId) => {
        socket.join(chatId);
    });

    socket.on('initiate-call', ({ chatId, callerId, callerName, callType }) => {
        socket.to(chatId).emit('incoming-call', {
            callerId,
            callerName,
            chatId,
            callType
        });
    });

    socket.on('accept-call', ({ chatId, accepterId }) => {
        socket.to(chatId).emit('call-accepted', { accepterId });
    });

    socket.on('reject-call', ({ chatId, rejecterId }) => {
        socket.to(chatId).emit('call-rejected', { rejecterId });
    });

    socket.on('end-call', ({ chatId }) => {
        socket.to(chatId).emit('call-ended');
    });

    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);

        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId);
        });
    });
});

mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('connected to mongoDB');

        server.listen(process.env.PORT, () => {
            console.log('The server is running on port 3000');
        });
    }).catch(err => {
        console.log(err);

        process.exit(1);
    });

/* WebSocket - გვერხმარება რეალურ დროში client - სა და server - ს შორის ინფორმაციის გაცვლაში 
http - hyper text transfer protocol რომელიც client - საც და server - საც ეხმარება ინფორმაციის გაცვლაში 
WebSocket - ის დახმარებით ორივეს შეუძლია ინფორმაციის გაცვლა რეალურ დროში */