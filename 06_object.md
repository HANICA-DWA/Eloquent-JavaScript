{{meta {load_files: ["code/chapter/06_object.js"], zip: "node/html"}}}

# The Secret Life of Objects

{{quote {author: "Barbara Liskov", title: "Programming with Abstract Data Types", chapter: true}

An abstract data type is realized by writing a special kind of program
[…] which defines the type in terms of the operations which can be
performed on it.

quote}}

{{index "Liskov, Barbara", "abstract data type"}}

{{figure {url: "img/chapter_picture_6.jpg", alt: "Picture of a rabbit with its proto-rabbit", chapter: framed}}}

[Chapter ?](data) introduced JavaScript's ((object))s. In programming
culture, we have a thing called _((object-oriented programming))_, a
set of techniques that use objects (and related concepts) as the
central principle of program organization.

Though no one really agrees on its precise definition, object-oriented
programming has shaped the design of many programming languages,
including JavaScript. This chapter will describe the way these ideas
can be applied in JavaScript.

## Encapsulation

{{index encapsulation, isolation, modularity}}

The core idea in object-oriented programming is to divide programs
into smaller pieces and make each piece responsible for managing its
own state.

{{note

De term 'state' ga je vaker tegenkomen in deze course. Het betekent, grofweg,
alle informatie die een programma moet onthouden terwijl het draait. State zit
dus meestal in variabelen, maar kan bijvoorbeeld ook in een database zitten.

State is niet of nauwelijks scherp te definiëren, dus je kunt uit verschillende
bronnen verschillende meningen horen. Want sommige informatie is "meer state"
dan andere. Bijvoorbeeld:
* Een lokale variabele van een functie die maar kort
  draait is niet echt "state". Daarvoor leeft de variabele te kort, en heeft het
  te weinig invloed op het latere verloop van het programma.
* Een productcatalogus in een database van een webshop is ook niet echt "state".
  Als de catalogus maar weinig of langzaam verandert, en de inhoud heeft weinig
  effect op het concrete _gedrag_ van het programma, dan is het ook niet echt
  state, maar meer "data".

Dus als je aan state denkt, denk dan aan informatie,bijgehouden door het
programma, die het latere verloop/gedrag van het programma kan/zal gaan
beïnvloeden.

De volgende dingen zijn wel voorbeelden van state:
* De globale variabelen van een programma, mits die af-en-toe veranderen.
* Veranderingen die je hebt aangevracht in de DOM, zeker als daardoor de dingen
  die de gebuiker kan doen anders worden.
* Veranderende informatie in de database die straks gebruikt gaat worden door
  het programma om beslissingen te namen (b.v. inhoud van winkelwagentje.)
* En, zoals de auteur de term hier gebruikt: De instantie variabelen van een
  object, zeker als dat object langer meegaat dat een paar microseconden. De
  coördinaten en gezondheid van alle SpaceInvaders in het spel is zeker deel van
  de state van het hele spel.

note}}

This way, some knowledge about the way a piece of the program works
can be kept _local_ to that piece. Someone working on the rest of the
program does not have to remember or even be aware of that knowledge.
Whenever these local details change, only the code directly around it
needs to be updated.

{{id interface}}

Different pieces of such a program interact with each other through
_((interface))s_, limited sets of functions or bindings that provide
useful functionality at a more abstract level, hiding their precise
implementation.

{{index "public properties", "private properties", "access control"}}

Such program pieces are modeled using ((object))s. Their interface consists of a
specific set of ((method))s and properties [Denk bij "properties" nu even aan
_instantie variabelen_. Later in dit hoofdstuk zal blijken dat je speciale
functies kan maken (_getters_ en _setters_) die, voor code buiten een
_class_-definitie, lijken op variabelen. Die noemen we ook properties.]{aside}.
Properties that are part of the interface are called _public_. The others, which
outside code should not be touching, are called _private_.

{{index "underscore character"}}

Many languages provide a way to distinguish public and private
properties and prevent outside code from accessing the private
ones altogether. JavaScript, once again taking the minimalist
approach, does not—not yet at least. There is work underway to add
this to the language.

Even though the language doesn't have this distinction built in,
JavaScript programmers _are_ successfully using this idea. Typically,
the available interface is described in documentation or comments. It
is also common to put an underscore (`_`) character at the start of
property names to indicate that those properties are private.

Separating interface from implementation is a great idea. It is
usually called _((encapsulation))_.

{{id obj_methods}}

## Methods

{{index "rabbit example", method, property}}

Methods are nothing more than properties that hold function values.
This is a simple method:

```
let rabbit = {};
rabbit.speak = function(line) {
  console.log(`The rabbit says '${line}'`);
};

rabbit.speak("I'm alive.");
// → The rabbit says 'I'm alive.'
```

{{index this, "method call"}}

Usually a method needs to do something with the object it was called
on. When a function is called as a method—looked up as a property and
immediately called, as in `object.method()`—the binding called `this`
in its body automatically points at the object that it was called on.

```{includeCode: "top_lines:6", test: join}
function speak(line) {
  console.log(`The ${this.type} rabbit says '${line}'`);
}
let whiteRabbit = {type: "white", speak};
let hungryRabbit = {type: "hungry", speak};

whiteRabbit.speak("Oh my ears and whiskers, " +
                  "how late it's getting!");
// → The white rabbit says 'Oh my ears and whiskers, how
//   late it's getting!'
hungryRabbit.speak("I could use a carrot right now.");
// → The hungry rabbit says 'I could use a carrot right now.'
```

{{id call_method}}

{{index "call method"}}

You can think of `this` as an extra ((parameter)) that is passed in a
different way. If you want to pass it explicitly, you can use a
function's `call` method, which takes the `this` value as its first
argument and treats further arguments as normal parameters.

```
speak.call(hungryRabbit, "Burp!");
// → The hungry rabbit says 'Burp!'
```

Since each function has its own `this` binding, whose value depends on
the way it is called, you cannot refer to the `this` of the wrapping
scope in a regular function defined with the `function` keyword.

{{index this, "arrow function"}}

Arrow functions are different—they do not bind their own `this` but
can see the `this` binding of the scope around them. Thus, you can do
something like the following code, which references `this` from inside
a local function:

```
function normalize() {
  console.log(this.coords.map(n => n / this.length));
}
normalize.call({coords: [0, 2, 3], length: 5});
// → [0, 0.4, 0.6]
```

{{index "map method"}}

If I had written the argument to `map` using the `function` keyword,
the code wouldn't work.

