
/*
██   ██ ███████ ██      ██████  ███████ ██████  ███████
██   ██ ██      ██      ██   ██ ██      ██   ██ ██
███████ █████   ██      ██████  █████   ██████  ███████
██   ██ ██      ██      ██      ██      ██   ██      ██
██   ██ ███████ ███████ ██      ███████ ██   ██ ███████
*/

async function doGitHubRequest( endpoint, method = "GET", data = null ){
  const token = localStorage.getItem("gitHubAccessToken")
  if( ! token ) {
    throw new Error("Attempt to access GitHub without an access token in localStorage.")
  }

  let body, contentType;
  if( data ) {
    body = JSON.stringify(data)
    contentType = "application/json"
  }

  const response = await fetch('https://api.github.com' + endpoint, {
    method,
    mode: "cors",
    credentials: "omit",  // To prevent browser from throwing when Github sends "*" in Access-Control-Allow-Origin header. We don't need cookies anyway.
    headers: {
      Authorization: "token "+ token,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": contentType,
    },
    body,
    redirect: "follow",
  });
  const myJson = await response.json();
  // console.log("GH ("+endpoint+"): ",myJson);
  return myJson
}

function elementsByClass(className, parentEl = document) {
  return Array.from(parentEl.getElementsByClassName(className));
}

/*
███████ ██  ██████  ███    ██     ██ ███    ██         ██      ██████  ██    ██ ████████
██      ██ ██       ████   ██     ██ ████   ██        ██      ██    ██ ██    ██    ██
███████ ██ ██   ███ ██ ██  ██     ██ ██ ██  ██       ██       ██    ██ ██    ██    ██
     ██ ██ ██    ██ ██  ██ ██     ██ ██  ██ ██      ██        ██    ██ ██    ██    ██
███████ ██  ██████  ██   ████     ██ ██   ████     ██          ██████   ██████     ██
*/

function setSignInButtonsDisabled( disabled ) {
  elementsByClass("sign-in-btn").forEach(el=>{
    el.disabled = disabled;
  })
}

function doSignIn() {

  if (!firebase.auth().currentUser) {

    var provider = new firebase.auth.GithubAuthProvider();
    provider.addScope('user');
    firebase.auth().signInWithPopup(provider).then( result => {
      token = result.credential.accessToken;
      window.localStorage.setItem("gitHubAccessToken",token);
    }).catch(function(error) {
      console.error(error);
      setSignInButtonsDisabled(false);
    });

  } else {
    throw new Error("WEIRD: Should not be able to press sign-in button if already logged in");
  }
  setSignInButtonsDisabled(true);
}

function doSignOut() {
  firebase.auth().signOut();
}

async function gatherUserInfo() {
  userInfoSnapshot = await currentUserRef().once('value'); // get userinfo from our db
  let userInfo = userInfoSnapshot.val();
  // console.log("Got FB user info:", userInfo);
  if( ! userInfo ) {
    const gitHubUserInfo = await doGitHubRequest("/user");
    userInfo = {
      gitHubName: gitHubUserInfo.login,
      realName: firebase.auth().currentUser.displayName || "UNKNOWN",
      email: firebase.auth().currentUser.email,
      avatarURL: firebase.auth().currentUser.photoURL,
      status: "student",
      group: "UNKNOWN"
    }
    currentUserRef().set( userInfo );  // store the new user to out FB database
    // console.log("Added user info to DB:", userInfo);
  }
  window.userInfo = userInfo;
  return userInfo;
}

function makeHandleAuthStateChanged(afterSignIn, afterSignout) {
  return function(user) {
    if (user) {
      gatherUserInfo().then( afterSignIn )
    } else {  /* user has left the building (sign out) */
      window.localStorage.removeItem("gitHubAccessToken");
      afterSignout && afterSignout();
      delete window.userInfo;
    }
  }
}



/*
 ██████ ██   ██  █████  ██████  ████████ ███████ ██████      ██████   █████   ██████  ███████
██      ██   ██ ██   ██ ██   ██    ██    ██      ██   ██     ██   ██ ██   ██ ██       ██
██      ███████ ███████ ██████     ██    █████   ██████      ██████  ███████ ██   ███ █████
██      ██   ██ ██   ██ ██         ██    ██      ██   ██     ██      ██   ██ ██    ██ ██
 ██████ ██   ██ ██   ██ ██         ██    ███████ ██   ██     ██      ██   ██  ██████  ███████
*/

function showSignInUIs() {
  // console.log("LOGGED OUT: access token:", window.localStorage.getItem('gitHubAccessToken'));

  elementsByClass("sign-in").forEach(el=>{
    el.style.display="block";
  })
  setSignInButtonsDisabled(false);

  elementsByClass("dwa-exercise-submit").forEach(el=>{
    el.style.display="none";
  })
  // setup FB subscriptions
  for(ex of Object.values(window.allExercises)) {
    ex.hideUI();
  }

  document.getElementById("sign-out-ui").classList.add("hidden");
}

