# Workshop Client-side Routing

Om het gebruiken van client-side routing te oefenen in een praktische context, gaan we een bestaande React applicatie voorzien van [React Router](https://reacttraining.com/react-router/). Met de bestaande applicatie kun je vertragingen op treintrajecten bijhouden; niet echt heel nuttig om met de hand te doen, maar we hebben iets om van client-side routing te voorzien 😉. Je hoeft dus niet helemaal vanaf scratch te beginnen en kunt je focussen op het toevoegen van de React Router code.

![RRT-app](https://i.imgur.com/RHarMRV.png)

In de `CWD` repo in de folder `unit05 - Advanced React/session5.1/workshop` kun je de code van de applicatie vinden.

![Screenshot of Public Transport Delay App](https://i.imgur.com/RHarMRV.png)

We gaan de applicatie in 12 stappen voorzien van React Router.

- [Stap 1: De voorbeeld applicatie](#stap-1-de-voorbeeld-applicatie)
- [Stap 2: Hoe nu van pagina's gewisseld wordt](#stap-2-hoe-nu-van-paginas-gewisseld-wordt)
- [Stap 3: React Router toevoegen](#stap-3-react-router-toevoegen)
- [Stap 4: Toevoegen van een Route](#stap-4-toevoegen-van-een-route)
- [Stap 5: Exacte routering](#stap-5-exacte-routering)
- [Stap 6: De juiste navigatie links gebruiken](#stap-6-de-juiste-navigatie-links-gebruiken)
- [Stap 7: Actieve links anders weergeven](#stap-7-actieve-links-anders-weergeven)
- [Stap 8: Inclusieve en exclusieve routes](#stap-8-inclusieve-en-exclusieve-routes)
- [Stap 9: Dynamische routering](#stap-9-dynamische-routering)
- [Stap 10: URL Parameters](#stap-10-url-parameters)
- [Stap 11: Navigeren naar een andere pagina](#stap-11-navigeren-naar-een-andere-pagina)
- [Stap 12: Blokkeren om te navigeren](#stap-12-blokkeren-om-te-navigeren)

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

### Deep linking en client-side routing <!-- omit in toc -->

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

👉🏻 Voeg nu zelf de routes toe voor de componenten `Delays`, `AddDelay`, `Login` en `Logout`. Gebruik hiervoor respectievelijk de URL paden `/delays`, `/adddelay`, `/login` en `/logout`.

{{note

Voor nu maken we nog even geen gebruik van het `NotFound` component. Die komt in een volgende stap aan bod.

note}}

👉🏻 Ondanks dat je de hyperlinks in de navigatie balk nog niet hebt aangepast kun je al wel gebruik maken van de client-side routing door de URL in de browser te veranderen naar `localhost:3000/about` of `localhost:3000/login`. Scroll zo nodig even naar beneden scrollen om te zien dat de browser nu zowel de Home pagina als de About pagina toont.

{{note

In React Router zijn `<Route>`'s gewone componenten die de waarde van `component` tonen zodra de waarde van `path` overeenkomt met de URL in de browser. Je zult wellicht al gemerkt hebben dat de waarde van `path` alleen maar _aan het begin_ van de URL hoeft overeen te komen om de `<Route>` te activeren. Dus als de URL in de browser `localhost:3000/about` is, komt deze overeen met pad `/` &eacute;n met pad `/about`; vandaar dat beide componenten getoond worden.

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
Standaard hyperlinks (`<a>...</a>`) vangt de browser af... en dat willen we eigenlijk niet. React Router heeft een eigen variant voor hyperlinks en dat is het `<Link>` component.

👉🏻 Zorg eerst dat we in `NavBar.js` het `<Link>` component kunnen gebruiken door het te importeren. Voeg de volgende regel code toe:

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

Zoals je hebt gezien in de code hierboven gebruikt de `<Link>` component de property `to={...}` om aan te geven waar de link naartoe navigeert. React gebruikt bewust **geen** `href="..."` om verwarring met externe hyperlinks te voorkomen. Probeer maar eens de `to` property van `About` te veranderen naar `https://www.han.nl`, en vervolgens op deze hyperlink in de browser te klikken.

Onder water gebruikt React Router gewone `<a>` hyperlinks om in de browser weer te geven. Maar de `Link` component voegt hierbij aan elke hyperlink een `onClick()` handler toe die voorkomt dat de browser de click afhandelt. Vervolgens past React Router zelf de URL in de browser aan en voert alle `<Route>` componenten die we in de applicatie gebruiken opnieuw uit. Mocht een `<Route>` nu wel matchen met de nieuwe URL, dan wordt het bijbehorende component weergegeven.

note}}

## Stap 7: Actieve links anders weergeven

Momenteel geeft de URL balk van de browser de huidige route wel weer, maar nog niet in het navigatie menu in de applicatie. Dit komt omdat `<Link>` componenten alleen de URL aanpassen en eventuele `<Route>` componenten... maar niet de hyperlinks zelf. Om dit te bereiken kun je gebruik naken van het `<NavLink>` component van React Router.

👉🏻 Vervang overal in het bestand `NavBar.js` het gebruik van `<Link>...</Link>` door `<NavLink>...</NavLink>`. Uiteraard moet je ook het `import` statement aanpassen.

Nu zal elke link waarvan het pad (gedeeltelijk) overeenkomt met de browser URL de extra CSS classname `active` krijgen. Je kunt dit zelf bekijken door in de browser m.b.v. Developer Tools de html elementen te inspecteren.

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

Standaard gebruikt het `NavLink` component de CSS classname `active` waardoor we er op die manier in de CSS naar verwijzen. Aangezien het hier om een classname gaat gebruiken we in de CSS code `.active`. Dit is iets **anders** dan de `:active` pseudo-class voor hyperlinks (zie [hier](https://developer.mozilla.org/en-US/docs/Web/CSS/:active))

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

👉🏻 Voeg in `App.js` een import toe van het `<Switch>` component uit `react-router-dom`.

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
```

👉🏻 In de allereerste code hadden we al een `<NotFound>` component (uit het bestand `NotFound.js`) die getoond wordt als de URL een pad bevatte dat niet overeen kwam met onze routes. Voeg deze toe als `<Route>` binnen het `<Switch>` blok.

{{exShort "Vraag:" "ReactTutorial-vraag-8-1"

Wat is de waarde van `path` voor deze nieuwe `<Route component={NotFound} />`?

Zoek het eventueel op in de [officiële documentatie](https://reacttraining.com/react-router/web/api/Route) van React Router.

exShort}}

{{exShort "Vraag:" "ReactTutorial-vraag-8-2"

Op welke plek binnen het `<Switch>` blok moet deze nieuwe `<Route component={NotFound} />` toegevoegd worden?

exShort}}

👉🏻 Verander in de browser nu de URL naar bijvoorbeeld `localhost:3000/foo` of `localhost:3000/about/contact`. Controleer dat nu het `<NotFound>` component getoond wordt.

## Stap 9: Dynamische routering

Stel dat we binnen een pagina meerdere sub-pagina's willen gebruiken; zoals je vaak met een dubbele navigatiestructuur ziet. Een voorbeeld hiervan is de **About** pagina; we willen verschillende sub-pagina's toevoegen voor informatie over het team en hoe contact met ons opgenomen kan worden.
Uiteraard willen we de wijzigen hiervoor beperkt houden tot het bestand `About.js`, het zou qua _software engineering_ niet handig zijn als een lokale aanpassing leidt tot meerdere wijzigingen in het gehele systeem. Vandaar dat deze vorm van routering vaak _dynamische routering_ wordt genoemd. De routering wordt volledig opgenomen in het `<About>` component en hoeft niet in het `<App>` component aangepast te worden.

👉🏻 Voeg in het bestand `About.js` twee componenten toe die informatie over het team en de contactgegevens tonen. Een simpele implementatie hiervan zou kunnen zijn:

```jsx
const AboutTeam = () => <p>This is the team for you</p>;

const AboutContact = () => <p>You can contact us</p>;
```

👉🏻 Nu moeten we er voor zorgen dat de gebruiker ook daadwerkelijk op links kan klikken en naar deze sub-pagina's kan navigeren. In het `<About>` component zijn twee plekken die we daarvoor moeten aanpassen. Binnen de `div.sidebar` moeten we `<NavLink>` componenten gebruiken ipv `<a>`, en binnen de `div.content` moeten we `<Route>` componenten toevoegen om de juiste sub-pagina weer te geven. In beide gevallen moet je het gehele path opgeven.

```jsx
const About = () => (
  <div className="page columns">
    <div className="sidebar">
      <NavLink to="/about/team">Team</NavLink>
      <NavLink to="/about/contact">Contact</NavLink>
    </div>
    <div className="content">
      <Route path="/about/team" component={AboutTeam} />
      <Route path="/about/contact" component={AboutContact} />
      <p>Here you can read about us</p>
    </div>
  </div>
);
```

{{note

Zoals je ziet moeten we nu op twee plekken het volledige path van een route definiëren (in de `<NavLink to="...">` en in de `<Route path="...">`). Daarnaast wordt het path `/about` ook nog eens op meerdere plekken in het programma gebruikt; zowel in `App.js` als in `About.js`. React Router gebruikt hiervoor (nog) niet een flexibel systeem zoals [`express.Router`](https://expressjs.com/en/4x/api.html#router) dat doet. Voor nu kun je dit oplossen door een constante te maken binnen `About.js` en deze te exporteren.

```jsx
export const AboutPath = "/about";
```

note}}

Als je de applicatie nu gebruikt, zul je zien dat de tekst "Here you can read about us" altijd wordt weergegeven; ook op **Team** en **Contact** pagina's!

👉🏻 Je kunt dit oplossen door een `<AboutDefault>` component te maken, en deze in een `<Route>` op te nemen zonder een `path` property. Vervolgens neem je alle `<Route>`'s op in een `<Switch>` component.

```jsx
const About = () => (
  <div className="page columns">
    ...
    <div className="content">
      <Switch>
        <Route path="/about/team" component={AboutTeam} />
        <Route path="/about/contact" component={AboutContact} />
        <Route component={AboutDefault} />
      </Switch>
    </div>
  </div>
);

const AboutDefault = () => <p>Here you can read more about us</p>;
```

## Stap 10: URL Parameters

{{note

Het gebruik van parameters werkt in React Router erg gelijk aan [Express parameters](https://expressjs.com/en/4x/api.html#req.params). Ze worden in het `path` gespecificeerd door een dubbele punt `:` te gebruiken en zijn beschikbaar via de `params` collectie.

note}}

Zoals we in het begin bij [Deep linking en client-side routing](#deep-linking-en-client-side-routing) van [Stap 2](#stap-2-hoe-nu-van-paginas-gewisseld-wordt) hebben gezien, zouden we graag URL's willen gebruiken die parameters bevatten. Bijvoorbeeld de URL `http://localhost:3000/delays/date/2018-09-21`, waarmee alle vertragingen van 21-Sep 2018 zijn te zien. Uiteraard gaan we niet voor elke URL een nieuw React component maken, maar geven we in de `path` property van een `<Route>` component aan, welk onderdeel van de URL variabel moet zijn. Later kunnen we de waarde hiervan als parameter in een (sub)pagina opvragen.

We gaan de **Delays** pagina aanpassen om dit mogelijk te maken. Open het bestand `Delays.js` en laten we eerst even in de source-code kijken. Het `<Delays>` component wordt gebruikt om de pagina te tonen, en het `<DelaysList>` component maakt een lijst met hyperlinks voor elke datum.

👉🏻 Maak in `Delays.js` een nieuw `<DelaysOnDate>` component dat de vertragingen van een bepaalde datum laat zien. Zorg dat dit component ook als (dynamische) route wordt opgenomen in het `<Delays>` component.

```jsx
export const Delays = () => (
  <div className="page columns">
    <div className="sidebar">
      <DelaysList />
    </div>

    <div className="content">
      {/* <p>Click on a date for more details</p> */}
      <Route path="/delays/date/:dateId" component={DelaysOnDate} />
    </div>
  </div>
);

const DelaysOnDate = () => {
  return <p>Vertragingen op: </p>;
};
```

In bovenstaande code kun je zien hoe we in de `path` property de variabele `:dateId` hebben opgenomen (URL parameters worden altijd voorafgegaan door een dubbele punt `:`). De waarde die je hiervoor invult in de URL wordt door React Router omgezet naar een parameter. Informatie over hoe een URL wordt vergeleken met een `<Route>`, wordt door React Router opgeslagen in een [`match` object](https://reacttraining.com/react-router/web/api/match). Dit `match` object wordt (automatisch) meegegeven aan de `props` van je component; je kunt er dus bij door de code `props.match` te gebruiken.
In het `match` object staat o.a. informatie over de `url`, het `path` en de `params`. Deze laatste is een collectie met alle parameters die gevonden zijn. Je kunt dus de waarde van `:dateId` opvragen door `props.match.params.dateId` te gebruiken.

👉🏻 Pas de code van `<DelaysOnDate>` aan zodat de inhoud van de `:dateId` parameter getoond wordt.

```jsx
const DelaysOnDate = props => {
  return <p>Vertragingen op: {props.match.params.dateId}</p>;
};
```

👉🏻 Gebruik in de browser de URL `http://localhost:3000/delays/date/2018-09-21` om te zien of je de parameter werkt.

{{note

React Router doet geen controles op de parameters. Je zou dus ook de URL `http://localhost:3000/delays/date/Vladivostok` kunnen gebruiken; je hebt dan alleen een niet-zo-nuttige datum.

note}}

👉🏻 Laten we nu het `<DelaysList>` component aanpassen om de juiste hyperlinks te maken. Hiervoor hoef je alleen de `<a>` hyperlinks aan te passen naar `<NavLink>`'s. De `to` property van de `<NavLink>` wordt dan de volledige URL met daarachter de datum geplakt; bijvoorbeeld: `to={"/delays/date/" + date}`.

```jsx
const DelaysList = () => {
  const delayDates = DataAPI.getDistinctDates();

  return delayDates.map(({ date, dateHuman }) => (
    <NavLink key={date} to={`/delays/date/${date}`}>
      {dateHuman}
    </NavLink>
  ));
};
```

👉🏻 Als laatste willen we in `<DelaysOnDate>` nu de echte informatie van de vertragingen tonen. Dit kun je doen met onderstaande code:

```jsx
const DelaysOnDate = props => {
  const dateId = props.match.params.dateId;
  const delays = DataAPI.getDelaysOnDate(dateId);

  return (
    <div className="content">
      {delays.length > 0 ? (
        delays.map(({ id, fromLocation, to, minutesHuman }) => (
          <p key={id}>
            from {fromLocation} to {to} - {minutesHuman} delay
          </p>
        ))
      ) : (
        <p>No delays for this date.</p>
      )}
    </div>
  );
};
```

{{note

Bovenstaande code lijkt op het eerste gezicht misschien een beetje raar, maar we gebruiken de `map` functie om voor elke vertraging een `<p>` te genereren. Aangezien dit een lijst met React componenten is, moeten we een `key` property toevoegen. Meer informatie hierover is te vinden op [Lists and Keys](https://reactjs.org/docs/lists-and-keys.html) in de React documentatie.

note}}

### 🏆 Bonus 🏆 <!-- omit in toc -->

Je kunt nu een extra sub-pagina in de applicatie opnemen waarmee je alle vertragingen te zien krijgt van een bepaalde locatie.
Gebruik hiervoor als URL `http://localhost:3000/delays/location/:locationId`. Met de functie `DataAPI.getDelaysOnLocation(...)` kun je alle vertragingen van een bepaalde locatie opvragen. De datastructuur die je terugkrijgt staat als commentaar beschreven in het bestand `DataAPI.js`.
Probeer ook het `<DelaysOnDate>` component zo aan te passen dat binnen de `<p>...</p>` de `{from}` en `{to}` waarden als `<NavLink>` worden weergegeven.

De pagina met de vertragingen van een bepaalde dag ziet er dan als volgt uit (de plaatsnamen zijn nu links geworden naar de sub-pagina):
![Screenshot van vertragingen op datum](https://i.imgur.com/2cSsdVU.png)

En als je op een plaats klikt ga je naar de overzichtspagina met alle vertragingen in die plaats, zoals in onderstaande afbeelding zichtbaar is.
![Screenshot van vertragingen per plaats](https://i.imgur.com/rGAhxZm.png)

## Stap 11: Navigeren naar een andere pagina

Soms willen we vanuit code de gebruiker naar een andere pagina (=URL) sturen. Dit kan handig zijn als de gebruiker een formulier heeft ingevuld en verstuurd, of als er data vanaf de server naar de web applicatie wordt verzonden, of als de gebruiker een bepaalde knop heeft ingedrukt.

React Router heeft hiervoor twee mogelijkheden:

- in de `render` functie met het [`<Redirect>` component](https://reacttraining.com/react-router/web/api/Redirect); _of_
- op elke andere plek in je code met de [`history.push()` functie](https://reacttraining.com/react-router/web/api/history).

👉🏻 Een prima eerste kandidaat in de applicatie om de gebruiker naar een andere pagina te sturen is na het uitloggen. Nu wordt er alleen een tekst getoond na het uitloggen, maar logischer is om de gebruiker door te sturen naar de **Home** pagina. De code waar dit moet gebeuren staat in het `Logout.js` bestand. Verander het `return` statement door gebruik te maken van het `<Redirect>` component. Vergeet ook niet dit component te importeren vanuit het `react-router-dom` package.

```jsx
import React from "react";
import { Redirect } from "react-router-dom";

import AuthenticationAPI from "../api/AuthenticationAPI";

export const Logout = () => {
  AuthenticationAPI.logout();
  return <Redirect to="/" />;
};
```

👉🏻 Een andere plek waar we de gebruiker naar een andere pagina willen sturen is na het inloggen. Zodra de gebruiker is ingelogd sturen we hem ook door naar de **Home** pagina. De code waar dit moet gebeuren staat in het `Login.js` bestand. Net zoals met het `match` object, wordt het `history` object doorgegeven aan je component via `props`.

```jsx
...

if (isLoggedIn) {
  this.props.history.push("/");
}

...
```

{{note

Je kunt in de applicatie inloggen door dezelfde waarden in te typen bij de gebruikersnaam en het wachtwoord.

note}}

## Stap 12: Blokkeren om te navigeren

In sommige gevallen wil je juist voorkomen dat de gebruiker naar een andere pagina navigeert. Bijvoorbeeld als de gebruiker bezig is een formulier in te vullen en - voordat de gegevens zijn opgeslagen - op een hyperlink klikt die naar een andere pagina leidt. Vaak wil je dan eerst een waarschuwing geven dat als de gebruiker doorgaat, de ingevulde gegevens verloren gaan.

In React Router kunnen we gebruik maken van het `<Prompt>` component om een navigatie te blokkeren. Dit gebeurt altijd door een melding te geven, waarbij de gebruiker beslist of er geblokkeerd moet worden of niet. Je kunt een gebruiker dus niet 'gevangen' houden op een pagina.[Het is (uiteraard) niet mogelijk om de navigatie naar een andere website te blokkeren.]{aside}

In de applicatie kun je op de **Add delay** pagina nieuwe vertragingen toevoegen. De code hiervoor kun je vinden in het `AddDelay.js` bestand. Dit is een simpel formulier, waarbij in de `state` niet alleen de waarden van de [controlled components](https://reactjs.org/docs/forms.html) worden bijgehouden, maar ook een `isDirty` variabele die `true` wordt zodra er iets in de `state` is aangepast. Hiermee kunnen we dan de knop om het formulier te versturen actief en inactief maken, of een melding onder het formulier weergeven indien we gewijzigde gegevens hebben.

👉🏻 Voeg op de aangegeven plek in de code de volgende regels toe:

```jsx
<Prompt
  when={isDirty}
  message="Gegevens zijn nog niet opgeslagen. Wilt u doorgaan?"
/>
```

👉🏻 Vergeet niet het `<Prompt>` component te importeren uit het `react-router-dom` package.

<!--

 Stap 13: Conditional routing (authentication)

 Stap 14: Een Node.js server gebruiken

-->
