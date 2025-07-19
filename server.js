const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

// Speichert alle aktiven Räume
const rooms = {};

server.on('connection', (ws) => {
    console.log('Neue Verbindung hergestellt');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        switch(data.type) {
            case 'CREATE_ROOM':
                handleCreateRoom(ws, data);
                break;
            case 'JOIN_ROOM':
                handleJoinRoom(ws, data);
                break;
            case 'LEAVE_ROOM':
                handleLeaveRoom(ws, data);
                break;
        }
    });

    ws.on('close', () => {
        // Entferne Spieler aus Räumen wenn Verbindung getrennt wird
        handlePlayerDisconnect(ws);
    });
});

function handleCreateRoom(ws, data) {
    const roomCode = generateRoomCode();
    rooms[roomCode] = {
        players: [{
            name: data.username,
            ws: ws
        }],
        host: data.username,
        maxPlayers: 4
    };
    
    ws.roomCode = roomCode;
    
    // Bestätige Raumerstellung
    ws.send(JSON.stringify({
        type: 'ROOM_CREATED',
        roomCode: roomCode,
        players: [data.username],
        host: data.username
    }));
}

function handleJoinRoom(ws, data) {
    const room = rooms[data.roomCode];
    
    if (!room) {
        ws.send(JSON.stringify({
            type: 'ERROR',
            message: 'Raum nicht gefunden'
        }));
        return;
    }

    if (room.players.length >= room.maxPlayers) {
        ws.send(JSON.stringify({
            type: 'ERROR',
            message: 'Raum ist voll'
        }));
        return;
    }

    if (room.players.some(p => p.name === data.username)) {
        ws.send(JSON.stringify({
            type: 'ERROR',
            message: 'Benutzername bereits vergeben'
        }));
        return;
    }

    // Füge Spieler zum Raum hinzu
    room.players.push({
        name: data.username,
        ws: ws
    });
    ws.roomCode = data.roomCode;

    // Informiere alle Spieler im Raum
    const playerNames = room.players.map(p => p.name);
    room.players.forEach(player => {
        player.ws.send(JSON.stringify({
            type: 'ROOM_UPDATE',
            players: playerNames,
            host: room.host
        }));
    });
}

function handleLeaveRoom(ws, data) {
    if (ws.roomCode && rooms[ws.roomCode]) {
        removePlayerFromRoom(ws, ws.roomCode);
    }
}

function handlePlayerDisconnect(ws) {
    if (ws.roomCode && rooms[ws.roomCode]) {
        removePlayerFromRoom(ws, ws.roomCode);
    }
}

function removePlayerFromRoom(ws, roomCode) {
    const room = rooms[roomCode];
    if (!room) return;

    // Entferne Spieler aus dem Raum
    room.players = room.players.filter(p => p.ws !== ws);

    if (room.players.length === 0) {
        // Lösche leere Räume
        delete rooms[roomCode];
    } else {
        // Wenn der Host geht, mache den nächsten Spieler zum Host
        if (room.host === ws.username) {
            room.host = room.players[0].name;
        }

        // Informiere verbleibende Spieler
        const playerNames = room.players.map(p => p.name);
        room.players.forEach(player => {
            player.ws.send(JSON.stringify({
                type: 'ROOM_UPDATE',
                players: playerNames,
                host: room.host
            }));
        });
    }
}

function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

console.log('WebSocket Server läuft auf Port 8080');