function showExerciseSubmitUIs() {
  // console.log("LOGGED IN: access token for user '" + window.userInfo.gitHubName +"':", window.localStorage.getItem('gitHubAccessToken'));

  elementsByClass("sign-in").forEach(el=>{
    el.style.display="none";
  })
  elementsByClass("dwa-exercise-submit").forEach(el=>{
    el.style.display="block";
  })
  document.getElementById("sign-out-ui").classList.remove("hidden");

  // setup FB subscriptions
  for(ex of Object.values(window.allExercises)) {
    ex.showUI();
  }
}

function initChapterPage() {
  // Listening for auth state changes.
  firebase.auth().onAuthStateChanged(makeHandleAuthStateChanged(showExerciseSubmitUIs,showSignInUIs));

  // setup event handlers for the sign-in buttons.
  elementsByClass("sign-in-btn").forEach(el=>{
    el.addEventListener('click', doSignIn);
  })
  // setup event handler for signing out.
  document.getElementById("sign-out-btn").addEventListener("click", doSignOut);

  // setup exercise UI's
  elementsByClass("dwa-exercise-submit").forEach(el=>{
    const exType = el.dataset.exercise_type;
    const exerciseClass = window.exerciseTypes[exType];
    const exercise = new exerciseClass(el);
  });

  elementsByClass("dwa-qna").forEach(el=>{
    const qnaForm = new QnAForm(el);
  })
};

/*
███████ ██   ██ ███████ ██████   ██████ ██ ███████ ███████     ███████  ██████  ██████  ███    ███ ███████
██       ██ ██  ██      ██   ██ ██      ██ ██      ██          ██      ██    ██ ██   ██ ████  ████ ██
█████     ███   █████   ██████  ██      ██ ███████ █████       █████   ██    ██ ██████  ██ ████ ██ ███████
██       ██ ██  ██      ██   ██ ██      ██      ██ ██          ██      ██    ██ ██   ██ ██  ██  ██      ██
███████ ██   ██ ███████ ██   ██  ██████ ██ ███████ ███████     ██       ██████  ██   ██ ██      ██ ███████
*/

window.allExercises = {}

class Exercise {
  constructor(element) {
    this.element    = element;
    this.slug       = element.dataset.exercise_slug;
    this.exNumber   = element.dataset.exercise_number;
    this.exType     = element.dataset.exercise_type;
    this.fbCallback = null;

    allExercises[this.slug] = this
  }

  showUI() {
    if(window.userInfo.status == "staff") {
      this.createResultsLink();
    } else {
      this.createFormUI();
      this.setupFirebaseSubscription();
    }
  }

  createFormUI() {
    // abstract
  }

  createResultsLink() {
    const url = `/exercise-results.html?group=${encodeURIComponent(window.userInfo.group)}&exercise=${encodeURIComponent(this.slug)}`
    this.element.innerHTML = `<div class="results-link"><a href="${url}">Toon resultaten</a>&nbsp;&nbsp;&nbsp;<a target="_blank" href="${url}">(in nieuw tabblad)</a>`
  }

  hideUI() {
    this.destroyUI();
    this.giveupFirebaseSubscription();
    this.element.innerHTML = "";
  }

  destroyUI() {
    // abstract
  };

  setupFirebaseSubscription(ref) {
    this.fbCallback = (snapshot)=>this.handleDBChange(snapshot)
    answerRef(this.slug).on('value',this.fbCallback)
    this.storeExerciseToDB();
  }

  giveupFirebaseSubscription() {
    if(this.fbCallback) {
      answerRef(this.slug).off('value', this.fbCallback);
      this.fbCallback = null;
    }
  }

  saveInput(text) {
      // console.log("setting text for", this.exNumber, this.slug, pr(text));
      answerRef(this.slug).set( {answer:text, time:firebase.database.ServerValue.TIMESTAMP} )
  }

  storeExerciseToDB() {
    if(window.userInfo.status == "staff") {
      const content  = this.element.closest(".exercise").querySelector(".exercise-content").innerHTML
      exerciseRef(this.slug).once('value', snapshot => {
        const val = snapshot.val()
        if( !val || val.exerciseNumber != this.exNumber || val.content != content || val.exerciseType != this.exType ) {
          // console.log(`Setting new exercise info for: «${this.slug}»:`,this.exNumber,content);
          exerciseRef(this.slug).set({exerciseNumber: this.exNumber, content, exerciseType: this.exType})
        }
      })
    }
  }

}  // end class Exercise

class ShortExercise extends Exercise {
  constructor(element) {
    super(element);
  }

  createFormUI() {
    this.element.innerHTML = this.formPrompt()
    this.inputField = document.createElement('input');
    this.inputField.type = "text";
    if(this.formPlaceholder) {
      this.inputField.setAttribute('placeholder', this.formPlaceholder())
    }
    this.element.appendChild(this.inputField);
    this.inputField.addEventListener('input', (evt)=>{
      this.saveInput(evt.target.value);
    })
  }
  formPrompt() {
    return '<div class="exercise-prompt">Geef een kort antwoord:</div>'
  }

