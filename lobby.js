let ws;
let currentRoom = null;

// Verbindung zum WebSocket Server herstellen
function connectWebSocket() {
    ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
        console.log('Verbunden mit dem Server');
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleServerMessage(data);
    };

    ws.onclose = () => {
        console.log('Verbindung zum Server getrennt');
        // Versuche nach 5 Sekunden neu zu verbinden
        setTimeout(connectWebSocket, 5000);
    };
}

function handleServerMessage(data) {
    switch(data.type) {
        case 'ROOM_CREATED':
            currentRoom = data.roomCode;
            updateRoomDisplay(data.players, data.host);
            break;
        case 'ROOM_UPDATE':
            updateRoomDisplay(data.players, data.host);
            break;
        case 'ERROR':
            alert(data.message);
            break;
    }
}

function raumErstellen() {
    const username = document.getElementById('username').value;
    if (!username) {
        alert('Bitte gib einen Benutzernamen ein!');
        return;
    }

    ws.send(JSON.stringify({
        type: 'CREATE_ROOM',
        username: username
    }));
}

function raumBeitreten() {
    const username = document.getElementById('username').value;
    const roomCode = document.getElementById('raumcode').value.toUpperCase();

    if (!username) {
        alert('Bitte gib einen Benutzernamen ein!');
        return;
    }

    if (!roomCode) {
        alert('Bitte gib einen Raumcode ein!');
        return;
    }

    ws.send(JSON.stringify({
        type: 'JOIN_ROOM',
        username: username,
        roomCode: roomCode
    }));
}

function updateRoomDisplay(players, host) {
    const roomDisplay = document.getElementById('room-display');
    const username = document.getElementById('username').value;
    
    roomDisplay.innerHTML = `
        <h3>Raum: ${currentRoom}</h3>
        <p>Spieler (${players.length}/4):</p>
        <ul>
            ${players.map(player => `
                <li>${player}${player === host ? ' (Host)' : ''}</li>
            `).join('')}
        </ul>
    `;

    // Host-Kontrollen anzeigen
    if (username === host) {
        if (players.length >= 2) {
            document.getElementById('startGame').style.display = 'block';
        } else {
            document.getElementById('startGame').style.display = 'none';
        }
    }

    document.getElementById('room-controls').style.display = 'block';
}

function startGame() {
    // Hier später die Logik zum Spielstart hinzufügen
    window.location.href = 'play.html';
}

// Verbindung beim Laden der Seite herstellen
window.addEventListener('load', connectWebSocket);
