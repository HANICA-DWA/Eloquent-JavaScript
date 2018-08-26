
# Intro to the Intro: About the HTTP-protocol.

_by Robert Holwerda_

## What is a protocol?

HTTP is the set of rules that web browsers and web servers must follow in order to understand each other's messages. The word *protocol* means, in the context of computer networking, just that: a set of rules, agreements and procedures.

- Some of those rules describe the **meaning of the series of ones and zeroes** that are sent and received. Without them the receiver could not know whether it's getting HTML code, an image or the result of a database query.
- Other rules describe **who gets to say what at which moment** in the information exchange. For example: can a browser send a second request *before* the server has responded to the first request?
- There can also be rules that **control the operation of machines other than the client (browser) or (web) server**. Before reaching the destination server, a request usually passes through *routers* and possibly *proxies*. The IP protocol has rules that help routers send your request to the correct part of the world. The HTTP protocol has rules that allow proxies to intercept requests and decide if the proxy can respond to the message without having to bother the web server.

## HTTP fundamentals

The basic operation of HTTP is this: a *user agent* (a browser, search engine, mobile app etc.) sends a request to the server. This request looks a bit like an e-mail: It's a text-file with *headers* and a *payload*. If all goes well, the server sends a response that is also structured like an e-mail. Here's a comparison between an HTTP message, and an e-mail:

*HTTP message (a form submission in this case):*

```dontedit
POST /addtocart HTTP/1.1
Host: www.my.shop.com
Accept: text/html
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded
Content-Length: 54

clientID=12345&product=Glowing+Tennis+Ball&quantity=3
```

*E-mail message (many headers deleted):*
```dontedit
Received: by 10.112.2.228 with SMTP id 4csp1346531lbx;
        Sat, 22 Aug 2015 00:41:21 -0700 (PDT)
Subject: We're back!
From: Jan Janssen <jj@yahoo.com>
Content-Type: text/plain; charset=us-ascii
Message-Id: <AC35D208-A822-4E94-B037-49EFFE525AD1@yahoo.com>
Date: Sat, 22 Aug 2015 09:41:18 +0200
To: Robert Holwerda <robert.holwerda@han.nl>
Content-Transfer-Encoding: 7bit

Robert,
We're back from our Holiday.
Hope to see you soon, Jan
```

In both cases you see that the messages...
- ... are text files
- ... are structured in two parts: a set of headers (lines that look like "name: value") and some content. The two parts are separated by an empty line.
- ... even have a similar header, Content-Type (there are a few more that are used in both HTTP and e-mail).

Here's an example of an HTTP response:

```dontedit
HTTP/1.0 200 OK
Content-Type: text/html;
Content-Length: 182
Date: Sat, 22 Aug 2015 11:35:40 GMT
Connection: close

<html>
   <head>
      <title>My Shop: Order received</title>
   </head>
   <body>
      <img src="/logo.png">
      <hr>
      <h1>Thank you for your order!</h1>
   </body>
</html>
```

You can see the same structure again. One difference between the HTTP messages and the e-mail is that both HTTP messages (request and response) have a first line that does not look like a header. The video will explain those.

The interaction between the web browser and the web server is governed by these rules:

1. The server only responds to request by the client, it will never send messages on it's own initiative. (In recent years, some exceptions to this rule were introduced, but this is still a core part of how HTTP works.)
1. After the server has responded, the server may (and often does) forget that it ever talked to this client.

## Why HTTP in these courses?

Most web developers do not understand the HTTP protocol very well. That's OK, actually. There are many aspects of HTTP that are both complicated and obscure. For the creation of many types of web applications, a basic understanding is fine. In this Unit of the course, we'll look at the important rules and data formats that web developers should be familiar with. These are the reasons that this course devotes a session looking into HTTP:

- Almost all books, articles and sources on the internet assume that **a web developer understands these HTTP basics**: (1) the difference between a POST and a GET request; (2) the existence of other types of requests (PUT, DELETE, HEAD); and (3) the meaning of important "status codes"; the format of messages sent and received etc.  <br>
If you are not familiar with these topics, you will have difficulty understanding some of the interesting things you can learn about HTML, JavaScript, server side frameworks, etc.
- HTTP has some **important limitations**. There are some obvious things that you may want to do, but are not possible in plain HTTP. In these cases you'll have to employ other technologies and workarounds. Often, though, it's easier to understand these limitations and see if you can work within the limitations.  
Pay attention when terms like "connectionless protocol" and "stateless protocol" appear. That's the source of the limitations.
- Web technologies are changing all the time. HTML, CSS, the programming languages on the server, the code structure in the browser, the libraries, frameworks and databases: Five years from now many of those will have changed from what's hot right now. **The core structure of the web, however will be HTTP**. Together with HTML, it forms the core that shapes most future developments.
- In these courses on web development, we will look into at least three  web **development practices whose shape and mechanics are derived from how HTTP works**: AJAX, REST and Express.JS (in the sister course on server side development.) We will also look into the WebSocket protocol, which is a major extension of HTTP.

## Related Acronyms

Even though HTTP is at the heart of the web, it doesn't do what it does all by itself. Here are a few well-known technologies that are also part of web technology, and their relation to HTTP:

**HTML and CSS:** These standards define the format of text files that describe the content and the visual properties of web pages. When HTTP is used to get a web page from a server, the HTTP response message contains the HTML text. Within the HTML, there are links to images and CSS files, and the browser will use HTTP to request those after it received the HTML. This way a single web page often requires multiple HTTP requests.  
HTML, CSS, images and video-fragments are transmitted as the payload of an HTTP message.  