  handleDBChange(snapshot) {
    if(snapshot.exists()) {
      const text = snapshot.val().answer;
      // console.log("handleExerciseDBChange", text);
      if( text != this.inputField.value ) {
        // console.log("handleExerciseDBChange setting new value:", text);
        this.inputField.value = text;
      }
    }
  }

}  // end class ShortExercise

class CommitExercise extends ShortExercise {
  constructor(element) {
    super(element);
  }

  formPrompt() {
    return '<div class="exercise-prompt">Geef de <i>complete</i> <b>GitHub-URL naar de commit</b> van je uitwerking:</div>'
  }
  formPlaceholder() {
    return "https://github.com/HANICA-DWA/jouw-repo/commit/78556e38000803fea6845eaf6ef43125eefa1940"
  }

}

class LongExercise extends Exercise {

  constructor(element) {
    super(element);
  }

  createFormUI() {
    this.element.innerHTML = '<div class="exercise-prompt">Geef je antwoord met toelichting:</div>';
    const textArea = document.createElement("textarea");
    this.element.appendChild(textArea);
    this.mde = new SimpleMDE({ // make it a markdown editor
      element: textArea,
      autofocus: false,
      autosave: { enabled: false },
      forceSync: false,
      indentWithTabs: false,
      toolbar: ["code","bold", "italic", "|", "heading", "quote", "unordered-list", "ordered-list", "|", "link", "image", "table", "|", "preview", "guide"],
      spellChecker: false,
    });
    this.mde.codemirror.on("change", (codemirrorInstance, changeObj) => {
      // console.log("MDE ON CHANGE", changeObj);
      if(changeObj.origin == "setValue") {
        return;
      } else {
        this.saveInput(this.mde.value());
      }
    });
  }

  destroyUI() {
    if(this.mde) {
      this.mde.toTextArea();
      this.mde = null;
    }
  }

handleDBChange(snapshot) {
    if(snapshot.exists()) {
      const text = snapshot.val().answer;
      // console.log("handleExerciseDBChange", text);
      if( text != this.mde.value() ) {
        // console.log("handleExerciseDBChange setting new value:", text);
        this.mde.value(text)
      }
    }
  }

}  // end class LongExercise

class CodeExercise extends Exercise {
  constructor(element) {
    super(element);
  }

  createFormUI() {
    this.element.innerHTML = '<div class="exercise-prompt">Geef je code (met comments) hieronder:</div>'
    this.preElement = document.createElement('pre');
    this.preElement.className = "code-exercise";
    this.preElement.textContent = "// your code here";
    this.preElement.setAttribute("data-language","javascript");
    this.preElement.isExercise = true;
    this.preElement.onEditorActivated   = (cm,d) => { this.attachCodeMirror(cm,d) } ;
    this.preElement.onEditorDeactivated = ()   => { this.detachCodeMirror()   } ;
    this.element.appendChild(this.preElement);
  }

  attachCodeMirror(editor, destroyCM) {
    this.codemirror = editor;
    this.codemirrorDestroyFunction = destroyCM;
    this.codemirror.on("change", (codemirrorInstance, changeObj) => {
      // console.log("CM ON CHANGE", changeObj.origin, pr(this.codemirror.getValue()));
      if(changeObj.origin == "setValue") {
        return;
      } else {
        const text = this.codemirror.getValue()
        this.preElement.textContent = text;
        this.saveInput(text);
      }
    });
  }

  detachCodeMirror(editor) {
    this.codemirror = null
  }

  destroyUI() {
    if(this.codemirrorDestroyFunction) {
      this.codemirrorDestroyFunction();
      this.codemirrorDestroyFunction = null;
      this.preElement = null;
    }
  }

  handleDBChange(snapshot) {

    if(snapshot.exists()) {
      const text = snapshot.val().answer;
      // console.log("handleExerciseDBChange-db:", pr(text));
      // console.log("handleExerciseDBChange-pre:", pr(this.preElement.textContent));
      if( text != this.preElement.textContent ) {
        // console.log("handleExerciseDBChange setting new value.");
        if(this.codemirror) {
          this.codemirror.setValue(text)
        }
        this.preElement.textContent = text;
      }
    }
  }

}// end class CodeExercise

window.exerciseTypes = {
  Short:  ShortExercise,
  Long:   LongExercise,
  Code:   CodeExercise,
  Commit: CommitExercise,
}

function answerRef(slug) {
  if( ! window.userInfo ) {
    throw new Error("cannot create answerRef without window.userInfo");
  }
  const user = window.userInfo.gitHubName
  return firebase.database().ref(`answers/${user}/${slug}`)
}

function exerciseRef(slug) {
  return firebase.database().ref(`exercises/${slug}`)
}


function currentUserRef() {
  const uid = firebase.auth().currentUser.uid
  return firebase.database().ref(`users/${uid}`)
}

// function pr(str) {
//   str = str.replace(/\n/g,"\\n");
//   str = str.replace(/\t/g,"\\t");
//   str = str.replace(/ /g,"~");
//   return str;
// }

