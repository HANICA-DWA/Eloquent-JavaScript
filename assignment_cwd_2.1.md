# form-validation met hogere orde functies

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
  * Aan het formulier wordt een event handler (a.k.a. event listener) gekoppeld die afgaat als de gebruiker op de submit-knop drukt (of op de enter-toets).
  * De tweede parameter voor `addEventListener` _moet_ een functie-waarde zijn. Maar nu staat er een functie**_aanroep_**. Dat betekent dat de return-waarde van `makeFormValidator()` zelf een functie-waarde moet zijn. `makeFormValidator` zou je dus een 'function factory' kunnen noemen: een functie die functies maakt.
  * De form-validator wordt geconfigureerd met 'checker'-functies. (Dat is een term die is uitgevonden voor deze library; niet een algemene Javascript term.) Je ziet dat de configuratie een _object dat functies bevat_ is.
  * Hoewel de formValidator library zelf een checker-functie definieert, definieert `main.js` er ook eentje. De formValidator library is dus **uitbreidbaar**, en de checker-functies zijn een soort plug-ins.

De basis-werking van de formvalidator is simpel: Als de gebruiker het formulier submit, dan checkt-ie van alle formuliervelden of er een checker voor meegegeven is, en als dat zo is, of die checker `true` oplevert voor de huidige waarde van het invoerveld. Als _alle_ velden `true` opleveren, dan is het formulier OK, en wordt de 'succes'-functie aangeroepen (in dit voorbeeld zal dat `handleFormSubmit` in `main.js` zijn).

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
* De `validator` functie gebruikt een hogere-orde functie om te controleren dat alle velden goed door de checkerFunctions heenkomen. Die functie heet `every`, en is net als `map`, `filter` en `forEach` een methode van arrays in JavaScript.
* Als er een veld is dat niet OK door de checker heenkomt, dan geeft deze functie een stomme `alert()` weer. Dat zullen we moeten verbeteren :-).

{{exLong "Opzoek-vraag" "FormValidator-vraag-3"

Zoek, op internet, op wat de `every` methode doet voor JS arrays, en beschrijf dat kort hieronder.
* Als je het graag concreet houdt, is het OK als je beschrijft wat `every` in deze code doet -- de code van de `validator` functie.
* Geef in je antwoord je bron aan. Maak daar een Markdown hyperlink van.

exLong}}

## Stap 2: Nog een checker maken

Laten we afspreken dat zowel de voornaam als de achternaam:
1. niet langer dan 20 karakters mogen zijn (om te voorkomen dat de naam niet meer op het vliegticket past b.v.), en
2. niet korter dan 3 karakters mogen zijn.

:point_right: Schrijf, in de file `main.js`, een checker-functie voor de naam-lengte (min 3; max 20). Checker-functies krijgen één parameter (de waarde die gechecked moet worden), en leveren een boolean (true/false) op om aan te geven of de waarde valide is. [Deze opdracht maak je in je lokale kopie van de je persoonlijke CWD repo. Straks, als je alle opdrachten hebt gedaan, lever je je hele werk in één keer in door te committen naar je persoonlijke Github, en de commit-URL via deze pagina in te leveren.]{aside}


:point_right: pas `theFormCheckers` in de functie `initializeApp` aan, zodat de nieuwe checker gebruikt wordt voor de voornaam en de achternaam invoervelden.

:point_right: controleer dat je code werkt.

## Stap 3: Flexibelere lengte checker.

De requirement dat namen maximaal 20 karaters hebben, en minimaal 3, zou specifiek kunnen zijn aan deze app. Maar een algemeen bruikbare lengte-checker is wellicht iets wat deel kan uitmaken van de library i.p.v. de app. Dan moeten minimum en maximum wel flexibel in te stellen zijn.

Begin even met een checker die alleen maar de _maximum_-lengte controleert. Checker-functies worden, door de formValidation library, aangeroepen met één parameter (de te controleren invoerwaarde). Om toch flexibel te zijn qua max-lengte, maak je een 'function factory':

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

