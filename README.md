# Eloquent JavaScript

These are the sources used to build the third edition of Eloquent
JavaScript (http://eloquentjavascript.net).

Feedback welcome, in the form of issues and pull requests.

## DWA-team additions

We can add additions to the text:

```
{{note
Some additional text that we want students to read.
note}}
```
Markdown will work inside the note.

```
{{youtube "dQw4w9WgXcQ" }}
```
Youtube annotations live on a single line, and do not enclose text. Note that the quotes around the video-id are optional. You do need them if the
id contains special characters.

```
normal text normal text [a small remark that fits in the margin]{aside "title"} normal text normal text
```
For asides, the title is optional, and inline-level markdown (bold, italic etc.) will work in the remark text.

```
{{skip

Lots of book...

skip}}
```
Skip annotations will grray-out the enclosed part of the book and inform students that they do not need to read this part of the text.

```
{{todo
Note to self...  
todo}}
```
Todo-items are rendered like normal notes, but with a distinct color. They are meant for the team, not for students.

```
normal text normal text [a problem description that fits in the margin]{fixme "title"} normal text normal text
```
Fixme-items are like asides: the live in the margin, but have a distinct color. Like todos, they are meant for the team, and should not appear in versions that students see. The title is optional.

## Building

    npm install
    make html

To build the PDF file:

    apt-get install texlive texlive-xetex fonts-inconsolata fonts-symbola texlive-fonts-chinese
    make book.pdf
