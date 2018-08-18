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


#### not required reading
```
{{skip

Lots of book...

skip}}
```
Skip annotations will gray-out the enclosed part of the book and inform students that they do not need to read this part of the text.

#### html

HTML tags will no longer be filtered out. Don't know if <BLINK> works, though...


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
    touch \*.md; make html

## Firebase

Testing the app locally, or deploying it requires the `firebase` command line tool. It is a dev-dependency of the project (use `npm install` if you haven't got it yet), so the binary is in the node_modules folder.

You need a Google account, and the permissions, to manage the Firebase project called `dwa-forms`. Get the permissions from Robert. If your account is able to access the Firebase project, then these are the commands you use to test or deploy:

    ./node_modules/.bin/firebase login

You have to log in with the command line tool before testing or deploying.

    ./node_modules/.bin/firebase serve

`firebase serve` starts a local HTTP server at localhost:5000. You can no longer use other http servers, because Firebase :-/  

Any changes to the DB will go to the production DB online, not to a (local) test DB.

    ./node_modules/.bin/firebase deploy

`firebase deploy` bundles up the html-directory and sends it to the server at https://dwa-forms.firebaseapp.com.