/*
 ██████       █████  ███    ██ ██████       █████
██    ██     ██   ██ ████   ██ ██   ██     ██   ██
██    ██     ███████ ██ ██  ██ ██   ██     ███████
██ ▄▄ ██     ██   ██ ██  ██ ██ ██   ██     ██   ██
 ██████      ██   ██ ██   ████ ██████      ██   ██
    ▀▀
*/

function questionRef(qnaId, nr) {
  if( ! window.userInfo ) {
    throw new Error("cannot create questionRef without window.userInfo");
  }
  const user = window.userInfo.gitHubName
  return firebase.database().ref(`questions/${user}/${qnaId}/${nr}`)
}



class QnAForm {  // similar to LongExercise, but having multiple fields
                 // changes alomost all methods, and some datastructures
  constructor(element) {
    this.element    = element
    this.qnaId      = element.dataset.qnaid;
    this.minimum    = element.dataset.minimum;
    this.fbCallback = []
    this.mde        = []

    allExercises[this.slug] = this
    console.log("Constructor QnAForm", this.qnaId, this.minimum, this.element);
  }

  createResultsLink() {
    const url = `/qna-results.html?group=${encodeURIComponent(window.userInfo.group)}&qnaid=${encodeURIComponent(eh(this.qnaId))}`
    this.element.innerHTML = `<div class="results-link"><a href="${url}">Toon resultaten</a>&nbsp;&nbsp;&nbsp;<a target="_blank" href="${url}">(in nieuw tabblad)</a>`
  }

  showUI() {
    if(window.userInfo.status == "staff") {
      this.createResultsLink();
    } else {
      this.createFormUI();
      this.setupFirebaseSubscription();
    }
  }

  hideUI() {
    this.destroyUI();
    this.giveupFirebaseSubscription();
    this.element.innerHTML = "";
  }

  createFormUI() {

    const block1 = document.createElement("div");
    block1.classList.add("dwa-addition");
    let i;
    for(i=1;i<=this.minimum;i++) {
      this.createQuestionUI(i, block1);
    }
    this.element.appendChild(block1)
    const remark = document.createElement("p");
    remark.innerHTML = `<i>Je hoeft niet meer dan ${this.minimum} ${this.minimum == 1 ? "vraag" : "vragen"} te beantwoorden. Het blok hieronder is dus <b>optioneel</b></i>.`
    remark.classList.add("remark");
    const block2 = document.createElement("div");
    block2.classList.add("dwa-addition");
    block2.classList.add("optional");
    this.element.appendChild(remark);
    this.createQuestionUI(i, block2, true);
    this.createQuestionUI(i+1, block2, true);
    this.element.appendChild(block2)
  }

  createQuestionUI(questionNr, parentElement,optional = false) {
    const prompt = document.createElement("p")
    prompt.classList.add("prompt");
    prompt.innerHTML = optional ?
        `Extra vraag:`
      :
        `Voer hier je ${questionNr}e vraag in:`;
    parentElement.appendChild(prompt);
    const textArea = document.createElement("textarea");
    parentElement.appendChild(textArea);
    this.mde[questionNr] = new SimpleMDE({ // make it a markdown editor
      element: textArea,
      autofocus: false,
      autosave: { enabled: false },
      forceSync: false,
      indentWithTabs: false,
      toolbar: ["code","bold", "italic", "|", "heading", "quote", "unordered-list", "ordered-list", "|", "link", "image", "table", "|", "preview", "guide"],
      spellChecker: false,
    });
    this.mde[questionNr].codemirror.on("change", (codemirrorInstance, changeObj) => {
      // console.log("MDE ON CHANGE", changeObj);
      if(changeObj.origin == "setValue") {
        return;
      } else {
        this.saveInput(this.mde[questionNr].value(), questionNr);
      }
    });
  }

  destroyUI() {
    this.mde.forEach( editor => {
      editor.toTextArea();
    })
    this.mde = [];
  }

  setupFirebaseSubscription(ref) {
    for(let i = 1; i <= this.minimum+2; i++) {
      this.fbCallback[i] = (snapshot)=>this.handleDBChange(snapshot,i)
      questionRef(this.qnaId,i).on('value',this.fbCallback[i])
    }
    this.storeExerciseToDB();
  }

  giveupFirebaseSubscription() {
      this.fbCallback.forEach( (cb,index) => {
        questionRef(this.qnaId,index).off('value', cb);
      })
      this.fbCallback = [];
  }

  saveInput(text,questionNr) {
      // console.log("setting text for", this.exNumber, this.slug, pr(text));
      questionRef(this.qnaId,questionNr).set( {question:text, time:firebase.database.ServerValue.TIMESTAMP} )
  }

  handleDBChange(snapshot, questionNr) {
    if(snapshot.exists()) {
      const text = snapshot.val().question;
      // console.log("handleExerciseDBChange", text);
      if( text != this.mde[questionNr].value() ) {
        // console.log("handleExerciseDBChange setting new value:", text);
        this.mde[questionNr].value(text)
      }
    }
  }

