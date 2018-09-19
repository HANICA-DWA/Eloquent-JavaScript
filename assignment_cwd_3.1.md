# The React-redux Hacker News client

In this series of assignments, you're going to build an alternative front-end application to the famous Hacker News site. **Hacker News (HN)** is a site whose audience focuses on all kinds of subjects that revolve around software engineering and the Silicon Valley start-up culture. It is also one of the very best places to learn about interesting developments in modern web technology, so every web developer should visit HN regularly.

The official site allows people to **post and up-vote interesting articles** or other items from the internet. Other users can then add comments to the items, and comments can be up- and down-voted. From the submitted items, and their up-votes (and a bit of artificial intelligence), the HN front page is composed, and updated regularly. This front page is called the list op **Top Stories**.

The official HN site has a very simple user-interface. It is neither very user friendly, nor good looking.

![Hacker News front page example](https://images2.imgbox.com/e7/ad/MLwA0iGP_o.png)

 Because of this, there are a number of alternative font-ends which we'll call _HN clients_. Some of these clients are Web apps, others are mobile applications. They get their data from either the official HN API, or by _scraping_ the offical website.

In contrast to almost all of these HN clients, we're not looking to duplicate all the features of HN. We're going to build an **SPA that focuses on _lurkers_**. Our lurkers are people who visit HN very often (even compulsively, sometimes), but who are not interested in participating in the comment-threads, or in voting for items or comments. Lurkers just need a very good **HN viewer**.

## The RrHN client

Ultimately, the RrHN app will consist of both a client-side SPA and a server app. This server app has two jobs:
1. To keep track of which items have been either _read_ by the user, or have already been _seen_ by the user.
2. To provide a more convenient API to the RrHN client than the official HN API. (The official API requires 61 HTTP requests to get a list of 60 HN items. Our API sends all items in a single HTTP response.)

This server will be provided to you in a few days. Your job will be to create the RrHN client. This client will add two features that is are important to compulsive lurkers:
1. It will highlight the items on the HN front page that have newly appeared since the last time the lurker checked the front page.  
2. It will allow the user to see the web pages that HN items refer to, _without_ the user having to leave the list of top stories (by displaying the list and the website side-by-side)

Here is an example of what the RrHN could look like:
![RrHN client example](https://images2.imgbox.com/13/06/41C4UWYU_o.png)  
Note the list of top stories on the left with new items highlighted in orange.

Evetually, the RrHN client will use the following technologies:
* Facebook's **React** to create the DOM for the user-interface.
* **React-router** to give the Single Page App  multiple entry points by URL.
* **Redux** to manage the application data in a way that allows the programmer to use a _time-travelling debugger_.
* AJAX to communicate with the RrHN-server.
* **create-react-app** to configure the app to use _Webpack and Babel_ to transpile and bundle your JS-modules before sending them to the browser.
* **ES6**: class syntax, `const` and `let`, arrow functions, modules etc. 

## Step 1: project setup.

👉 Make sure you've downloaded or git-cloned the starter files to you own system.

👉 Open a command-line terminal, and navigate to the directory with the RrHN-client.  

👉 The project in the starter-files uses NPM modules, both for the code itself (react etc.) and for some development tools (webpack, babel). Install all the modules you need by executing:
```
npm install
```

👉 You'll be using the _Webpack development server_ to bundle the JS modules, and serve the client to the browser. Start the Webpack development server from the command-line like this:
```
npm start
```

👉 Open a web-browser, and have it navigate to [http://localhost:3000](http://localhost:3000). You should see a web-page telling you that there are 60 Hacker News items available.

![Hacker News front page example](https://images2.imgbox.com/b9/db/hQhKlYl8_o.png)

#### step 1 – reflection

These steps verify that you've got a working project set-up. These are a few aspects of the set-up you've just downloaded and started:

*  It contains **a minimal React app**. See in the source code how a React component called 'App' is loaded. The app also uses JSX syntax.
*  It is created using `create-react-app`, and `create-react-app` has configured **Webpack** to use the **Babel transpiler** to convert JSX and ES6 to ES5. The code uses ES6 class-syntax to create the React component.
*  It does not (yet) use live data from HN. Instead, **a static data file** with 60 test-items is provided ('src/frontpageData.js') that is imported like a normal ES6 module.
*  The main HTML-file is called `index.html`, and it lives in the `public` directory. This directory is the directory that static files (i.e. html, css, images etc.) are served from. You don't use the name 'dist' as part of the URL for any of these files.
* Note, however, that the main CSS file is _not in the public_ directory. It is in the `src` directory, and an import statement in `index.js` makes sure that the css is included in your app and on the webpage.

#### Some tips:

👍 Don't forget to do an `npm install` whenever you clone your repo on another computer, or merge-in new versions of the code you get from your teacher.

🍭 Layout in CSS can be a major pain-in-the-###, unless you use CSS Flexbox properties. The example HTML/CSS uses flexbox. If Flexbox is new to you, take some time to understand it. It will save you a lot of time.  
Here are some interactive guides to flexbox: [flexbox in 5 minutes](http://flexboxin5.com/) and [The Flexbox Game](https://www.flexboxgame.com/). Also, look at [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) to see the flexbox in code.

### One more step!

#### The trouble with iframes

If you take a look at the HTML examples, you'll see that right-hand side of the page shows site inside an iframe. Some sites don't want that, and they try to prevent to browser from showing their pages in an iframe.  
Modern browsers check for an HTTP header called `X-Frame-Options:`. If this header exists in the response, the browser will refuse to show the site in your iframe.  
This is unfortunate for the professional HN lurker who wants to view the list and the sites side-by-side.

👉 For this series of exercises, use install the Chrome extension "[Ignore X-Frame headers](https://chrome.google.com/webstore/detail/ignore-x-frame-headers/gleekbfjekiniecknbkamfmkohkpodhe)", or "[Ignore X-Frame-Options Header](https://addons.mozilla.org/en-US/firefox/addon/ignore-x-frame-options-header/)" for Firefox, to make the browser ignore  X-Frame-Options, so our RrHN iframe will work fine.

## Step 2: Show the first item in the list

Before we're going to create the entire list of items in the left column, let's create just a single list item.  

👉 Create a React component (in its own JSX file!) called `ListItem`, that receives a single HN item (like the ones in 'frontpageData.js') through it's `props`, and renders HTML that displays the item as it should appear in the left-column list. Something like this:

![an RrHN List Item](https://images2.imgbox.com/20/ea/sIIBK0zF_o.png)

👉 Adapt the `App` component to make sure the item appears in the left-column, and receives (through its `props`), the first item from the file 'frontpageData.js'.  
It is best if the `App`-component reads the `frontpageData.js` file, and hands down the data to it's sub-components (using `props`).

Your page does not have to have a right-hand area just yet, but if you do include one, it does not have to show anything.
💄 The image above is based on the example HTML and CSS. **You don't have to use those**. Feel free to create your own styling for your project.

## Step 3: Show a list with all 60 items.

👉 Create a new React component called `ItemList`. Its job is to receive _the entire list of HN items_, and render a complete list in the left-hand column.

👉 It should use the list of HN items to create a list of `ListItem` components, which it can render.

🍭 For creating a list (array) of new output values, based on another list of input values, one typically uses [the array method `map()`](http://adripofjavascript.com/blog/drips/transforming-arrays-with-array-map.html).

👉 Adapt your `App` component to render an `ItemList` instead of a `ListItem`.

## Step 4: show some content in an iFrame in the right-hand area of the page.

👉 Create a new component called `IFrameArea`. This component should render an `<iframe>` which fills the right-hand area of the page. It should receive the URL of the page to show in the iframe from its `props`.

👻 iFrames are tricky to layout using CSS. They don't cooperate in the way you expect from `<div>`s or other bock-level elements. Flexbox, however, works fine with iframes, so use it here. If you're using the example HTML and CSS, this is already done for you.  

Some sites contain JS code to detect it they're in an iframe, and try to interfere with the surround page, or annoy the user.  
👉 Prevent this by copying the `sandbox`-attribute on the iframe (by copy-pasting it from the example HTML if you want).

👉 Adapt your `App` component to fill the right-hand area with the `IFrameArea`, using a hard-coded URL such as `http://www.teletubbies.com/`.  
_Making the right-hand area respond to clicks on items in the left-hand column is the goal of the next step, not this one._


#### adding some application state

The URL for the IFrameArea will change while the user is playing with the application. This requires us to introduce some _application state_ into our app: a variable that contains changing information during the lifetime of our app.

❓ Think about it: Which React component should store this application state? The `App`, `ItemList`, `IFrameArea`, or (one of) the `ListItems`?

Instead of just keeping track of the current URL for the iframe, it's going to be useful to store (a reference to) the _entire HN item_ that the user is currently viewing.  
But: every HN item has three representations in our app:
1. The data-object from 'frontPageData.js'.
2. The corresponding `ListItem` React component, as is will be generated by the `ItemList` component, and
3. The final DOM/HTML structure that is shown to the user by the browser.
  In React applications, application state should refer to data-objects, not to React components or DOM elements. So we'll store the data-object from 'frontPageData.js' that describes the HN item the user is viewing. From this data-object, we'll extract the URL to feed the `IFrameArea`.

👉 Give the component of your choice a field _inside its `state` field_, that will refer to the data-object of the _selected HN item_. Call this field `selectedItem`, and initialize its value to the first (or second, third, whatever) item in the item list from 'frontpageData.js'.

👉 Make sure that the `IFrameArea` shows the site of the HN item that is now being stored in the application state.

## Stap 6: Stuur je uitwerking in.

👉 Commit je code voor alle opdrachten in dit document naar je persoonlijke DWA repo.

{{exCommit "Stuur je commit in" "RRHN-assignment3.1"


exCommit}}


# The RrHN  client: next steps.

## Step 4 (continued)

In step 4 of the preparation, students were give a choice about in which React component to store the selected HN item as component state. The correct answer would be: the `App` component, since it is the parent of both the `IFrameArea` (that needs information from this state), and of the `ItemList` and its `ListItems` (which cause this state to mutate when the user clicks on an item).


## Step 5: responding to the user.

We're going to add an 'onClick'-event handler to all ListItems to load the corresponding URL in the IFrameArea.

👉 In your `App` component, create a _new method_ called 'onSelectItem', that takes no parameters, returns nothing, but simply uses `console.log()` to inform you that it is running.

### 5a: passing event handlers down the component hierarchy

Each `ListItem` component should call the new `onSelectItem` method on `App`, whenever its title (in the left-hand column) is clicked by the user. Here's how to accomplish that in the idiomatic "React way":  
👉 Have the `App` component hand the `onSelectItem` method to the `ItemList` as a `prop`.  
👉 Have the `ItemList` component hand the `onSelectItem` method (it received in its `props`) to each `ListItem` (again, as a `prop`).  
👉 Every `ListItem` will use the method it received as the `onClick` attribute for the title of the list item (in the final HTML).


#### Checking and testing

🍭 `console.log` is your friend here. You can use it to make sure that all components are actually receiving the event handler as a prop. There is, however, something much cooler: **[The React Developer Tools](https://github.com/facebook/react-devtools)**, an extension for both Chrome and Firefox.

👉 Make sure that every `ListItem` component actually receives the event handler, using either de React DevTools or `console.log`.

👉 Test your app in the browser to make sure a click on an item title actually results in console.log output in the browser. **THIS FAILS.** Clicking on an `<a>`-element will cause the browser to navigate to a new page, an no eventhandler will be executed.

❓ Someone should call `event.preventDefault()`. **Should this be the `App` component or the `ListItem`?** Answer: _the ListItem_, because that's the component where it was decided that a click on an `<a>`-element would trigger the change. The `App` component should not contain code that deals with pieces of UI that are the responsibility of other components.

👉 Make a local function, _inside the render-method_ for `ListItem`, that calls both `event.preventDefault()` and `this.props.onSelectItem()`. Install that function as an event handler on the `<a>`-element.  

*Note:* We're creating a local function inside `render()` to circumvent the same kind of binding problems that are the subject of [the video](https://youtu.be/Z1UeeJiK64A), and of step 5c.

### 5b: The event handler should get the item as a parameter.

Telling the `IFrameArea` what item to show, is a task for the `App` component, because it is the creator of the `IFrameArea`. That's why the `onSelectItem` method is being defined inside the `App` component.  
But when `onSelectItem` is called to handle this task, it needs to know _which item_ was clicked. In idiomatic React we pass this info as a parameter to the function that was passed as a prop from `App` (via `ListItem`). An `onClick` event handler will not do this automatically.


👉 change the new method `handleTitleClick` to pass the correct item-data to the function in `this.props.onSelecteItem()`. Verify that the `onSelectItem` -method in `App` actually receives the correct item-data.

👉 Have the `onSelectItem`-method in `App` use the item parameter to update the state of the `App` component, using `this.setState(...)`. Try this out in the browser. **THIS FAILS** due to `this` not being bound to the `App`-component anymore. Verify by using console.log to output `this` from `onSelectItem` (in `App`).

### 5c: binding the eventhandler.

[The video about event handlers and classes](https://youtu.be/Z1UeeJiK64A) explains how methods that are copied into eventhandlers will not be called with the "correct" value for `this`.


👉 Use binding in the `render` method to make sure a properly bound version of the `onSelectItem` function is passed down to `ItemList` (and `ListItem`).  
Choose which or the three styles from the video you prefer: 
1. Using an arrow-function as the value for the event handler in the JSX. e.g. `onClick={ event => this.handler(event) }`
1. Using the `bind` function, e.g. `onClick={this.handler.bind(this)}`
1. Using class properties, e.g. `handler = (event) => {...}` instead of a normal method definition.

👉 Add a `console.log` to the onSelectItem method in `App` to verify that `this` now has the correct value. You should, also, no longer see an error about `this.setState(...)` not working.

👉 Use the React DevTools to show how one can inspect the state of a component. Verify that the entire event-handling mechanism is working properly: a click on a title of a `ListItem` should result in a state change in `App`.

### Step 5d: Hooking up the IFrameArea

🏁 **Final lap:** Have the App component hand the url of the selected item to the IFrameArea.

If the IFrameArea is working properly, this should result in a working application: A click in the item list causes the app to load the selected item into the iframe.

🎓 This is a good time to review the React style of connecting data to UI:
* All app-state is kept in the **'state' field** of React components.
* If multiple components need access to the same state (for reading or mutating), the state is kept in the **lowest common parent** of those components (assuming the root is high, and the leaves are low).
* Any lower components that need to read this state, are given the relevant parts of the state as **props**.
* Any lower components that need to mutate the state **receive a function** from the common parent (that keeps the state), also as a prop.
* This function must be **bound to the state-keeping parent**, and is usually invoked by an event handler of the lower comonent.
* The state-changing function calls the **setState()** method of the state-keeping component.
* calling `setState()` on the state-keeping parent will **cause all children to re-render** (if needed -- React can optimize unneeded renders away).
* _so mutating the state in a common parent will automatically result in an update of all components whose DOM representation should change._
* The result is that the component-tree usually consists of a few state-keeping components near the root of the tree, and many more stateless (or even functional) components further down the hierarchy.

**DONE!!** _(for now)_


{{exCommit "Stuur je commit in" "RRHN-assignment3.2"

exCommit}}