:point_right: Maak nu ook een functie `hasMinimumLength(min)`, die op dezelfde manier werkt. **Voeg deze functionaliteit _NIET_ toe aan `hasMaxLength`**. (Dat zou best kunnen, maar zometeen gaan we een hogere-orde checker maken die twee checkers kan combineren.)

## Stap 4: Hogere-orde checkers

Als een hogere-orde _functie_ een functie is die functies als waardes gebruikt, dan is een _hogere-orde checker_ een checker die andere checkers als inputs gebruikt.

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

Een oplossingsrichting zou kunnen zijn om een checker-factory te maken die `optional` heet, en een andere checker als parameter krijgt. `optional` levert een nieuwe checker op, die `true` oplevert als _ofwel_ het veld leeg is, _ofwel_ de meegegeven checker `true` oplevert.

:point_right: Maak de `optional(checker)` checker-factory.

We zouden 'm als volgt moeten kunnen gebruiken:

```dontedit
const theFormCheckers = {
  voornaam:   optional( checkBoth(hasMaxLength(20),hasMinimumLength(3)) ),
  achternaam: checkBoth( hasMaxLength(20) ,hasMinimumLength(3) ),  
  postcode:   optional( isaPostCode ),   
  huisnummer: isRequired
};
```
## Stap 6: Foutmeldingen

Tot nu toe zijn we nog niet goed in het geven van gebruikelijke foutmeldingen, als validatie mislukt. Laten we er voor zorgen dat de library prima foutmeldingen kan tonen.

Laten we het als volgt aanpakken:
1. Een checker kan, in plaats van `false`, ook een string met een foutmelding terugkeren. **Maar dat hoeft niet:** een checker kan nog steeds gewoon 'false' opleveren als de check faalt.
1. De functies die resultaten van checkers verwerken moeten nu rekening houden met strings als resultaat. Dat is niet alleen de `validator`-functie in `formValidation.js`, maar ook `checkBoth` en `optional`.
1. De `validator`-functie zal de de error-strings van de checkerFunctions verzamelen in een lijst. Voor checkers die alleen `false` opleveren, gebruiken we (later) de suffe tekst "Dit veld is niet correct ingevuld".
1. De `validator`-functie zal alle berichten overdragen aan een errorReporter functie, die de berichten in beeld zal brengen.
1. Die errorReporter wordt, net als de submitHandler, door de applicatie meegeleverd aan de library. (Verschillende apps zullen foutmeldingen wellicht vershillend willen weergeven.)

Hier is alvast wat code die je kunt copy-pasten naar je project:

```dontedit
// A checker function that simply checks if there is any input in the field.
function isRequired(value) {
  const result = value.trim() != "";
  return result || "Dit veld moet ingevuld worden";
}
```

{{exLong "OR-operatie met andere waarden dan booleans" "FormValidator-vraag-4"

Let op het gebruik, in bovenstaande code van de `||` operator. Dat de OR-operator, die normaal alleen op booleans werkt. Nu gebruiken we 'm met een string-waarde. In Javascript, en veel andere programmeertalen, kan dat, en is het zelfs zinnig.

Zoek uit en leg uit waarom deze regel:
```dontedit
return result || "Dit veld moet ingevuld worden";
```
de waarde `true` oplevert als `result` `true` is, en de string als `result` `false` is.

exLong}}

:point_right: Pas even je checkers-configuratie aan dat-ie nu alleen `isRequired` gebruikt. De andere checkers bekijken we straks.

```dontedit
const theFormCheckers = {
  achternaam: isRequired,  
  postcode:   isRequired,   
  huisnummer: isRequired
};
```

Nu zullen we de `validator`-functie moeten aanpassen. Het eerste wat we moeten aanpassen is het gebruik van de `every`-methode. Dat ding werkt echt alleen met functies die een boolean opleveren, en kan niet correct omgaan met de error-strings.

Wat we nu willen is niet een true/false waarde (zoals in allFieldsOK), maar een lijst met foutmeldingen. Daartoe gebruiken we `map()` en `filter()`.

**Opmerking:** de volgende paar stappen krijg je code van ons, om de opdracht niet te tijdrovend te maken. Doe het allemaal wel: straks komt er nog één klus waarbij je zelf code moet bedenken en testen.