{{note

Een CWD-achtig voorbeeld van hetzelfde probleem/oplossing is zou over
event-handlers kunnen gaan.

Bestudeer de volgend code, en voer 't uit:


```{lang: "text/html"}
<div id="exampleDiv" style="padding: 20px; background-color: #aaf">
  <p>Wat zijn de interessantste karakters uit de Harry Potter serie?</p>
  <ul id="answers">
  </ul>
  <p>Klik hier om antwoorden te zien.</p>
</div>


<script>
  function addAnswers(event) {
    this.removeChild(this.lastChild);
    ["Sneep", "Tante Petunia", "Dobby"].forEach( name => {
      const answerElement = document.createElement("li");
      answerElement.style.marginLeft = "1em";
      answerElement.textContent = name;
      this.appendChild(answerElement);
    })
  }
  document
     .getElementById("exampleDiv")
     .addEventListener('click', addAnswers);
</script>

```

* Als je een functie als event-handler installeert op een DOM element, dan zal
  de _browser_ je functie
  aanroepen
* Omdat de broswer de 'aanroeper' is, is het de browser die bepaalt wat de
  waarde voor de 'this'-binding zal zijn in jouw event-handler.
* Browsers geven dan het _DOM-element waarop de event-handler geïnstalleerd_ is
  mee als `this`.

Onderstaande code gebruikt dat: De event-handler `addAnswers` roept, op regel 1,
`this.removeChild(this.lastChild);` aan, om daarmee de "Klik hier..." instructie
te verwijderen.

Daarna gebruikt de code de `forEach()`-functie om drie list-items aan de `<div>`
toe te voegen. `forEach()` is een hogere-orde functie (eigenlijk een method van
array's), en de code die we herhaald uitvoeren is verpakt in een functie.

Omdat die functie _ook gebruikt maakt van `this`_, en het nodig heeft dat dat
**dezelfde `this` is als in de omliggende functie** (addAnswers), moet dit wel
een arrow functie zijn!

* Omdat we de code die we herhalen als functie aan `forEach()` geven, is het
  `forEach()` die die herhaal-code aan zal roepen (meerdere keren).
* Dus `forEach` bepaalt wat de waarde van de `this`-binding zal zijn.
* In de [documentatie van `forEach()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) kun je terugvinden dat die waarde `undefined` zal zijn.

M.a.w: Als we een 'gewone' functie (gedefinieerd met `function naam() {...}`)
aan forEach hadden meegegeven, dan had bovenstaande event-handler de list-items
proberen toe te voegen aan `undefined`!

Arrow-functions voorkomen dat. Bij een arrow-function wordt de waarde van `this`
_nooit_ bepaald door de aanroepende functie. De waarde van `this` voor een
arrow-functie is altijd de waarde van `this` in de omliggende code. En dat is
exact wat onze event-handler nodig heeft.

note}}

{{exCode "Arrow functies voor events" "arrows-for-events"

Onderstaande code toont een object dat 'quizComponent' heet, en twee methodes
heeft:
* `render` kan de HTML voor het component in de pagina plaatsen, en
* `clickHandler` is de functie die de browser moet aanroepen als de gebruiker
  erop geklikt heeft.

De render-functie werkt. Maar het lukt de browser toch niet om de clickHandler
goed aan te roepen. De code draait wel, maar 'this' bevat de verkeerde waarde
(welke?), waardoor `this.answer` `undefined` oplevert, in plaats van "Albus
Severus".

```{lang: "text/html"}
<div id="quizDiv" style="padding: 20px; background-color: #aaf">
Quiz:
</div>

<script>

const quizComponent1 = {
  question:     "Hoe heet de jongste zoon van Harry " +
                "Potter in deel 7 en 8?",
  answer:       "Albus Severus",
  render:       function() {
    const theDiv = document.getElementById("quizDiv")
    theDiv.innerHTML += `<button>${this.question}</button>`;
    theDiv.lastChild.addEventListener( "click", this.clickHandler )
  },
  clickHandler: function() {
    alert("Het antwoord is:\n"+ this.answer);
  }
}

quizComponent1.render() // render() is een veelgebruikte naam voor functies
                        // die data omzetten naar graphics (in dit geval
                        // HTML-elementen in de DOM).
</script>
```

**OPDRACHT:** Neem bovenstaande code over in de code-editor hieronder
(bovenstaand code-blok kun je niet inleveren), en doe drie dingen:
1. Voeg nog een quizComponent toe.
   * Bedenk zelf een vraag en een antwoord,
   * kopieer de definities voor de twee functies naar het nieuwe object.
   * Zorg ervoor dat ook voor het nieuwe object de `render()` methode wordt
     aangeroepen.
1. Zoek uit wat de waarde van `this` _wel_ is, als de clickHandler wordt
   aangeroepen. Dien dat antwoord bij de volgende vraag in.
1. Fix het probleem van de event-handler door een arrow-functie op de goede plek
   in te zetten.

**PS:** Die laatste stap kan tricky zijn. Als dit je _meer dan een kwartier_ kost,
**lever dan in wat je hebt**. We zullen in de klas bespreken wat de goede oplossing
is, en waarom een oplossing die voor sommigen voor-de-hand-liggend is, niet
correct is. Ook dat is leerzaam om de rol en werking van arrow functies te
begrijpen.

exCode}}

{{exShort "Vervolgvraag" "this-in-eventhandler"

Wat was _wel_ de waarde van `this` in clickHandler (voordat je het probleem oploste)?

exShort}}

{{id prototypes}}

## Prototypes

{{index "toString method"}}

Watch closely.

```
let empty = {};
console.log(empty.toString);
// → function toString(){…}
console.log(empty.toString());
// → [object Object]
```

{{index magic}}

I pulled a property out of an empty object. Magic!

{{index property, object}}

Well, not really. I have simply been withholding information about the
way JavaScript objects work. In addition to their set of properties,
most objects also have a _((prototype))_. A prototype is another
object that is used as a fallback source of properties. When an object
gets a request for a property that it does not have, its prototype
will be searched for the property, then the prototype's prototype, and
so on.

{{index "Object prototype"}}

So who is the ((prototype)) of that empty object? It is the great
ancestral prototype, the entity behind almost all objects,
`Object.prototype`.

```
console.log(Object.getPrototypeOf({}) ==
            Object.prototype);
// → true
console.log(Object.getPrototypeOf(Object.prototype));
// → null
```

{{index "getPrototypeOf function"}}

As you guess, `Object.getPrototypeOf` returns the prototype of an
object.

{{note

`getPrototypeOf` ziet er uit als een methode, maar 'Object' (met hoofdletter) is
een soort klasse in Javascript, en getPrototypeOf is een 'static' methode van
die klasse. Dat betekent, in de praktijk, dat (in tegenstelling tot gewone
methodes), `Object.getPrototypeOf(o)` dus niet werkt op 'Object', maar op de
parameter. Je krijgt het prototype van de parameter, niet van het ding voor de
punt.

note}}

{{index "toString method"}}

The prototype relations of JavaScript objects form a ((tree))-shaped
structure, and at the root of this structure sits `Object.prototype`.
It provides a few ((method))s that show up in all objects, such as
`toString`, which converts an object to a string representation.

{{index inheritance, "Function prototype", "Array prototype", "Object prototype"}}

Many objects don't directly have `Object.prototype` as their ((prototype)) but
instead have another object that provides a different set of default properties.
Functions derive from `Function.prototype`, and arrays derive from
`Array.prototype`. [Marijn Haverbeke gebruikt hier de term 'derive', maar je
kunt ook 'inherits' lezen. Protoype-inheritance in Javascript werkt iets anders
dan class-based inheritance in talen als Java, PHP of C++, maar het globale idee
is hetzelfde.]{aside}

```
console.log(Object.getPrototypeOf(Math.max) ==
            Function.prototype);
// → true
console.log(Object.getPrototypeOf([]) ==
            Array.prototype);
// → true
```

{{index "Object prototype"}}

Such a prototype object will itself have a prototype, often
`Object.prototype`, so that it still indirectly provides methods like
`toString`.

{{index "rabbit example", "Object.create function"}}

You can use `Object.create` to create an object with a specific
((prototype)).

```
let protoRabbit = {
  speak(line) {
    console.log(`The ${this.type} rabbit says '${line}'`);
  }
};
let killerRabbit = Object.create(protoRabbit);
killerRabbit.type = "killer";
killerRabbit.speak("SKREEEE!");
// → The killer rabbit says 'SKREEEE!'
```

{{index "shared property"}}

A property like `speak(line)` in an object expression is a shorthand way
of defining a method. It creates a property called `speak` and gives
it a function as its value.

{{note
De bovenstaande definitie van `speak` betekent precies hetzelfde als dit:
```
let protoRabbit = {
  speak: function speak(line) {
    console.log(`The ${this.type} rabbit says '${line}'`);
  }
};
```

Het verschil zit alleen in schrijfwijze, niet in betekenis. We hadden onze
quizComponent hierboven ook zo kunnen definieren:

```
const quizComponent1 = {
  question:     "Hoe heet de jongste zoon van Harry?"
  answer:       "Albus Severus",
  render() {
    const theDiv = document.getElementById("quizDiv")
    theDiv.innerHTML += `<button>${this.question}</button>`;
    theDiv.lastChild.addEventListener( "click", this.clickHandler )
  },
  clickHandler() {
    alert("Het antwoord is:\n"+ this.answer);
  }
}
```

Features in programmeertalen die eigenlijk alleen de schrijfwijze van dingen in
de taal verbeteren, zonder nieuwe betekenis toe te voegen, noemen we
**"syntactische suiker"**. Het maakt de taal lekkerder zonder 'm nuttiger te
maken. Zometeen, in de sectie _Class Notation_ zullen we een veel belangrijker
stuk syntactische suiker tegenkomen.

note}}

The "proto" rabbit acts as a container for the properties that are
shared by all rabbits. An individual rabbit object, like the killer
rabbit, contains properties that apply only to itself—in this case its
type—and derives shared properties from its prototype.

{{id classes}}

## Classes

{{index "object-oriented programming"}}

JavaScript's ((prototype)) system can be interpreted as a somewhat
informal take on an object-oriented concept called _((class))es_. A
class defines the shape of a type of object—what methods and
properties it has. Such an object is called an _((instance))_ of the
class.

Prototypes are useful for defining properties for which all instances
of a class share the same value, such as ((method))s. Properties that
differ per instance, such as our rabbits' `type` ((property)), need to
be stored directly in the objects themselves.

{{id constructors}}

So to create an instance of a given class, you have to make
an object that derives from the proper prototype, but you _also_ have
to make sure it, itself, has the properties that instances of this
class are supposed to have. This is what a _((constructor))_ function
does.

```
function makeRabbit(type) {
  let rabbit = Object.create(protoRabbit);
  rabbit.type = type;
  return rabbit;
}
```

{{index "new operator", this, "return keyword", [object, creation]}}

JavaScript provides a way to make defining this type of function
easier. If you put the keyword `new` in front of a function call, the
function is treated as a constructor. This means that an object with
the right prototype is automatically created, bound to `this` in the
function, and returned at the end of the function.

{{index "prototype property"}}

The prototype object used when constructing objects is found by taking
the `prototype` property of the constructor function.

{{index "rabbit example"}}

```
function Rabbit(type) {
  this.type = type;
}
Rabbit.prototype.speak = function(line) {
  console.log(`The ${this.type} rabbit says '${line}'`);
};

let weirdRabbit = new Rabbit("weird");
```

{{index constructor}}

Constructors (all functions, in fact) automatically get a property
named `prototype`, which by default holds a plain, empty object that
derives from `Object.prototype`. You can overwrite it with a new
object if you want. Or you can add properties to the existing object,
as the example does.

{{index capitalization}}

By convention, the names of constructors are capitalized so that they
can easily be distinguished from other functions.

{{index "prototype property", "getPrototypeOf function"}}

It is important to understand the distinction between the way a
prototype is associated with a constructor (through its `prototype`
property) and the way objects _have_ a prototype (which can be found
with `Object.getPrototypeOf`). The actual prototype of a constructor
is `Function.prototype` since constructors are functions. Its
`prototype` _property_ holds the prototype used for instances created
through it.

```
console.log(Object.getPrototypeOf(Rabbit) ==
            Function.prototype);
// → true
console.log(Object.getPrototypeOf(weirdRabbit) ==
            Rabbit.prototype);
// → true
```

## Class notation

So JavaScript ((class))es are ((constructor)) functions with a
((prototype)) property. That is how they work, and until 2015, that
was how you had to write them. These days, we have a less awkward
notation.

```{includeCode: true}
class Rabbit {
  constructor(type) {
    this.type = type;
  }
  speak(line) {
    console.log(`The ${this.type} rabbit says '${line}'`);
  }
}

let killerRabbit = new Rabbit("killer");
let blackRabbit = new Rabbit("black");
```

{{index "rabbit example"}}

The `class` keyword starts a ((class declaration)), which allows us to
define a constructor and a set of methods all in a single place. Any
number of methods may be written inside the declaration's ((braces)).
The one named `constructor` is treated specially. It
provides the actual constructor function, which will be bound to the
name `Rabbit`. The others are packaged into that constructor's
prototype. Thus, the earlier class declaration is equivalent to the
constructor definition from the previous section. It just looks nicer.
[Dit is de syntactische suiker!]{aside}

{{index ["class declaration", properties]}}

Class declarations currently allow only _methods_—properties that hold
functions—to be added to the ((prototype)). This can be somewhat
inconvenient when you want to save a non-function value in there.
The next version of the language will probably improve this. For now, you
can create such properties by directly manipulating the
prototype after you've defined the class.


{{skip

Like `function`, `class` can be used both in statements and in
expressions. When used as an expression, it doesn't define a
binding but just produces the constructor as a value. You are allowed
to omit the class name in a class expression.

```
let object = new class { getWord() { return "hello"; } };
console.log(object.getWord());
// → hello
```

skip}}

## Overriding derived properties

{{index "shared property", overriding}}

When you add a ((property)) to an object, whether it is present in the
prototype or not, the property is added to the object _itself_.
If there was already a property with
the same name in the prototype, this property will no longer affect
the object, as it is now hidden behind the object's own property.

```
Rabbit.prototype.teeth = "small";
console.log(killerRabbit.teeth);
// → small
killerRabbit.teeth = "long, sharp, and bloody";
console.log(killerRabbit.teeth);
// → long, sharp, and bloody
console.log(blackRabbit.teeth);
// → small
console.log(Rabbit.prototype.teeth);
// → small
```

{{index [prototype, diagram]}}

The following diagram sketches the situation after this code has run.
The `Rabbit` and `Object` ((prototype))s lie behind `killerRabbit` as
a kind of backdrop, where properties that are not found in the object
itself can be looked up.

{{figure {url: "img/rabbits.svg", alt: "Rabbit object prototype schema",width: "8cm"}}}

{{youtube esq3iFiEhfo

Bovenstaand diagram laat een hele hoop dingen, die eerder in het boek wel
beschreven zijn, niet zien in het plaatje. Dat is om het plaatje overzichtelijk
te houden, maar we willen toch dat je je bewust bent van wat er _echt gebeurt_
als je met classes, objecten en prototypes werkt. Bekijk deze video. De exercise
hieronder gaat over het laatste stukje van de video.

youtube}}

{{note

Hier nog even de samenvatting uit de video, en [een link naar de afbeelding](https://dwa-courses.firebaseapp.com/img/memory_model/chap06/Rabbit_memory_model.png):

**In JavaScript:**

1. …**zijn class-definities eigenlijk functie-definities**(de functie-code is de code van de constructor)
1. …**methode-definities worden in een ander object gestopt.** Dat object zal het prototype zijn van instanties van die klasse
1. …instanties hebben een veld dat **`__proto__` heet, waarmee ze hun prototype uitlezen**.
1. …prototype-objecten zijn gewone JS-objecten, en **hebben zelf ook weer een prototype**.
1. …functies zijn ‘ongewone’ objecten (hebben code), maar **functies hebben ook gewoon een prototype**, dat ze ook met `__proto__` aanwijzen.
1. …**constructor-functies hebben nog een veld: “`prototype`”**. Dat wijst het object aan dat prototype gaat worden van nieuwe objecten die die constructor maakt.




note}}

{{exShort "Wat is het prototype van `Function.prototype`?" "__proto__ van Function.prototype"

In het diagram dat in de video wordt getoond, verschijnen op het laatst twee
objecten: de `Function` constructor en `Function.prototype`. Van beide blokjes
is het `__proto__` veld leeg en groen.

Deze vraag focust op het rechter-blockje: `Function.prototype`. _Naar welk object wijst
dit veld?_ M.a.w: wat is het prototype van `Function.prototype`?

exShort}}


{{exShort "Wat is het prototype van `Function`?" "__proto__ van Function()"

Dezelfde vraag voor het andere groene veld in het diagram. Dit gaat dus over de `Function`-constructor. *Naar welk object wijst
het `__proto__` veld?*  M.a.w: wat is het prototype van `Function`?

exShort}}


{{index "shared property"}}

Overriding properties that exist in a prototype can be a useful thing
to do. As the rabbit teeth example shows, overriding can be used to express
exceptional properties in instances of a more generic class of
objects, while letting the nonexceptional objects take a
standard value from their prototype.

{{index "toString method", "Array prototype", "Function prototype"}}

Overriding is also used to give the standard function and array prototypes a
different `toString` method than the basic object prototype.

```
console.log(Array.prototype.toString ==
            Object.prototype.toString);
// → false
console.log([1, 2].toString());
// → 1,2
```

{{index "toString method", "join method", "call method"}}

Calling `toString` on an array gives a result similar to calling
`.join(",")` on it—it puts commas between the values in the array.
Directly calling `Object.prototype.toString` with an array produces a
different string. That function doesn't know about arrays, so it
simply puts the word _object_ and the name of the type between square
brackets.

```
console.log(Object.prototype.toString.call([1, 2]));
// → [object Array]
```

## Maps

{{index "map method"}}

We saw the word _map_ used in the [previous chapter](higher_order#map)
for an operation that transforms a data structure by applying a
function to its elements. Confusing as it is, in programming the same
word is also used for a related but rather different thing.

{{index "map (data structure)", "ages example", "data structure"}}

A _map_ (noun) is a data structure that associates values (the keys)
with other values. For example, you might want to map names to ages.
It is possible to use objects for this.

```
let ages = {
  Boris: 39,
  Liang: 22,
  Júlia: 62
};

console.log(`Júlia is ${ages["Júlia"]}`);
// → Júlia is 62
console.log("Is Jack's age known?", "Jack" in ages);
// → Is Jack's age known? false
console.log("Is toString's age known?", "toString" in ages);
// → Is toString's age known? true
```

{{index "Object.prototype", "toString method"}}

Here, the object's property names are the people's names, and the
property values are their ages. But we certainly didn't list anybody named
toString in our map. Yet, because plain objects derive from
`Object.prototype`, it looks like the property is there.

{{index "Object.create function", prototype}}

As such, using plain objects as maps is dangerous. There are several
possible ways to avoid this problem. First, it is possible to create
objects with _no_ prototype. If you pass `null` to `Object.create`,
the resulting object will not derive from `Object.prototype` and can
safely be used as a map.

```
console.log("toString" in Object.create(null));
// → false
```

Object ((property)) names must be strings. If you need a map whose
keys can't easily be converted to strings—such as objects—you cannot
use an object as your map.

{{index "Map class"}}

Fortunately, JavaScript comes with a class called `Map` that is
written for this exact purpose. It stores a mapping and allows any
type of keys.

```
let ages = new Map();
ages.set("Boris", 39);
ages.set("Liang", 22);
ages.set("Júlia", 62);

console.log(`Júlia is ${ages.get("Júlia")}`);
// → Júlia is 62
console.log("Is Jack's age known?", ages.has("Jack"));
// → Is Jack's age known? false
console.log(ages.has("toString"));
// → false
```

{{index interface, "set method", "get method", "has method", encapsulation}}

The methods `set`, `get`, and `has` are part of the interface of the
`Map` object. Writing a data structure that can quickly update and
search a large set of values isn't easy, but we don't have to worry
about that. Someone else did it for us, and we can go through this
simple interface to use their work.

{{index "hasOwnProperty method", "in operator"}}

If you do have a plain object that you need to treat as a map for some
reason, it is useful to know that `Object.keys` returns only an
object's _own_ keys, not those in the prototype. As an alternative to
the `in` operator, you can use the `hasOwnProperty` method, which
ignores the object's prototype.

```
console.log({x: 1}.hasOwnProperty("x"));
// → true
console.log({x: 1}.hasOwnProperty("toString"));
// → false
```

## Polymorphism

{{index "toString method", "String function", polymorphism, overriding, "object-oriented programming"}}

When you call the `String` function (which converts a value to a
string) on an object, it will call the `toString` method on that
object to try to create a meaningful string from it. I mentioned that
some of the standard prototypes define their own version of `toString`
so they can create a string that contains more useful information than
`"[object Object]"`. You can also do that yourself.

```{includeCode: "top_lines: 3"}
Rabbit.prototype.toString = function() {
  return `a ${this.type} rabbit`;
};

console.log(String(blackRabbit));
// → a black rabbit
```

{{index "object-oriented programming"}}

This is a simple instance of a powerful idea. When a piece of code is
written to work with objects that have a certain ((interface))—in this
case, a `toString` method—any kind of object that happens to support
this interface can be plugged into the code, and it will just work.

This technique is called _polymorphism_. Polymorphic code can work
with values of different shapes, as long as they support the interface
it expects.

{{index "for/of loop", "iterator interface"}}

I mentioned in [Chapter ?](data#for_of_loop) that a `for`/`of` loop
can loop over several kinds of data structures. This is another case
of polymorphism—such loops expect the data structure to expose a
specific interface, which arrays and strings do. And we can also add
this interface to your own objects! But before we can do that, we need
to know what symbols are.

{{note

Hieronder staat een flink stuk dat je mag overslaan. De tekst in dit blok is
een samenvatting ervan. **Deze samenvatting moet je niet overslaan**!

In de sectie hierboven over _Maps_, schreef Marijn Haverbeke dat waardes in
objecten opgeslagen moeten worden met een string als veldnaam (_key_). Daar is
een uitzondering op. Sinds 2015 mogen waardes ook opgeslagen worden onder een
"geheim nummer". Dat wordt een _symbol_ genoemd. De precieze werking van symbols
wordt hieronder uitgelegd, maar voor nu is het niet nodig om objecten en classes
te begrijpen.

De reden waarom Marijn Haverbeke op dit moment over Symbols begint, is om straks
een hele coole nieuwe feature van Javascript te kunnen beschrijven: _iterators_.

Veel classes zijn datastructuren die meerdere items kunnen bevatten. Denk aan
arrays, strings, DOM-elementen, objecten, Maps, en meer. Sinds ES2015 kennen
veel van die classes een feature, toegankelijk via zo'n symbol, om de taal te
helpen om al die elementen één-voor-één bij langs te gaan. Die feature heet een
'iterator', en de precieze werking ervan hoeven we nu niet op in te gaan. Maar
alles wat een iterator kan aanbieden, kan o.a.:

* doorlopen worden met de for-of loop:  
  `for(item of iterable_object) { ... }`
* gebruikt worden om een array mee te vullen:  
  `Array.from( iterable_object )`
* gebruikt worden in destructuring-assignment:  
  `[eerste, tweede, ...rest] = iterable_object`

DOM-elementen kunnen nog geen Javascript-iterators leveren (dat komt wellicht in
de toekomst). Gewone Javascript-objecten hebben geen standaard iterator-feature
aan boord, waarschijnlijk omdat de meeste Javascript objecten helemaal niet
bedoeld zijn als verzameling van items.

note}}

{{skip

## Symbols

It is possible for multiple interfaces to use the same property name
for different things. For example, I could define an interface in which
the `toString` method is supposed to convert the object into a piece
of yarn. It would not be possible for an object to conform to both
that interface and the standard use of `toString`.

That would be a bad idea, and this problem isn't that common. Most
JavaScript programmers simply don't think about it. But the language
designers, whose _job_ it is to think about this stuff, have provided
us with a solution anyway.

{{index "Symbol function", property}}

When I claimed that property names are strings, that wasn't entirely
accurate. They usually are, but they can also be _((symbol))s_.
Symbols are values created with the `Symbol` function. Unlike strings,
newly created symbols are unique—you cannot create the same symbol
twice.

```
let sym = Symbol("name");
console.log(sym == Symbol("name"));
// → false
Rabbit.prototype[sym] = 55;
console.log(blackRabbit[sym]);
// → 55
```

The string you pass to `Symbol` is included when you convert it to a
string and can make it easier to recognize a symbol when, for
example, showing it in the console. But it has no meaning beyond
that—multiple symbols may have the same name.

Being both unique and usable as property names makes symbols suitable
for defining interfaces that can peacefully live alongside other
properties, no matter what their names are.

```{includeCode: "top_lines: 1"}
const toStringSymbol = Symbol("toString");
Array.prototype[toStringSymbol] = function() {
  return `${this.length} cm of blue yarn`;
};

console.log([1, 2].toString());
// → 1,2
console.log([1, 2][toStringSymbol]());
// → 2 cm of blue yarn
```

It is possible to include symbol properties in object expressions and
classes by using ((square bracket))s around the ((property)) name.
That causes the property name to be evaluated, much like the square
bracket property access notation, which allows us to refer to a
binding that holds the symbol.

```
let stringObject = {
  [toStringSymbol]() { return "a jute rope"; }
};
console.log(stringObject[toStringSymbol]());
// → a jute rope
```

## The iterator interface

{{index "iterable interface", "Symbol.iterator symbol", "for/of loop"}}

The object given to a `for`/`of` loop is expected to be _iterable_.
This means it has a method named with the `Symbol.iterator`
symbol (a symbol value defined by the language, stored as a property
of the `Symbol` function).

{{index "iterator interface", "next method"}}

When called, that method should return an object that provides a
second interface, _iterator_. This is the actual thing that iterates.
It has a `next` method that returns the next result. That result
should be an object with a `value` property that provides the next value,
if there is one, and a `done` property, which should be true when there
are no more results and false otherwise.

Note that the `next`, `value`, and `done` property names are plain
strings, not symbols. Only `Symbol.iterator`, which is likely to be
added to a _lot_ of different objects, is an actual symbol.

We can directly use this interface ourselves.

```
let okIterator = "OK"[Symbol.iterator]();
console.log(okIterator.next());
// → {value: "O", done: false}
console.log(okIterator.next());
// → {value: "K", done: false}
console.log(okIterator.next());
// → {value: undefined, done: true}
```

{{index "matrix example", "Matrix class", array}}

{{id matrix}}

Let's implement an iterable data structure. We'll build a _matrix_
class, acting as a two-dimensional array.

```{includeCode: true}
class Matrix {
  constructor(width, height, element = (x, y) => undefined) {
    this.width = width;
    this.height = height;
    this.content = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.content[y * width + x] = element(x, y);
      }
    }
  }

  get(x, y) {
    return this.content[y * this.width + x];
  }
  set(x, y, value) {
    this.content[y * this.width + x] = value;
  }
}
```

The class stores its content in a single array of _width_ × _height_
elements. The elements are stored row by row, so, for example, the third
element in the fifth row is (using zero-based indexing) stored at
position 4 × _width_ + 2.

The constructor function takes a width, a height, and an optional
content function that will be used to fill in the initial values.
There are `get` and `set` methods to retrieve and update elements in
the matrix.

When looping over a matrix, you are usually interested in the position
of the elements as well as the elements themselves, so we'll have our
iterator produce objects with `x`, `y`, and `value` properties.

{{index "MatrixIterator class"}}

```{includeCode: true}
class MatrixIterator {
  constructor(matrix) {
    this.x = 0;
    this.y = 0;
    this.matrix = matrix;
  }

  next() {
    if (this.y == this.matrix.height) return {done: true};

    let value = {x: this.x,
                 y: this.y,
                 value: this.matrix.get(this.x, this.y)};
    this.x++;
    if (this.x == this.matrix.width) {
      this.x = 0;
      this.y++;
    }
    return {value, done: false};
  }
}
```

The class tracks the progress of iterating over a matrix in its `x`
and `y` properties. The `next` method starts by checking whether the
bottom of the matrix has been reached. If it hasn't, it _first_
creates the object holding the current value and _then_ updates its
position, moving to the next row if necessary.

Let's set up the `Matrix` class to be iterable. Throughout this book,
I'll occasionally use after-the-fact prototype manipulation to add
methods to classes so that the individual pieces of code remain small
and self-contained. In a regular program, where there is no need to
split the code into small pieces, you'd declare these methods directly
in the class instead.

```{includeCode: true}
Matrix.prototype[Symbol.iterator] = function() {
  return new MatrixIterator(this);
};
```

{{index "for/of loop"}}

We can now loop over a matrix with `for`/`of`.

```
let matrix = new Matrix(2, 2, (x, y) => `value ${x},${y}`);
for (let {x, y, value} of matrix) {
  console.log(x, y, value);
}
// → 0 0 value 0,0
// → 1 0 value 1,0
// → 0 1 value 0,1
// → 1 1 value 1,1
```

skip}}

## Getters, setters, and statics

{{index interface, property, "Map class"}}

Interfaces often consist mostly of methods, but it is also okay to
include properties that hold non-function values. For example, `Map`
objects have a `size` property that tells you how many keys are stored
in them.

It is not even necessary for such an object to compute and store such
a property directly in the instance. Even properties that are accessed
directly may hide a method call. Such methods are called
_((getter))s_, and they are defined by writing `get` in front of the
method name in an object expression or class declaration.

```{test: no}
let varyingSize = {
  get size() {
    return Math.floor(Math.random() * 100);
  }
};

console.log(varyingSize.size);
// → 73
console.log(varyingSize.size);
// → 49
```

{{index "temperature example"}}

Whenever someone reads from this object's `size` property, the
associated method is called. You can do a similar thing when a
property is written to, using a _((setter))_.

```{test: no, startCode: true}
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }
  get fahrenheit() {
    return this.celsius * 1.8 + 32;
  }
  set fahrenheit(value) {
    this.celsius = (value - 32) / 1.8;
  }

  static fromFahrenheit(value) {
    return new Temperature((value - 32) / 1.8);
  }
}

