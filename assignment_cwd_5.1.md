# Workshop Client-side Routing

Om het gebruiken van client-side routing te oefenen in een praktische context, gaan we een bestaande React appplicatie voorzien van [React Router](https://reacttraining.com/react-router/). Met de bestaande applicatie kun je vertragingen op treintrajecten bijhouden; niet echt heel nuttig om met de hand te doen, maar we hebben iets om van client-side routing te voorzien 😉. Je hoeft dus niet helemaal vanaf scratch te beginnen en kunt je focussen op het toevoegen van de React Router code.

![RRT-app](https://i.imgur.com/RHarMRV.png)

In de `SWD` repo in de folder `unit05 - Advanced React/session5.1/workshop` kun je de code van de applicatie vinden.

## Stap 1: De voorbeeld applicatie

👉🏻 Begin met het bekijken van de voorbeeld applicatie door eerst de volgende commando's uit te voeren in de root folder van het project:

```sh
npm install
npm start
```

Je kunt nu in je browser naar `http://localhost:3000/` gaan en de applicatie gebruiken. Zoals je merkt kun je op verschillende onderdelen al wel klikken, maar levert het nog niet het gewenste resultaat op. Dat is wat we in deze opdracht gaan aanpassen.

In de sourcecode zijn er twee folders die even belangrijk zijn om te bekijken:

1. `/src/api/` -- in deze folder staan twee bestanden die gebruikt worden om authenticatie en data te simuleren. Omdat we geen complete backend server willen gebruiken in deze workshop worden deze onderdelen door de client-side code _ge'faked_. [Uiteraard zul je in een _echte_ applicatie niet dit soort code gebruiken en gebruik maken van een volwassen authenticatie-systeem en REST voor de communicatie met de backend.]{aside}

   Je kunt inloggen door voor de gebruikersnaam en wachtwoord dezelfde waarde op te geven, en vanuit programmacode kun je bepalen of er ingelogd is door de waarde van `isLoggedIn` te lezen.

   In het bestand `DataAPI.js` kun je in het commentaar lezen wat de datastructuur is die gebruikt wordt om alle vertragingen bij te houden; een hele rechttoe-rechtaan array met daarin objecten. Verder een aantal functies om alle vertragingen op te vragen, alle vertragingen op een bepaalde datum of locatie. Helemaal onderaan in het bestand wordt wat test-data aan de applicatie toegevoegd; je kunt de structuur hiervan bekijken in je _console window_ van de browser door de laatste regel uit te commentariëren.

   {{note

   Je zult zelf geen aanpassingen hoeven te maken in de code uit de `src/api/` folder.

   note}}

1. `/src/components` -- in deze folder vind je de daadwerkelijke React code voor de applicatie. Het grootste gedeelte zijn simpele _stateless functional components_ zoals `Home.js`, `About.js` en `Delays.js`. De iets complexere onderdelen zijn geschreven als _stateful class components_ zoals `AddDelay.js` en `Login.js`.

## Stap 2: Hoe nu van pagina's gewisseld wordt

In het bestand `App.js` en `NavBar.js` kun je zien hoe er nu van pagina gewisseld wordt in de applicatie. In de class `App` wordt in `state.currentPage` de waarde bijgehouden van de actieve pagina. De functie `renderCurrentPage` bevat een groot `switch` statement om, afhankelijk van deze waarde, het juiste React component terug te geven. Deze functie wordt aangeroepen in de `render()` functie van `App`. Het `NavBar` component is uiteindelijk verantwoordelijk voor het tonen van de navigatie hyperlinks. Als er op een hyperlink geklikt wordt zal de waarde van `state.currentPage` in `App` aangepast worden door middel van `this.setState(...)`. Als de waarde van `state` verandert zal React een re-render van `App` veroorzaken en wordt de nieuwe (actieve) pagina getoond.

{{exLong "Vraag:" "ReactTutorial-vraag-2"

`State` wordt als privé data van een component beschouwd. Hoe kan het dan toch dat het `NavBar` component de state van het `App` component kan aanpassen?

exLong}}

### _Deep linking_ en client-side routing

De huidige oplossing bevat nogal wat nadelen. Zo wordt het een onderhouds-nachtmerrie om alle pagina's en sub-pagina's bij te houden in `App`, kunnen we geen _deep linking_ toepassen en is onze applicatie niet echt geschikt voor _search engine optimization (SEO)_.
Voor ons als programmeurs is nu _deep linking_ even het meest interressante probleem om te bekijken. Hiermee wordt bedoeld dat een gebruiker een hyperlink naar diep in je applicatie kan maken. Als je in de huidige applicatie alle vertragingen van vrijdag 21 september 2018 zou willen weeregeven, moet je eerst naar de homepage van de applicatie gaan, vervolgens op **Delays** klikken, en dan op **Fri 21 Sep 2018** klikken om alle vertragingen voor die dag te zien. De URL van de applicatie is dan nog steeds `http://localhost:3000/` waardoor het niet echt handig is om als bookmark te markeren of om als link naar je ouders te versturen. Het zou mooier zijn om alle vertragingen van die dag als `http://localhost:3000/date/2018-09-21` te kunnen benaderen.

## Stap 3: React Router toevoegen

Voordat we client-side routing kunnen gebruiken moeten we eerst React Router aan ons project toevoegen. [React Router is _geen_ onderdeel van React, maar een aparte library om client-side routing aan je React applicatie toe te voegen. Er zijn ook andere libraries die dit doen; bijvoorbeeld: [Junctions](https://junctions.js.org).
React Router is wel de meest populaire en complete library; en daarom gebruiken we deze.]{aside}

👉🏻 Voeg React Router toe aan je project door het volgende commando te geven:

```sh
npm install react-router-dom
```

_Dit zorgt ervoor dat in je `package.json` bestand onder `dependencies` een regel zoals `"react-router-dom": "^4.3.1"` wordt opgenomen, en het React Router package naar de folder `node_modules` wordt gedownload._

👉🏻 Nu kunnen we de volgende regel toevoegen aan `App.js`:

```jsx
import { BrowserRouter as Router } from "react-router-dom";
```

Nu kunnen we het React Router component gebruiken in ons programma met de naam `Router`.

👉🏻 Voeg het geïmporteerde `<Router>` component toe als top-level component van de applicatie. Dit zorgt ervoor dat alle andere React componenten in de applicatie (dus ook onze eigen componenten) gebruik kunnen maken van de client-side routing diensten van React Router.

```jsx
render() {
  return (
    <Router>
      <div className="app">
        <NavBar onPageChange={this.handlePageChange} />

        {this.renderCurrentPage()}
      </div>
    </Router>
  );
}
```

Als je de applicatie nu (opnieuw) start moet uiteraard alles nog steeds werken.

{{note

Het lijkt er nu op dat er niks aan de applicatie is veranderd. Dat klopt ook wel, want we hebben wel React Router toegevoegd, maar nog geen gebruik gemaakt van client-side routing. Dat doen we in de volgende stap.

note}}

## Stap 4: Toevoegen van een Route

We kunnen nu al onze eigen code voor het bijhouden en tonen van de huidige pagina (die we opslaan in `state.currentPage`) gaan verwijderen en React Router deze functionaliteit laten overnemen.

👉🏻 Verwijder in `App.js` alle volgende code waarin we de huidige pagina bijhouden en tonen.

```jsx
state = { currentPage: "home" };

handlePageChange = newPage => {
  this.setState({ currentPage: newPage });
};

renderCurrentPage = () => {
  let result;

  switch (this.state.currentPage) {
    case "home":
      result = <Home />;
      break;
    ...
    default:
      result = <NotFound />;
      break;
  }

  return result;
};
```

👉🏻 Uiteraard moeten we ook de `render()` functie aanpassen zodat deze geen gebruik meer maakt van de zojuist verwijderde code.

```jsx
render() {
  return (
    <div className="app">
      <NavBar />
    </div>
  );
}
```

👉🏻 Als laatste moeten we in `NavBar.js` de code verwijderen die te maken heeft met het afvangen van clicks.

```jsx
handleClick = event => {
  event.preventDefault();
  this.props.onPageChange(event.target.name);
};
```

En alle hyperlinks aanpassen zodat ze geen gebruik meer maken van `name` en `onClick(...)`.

```jsx
<a name="home" onClick={this.handleClick}>
  Home
</a>

// de regels hierboven worden vervangen door

<a>Home</a>
```

👉🏻 Importeer nu het `<Route>` component van React Router zodat we deze kunnen gaan gebruiken. Voeg hiervoor de volgende regel code toe:

```jsx
import { Route } from "react-router-dom";
```

Uiteraard kun je deze regel ook combineren met de bestaande import. Dan krijg je het volgende:

```jsx
import { BrowserRouter as Router, Route } from "react-router-dom";
```

👉🏻 Het laatste wat we nu nog moeten doen is het toevoegen van routes zodat een bepaald component verbonden wordt met een URL pad. Voor de `Home` en `About` componenten krijgen we dan de volgende code:

```jsx
render() {
  return (
    <Router>
      <div className="app">
        <NavBar />

        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
      </div>
    </Router>
  );
}
```

👉🏻 Voeg nu zelf de routes toe voor de componeten `Delays`, `AddDelay`, `Login` en `Logout`. Gebruik hiervoor respectievelijk de URL paden `/delays`, `/adddelay`, `/login` en `/logout`.

{{note

Voor nu maken we nog even geen gebruik van het `NotFound` component. Die komt in een volgende stap aan bod.

note}}

👉🏻 Ondanks dat onze hyperlinks in de navigatie balk nog niet zijn aangepast kunnen we al wel gebruik maken van de client-side routing door de URL in de browser te veranderen naar `localhost:3000/about` of `localhost:3000/login`. Je moet misschien even naar beneden scrollen om te zien dat nu zowel de Home pagina als de About pagina getoond worden.

{{note

In React Router zijn `<Route>`'s gewone componenten die de waarde van `component` tonen zodra de waarde van `path` overeenkomt met de URL in de browser. Je zult wellicht al gemerkt hebben dat de waarde van `path` alleen maar _aan het begin_ van de URL hoeft overeen te komen om de `<Route>` te activeren. Dus als de URL in de browser `localhost:3000/about` is, komt deze overeen met pad `/` en met pad `/about`; vandaar dat beide componenten getoond worden.

note}}

{{exShort "Vraag:" "ReactTutorial-vraag-4-1"

Welk(e) component(en) wordt getoond als je de URL `localhost:3000/foo` gebruikt?

exShort}}

{{exShort "Vraag:" "ReactTutorial-vraag-4-2"

Welk(e) component(en) wordt getoond als je de URL `localhost:3000/about/contact` gebruikt?

exShort}}

## Stap 5: Exacte routering

In de vorige stap hebben we gemerkt dat `Route`'s standaard een gedeelte van de browser URL matchen. Dit is niet altijd gewenst zoals bij de `Home` pagina.

👉🏻 Verander in `App.js` in de `render()` functie de route naar de `Home` pagina naar de volgende regel code:

```jsx
<Route exact={true} path="/" component={Home} />
```

{{note

Je mag in React (JSX) code de waarde `{true}` bij de _property_ weglaten. Alleen de naam van de prop is voldoende om aan te geven dat deze prop aanwezig is met de waarde `true`. Je kunt de code dus ook iets compacter schrijven als:

```jsx
<Route exact path="/" component={Home} />
```

Indien je de waarde `false` wilt meegeven moet je wel de gehele expressie uitschrijven als `exact={false}`.

note}}

👉🏻 Verander in de browser nu de URL naar bijvoorbeeld `localhost:3000/about` of `localhost:3000/delays`. Als het goed is wordt de `Home` pagina nu niet meer getoond.

{{note

Voor de overige routes hoeven we niet `exact={true}` toe te voegen. De reden hiervoor is dat de `path` waarden van deze routes elkaar niet overlappen. Er is geen overlap tussen bijvoorbeeld `/about`, `/delays` en `/login`.

note}}

## Stap 6: De juiste navigatie links gebruiken

Nu de routering vanaf de browser URL werkt kunnen we code toevoegen om de hyperlinks in de navigatie balk op de juiste manier te laten werken. Want telkens de URL met de hand aanpassen is ook niet wat we de gebruiker willen aandoen.
Standaard hyperlinks (`<a>...</a>`) worden door de browser afgevangen... en dat willen we eigenlijk niet. React Router heeft een eigen variant voor hyperlinks en dat is het `<Link>` component.

👉🏻 Zorg eerst dat we in NavBar.js het `<Link>` component kunnen gebruiken door het te importeren. Voeg de volgende regel code toe:

```jsx
import { Link } from "react-router-dom";
```

👉🏻 Verander nu in de `render()` functie de code zodat er geen gebruik meer gemaakt wordt van `<a>...</a>` maar van `<Link>...</Link>`.

```jsx
<a>Home</a>
<a>About</a>

// de regels hierboven worden vervangen door

<Link to="/">Home</Link>
<Link to="/about">About</Link>
```

👉🏻 Verander dit ook voor de overige hyperlinks in `NavBar`.

{{note

Zoals je hebt gezien in de code hierboven wordt door het `<Link>` component de property `to={...}` gebruikt om aan te geven waar naartoe genavigeerd moet worden. Er wordt bewust geen gebruik gemaakt van `href="..."` om verwarring met externe hyperlinks te voorkomen. Probeer maar eens de `to` property van `About` te veranderen naar `http://www.han.nl`, en vervolgens op deze hyperlink in de browser te klikken.

Onder water gebruikt React Router gewone `<a>` hyperlinks om in de browser weer te geven. Maar aan elke hyperlink wordt een `onClick()` handler toegevoegd die het afhandelen van de klik door de browser voorkomt. Vervolgens past React Router zelf de URL in de browser aan en worden alle `<Route>` componenten die we in de applicatie gebruiken opnieuw uitgevoerd. Mocht een `<Route>` nu wel matchen met de nieuwe URL, dan wordt het bijbehorende component weergegeven.

note}}

## Stap 7: Actieve links anders weergeven

Momenteel wordt de huidige route wel weergegeven in de URL balk van de browser, maar nog niet in het navigatie menu in de applicatie. Dit komt omdat `<Link>` componenten alleen de URL aanpassen en eventuele `<Route>` componenten... maar niet de hyperlinks zelf. Om dit te bereiken moet je gebruik naken van het `<NavLink>` component van React Router.

👉🏻 Vervang overal in het bestand `NavBar.js` het gebruik van `<Link>...</Link>` naar `<NavLink>...</NavLink>`. Uiteraard moet je ook het `import` statement aanpassen.

Nu zal elke link waarvan het pad (gedeeltelijk) overeenkomt met de browser URL de extra CSS classname `active` krijgen. Je kunt dit zelf bekijken door in de browser mbv Developer Tools de html elementen te inspecteren.

👉🏻 Omdat we nog niks in het `index.css` bestand hebben aangepast zul je ook nog geen effect van de `<NavLink>` zien. Voeg daarom de volgende code toe in `index.css`:

```css
a.active,
a.active:hover {
  color: mediumblue;
  font-weight: bold;
  text-transform: uppercase;
}
```

{{note

Standaard gebruikt het `NavLink` component de CSS classname `active` waardoor we er op die manier in de CSS naar verwijzen. Aangezien het hier om een classname gaat gebruiken we in de CSS code `.active`. Dit is iets anders dan de `:active` pseudo-class voor hyperlinks (zie [hier](https://developer.mozilla.org/en-US/docs/Web/CSS/:active))

Met de `activeClassName` property van `<NavLink>` kun je zelf een andere naam voor de CSS classname opgeven. Bijvoorbeeld:

```jsx
<NavLink activeClassName="your-style-name">Click here</NavLink>
```

en in je CSS bestand

```css
.your-style-name {
  text-transform: uppercase;
  font-weight: bold;
}
```

note}}

{{exShort "Vraag:" "ReactTutorial-vraag-7"

Momenteel kan het in de applicatie voorkomen dat er twee hyperlinks als actief worden gemarkeerd; bijvoorbeeld als je naar de **Delays** pagina navigeert.

Waarom is dit zo? En hoe lossen we dit op?

Tip: in stap 5 zijn we een soortgelijk probleem tegengekomen.

exShort}}

## Stap 8: Inclusieve en exclusieve routes

Standaard wordt elke `<Route>` die overeenkomt met de URL geactiveerd (render); dit noemen ze _inclusive_ routing. Soms wil je echter _exclusive_ routing: slechts één `<Route>` wordt geactiveerd, en alle overige `<Route>`'s worden uitgesloten.
Dit komt heel handig van pas als je een `<Route>` hebt die geactiveerd moet worden, _als_ alle andere `<Route>`'s niet overeenkomen. Eigenlijk hetzelfde gedrag als een `default` in een `switch` statement, of de laatste `else` in een `if ... else if ... else` statement.

Exclusieve routes voegen we toe door gebruik te maken van het `<Switch>` component van React Router. Dit zorgt ervoor dat slechts één `<Route>` geactiveerd wordt; zodra de eerste `<Route>` waarvan het `path` overeenkomt met de URL gevonden is, wordt de rest van de `<Route>` componenten niet meer gecontroleerd.

Een goed voorbeeld hiervan is een `404` of `Page not Found` component, welke natuurlijk alleen getoond moet worden als geen enkele route - die daarvoor geprobeerd is - overeenkomt.

👉🏻 Voeg in `App.js` een import toe van het `<Switch>` component uit `react-router-dom`:

👉🏻 Voeg nu het `<Switch>` component rondom alle bestaande routes:

```jsx
<Router>
  <div className="app">
    <NavBar />

    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/account" component={Account} />
      <Route path="/login" component={Login} />
    </Switch>
  </div>
</Router>
);
```

👉🏻 In de allereerste code hadden we al een `<NotFound>` component (uit het bestand `NotFound.js`) die getoond wordt als de URL een pad bevatte dat niet overeen kwam met onze routes. Voeg deze toe als `<Route>` binnen het `<Switch>` blok.

{{exShort "Vraag:" "ReactTutorial-vraag-8-1"

Wat is de waarde van `path` voor deze nieuwe `<Route component={NotFound} />`?

Zoek het eventueel op in de [officiële documentatie](https://reacttraining.com/react-router/web/api/Route) van React Router.

exShort}}

{{exShort "Vraag:" "ReactTutorial-vraag-8-1"

Op welke plek binnen het `<Switch>` blok moet deze nieuwe `<Route component={NotFound} />` toegevoegd worden?

exShort}}

👉🏻 Verander in de browser nu de URL naar bijvoorbeeld `localhost:3000/foo` of `localhost:3000/about/contact`. Controleer dat nu het `<NotFound>` component getoond wordt.

<!--

## Stap 9: Nested routes

## Stap 10: URL parameters

## Stap 12: Adding redirects using `<Redirect>`

## Stap 13: Prevent page transitions using `<Prompt>`

## Stap 11: Conditional routing (authentication)

## Stap 14: Een Node.js server gebruiken

-->
