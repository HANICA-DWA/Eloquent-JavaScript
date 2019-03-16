# The 'reduxyfied' RrHN-client



## Assignment: Reduxify the Preferences Dialog

👉Look at the "preferencesReducer" in the Reduxified version of RrHN in the CWD repo in session 6.1.

*  There are TODO-comments for action creators and for the corresponding cases in the reducer.
*  There are also two TODO-comments in `Preferences.jsx` about connecting the presentational component to the Redux Store.
*  The assignment is to get the PreferencesDialog to work completely.
*  Tip: work backwards:
   *  What data- and function-props are used in the code for PreferencesDialogUI?
   *  What parameters might some of the functions need?
   *  Create the Action Creators.
   *  Hook-up the data-props and the function-props.
   *  Use the Redux DevTools to see the correct actions being dispatched.
   *  Implement the reducer code.
*  Even for controlled inputs, the state must be kept in the Redux store! Otherwise you wouldn't be able to use the time-traveling debugger for problems with user-behaviour while editing values in the dialog.
* Feel free to use the [Immer library](https://github.com/mweststrate/immer), which makes it a lot easier to create reducers that keep the data immutable. Here's the [introduction](https://egghead.io/lessons/redux-simplify-creating-immutable-data-trees-with-immer).

{{exCommit "Stuur je commit in" "RrHN-assignment6.1"

exCommit}}