let temp = new Temperature(22);
console.log(temp.fahrenheit);
// → 71.6
temp.fahrenheit = 86;
console.log(temp.celsius);
// → 30
```

The `Temperature` class allows you to read and write the temperature
in either degrees ((Celsius)) or degrees ((Fahrenheit)), but
internally it stores only Celsius and automatically converts to
and from Celsius in the `fahrenheit` getter and setter.

{{index "static method"}}

Sometimes you want to attach some properties directly to your
constructor function, rather than to the prototype. Such methods won't
have access to a class instance but can, for example, be used to
provide additional ways to create instances.

Inside a class declaration, methods that have `static` written before
their name are stored on the constructor. So the `Temperature` class
allows you to write `Temperature.fromFahrenheit(100)` to create a
temperature using degrees Fahrenheit.

{{note

Voor de volgende twee vragen pak je even het [diagram van de video]((https://dwa-courses.firebaseapp.com/img/memory_model/chap06/Rabbit_memory_model.png)) erbij.

Stel dat we de klasse `Rabbit` een nieuwe _static_ methode `mate` erbij geven:
```
class Rabbit {
  constructor(type) {
    this.type = type;
  }
  speak(line) {
    console.log(`The ${this.type} rabbit says '${line}'`);
  }
  static mate(rabbit1, rabbit2) {
    return new Rabbit( rabbit1.type + "-" + rabbit2.type)
  }
}

