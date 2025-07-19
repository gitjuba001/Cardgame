// Spielvariablen
var aktuellePhase = 1;
var money = 100; // Startgeld

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
  document.getElementById("auszaehlBtn").style.display = nummer === 3 ? "" : "none";
  document.getElementById("neuesSpielBtn").style.display = nummer === 4 ? "" : "none";
  document.getElementById("betinput").style.display = nummer === 3 ? "" : "none";
  
  aktuellePhase = nummer;
}

function phase3() {
  zeigePhase(3);
}

function neuesSpiel() {
  aktuelleKarten = [];
  aktuellesDeck = [];
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
      // Zahl extrahieren
      var teile = karte.split(" ");
      if (teile.length > 1) {
        wert = parseInt(teile[1]);
      }
    }
    summe = summe + wert;
    k = k + 1;
  }
  // Ausgabe
  var ergebnis = "Summe der Hand: " + summe;
  document.getElementById('auszaehlErgebnis').innerText = ergebnis;
  // Nach dem Auszählen zu Phase 4 wechseln
  zeigePhase(4);
}
var aktuelleKarten = [];
var aktuellesDeck = [];

function kartenZiehen() {
  // Neues Deck kopieren
  aktuellesDeck = [];
  for (var i = 0; i < deck.length; i++) {
    aktuellesDeck.push(deck[i]);
  }

  // 5 Karten ziehen
  aktuelleKarten = [];
  var j = 0;
  while (j < 5 && aktuellesDeck.length > 0) {
    var zufall = Math.floor(Math.random() * aktuellesDeck.length);
    aktuelleKarten.push(aktuellesDeck[zufall]);
    // Karte aus Deck entfernen
    var neuesDeck = [];
    for (var d = 0; d < aktuellesDeck.length; d++) {
      if (d != zufall) {
        neuesDeck.push(aktuellesDeck[d]);
      }
    }
    aktuellesDeck = neuesDeck;
    j = j + 1;
  }
  kartenAnzeigen();
  zeigePhase(2);  // Wechsel zu Phase 2 nach dem Ziehen
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
      if (eineAusgewaehlt) {
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
      // Karte aus Deck entfernen
      var neuesDeck = [];
      var d = 0;
      while (d < aktuellesDeck.length) {
        if (d != zufall) {
          neuesDeck.push(aktuellesDeck[d]);
        }
        d = d + 1;
      }
      aktuellesDeck = neuesDeck;
    }
    i = i + 1;
  }
  kartenAnzeigen();
}
