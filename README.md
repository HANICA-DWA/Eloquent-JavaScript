# Eloquent JavaScript

These are the sources used to build the third edition of Eloquent
JavaScript (https://eloquentjavascript.net).

Feedback welcome, in the form of issues and pull requests.

## DWA-team additions

We can add additions to the text:

#### notes
```
{{note

Some additional text that we want students to read.

note}}
```
Markdown will work inside the note.

#### videos
```
{{youtube "dQw4w9WgXcQ" }}
```
Youtube annotations live on a single line, and do not enclose text. Note that the quotes around the video-id are optional. You do need them if the
id contains special characters.

#### margin notes (asides)
```
bla bla bla [a small remark that fits in the margin]{aside "title"} bla bla bla
```
For asides, the title is optional, and inline-level markdown (bold, italic etc.) will work in the remark text.

#### exercises

There are three kinds of exercises: short, long and code. All exercises
_require two parameters_: A title for the user, that can be changed without upsetting the
database, and a database key. Changing the key makes the exercise a different exercise, losing
any answers that students have already submitted. The user-facing title can be changed at any time.


```
{{exShort "user facing title" "database key"

Text of the exercise.

exShort}}
```
A question for which a short answer is expected (1 line at most).

```
{{exLong "user facing title" "database key"

Text of the exercise.

exLong}}
```
A question for which a multi-line answer is expected. Users can user markdown for their answers.

```
{{exCode "user facing title" "database key"

Text of the exercise.

exCode}}
```
A question for which a short piece of code is expected.

```
{{exCommit "user facing title" "database key"

Text of the exercise.

exCommit}}
```
A question for which the user has to commit code to GitHub, and leave the URL to the commit in the form.

#### not required reading
```
{{skip

Lots of book...

skip}}
```
Skip annotations will gray-out the enclosed part of the book and inform students that they do not need to read this part of the text.

#### html

HTML tags will no longer be filtered out. Don't know if <BLINK> works, though...

#### code blocks

By default, all code blocks are assumed to contain JavaScript, so an editor is always created when the users clicks on the code. For text that should be rendered as a code block (i.e. monospaced), but isn't editable/executable JavaScript (e.g. HTML or Node.js-specific Javascript), you can prevent the creation of an editor using  `dontedit`, like this:

```
```dontedit
...some monospaced text goes here...
``````


#### Q&A's

{{qna "database key" 2

qna}}

The second parameter is the required minimum number of questions students have to submit.  
This generates a form with _minimum_+2 markdown editors for submitting questions.  
Any text _inside_ the `{{qna qna}}` markers is ignored. Any explanation should be placed _outside_ of the markers.

You can place a Q&A like this inside a chapter file, but there is also some infrastructure for working with separate Q&A pages that are not part of the book. See the _Building_ section below.  

#### notes while developing
```
{{todo

Note to self...  

todo}}
```
Todo-items are rendered like normal notes, but with a distinct color. They are meant for the team, not for students.

```
bla bla bla [a problem description that fits in the margin]{fixme "title"} bla bla bla
```
Fixme-items are like asides: the live in the margin, but have a distinct color. Like todos, they are meant for the team, and should not appear in versions that students see. The title is optional.

#### live reloading

Live reloading had to be disabled because Firebase.


## Building

    npm install

To get the latest packages, including Firebase updates.

    make html

Renders all chapters that belong to the book.

    make qnas

Renders all files whose file name starts with "qna_" (case sensitive, probably). The idea is that we create separate files for hosting the Q&A forms, with this prefix in the file name. We'll link to the generated html files from the unit-readme's from github. A typical Q&A link in a Github readme would be: `[https://dwa-courses.firebaseapp.com/QnA_cwd_1.1.html](https://dwa-courses.firebaseapp.com/qna_cwd_1.1.html)`

    make assignments

Some assignments are specified in a markdown-file whose name starts with `assignment_`. These files contain a single exercise-tag (often an exCommit), and can contain as much explanatory text and assignment specification as you like. `make assignments` converts the markdown to an html file. The Github readme should contain a link to the assignment of the form `cwa-courses.firebaseapp.com/assignment_cwd_3.2.html`, if the file was called `assignment_cwd_3.2.md`.


    make dwa

Renders both the book chapters (make html) and the Q&A pages (make qnas).

    make dwa-rebuild

Rebuilds all the book chapters and all the Q&A pages, including the files whose sources have not changed. Use this when the JavaScript code generators have changed.

## Firebase

Testing the app locally, or deploying it requires the `firebase` command line tool. It is a dev-dependency of the project (use `npm install` if you haven't got it yet), so the binary is in the node_modules folder.

You need a Google account, and the permissions, to manage the Firebase project called `dwa-forms`. Get the permissions from Robert. If your account is able to access the Firebase project, then these are the commands you use to test or deploy:

    ./node_modules/.bin/firebase login

You have to log in with the command line tool before testing or deploying.

Listed below are the three firebase environments (hosting and RT-database) that are associated with this repo.

    ./node_modules/.bin/firebase use develop

Using the `develop` environment causes the `serve` and `deploy` commands (see below) to use the project at `dwa-develop.firebaseapp.com`. This environment is intended for program development, and things are likely to break in the environment.

    ./node_modules/.bin/firebase use default

Using the `default` environment causes the `serve` and `deploy` commands (see below) to use the project at `dwa-forms.firebaseapp.com`. This environment is intended for content development. I promise not to deploy versions that are too broken ;-).

    ./node_modules/.bin/firebase use productie

Using the `production` environment causes the `serve` and `deploy` commands (see below) to use the project at `dwa-courses.firebaseapp.com`. This environment is for consumption by students and lecturers during the course. We're not going to insert test-data into this database. **Github readme's that are used by students should link to pages on this environment, e.g. the `dwa-courses.firebaseapp.com` host.**

    ./node_modules/.bin/firebase serve

Once you've chosen your Firebase environment, `firebase serve` starts a local HTTP server at localhost:5000.  

Four notes on using `firebase serve`:
1. While all static assets (html, css,js) are coming from the local `/html` directory, any **changes to the DB will go to the _online DB_** for the environment you've chosen (develop, default or production). There is no local test DB.
2. If you have `firebase serve` running, and you change firebase environment using `firebase use`, **you have to restart `firebase serve`**. Otherwise your DB changes will still go to the online DB of the previously selected environment.
4. Authentication will not work in Firefox when using `firebase serve`. Something about third party cookies being refused by FF. Chrome does not have this issue, so **local testing is best done with Chrome**. When the app is hosted from the Firebase cloud (see `firebase deploy`, below), the Firefox problem disappears, and authentication works fine.
3. You can no longer use other http servers for local testing, because Firebase authentication won't work.

    ./node_modules/.bin/firebase deploy

`firebase deploy` bundles up the html-directory and sends it "into the cloud!", to the hosting server that belongs to your chosen environment i.e. {dwa-develop,dwa-forms,dwa-courses}.firebaseapp.com .
