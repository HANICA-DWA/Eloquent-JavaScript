# RrHN continued: now with a server!

In de folder "RRHN-server" you find a very simple server that does two things:
1.  It provides a **list of the _current_ Hacker News Top Stories**. This list is between 400 and 500 items big (the server filters out items that are not stories, such as job postings and polls).  
This service is provided because the official HN REST API is not very programmer-friendly: it only provides the `id`s of the top stories, requiring the programmer go go and fetch each of the 500 items in separate HTTP requests.
2. It stores _item statuses_: An item in RrHN can be `new`, `seen` or `read`, which makes the item look different in the user interface.  
The server has HTTP end-points for storing the status of an item, and for getting all item-statuses.


![RrHN client with differently colored titles depending on status](https://images2.imgbox.com/ee/6d/O5fkPlFq_o.png)
_In this version of th RrHN client, items that are `new` have an orange title. The `read` items have a grey title, and the `seen` items have a black title.  
One exception: the designer of this version has chosen to give the highlighted title a black color, even though its status has alread been set to `read`._


### Step 13: Getting to know the server.

👉 Read the README.md file in the directory of the server to get familiar with it.

👉 Get the server to run: `npm install`, followed by `node app.js`.

👉 _Curl_ is command to send HTTP commands from the commandline. Try talking to your server:
```sh
curl http://localhost:3000/hn/topstories
```

### Step 14: Getting Item-statuses

👉 Let's get some item-statuses!

```sh
curl http://localhost:3000/itemStatuses
```

Note that this disappointing result is because there's nothing in the DB yet.

👉 Start your client Webpack server.

👉 Use the DevTools of the browser to get the `id`s of the first three HN items.

👉 Use Curl (or Postman) to change the itemStatus of those items (replacing `__id_x__`):

```
curl --request PUT --header 'Content-Type:text/plain' --data 'seen'  localhost:3000/itemStatuses/__id_1__
curl --request PUT --header 'Content-Type:text/plain' --data 'read'  localhost:3000/itemStatuses/__id_2__
curl --request PUT --header 'Content-Type:text/plain' --data 'seen'  localhost:3000/itemStatuses/__id_3__
```

👉 Now look at the itemStatuses again:
```sh
curl http://localhost:3000/itemStatuses
```

**Note:** the datastructure is different from a regular REST request. Examine the difference.  
❓ Why would this datastructure be more useful in the RrHN client?

### Step 15: Using item statuses in the client

Let's have the client go get the statuses, and use them to change the look of HN items in the left column.

In React data coming from a server, using AJAX requests needs to be stored as part of a component. This ensures that when the data arrives from the server, a callback can call `setState()` with the new data, and the React components that need to show this data are updated automatically.

❓ Which component in the React app should be the one storing the set of item-statuses? `App` again? `ItemList`? Or should we take the strucure apart and let each `ListItem` manage its own read/seen-status?


#### step 15 continued

The React answer to the question above (which component should keep the item-statuses in its state?) would be:  

_The closest component that is a parent to all components that need the info_. It is not usual for React application to have little component at the leaves of the comonent-tree to keep state.  
So the `ItemList` would be a good answer. 

👉 In the component of your choice, use the componentDidMount to start an AJAX request for all the item-statuses. The callback should use `setState` to store the data received from the server in the component (updating the UI automatically).

👉 Have the callback use `console.log()` to notify you that the data has arrived. Use the **React DevTools** to check that the data is correct, and succesfully stored inside the component state.

👉 Have the `render()` method use the itemStatuses to give each `ListItem` a prop describing it's own status. What will the value of this prop be if the item is _new_ (i.e. does not appear in the item-statuses from the server)?

👉 Have each `ListItem` use its own status to render differently. You can change the color of the title, or (to keep thing simple), just add a piece of text below the title saying "new!", "seen earlier" or "already read".

👉 If you've filled the database using actual HN id's that exist in the 'frontPageData.js' file (see step 14), you should see at least some items marked as 'seen' or 'read'.  
If not, use RoboMongo to check if there are records in the DB describing the status of HN items that exist in 'frontPageData.js', and create them if neccessary.

### Step 16: Getting new items from the server

Use the experience you got from getting step 15 to work to get the other important data from the server: the _current_ HN top stories.

👉 Use an AJAX request to get the top stories from the server, en use the usual React mechanism to make sure the UI updates with the new data.  
This is mostly a repeat of the thing in Step 15, but you have to think again which comonent should store the items in it's state.

👉 You can throw away the file `frontPageData.js` now.  

### Step 17: Changing item-statuses to `read`

Your RrHN client now has an internal datastructure that knows which items are `read` or `seen` (and all others are `new`). But clicking on an item title should change the status of that item. Otherwise, the UI is still telling the user that an item that he/she's reading, is still `new`.


👉 Let's start with updating just the datastructure on the client. Find the place in your code where `App` responds to a click on an item title (probably by changing the `selectedItem` (or similar) in its own state).

👉 Change the status of the selected item to `read` in the state of `App`. Don't forget to use `setState()`. Check that the change is reflected in the UI.

### Step 18: Changing item-statuses to `read` on the server.

👉 Expand the code you were working with in Step 17 to also send an update to the server. If you're using SuperAgent, feel free to 'recycle' the code from the server-README for saving statuses on the server.

**Note:** The clients isn't really interested in the server response, because it has already stored the same change in it's own datastructure. This is fine for now, but it isn't robust: the server could be having a problem and fails to save the change to the DB. In that case, you'd have a UI telling the user that the item is `read`, but a DB still thinking that the item is `new` or `seen`.  
One solution might be to postpone changing the client-side datastructure until the server has responded that all is OK. Some apps use this strategy, others don't.

### Step 19: Marking all items in the list as `seen`

 After the user has scrolled through the list, he/she might want to mark all items (s)he's seen as `seen`.

👉 Create a button at the bottom of the left column that will mark all (unread) items as `seen`. It might look like this:
![RrHN client with 'Mark all as "seen"'-button.](https://images2.imgbox.com/fe/fd/Oj8q9zDs_o.png)

This button causes the following behavior by the RrHN client:
* It will only mark items that are currently visible in the list. So if you've got 470 items, but the list size is set to 60 in the preferences, the items from 61-470 **do not get marked** as `seen`.
* It will not mark items that already have the status `read`. Only `new` items become `seen`. The server does not implement this rule: you have to make sure the client does not tell the server to mark a `read` item as `seen`.
* It will update the item-statuses in the client, so the change becomes immediately visible to the user.
* It will update the item-statuses on the server, using the same kind of PUT requests you used in step 18. Note that this may result in many (10s-100s) HTTP PUT requests to the server. That is OK for now. The server does not support bulk-updates yet.


{{exCommit "Stuur je commit in" "RRHN-assignment4.2"

exCommit}}
