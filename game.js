// Spielvariablen
var aktuellePhase = 1;
var money = 100; // Startgeld
var spieler2HandWert = 45; // Testwert für Spieler 2's Hand
var kartenGetauscht = false; // Trackt ob Karten bereits getauscht wurden
var aktuellerEinsatz = 0; // Aktueller Einsatz im Spiel
var spieler1Einsatz = 0; // Einsatz von Spieler 1
var spieler2Einsatz = 0; // Einsatz von Spieler 2
var amZug = 'spieler2'; // Wer ist am Zug

// Wenn die Seite geladen ist
window.onload = function() {
    // Geld anzeigen
    document.getElementById("money").innerText = "Geld: " + money + "€";
    
    // Zugriff auf das Input-Feld
    var inputFeld = document.getElementById("betinput");
    if(inputFeld) {
        inputFeld.max = money;
        inputFeld.min = 1;
    }
};

function zeigePhase(nummer) {
  // Phasen-Anzeige aktualisieren
  var phasen = document.getElementsByClassName("phase");
  var i = 0;
  while (i < phasen.length) {
    if (i + 1 === nummer) {
      phasen[i].classList.add("aktiv");
    } else {
      phasen[i].classList.remove("aktiv");
    }
    i = i + 1;
  }
  
  // Buttons ein-/ausblenden je nach Phase
  document.getElementById("ziehenBtn").style.display = nummer === 1 ? "" : "none";
  document.getElementById("neuZiehenBtn").style.display = nummer === 2 ? "" : "none";
  document.getElementById("fertigBtn").style.display = nummer === 2 ? "" : "none";
  document.getElementById("bettingArea").style.display = nummer === 3 ? "" : "none";
  document.getElementById("winOptions").style.display = "none"; // Immer ausblenden bei Phasenwechsel
  document.getElementById("auszaehlBtn").style.display = nummer === 4 ? "" : "none";
  document.getElementById("neuesSpielBtn").style.display = nummer === 5 ? "" : "none";
  
  aktuellePhase = nummer;
}

function phase3() {
    zeigePhase(3);
    // Spieler 2 beginnt mit 5€
    spieler2Einsatz = 5;
    aktuellerEinsatz = 5;
    amZug = 'spieler1';
    updateBettingDisplay();
    document.getElementById("auszaehlErgebnis").innerText = "Spieler 2 setzt " + spieler2Einsatz + "€";
}

function updateBettingDisplay() {
    document.getElementById("currentBet").innerText = 
        `Aktueller Einsatz: ${aktuellerEinsatz}€\n` +
        `Spieler 1: ${spieler1Einsatz}€\n` +
        `Spieler 2: ${spieler2Einsatz}€`;
}

function handleBet() {
    var bet = parseInt(document.getElementById("betinput").value);
    if (isNaN(bet) || bet <= aktuellerEinsatz) {
        alert("Dein Einsatz muss höher als " + aktuellerEinsatz + "€ sein!");
        return;
    }
    if (bet > money) {
        alert("Du hast nicht genug Geld!");
        return;
    }

    spieler1Einsatz = bet;
    aktuellerEinsatz = bet;
    amZug = 'spieler2';
    updateBettingDisplay();
    
    // Simuliere Spieler 2's Reaktion
    simulatePlayer2Response();
}

function simulatePlayer2Response() {
    // Einfache Simulation: Spieler 2 passt bei Einsätzen über 20€
    if (aktuellerEinsatz > 20) {
        // Spieler 2 passt, Spieler 1 gewinnt Entscheidungsrecht
        document.getElementById("bettingArea").style.display = "none";
        document.getElementById("winOptions").style.display = "";
    } else {
        // Spieler 2 erhöht um 5€
        spieler2Einsatz = aktuellerEinsatz + 5;
        aktuellerEinsatz = spieler2Einsatz;
        amZug = 'spieler1';
        updateBettingDisplay();
    }
}

function handlePass() {
    // Spieler 1 passt, Spieler 2 erhält Entscheidungsrecht
    document.getElementById("bettingArea").style.display = "none";
    
    // Spieler 2 trifft automatisch eine Entscheidung (simuliert)
    let spieler2WaehltHoch = Math.random() < 0.5; // 50% Chance für hoch/niedrig
    handleWinOption(spieler2WaehltHoch);
}

function handleBet() {
  var bet = parseInt(document.getElementById("betinput").value);
  if (bet > spieler2Einsatz) {
    // Blende Wetteinsatz-Elemente aus und zeige Gewinnoptionen
    document.getElementById("betinput").style.display = "none";
    document.getElementById("betBtn").style.display = "none";
    document.getElementById("winOptions").style.display = "block";
  } else {
    // Bei niedrigerem oder gleichem Einsatz direkt zu Phase 4
    zeigePhase(4);
  }
}

function handleWinOption(hoeherGewinnt) {
  localStorage.setItem('hoeheresBlattGewinnt', hoeherGewinnt);
  document.getElementById("winOptions").style.display = "none";
  zeigePhase(4);
}

