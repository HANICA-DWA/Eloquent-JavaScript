# Hooks in the React Hacker News Client

Now that we have a feel what React Hooks can do. We can implement in the React
Hacker News Client.


Let's start with something relatively simple: the Preferences Dialogue. We will 
go through the same steps as we did with the pokesearch:

* Class based component --> functional component
* Replace the state with the `useState` hook
* Replace all side effects (methods that use fetch with `useEffect`)


The Preferences Dialogue, should be a

👉 functional component

👉 should only use state with `useState`

{{exCommit "Stuur je commit in" "RrHN-assignment5.4"

exCommit}}