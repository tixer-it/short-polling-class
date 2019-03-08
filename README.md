# Short polling JS

La seguente classe aggiunge alcune funzionalità non presenti nativamente nell' [EventSource API](https://developer.mozilla.org/it/docs/Web/API/EventSource)

L'EventSource API non permette infatti di modificare di chiudere e riaprire il polling verso il server, senza re-inizializzare una nuova istanza della classe.

**ShortPolling.js** permette con semplicità di utilizzare le seguenti funzioni:

* Istanziare l'oggetto senza avviare immediatamente il polling.
* Avviare e bloccare il polling temporaneamente.
* Modificare i parametri inviati al server.
* Effettuare in automatico il parsing della risposta ([XML](https://it.wikipedia.org/wiki/XML) o [JSON](https://it.wikipedia.org/wiki/JavaScript_Object_Notation)).

## Come fare:

###### Inclusione dello script
```html
  <script src="ShortPolling.js"></script>
```

###### Parametri inizializzazione
* ```url[String]```: URL del backend che si occuperà di gestire l'evento.
* ```onMessage[Function]```: //Funzione di callback contenente i dati provenienti dal server.
* ```params[Object] (opzionale)```: Parametri in GET inviati ad ogni polling al server.
* ```type[String] (opzionale)```: Tipo di dato atteso dal backend, se specificato verrà automaticamente effettuato il parsing.


###### Esempio di inizializzazione
```javascript
  const polling = new ShortPolling({
    url: 'api/load-events',
    onMessage: parsed_json => {
      /*...*/
    },
    type: 'JSON',
    params: {
      'user': user,
      'group': user_group
    }
  });
```

###### Start polling
```javascript
  polling.startPolling();
```

###### Stop polling
```javascript
  polling.stopPolling();
```

###### Cambiare parametri chiamata in GET
```javascript
  polling.changeParam({
    'user': null,
    'group': null
  });
```

###### Accedere all'oggetto EventSource
Come specificato nell'introduzione la seguente classe utilizza l'EventSource API nativa di javascript. Se si volesse ottenere l'istanza originale dell'oggetto EventSource basterà richiamare il metodo ```getEventSource```.
```javascript
  polling.getEventSource();
  //EventSource {url: "api/load-events", withCredentials: false, readyState: 0, …}
```

###### Parse della risposta
Specificando il ```type``` come parametro di inizializzazione della classe sarà possibile, in automatico, ricevere dall'evento ```onMessage``` la risposta già condificata in base al tipo selezionato (JSON o XML).

Se non viene specificato nessun ```type```in fase di inizializzazione, ```ShortPolling``` restituirà la risposta originale proveniente dalla classe ```EventSource```


## Backend:
Per restituire correttamente la risposta dal backend sarà necessario inviare il contenuto rispettando una determinata sintassi.
1. Impostare il ```Content-Type``` a ```text/event-stream```
2. Stampare il messaggio/JSON/XML tra ```data:``` e ```\n\n```

###### Es. PHP
```PHP
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

$json_data = [
  'status' => true
];

$json_data_encoded = json_encode(json_data);

echo "data:{$json_data_encoded}\n\n";
```