  storeExerciseToDB() {
    if(window.userInfo.status == "staff") {
      qnaRef(this.slug).once('value', snapshot => {
        const val = snapshot.val()
        if( !val || val.minimum != this.minimum ) {
          // console.log(`Setting new exercise info for: «${this.slug}»:`,this.exNumber,content);
          qnaRef(this.slug).set({minimum: this.minimum})
        }
      })
    }
  }

}

/*
███████ ██   ██ ███████ ██████   ██████ ██ ███████ ███████     ██████  ███████ ███████ ██    ██ ██   ████████ ███████
██       ██ ██  ██      ██   ██ ██      ██ ██      ██          ██   ██ ██      ██      ██    ██ ██      ██    ██
█████     ███   █████   ██████  ██      ██ ███████ █████       ██████  █████   ███████ ██    ██ ██      ██    ███████
██       ██ ██  ██      ██   ██ ██      ██      ██ ██          ██   ██ ██           ██ ██    ██ ██      ██         ██
███████ ██   ██ ███████ ██   ██  ██████ ██ ███████ ███████     ██   ██ ███████ ███████  ██████  ███████ ██    ███████
*/


function initExerciseResultsPage() {

  firebase.auth().onAuthStateChanged(makeHandleAuthStateChanged(showResultsDisplayUI,showResultsPageSigninUI));

  document.getElementById('sign-in-btn').addEventListener('click', doSignIn)
  document.getElementById("sign-out-btn").addEventListener("click", doSignOut);

}

function showResultsPageSigninUI() {
  document.getElementById('sign-in-ui').classList.remove("hidden")
  document.getElementById('sign-out-ui').classList.add("hidden")
  document.getElementById('results-ui').classList.add("hidden")
  setSignInButtonsDisabled(false);
}

function showResultsDisplayUI() {
  if( window.userInfo.status != "staff") {
    doSignOut();
    return;
  }

  document.getElementById('sign-in-ui').classList.add("hidden")
  document.getElementById('sign-out-ui').classList.remove("hidden")
  document.getElementById('results-ui').classList.remove("hidden")
  setSignInButtonsDisabled(false);

  renderResults();
}

async function renderResults() {
  const urlParams     = new URLSearchParams(window.location.search);
  const exercise_slug = urlParams.get('exercise') || 'iffy: main diff from normal if';
  const group         = urlParams.get('group') || 'B';
  console.log("slug:",exercise_slug,group);
  const studentsP = firebase.database().ref("users").once('value')
  const exerciseP = firebase.database().ref(`exercises/${exercise_slug}`).once('value')
  let [students, exercise] = await Promise.all([studentsP, exerciseP])
  const studentsByGithubName = {}
  students.forEach( (snapshot) => {
    const s = snapshot.val();
    if( s.status == "student" && (s.group == group || s.group == "UNKNOWN"))
    studentsByGithubName[s.gitHubName] = {...s, uid: snapshot.key }
  });
  exercise = exercise.val();

  const allAnswerPromises = Object.values(studentsByGithubName).map( s =>
    firebase.database().ref(`answers/${s.gitHubName}/${exercise_slug}`).once('value')
  )
  let allAnswers = await Promise.all( allAnswerPromises )
  allAnswers = allAnswers.map( snapshot => ({ studentName: snapshot.ref.parent.key, ...(snapshot.val()) }) )
  allAnswers = allAnswers.map( a => {
    return { ...a, ...studentsByGithubName[a.studentName] }
  })

  allAnswers = allAnswers.filter( a => {
    return (a.group != "UNKNOWN" || a.answer != undefined)
  })

  allAnswers.sort( (a,b) => {
    if(a.answer === undefined && b.answer !== undefined) {
      return -1
    } else if(a.answer !== undefined && b.answer === undefined) {
      return 1
    } else if(a.group === "UNKNOWN" && b.group !== "UNKNOWN") {
      return -1
    } else if(a.group !== "UNKNOWN" && b.group === "UNKNOWN") {
      return 1
    } else {
      return a.time - b.time
    }
  })
  console.log("answers", allAnswers);
  renderResultTable( allAnswers, exercise.exerciseType );
}

function renderResultTable( answers, exerciseType ) {
  let html = `<table class="results-table">`
  answers.forEach( answer => {
    const unkownClass = answer.group == "UNKNOWN" ? "unkown" : ""
    const nothingClass = answer.answer == undefined ? "no-answer" : ""
    const typeClass = exerciseType.toLowerCase();
    const time = answer.time ? " - " + new Date(answer.time).toLocaleString("nl-NL") : "";
    let content;
    if( answer.answer ) {
      switch (exerciseType) {
        case "Short":  content = renderShortContent(answer.answer);  break;
        case "Long":   content = renderLongContent(answer.answer);   break;
        case "Code":   content = renderCodeContent(answer.answer);   break;
        case "Commit": content = renderCommitContent(answer.answer); break;
        default: throw new Error("Unkown exercise type: " + exerciseType)
      }
    }
    const eh = escapeHtml
    html += `<tr class="result-row ${typeClass} ${unkownClass} ${nothingClass}">`
    html += `  <td class="result-photo ${typeClass}"><img src="${eh(answer.avatarURL)}"></td>`
    html += `  <td class="result-author ${typeClass}"><h3>${eh(answer.studentName)}</h3><h4>${eh(answer.realName)}${time}</h4></td>`
    html += `  <td class="result-content ${typeClass}">${content || "Geen antwoord gegeven :-("}</td>`
    html += `</tr>`
  })
  html += `</table>`
  document.getElementById('results-container').innerHTML = html;
}

