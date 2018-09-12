# Classes met vliegende schotels

Om het werken met classes te oefenen gaan we een spelletje maken op basis
van het Sprite-voorbeeld (de ufo's) dat we aan het boek hebben toegevoegd.


In de repo vind je een html-file die een `<div>` en een `<button>` maakt. 
Klikken op de button start het spel, dat plaats zal vinden in de div. De file gebruikt twee JS-bestanden:
1. `SpriteEngine.js` -- Dit is een library die gebaseerd is op de classes uit
   het boek, maar wat netter en krachtiger is. Er is nu ook een Sprite-subklasse
   die kan helpen met botsingen tussen sprites detecteren.
1. `ufoGame.js` -- een applicatie-specifieke file om, op basis van de SpriteEngine,
    een spel te maken waarin Ufo's een rol spelen. [Deze files maken nog geen gebruik van een volwassen module-systeem. Moderne JS code zou niet meer op deze manier met modules werken, en in latere weken gaan wij dat ook niet meer doen in de cursus.]{aside}

## Stap 0: De start-code bekijken.

:one: Begin met het bekijken van de opzet vande HTML file. Die is vrij overzichtelijk. 

:two: Open `ufoGame.js`. De volgende dingen zijn de moeite van het bestuderen
waard:
* De code bevat een class die Ufo heet. Deze class bestond niet in de versie in
  het boek, maar is nu even handig omdat we dit keer alle ufo's een ander
  kleurtje willen geven. Daarnaast kun je nu, als dat handig is, checken of een
  sprite van het type "Ufo" is.
* En er is code om het spel op te starten. Er worden Ufo's gemaakt, en de
  start-knop krijgt een event-handler om het spel te starten.
* In `/* */`-commentaar zie je alvast drie regels die gaan over classes die
  _jij_ gaat maken: Een Bullit-klasse voor kogeltjes (dat is stap 3), en een
  player-klasse om een raket te kunnen besturen die kogels afschiet op de ufo's
  (stap 1).
* Er wordt ook een event-handler geïnstalleerd die naar het toetsenbord luistert.
  Nu doet-ie nog niet zoveel. Ook dat is code die er staat om het makkelijk te maken 
  daar zelf straks echte dingen te laten gebeuren.
* Op de één-na-laaste programmaregel zie je de aanroep `Sprite.startEngine()`.
  Dat is een aanroep van een statische methode, vandaar dat er een klassenaam
  voor de punt staat.

{{exLong "constructor-parameters" "Ufo-game-vraag-1"

De constructor van de `Ufo` class heeft één parameter minder dan die van de
Sprite-class. Waarom is dat geen probleem?

exLong}}

:three: Bestudeer de code van de file `SpriteEngine.js`. De code definieert drie
classes: `Sprite`, `CollidingSprite` en `BouncingSprite`.
1. `Sprite` is wat uitgebreider dan de versie in het boek. Maar de enige
   uitbreiding die wat ingewikkeld is, is dat deze klasse nu zelf bijhoudt welke
   Sprites er aangemaakt worden, zodat het al die instanties ook zelf kan
   animeren (door periodiek hun `update()` methode aan te roepen).
2. Lees de commentaren nauwkeurig.
3. De klasse BouncingSprite is bevat niets nieuws. 
4. De klasse CollidingSprite _wel_. Bekijk ook daar de code en de commentaren
   nauwkeurig.


{{exShort "Vraag:" "Ufo-game-vraag-2"

Geef de regelnummers van alle regels van de klasse Sprite die _iets doen_ (maken,
gebruiken) met **statische functies**.

exShort}}

{{exShort "Vraag:" "Ufo-game-vraag-3"
Er is ook een statisch variabele. Die wordt nogal anders aangemaakt dan de statische functies.

Geef de regelnummers van alle regels van de klasse Sprite die _iets doen_ (maken,
gebruiken) met de **statische variabele**.

exShort}}

## Stap 1: Maak een Player-klasse

Voor de speler hebben we maar één sprite nodig, maar daarvoor maken we wel eerst
een klasse. De speler heeft namelijk eigen gedrag die andere Sprites niet
hebben:
1. De speler bevindt zich **onderin het game-scherm**,
1. en beweegt **alleen naar links of naar rechts**.
1. Als de speler voor het eerst in beeld komt, staat-ie **stil, ergens
   links-onderin** (b.v. 60px van de kant).
1. De constructor heeft geen parameters nodig. Afbeelding, startlokatie, en
   snelheid liggen vast.  
1. Als de gebruiker een **pijltjestoets (links/rechts) indrukt**, dan gaat de
   speler bewegen in de richting van de toets.
1. Maar de speler **stopt _niet_ met bewegen** als de gebruiker de toets weer
   loslaat. Hij blijft bewegen.
1. Als de speler **tegen de linker- of rechterkant aankomt**, dan stopt-ie _wel_
   met bewegen. Hij gaat niet door, en stuitert ook niet terug. Hij blijft dan
   stilstaan.
1. De speler is niet **geïnteresseerd in botsingen**. Ufo's vliegen dwars door
   'm heen.  

:point_right: Maak deze klasse, en noem de klasse `Player`.
* Keyboard-interface maken we in de volgende stap. De klasse zelf _luistert
  niet_ naar keyboard-events. Het enige wat-ie moet doen is twee methodes
  aanbieden:
  * `moveLeft()` zet de x-snelheid op -3. (y-snelheid blijft 0).
  * `moveRight()` zet de x-snelheid op +3. _That's it_.
* Van welke klasse laat je Player erven? `Sprite`? `CollidingSprite`? of
  `BouncingSprite`?
* Er is al een globale constante `rocketImageUrl` die je kan gebruiken voor de
  afbeelding.
* Twee regels die in `/* */`-commentaar staan kunnen nu geactiveerd worden: de
  regel die een globale `player` variabele declareert, en de regel die die
  variabele vult met een nieuwe instantie van de `Player` class. Verwijder de
  commentaar-markers eromheen.
* Zorg ervoor dat de klasse voldoet aan de eisen hierboven (behalve keyboardreactie).

## Stap 2: reageren op toetsenbord.

In de code heb je al een event-handler gezien die naar het toetsenbord luistert.
Nu bevat deze event-handler alleen het begin van een reactie op de spatiebalk.
Gebruik dat als voorbeeld.

:point_right: Breid de event-handler voor het toetsenbord uit dat-ie ook kijkt
naar pijltje-naar-links (code: "ArrowLeft") en pijltje-naar-rechts (code:
"ArrowRight"). De event-handler hoeft (bijna) alleen maar de `moveLeft()` of
`moveRight()` methodes op de player aan te roepen.

:point_right: Test je code. Als het goed is moet je player nu reageren op de
pijltjestoetsen, naar links of rechts schuiven, en stil blijven staan bij de
rand.

## Stap 3: kogels

We maken eerst de kogels, an pas later "koppelen" we die aan de player.

Een kogel is een soort Sprite die botsingen kan detecteren.
1. Kogels gaan **van beneden naar boven**. 8 is een mooie y-speed.
1. Kogels **checken of ze botsen met Ufo's**. Niet met de speler. Ufo's hoeven niet
   te checken of zij botsen met kogels. 
1. Als een kogel een botsing met een ufo detecteert, **verwijdert hij zowel de
   ufo, als zichzelf uit het spel**. Meer hoeft-ie niet te doen.
1. Een kogel houdt ook in de gaten of-ie het **scherm (aan de bovenkant)
   uitvliegt**. Als dat gebeurt, verwijdert hij zichzelf uit het spel.
1. Een kogel is nogal simpel in het bepalen van wanneer hij tegen een andere
   sprite botst: **als z'n eigen _x_ en _y_ in de rechthoek van de andere sprite
   vallen**, dan telt dat als botsing.

:point_right: Maak de klasse `Bullit`.
* Je kunt 'm testen door bij het starten van de game, gewoon meteen al een
  bullit aan te maken, en te kijken of die zich goed gedraagt bij botsingen of
  bij scherm uitvliegen.
* Kies een geschikte super-klasse.
* De constructor heeft alleen maar een lokatie nodig (x,y). Afbeelding en
  snelheid liggen al vast.
* Er is al een globale constante `bullitImageUrl` die je voor de afbeelding kunt
  gebruiken.
* Welke methode moet je overriden om code in te stoppen die checkt of je bullit
  een andere sprite raakt?
* Deze code kun je gebruiken voor die check: 
  ```dontedit
    return (
      this.x >= otherSprite.x &&
      this.x <= otherSprite.x + otherSprite.width &&
      this.y >= otherSprite.y &&
      this.y <= otherSprite.y + otherSprite.height
    );
  ```
* Welke methode moet je overriden om de code te bevatten die reageert op een
  botsing? Gebruik de `remove()`-methode (in de Sprite-klasse) om sprites uit
  het spel te halen.
* De `update()` methode kun je overriden om te checken of je bullit het scherm is
  uitgevlogen. Zorg er wel voor dat je `super.update()` aanroept.

## Stap 4: kogels afvuren als de gebruiker op de spatiebalk drukt.

Laten we eerst kogels vanaf een vaste positie afvuren. 

:point_right: De event-handler voor het toetsenbord heeft bijnal alle bodige
code al aanboord. Je moet alleen de `/* */`-commentaar markers verwijderen, en
parameterwaarden kiezen.

:point_right: Test je programma. Je zou nu kogels moeten zien verschijnen als je
op de spatie-balk drukt. Ondertussen moet je player-object natuurlijk wel nog
steeds correct werken.

## Stap 5: kogels afvuren vanaf de player.

Net als de vorige stap, stelt deze weinig voor.

:point_right: Zorg ervoor dat de positie van nieuwe kogels zó gekozen wordt dat
het lijkt als-of ze uit de punt van de player-raket komen.

Er is dus geen echte koppeling tussen de kogels en de player. Dat is niet nodig,
en niet handig.

**--DONE--**  
Gefeliciteerd met je browser-game!

## Stap 6: Stuur je uitwerking in.

:point_right: Commit je code voor alle opdrachten in dit document naar je persoonlijke DWA repo.

{{exCommit "Stuur je commit in" "Ufo-game-vraag-4"


exCommit}}
