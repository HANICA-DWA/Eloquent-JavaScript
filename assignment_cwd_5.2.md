# Routing in the RrHN-client

Somewhere in the your `App` component, probably in the `render()` method, you have some code that decides what to use in the right-hand area of the window. It's probably a couple of if-statements, and they are probably looking at the state-variables that control the visibility of the `PreferencesDialog` (in my code a boolean called `this.state.showPrefs`), and which HN item is elected in the left-hand column (in my code `this.state.selectedItem`).

At the end of this workshop:
* those if-statements and the variables that control them will have disappeared from your code.
* users can create bookmarks to individual HN-items, and to the preferences Dialog.
* _and_ the Back-button will work inside the app!

## See the problem

 👉 try this:
* Get the servers (dev-server and the RrHN-server) running, and
* open the RrHN-client in your browser.
* Select an interesting item in the left-column, and have the site become visible in the right-hand area.
* Now, **create a bookmark** for this interesting site inside the RrHN-client.
* Close the browser-tab that contained RrHN-client.
* **Use the bookmark** to open it again in a _new tab_.
* ❗️ Notice that the interesting site you selected earlier _is not_ visible.

That's not strange: a bookmark is _just a stored URL_, and the URL that you bookmarked contained no information telling the browser, or the RrHN-client which item the bookmark was supposed to point to.

### URLs in the client

We need the RrHN-client to use bookmarks that look with path-segments like this:
```
http://localhost:3000/item/12627944
```

Let's build client-side routing into RrHN-client. And let's also have RrHN understand this URL to point to the Preferences Dialog:
```
http://localhost:3000/preferences
```

## Routing for the preferences dialog

Let's start with the simplest task: supporting these URLs:
1. `http://localhost:3000`, and
2. `http://localhost:3000/preferences`

For both URLs, the app should show the left-hand column, but:
* for the first URL, it should show the message _"No item selected yet"_ (just like now),
* for the second URL, it should fill the right-hand area with the preferences dialog.

Basically, we'll use routing to decide the contents of the _right-hand area_ of the window. The left-hand column will always be visible, irrespective of the current URL.


### Step 31: Preparation
👉 If you haven't done so already, create a React component for the 'empty'-panel that shows the *"No item selected yet"* message, and export it from the ES6 module (in the code below, I'll call it `EmptyPanel`);

### Step 32: install react-router in your project
👉 `npm install --save react-router-dom`


👉 Open the file `index.jsx` in your editor.

👉 Import the `BrowserRouter` component from react-router-dom into `index.jsx`.  
Also, import the `EmptyPanel` and `PreferencesDialog` components from their modules.

👉 In `index.jsx`, remove the last 2 lines, with `ReactDOM.render(...)`, and put the following code in its place:
```js
const theAppWithRouting =
   <BrowserRouter>  
      <RRHN_App />
   </BrowserRouter>

ReactDOM.render( theAppWithRouting,
                 document.getElementById('react-root') );
```

**Note:** We haven't arranged for any actual client-side routing yet. No component is deciding what to show in the right-hand panel by looking at the URL yet. That was a job for the RRHN_App component, and it still is.  
Here we've just put the router infrastructure in place.

### Step 33: Getting the "empty"-route to work

While getting the "preferences"-route to work will require some more work, we should be able to test the "empty"-route in a few moments, after _refactoring_ some code in the `App` component.

👉 Import the `Switch` and `Route` components from *react-router-dom*.

❗️ From now on, you're going to be making big changes in code that you wrote yourself. Because of this, the instructions in the next steps are necessarily a bit more abstract.

👉 Find, in your `App`-component, the code that decides what component to show in the right-hand area. **Comment it out**. All of it. Not just the code for showing the empty panel message, but also the code for showing the iframe or the preferences dialog.

👉 Change the `render()` function of your `App`-component to render a `<Switch>` containing *one* `<Route>` component that shows the `EmtpyPanel` in the right-hand area, *when the path of the URL if just '/'*.  
❓ Should you use the `exact` attribute (from react-router) or not?  
❓ What attribute would be best for specifying what the Route should show: `component={...}` or `render={()=>...}`. (Hint: while the `component` attributes seems a lot simpler than the `render` attribute, it is actually only a little bit simpler. The `render` attribute is, however, *much more* powerful and flexible.)