:point_right: verwijder het volgende stuk code uit de `validator`-functie:
```dontedit
const allFieldsOK = fieldsArray.every(inputElement => {
  const checkerFunction = checkers[inputElement.name];
  // is there a check function defined for this field?
  if (checkerFunction == undefined) {
    return true;
  } else {
    const thisFieldOK = checkerFunction(inputElement.value);
    console.log(`Running checker-function on ${inputElement.name}:`, thisFieldOK);
    return thisFieldOK;
  }
});

if (allFieldsOK) {
} else {
  alert("Niet alle velden zijn correct ingevuld.");
}
```

Zet daarvoor de volgende code in de plaats:

```dontedit
const __tussenresultaat1__ = fieldsArray.filter(inputElement => {
  return checkerFunctions[inputElement.name] !== undefined;
});
const __tussenresultaat2__ = __tussenresultaat1__.map(inputElement => {
  const fieldName = inputElement.name
  const checker = checkerFunctions[inputElement.name];
  const checkResult = checker(inputElement.value)
  return [fieldName, checkResult];
});
const __resultaat3__ = __tussenresultaat2__.filter(([fName,result]) => result !== true);

if (__resultaat3__.length == 0) {
  submitHandler(); // Everything checked out OK, call success-callback.
} else {
  errorReporter( __resultaat3__ );
}

```

Lees bovenstaande code aandachtig. Let op een paar dingen:
1. Er wordt gewerkt met lijsten waarover `map` en `filter` wordt gebruikt. Meestal zijn de elementen in de lijsten zelf weer lijstjes van twee elementen: `[fname, result]`. Zo'n tweetal beschrijft steeds de naam van een invoerveld, en de bijbehorende checker waarde.
2. De aanroep van `filter` geeft een arrow-functie mee, die **één parameter** krijgt. Maar door de code `([fName,result]) => ...` wordt die _ene parameter_ meteen uitgesplitst ('destructured') in de twee componenten.
3. De variabelenamen __tussenresultaat1__, __tussenresultaat2__ en __resultaat3__ zijn natuurlijk vreselijk. Aan jullie te opdracht die te verbeteren.


{{exLong "Verbeter de variabelenamen" "FormValidator-vraag-5"

* Geef, hieronder, van iedere stomme variabele naam een betere naam.
* Geef ook van ieder van de variabelen een beschrijving van
  1. Wat er zoal voor waardes in kunnen zitten, en
  2. Wat die waardes _betekenen_ in het programma.

exLong}}

:point_right: Vervang, in jouw code, de vreselijke variabelenamen door jouw betere namen.

We moeten ook nog de error-reporter maken.

:point_right: Zorg ervoor dat de functie `makeFormValidator` in `formValidation.js` een 3e parameter krijgt die `errorReporter` heet.

:point_right: Maak, in `main.js`, de volgende functie aan:

```dontedit
function handleErrors(checkerFailures) {
  theErrorReport.hidden = false;
  const errorList = document.getElementById("error-messages");
  errorList.innerHTML = ""

  checkerFailures.map(([name, failure]) => {
    if (failure !== false) {
      return [name, failure];
    } else {
      return [name, "Dit veld is niet correct ingevuld"];
    }
  }).map(([name, message]) => {
    const messageHtml = `<b>${name}:</b> ` + message;
    return messageHtml;
  }).map(messageHtml => {
    const listItem = document.createElement("li");
    listItem.innerHTML = messageHtml;
    return listItem;
  }).forEach(item => {
    errorList.appendChild(item);
  });
}
```

Ook hier zie je weer een serie van aanroepen van `.map()`, gevolgd door een aanroep van `.forEach()`. Dit keer vormen ze een ketting: er worden geen tussen-variabelen gebruikt, maar iedere `.map()`/`.forEach()` werkt meteen op het resultaat van de vorige `.map()`. Dat kan, maar het maakt je code er niet leesbaarder op.