function neuesSpiel() {
  aktuelleKarten = [];
  aktuellesDeck = [];
  kartenGetauscht = false; // Reset beim neuen Spiel
  document.getElementById("karten").innerHTML = "";
  document.getElementById("auszaehlErgebnis").innerText = "";
  zeigePhase(1);
}

function auszaehlen() {
    // Werte: Ass=14, König=13, Dame=12, Bube=11, Zahlen=Zahl, Joker=0
    var summe = 0;
    var k = 0;
    while (k < aktuelleKarten.length) {
        var karte = aktuelleKarten[k];
        var wert = 0;
        if (karte.indexOf("Ass") !== -1) {
            wert = 14;
        } else if (karte.indexOf("König") !== -1) {
            wert = 13;
        } else if (karte.indexOf("Dame") !== -1) {
            wert = 12;
        } else if (karte.indexOf("Bube") !== -1) {
            wert = 11;
        } else if (karte.indexOf("Joker") !== -1) {
            wert = 0;
        } else {
            wert = parseInt(karte.split(" ")[1]) || 0;
        }
        summe = summe + wert;
        k = k + 1;
    }
    
    // Vergleich mit Spieler 2
    var hoeheresBlattGewinnt = localStorage.getItem('hoeheresBlattGewinnt') === 'true';
    var ergebnis = "Spielmodus: " + (hoeheresBlattGewinnt ? "Höheres" : "Niedrigeres") + " Blatt gewinnt\n";
    ergebnis += "Deine Hand: " + summe + "\nSpieler 2's Hand: " + spieler2HandWert;
    
    if ((hoeheresBlattGewinnt && summe > spieler2HandWert) || (!hoeheresBlattGewinnt && summe < spieler2HandWert)) {
        ergebnis += "\nDu gewinnst!";
    } else {
        ergebnis += "\nSpieler 2 gewinnt!";
    }
    
    document.getElementById('auszaehlErgebnis').innerText = ergebnis;
    zeigePhase(5); // Wechsel zur Phase 5 (Spielende)
}

var aktuelleKarten = [];
var aktuellesDeck = [];

function kartenZiehen() {
    // Neues Deck kopieren
    aktuellesDeck = deck.slice(); // Kopiere das komplette Deck
    
    // 5 Karten ziehen
    aktuelleKarten = [];
    for (var i = 0; i < 5 && aktuellesDeck.length > 0; i++) {
        var zufall = Math.floor(Math.random() * aktuellesDeck.length);
        aktuelleKarten.push(aktuellesDeck[zufall]);
        aktuellesDeck.splice(zufall, 1);
    }
    kartenGetauscht = false; // Reset beim Start eines neuen Spiels
    kartenAnzeigen();
    zeigePhase(2);
}

function kartenAnzeigen() {
  var ausgabe = '';
  var k = 0;
  while (k < aktuelleKarten.length) {
    ausgabe += '<div class="karte" data-index="' + k + '">' + aktuelleKarten[k] + '</div>';
    k = k + 1;
  }
  document.getElementById('karten').innerHTML = ausgabe;

  // Karten auswählbar machen
  var kartenElemente = document.getElementsByClassName("karte");
  var i = 0;
  while (i < kartenElemente.length) {
    kartenElemente[i].addEventListener("click", function () {
      if (kartenGetauscht) {
        alert("Du hast deine Karten bereits getauscht!");
        return;
      }
      if (this.classList.contains("ausgewaehlt")) {
        this.classList.remove("ausgewaehlt");
      } else {
        this.classList.add("ausgewaehlt");
      }
      // Button ein-/ausblenden
      var eineAusgewaehlt = false;
      var j = 0;
      while (j < kartenElemente.length) {
        if (kartenElemente[j].classList.contains("ausgewaehlt")) {
          eineAusgewaehlt = true;
        }
        j = j + 1;
      }
      if (eineAusgewaehlt && !kartenGetauscht) {
        document.getElementById('neuZiehenBtn').style.display = '';
      } else {
        document.getElementById('neuZiehenBtn').style.display = 'none';
      }
    });
    i = i + 1;
  }
  // Button ausblenden, falls keine Auswahl
  document.getElementById('neuZiehenBtn').style.display = 'none';
}

function ausgewaehlteNeuZiehen() {
  if (kartenGetauscht) {
    alert("Du hast deine Karten bereits getauscht!");
    return;
  }

  // Finde ausgewählte Karten
  var kartenElemente = document.getElementsByClassName("karte");
  var i = 0;
  while (i < kartenElemente.length) {
    if (kartenElemente[i].classList.contains("ausgewaehlt")) {
      // Neue Karte ziehen
      if (aktuellesDeck.length === 0) {
        i = i + 1;
        continue;
      }
      var zufall = Math.floor(Math.random() * aktuellesDeck.length);
      aktuelleKarten[i] = aktuellesDeck[zufall];
      aktuellesDeck.splice(zufall, 1);
    }
    i = i + 1;
  }
  kartenGetauscht = true;
  document.getElementById('neuZiehenBtn').style.display = 'none';
  kartenAnzeigen();
}