💔 Don't worry (for now) about the not showing the iframe or the preferences anymore. We'll address those issues in a few steps. For now, we're focussing on getting the "empty"-route to work, and won't mind if we're leaving the rest of the app in a broken state.

**Note:** The React Hot Loader is great, but not so much when (1) you're changing top-level components, or (2) changing initializing code (for example, class constructors). For the steps in this document, don't rely too much on hot reloading. Just press the reload-button in the browser whenever you test.

👉 Verify that your app is showing the `EmptyPanel` when the URL is `http://localhost:3000/`.  
Also verify that it is *not* showing that `EmptyPanel` if the URL is something like `http://localhost:3000/item/12345567`.

### Step 34: Navigating to the Preferences Dialog

Did you give your RrHN-client some kind of button or link to show the preferences dialog? (If not, create one -- a good place might be in a header above the list of items in the left-hand column.)  
If you did, it probably worked by using a prop containing a function that changed a boolean in the state of `App`. This boolean controls the visibility of the PreferencesDialog component.

That mechanism doesn't work anymore, because you've disabled the code that uses the boolean to decide what to render in the right-hand area.

👉 Get rid of the boolean:
* its initialization,
* the functions that change its value
* the props on any child-component for changing the boolean, and
* anything else involved with showing and hiding the dialog using this boolean.

Just kill the stuff 💀.

👉 import the `Link` compontent from react-router-dom into the file that renders the left-hand column.

👉 Remove the `onClick` prop on the setting button (or remove the `<a>` or `<button>` tags you might have put around it).

👉 place the settings-icon inside `<Link to="...">...</Link>` JSX-element. Make sure its URL-path is `/preferences`.  

👉 Test that a click on the preferences button changes the URL. Do not worry that the preferenced dialog is not shown yet. Just make sure the URL changed.  

Now return to the `<Switch>`-JSX inside the RRHN_App component.

👉 Add a `<Route>` component that shows the preferences dialog, *but only if* the URL has the path `/preferences`.  
Is it important to use the `exact` attribute on this `<Route>`?
Make sure that the PreferencesDialog component gets all the props it needs. Consider using the `{render=()=>...}` attribute on the `<Route>` for this.

👉 Verify that your app is showing the preferences dialog when the URL is `http://localhost:3000/preferences`.  
Also verify that it is *not* showing that `EmptyPanel` if the URL is something else.  
Finally, check that it also works when starting the app: open *a new browser-tab*, and enter `http://localhost:3000/preferences` in the address bar. It should load the SPA, *and* immediately show the preferences dialog.

### Step 35: Closing the PreferencesDialog

You could, if you were sloppy, use the same method (a `<Link>`) to get the Cancel-button to hide the Preferences Dialog. But in that case, the user's browser history will still contain an entry for when the user was looking at the Preferences Dialog. One, or a few, presses on the browsers Back-button would land the user with a dialog box she thought she had already closed. That's a counterintuitive UI design.  

It would probably be better to just have the Cancel-button do what the Back-button does: go one step back in the browsers history, returning the user to the page she was before she activated the PreferencesDialog. For this, we're going to work with the `history` object.