**IP, TCP and DNS:** These are three other protocols that make the web work. It turns out that HTTP, as a set of rules for communication, is not complete. It does not define how data can be transmitted across multiple networks to a machine on the other side of the world. The rules that make that happen are defined in the *Internet Protocol*, or IP.  
But neither IP nor HTTP has any rules or procedures to deal with network problems: What if a part of a message doesn't reach it's destination? (In IP, long messages are split into many parts that are sent individually. Such a part is called a *packet*.) What if some packets are held up by a slow router, while later packets are "lucky" enough to be sent via a different route that is much quicker? (This happens because IP-routers don't have to choose the same route for packets from the same sender.) The rules and procedures to deal with such complications are part of the TCP protocol.  
These three protocols are combined whenever a web browser sends a request or when a web server sends a response. <br>TCP and IP are also used with other protocols than HTTP. For example,  e-mail, FTP and SSH all use TCP and IP.  
DNS is also a protocol that supports the Web, although it's not active when the HTTP messages are actually sent. It's used just before a request is sent to a server, in order to convert the *domain name* of the server (for example "www.w3c.org") into it's corresponding numeric code (such as "128.30.52.45") that can be used with the IP protocol. Such a code is called an IP address. If you want to load the page at http://www.w3c.org/, the browser sends the message, using IP, to the IP address 128.30.52.45.

**HTTP/1.0, HTTP/1.1, HTTP/2:** If you understand the way HTTP 1.0 works, you basically understand most of what a web developer needs to know abut HTTP. Both HTTP/1.0 and HTTP/1.1 are old, they date from 1996 and 1997. Most differences between HTTP/1.0 and HTTP/1.1 have to do with performance: using HTTP/1.1 is faster than using HTTP/1.0. HTTP/1.1 does introduce some new gimmicks to the protocol (new headers, new status codes etc.), and you will see several of them. None of those extras, however, fundamentally changed the way HTTP works.  
HTTP/2 is quite new: it was released in 2015. It contains radical performance enhancements, without requiring web developers to take any extra steps. Apart from seeing your web application become more responsive when using HTTP requests, a developer will not notice a difference between HTTP/1.1 and HTTP/2.

**Extensions to HTTP:** If you look into HTTP, you'll find three protocols that are extensions of HTTP.  
**WebDAV** is the uninteresting one: it added features to HTTP/1.1 that allow users to create, change and move documents on a web server. It's not very popular, most users prefer either FTP to upload content to a server, or a full-blown CMS (Content Management System) such as Drupal or WordPress.  
**HTTPS** it the important one: with HTTPS, both your requests and the server's responses get encrypted, making it near impossible for anyone to read the passwords, bank account details or love letters you're sending across the world wide web. HTTPS is, however, not really an extension of HTTP: instead of the regular TCP-protocol, an encrypting version of TCP (TLS) is used with plain HTTP.  
**WebSocket** is the spectacular one: It allows allows an application on the web server to send information to a web browser *before* the browser sends a request. This gives rise to web-applications that update their pages as soon as information changes. Such web-apps are sometimes called (Near) Real Time Web Applications. We will look into WebSocket later on in these courses.

**W3C, IETF and RFC:** These three acronyms do not refer to HTTP related technologies, but to the way the previously mentioned technologies become official agreements. Remember that a protocol is required to allow communication in networks and in essence is a set of rules that all computers on a network should follow. A successful protocol, therefore, requires *agreement* between developers and manufacturers of soft- and hardware on the internet. These agreements are organized by two groups of companies and experts.  
**The IETF** is the _Internet Engineering TaskForce_. They discuss, decide and write down the rules of most of the protocols used on the internet, including HTTP, IP, TCP and DNS. You could consider the documents in which these protocols are described to be the technical "laws" of the Internet. They are called RFCs: _Request For Comment_, and rather than titles, they have numbers. HTTP/1.1 for example is defined in RFC 2068, although some other RFCs describe extensions (e.g. RFC 2324) or clarifications (e.g. RFC 2616). The term _Request For Comment_ is misleading. Once an RFC is made an official standard, sending comments to IETF is useless, but the term "Request for Comments" is kept anyway.
**The W3C** (the _World Wide Web Consortium_) is the group of companies and experts that creates standards regarding the contents of the web. They decide and publish standards on HTML, CSS, SVG, XML, but also on the way JavaScript interacts with webpages (DOM) or with WebSockets (WebSocket API). A common mistake is to think that the W3C is in charge of all web-related standards, including HTTP. Although HTTP and HTML were invented at the same time by Tim Berners-Lee (currently head of the W3C), they are actually managed by two different organizations.

## Read-only or Read-write?

Now that we've mentioned Tim Berners-Lee, let's close this intro with a minimal set of facts about the history of HTTP:

* Tim Berners-Lee created HTML and HTTP about 30 years ago, in 1990-1991. He worked for CERN, the enormous particle accelerator in Switzerland. His invention was intended for scientists to exchange and publish scientific papers and data.
* Tim Berners-Lee's browser was called "WorldWideWeb". Besides being a viewer for web-pages, it was also an editor for creating webpages _on the server_. In later years, browsers (and web-servers) became read-only applications, but in Tim Berners-Lee's original vision, the web would be read-write for everyone.
* Because of this vision, even HTTP/1.0 contains request-types for uploading, changing and deleting information on a web-server. Most of these were ignored or forgotten by web developers because of the lacking support from web browsers and web-servers.
* For HTML to work, browsers need only to implement two HTTP request types: GET for downloading information from the server, and POST for submitting forms to the server (and then downloading a new page). For more than a decade, you wouldn't be able to use the other two HTTP request-types, PUT and DELETE, on a webpage.  
(By the way, in HTTP jargon, request types are called _methods_. They are, however, not similar to the kind of method we know from object oriented programming languages.)
* Only in 2004, did JavaScript developers discover that they could send HTTP request from JS code, this was called AJAX.
With AJAX it became possible to fully utilize all the important HTTP methods.
* WebDAV, mentioned above, can be seen as an attempt to restore the read-write vision to the web. It didn't take off.
* REST, on the other hand, did take off. It is a way of organizing the AJAX communication between browser and server based on using all the important HTTP commands. The idea that in some ways restored HTTP's role as a read-write protocol was this: instead of using the HTTP methods POST, PUT and DELETE for changing HTML documents on the web server itself, one should use these methods to communicate the creation, updating and deletions of database records.  
Hard-core REST and HTTP experts will say that this idea was not that new. And at a very abstract level, that may be true. But for many, probably most, web developers this idea was a new insight that fit very well with AJAX.  
REST is an important topic for web developers. We'll visit the subject in a later week.  It is one of the main reasons web developers today (need to) understand HTTP a lot better than web developers did ten years ago.

## Q&A

Voer hieronder je Q&A bijdrage in.

**Tip:** Je kunt vragen/dicussiepunten invullen die gaan over [de video die bij deze sessie hoort](https://www.youtube.com/watch?v=gd9VgPyJxlA).

{{qna "cwd-1.1" 2

qna}}
