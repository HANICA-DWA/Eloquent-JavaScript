# Workshop: Talking HTTP (with cats! :smiley_cat:)

The aim of this workshop is to experience HTTP, to really *feel* it. We'll take a look at the following topics regarding HTTP:
- GET requests;
- POST and DELETE requests;
- HTTP compression;
- multiple representations of a _resource_;
- content negotiation;
- caching.

### Step 1: getting the required software going.

#### 1.1: Getting the software

:point_right: Download the directory called _HTTP Catz_ to your machine. It contains a web application which is built with Node.JS and uses a MongoDB database.

Clone or pull the entire repo with the teaching materials for this course (CWD), then copy the subfolder **unit01/session1-1/workshop/http_cats** to your personal repo.

#### 1.2: starting the Node.JS app for the first time

:point_right: Now, open a command-line window ("cmd.exe" on Windows, "Terminal" on Macs). Use the `cd` command to navigate to the *http_cats* directory you've just downloaded.  
Use the `pwd` command to confirm that you're in the right directory, and the `ls` (windows: `dir`)command to make sure the following files are there:
- `app.js`
- `client-side`
- `package.json`
- `views`


:point_right: The app uses a few plug-ins that must be installed before we can run it. Use the following command in the command-line window:

```dontedit
npm install
```
_(this may take some time...)_

:point_right: Finally, we can run the app. The app was written for Node.JS, so we use the `node` command to start it:

```dontedit
node app.js
```

The app checks to see if the database contains information it can use. It it doesn't find any, it creates a few records in the database. You should see the following text being printed after you start the apps for the first time:

```dontedit
Server running on port 3000.
Database was empty: added 3 LOLcats to the database called "http_cats".
```

If the app does find a database with content, all you'll see is the first line, telling you that the webserver is ready for HTTP connections.


:notebook_with_decorative_cover: Like README files on Github and the book _Eloquent Javascript_, this file is written in _Markdown_ format: a very easy to use way of writing rich text with a basic text editor. Markdown, however does not allow us to make a visual distinction between the commands that you type and the output that the computer prints to the command-line window. So this document uses the `>`-sign to mark lines that _you_ type, and `<` to mark lines that the computer prints. So we show a simple exchange inside the command-line window,(e.g. starting the app, as we did above) like this:

```dontedit
> node app.js
< Server running on port 3000.
< Database was empty: added 3 LOLcats to the database called "http_cats".
```

#### 1.3: Playing with the database

The app in *http_cats* stored a few records in a database system that you need to have running on your system: **MongoDB**. We will spend several weeks on MongoDB later on in this semester, but let's just have a quick look right now.

Like most other databases, MongoDB is running in the background and doesn't have a regular user interface. You will have to use another program to connect to it if you want to see or manipulate the database and it's contents. *Http_cats* is a very specific program. It presents a very specific user interface to a specific datastructure in the DB, which is great for cat-loving end-users. Developers however, often need a generic UI that works with any database in MongoDB. Robo3T a fine tool for that.

:point_right: Start Robo3T. The first Robo3T screen asks what database you want to inspect. The default (localhost:27017) is exactly what we want, so just press **OK**. (the screenshot is from RoboMongo, an earlier version of Robo3T)