The `history`-object comes from a [separate npm-module](https://www.npmjs.com/package/history), and it is React-router's interface to the browser, and it underpins much of the functionality of React-router. One feature that the `history` offers is the goBack() method, that has the same effect as when the user presses the Back-button on the browser. It also contains some information that can be useful to components in some apps, so the designers of React-router decided to simply give your app access to the `history` object.

All children of `<Route>` components receive a reference to `history` as a *prop*.

In our case, you have probably used a `Route` with a `render={()=>...}` attribute (if you didn't, then how did you manage to pass props to the PreferencesDialog component?). The trick in getting the `history` object into your PreferencesDialog is to pass all parameters for the Route's render-attribute function as props into the PreferencesDialog. Like this:

```jsx
<Route path={«your path»}
        render={(routeProps)=>
           <PreferencesDialog
              «your original props»
              {...routeProps}
        }  />
```

The {...routeProps} in this code is a JSX fetaure. It allows you to inject the contents of an object as separate props into a JSX element. For us it is useful, because the `history` object is one of the fields in the routeProps parameter, and now we're passing is as one of the props into `PreferencesDialog`.

Here's how we can make the Cancel-button in the preferences dialog do a go-back:

👉 Find the `onClick`-prop for your Cancel-button. Replace its value with this:
```js
onClick={ () => this.props.history.goBack() }
```

👉 Test to see that this actually works. If not, fix any bugs.  

👉 Implement the same method for hiding the preferences dialog when the OK-button is clicked.  
Make sure that, if the user clicks "OK", the changes to the settings get communicated to the App component before the dialog is closed.

You can now show and hide the Preferences Dialog. Great work!

## Steps 37-44: Routing the item-URLs

We've covered everything important about routing in React, except for route-parameters, which are rather essential to almost any application. Luckily, the third (and most important) kind of URL we want the RrHN-client to support is a clear and simple example of a route with a param, the id:
```
http://localhost:3000/item/1234567
```

👉 *Make your RrHN-client work with these kinds of routes.* Instead of micro-managing your approach in small steps, we are going to leave you to decide for yourself how to solve this problem. We do, however, have some tips for you:

#### tips:
1. Use a named parameter to catch the actual id-value in the route for items.
1. The id-value that the Route reads from the URL will be available as a field in the `match.params` object that `<Route>`s pass to children. Like the `history` object, this `match` object is part of the `routeProps` that the route passes as an argument into the functions for it's `render` attribute. Here's an example you might find useful:
```jsx
<Route path="/some/path/with/a/:niceValue"
        render={ (routeProps) =>
           <SomeComponent prop1={1} prop2={2}
             prop3={routeProps.match.params.niceValue}
           />
        } />
```
1. You can remove the state-variable that holds the selected HN item. The id of this item is always available in match.params.
1. It is, therefore, useful to have a function or method that can find the complete item-object in the item-array, given an id. In recent JS versions (including ES6) arrays have a very useful method called `find()` that will do 90% of the work for you.
1. Marking HN items as "read" after they're clicked is still required. This seems a little bit more tricky, now that the Route handles the clicks on the item-titles. Luckily, a `<Link>` element can still have an `onClick={...}` prop. So an `ListItem` can still notify the `ItemList` or the `App` that a certain item must be marked as "read".
1. If you've implemented this correctly, you may notice something weird: When the Preferences Dialog is visible, a click on an item title will close the Preferences Dialog. This is new behavior, and it is actually a logical consequence of using routing to show/hide dialog boxes. But you could consider it to be lousy user-interface design. You don't need to fix this.
1. But if you do want to fix it, you have two options: (1) Disable clicking on item titles when the dialog is visible (not difficult), and (2) not use routing for the Preferences Dialog. :question: Which of these two solutions would be better, in your opinion?
1. One weakness in the app has to do with bookmarking: It a user makes a bookmark for an item, and a few days later the item is no longer in the top 500 stories that our RrHN server gets from the HN API, then our app can no longer find the item info that belongs with the id in the URL. _feel free to ignore that problem_.  
If, however you're not the type that likes to ignore problems, you could solve the problem by getting the data yourself, from [the official HN API](https://github.com/HackerNews/API). A simple GET request (using `fetch()`) to an URL like `https://hacker-news.firebaseio.com/v0/item/12628019.json?print=pretty` (just change the id) is enough to get the info for the item.

## Step 45: Bonus assignment: Comments

_This step is optional. Feel free to skip it if you have more intersting things to do :-)_

If you feel like perfecting the RrHN-client, here's an idea:  

All HN items can have _comments_. And the current RrHN-client does a bad job at integrating these comments in the user-experience of the app. The elegant solution might be to add a fourth kind of route (i.e. a 4th URL pattern) to the route. It could be like this:
```
http://localhost:3000/comments/1234567
```
Which would also show an iframe in the right-hand area, but loaded with the item's comments pages on the official Hacker News site (instead of the site that the item is about).

![RrHN with comments in right-hand area](https://images2.imgbox.com/a1/aa/IM4YeX9L_o.png)
_Notice the URL in the address bar._


{{exCommit "Stuur je commit in" "RRHN-assignment5.2"

exCommit}}