let killerRabbit = new Rabbit("killer");
let blackRabbit = new Rabbit("black");

let babyRabbit  = Rabbit.mate( blackRabbit, killerRabbit )
babyRabbit.speak("dada") // "The black-killer rabbit says 'dada'"

```
Beantwoord de volgende twee vragen over deze nieuwe static functie:

note}}

{{exShort "Is `mate` ook een constructor functie?"  "mate a constructor?"

exShort}}

{{exShort "Waar wordt-ie opgeslagen?" "mate-in-memorymodel" 

Als je deze `mate` methode in het diagram zou plaatsen, dan teken je (1) een nieuw blokje voor de functiedefinitie, en (2) een pijl van een ander blokje naar de nieuwe functiedefinitie.

Vanuit welk blokje loopt de verwijzing (pijl) naar de nieuwe functie?
 
exShort}}

## Inheritance

{{note

Deze sectie is heel belangrijk, maar de oorspronkelijke tekst gaat uit van een
wat wiskundig voorbeeld dat geïntroduceerd werd in het, zojuist overgeslagen,
stuk over iterators. In dit tekstblok geven we een variant op de tekst van Marijn
Haverbeke, maar dan met een ander voorbeeld.

Laten we, als alternatief voorbeeld, starten met een class die plaatjes kan
laten bewegen over de pagina. De class maakt gebruik van de CSS `transform`
property, omdat dat de [meest soepele animaties
oplevert](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/).

De klasse heeft een constructor, die wat informatie opslaat in het object, en
een DOM-element maakt voor de sprite.

Daarnaast heeft de klasse één methode, `update()` die periodiek aangeroepen moet
worden om de sprite een nieuwe positie te geven.

Buiten de class-definitie staat code om 4 sprite-objecten aan te maken, en om 30
keer per seconde alle sprites zichzelf te laten updaten.

Het ge-tover met CSS-positionering etc. hoef je niet te bestuderen.

```{lang: "text/html"}
<div id="animationDiv" style="position:         relative;
                              height:           450px;
                              width:            750px;
                              background-image: url(https://images2.imgbox.com/77/de/rAvYPqko_o.jpg);
                              overflow:         hidden;">
</div>

<script>
class Sprite { // "Sprite" is een traditionele naam voor
               // bewegende plaatjes.

  constructor(imageUrl, x, y, xSpeed, ySpeed) {
    // Bewaar lokatie en snelheid.
    this.x = x; this.y =y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;

    // Maak een <image> element aan voor deze sprite.
    this.element = document.createElement("img");
    this.element.src = imageUrl;

    // Zet 'm op de goede plek met CSS transform en translate.
    this.element.style.transform =
      `translate( ${this.x}px, ${this.y}px )`;

    // Position:absolute is nodig om bovenstaande translate-truuk
    // te laten werken.
    this.element.style.position = 'absolute';

    // voeg de <image> toe aan de <div>
    document
      .getElementById("animationDiv")
      .appendChild(this.element);      
  }

  update() {
    // Bereken nieuwe plek.
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // Zet 'm daar neer.
    this.element.style.transform =
      `translate( ${this.x}px, ${this.y}px )`;
  }
}

const ufos = [
  // Iedere array bevat parameters voor de Sprite-constructor.
  ["https://images2.imgbox.com/90/61/bP8foIzS_o.png", 350,225,  2, 1 ],
  ["https://images2.imgbox.com/90/61/bP8foIzS_o.png", 350,225, -1, 2 ],
  ["https://images2.imgbox.com/90/61/bP8foIzS_o.png", 350,225,  1,-2 ],
  ["https://images2.imgbox.com/90/61/bP8foIzS_o.png", 350,225, -2,-1 ],
].map( ufoData => {
  return new Sprite( ...ufoData )
})
// ufos bevat nu een lijst objecten van de Sprite-klasse.



// setInterval maakt een timer die een functie periodiek aanroept. We roepen
// 'm nu 30 keer per second aan (om de 33 milliseconden).
function moveSprites() {
  ufos.forEach( ufo => ufo.update() )
}
setInterval( moveSprites, 33);

/* insert here */

</script>

```

_Gegeven bovenstaande klasse, volgt hieronder een aangepaste versie van de tekst
van Marijn Haverbeeke:_

Some sprites should be able to bounce back when they hit the edge of their
container. Perhaps UFO's should bounce, but bullits shouldn't. We could write a
brand new _BouncingSprite_ class from scratch, but that would involve repeating
some code very similar to what we already wrote.

JavaScript's prototype system makes it possible to create a _new_
class, much like the old class, but with new definitions for some of
its properties. The prototype for the new class derives from the old
prototype but adds a new definition for, say, the `update` method.

In object-oriented programming terms, this is called
_((inheritance))_. The new class inherits properties and behavior from
the old class.

```
class BouncingSprite extends Sprite {

  constructor( url, x,y, xSpeed, ySpeed ) {
    super(url,x,y,xSpeed,ySpeed);

    // met een CSS-filter kunnen we deze versie een andere kleur geven  
    this.element.style.filter = `hue-rotate(120deg)`
  }

  update() {
    super.update();
    if( this.x < 0 || this.x > 650) { // Voorbij linkerrand (0) of
                                      // rechterrand (650 - image-width).
        this.xSpeed = -this.xSpeed;   // Draai xSpeed de andere kant op.
    }
    if( this.y < 0 || this.y > 415) {
        this.ySpeed = -this.ySpeed;   
    }
  }
}

const newUfos = [
  ["https://images2.imgbox.com/90/61/bP8foIzS_o.png", 350,225,  1, 2 ],
  ["https://images2.imgbox.com/90/61/bP8foIzS_o.png", 350,225, -2, 1 ],
  ["https://images2.imgbox.com/90/61/bP8foIzS_o.png", 350,225,  2,-1 ],
  ["https://images2.imgbox.com/90/61/bP8foIzS_o.png", 350,225, -1,-2 ]
].map( ufoData => new BouncingSprite(...ufoData) )

ufos.push(...newUfos); // add new ufos to existing array of sprites.
```

_[Kopieer deze code even naar het vorige code-blok, onderaan bij `/* insert here */`, om het uit te
proberen. (Dat voorkomt dat we al die code hier moeten herhalen.)]_

The use of the word `extends` indicates that this class shouldn't be
directly based on the default `Object` prototype but on some other class. This
is called the _superclass_. The derived class is the
_subclass_.

To initialize a `BouncingSprite` instance, the constructor calls its
superclass's constructor through the `super` keyword. This is necessary
because if this new object is to behave (roughly) like a `Sprite`, it
is going to  need the instance properties that sprites have.
To make this new kind of sprite look a bit different, the constructor uses a
CSS-filter to shift the color along the color-wheel.

The `update` method again uses `super` but this time not to call the
constructor but to call a specific method from the superclass's set of
methods. We are redefining `update` but do want to use the original
behavior. Because `this.update` refers to the _new_ `update` method, calling
that wouldn't work. Inside class methods, `super` provides a way to
call methods as they were defined in the superclass.

Inheritance allows us to build slightly different data types from
existing data types with relatively little work. It is a fundamental
part of the object-oriented tradition, alongside encapsulation and
polymorphism. But while the latter two are now generally regarded as
wonderful ideas, inheritance is more controversial.

Whereas encapsulation and polymorphism can be used to _separate_
pieces of code from each other, reducing the tangledness of the
overall program, inheritance fundamentally ties classes together,
creating _more_ tangle. When inheriting from a class, you usually have
to know more about how it works than when simply using it. Inheritance
can be a useful tool, and I use it now and then in my own programs,
but it shouldn't be the first tool you reach for, and you probably
shouldn't actively go looking for opportunities to construct class
hierarchies (family trees of classes).


## The instanceof operator


It is occasionally useful to know whether an object was derived from a
specific class. For this, JavaScript provides a binary operator called
`instanceof`.

```
const ufoData = ["https://images2.imgbox.com/90/61/bP8foIzS_o.png", 
                 350,225,  1, 2 ]

console.log(
  new BouncingSprite(...ufoData) instanceof BouncingSprite);
// → true
console.log(new BouncingSprite(...ufoData) instanceof Sprite);
// → true
console.log(new Sprite(...ufoData) instanceof BouncingSprite);
// → false
console.log([1] instanceof Array);
// → true
```

The operator will see through inherited types, so a `BouncingSprite`
is an instance of `Sprite`. The operator can also be applied to
standard constructors like `Array`. Almost every object is an instance
of `Object`.

note}}


{{skip

## Inheritance

{{index inheritance, "matrix example", "object-oriented programming", "SymmetricMatrix class"}}


Some matrices are known to be _symmetric_. If you mirror a symmetric
matrix around its top-left-to-bottom-right diagonal, it stays the
same. In other words, the value stored at _x_,_y_ is always the same
as that at _y_,_x_.

Imagine we need a data structure like `Matrix` but one that enforces
the fact that the matrix is and remains symmetrical. We could write it
from scratch, but that would involve repeating some code very similar
to what we already wrote.

{{index overriding, prototype}}

JavaScript's prototype system makes it possible to create a _new_
class, much like the old class, but with new definitions for some of
its properties. The prototype for the new class derives from the old
prototype but adds a new definition for, say, the `set` method.

In object-oriented programming terms, this is called
_((inheritance))_. The new class inherits properties and behavior from
the old class.

```{includeCode: "top_lines: 17"}
class SymmetricMatrix extends Matrix {
  constructor(size, element = (x, y) => undefined) {
    super(size, size, (x, y) => {
      if (x < y) return element(y, x);
      else return element(x, y);
    });
  }

  set(x, y, value) {
    super.set(x, y, value);
    if (x != y) {
      super.set(y, x, value);
    }
  }
}

let matrix = new SymmetricMatrix(5, (x, y) => `${x},${y}`);
console.log(matrix.get(2, 3));
// → 3,2
```

The use of the word `extends` indicates that this class shouldn't be
directly based on the default `Object` prototype but on some other class. This
is called the _((superclass))_. The derived class is the
_((subclass))_.

To initialize a `SymmetricMatrix` instance, the constructor calls its
superclass's constructor through the `super` keyword. This is necessary
because if this new object is to behave (roughly) like a `Matrix`, it
is going to need the instance properties that matrices have.
To ensure the matrix is symmetrical, the constructor wraps the
`content` method to swap the coordinates for values below the
diagonal.

The `set` method again uses `super` but this time not to call the
constructor but to call a specific method from the superclass's set of
methods. We are redefining `set` but do want to use the original
behavior. Because `this.set` refers to the _new_ `set` method, calling
that wouldn't work. Inside class methods, `super` provides a way to
call methods as they were defined in the superclass.

Inheritance allows us to build slightly different data types from
existing data types with relatively little work. It is a fundamental
part of the object-oriented tradition, alongside encapsulation and
polymorphism. But while the latter two are now generally regarded as
wonderful ideas, inheritance is more controversial.

{{index complexity, reuse, "class hierarchy"}}

Whereas ((encapsulation)) and polymorphism can be used to _separate_
pieces of code from each other, reducing the tangledness of the
overall program, ((inheritance)) fundamentally ties classes together,
creating _more_ tangle. When inheriting from a class, you usually have
to know more about how it works than when simply using it. Inheritance
can be a useful tool, and I use it now and then in my own programs,
but it shouldn't be the first tool you reach for, and you probably
shouldn't actively go looking for opportunities to construct class
hierarchies (family trees of classes).

## The instanceof operator

{{index type, "instanceof operator", constructor, object}}

It is occasionally useful to know whether an object was derived from a
specific class. For this, JavaScript provides a binary operator called
`instanceof`.

```
console.log(
  new SymmetricMatrix(2) instanceof SymmetricMatrix);
// → true
console.log(new SymmetricMatrix(2) instanceof Matrix);
// → true
console.log(new Matrix(2, 2) instanceof SymmetricMatrix);
// → false
console.log([1] instanceof Array);
// → true
```

{{index inheritance}}

The operator will see through inherited types, so a `SymmetricMatrix`
is an instance of `Matrix`. The operator can also be applied to
standard constructors like `Array`. Almost every object is an instance
of `Object`.

skip}}

## Summary

So objects do more than just hold their own properties. They have
prototypes, which are other objects. They'll act as if they have
properties they don't have as long as their prototype has that
property. Simple objects have `Object.prototype` as their prototype.

Constructors, which are functions whose names usually start with a
capital letter, can be used with the `new` operator to create new
objects. The new object's prototype will be the object found in the
`prototype` property of the constructor. You can make good use of this
by putting the properties that all values of a given type share into
their prototype. There's a `class` notation that provides a clear way
to define a constructor and its prototype.

You can define getters and setters to secretly call methods every time
an object's property is accessed. Static methods are methods stored in
a class's constructor, rather than its prototype.

The `instanceof` operator can, given an object and a constructor, tell
you whether that object is an instance of that constructor.

One useful thing to do with objects is to specify an interface for
them and tell everybody that they are supposed to talk to your object
only through that interface. The rest of the details that make up your
object are now _encapsulated_, hidden behind the interface.

More than one type may implement the same interface. Code written to
use an interface automatically knows how to work with any number of
different objects that provide the interface. This is called
_polymorphism_.

When implementing multiple classes that differ in only some details,
it can be helpful to write the new classes as _subclasses_ of an
existing class, _inheriting_ part of its behavior.

## Exercises

{{id exercise_vector}}

### A vector type

{{index dimensions, "Vec class", coordinates, "vector (exercise)"}}

Write a ((class)) `Vec` that represents a vector in two-dimensional
space. It takes `x` and `y` parameters (numbers), which it should save
to properties of the same name.

{{index addition, subtraction}}

Give the `Vec` prototype two methods, `plus` and `minus`, that take
another vector as a parameter and return a new vector that has the sum
or difference of the two vectors' (`this` and the parameter) _x_ and
_y_ values.

Add a ((getter)) property `length` to the prototype that computes the
length of the vector—that is, the distance of the point (_x_, _y_) from
the origin (0, 0).

{{if interactive

```{test: no}
// Your code here.

console.log(new Vec(1, 2).plus(new Vec(2, 3)));
// → Vec{x: 3, y: 5}
console.log(new Vec(1, 2).minus(new Vec(2, 3)));
// → Vec{x: -1, y: -1}
console.log(new Vec(3, 4).length);
// → 5
```
if}}

{{hint

{{index "vector (exercise)"}}

Look back to the `Rabbit` class example if you're unsure how `class`
declarations look.

{{index Pythagoras, "defineProperty function", "square root", "Math.sqrt function"}}

Adding a getter property to the constructor can be done by putting the
word `get` before the method name. To compute the distance from (0, 0)
to (x, y), you can use the Pythagorean theorem, which says that the
square of the distance we are looking for is equal to the square of
the x-coordinate plus the square of the y-coordinate. Thus, [√(x^2^ +
y^2^)]{if html}[[$\sqrt{x^2 + y^2}$]{latex}]{if tex} is the number you
want, and `Math.sqrt` is the way you compute a square root in
JavaScript.

hint}}

### Groups

{{index "groups (exercise)", "Set class", "Group class", "set (data structure)"}}

{{id groups}}

The standard JavaScript environment provides another data structure
called `Set`. Like an instance of `Map`, a set holds a collection of
values. Unlike `Map`, it does not associate other values with those—it
just tracks which values are part of the set. A value can be part
of a set only once—adding it again doesn't have any effect.

{{index "add method", "delete method", "has method"}}

Write a class called `Group` (since `Set` is already taken). Like
`Set`, it has `add`, `delete`, and `has` methods. Its constructor
creates an empty group, `add` adds a value to the group (but only if
it isn't already a member), `delete` removes its argument from the
group (if it was a member), and `has` returns a Boolean value
indicating whether its argument is a member of the group.

{{index "=== operator", "indexOf method"}}

Use the `===` operator, or something equivalent such as `indexOf`, to
determine whether two values are the same.

{{index "static method"}}

Give the class a static `from` method that takes an iterable object
as argument and creates a group that contains all the values produced
by iterating over it.

{{if interactive

```{test: no}
class Group {
  // Your code here.
}

let group = Group.from([10, 20]);
console.log(group.has(10));
// → true
console.log(group.has(30));
// → false
group.add(10);
group.delete(10);
console.log(group.has(10));
// → false
```

if}}

{{hint

{{index "groups (exercise)", "Group class", "indexOf method", "includes method"}}

The easiest way to do this is to store an ((array)) of group members
in an instance property. The `includes` or `indexOf` methods can be
used to check whether a given value is in the array.

{{index "push method"}}

Your class's ((constructor)) can set the member collection to an empty
array. When `add` is called, it must check whether the given value is
in the array or add it, for example with `push`, otherwise.

{{index "filter method"}}

Deleting an element from an array, in `delete`, is less
straightforward, but you can use `filter` to create a new array
without the value. Don't forget to overwrite the property holding the
members with the newly filtered version of the array.

{{index "for/of loop", "iterable interface"}}

The `from` method can use a `for`/`of` loop to get the values out of
the iterable object and call `add` to put them into a newly created
group.

hint}}

### Iterable groups

{{index "groups (exercise)", interface, "iterator interface", "Group class"}}

{{id group_iterator}}

Make the `Group` class from the previous exercise iterable. Refer
to the section about the iterator interface earlier in the chapter if
you aren't clear on the exact form of the interface anymore.

If you used an array to represent the group's members, don't just
return the iterator created by calling the `Symbol.iterator` method on
the array. That would work, but it defeats the purpose of this exercise.

It is okay if your iterator behaves strangely when the group is
modified during iteration.

{{if interactive

```{test: no}
// Your code here (and the code from the previous exercise)

for (let value of Group.from(["a", "b", "c"])) {
  console.log(value);
}
// → a
// → b
// → c
```

if}}

{{hint

{{index "groups (exercise)", "Group class", "next method"}}

It is probably worthwhile to define a new class `GroupIterator`.
Iterator instances should have a property that tracks the current
position in the group. Every time `next` is called, it checks whether
it is done and, if not, moves past the current value and returns it.

The `Group` class itself gets a method named by `Symbol.iterator`
that, when called, returns a new instance of the iterator class for
that group.

hint}}

### Borrowing a method

Earlier in the chapter I mentioned that an object's `hasOwnProperty`
can be used as a more robust alternative to the `in` operator when you
want to ignore the prototype's properties. But what if your map needs
to include the word `"hasOwnProperty"`? You won't be able to call that
method anymore because the object's own property hides the method
value.

Can you think of a way to call `hasOwnProperty` on an object that has
its own property by that name?

{{if interactive

```{test: no}
let map = {one: true, two: true, hasOwnProperty: true};

// Fix this call
console.log(map.hasOwnProperty("one"));
// → true
```

if}}

{{hint

Remember that methods that exist on plain objects come from
`Object.prototype`.

Also remember that you can call a function with a specific `this`
binding by using its `call` method.

hint}}
