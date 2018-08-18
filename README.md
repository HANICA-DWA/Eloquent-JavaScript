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
```
{{ex

Text of the exercise.

ex}}
```

#### not required reading
```
{{skip

Lots of book...

skip}}
```
Skip annotations will gray-out the enclosed part of the book and inform students that they do not need to read this part of the text.

#### html

HTML tags will no longer be filtered out. Don't know if <BLINK> works, though...

#### live reloading

From the command-line execute:
```sh
npm run watch
```
to automatically generate HTML when a markdown file is saved.

The HTML-files will try, once per second, to reload the page if anything has changed. (There is no option, yet, to turn this off).

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

## Building

    npm install
    make html

To build the PDF file:

    apt-get install texlive texlive-xetex fonts-inconsolata fonts-symbola texlive-lang-chinese inkscape
    make book.pdf