![RoboMongo start screen](https://images2.imgbox.com/4c/64/mLrHmerC_o.png)

:point_right: In the Robo3T main screen, use the navigation panel on the left to find the 'pictures' Collection in the database called http_cats. A collection is comparable to an SQL database table. Click on the 'pictures' collection.

{{exShort "Question:" "Assignment 1.1.a (what fields does each record in this collection have)"
:question: what fields does each record in this collection have?

exShort}}

:notebook_with_decorative_cover: Mongo uses different terminology than SQL databases. A table is called a "_collection_", and a record is called a "_document_". In a few weeks, you'll see why.

Let's experiment with deleting "documents" in the database and restarting our application.

:point_right: Return to the command-line window, where our `node app.js` is still running (doing nothing). Stop the program by pressing **Ctrl-C**. Then restart the app (use the up arrow to retrieve the previous command).  
Note that this time, the app does not report an empty database or add any records to the database.

:point_right: Now switch to Robo3T and select all three documents in the "pictures" collection. Use the right-click menu to delete all of them.

![Deleting records in MongoDB](https://images2.imgbox.com/4d/6b/RgVFW9kR_o.png)

:point_right: Stop and restart our Node application in the command-line window. Notice that this time it _does_ report creating new LolCats.

:point_right: Switch to Robo3T. You see that the Robo3T screen did _not update_ after our Node application recreated the deleted records. The way to refresh the screen in Robo3T is to rerun the command that Robo3T used to read all documents from the collection. Simply press the **green play button** in the toolbar and you should see the documents reappear.

### Step 2: Lets GET cats!

Like Jose Vidal in the video, we're going to really talk HTTP ourselves (instead of having the browser do the HTTP work), using Telnet.

Telnet is a very simple program that you can use to create an Internet connection (using the TCP protocol). Once the connection is made, every line of text you type get transmitted to the other side, and everything that's sent back, is shown in the command-line window. It's dead simple, which is why it's excellent for seeing HTTP as it really is.

:scream_cat: **Do not** start using a browser just yet. We'll get to that in a few minutes. For now, if you skip the telnet bit, you're missing out on the "HTTP experience", and missing the point of this workshop.

#### 2.1: getting content.

:point_right: Create a telnet connection to your server (that should be running still, in your commandline window)

*  *On Windows*: Start Putty; in the 'PuTTY Configuration' window; enter `localhost` under `Host Name`; `Port: 3000`; and select *both* `raw` (_not:_ telnet) and `Close window on exit: Never`. <br>For every HTTP request, you'll start Putty like this again, so it'll save you some hassle if you save this 'session' in the same window (after setting the options correctly).
* *On Mac:* If you're using MacOS 10.14 "High Sierra", you don't get _telnet_ anymore. You'll need to install it yourself. The best way to install telnet for MacOS 10.14 and higher is to use [HomeBrew](https://brew.sh/).
*  ​*On Linux:* Simply enter the command `telnet localhost 3000`. Use a new command-line window, not the one where your `node app.js` command is running.

```dontedit
> telnet localhost 3000
< Trying 127.0.0.1...
< Connected to localhost.
< Escape character is '^]'.

```

{{exShort "Question:" "Assignment 1.1.b (Where have you seen this 3000 value before?)"
:question: Where have you seen this 3000 value before?

exShort}}

Once telnet is started, and has made the connection, it waits for you to type something.

:point_right: Type the following line into the telnet window:

```dontedit
GET / HTTP/1.0


```

Press the Return key *twice* to make the web server respond.

{{exShort "Question:" "Assignment 1.1.c (How did the server tell you what type the content was?)"
:question: How did the server tell you what type the content was?

exShort}}

{{exShort "Question:" "Assignment 1.1.d (What HTTP version does the server say it wants to speak?)"
:question: You sent a request with the 1.0 version of HTTP. What version does the server say it wants to speak?

exShort}}

{{exShort "Question:" "Assignment 1.1.e (How did the server separate the metadata from the payload)"
:question: How did the server separate the "metadata" (the HTTP headers) from the "payload" (the HTML)?

exShort}}

{{exShort "Question:" "Assignment 1.1.f (How many bytes is the HTML payload?)"
:question: How many bytes is the HTML payload?

exShort}}

{{exShort "Question:" "Assignment 1.1.g (Why can't you type another request?)"
:question: Why can't you type another request?

exShort}}


:point_right: Windows/Putty users: Create a new Putty window with an increased scrollback buffer: In the configuration windows, select `Window` in the left column, and set `Lines of scrollback` to 6000.

:point_right: Use Telnet to GET the picture that's referred to in the HTML you just downloaded.

:question: **Question:** What did you have to change in the first GET request we made to make it target the image referred to in the HTML?

:point_right: If all goes well, you've just seen a lot of gibberish show up in your command-line window. That's OK, that's your image! **Scroll up** past the gibberish, past the empty space, until you see your request again. Investigate the response headers.

{{exShort "Question:" "Assignment 1.1.h (What is the content-type this time?)"
:question: What is the content-type this time?

exShort}}

{{exShort "Question:" "Assignment 1.1.i (When was this resource changed? Why would this information be useful to a browser?)"
:question: When was this resource changed? Why would this information be useful to a browser?

exShort}}


You see that each response by the server contains a (small) set of _headers_ just before the actual content (HTML or an image in our experiments). _Requests_ can also have headers (they almost always do). Lets try a request header:

:point_right: We're going to ask the server to compress the HTML before sending it. That way, we save on network traffic. Instead of pressing the return key twice after the GET line, we'll add a header and press the return key twice _after_ that. Use the following request:

```dontedit
GET / HTTP/1.0
Accept-Encoding: gzip


```

You should see some gibberish instead of your HTML. That's the compressed version. Our request header asked the server to use the Unix GZip algorithm to compress the HTML. Browsers usually ask this, they all understand how to decompress GZip.  
Note that only the payload gets compressed, the HTTP headers remain uncompressed.

{{exShort "Question:" "Assignment 1.1.j (Why isn't it very useful to use the `Accept-Encoding: gzip` header on a request for `/logo.png`)"
:question: Why isn't it very useful to use the `Accept-Encoding: gzip` header on a request for `/logo.png`?

exShort}}


#### 2.2: Go ahead: fire up your fire fox...

If you prefer, Chrome is okay too.

:point_right: Start your browser, and navigate to http://localhost:3000. Enjoy the funny cat pics!

:point_right: Within the browser, find the developer panel and navigate to the "Network” tab there. You may have to reload the HTTP Catz page to see something interesting in the Network tab.

![The Network panel in Firefox](https://images2.imgbox.com/22/36/NLAwX1iM_o.png)
_(The Network panel in Firefox, showing info on one HTTP request)_

{{exShort "Question:" "Assignment 1.1.k (What is the E-tag on the first cat picture?)"
:question: What is the E-tag on the _logo.png_ picture?

exShort}}

:notebook_with_decorative_cover: Don't worry about what E-tag means. It has to do with caching. The question was meant to make you find out how the Network panel can be used to see HTTP information.

If you look at the HTML for the cat list, you'll see that one of the images has a URL that's rather different from the URLs of the other two. And yet, looking at the Network panel, you can see that all images are loaded from the same site, using very similar URLs.



{{exShort "Question:" "Assignment 1.1.l (What was the HTTP status of the request)"
:question: What was the HTTP status of the request to the original URL (the one that's in the HTML)?

exShort}}

{{exShort "Question:" "Assignment 1.1.m (How did the browser know what the true URL was for this picture)"
:question: How did the browser know what the true URL was for this picture?

exShort}}

{{exShort "Question:" "Assignment 1.1.n (How many HTTP request need to be sent)"
:question: How many HTTP request need to be sent to completely show the cat list page in this app?

exShort}}

{{exShort "Question:" "Assignment 1.1.o (How many HTTP request need to be sent to completely show the page at http://www.cnn.com/)"
:question: How many HTTP request need to be sent to completely show the page at http://www.cnn.com/?

exShort}}

### Step 3: The “Unsafe” Methods...

The HTTP specification requires that the GET method be "safe": It should not change the data on the server (although many sites ignore this rule). The other interesting HTTP methods (POST, PUT, DELETE) _do modify_ data on the server (potentially), so you could call them "unsafe".

Let's kill us a cat.

#### 3.1 Back to black

Unless you're using JavaScript, there is no way to get a browser to make a DELETE request.

:point_right: Before switching back to the command-line window, use your browser to visit Lars Tijsma's insolent cat (the page with just that cat, in large format.) Notice the URL:

```dontedit
http//localhost:3000/catz/2
```

In modern HTTP usage, this URL is considered to be the home on the web for this particular _resource_. "Resource" is a term signifying an interesting piece of data on the web. Notice how the URL path first points to the type of the resource ("/catz/") and then uses the database ID to point to the particular item in the collection. If you want to see the cat, use GET on this URL. If you want to remove the cat, simply use another HTTP method, _on the exact same URL_!

:point_right: Copy the URL of the current cat, then return to the command-line window from which you telnetted your HTTP requests. Submit a DELETE request (using HTTP/1.0) for the current cat using the URL in the clipboard.

:point_right: Refresh your Robo3T screen (green play button) to see the effect of your assassination.

Feel free to terminate more cats. You can always restart the app when the database is empty to get them all back again.

#### 3.2 New Cat on the Block

Many web developers consider POST to simply be the method to "submit forms" or "to send data” to the server. The official meaning is more specific: POST is the method for _adding new_ resources. There is a second method for sending data to the server, _PUT_, but that one is meant to _replace existing_ resources on the server.

For this workshop we're going to skip the PUT method, but we will POST a new cat to our server. We need to do some preparation.

:point_right: find yourself a nice picture of a Lolcat on the web. Don't spend to much time on the search. Get the URL for the picture (not the page that contains the picture, but for the picture itself).  
If you're pressed for time, here's one that'll do: http://bit.ly/1fCc4ms

The recipe for a POST request is more complicated than for a GET or DELETE request. First-off, you need two HTTP headers that you did not need before:

```dontedit
Content-Type: application/x-www-form-urlencoded
Content-Length: 12345
```

Secondly, this request has its own payload (or content): After the blank line, you add a line with all the data fields of your new resource. This line is formatted just like the “query”-part of an URL that contains parameters. For example: here's a POST request to add a new product to a shopping list:

```dontedit
POST /wishlist HTTP/1.0
Content-Type: application/x-www-form-urlencoded
Content-Length: 45

customerID=333&productName=Toaster&quantity=7
```

_Notice how the content length is 1 greater than the length of the data line._

"Content-Length" is needed to have the server to wait for the payload of the request, rather than responding immediately after the empty line.

:point_right: Remind yourself: what fields does every cat entry in our database collection have again?

:point_right: Using the example above, and the URL for the LolCat you found, use telnet to send a POST request to the URL `/catz` (no id necessary: we're adding to the list, not replacing an existing cat).


:icecream: **Tip:** Here's a quick way to measure the length of the payload:

```dontedit
          1         2         3         4         5         6
0123456789012345678901234567890123456789012345678901234567890123456789
customerID=333&productName=Toaster&quantity=7
```

:point_right: If your POST request succeeded, the reply must have given you some cryptic feedback containing the data you just sent, _and_ a 200 OK status. Use both Robo3T and your browser to check that the new cat is now part of of the database collection and is shown on the site.

:notebook_with_decorative_cover: The data that was sent back is indeed your submitted POST data, but this time in JSON format. JSON is a kind of JavaScript, specifically for exchanging data. In the next section we'll see some more JSON. JSON is often used as an HTTP response when the browser is running a _Single Page App_ (SPA). In SPAs all communication with the server is done using JavaScript and in such a situation, JSON is really comfortable for the JavaScript developer.

:notebook_with_decorative_cover: Did you notice the ID for the new cat? It's not a simple number like the IDs for the other cats. This time, the ID was created by MongoDB. Mongo likes these very long IDs, even though they are not very readable.  
The IDs for the other cats were created by the application, and they were kept short to simplify the typing of HTTP request in this workshop. Usually, developers choose to work with the default, long, MongoDB type of IDs.

#### Step 4: Same info, different representation

Now that we've seen the server respond with JSON instead of HTML, let's look into _Content Negotiation_, a facility in HTTP that allows the client to tell the server what type of response it wants.

The example server doesn't do content negotiation for the requests you've sent through Telnet up until now: A GET request for the main page will always respond with HTML content (and the header will say `Content-Type: text/html`). Likewise, requesting /logo.png will always result in the image, and a POST request to /catz will always result in JSON data.

Here is a path for which the server _does respond_ to content negotiation:

```dontedit
/catz/1
```

_(and, of course, other IDs at the end of the DB)_

:point_right: Use Robo3T to make sure that there actually _is_ a cat with \_id 1. If there isn't, use Robo3T to make the "pictures" collection completely empty, then restart the node app to refill the DB.

:point_right: use Telnet to do the following GET request to the server:

```dontedit
GET /catz/1 HTTP/1.0
```

_(no headers this time)_

The server refuses to give you an interesting answer.

{{exShort "Question:" "Assignment 1.1.p (What HTTP status )"
:question: What HTTP status did the server use to inform you that you have to specify a MIME type that you want to accept?

exShort}}


:point_right: use Telnet to make the following GET request to the server:

```dontedit
GET /catz/1 HTTP/1.0
Accept: text/html


```

:point_right: Use Telnet to make a request for the following _representations_ of cat number one:
- JSON
- XML

:notebook_with_decorative_cover: The term _representation_ is HTTP jargon. The idea is that while the actual _resource_ lives on the server (the data in the DB), what you're getting with HTTP is not a copy of the data, but a set of info that represents the actual data. This representation will be in a useful format (HTML, PDF, JSON etc.).  
Often, a representation does not contain _all_ the data of the resource. That's up to the application designer. A movie in an online movie rental service, for example, can be shown as an information page (title, poster image, blurp, ratings etc.), but it can also actually be streamed to the user for watching. Both the information page and the video stream are representations of the same resource.

Besides the individual cats, the entire _list of cats_ is also considered a resource. For this resource, too, the server has implemented content negotiation.

:point_right: Try to GET the XML representation of the complete list of cats.


XML is a way of creating mark-up languages that look like HTML, but where you get to make up your own tags and attributes. It has some strict rules (e.g. tags must _always_ be closed), that are not present in the rules for HTML, so regular HTML does not count as correct XML. XHTML _is_ a form of HTML that fits into the XML rules, but it's not very commonly used.  
There are many languages based on XML: SVG for vector-graphics in browsers, Office Open XML for Microsoft Word, Excel and PowerPoint, RSS for blogs, MusicXML for sheet music, Android Layout Markup for Android user interfaces, and [many, many  more](https://en.wikipedia.org/wiki/List_of_XML_markup_languages).   It is also often used for data exchange between web servers and browsers. In recent years, however, many web developers have started using JSON instead of XML for this purpose.

{{exShort "Question:" "Assignment 1.1.q (What XML tag is used, by our application)"
:question: What XML tag is used, by our application, for each individual cat and what XML tag is used for the complete cat-list?

exShort}}


#### Step 5: Not getting your data.

:point_right: Find the modification date and time of the resource `/logo.png` using a GET request and Telnet (or your browser and it's network panel).

:point_right: In the command-line window you're using to issue the HTTP request, navigate to the directory with the "http-cats" application. The navigate to the directory called "client-side". Use the following command to have Linux tell you the modification time of the file `logo.png`, like this:

```dontedit
> ls -l
< total 24
< -rw-rw-r-- 1 developer developer    197 Aug 20 18:25 index.html
< -rw-rw-r-- 1 developer developer  18231 Aug 27 06:09 logo.png
```

The output you'll see will have a different modification date/time than the output above. But it will also be somewhat different from what the webserver told you! What is the difference between the time the server told you, and the time Linux is telling you?

{{exShort "Question:" "Assignment 1.1.r (timezones)"
:question: This time difference between HTTP time and your laptop's time has to do with the "GMT" code you see at the end of the HTTP timestamp. In what country do you think these times would be identical?

exShort}}

:point_right: Copy the complete modification date/time value from the HTTP response headers to the clipboard (don't use Ctrl-C, that won't work in a terminal -- use the edit menu or Ctrl-Shift-C).

:point_right: Let's try the GET request again, but this time we'll add a new HTTP header to the request. Send a modified version of the following request to the server using Telnet:

```dontedit
GET /logo.png HTTP/1.0
If-Modified-Since: «date/time»


```

_(subsitute «date/time» in this example with the complete date-time string you just copied from the previous response) (Only press the return-key twice **after** the header)_

{{exShort "Question:" "Assignment 1.1.s (What  HTTP status code did you get)"
:question: What  HTTP status code did you get this time?

exShort}}

{{exShort "Question:" "Assignment 1.1.t (Did something go wrong or did something go right?)"
:question: You're not getting the image. Did something go wrong or did something go right?

exShort}}

{{exShort "Question:" "Assignment 1.1.u (`If-Modified-Since:` )"
:question: What kind of date in the `If-Modified-Since:` header would make the server respond with a "200 OK" status?

exShort}}


:notebook_with_decorative_cover: The request you just made was a _conditional_ GET request. You're telling the server _"I already have a version of this resource from this date and time. If you don't have one that's newer, don't send me anything, I'll just use the one I already have."_.

:point_right: Take another look at the headers you got with the image response. Notice there's an E-Tag header. Copy its value to the clipboard **including the W/ and the "-quotes**.

E-tags are codes that the server can use to identify a particular version of a file or a resource. They are used because modification dates are not always reliable.

{{exShort "Question:" "Assignment 1.1.v (Why could modification dates be unreliable?)"
:question: Why could modification dates be unreliable?

exShort}}


:point_right: Use the E-tag you just copied in the following conditional request:

```dontedit
GET /logo.png HTTP/1.0
If-None-Match:  «E-tag»
```

_(subsitute «E-tag» in this example with the complete E-tag value you just copied from the previous response)_

### Step 6: The end

You have just experimented with several features of the HTTP protocol. There are a few things we have not covered.

* **HTTP1.1 persistent connections and chucked transfer** You may have noticed "Connection: Close" headers in server responses. If you had issued request with an `HTTP/1.1` code, you might have received `Connection: Keep-Alive` instead. We have skipped this feature of HTTP/1.1 because it is only a performance optimization, that's not very interesting from the perspective of a web developer. It also would have made using a Telnet connection to the server more complicated.

* **HTTP authentication** HTTP has features that allow the server to demand a username/password combination. We'll get to Authentication in a few weeks, but we won't be using HTTP authentication: hardly anybody uses it anymore.

* **HTTP sessions and cookies** This is an important subject that we'll address in a few weeks.

* **The PUT request** You will need to use PUT requests in thses courses, but it would not have added much value to this workshop (which was intended to getting acquainted with HTTP). Basically, PUT request are like POST request, but with the intent to replace a resource. So a POST to /catz adds a new one, and a PUT to /catz/2 replaces data for that specific cat.

* **HTTPS** This is outside the scope of this semester.
