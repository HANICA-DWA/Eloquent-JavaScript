# ICA Adventure met Promises en Async/Await

{{exCommit "Assignment Unit 2B" "Assignment Unit 2B"

In deze opgave gebruiken we promises om alle asynchrone code te managen.

De functionaliteit voor het weergeven van informatie over een locatie is als voorbeeld gegeven:

* **game.js:** de functie `getLocationInformation` retourneert nu een resolved Promise met de informatie over de locatie.
* **main.js** de `case where` en `case w` retourneren nu ook een resolved Promise.

Hoewel er in de bovenstaande gevallen geen sprake is van asynchronde code, worden er toch promises teruggegeven. Dit is gedaan zodat je niet per functie uit game.js hoeft te controleren of je een Promise terugkrijgt of niet en je altijd een `then` statement kunt plakken na het uitvoeren van een functie. Hetzelfde geldt voor `execute` uit main.js. Doordat `execute` altijd een Promise teruggeeft, kun je altijd een `then` achter een aanroep van `execute` plakken en hoef je niet eerst te checken of je daadwerkelijk een Promise-object hebt gekregen. 

## Opgave

### B1) In main.js

In de vorige opgaven was dit stuk code gegeven en nu is het de bedoeling dat je het omschrijft naar een Promise-chain. Zorg ervoor dat het resultaat van de aanroep van `execute` naar de console wordt geschreven. Als er een fout optreedt, controleer dan of de property `code` van deze fout gelijk is aan `COMMAND_ERROR`. Als dit zo is, dan kun je de `message` van de fout naar de console schrijven, anders kun je de error opnieuw gooien (waarmee je het programma laat crashen). 

Test de implementatie door het spel te runnen en het command `where`, of `w` te geven. Vergeet niet de map_server.js 'aan' te zetten.

### B2) In game.js

Implementeer nu (weer) `game.goToLocation`, maar zorg er nu voor dat de functie een Promise retourneert. 

### B3) In main.js

Roep de functie `game.goToLocation` aan in `case 'where'` (en `case w`). Zorg ervoor dat dit case statement dezelfde functionaliteit implementeert als in eerdere code, maar nu een Promise retourneert. Dat betekent dat je een rejected Promise moet teruggeven als de gebruiker geen locatienaam opgeeft en resolved Promise met de naam van de locatie als alles goed gaat.

exCommit}}

{{exCommit "Assignment Unit 2C" "Assignment Unit 2C"

In deze opgave vervangen we de Promise-code met de synthactic sugar Async/Await.

Ook is weer de functionaliteit voor het weergeven van informatie over een locatie is als voorbeeld gegeven:

* **game.js:** de functie `game.getLocationInfo` begint nu met `async` en achter het `return`-keyword staat nu weer alleen de data die de functie teruggeeft. Omdat de functie 'async' is retourneert het echter wel een Promise.
* **main.js:** ook `execute` begint nu met het keyword `async`.

## Opgave

### C1) In main.js

Copy-paste  de promise-implementatie die je in assignment_1 hebt gemaakt hier. Dit kunnen we helaas niet vervangen door async/await (waarom niet)?

### C2) In game.js

Herschrijf de Promise-stijl implementatie van `game.goToLocation` naar een Async/Await stijl.

### C3) In main.js

Herschrijf de Promise-stijl aanroep van `game.goToLocation` aan in `case 'where'` (en `case w`) naar een Async/Await stijl

exCommit}}