function renderShortContent( content ) {
  return escapeHtml(content);
}
function renderLongContent( content ) {
  return marked(escapeHtml(content));
}
function renderCodeContent( content ) {
  return '<pre><code>'+escapeHtml(content)+'</code></pre>';
}
function renderCommitContent( content ) {
  return `<a href=${content}>${escapeHtml(content)}</a>`;
}



/*
████████ ███████ ███████ ████████     ██████   █████  ████████  █████
   ██    ██      ██         ██        ██   ██ ██   ██    ██    ██   ██
   ██    █████   ███████    ██        ██   ██ ███████    ██    ███████
   ██    ██           ██    ██        ██   ██ ██   ██    ██    ██   ██
   ██    ███████ ███████    ██        ██████  ██   ██    ██    ██   ██
*/


testDBdata = {
  users: [  {uid: "testUser_01", gitHubName: "testUser_01", group:"A",      status: "staff",   realName: "Teacher 1 (A)",       email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
            {uid: "testUser_02", gitHubName: "testUser_02", group:"B",      status: "staff",   realName: "Teacher 2 (B)",       email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
            {uid: "testUser_03", gitHubName: "testUser_03", group:"A",      status: "student", realName: "Student 03 (A)",      email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
            {uid: "testUser_04", gitHubName: "testUser_04", group:"A",      status: "student", realName: "Student 04 (A)",      email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
            {uid: "testUser_05", gitHubName: "testUser_05", group:"B",      status: "student", realName: "Student 05 (B)",      email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
            {uid: "testUser_06", gitHubName: "testUser_06", group:"B",      status: "student", realName: "Student 06 (B)",      email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
            {uid: "testUser_07", gitHubName: "testUser_07", group:"B",      status: "student", realName: "Student 07 (B)",      email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
            {uid: "testUser_08", gitHubName: "testUser_08", group:"UNKOWN", status: "student", realName: "Student 08 (UNKOWN)", email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
            {uid: "testUser_09", gitHubName: "testUser_09", group:"A",      status: "student", realName: "Student 09 (A)",      email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
            {uid: "testUser_10", gitHubName: "testUser_10", group:"A",      status: "student", realName: "Student 10 (A)",      email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
            {uid: "testUser_11", gitHubName: "testUser_11", group:"A",      status: "student", realName: "Student 11 (A)",      email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
            {uid: "testUser_12", gitHubName: "testUser_12", group:"A",      status: "student", realName: "Student 12 (A)",      email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
            {uid: "testUser_13", gitHubName: "testUser_13", group:"A",      status: "student", realName: "Student 13 (A)",      email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
            {uid: "testUser_14", gitHubName: "testUser_14", group:"A",      status: "student", realName: "Student 14 (A)",      email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
            {uid: "testUser_15", gitHubName: "testUser_15", group:"A",      status: "student", realName: "Student 15 (A)",      email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
            {uid: "testUser_16", gitHubName: "testUser_16", group:"B",      status: "student", realName: "Student 16 (B)",      email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
            {uid: "testUser_17", gitHubName: "testUser_17", group:"B",      status: "student", realName: "Student 17 (B)",      email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
            {uid: "testUser_18", gitHubName: "testUser_18", group:"B",      status: "student", realName: "Student 18 (B)",      email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
            {uid: "testUser_19", gitHubName: "testUser_19", group:"A",      status: "student", realName: "Student 19 (A)",      email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
            {uid: "testUser_20", gitHubName: "testUser_20", group:"A",      status: "student", realName: "Student 20 (A)",      email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
            {uid: "testUser_21", gitHubName: "testUser_21", group:"A",      status: "student", realName: "Student 21 (A)",      email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
            {uid: "testUser_22", gitHubName: "testUser_22", group:"UNKOWN", status: "student", realName: "Student 22 (UNKOWN)", email: "a@b.com", avatarURL: "https://avatars3.githubusercontent.com/u/42325189?v=4"},
         ],
  answers: [ {ex: "hof: parameter name",                 user: "testUser_01", answer: "some short answer by Teacher 1 (A)",                                                                                            time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "hof: parameter name",                 user: "testUser_02", answer: "some short answer by Teacher 2 (B)",                                                                                            time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "hof: parameter name",                 user: "testUser_03", answer: "some short answer by Student 03 (A)",                                                                                           time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             // {ex: "hof: parameter name",                 user: "testUser_04", answer: "some short answer by Student 04 (A)",                                                                                           time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             // {ex: "hof: parameter name",                 user: "testUser_05", answer: "some short answer by Student 05 (B)",                                                                                           time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "hof: parameter name",                 user: "testUser_06", answer: "some short answer by Student 06 (B)",                                                                                           time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "hof: parameter name",                 user: "testUser_07", answer: "some short answer by Student 07 (B)",                                                                                           time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "hof: parameter name",                 user: "testUser_08", answer: "some short answer by Student 08 (UNKOWN)",                                                                                      time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "hof: parameter name",                 user: "testUser_09", answer: "some short answer by Student 09 (A)",                                                                                           time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "hof: parameter name",                 user: "testUser_10", answer: "some short answer by Student 10 (A)",                                                                                           time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "hof: parameter name",                 user: "testUser_11", answer: "some short answer by Student 11 (A)",                                                                                           time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "hof: parameter name",                 user: "testUser_12", answer: "some short answer by Student 12 (A)",                                                                                           time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "hof: parameter name",                 user: "testUser_13", answer: "some short answer by Student 13 (A)",                                                                                           time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "hof: parameter name",                 user: "testUser_14", answer: "some short answer by Student 14 (A)",                                                                                           time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             // {ex: "hof: parameter name",                 user: "testUser_15", answer: "some short answer by Student 15 (A)",                                                                                           time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             // {ex: "hof: parameter name",                 user: "testUser_16", answer: "some short answer by Student 16 (B)",                                                                                           time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "hof: parameter name",                 user: "testUser_17", answer: "some short answer by Student 17 (B)",                                                                                           time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "hof: parameter name",                 user: "testUser_18", answer: "some short answer by Student 18 (B)",                                                                                           time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "hof: parameter name",                 user: "testUser_19", answer: "some short answer by Student 19 (A)",                                                                                           time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "hof: parameter name",                 user: "testUser_20", answer: "some short answer by Student 20 (A)",                                                                                           time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "hof: parameter name",                 user: "testUser_21", answer: "some short answer by Student 21 (A)",                                                                                           time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "hof: parameter name",                 user: "testUser_22", answer: "some short answer by Student 22 (UNKOWN)",                                                                                      time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: if as a higher order function", user: "testUser_01", answer: "// this is JS code by Teacher 1 (A)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}",       time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: if as a higher order function", user: "testUser_02", answer: "// this is JS code by Teacher 2 (B)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}",       time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: if as a higher order function", user: "testUser_03", answer: "// this is JS code by Student 03 (A)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}",      time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             // {ex: "iffy: if as a higher order function", user: "testUser_04", answer: "// this is JS code by Student 04 (A)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}",      time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             // {ex: "iffy: if as a higher order function", user: "testUser_05", answer: "// this is JS code by Student 05 (B)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}",      time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: if as a higher order function", user: "testUser_06", answer: "// this is JS code by Student 06 (B)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}",      time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: if as a higher order function", user: "testUser_07", answer: "// this is JS code by Student 07 (B)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}",      time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: if as a higher order function", user: "testUser_08", answer: "// this is JS code by Student 08 (UNKOWN)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}", time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: if as a higher order function", user: "testUser_09", answer: "// this is JS code by Student 09 (A)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}",      time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: if as a higher order function", user: "testUser_10", answer: "// this is JS code by Student 10 (A)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}",      time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: if as a higher order function", user: "testUser_11", answer: "// this is JS code by Student 11 (A)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}",      time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: if as a higher order function", user: "testUser_12", answer: "// this is JS code by Student 12 (A)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}",      time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: if as a higher order function", user: "testUser_13", answer: "// this is JS code by Student 13 (A)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}",      time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: if as a higher order function", user: "testUser_14", answer: "// this is JS code by Student 14 (A)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}",      time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             // {ex: "iffy: if as a higher order function", user: "testUser_15", answer: "// this is JS code by Student 15 (A)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}",      time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             // {ex: "iffy: if as a higher order function", user: "testUser_16", answer: "// this is JS code by Student 16 (B)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}",      time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: if as a higher order function", user: "testUser_17", answer: "// this is JS code by Student 17 (B)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}",      time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: if as a higher order function", user: "testUser_18", answer: "// this is JS code by Student 18 (B)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}",      time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: if as a higher order function", user: "testUser_19", answer: "// this is JS code by Student 19 (A)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}",      time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: if as a higher order function", user: "testUser_20", answer: "// this is JS code by Student 20 (A)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}",      time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: if as a higher order function", user: "testUser_21", answer: "// this is JS code by Student 21 (A)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}",      time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: if as a higher order function", user: "testUser_22", answer: "// this is JS code by Student 22 (UNKOWN)\nfunction(c,t,e) {\n  if(4<5) {\n    return t('true');\n  } else {\n    return e();\n  }\n}", time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: main diff from normal if",      user: "testUser_01", answer: "#### Markdown antwoord van Teacher 1 (A)\nIk *snap* geen **bal** van deze opdracht!!",                                              time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: main diff from normal if",      user: "testUser_02", answer: "#### Markdown antwoord van Teacher 2 (B)\nIk *snap* geen **bal** van deze opdracht!!",                                              time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: main diff from normal if",      user: "testUser_03", answer: "#### Markdown antwoord van Student 03 (A)\nIk *snap* geen **bal** van deze opdracht!!",                                             time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             // {ex: "iffy: main diff from normal if",      user: "testUser_04", answer: "#### Markdown antwoord van Student 04 (A)\nIk *snap* geen **bal** van deze opdracht!!",                                             time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             // {ex: "iffy: main diff from normal if",      user: "testUser_05", answer: "#### Markdown antwoord van Student 05 (B)\nIk *snap* geen **bal** van deze opdracht!!",                                             time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: main diff from normal if",      user: "testUser_06", answer: "#### Markdown antwoord van Student 06 (B)\nIk *snap* geen **bal** van deze opdracht!!",                                             time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: main diff from normal if",      user: "testUser_07", answer: "#### Markdown antwoord van Student 07 (B)\nIk *snap* geen **bal** van deze opdracht!!",                                             time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: main diff from normal if",      user: "testUser_08", answer: "#### Markdown antwoord van Student 08 (UNKOWN)\nIk *snap* geen **bal** van deze opdracht!!",                                        time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: main diff from normal if",      user: "testUser_09", answer: "#### Markdown antwoord van Student 09 (A)\nIk *snap* geen **bal** van deze opdracht!!",                                             time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: main diff from normal if",      user: "testUser_10", answer: "#### Markdown antwoord van Student 10 (A)\nIk *snap* geen **bal** van deze opdracht!!",                                             time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: main diff from normal if",      user: "testUser_11", answer: "#### Markdown antwoord van Student 11 (A)\nIk *snap* geen **bal** van deze opdracht!!",                                             time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: main diff from normal if",      user: "testUser_12", answer: "#### Markdown antwoord van Student 12 (A)\nIk *snap* geen **bal** van deze opdracht!!",                                             time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: main diff from normal if",      user: "testUser_13", answer: "#### Markdown antwoord van Student 13 (A)\nIk *snap* geen **bal** van deze opdracht!!",                                             time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: main diff from normal if",      user: "testUser_14", answer: "#### Markdown antwoord van Student 14 (A)\nIk *snap* geen **bal** van deze opdracht!!",                                             time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             // {ex: "iffy: main diff from normal if",      user: "testUser_15", answer: "#### Markdown antwoord van Student 15 (A)\nIk *snap* geen **bal** van deze opdracht!!",                                             time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             // {ex: "iffy: main diff from normal if",      user: "testUser_16", answer: "#### Markdown antwoord van Student 16 (B)\nIk *snap* geen **bal** van deze opdracht!!",                                             time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: main diff from normal if",      user: "testUser_17", answer: "#### Markdown antwoord van Student 17 (B)\nIk *snap* geen **bal** van deze opdracht!!",                                             time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: main diff from normal if",      user: "testUser_18", answer: "#### Markdown antwoord van Student 18 (B)\nIk *snap* geen **bal** van deze opdracht!!",                                             time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: main diff from normal if",      user: "testUser_19", answer: "#### Markdown antwoord van Student 19 (A)\nIk *snap* geen **bal** van deze opdracht!!",                                             time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: main diff from normal if",      user: "testUser_20", answer: "#### Markdown antwoord van Student 20 (A)\nIk *snap* geen **bal** van deze opdracht!!",                                             time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: main diff from normal if",      user: "testUser_21", answer: "#### Markdown antwoord van Student 21 (A)\nIk *snap* geen **bal** van deze opdracht!!",                                             time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
             {ex: "iffy: main diff from normal if",      user: "testUser_22", answer: "#### Markdown antwoord van Student 22 (UNKOWN)\nIk *snap* geen **bal** van deze opdracht!!",                                        time: Date.now() - Math.floor(Math.random()*1000*60*60*24*7) },
           ],
}

function setTestDBdata() {
  allFirebaseSetPromises = []
  for(const {uid,gitHubName,group,status,email,realName,avatarURL} of testDBdata.users) {
    console.log("usert:", uid,gitHubName,group,status,email,realName,avatarURL);
    const promise = firebase.database().ref(`users/${uid}`).set( { gitHubName, group, status, realName, email, avatarURL })
    allFirebaseSetPromises.push(promise);
  }
  for(const {ex,user,answer,time} of testDBdata.answers) {
    console.log("answert:", ex,user,answer,time);
    const promise = firebase.database().ref(`answers/${user}/${ex}`).set( { answer, time })
    allFirebaseSetPromises.push(promise);
  }
  return Promise.all(allFirebaseSetPromises);
}

function removeTestDBData() {
  allFirebaseRemovePromises = []
  for(const {uid} of testDBdata.users) {
    console.log("remove usert:", uid);
    const promise = firebase.database().ref(`users/${uid}`).remove();
    allFirebaseRemovePromises.push(promise);
  }
  for(const {ex,user} of testDBdata.answers) {
    console.log("remove answert:", ex,user);
    const promise = firebase.database().ref(`answers/${user}/${ex}`).remove();
    allFirebaseRemovePromises.push(promise);
  }
  return Promise.all(allFirebaseRemovePromises);
}
