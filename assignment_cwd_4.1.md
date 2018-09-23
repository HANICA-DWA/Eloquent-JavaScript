# RrHN Continued: Adding a preferences form.


Create the preferences forms as it was shown in class. In the preparations folder you'll find some HTML and CSS that you can copy.

![RrHN with preferences](https://images2.imgbox.com/71/42/cIbhBW58_o.png)
_Notice the gear-icon ⚙️ in the header of the left-column.  
Please ignore the "Mark all items as seen" button and the different colors of the titles in the left-hand column. That will be the next task._

### Step 6: Add a component for the Preferences Dialog.
* Create a React Component for the Preferences dialog. You can, if you want, use the supplied example HTML and CSS as a head-start.
* Add a boolean to the `App` state that determines whether the preferences dialog is visible.
* Change the render-method of `App` to show the preferences dialog instead of the iframe (or the "No item selected"-screen), _iff_ the boolean you just added to the app state is true. ('iff' means 'if-and-only-if')
* Test whether the PreferencesDialog can be shown in your app.  
If you're using the CSS file we're supplying, don't worry if you lost the color in the app. You'll fix that in step 8.

### Step 7: Create local state for the preferences dialog
* The preferences dialog should copy the current prefs to it's local component state.
* Add event handlers to both the input field and the select box, to allow the user to change the input of the controlled form elements.
* If the number of items-field has a value that is < 0 or > 500, give the input field a red border.

### Step 8: The `App` should have prefs.

* The `App` should also keep the preferences info in its component state. Give _its_ state two fields for color and list size. Choose appropriate defaults.
* Make the color field work. If you're using the example HTML and CSS, this should be simple: The App component gets a second CSS-class, based on the color variable in the prefs of `App`: "orange", "green" and "brown" are supported by the CSS.
* Make the list size field work: pass the list size reference from `App` to `ItemList` as a prop, and have the Itemlist show the required amount of items.
* Decide how the ItemList will deal with possible 'bad' values of the list size prop (negative, larger than your data-array, not a number).

### Step 9: The Preferences Dialog should be initialized from the App preferences.

* Make sure that whenever the preferences dialog is shown, the values for the input field are initialized according to the corresponding values in `App`.
* You'll probably have to give some props to the PreferencesDialog to do this.

### Step 10: A button to show the PreferencesDialog

* Create a button in a header or footer of the ItemList to show the preferences dialog. In the image above, this is the gear-icon in the top-right corner of the items column on the left.
* You can, if you like use the fancy SVG-icon in the example HTML, but you may also simply create a regular HTML-button.
* This button is part of the ItemList component, but it must change the value in the state of `App` that controls whether the PreferencesDialog is shown. Create an event handler in `App` that can  be passed to `ItemList` as a prop to accomplish this. (Make sure the event handler calls `setState` properly, and is bound correctly).

### Step 11: Have the Cancel-button close the dialog.

This step is similar to the previous one.
* Create an event handler in `App` that can  be passed to `PreferencesDialog` as a prop that sets the visibility boolean to false. (Make sure the event handler calls `setState` properly, and is bound correctly).
* Have the Cancel-button in the PreferencesDialog use that prop as its onClick handler.

### Step 12: Have the OK-button update the preferences in the state of `App`.
* Create a method (called `applyPreferences(color,listSize)`) that uses its parameters to update the preferences-data in the state of `App` (Make sure the event handler calls `setState` properly).
* Pass this method (bound properly) as a prop to `PreferencesDialog`.
* Give the OK-button in `PreferencesDialog` a local event handler, whose task is to call the passed-in prop (that points to `applyPreferences`) with the correct parameters.
* this local event handler should also close the dialog (using the same callback that the Cancel-button uses.)

{{exCommit "Stuur je commit in" "RRHN-assignment4.1"

exCommit}}