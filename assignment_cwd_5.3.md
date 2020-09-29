# Workshop React Hooks

Before we add the full power of React Hooks to the RRHN we first want to get accustomed to its syntax and its use.

Let's look at a basic example where we try to move from a class-based component to a functional component using Hooks. First let's take a look at the app we're using. We're using a simple little Pokemon search app (see workshop folder for session 5.2). 

Let's look at the main `App.js`:

```jsx
class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      query: '',
      history: ['charizard', 'vaporeon', 'bulbasaur'],
      activePokemon: eevee
    }
  }

  searchPokemon (query) {
    this.setState({query: query})
    fetch(`${API_URL}/${query}`)
    .then(response => response.json())
    .then(data => {
      this.setState({
        activePokemon: data,
        history: uniq(this.state.history.concat(query))
      })
    })
  }

  render () {
    console.log(this.state.activePokemon)
    return <div className="App">
      <header className="App-header">
        <p>Find your own Pokemon now!</p>
        <div className="search">
          <FindPokemon value={this.state.query} onChange={(e) => this.searchPokemon(e.target.value)} />
          <SearchHistory
            onClick={(historical) => {this.searchPokemon(historical)}}
            history={this.state.history}/>
        </div>
      </header>
      <Pokemon pokemon={this.state.activePokemon} />
    </div>
  }
}
```

Basically we would like to work on 3 things:

👉🏻 Class based component --> functional component

👉🏻 Replace the state with the `useState` hook

👉🏻 Replace all side effects (methods that use fetch with `useEffect`)



## Class based --> functional component
Let's first get rid of all of the class stuff. Which means that the function will have to return everything that is now returned in the `render` function.
```jsx
function App (props) {

    /*....
     this is where we will put the hooks
    */

    return <div className="App">
        {/* the rest of the render */}
    </div>
}
```

## Replace all state with 'hooks'
Now for the difficult part. We have a number of things that we're keeping track of in the state: 
* the query,
* the history
* and the current pokemon data

Let's start with the query using the hook `useState` with the initial data being empty:

```jsx
function App (props) {

    const [query, setQuery] = useState('')

    /*....
     the rest
    */
}
```

The way useState works is kind of weird. We call the function and get an array of objects back. We use destructuring to assign these to `query` and `setQuery`. But we could just as well do this:
```js
const query = useState('')

query[0] // the query data
query[1]('New Query') // the set function for the query
```

Writing the change handler is now extremely simple. Below are the differences between the class-based components using the `setState` style and below that is the functional component with `useState`
```js
/// stateful class-based component
  <FindPokemon value={this.state.query} onChange={(e) => this.searchPokemon(e.target.value)} />

/// 
  <FindPokemon value={query} onChange={(e) => setQuery(e.target.value)} />
/// rest of render
```

There is only one problem. We also need rewrite the rest of the change handler, fetching the data etc. We'll do that below in the [Replace all side effects section](#replace-all-side-effects)

* Let's do the same for the history (you can do it :party:)
* And for the active / current pokemon data


## Replace all side effects

With React Hooks any kind of side effects, things that result in a function not being pure because there is a different outcome, should go in `useEffect`. In our case everything in the class-method: `searchPokemon` should be done in an effect. So that would look something like this:

```js
useEffect(() => {
  fetch(`${API_URL}/${query}`)
    .then(response => response.json())
    .then(data => {
      /// here we (or rather you) should change the history and the activePokemon
    })
})
```

Now open the network tab in your Developer Console. Does anything stand out? Try to find out a fix for this problem.
