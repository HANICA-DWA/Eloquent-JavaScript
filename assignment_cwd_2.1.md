# form -validation met hogere orde functies en exceptions

Om het maken en gebruiken van hogere orde functies te oefenen in een praktische context, gaan we een toolkit maken voor _form validation_: het controleren of gebruikers correcte waardes in formuliervelden invoeren.

{{note

In gewone projecten ga je form-validatie niet doen met een zelfgemaakt knutselwerk, maar met de [standaard features die HTML 5](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation) daarvoor biedt, of met één van de [vele JS-libraries](https://codegeekz.com/best-javascript-form-validation-libraries/) die daarvoor te vinden zijn. Maar voor ons is dit een prima onderwerp om te werken met hogere orde functies, dus we gaan die gave libaries nu niet gebruiken.

note}}

In de repo vind je een html-file met daarin een uitprobeer-formulier. De file gebruikt twee JS-bestanden:
1. `formValidation.js` -- dit moet een JS library worden waarmee developers makkelijk form-validatie kunnen maken voor hun web-app. Er staat flink wat commentaar over het converteren van een HTMLCollection naar een array. Een HTMLCollection is een wat onhandig datatype Nu bevat de library nog eigenlijk niet meer dan de moglijkheid om te checken of verplichte velden ook werklijk niet leeg zijn.
1. `main.js` -- een applicatie-specifieke file om de formValidator library toe te passen op het formulier dat in de HTML beschreven staat. [Deze files maken nog geen gebruik van een volwassen module-systeem. Moderne JS code zou niet meer op deze manier met modules werken, en in latere weken gaan wij dat ook niet meer doen in de cursus.]{aside}

## Stap 1: De start-code bekijken.

:one: Begin met het bekijken van de opzet van het formulier in de HTML file. Die is vrij overzichtelijk. Let op dat:
  * Het `<form>`-element een `id` attrbuut heeft;
  * Alle formulier-inputs een `name` attibuut hebben;

:two: Open `main.js`. De volgende dingen zijn de moeite van het bestuderen waard:
  * De initialisatie van de web-app start bij de `window.onload` event handler.
  * `handleFormSubmit` is een "nep functie" die net doet alsof er wat zinnigs gebeurt als het formulier ingediend kan worden zonder validatie-problemen.
  * Aan het formulier wordt een event handler (a.k.a. event listener) gekoppeld die afgaat als de gebruikt op de submit-knop drukt (of op de enter-toets).
  * De tweede parameter voor `addEventListener` _moet_ een functie-waarde zijn. Maar nu staat er een functie**_aanroep_**. Dat betekent dat de return-waarde van `makeFormValidator()` zelf een functie-waarde moet zijn. `makeFormValidator` zou je dus een 'function factory' kunnen noemen: een functie die functies maakt.
  * De form-validator wordt geconfigureerd met 'checker'-functies. (Dat is een term die is uitgevonden voor deze library; niet een algemene Javascript term.) Je ziet dat de configuratie een _object dat functies bevat_ is.
  * Hoewel de formValidator library zelf een checker-functie definieert, definieert `main.js` er ook eentje. De formValidator library is dus **uitbreidbaar**, en de checker-functies zijn een soort plug-ins.

De basis-werking van de formvalidator is simpel: Als de gebruiker het formulier submit, dan checkt-ie van alle formuliervleden of er een checker voor megegeven is, en als dat zo is, of die checker `true` oplevert voor de huidige waarde van het invoerveld. Als _alle_ velden `true` opleveren, dan is het formulier OK, en wordt de 'succes'-functie aangeroepen (in dit voorbeeld zal dat `handleFormSubmit` in `main.js` zijn).

{{exShort "Vraag:" "FormValidator-vraag-1"

Welke formulier-velden worden, in deze configuratie gecontroleerd door de validator?

exShort}}


{{note

De functie `makeFormValidator` is dus op meerdere manieren een hogere-orde functie:
* z'n eerste parameter is een object dat functie-waardes bevat;
* z'n tweede parameter is ook een functie-waarde (de succes-callback)
* z'n return-waarde is ook een functie-waarde: een event handler die aan een HTML-formulier gekoppeld kan worden.

note}}

:three: Probeer het formulier even uit. Open de HTML file in je browser, en zorg ervoor dat je de console open hebt staan om meldingen van de checker-functies te zien.

{{exShort "Vraag:" "FormValidator-vraag-2"

Kun je het postcode veld leeg laten?

exShort}}

:four: Bekijk de file `formValidation.js`. Let op de volgende dingen:
* Er staat flink wat commentaar over het converteren van een HTMLCollection naar een array. Een [HTMLCollection](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection) is een wat onhandig datatype dat browsers (moeten) gebruiken om een verzameling HTML-elementen aan jouw Javascript code te overhandigen. Het is jammer dat er niet voor gekozen is om daar gewoon een JS array van te maken, maar met de Array.from() functie kunnen we dat zelf doen.
* De `validator` functie gebruikt een hogere-orde functie om te controleren dat alle velden goed door de checkers heenkomen. Die functie heet `every`, en is net als `map`, `filter` en `forEach` een methode van arrays in JavaScript.
* Als er een veld is dat niet OK door de checker heenkomt, dan geeft deze functie een stomme `alert()` weer. Dat zullen we moeten verbeteren :-).

{{exLong "Opzoek-vraag" "FormValidator-vraag-2"

Zoek, op internet, op wat de `every` methode doet voor JS arrays, en beschrijf dat kort hieronder.
* Als je het graag concreet houdt, is het OK als je beschrijft wat `every` in deze code doet -- de code van de `validator` functie.
* Geef in je antwoord je bron aan. Maak daar een Markdown hyperlink van.

exLong}}

