import { useEffect, useState } from "react";
import logo from "./assets/logo.png";
import dashboardBg from "./assets/dashboard-bg.png";
import cardAllenamenti from "./assets/card-allenamenti.png";
import cardGare from "./assets/card-gare.png";
import cardSchede from "./assets/card-schede.png";
import cardStatistiche from "./assets/card-statistiche.png";
import cardAllievi from "./assets/card-allievi.png";
import cardGruppi from "./assets/card-gruppi.png";
import "./App.css";

const API_URL = "https://script.google.com/macros/s/AKfycbyokQ0HXWqPMtGzM7hyo5aOkUeY_NkEbIIXHSjZ8SL-jMwIDieUVVmqZXf85S3ahWY_/exec";

export default function App() {

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [utente, setUtente] = useState(null);
  const [errore, setErrore] = useState("");
  const [pagina, setPagina] = useState("dashboard");
  const [allenamenti, setAllenamenti] = useState([]);
  const [allenamentoSelezionato, setAllenamentoSelezionato] = useState(null);
  const [dettaglioAllenamento, setDettaglioAllenamento] = useState(null);
  const [presenze, setPresenze] = useState({});
  const [salvataggio, setSalvataggio] = useState(false);
  const [reportAllenamento, setReportAllenamento] = useState({
  tema: "",
  comportamento: "",
  note: ""
});
  const [tabAllenamenti, setTabAllenamenti] = useState("");
const [gruppiAllenamento, setGruppiAllenamento] = useState([]);
const [nuovoAllenamento, setNuovoAllenamento] = useState({
  gruppo: "",
  data: "",
  orario: "",
  campo: "",
  ripeti: false,
  settimane: 1
});
const [dataCalendarioSelezionata, setDataCalendarioSelezionata] = useState("");
const [meseCalendario, setMeseCalendario] = useState(new Date());
const [tabGare, setTabGare] = useState("");
const [gare, setGare] = useState([]);
const [nuovaGara, setNuovaGara] = useState({
  gruppo: "",
  data: "",
  orarioGara: "",
  orarioAppuntamento: "",
  campo: "",
  avversario: "",
  casaTrasferta: "Casa",
  note: ""
});
const [tuttiGruppi, setTuttiGruppi] = useState([]);
const [garaSelezionata, setGaraSelezionata] = useState(null);
const [garaModifica, setGaraModifica] = useState(null);
const [risultatoGara, setRisultatoGara] = useState({
  golFatti: "",
  golSubiti: "",
  noteRisultato: ""
});
const [statisticheGara, setStatisticheGara] = useState({});
const [mvpGara, setMvpGara] = useState("");
const [ragazziConvocazioni, setRagazziConvocazioni] = useState([]);
const [convocati, setConvocati] = useState({});
const [orarioAppuntamento, setOrarioAppuntamento] = useState("");
const [garaConvocata, setGaraConvocata] = useState(false);
const [giocatoriSchede, setGiocatoriSchede] = useState([]);
const [giocatoreSelezionato, setGiocatoreSelezionato] = useState(null);
const [schedaModifica, setSchedaModifica] = useState(null);
const [statistiche, setStatistiche] = useState(null);
const [gruppoStatistiche, setGruppoStatistiche] = useState("");
const [dashboardInfo, setDashboardInfo] = useState({
  allievi: 0,
  allieviTotali: 0
});
const [mostraTotali, setMostraTotali] = useState(false);
const [nuovoIscritto, setNuovoIscritto] = useState({

  nome: "",
  gruppo: "",
  dataNascita: "",
  telefono: ""
});
const [listaIscritti, setListaIscritti] = useState([]);
const [ricercaIscritto, setRicercaIscritto] = useState("");
const [iscrittoInModifica, setIscrittoInModifica] = useState(null);
const [gruppoGestione, setGruppoGestione] = useState("");
const [ragazziGruppoGestione, setRagazziGruppoGestione] = useState([]);
const [ragazziSelezionati, setRagazziSelezionati] = useState({});
const [nuovoGruppoGestione, setNuovoGruppoGestione] = useState("");
const [statisticheAllenamenti, setStatisticheAllenamenti] = useState([]);
const [gruppoStatisticheAllenamenti, setGruppoStatisticheAllenamenti] = useState("");
const [dettaglioPresenzeRagazzo, setDettaglioPresenzeRagazzo] = useState(null);

useEffect(() => {

  try {

    var utenteSalvato = localStorage.getItem("utente");
    var ultimoAccesso = localStorage.getItem("ultimoAccesso");

    if(!utenteSalvato || !ultimoAccesso){
      return;
    }

    var ora = new Date().getTime();
    var durataSessione = 90 * 60 * 1000;

    if(ora - Number(ultimoAccesso) <= durataSessione){

      var utenteObj = JSON.parse(utenteSalvato);

      if(!utenteObj || !utenteObj.id){
        localStorage.removeItem("utente");
        localStorage.removeItem("ultimoAccesso");
        return;
      }

      setUtente(utenteObj);
      caricaBootstrap(utenteObj);

      setTimeout(() => {
        precaricaDati(utenteObj);
      }, 800);

    }else{
      localStorage.removeItem("utente");
      localStorage.removeItem("ultimoAccesso");
    }

  }catch(error){

    localStorage.removeItem("utente");
    localStorage.removeItem("ultimoAccesso");

  }

}, []);

  function login(){

  setErrore("");
  setLoading(true);

  window.prova = function(data){

    setLoading(false);

    if(data.esito === "OK"){

  localStorage.setItem("utente", JSON.stringify(data));
  localStorage.setItem("ultimoAccesso", new Date().getTime());

  setUtente(data);
  caricaBootstrap(data);

  setTimeout(() => {
    precaricaDati(data);
  }, 800);

}else{
      setErrore("Dati errati");
    }

    var script = document.getElementById("jsonpLogin");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpLogin";

  script.src =
    API_URL +
    "?action=login" +
    "&id=" + encodeURIComponent(id) +
    "&password=" + encodeURIComponent(password) +
    "&callback=prova";

  script.onerror = function(){
    setLoading(false);
    setErrore("Errore collegamento");
  };

  document.body.appendChild(script);

}
function precaricaDati(utenteLogin){

  precaricaAllenamenti(utenteLogin);
  precaricaSchede(utenteLogin);

  setTimeout(() => {
    precaricaStatistiche(utenteLogin);
  }, 3000);

}
function precaricaAllenamenti(utenteLogin){

  if(allenamenti.length > 0){
    return;
  }

  const callbackName = "callbackPrecaricaAllenamenti";

  window[callbackName] = function(data){

    setAllenamenti(data);

    var script = document.getElementById("jsonpPrecaricaAllenamenti");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpPrecaricaAllenamenti";

  script.src =
    API_URL +
    "?action=allenamenti" +
    "&id=" + encodeURIComponent(utenteLogin.id) +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function precaricaStatistiche(utenteLogin){

  if(statistiche){
    return;
  }

  const callbackName = "callbackPrecaricaStatistiche";

  window[callbackName] = function(data){

    setStatistiche(data);

    var script = document.getElementById("jsonpPrecaricaStatistiche");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpPrecaricaStatistiche";

  script.src =
    API_URL +
    "?action=statistiche" +
    "&id=" + encodeURIComponent(utenteLogin.id) +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function precaricaSchede(utenteLogin){

  if(giocatoriSchede.length > 0){
    return;
  }

  const callbackName = "callbackPrecaricaSchede";

  window[callbackName] = function(data){

    setGiocatoriSchede(data);

    var script = document.getElementById("jsonpPrecaricaSchede");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpPrecaricaSchede";

  script.src =
    API_URL +
    "?action=giocatoriSchede" +
    "&id=" + encodeURIComponent(utenteLogin.id) +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function caricaBootstrap(utenteLogin){

  const callbackName = "callbackBootstrap";

  window[callbackName] = function(data){

    setGruppiAllenamento(data.gruppiUtente || []);

    setDashboardInfo({
  allievi: data.allievi || 0,
  allieviTotali: data.allieviTotali || data.allievi || 0
});

    if(utenteLogin.ruolo === "Admin"){
      setTuttiGruppi(data.tuttiGruppi || []);
    }

    var script = document.getElementById("jsonpBootstrap");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpBootstrap";

  script.src =
    API_URL +
    "?action=bootstrapApp" +
    "&id=" + encodeURIComponent(utenteLogin.id) +
    "&ruolo=" + encodeURIComponent(utenteLogin.ruolo) +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function caricaAllenamenti(){

  if(allenamenti.length > 0){
  setPagina("allenamenti");
  return;
}

  const callbackName = "callbackAllenamenti";

 window[callbackName] = function(data){

  setAllenamenti(data);

  setPagina("allenamenti");

  var script = document.getElementById("jsonpAllenamenti");
  if(script){
    script.remove();
  }

};

  var script = document.createElement("script");
  script.id = "jsonpAllenamenti";

  script.src =
    API_URL +
    "?action=allenamenti" +
    "&id=" + encodeURIComponent(utente.id) +
    "&callback=" + callbackName;

  script.onerror = function(){
    alert("Errore caricamento allenamenti");
  };

  document.body.appendChild(script);

}
function caricaStatisticheAllenamenti(){

  const callbackName = "callbackStatisticheAllenamenti";

  window[callbackName] = function(data){

    setStatisticheAllenamenti(data);
    setGruppoStatisticheAllenamenti("");
    setDettaglioPresenzeRagazzo(null);
    setTabAllenamenti("statistiche");

    var script = document.getElementById("jsonpStatisticheAllenamenti");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpStatisticheAllenamenti";

  script.src =
    API_URL +
    "?action=statisticheAllenamenti" +
    "&id=" + encodeURIComponent(utente.id) +
    "&ruolo=" + encodeURIComponent(utente.ruolo) +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function getGruppiStatisticheAllenamenti(){

  var gruppi = statisticheAllenamenti.map((s) => s.gruppo);

  return [...new Set(gruppi)].filter(Boolean);

}

function filtraStatisticheAllenamenti(){

  if(!gruppoStatisticheAllenamenti){
    return statisticheAllenamenti;
  }

  return statisticheAllenamenti.filter(
    (s) => s.gruppo === gruppoStatisticheAllenamenti
  );

}
function caricaGruppiAllenamento(){

  const callbackName = "callbackGruppiAllenamento";

  window[callbackName] = function(data){

    setGruppiAllenamento(data);

    var script = document.getElementById("jsonpGruppiAllenamento");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpGruppiAllenamento";

  script.src =
    API_URL +
    "?action=gruppiIstruttore" +
    "&id=" + encodeURIComponent(utente.id) +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function caricaGare(){

 if(gare.length > 0){
  setPagina("gare");
  return;
} 

  caricaGareIstruttore();

  setTabGare("");
  setPagina("gare");

}
function caricaListaWeekend(){

  const callbackName = "callbackListaWeekend";

  window[callbackName] = function(data){

    setGare(data);
    setPagina("weekend");

    var script = document.getElementById("jsonpListaWeekend");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpListaWeekend";

  script.src =
    API_URL +
    "?action=listaWeekend" +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function esportaListaWeekend(){

  var testo = "📋 LISTA WEEKEND\n\n";

  gare.forEach((g) => {

    testo +=
      "⚽ " + g.gruppo + " vs " + g.avversario + "\n" +
      "📅 " + g.data + "\n" +
      "🕒 " + g.orario + "\n" +
      "🏟️ " + g.campo + "\n" +
      "📌 " + g.casaTrasferta + "\n" +
      "Convocazioni: " + (g.haConvocati ? "✅ Fatte" : "❌ Mancanti") + "\n" +
      "Risultato: " +
      (
        g.golFatti !== "" &&
        g.golFatti != null &&
        g.golSubiti !== "" &&
        g.golSubiti != null
          ? "✅ Inserito"
          : "⚠️ Mancante"
      ) +
      "\n\n";
  });

  navigator.clipboard.writeText(testo);

  alert("Lista weekend copiata negli appunti");

}
function caricaIscritti(){

  if(listaIscritti.length > 0){
  setPagina("iscritti");
  return;
}

  if(utente.ruolo === "Admin"){
    caricaTuttiGruppi();
  }

  const callbackName = "callbackListaIscritti";

  window[callbackName] = function(data){

    setListaIscritti(data);
    setPagina("iscritti");

    var script = document.getElementById("jsonpListaIscritti");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpListaIscritti";

  script.src =
    API_URL +
    "?action=listaIscritti" +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function caricaGestioneGruppi(){

  caricaTuttiGruppi();

  setGruppoGestione("");
  setRagazziGruppoGestione([]);

  setPagina("gruppi");

}
function caricaRagazziGruppoGestione(gruppo){

  setGruppoGestione(gruppo);

  const callbackName = "callbackRagazziGruppoGestione";

  window[callbackName] = function(data){

    setRagazziGruppoGestione(data);
    setRagazziSelezionati({});
    setNuovoGruppoGestione("");

    var script = document.getElementById("jsonpRagazziGruppoGestione");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpRagazziGruppoGestione";

  script.src =
    API_URL +
    "?action=ragazziGruppo" +
    "&gruppo=" + encodeURIComponent(gruppo) +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function spostaRagazziGruppo(){

  var ids = Object.keys(ragazziSelezionati)
    .filter((id) => ragazziSelezionati[id]);

  if(ids.length === 0){
    alert("Seleziona almeno un ragazzo");
    return;
  }

  if(!nuovoGruppoGestione){
    alert("Seleziona il nuovo gruppo");
    return;
  }

  const callbackName = "callbackSpostaGruppo";

  window[callbackName] = function(data){

    if(data && data.esito === "OK"){
      alert("Ragazzi spostati");
      caricaRagazziGruppoGestione(gruppoGestione);
    }else{
      alert("Errore spostamento");
    }

    var script = document.getElementById("jsonpSpostaGruppo");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpSpostaGruppo";

  script.src =
    API_URL +
    "?action=spostaRagazziGruppo" +
    "&ids=" + encodeURIComponent(JSON.stringify(ids)) +
    "&gruppo=" + encodeURIComponent(nuovoGruppoGestione) +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function aggiungiGruppoRagazzi(){

  var ids = Object.keys(ragazziSelezionati)
    .filter((id) => ragazziSelezionati[id]);

  if(ids.length === 0){
    alert("Seleziona almeno un ragazzo");
    return;
  }

  if(!nuovoGruppoGestione){
    alert("Seleziona il gruppo da aggiungere");
    return;
  }

  const callbackName = "callbackAggiungiGruppo";

  window[callbackName] = function(data){

    if(data && data.esito === "OK"){
      alert("Gruppo aggiunto");
      caricaRagazziGruppoGestione(gruppoGestione);
    }else{
      alert("Errore aggiunta gruppo");
    }

  };

  var script = document.createElement("script");

  script.src =
    API_URL +
    "?action=aggiungiGruppoRagazzi" +
    "&ids=" + encodeURIComponent(JSON.stringify(ids)) +
    "&gruppo=" + encodeURIComponent(nuovoGruppoGestione) +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function salvaNuovoIscritto(){

  if(iscrittoInModifica){

  salvaModificaIscritto();
  return;

}

  if(!nuovoIscritto.nome || !nuovoIscritto.gruppo){
    alert("Inserisci nome e gruppo");
    return;
  }

  var idGenerato = nuovoIscritto.nome
    .toLowerCase()
    .replaceAll(" ", "_");

  const callbackName = "callbackSalvaIscritto";

  window[callbackName] = function(data){

    if(data && data.esito === "OK"){

      alert("Iscritto salvato");

      setNuovoIscritto({
        nome: "",
        gruppo: "",
        dataNascita: "",
        telefono: ""
      });

    }else{
      alert("Errore salvataggio iscritto");
    }

    var script = document.getElementById("jsonpSalvaIscritto");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpSalvaIscritto";

  script.src =
    API_URL +
    "?action=salvaIscritto" +
    "&id=" + encodeURIComponent(idGenerato) +
    "&nome=" + encodeURIComponent(nuovoIscritto.nome) +
    "&gruppo=" + encodeURIComponent(nuovoIscritto.gruppo) +
    "&dataNascita=" + encodeURIComponent(nuovoIscritto.dataNascita) +
    "&telefono=" + encodeURIComponent(nuovoIscritto.telefono) +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function modificaIscritto(iscritto){

  setIscrittoInModifica(iscritto);

  setNuovoIscritto({
    nome: iscritto.nome || "",
    gruppo: iscritto.gruppo || "",
    dataNascita: iscritto.dataNascita || "",
    telefono: iscritto.telefono || ""
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}
function salvaModificaIscritto(){

  const callbackName =
    "callbackModificaIscritto";

  window[callbackName] = function(data){

    if(data.esito === "OK"){

      alert("Iscritto aggiornato");

      setIscrittoInModifica(null);

      caricaIscritti();

    }

  };

  var script =
    document.createElement("script");

  script.src =
    API_URL +
    "?action=modificaIscritto" +
    "&id=" +
    encodeURIComponent(
      iscrittoInModifica.id
    ) +
    "&nome=" +
    encodeURIComponent(
      nuovoIscritto.nome
    ) +
    "&gruppo=" +
    encodeURIComponent(
      nuovoIscritto.gruppo
    ) +
    "&dataNascita=" +
    encodeURIComponent(
      nuovoIscritto.dataNascita
    ) +
    "&telefono=" +
    encodeURIComponent(
      nuovoIscritto.telefono
    ) +
    "&callback=" +
    callbackName;

  document.body.appendChild(script);

}
function eliminaIscritto(iscritto){

  if(
    !window.confirm(
      "Eliminare " +
      iscritto.nome +
      "?"
    )
  ){
    return;
  }

  const callbackName =
    "callbackEliminaIscritto";

  window[callbackName] = function(data){

    if(data.esito === "OK"){

      alert("Iscritto eliminato");

      caricaIscritti();

    }

  };

  var script =
    document.createElement("script");

  script.src =
    API_URL +
    "?action=eliminaIscritto" +
    "&id=" +
    encodeURIComponent(
      iscritto.id
    ) +
    "&callback=" +
    callbackName;

  document.body.appendChild(script);

}
function caricaSchedeGiocatori(){

  if(giocatoriSchede.length > 0){
  setPagina("schede");
  return;
}

  const callbackName = "callbackGiocatoriSchede";

  window[callbackName] = function(data){

    setGiocatoriSchede(data);
    setPagina("schede");

    var script = document.getElementById("jsonpGiocatoriSchede");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpGiocatoriSchede";

  script.src =
    API_URL +
    "?action=giocatoriSchede" +
    "&id=" + encodeURIComponent(utente.id) +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function caricaStatistiche(){

  if(statistiche){
  setPagina("statistiche");
  return;
}

  const callbackName = "callbackStatistiche";

  window[callbackName] = function(data){

    setStatistiche(data);
    setPagina("statistiche");

    var script = document.getElementById("jsonpStatistiche");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpStatistiche";

  script.src =
    API_URL +
    "?action=statistiche" +
    "&id=" + encodeURIComponent(utente.id) +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function apriSchedaGiocatore(giocatore){

  const callbackName = "callbackSchedaGiocatore";

  window[callbackName] = function(data){

    setGiocatoreSelezionato(data);
    setSchedaModifica(data);
    setPagina("schedaGiocatore");

    var script = document.getElementById("jsonpSchedaGiocatore");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpSchedaGiocatore";

  script.src =
    API_URL +
    "?action=schedaGiocatore" +
    "&id=" + encodeURIComponent(giocatore.id) +
    "&nome=" + encodeURIComponent(giocatore.nome) +
    "&gruppo=" + encodeURIComponent(giocatore.gruppo) +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function aggiornaScheda(campo, valore){

  setSchedaModifica({
    ...schedaModifica,
    [campo]: valore
  });

}
function salvaScheda(){

  const callbackName = "callbackSalvaScheda";

  window[callbackName] = function(data){

    if(data && data.esito === "OK"){
      alert("Scheda salvata");
      setGiocatoreSelezionato(schedaModifica);
    }else{
      alert("Errore salvataggio scheda");
    }

    var script = document.getElementById("jsonpSalvaScheda");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpSalvaScheda";

  script.src =
    API_URL +
    "?action=salvaScheda" +
    "&scheda=" +
    encodeURIComponent(JSON.stringify(schedaModifica)) +
    "&callback=" +
    callbackName;

  document.body.appendChild(script);

}
function sliderScheda(campo, label){

  return (
    <div className="mini-card">

      <b>{label}: {schedaModifica[campo] || 50}</b>

      <input
        type="range"
        min="1"
        max="100"
        value={schedaModifica[campo] || 50}
        onChange={(e) =>
          aggiornaScheda(campo, e.target.value)
        }
      />

    </div>
  );

}
function calcolaOverall(){

  if(!schedaModifica){
    return 0;
  }

  let campi = [];

  if(schedaModifica.ruoloBase === "Portiere"){

    campi = [
      "presa",
      "tuffo",
      "riflessi",
      "parata",
      "uscite",
      "reattivita",
      "posizionamentoPorta",
      "concentrazionePortiere"
    ];

  }else{

    campi = [
      "controllo",
      "passaggio",
      "dribbling",
      "tiro",
      "visioneGioco",
      "velocita",
      "resistenza",
      "forza",
      "concentrazione"
    ];

  }

  let totale = 0;
  let numeroCampi = 0;

  campi.forEach((campo) => {

    const valore = Number(schedaModifica[campo]) || 0;

    if(valore > 0){
      totale += valore;
      numeroCampi++;
    }

  });

  if(numeroCampi === 0){
    return 0;
  }

  return Math.round(totale / numeroCampi);

}
function caricaTuttiGruppi(){

  const callbackName = "callbackTuttiGruppi";

  window[callbackName] = function(data){

    setTuttiGruppi(data);

    var script = document.getElementById("jsonpTuttiGruppi");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpTuttiGruppi";

  script.src =
    API_URL +
    "?action=tuttiGruppi" +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function caricaGareIstruttore(){

  const callbackName = "callbackGare";

  window[callbackName] = function(data){

    setGare(data);

    var script = document.getElementById("jsonpGare");

    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");

  script.id = "jsonpGare";

  script.src =
    API_URL +
    "?action=gare" +
    "&id=" + encodeURIComponent(utente.id) +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function caricaArchivioGare(){

  const callbackName = "callbackArchivioGare";

  window[callbackName] = function(data){

    setGare(data);

    var script = document.getElementById("jsonpArchivioGare");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpArchivioGare";

  script.src =
    API_URL +
    "?action=archivioGare" +
    "&id=" + encodeURIComponent(utente.id) +
    "&ruolo=" + encodeURIComponent(utente.ruolo) +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function apriCompilaAllenamento(a){

  setAllenamentoSelezionato(a);
  setDettaglioAllenamento(null);

  const callbackName = "callbackDettaglioAllenamento";

  window[callbackName] = function(data){

    var statiIniziali = {};

for(var i = 0; i < data.ragazzi.length; i++){

  var nome = data.ragazzi[i].nome;

  statiIniziali[nome] =
    data.dettaglio.presenze[nome] || "Presente";

}

setPresenze(statiIniziali);
setReportAllenamento({
  tema: data.dettaglio.report.tema || "",
  comportamento: data.dettaglio.report.comportamento || "",
  note: data.dettaglio.report.note || ""
});

    setDettaglioAllenamento(data);
    setPagina("compilaAllenamento");

    var script = document.getElementById("jsonpDettaglioAllenamento");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpDettaglioAllenamento";

  script.src =
    API_URL +
    "?action=datiCompilaAllenamento" +
    "&gruppo=" + encodeURIComponent(a.gruppo) +
    "&data=" + encodeURIComponent(a.data) +
    "&callback=" + callbackName;

  script.onerror = function(){
    alert("Errore apertura allenamento");
  };

  document.body.appendChild(script);

}
function cambiaPresenza(nome, stato){

  setPresenze({
    ...presenze,
    [nome]: stato
  });

}
function salvaCompilaAllenamento(){
setSalvataggio(true);

  const callbackName = "callbackSalvaAllenamento";

  window[callbackName] = function(data){

    setSalvataggio(false);

    if(data.esito === "OK"){
      alert("Allenamento salvato correttamente");
      caricaAllenamenti();
    }else{
      alert("Errore salvataggio allenamento");
    }

    var script = document.getElementById("jsonpSalvaAllenamento");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpSalvaAllenamento";

  script.src =
    API_URL +
    "?action=salvaCompilaAllenamento" +
    "&gruppo=" + encodeURIComponent(allenamentoSelezionato.gruppo) +
    "&data=" + encodeURIComponent(allenamentoSelezionato.data) +
    "&orario=" + encodeURIComponent(allenamentoSelezionato.orario) +
    "&campo=" + encodeURIComponent(allenamentoSelezionato.campo) +
    "&istruttore=" + encodeURIComponent(utente.nome) +
    "&presenze=" + encodeURIComponent(JSON.stringify(presenze)) +
    "&report=" + encodeURIComponent(JSON.stringify(reportAllenamento)) +
    "&callback=" + callbackName;

  script.onerror = function(){
    setSalvataggio(false);
    alert("Errore collegamento salvataggio");
  };

  document.body.appendChild(script);

}
if(!utente){
  return (
    <div className="app">
      <div className="login-card">

        <div className="top-line"></div>

        <img src={logo} className="logo" />

        <h1>ASD<br />INCONTRO</h1>

        <p className="subtitle">Accesso area tecnica</p>

        {errore && (
          <div className="errore">{errore}</div>
        )}

        <input
          type="text"
          placeholder="ID Istruttore"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login} disabled={loading}>
          {loading ? "ACCESSO..." : "ACCEDI"}
        </button>

      </div>
    </div>
  );
}

  if(utente){
   if(
  pagina === "compilaAllenamento" &&
  allenamentoSelezionato &&
  dettaglioAllenamento
){

return (
    <div className="app">

    <BottoneIndietro />

      <div className="dashboard-card">

        <h2>
  {allenamentoSelezionato.stato === "Svolto"
    ? "ARCHIVIO ALLENAMENTO"
    : "COMPILA ALLENAMENTO"}
</h2>

        <p className="subtitle">
          {allenamentoSelezionato.gruppo}
        </p>

        <div className="mini-card">
          <p>📅 {allenamentoSelezionato.data}</p>
          <p>🕒 {allenamentoSelezionato.orario}</p>
          <p>🏟️ {allenamentoSelezionato.campo}</p>
        </div>

        <h3>Presenze</h3>

        {dettaglioAllenamento.ragazzi.map((r, index) => (

  <div className="mini-card" key={index}>

    <b>{r.nome}</b>

    <div className="stato-row">

      <button
        className={presenze[r.nome] === "Presente" ? "active-green" : ""}
        onClick={() => cambiaPresenza(r.nome, "Presente")}
      >
        Pres.
      </button>

      <button
        className={presenze[r.nome] === "Assente" ? "active-yellow" : ""}
        onClick={() => cambiaPresenza(r.nome, "Assente")}
      >
        Ass.
      </button>

      <button
        className={presenze[r.nome] === "Infortunato" ? "active-red" : ""}
        onClick={() => cambiaPresenza(r.nome, "Infortunato")}
      >
        Inf.
      </button>

    </div>

  </div>

))}
<h3>Report Allenamento</h3>

<input
  type="text"
  placeholder="Tema allenamento"
  value={reportAllenamento.tema}
  onChange={(e) =>
    setReportAllenamento({
      ...reportAllenamento,
      tema: e.target.value
    })
  }
/>

<input
  type="text"
  placeholder="Comportamento gruppo"
  value={reportAllenamento.comportamento}
  onChange={(e) =>
    setReportAllenamento({
      ...reportAllenamento,
      comportamento: e.target.value
    })
  }
/>

<textarea
  placeholder="Note"
  value={reportAllenamento.note}
  onChange={(e) =>
    setReportAllenamento({
      ...reportAllenamento,
      note: e.target.value
    })
  }
/>

<button
  onClick={salvaCompilaAllenamento}
  disabled={salvataggio}
>
  {salvataggio
    ? "SALVATAGGIO..."
    : allenamentoSelezionato.stato === "Svolto"
      ? "AGGIORNA ALLENAMENTO"
      : "SALVA ALLENAMENTO"}
</button>

<button
  onClick={eliminaAllenamentoSelezionato}
>
  ELIMINA ALLENAMENTO
</button>

      </div>
    </div>
  );

}

function eliminaAllenamentoSelezionato(){

  if(!window.confirm("Vuoi eliminare questo allenamento?")){
    return;
  }

  const callbackName = "callbackEliminaAllenamento";

  window[callbackName] = function(data){

    if(data && data.esito === "OK"){
      alert("Allenamento eliminato");
      caricaAllenamenti();
    }else{
      alert("Errore eliminazione");
    }

    var script = document.getElementById("jsonpEliminaAllenamento");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpEliminaAllenamento";

  script.src =
    API_URL +
    "?action=eliminaAllenamento" +
    "&gruppo=" + encodeURIComponent(allenamentoSelezionato.gruppo) +
    "&data=" + encodeURIComponent(allenamentoSelezionato.data) +
    "&orario=" + encodeURIComponent(allenamentoSelezionato.orario) +
    "&campo=" + encodeURIComponent(allenamentoSelezionato.campo) +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}

function creaAllenamento(){

  if(
    !nuovoAllenamento.gruppo ||
    !nuovoAllenamento.data ||
    !nuovoAllenamento.orario ||
    !nuovoAllenamento.campo
  ){
    alert("Compila tutti i campi");
    return;
  }

  const callbackName = "callbackCreaAllenamento";

  window[callbackName] = function(data){

    if(data && data.esito === "OK"){

      alert("Allenamento creato");

      setNuovoAllenamento({
        gruppo: "",
        data: "",
        orario: "",
        campo: ""
      });

      caricaAllenamenti();

    }else{

      alert("Errore creazione allenamento");

    }

    var script = document.getElementById("jsonpCreaAllenamento");

    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");

  script.id = "jsonpCreaAllenamento";

  script.src =
    API_URL +
    "?action=creaAllenamento" +
    "&gruppo=" + encodeURIComponent(nuovoAllenamento.gruppo) +
    "&data=" + encodeURIComponent(nuovoAllenamento.data) +
    "&orario=" + encodeURIComponent(nuovoAllenamento.orario) +
    "&campo=" + encodeURIComponent(nuovoAllenamento.campo) +
"&ripeti=" + encodeURIComponent(nuovoAllenamento.ripeti) +
"&settimane=" + encodeURIComponent(nuovoAllenamento.settimane) +
"&callback=" + callbackName;

  document.body.appendChild(script);

}
function creaGara(){

  if(
    !nuovaGara.gruppo ||
    !nuovaGara.data ||
    !nuovaGara.orarioGara ||
    !nuovaGara.orarioAppuntamento ||
    !nuovaGara.campo ||
    !nuovaGara.avversario
  ){
    alert("Compila tutti i campi obbligatori");
    return;
  }

  const callbackName = "callbackCreaGara";

  window[callbackName] = function(data){

    if(data && data.esito === "OK"){

      alert("Gara creata");

      setNuovaGara({
        gruppo: "",
        data: "",
        orarioGara: "",
        orarioAppuntamento: "",
        campo: "",
        avversario: "",
        casaTrasferta: "Casa",
        note: ""
      });

      caricaGareIstruttore();
      setTabGare("prossime");

    }else{
      alert("Errore creazione gara");
    }

    var script = document.getElementById("jsonpCreaGara");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpCreaGara";

  script.src =
    API_URL +
    "?action=creaGara" +
    "&gruppo=" + encodeURIComponent(nuovaGara.gruppo) +
    "&data=" + encodeURIComponent(nuovaGara.data) +
    "&orarioGara=" + encodeURIComponent(nuovaGara.orarioGara) +
    "&orarioAppuntamento=" + encodeURIComponent(nuovaGara.orarioAppuntamento) +
    "&campo=" + encodeURIComponent(nuovaGara.campo) +
    "&avversario=" + encodeURIComponent(nuovaGara.avversario) +
    "&casaTrasferta=" + encodeURIComponent(nuovaGara.casaTrasferta) +
    "&note=" + encodeURIComponent(nuovaGara.note) +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function apriDettaglioGara(gara){

  setGaraSelezionata(gara);
  setGaraConvocata(false);

  const callbackName = "callbackVerificaConvocati";

  window[callbackName] = function(data){

    setGaraConvocata(data.haConvocati === true);

    setPagina("dettaglioGara");

    var script = document.getElementById("jsonpVerificaConvocati");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpVerificaConvocati";

  script.src =
    API_URL +
    "?action=verificaConvocati" +
    "&gruppo=" + encodeURIComponent(gara.gruppo) +
    "&dataGara=" + encodeURIComponent(gara.data) +
    "&avversario=" + encodeURIComponent(gara.avversario) +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function apriModificaGara(){

  setGaraModifica({
    gruppo: garaSelezionata.gruppo,
    data: garaSelezionata.data,
    orario: garaSelezionata.orario,
    campo: garaSelezionata.campo,
    avversario: garaSelezionata.avversario,
    casaTrasferta: garaSelezionata.casaTrasferta,
    note: garaSelezionata.note || ""
  });

  setPagina("modificaGara");

}
function salvaModificaGara(){

  const callbackName = "callbackModificaGara";

  window[callbackName] = function(data){

    if(data && data.esito === "OK"){
      alert("Gara modificata");
      caricaGare();
    }else{
      alert("Errore modifica gara");
    }

    var script = document.getElementById("jsonpModificaGara");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpModificaGara";

  script.src =
    API_URL +
    "?action=modificaGara" +
    "&gruppoOriginale=" + encodeURIComponent(garaSelezionata.gruppo) +
    "&dataOriginale=" + encodeURIComponent(garaSelezionata.data) +
    "&avversarioOriginale=" + encodeURIComponent(garaSelezionata.avversario) +
    "&gruppo=" + encodeURIComponent(garaModifica.gruppo) +
    "&data=" + encodeURIComponent(garaModifica.data) +
    "&orario=" + encodeURIComponent(garaModifica.orario) +
    "&campo=" + encodeURIComponent(garaModifica.campo) +
    "&avversario=" + encodeURIComponent(garaModifica.avversario) +
    "&casaTrasferta=" + encodeURIComponent(garaModifica.casaTrasferta) +
    "&note=" + encodeURIComponent(garaModifica.note) +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function tornaIndietro(){

  if(pagina === "dashboard"){
    return;
  }

  if(pagina === "compilaAllenamento"){
  setPagina("allenamenti");
  return;
}

if(pagina === "allenamenti"){
  setPagina("dashboard");
  return;
}

  if(
    pagina === "dettaglioGara" ||
    pagina === "convocazioni" ||
    pagina === "modificaGara" ||
    pagina === "risultatoGara"
  ){
    setPagina("gare");
    return;
  }

  if(pagina === "schedaGiocatore"){
    setPagina("schede");
    return;
  }

  setPagina("dashboard");

}
function BottoneIndietro(){

  if(!utente || pagina === "dashboard"){
    return null;
  }

  return (
    <button
      className="back-fixed"
      onClick={tornaIndietro}
    >
      ←
    </button>
  );

}
function CardDashboard({
  titolo,
  descrizione,
  immagine,
  onClick
}){

  return (
    <button
      className="module-card module-card-image"
      onClick={onClick}
      style={{
        backgroundImage: `url(${immagine})`
      }}
    >
      <div className="module-overlay">

        <div>
          <h3>{titolo}</h3>
          <p>{descrizione}</p>
        </div>

        <span>›</span>

      </div>
    </button>
  );

}
function apriConvocazioni(){

  const callbackName = "callbackDatiConvocazioni";

  window[callbackName] = function(data){

    setRagazziConvocazioni(data.ragazzi);

    var stati = {};

    for(var i = 0; i < data.ragazzi.length; i++){

      var nome = data.ragazzi[i].nome;

      stati[nome] = data.convocati.includes(nome);

    }

    setConvocati(stati);

    setPagina("convocazioni");

    var script = document.getElementById("jsonpDatiConvocazioni");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpDatiConvocazioni";

  script.src =
    API_URL +
    "?action=datiConvocazioni" +
    "&gruppo=" + encodeURIComponent(garaSelezionata.gruppo) +
    "&dataGara=" + encodeURIComponent(garaSelezionata.data) +
    "&avversario=" + encodeURIComponent(garaSelezionata.avversario) +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function apriRisultatoGara(){

  const callbackName = "callbackConvocatiRisultato";

  window[callbackName] = function(data){

    var stats = {};

for(var i = 0; i < data.convocati.length; i++){

  var nome = data.convocati[i];

  var valutazione = null;

  if(data.valutazioni){

   valutazione = data.valutazioni[nome];

  }

  stats[nome] = {

    voto:
      valutazione?.voto || "",

    goal:
      valutazione?.goal || "",

    assist:
      valutazione?.assist || "",

    minuti:
      valutazione?.minuti || "",

    titolare:
      valutazione?.titolare === "SI",

    ammonizioni:
      Number(valutazione?.ammonizioni || 0) > 0,

    espulsioni:
      Number(valutazione?.espulsioni || 0) > 0

  };

}
if(data.valutazioni){

  
}
    setStatisticheGara(stats);
   setRisultatoGara({
  golFatti: garaSelezionata.golFatti ?? "",
  golSubiti: garaSelezionata.golSubiti ?? "",
  noteRisultato: garaSelezionata.noteRisultato ?? ""
});
  var mvpTrovato = "";

for(var nomeMvp in data.valutazioni){

  if(
    String(data.valutazioni[nomeMvp].mvp)
      .trim()
      .toUpperCase() === "SI"
  ){
    mvpTrovato = nomeMvp;
  }

}

setMvpGara(mvpTrovato);
    setPagina("risultatoGara");

    var script = document.getElementById("jsonpConvocatiRisultato");
    if(script){
      script.remove();
    }

  };

  var script = document.createElement("script");
  script.id = "jsonpConvocatiRisultato";

  script.src =
    API_URL +
    "?action=datiConvocazioni" +
    "&gruppo=" + encodeURIComponent(garaSelezionata.gruppo) +
    "&dataGara=" + encodeURIComponent(garaSelezionata.data) +
    "&avversario=" + encodeURIComponent(garaSelezionata.avversario) +
    "&callback=" + callbackName;

  document.body.appendChild(script);

}
function salvaConvocati(){

  var listaConvocati = [];

  Object.keys(convocati).forEach((nome) => {

    if(convocati[nome]){

      listaConvocati.push({

  gruppo: garaSelezionata.gruppo,
  dataGara: garaSelezionata.data,
  orarioGara: garaSelezionata.orario,
  orarioAppuntamento: orarioAppuntamento,
  campo: garaSelezionata.campo,
  avversario: garaSelezionata.avversario,
  ragazzo: nome,
  istruttore: utente.nome

});

    }

  });

  const callbackName = "callbackSalvaConvocati";

  window[callbackName] = function(data){

    if(data.esito === "OK"){

      alert("Convocazioni salvate");

      setGaraConvocata(true);
      setPagina("dettaglioGara");

    }else{

      alert("Errore salvataggio");

    }

    var script =
      document.getElementById(
        "jsonpSalvaConvocati"
      );

    if(script){
      script.remove();
    }

  };

  var script =
    document.createElement("script");

  script.id = "jsonpSalvaConvocati";

  script.src =
  API_URL +
  "?action=salvaConvocazioniAggiornate" +
  "&gruppo=" +
  encodeURIComponent(garaSelezionata.gruppo) +
  "&dataGara=" +
  encodeURIComponent(garaSelezionata.data) +
  "&avversario=" +
  encodeURIComponent(garaSelezionata.avversario) +
  "&convocazioni=" +
  encodeURIComponent(
    JSON.stringify(listaConvocati)
  ) +
  "&callback=" +
  callbackName;

  document.body.appendChild(script);

}
function eliminaGara(){

  if(!window.confirm("Vuoi eliminare questa gara?")){
    return;
  }

  const callbackName = "callbackEliminaGara";

  window[callbackName] = function(data){

    if(data && data.esito === "OK"){

      alert("Gara eliminata");

      caricaGare();

    }else{

      alert("Errore eliminazione gara");

    }

    var script =
      document.getElementById(
        "jsonpEliminaGara"
      );

    if(script){
      script.remove();
    }

  };

  var script =
    document.createElement("script");

  script.id = "jsonpEliminaGara";

  script.src =
    API_URL +
    "?action=eliminaGara" +
    "&gruppo=" +
    encodeURIComponent(garaSelezionata.gruppo) +
    "&data=" +
    encodeURIComponent(garaSelezionata.data) +
    "&avversario=" +
    encodeURIComponent(garaSelezionata.avversario) +
    "&callback=" +
    callbackName;

  document.body.appendChild(script);

}
function salvaRisultato(){

  const callbackName = "callbackSalvaRisultato";

  window[callbackName] = function(data){

    if(data && data.esito === "OK"){

      alert("Risultato salvato");

      caricaGare();

    }else{

      alert("Errore salvataggio");

    }

    var script =
      document.getElementById(
        "jsonpSalvaRisultato"
      );

    if(script){
      script.remove();
    }

  };

  var script =
    document.createElement("script");

  script.id = "jsonpSalvaRisultato";

  script.src =
    API_URL +
    "?action=salvaRisultato" +
    "&gruppo=" +
    encodeURIComponent(garaSelezionata.gruppo) +
    "&data=" +
    encodeURIComponent(garaSelezionata.data) +
    "&avversario=" +
    encodeURIComponent(garaSelezionata.avversario) +
    "&golFatti=" +
    encodeURIComponent(risultatoGara.golFatti) +
    "&golSubiti=" +
    encodeURIComponent(risultatoGara.golSubiti) +
    "&noteRisultato=" +
    encodeURIComponent(risultatoGara.noteRisultato) +
    "&statistiche=" +
    encodeURIComponent(JSON.stringify(statisticheGara)) +
    "&mvp=" +
    encodeURIComponent(mvpGara) +
    "&istruttore=" +
    encodeURIComponent(utente.nome) +
    "&callback=" +
    callbackName;

  document.body.appendChild(script);

}
function getGiorniCalendario(){

  var oggi = new Date();
  var anno = meseCalendario.getFullYear();
var mese = meseCalendario.getMonth();

  var primoGiorno = new Date(anno, mese, 1);
  var offset = primoGiorno.getDay();
offset = offset === 0 ? 6 : offset - 1;
  var ultimoGiorno = new Date(anno, mese + 1, 0);

  var giorni = [];

  for(var i = 0; i < offset; i++){

  giorni.push({
    numero: "",
    data: ""
  });

}

  for(var i = 1; i <= ultimoGiorno.getDate(); i++){

    var data = new Date(anno, mese, i);

    var giorno = String(i).padStart(2, "0");
    var meseNumero = String(mese + 1).padStart(2, "0");

    giorni.push({
      numero: i,
      data: giorno + "/" + meseNumero + "/" + anno
    });

  }

  return giorni;

}

function haAllenamentiInData(data){

  return allenamenti.some(
    (a) =>
      a.data === data &&
      a.stato === "Programmato"
  );

}

  if(pagina === "allenamenti"){
  return (
    <div className="app">

    <BottoneIndietro />

      <div className="dashboard-card">

        <h2>ALLENAMENTI</h2>

        {allenamenti.length === 0 && (
          <p className="subtitle">
            Nessun allenamento trovato
          </p>
        )}

<div className="dashboard-grid">

  <button
  className={tabAllenamenti === "nuovo" ? "active-folder" : ""}
  onClick={() => setTabAllenamenti("nuovo")}
>
  NUOVO ALLENAMENTO
</button>

  <button
  className={
    tabAllenamenti === "prossimi"
      ? "active-folder"
      : ""
  }
  onClick={() => setTabAllenamenti("prossimi")}
>
  PROSSIMI ALLENAMENTI
</button>

<button
  className={
    tabAllenamenti === "archivio"
      ? "active-folder"
      : ""
  }
  onClick={() => setTabAllenamenti("archivio")}
>
  ARCHIVIO ALLENAMENTI
</button>

<button
  className={tabAllenamenti === "statistiche" ? "active-folder" : ""}
  onClick={caricaStatisticheAllenamenti}
>
  STATISTICHE ALLENAMENTI
</button>

<button
  className={tabAllenamenti === "calendario" ? "active-folder" : ""}
  onClick={() => setTabAllenamenti("calendario")}
>
  CALENDARIO
</button>

</div>

{tabAllenamenti !== "" &&
 tabAllenamenti !== "nuovo" &&
 tabAllenamenti !== "calendario" &&
 tabAllenamenti !== "statistiche" && (

  <div>
    {allenamenti
      .filter((a) =>
        tabAllenamenti === "prossimi"
          ? a.stato === "Programmato"
          : a.stato === "Svolto"
      )
      .map((a, index) => (
        <div
          className="mini-card"
          key={index}
          onClick={() => apriCompilaAllenamento(a)}
        >
          <b>{a.gruppo}</b>
          <p>📅 {a.data}</p>
          <p>🕒 {a.orario}</p>
          <p>🏟️ {a.campo}</p>
          <p>{a.stato === "Svolto" ? "✅" : "📌"} {a.stato}</p>
        </div>
      ))}
  </div>

)}

{tabAllenamenti === "nuovo" && (

  <div className="mini-card">

    <h3>NUOVO ALLENAMENTO</h3>

    <select
  value={nuovoAllenamento.gruppo}
  onChange={(e) =>
    setNuovoAllenamento({
      ...nuovoAllenamento,
      gruppo: e.target.value
    })
  }
>
  <option value="">Seleziona gruppo</option>

  {gruppiAllenamento.map((gruppo, index) => (
  <option key={index} value={gruppo}>
    {gruppo}
  </option>
))}

</select>

    <input
      type="date"
      value={nuovoAllenamento.data}
      onChange={(e) =>
        setNuovoAllenamento({
          ...nuovoAllenamento,
          data: e.target.value
        })
      }
    />

    <input
      type="time"
      value={nuovoAllenamento.orario}
      onChange={(e) =>
        setNuovoAllenamento({
          ...nuovoAllenamento,
          orario: e.target.value
        })
      }
    />

    <input
      type="text"
      placeholder="Campo"
      value={nuovoAllenamento.campo}
      onChange={(e) =>
        setNuovoAllenamento({
          ...nuovoAllenamento,
          campo: e.target.value
        })
      }
    />
    <label>
  <input
    type="checkbox"
    checked={nuovoAllenamento.ripeti}
    onChange={(e) =>
      setNuovoAllenamento({
        ...nuovoAllenamento,
        ripeti: e.target.checked
      })
    }
  />
  Ripeti settimanalmente
</label>

{nuovoAllenamento.ripeti && (
  <input
    type="number"
    min="1"
    max="52"
    placeholder="Numero settimane"
    value={nuovoAllenamento.settimane}
    onChange={(e) =>
      setNuovoAllenamento({
        ...nuovoAllenamento,
        settimane: e.target.value
      })
    }
  />
)}

    <button onClick={creaAllenamento}>
  CREA ALLENAMENTO
</button>

  </div>

)}
{tabAllenamenti === "calendario" && (

  <div>

    <h3>Calendario allenamenti</h3>

    <div className="calendar-month-nav">

  <button
    onClick={() =>
      setMeseCalendario(
        new Date(
          meseCalendario.getFullYear(),
          meseCalendario.getMonth() - 1,
          1
        )
      )
    }
  >
    ←
  </button>

  <h3>
    {meseCalendario.toLocaleDateString("it-IT", {
      month: "long",
      year: "numeric"
    })}
  </h3>

  <button
    onClick={() =>
      setMeseCalendario(
        new Date(
          meseCalendario.getFullYear(),
          meseCalendario.getMonth() + 1,
          1
        )
      )
    }
  >
    →
  </button>

</div>

    <div className="calendar-weekdays">
      <span>Lun</span>
      <span>Mar</span>
      <span>Mer</span>
      <span>Gio</span>
      <span>Ven</span>
      <span>Sab</span>
      <span>Dom</span>
    </div>

    <div className="calendar-grid">

      {getGiorniCalendario().map((giorno, index) => (

        <button
          key={index}
          disabled={!giorno.data}
          className={
            dataCalendarioSelezionata === giorno.data
              ? "calendar-day active-folder"
              : "calendar-day"
          }
          onClick={() => setDataCalendarioSelezionata(giorno.data)}
        >
          <span>{giorno.numero}</span>

          {haAllenamentiInData(giorno.data) && (
            <small>⚽</small>
          )}
        </button>

      ))}

    </div>

    {dataCalendarioSelezionata !== "" && (

      <div className="mini-card">

        <h3>{dataCalendarioSelezionata}</h3>

        {allenamenti
          .filter((a) =>
            a.data === dataCalendarioSelezionata &&
            a.stato === "Programmato"
          )
          .map((a, index) => (

            <div
              className="mini-card"
              key={index}
              onClick={() => apriCompilaAllenamento(a)}
            >
              <b>{a.gruppo}</b>
              <p>🕒 {a.orario}</p>
              <p>🏟️ {a.campo}</p>
            </div>

          ))}

      </div>

    )}

  </div>

)}

{tabAllenamenti === "statistiche" && (

  <div>

    <h3>Statistiche allenamenti</h3>

    <select
      value={gruppoStatisticheAllenamenti}
      onChange={(e) =>
        setGruppoStatisticheAllenamenti(e.target.value)
      }
    >
      <option value="">Tutti i gruppi</option>

      {getGruppiStatisticheAllenamenti().map((gruppo, index) => (
        <option key={index} value={gruppo}>
          {gruppo}
        </option>
      ))}

    </select>
{dettaglioPresenzeRagazzo && (

  <div className="mini-card">

    <h3>
  📊 {dettaglioPresenzeRagazzo.ragazzo}
</h3>

    <p>
      Presenze totali: {dettaglioPresenzeRagazzo.totale}
    </p>

    <p>
      Presenze settimana: {dettaglioPresenzeRagazzo.settimana}
    </p>

    <h4>Dettaglio mensile</h4>

    {Object.keys(dettaglioPresenzeRagazzo.mesi || {}).map((mese, index) => (
      <p key={index}>
        {mese}: {dettaglioPresenzeRagazzo.mesi[mese]}
      </p>
    ))}

  </div>

)}

    {filtraStatisticheAllenamenti().map((s, index) => (

      <div
        className="mini-card"
        key={index}
        onClick={() => setDettaglioPresenzeRagazzo(s)}
      >

        <b>{s.ragazzo}</b>
        <p>Gruppo: {s.gruppo}</p>
        <p>Presenze totali: {s.totale}</p>
        <p>Presenze settimana: {s.settimana}</p>

      </div>

    ))}

  </div>

)}


      </div>
    </div>
  );
}
if(pagina === "gare"){
  return (
    <div className="app">

    <BottoneIndietro />

      <div className="dashboard-card">

        <h2>GARE</h2>

        <div className="dashboard-grid">

          <button
            className={tabGare === "nuova" ? "active-folder" : ""}
            onClick={() => setTabGare("nuova")}
          >
            NUOVA GARA
          </button>

          <button
            className={tabGare === "prossime" ? "active-folder" : ""}
            onClick={() => {
            setTabGare("prossime");
            caricaGareIstruttore();
}}
          >
            PROSSIME GARE
          </button>

          <button
            className={tabGare === "archivio" ? "active-folder" : ""}
            onClick={() => {
  setTabGare("archivio");
  caricaArchivioGare();
}}
          >
            ARCHIVIO GARE
          </button>

        </div>
        {tabGare === "prossime" && (

  <div>

    {gare.map((g, index) => (

      <div
  className="mini-card"
  key={index}
  onClick={() => apriDettaglioGara(g)}
>

        <b>{g.gruppo}</b>

        <p>📅 {g.data}</p>

        <p>⚽ {g.avversario}</p>

        <p>🕒 {g.orario}</p>

        <p>🏟️ {g.campo}</p>

      </div>

    ))}

  </div>

)}
{tabGare === "archivio" && (

  <div>

    {gare.map((g, index) => (

      <div
  className="mini-card"
  key={index}
  onClick={() => apriDettaglioGara(g)}
>

        <b>{g.gruppo}</b>

        <p>📅 {g.data}</p>
        <p>⚽ {g.avversario}</p>
        <p>🕒 {g.orario}</p>
        <p>🏟️ {g.campo}</p>

        <p>
          Risultato: {g.golFatti} - {g.golSubiti}
        </p>

        {g.noteRisultato && (
          <p>📝 {g.noteRisultato}</p>
        )}

      </div>

    ))}

  </div>

)}
        {tabGare === "nuova" && (

  <div className="mini-card">

    <h3>NUOVA GARA</h3>

    <select
      value={nuovaGara.gruppo}
      onChange={(e) =>
        setNuovaGara({
          ...nuovaGara,
          gruppo: e.target.value
        })
      }
    >
      <option value="">Seleziona gruppo</option>

      {(utente.ruolo === "Admin" ? tuttiGruppi : gruppiAllenamento).map(
  (gruppo, index) => (
    <option key={index} value={gruppo}>
      {gruppo}
    </option>
  )
)}

    </select>

    <input
      type="date"
      value={nuovaGara.data}
      onChange={(e) =>
        setNuovaGara({
          ...nuovaGara,
          data: e.target.value
        })
      }
    />

<label>Orario gara</label>
    <input
      type="time"
      placeholder="Orario gara"
      value={nuovaGara.orarioGara}
      onChange={(e) =>
        setNuovaGara({
          ...nuovaGara,
          orarioGara: e.target.value
        })
      }
    />

<label>Orario appuntamento</label>
    <input
      type="time"
      placeholder="Orario appuntamento"
      value={nuovaGara.orarioAppuntamento}
      onChange={(e) =>
        setNuovaGara({
          ...nuovaGara,
          orarioAppuntamento: e.target.value
        })
      }
    />

    <input
      type="text"
      placeholder="Campo"
      value={nuovaGara.campo}
      onChange={(e) =>
        setNuovaGara({
          ...nuovaGara,
          campo: e.target.value
        })
      }
    />

    <input
      type="text"
      placeholder="Avversario"
      value={nuovaGara.avversario}
      onChange={(e) =>
        setNuovaGara({
          ...nuovaGara,
          avversario: e.target.value
        })
      }
    />

    <select
      value={nuovaGara.casaTrasferta}
      onChange={(e) =>
        setNuovaGara({
          ...nuovaGara,
          casaTrasferta: e.target.value
        })
      }
    >
      <option value="Casa">Casa</option>
      <option value="Trasferta">Trasferta</option>
    </select>

    <textarea
      placeholder="Note"
      value={nuovaGara.note}
      onChange={(e) =>
        setNuovaGara({
          ...nuovaGara,
          note: e.target.value
        })
      }
    />

    <button onClick={creaGara}>
  CREA GARA
</button>

  </div>

)}

      </div>
    </div>
  );
}
if(pagina === "dettaglioGara" && garaSelezionata){
  return (
    <div className="app">

    <BottoneIndietro />

      <div className="dashboard-card">

        <h2>DETTAGLIO GARA</h2>

        <div className="mini-card">
          <b>{garaSelezionata.gruppo}</b>
          <p>📅 {garaSelezionata.data}</p>
          <p>⚽ {garaSelezionata.avversario}</p>
          <p>🕒 {garaSelezionata.orario}</p>
          <p>🏟️ {garaSelezionata.campo}</p>
          <p>📌 {garaSelezionata.casaTrasferta}</p>
        </div>

        <button onClick={apriConvocazioni}>
  CONVOCAZIONI
</button>

<button
  className={garaConvocata ? "" : "disabled-button"}
  disabled={!garaConvocata}
  onClick={apriRisultatoGara}
>
  INSERISCI RISULTATO
</button>

        <button onClick={apriModificaGara}>
  MODIFICA GARA
</button>

        <button onClick={eliminaGara}>
  ELIMINA GARA
</button>

      </div>
    </div>
  );
}
if(pagina === "convocazioni" && garaSelezionata){
  return (
    <div className="app">

    <BottoneIndietro />

      <div className="dashboard-card">

        <h2>CONVOCAZIONI</h2>

        <div className="mini-card">
          <b>{garaSelezionata.gruppo}</b>
          <p>📅 {garaSelezionata.data}</p>
          <p>⚽ {garaSelezionata.avversario}</p>
          <p>🕒 {garaSelezionata.orario}</p>
          <p>🏟️ {garaSelezionata.campo}</p>
        </div>

<label>Orario appuntamento</label>

<input
  type="time"
  value={orarioAppuntamento}
  onChange={(e) => setOrarioAppuntamento(e.target.value)}
/>

        {ragazziConvocazioni.map((r, index) => (
          <div className="mini-card" key={index}>
            <label>
              <input
                type="checkbox"
                checked={convocati[r.nome] || false}
                onChange={(e) =>
                  setConvocati({
                    ...convocati,
                    [r.nome]: e.target.checked
                  })
                }
              />
              {r.nome}
            </label>
          </div>
        ))}

        <button onClick={salvaConvocati}>
  SALVA CONVOCATI
</button>

      </div>
    </div>
  );
}
if(pagina === "modificaGara" && garaModifica){
  return (
    <div className="app">

    <BottoneIndietro />

      <div className="dashboard-card">

        <h2>MODIFICA GARA</h2>

        <select
          value={garaModifica.gruppo}
          onChange={(e) =>
            setGaraModifica({
              ...garaModifica,
              gruppo: e.target.value
            })
          }
        >
          <option value="">Seleziona gruppo</option>

          {(utente.ruolo === "Admin" ? tuttiGruppi : gruppiAllenamento).map(
            (gruppo, index) => (
              <option key={index} value={gruppo}>
                {gruppo}
              </option>
            )
          )}

        </select>

        <input
          type="text"
          value={garaModifica.data}
          onChange={(e) =>
            setGaraModifica({
              ...garaModifica,
              data: e.target.value
            })
          }
        />

        <label>Orario gara</label>
        <input
          type="time"
          value={garaModifica.orario}
          onChange={(e) =>
            setGaraModifica({
              ...garaModifica,
              orario: e.target.value
            })
          }
        />

        <input
          type="text"
          placeholder="Campo"
          value={garaModifica.campo}
          onChange={(e) =>
            setGaraModifica({
              ...garaModifica,
              campo: e.target.value
            })
          }
        />

        <input
          type="text"
          placeholder="Avversario"
          value={garaModifica.avversario}
          onChange={(e) =>
            setGaraModifica({
              ...garaModifica,
              avversario: e.target.value
            })
          }
        />

        <select
          value={garaModifica.casaTrasferta}
          onChange={(e) =>
            setGaraModifica({
              ...garaModifica,
              casaTrasferta: e.target.value
            })
          }
        >
          <option value="Casa">Casa</option>
          <option value="Trasferta">Trasferta</option>
        </select>

        <textarea
          placeholder="Note"
          value={garaModifica.note}
          onChange={(e) =>
            setGaraModifica({
              ...garaModifica,
              note: e.target.value
            })
          }
        />

        <button onClick={salvaModificaGara}>
  SALVA MODIFICA
</button>

        <button onClick={() => setPagina("dettaglioGara")}>
          ANNULLA
        </button>

      </div>
    </div>
  );
}
if(pagina === "risultatoGara" && garaSelezionata){
  return (
    <div className="app">

    <BottoneIndietro />

      <div className="dashboard-card">

        <h2>RISULTATO GARA</h2>

        <div className="mini-card">
          <b>{garaSelezionata.gruppo}</b>
          <p>📅 {garaSelezionata.data}</p>
          <p>⚽ {garaSelezionata.avversario}</p>
        </div>

        <input
          type="number"
          placeholder="Gol fatti"
          value={risultatoGara.golFatti}
          onChange={(e)=>
            setRisultatoGara({
              ...risultatoGara,
              golFatti:e.target.value
            })
          }
        />

        <input
          type="number"
          placeholder="Gol subiti"
          value={risultatoGara.golSubiti}
          onChange={(e)=>
            setRisultatoGara({
              ...risultatoGara,
              golSubiti:e.target.value
            })
          }
        />

        <textarea
          placeholder="Note risultato"
          value={risultatoGara.noteRisultato}
          onChange={(e)=>
            setRisultatoGara({
              ...risultatoGara,
              noteRisultato:e.target.value
            })
          }
        />
<h3>Statistiche giocatori</h3>

{Object.keys(statisticheGara).map((nome, index) => (

  <div className="mini-card" key={index}>

    <b>{nome}</b>

    <select
      value={statisticheGara[nome].voto}
      onChange={(e) =>
        setStatisticheGara({
          ...statisticheGara,
          [nome]: {
            ...statisticheGara[nome],
            voto: e.target.value
          }
        })
      }
    >
      <option value="">Voto</option>
      <option value="4">4</option>
      <option value="4.5">4.5</option>
      <option value="5">5</option>
      <option value="5.5">5.5</option>
      <option value="6">6</option>
      <option value="6.5">6.5</option>
      <option value="7">7</option>
      <option value="7.5">7.5</option>
      <option value="8">8</option>
      <option value="8.5">8.5</option>
      <option value="9">9</option>
      <option value="9.5">9.5</option>
      <option value="10">10</option>
    </select>

    <input
      type="number"
      placeholder="Goal"
      value={statisticheGara[nome].goal}
      onChange={(e) =>
        setStatisticheGara({
          ...statisticheGara,
          [nome]: {
            ...statisticheGara[nome],
            goal: e.target.value
          }
        })
      }
    />

    <input
      type="number"
      placeholder="Assist"
      value={statisticheGara[nome].assist}
      onChange={(e) =>
        setStatisticheGara({
          ...statisticheGara,
          [nome]: {
            ...statisticheGara[nome],
            assist: e.target.value
          }
        })
      }
    />

    <input
      type="number"
      placeholder="Minuti giocati"
      value={statisticheGara[nome].minuti}
      onChange={(e) =>
        setStatisticheGara({
          ...statisticheGara,
          [nome]: {
            ...statisticheGara[nome],
            minuti: e.target.value
          }
        })
      }
    />

    <label>
      <input
        type="checkbox"
        checked={statisticheGara[nome].titolare}
        onChange={(e) =>
          setStatisticheGara({
            ...statisticheGara,
            [nome]: {
              ...statisticheGara[nome],
              titolare: e.target.checked
            }
          })
        }
      />
      Titolare
    </label>

    <label>
      <input
        type="checkbox"
        checked={statisticheGara[nome].ammonizioni}
        onChange={(e) =>
          setStatisticheGara({
            ...statisticheGara,
            [nome]: {
              ...statisticheGara[nome],
              ammonizioni: e.target.checked
            }
          })
        }
      />
      Ammonito
    </label>

    <label>
      <input
        type="checkbox"
        checked={statisticheGara[nome].espulsioni}
        onChange={(e) =>
          setStatisticheGara({
            ...statisticheGara,
            [nome]: {
              ...statisticheGara[nome],
              espulsioni: e.target.checked
            }
          })
        }
      />
      Espulso
    </label>

    <label>
      <input
        type="radio"
        name="mvpGara"
        checked={mvpGara === nome}
        onChange={() => setMvpGara(nome)}
      />
      MVP
    </label>

  </div>

))}
        <button onClick={salvaRisultato}>
  SALVA RISULTATO
</button>

        <button
          onClick={() => setPagina("dettaglioGara")}
        >
          ANNULLA
        </button>

      </div>
    </div>
  );
}
if(pagina === "schede"){
  return (
    <div className="app">

    <BottoneIndietro />

      <div className="dashboard-card">

        <h2>SCHEDE GIOCATORI</h2>

        {giocatoriSchede.map((g, index) => (

          <div
            className="mini-card"
            key={index}
            onClick={() => apriSchedaGiocatore(g)}
          >

            <b>{g.nome}</b>
            <p>{g.gruppo}</p>

          </div>

        ))}

      </div>
    </div>
  );
}
if(pagina === "schedaGiocatore" && giocatoreSelezionato){
  return (
    <div className="app">

    <BottoneIndietro />

      <div className="dashboard-card">

        <h2>SCHEDA GIOCATORE</h2>

        <div className="mini-card">

  <h3>{schedaModifica.nome}</h3>

  <h2>
  OVERALL {calcolaOverall()}
</h2>

  <p>Gruppo: {schedaModifica.gruppo}</p>

  <label>Data nascita</label>
  <input
    type="date"
    value={schedaModifica.dataNascita || ""}
    onChange={(e) => aggiornaScheda("dataNascita", e.target.value)}
  />

  <input
    type="number"
    placeholder="Altezza"
    value={schedaModifica.altezza || ""}
    onChange={(e) => aggiornaScheda("altezza", e.target.value)}
  />

  <input
    type="number"
    placeholder="Peso"
    value={schedaModifica.peso || ""}
    onChange={(e) => aggiornaScheda("peso", e.target.value)}
  />

  <input
    type="number"
    placeholder="Numero maglia"
    value={schedaModifica.numero || ""}
    onChange={(e) => aggiornaScheda("numero", e.target.value)}
  />

  <select
    value={schedaModifica.ruoloBase || ""}
    onChange={(e) => aggiornaScheda("ruoloBase", e.target.value)}
  >
    <option value="">Ruolo base</option>
    <option value="Giocatore">Giocatore</option>
    <option value="Portiere">Portiere</option>
  </select>

  <input
    type="text"
    placeholder="Ruolo"
    value={schedaModifica.ruolo || ""}
    onChange={(e) => aggiornaScheda("ruolo", e.target.value)}
  />

  <select
    value={schedaModifica.piede || ""}
    onChange={(e) => aggiornaScheda("piede", e.target.value)}
  >
    <option value="">Piede</option>
    <option value="Destro">Destro</option>
    <option value="Sinistro">Sinistro</option>
    <option value="Entrambi">Entrambi</option>
  </select>

</div>

{schedaModifica.ruoloBase === "Giocatore" && (
  <div>

    <h3>Valori Giocatore</h3>

    {sliderScheda("controllo", "Controllo palla")}
    {sliderScheda("passaggio", "Passaggio")}
    {sliderScheda("dribbling", "Dribbling")}
    {sliderScheda("tiro", "Tiro")}
    {sliderScheda("visioneGioco", "Visione di gioco")}
    {sliderScheda("cross", "Cross")}
    {sliderScheda("difesa", "Difesa")}
    {sliderScheda("colpoTesta", "Colpo di testa")}
    {sliderScheda("calcioPiazzato", "Calcio piazzato")}

    <h3>Fisico</h3>

    {sliderScheda("velocita", "Velocità")}
    {sliderScheda("accelerazione", "Accelerazione")}
    {sliderScheda("resistenza", "Resistenza")}
    {sliderScheda("forza", "Forza")}
    {sliderScheda("agilita", "Agilità")}
    {sliderScheda("equilibrio", "Equilibrio")}

    <h3>Mentale / Tattico</h3>

    {sliderScheda("posizionamento", "Posizionamento")}
    {sliderScheda("letturaGioco", "Lettura gioco")}
    {sliderScheda("marcatura", "Marcatura")}
    {sliderScheda("movimentoSenzaPalla", "Movimento senza palla")}
    {sliderScheda("concentrazione", "Concentrazione")}
    {sliderScheda("leadership", "Leadership")}
    {sliderScheda("personalita", "Personalità")}
    {sliderScheda("impegno", "Impegno")}
    {sliderScheda("decisionMaking", "Decision making")}
    {sliderScheda("disciplina", "Disciplina")}

  </div>
)}

{schedaModifica.ruoloBase === "Portiere" && (
  <div>

    <h3>Valori Portiere</h3>

    {sliderScheda("presa", "Presa")}
    {sliderScheda("tuffo", "Tuffo")}
    {sliderScheda("riflessi", "Riflessi")}
    {sliderScheda("parata", "Parata")}
    {sliderScheda("uscite", "Uscite")}
    {sliderScheda("unoControUno", "Uno contro uno")}
    {sliderScheda("giocoPiedi", "Gioco con i piedi")}
    {sliderScheda("rinvio", "Rinvio")}
    {sliderScheda("passaggioCorto", "Passaggio corto")}
    {sliderScheda("lancioLungo", "Lancio lungo")}

    <h3>Fisico Portiere</h3>

    {sliderScheda("velocitaPortiere", "Velocità portiere")}
    {sliderScheda("accelerazionePortiere", "Accelerazione portiere")}
    {sliderScheda("reattivita", "Reattività")}
    {sliderScheda("esplosivita", "Esplosività")}
    {sliderScheda("agilitaPortiere", "Agilità portiere")}
    {sliderScheda("forzaPortiere", "Forza portiere")}

    <h3>Mentale Portiere</h3>

    {sliderScheda("posizionamentoPorta", "Posizionamento porta")}
    {sliderScheda("letturaGiocoPortiere", "Lettura gioco portiere")}
    {sliderScheda("comunicazioneDifesa", "Comunicazione difesa")}
    {sliderScheda("gestioneArea", "Gestione area")}
    {sliderScheda("concentrazionePortiere", "Concentrazione portiere")}
    {sliderScheda("coraggio", "Coraggio")}
    {sliderScheda("leadershipPortiere", "Leadership portiere")}
    {sliderScheda("personalitaPortiere", "Personalità portiere")}
    {sliderScheda("decisionMakingPortiere", "Decision making portiere")}

  </div>
)}

<h3>Osservazioni istruttore</h3>

<div className="mini-card">

  <textarea
    placeholder="Note"
    value={schedaModifica.note || ""}
    onChange={(e) => aggiornaScheda("note", e.target.value)}
  />

  <textarea
    placeholder="Punti di forza"
    value={schedaModifica.puntiForza || ""}
    onChange={(e) => aggiornaScheda("puntiForza", e.target.value)}
  />

  <textarea
    placeholder="Da migliorare"
    value={schedaModifica.daMigliorare || ""}
    onChange={(e) => aggiornaScheda("daMigliorare", e.target.value)}
  />

</div>

        <h3>Statistiche stagione</h3>

<div className="mini-card">
  <p>
🏃 Presenze Allenamento:
{" "}
{giocatoreSelezionato.statistiche?.presenzeAllenamento ?? 0}
</p>

<p>
🏟️ Convocazioni Gara:
{" "}
{giocatoreSelezionato.statistiche?.convocazioni ?? 0}
</p>
  <p>⚽ Goal: {giocatoreSelezionato.statistiche?.goal ?? 0}</p>
  <p>🎯 Assist: {giocatoreSelezionato.statistiche?.assist ?? 0}</p>
  <p>⭐ Media voto: {giocatoreSelezionato.statistiche?.mediaVoto || "-"}</p>
  <p>🏅 MVP: {giocatoreSelezionato.statistiche?.mvp ?? 0}</p>
  <p>⏱️ Minuti: {giocatoreSelezionato.statistiche?.minuti ?? 0}</p>
  <p>🟨 Ammonizioni: {giocatoreSelezionato.statistiche?.ammonizioni ?? 0}</p>
  <p>🟥 Espulsioni: {giocatoreSelezionato.statistiche?.espulsioni ?? 0}</p>
  <p>🏟️ Partite valutate: {giocatoreSelezionato.statistiche?.partite ?? 0}</p>
</div>

<button onClick={salvaScheda}>
  SALVA SCHEDA
</button>

      </div>
    </div>
  );
}
if(pagina === "statistiche" && statistiche){
  return (
    <div className="app">

    <BottoneIndietro />

      <div className="dashboard-card">

        <h2>STATISTICHE</h2>

<select
  value={gruppoStatistiche}
  onChange={(e) => setGruppoStatistiche(e.target.value)}
>
  <option value="">Tutti i gruppi</option>

  {getGruppiStatistiche().map((gruppo, index) => (
    <option key={index} value={gruppo}>
      {gruppo}
    </option>
  ))}
</select>

        <h3>⚽ Marcatori</h3>
        {filtraStatistiche(statistiche.marcatori).slice(0, 10).map((s, index) => (
          <div className="mini-card" key={index}>
            <b>{index + 1}. {s.ragazzo}</b>
            <p>Goal: {s.goal}</p>
          </div>
        ))}

        <h3>🎯 Assist</h3>
        {filtraStatistiche(statistiche.assist).slice(0, 10).map((s, index) => (
          <div className="mini-card" key={index}>
            <b>{index + 1}. {s.ragazzo}</b>
            <p>Assist: {s.assist}</p>
          </div>
        ))}

        <h3>⭐ Media voto</h3>
        {filtraStatistiche(statistiche.mediaVoto).slice(0, 10).map((s, index) => (
          <div className="mini-card" key={index}>
            <b>{index + 1}. {s.ragazzo}</b>
            <p>Media: {s.mediaVoto}</p>
          </div>
        ))}

        <h3>🏅 MVP</h3>
        {filtraStatistiche(statistiche.mvp).slice(0, 10).map((s, index) => (
          <div className="mini-card" key={index}>
            <b>{index + 1}. {s.ragazzo}</b>
            <p>MVP: {s.mvp}</p>
          </div>
        ))}

        <h3>🏃 Presenze Allenamento %</h3>

{filtraStatistiche(statistiche.presenzeAllenamento)
  .slice(0, 10)
  .map((s, index) => (

  <div className="mini-card" key={index}>
    <b>{index + 1}. {s.ragazzo}</b>
    <p>{s.percentualeAllenamento}%</p>
  </div>

))}

<h3>🏟️ Presenze Gara %</h3>

{filtraStatistiche(statistiche.presenzePartite)
  .slice(0, 10)
  .map((s, index) => (

  <div className="mini-card" key={index}>
    <b>{index + 1}. {s.ragazzo}</b>
    <p>{s.percentualePartite}%</p>
  </div>

))}

<h3>🟨 Ammonizioni</h3>

{filtraStatistiche(statistiche.ammonizioni)
  .slice(0, 10)
  .map((s, index) => (

  <div className="mini-card" key={index}>
    <b>{index + 1}. {s.ragazzo}</b>
    <p>{s.ammonizioni}</p>
  </div>

))}

<h3>🟥 Espulsioni</h3>

{filtraStatistiche(statistiche.espulsioni)
  .slice(0, 10)
  .map((s, index) => (

  <div className="mini-card" key={index}>
    <b>{index + 1}. {s.ragazzo}</b>
    <p>{s.espulsioni}</p>
  </div>

))}

      </div>
    </div>
  );
}
function filtraStatistiche(lista){

  if(!gruppoStatistiche){
    return lista;
  }

  return lista.filter(
    (s) => s.gruppo === gruppoStatistiche
  );

}
function getGruppiStatistiche(){

  if(!statistiche || !statistiche.marcatori){
    return [];
  }

  var gruppi = statistiche.marcatori.map((s) => s.gruppo);

  return [...new Set(gruppi)].filter(Boolean);

}

if(pagina === "weekend"){
  return (
    <div className="app">

    <BottoneIndietro />

      <div className="dashboard-card">

        <h2>LISTA WEEKEND</h2>

        <button onClick={esportaListaWeekend}>
  ESPORTA LISTA WEEKEND
</button>

        {gare.map((g, index) => (

          <div
            className="mini-card"
            key={index}
            onClick={() => apriDettaglioGara(g)}
          >

            <b>{g.gruppo}</b>

            <p>📅 {g.data}</p>
            <p>⚽ {g.avversario}</p>
            <p>🕒 {g.orario}</p>
            <p>🏟️ {g.campo}</p>

            <p>
              Convocazioni: {g.haConvocati ? "✅ Fatte" : "❌ Mancanti"}
            </p>

            <p>
              Risultato: {
                g.golFatti !== "" && g.golFatti != null &&
                g.golSubiti !== "" && g.golSubiti != null
                  ? "✅ Inserito"
                  : "⚠️ Mancante"
              }
            </p>

          </div>

        ))}

      </div>
    </div>
  );
}
if(pagina === "iscritti"){
  return (
    <div className="app">

    <BottoneIndietro />

      <div className="dashboard-card">

        <h2>GESTIONE ISCRITTI</h2>

        <div className="mini-card">

          <h3>
  {iscrittoInModifica
    ? "MODIFICA ISCRITTO"
    : "NUOVO ISCRITTO"}
</h3>

          <input
            type="text"
            placeholder="Cognome Nome"
            value={nuovoIscritto.nome}
            onChange={(e) =>
              setNuovoIscritto({
                ...nuovoIscritto,
                nome: e.target.value
              })
            }
          />

          <select
            value={nuovoIscritto.gruppo}
            onChange={(e) =>
              setNuovoIscritto({
                ...nuovoIscritto,
                gruppo: e.target.value
              })
            }
          >
            <option value="">Seleziona gruppo</option>

            {tuttiGruppi.map((gruppo, index) => (
              <option key={index} value={gruppo}>
                {gruppo}
              </option>
            ))}

          </select>

          <label>Data nascita</label>
          <input
            type="date"
            value={nuovoIscritto.dataNascita}
            onChange={(e) =>
              setNuovoIscritto({
                ...nuovoIscritto,
                dataNascita: e.target.value
              })
            }
          />

          <input
            type="text"
            placeholder="Telefono"
            value={nuovoIscritto.telefono}
            onChange={(e) =>
              setNuovoIscritto({
                ...nuovoIscritto,
                telefono: e.target.value
              })
            }
          />

          <button onClick={salvaNuovoIscritto}>
            SALVA ISCRITTO
          </button>

        </div>

        <h3>ISCRITTI ESISTENTI</h3>

<input
  type="text"
  placeholder="Cerca iscritto"
  value={ricercaIscritto}
  onChange={(e) => setRicercaIscritto(e.target.value)}
/>

{listaIscritti
  .filter((i) =>
    i.nome.toLowerCase().includes(
      ricercaIscritto.toLowerCase()
    )
  )
  .map((i, index) => (

    <div className="mini-card" key={index}>

      <b>{i.nome}</b>
      <p>Gruppo: {i.gruppo}</p>
      <p>Data nascita: {i.dataNascita || "-"}</p>
      <p>Telefono: {i.telefono || "-"}</p>

      <button
  onClick={() => modificaIscritto(i)}
>
  ✏️ MODIFICA
</button>

<button
  onClick={() => eliminaIscritto(i)}
>
  🗑️ ELIMINA
</button>

    </div>

))}


      </div>
    </div>
  );
}
if(pagina === "gruppi"){
  return (
    <div className="app">

    <BottoneIndietro />

      <div className="dashboard-card">

        <h2>GESTIONE GRUPPI</h2>

        <select
          value={gruppoGestione}
          onChange={(e) =>
            caricaRagazziGruppoGestione(e.target.value)
          }
        >
          <option value="">Seleziona gruppo</option>

          {tuttiGruppi.map((gruppo, index) => (
            <option key={index} value={gruppo}>
              {gruppo}
            </option>
          ))}

        </select>

        {gruppoGestione !== "" && (
          <h3>{gruppoGestione}</h3>
        )}

        {ragazziGruppoGestione.map((r, index) => (
  <div className="mini-card" key={index}>
    <label>
      <input
        type="checkbox"
        checked={ragazziSelezionati[r.id] || false}
        onChange={(e) =>
          setRagazziSelezionati({
            ...ragazziSelezionati,
            [r.id]: e.target.checked
          })
        }
      />
      {r.nome}
    </label>
  </div>
))}

{ragazziGruppoGestione.length > 0 && (

  <div className="mini-card">

    <h3>Sposta selezionati</h3>

    <select
      value={nuovoGruppoGestione}
      onChange={(e) =>
        setNuovoGruppoGestione(e.target.value)
      }
    >
      <option value="">Nuovo gruppo</option>

      {tuttiGruppi
        .filter((g) => g !== gruppoGestione)
        .map((gruppo, index) => (
          <option key={index} value={gruppo}>
            {gruppo}
          </option>
        ))}

    </select>

    <button onClick={spostaRagazziGruppo}>
      SPOSTA SELEZIONATI
    </button>

    <button onClick={aggiungiGruppoRagazzi}>
  AGGIUNGI AL GRUPPO
</button>

  </div>

)}


      </div>
    </div>
  );
}

  return (
  <div
  className="app dashboard-dark"
  style={{
    backgroundImage: `url(${dashboardBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }}
>

    <div className="dash-hero">

  <div className="dash-brand">
    <img src={logo} alt="ASD Incontro" className="dash-logo" />

    <div>
      <h1>ASD INCONTRO</h1>
      <p>GESTIONE TECNICA</p>
    </div>
  </div>

  <div className="dash-user-panel">
    <div>
      <span>BENTORNATO</span>
      <h2>{utente.nome}</h2>
      <p>La tua area operativa per allenamenti, gare e giocatori.</p>
    </div>
  </div>

  <div className="dash-summary">

        <div className="summary-card">
          <div className="summary-icon">📅</div>
          <b>ALLENAMENTI</b>
          <strong>
            {allenamenti.filter(a => a.stato === "Programmato").length}
          </strong>
          <small>programmati</small>
        </div>

        <div className="summary-card">
          <div className="summary-icon">⚽</div>
          <b>GARE</b>
          <strong>
            {gare.filter(g => g.stato === "Programmato").length}
          </strong>
          <small>prossime</small>
        </div>

        <div
  className="summary-card"
  onClick={() => {
    if(utente.ruolo === "Admin"){
      setMostraTotali(!mostraTotali);
    }
  }}
>
  <div className="summary-icon">👥</div>

  <b>
    {utente.ruolo === "Admin"
      ? mostraTotali
        ? "ALLIEVI TOTALI"
        : "ALLIEVI MIEI"
      : "ALLIEVI"}
  </b>

  <strong>
    {utente.ruolo === "Admin"
      ? mostraTotali
        ? dashboardInfo.allieviTotali
        : dashboardInfo.allievi
      : dashboardInfo.allievi}
  </strong>

  <small>
    {utente.ruolo === "Admin"
      ? "tocca per cambiare"
      : "nella tua gestione"}
  </small>
</div>

      </div>

    </div>

    <div className="dash-modules">

     <CardDashboard
  titolo="ALLENAMENTI"
  descrizione="Presenze, calendario e statistiche"
  immagine={cardAllenamenti}
  onClick={caricaAllenamenti}
/>

      <CardDashboard
  titolo="GARE"
  descrizione="Convocazioni, risultati e archivio"
  immagine={cardGare}
  onClick={caricaGare}
/>

     <CardDashboard
  titolo="STATISTICHE"
  descrizione="Statistiche squadra e giocatori"
  immagine={cardStatistiche}
  onClick={caricaStatistiche}
/>

     <CardDashboard
  titolo="SCHEDE"
  descrizione="Valutazioni giocatori stile FIFA"
  immagine={cardSchede}
  onClick={caricaSchedeGiocatori}
/>

      {utente.ruolo === "Admin" && (
        <>
         <CardDashboard
  titolo="ALLIEVI"
  descrizione="Anagrafica ragazzi e dati societari"
  immagine={cardAllievi}
  onClick={caricaIscritti}
/>

          <CardDashboard
  titolo="GRUPPI"
  descrizione="Spostamenti e gruppi multipli"
  immagine={cardGruppi}
  onClick={caricaGestioneGruppi}
/>

          <button className="module-card" onClick={caricaListaWeekend}>
            <div className="module-icon">📋</div>
            <div>
              <h3>LISTA WEEKEND</h3>
              <p>Riepilogo gare ed esportazione</p>
            </div>
            <span>›</span>
          </button>
        </>
      )}

      <button
        className="logout module-card logout-card"
        onClick={() => {
          localStorage.removeItem("utente");
          localStorage.removeItem("ultimoAccesso");
          setUtente(null);
        }}
      >
        <div className="module-icon">🚪</div>
        <div>
          <h3>ESCI</h3>
          <p>Termina la sessione</p>
        </div>
        <span>›</span>
      </button>

    </div>

  </div>
);
        }}