{{exLong "beschrijf tussenresutaten" "FormValidator-vraag-6"

Beschrijf, net als in de  vorige opdracht, de waardes en betekenis van de resultaten van:
* de eerste `map()` aanroep,
* de tweede `map()` aanroep,
* de derde `map()` aanroep, en
* de uiteindelijke effecten van de laatste `forEach()` aanroep.

exLong}}

:point_right: Het enige dat je nu nog moet fixen om al deze wijzigingen te testen is om de aanroep van `makeFormValidator()` een derde parameter te geven: De nieuwe functie `handleErrors()` wordt de errorReporter die de validator mag gebruiken om ervoor te zorgen dat fouten in beeld komen.

:point_right: Test de code.  
Je zou moeten zien dat als de `isRequired` checker nu error-text oplevert die ook daadwerkelijk in beeld komen.

:point_right: Gebruik nu nog één van de andere checker-functies in je form-validatie. Als _die_ falen zou je de algemene text "Dit veld is niet correct ingevuld" moeten zien verschijnen.

### Stap 7: Zelf error-messages kunnen specificeren voor een checker.

Laatste opdracht.

We zouden, als we daar zin in hebben, _alle_ checkers (stel je voor dat we er inmiddels vrij veel zouden hebben) kunnen voorzien van een standaard foutmelding, zoals we dat hierboven voor `isRequired` hebben gedaan. Dat zou veel werk zijn, en erger nog: Dat zouden vaak foutmeldingen zijn die algemener (en dus vager) zijn dan wat de gebruiker makkelijk snapt.

Handiger is het om de programmeur die onze form-validator gebruikt de gelegenheid te geven _zelf_ aan te geven wat de foutmelding moet zijn als een checker faalt. Daarvoor kunnen we weer een andere hogere-orde functie maken:

:point_right: Maak een functie `message(checker,string)`, die een nieuwe checker oplevert die `true` oplevert als de checker-parameter `true` oplevert, en de string-parameter oplevert als de checker-parameter `false` _of een string_ oplevert.

Je zou deze `message`-checker-factory als volgt kunnen gebruiken:
```dontedit
const theFormCheckers = {
  voornaam:   message(hasMaxLength(20),"Lange voornamen passen niet op het vliegticket"),
  achternaam: hasMaxLength(20),  
  postcode:   message(isaPostCode, "Dit moeten vier cijfers, en dan twee letters zijn"),  
  huisnummer: message(isRequired, "Wat jammer dat er geen huisnummer is :-(")
}
```

Dus met deze `message`-combinator [Een combinator is een functie die andere functies combineert tot nieuwe functies. Het is dus een specifiek soort hogere-orde functie: eentje die een functie als resultaat heeft. `.map()` en `.filter` etc. zijn geen combinatoren. De function-factories die jij gemaakt hebt zijn dat wel.]{aside} kunnen we _alle_ checkers voorzien van error-messages, ook al kunnen ze dat zelf niet!

### Stap 8: BONUS

Deze opdracht kun je overslaan als je wil. Als je er geen tijd/zin in hebt, ga dan naar stap 9 hieronder.  
Maar als je je validator wat meer af wil maken, is hier nog een leerzaam los eindje dat je kunt fixen:

Er zijn twee checker-combinatoren die niet goed meer werken nu checkers foutmeldingen in plaats van `false` kunnen opleveren als een validatie-check faalt. Dat zijn `checkBoth()` en `optional`. Die gaan er nu van uit dat je checkers alleen maar `true` of `false` opleveren.

:point_right: **Voor de bonus:** Pas `checkBoth` en `optional` aan zodat ze wel werken met checkers die zelf foutmeldingen op kunnen leveren.

Zoiets als dit zou moeten werken:
```dontedit
const theFormCheckers = {
  voornaam:  checkBoth(
                message(hasMaxLength(20),"Voornaam te lang"),
                message(hasMinimumLength(3), "Voornaam te kort")
             ),
  postcode:  optional(
                message(isaPostCode, "Dit is niet een goeie postcode")
             )
}
```

Stap 9: Stuur je uitwerking in.

:point_right: Commit je code voor alle opdrachten in dit document naar je persoonlijke DWA repo.

{{exCommit "Stuur je commit in" "FormValidator-vraag-7"


exCommit}}
