# Adding AJAX to the reduxyfied RrHN-client


Make your Redux-version of RrHN work with the [server that we provided in session 4.2](https://github.com/HANICA-DWA/sep2018-cwd/tree/master/unit04%20-%20More%20React/session%204.1/AJAX%20workshop/RRHN-server).

👉 The reduxyfied RrHN should get the latest Hacker News items from the server.

👉 The reduxyfied RrHN should get the _read/seen_ status for items from the server, and use that information to color the item-titles in the left-column.

👉 The reduxyfied RrHN should update items statuses on the server whenever the user clicks an item, or the _Mark All as "seen"_ button.

🌀 Use **asynchronous action creators** and the **[redux-thunk](https://www.npmjs.com/package/redux-thunk)** middleware to integrate your Ajax-code with Redux.

{{exCommit "Stuur je commit in" "RrHN-assignment6.2"

exCommit}}