## Stap 2: Nog een checker maken

Laten we afspreken dat zowel de voornaam als de achternaam:
1. niet langer dan 20 karakters mogen zijn (om te voorkomen dat de naam niet meer op het vliegticket past b.v.), en
2. niet korter dan 3 karakters mogen zijn.

:point_right: Schrijf, in de file `main.js`, een checker-functie voor de naam-lengte (min 3; max 20). Checker-functies krijgen één parameter (de waarde die gechecked moet worden), en leveren een boolean (true/false) op om aan te geven of de waarde valide is. [Deze opdracht maak je in je lokale kopie van de je persoonlijke CWD repo. Straks, als je alle opdrachten hebt gedaan, lever je je hele werk in één keer in door te committen naar je persoonlijke Github, en de commit-URL via deze pagine in te leveren.]{aside}


:point_right: pas `theFormCheckers` in de functie `initializeApp` aan, zodat de nieuwe checker gebruikt wordt voor de voornaam en de achternaam invoervelden.

:point_right: controleer dat je code werkt.

## Stap 3: Flexibelere lengte checker.

De requirement dat namen maximaal 20 karaters hebben, en minimaal 3, zou specifiek kunnen zijn aan deze app. Maar een algemeen bruikbare lengte-checker is wellicht iets wat deel kan uitmaken van de library i.p.v. de app. Dan moeten minimum en maximum wel flexibel in te stellen zijn.

Begin even met een checker die alleen maar de _maximum_-lengte controleert. hecker-functies worden, door de formValidation library, aangeroepen met één parameter (de te controleren invoerwaarde). Om toch flexibel te zijn qua max-lengte, maak je een 'function factory':

:point_right: Maak een function factory die de max-lengte als parameter krijgt, en dan **een checker-functie oplevert** (als returnwaarde) die invoer kan controleren op de gegeven max-lengte. De structuur van de functie is dit:

```dontedit
function hasMaxLength(maxLength) {
  return function(value) {
    // Code to check the value against the maxLength
    // and to return a boolean.
  }
}
```
_Dit is de checker-variant op een function-factory. Een "checker-factory" :-)_

:point_right: Je zou nu je configuratie-variable `theFormCheckers` er zo moeten uit kunnen laten zien:

```dontedit
const theFormCheckers = {
  voornaam:   hasMaxLength(20)
  achternaam: hasMaxLength(20),  
  postcode:   isaPostCode,   
  huisnummer: isRequired
};
```

:point_right: Controleer dat je code werkt.

:point_right: Als je code werkt, dan kun je de `hasMaxLength` functie verplaasten naar de `formValidation.js` library. Het is een handig ding dat in veel situaties bruikbaar is.

:point_right: Maak nu ook een functie `hasMinimumLength(min)`, die op dezelfde manier werkt. **Voeg deze functionaliteit _NIET_ toe aan `hasMaxLength`**. (Dat zou best kunnen, maar zometeen gaan we een hogere-orde checker maken die checkers kan combineren.)

## Stap 4: Hogere-orde checkers

Als een hogere-orde _functie_ een functie is die functies als waardes gebruikt, dan is een _hogere-orde checker_ een checker die andere checkers als waardes gebruikt.

We zouden graag de twee nieuwe checkers willen kunnen combineren, zodat beide checks `true` moeten opleveren om de invoer in het veld valide te vinden.

:point_right: Maak een `checkBoth(checker1, checker2)` functie, die z'n twee parameters loslaat op de invoerwaarde, en alleen `true` terugkeert als _beide_ checkers ook `true` opleveren. (Een soort AND-operatie, dus).

We zouden de nieuwe checker-combinator zo moeten kunnen gebruiken:

```dontedit
const theFormCheckers = {
  voornaam:   checkBoth( hasMaxLength(20) ,hasMinimumLength(3) ),
  achternaam: checkBoth( hasMaxLength(20) ,hasMinimumLength(3) ),  
  postcode:   isaPostCode,   
  huisnummer: isRequired
};
```

:point_right: **Voor de bonus:** Weet je al wat 'rest-parameters' zijn in es6? Kun je die gebruiken om van `checkBoth(checker1,checker2)` een versie te maken die willekeurig veel checkers als parameter kan combineren? Je zou deze nieuwe versie `checkAll(...checkers)` kunnen noemen.

### Stap 5: Nog een hogere-orde checker

We zijn lekker bezig. Hogere-orde lekker. Maar er is een onhandigheid met de `isaPostCode` checker: De checker eist dat het veld een waarde heeft. Dus `isaPostCode` maakt het veld ook `Required`.

Een oplossingsrichting zou kunnen zijn om een checker-factory te maken die `Optional` heet, en een andere checker als parameter krijgt. `Optional` levert een nieuwe checker op, die `true` oplevert als _ofwel_ het veld leeg is, _ofwel_ de megegeven checker `true` oplevert.

:point_right: Maak de `Optional(checker)` checker-factory.

We zouden 'm als volgt moeten kunnen gebruiken:
```dontedit
const theFormCheckers = {
  voornaam:   Optional( checkBoth(hasMaxLength(20),hasMinimumLength(3)) ),
  achternaam: checkBoth( hasMaxLength(20) ,hasMinimumLength(3) ),  
  postcode:   Optional(isaPostCode),   
  huisnummer: isRequired
};

## Stap 6: Foutmeldingen
