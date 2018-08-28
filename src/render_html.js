const PJSON = require("./pseudo_json")
let fs = require("fs"), mold = new (require("mold-template"))
let {transformTokens} = require("./transform")
let CodeMirror = require("codemirror/addon/runmode/runmode.node.js")
require("codemirror/mode/javascript/javascript.js")
require("codemirror/mode/xml/xml.js")
require("codemirror/mode/css/css.js")
require("codemirror/mode/htmlmixed/htmlmixed.js")
const slugify = require("./firebaseSlugify")

let file, epub = false
for (let arg of process.argv.slice(2)) {
  if (arg == "--epub") epub = true
  else if (file) throw new Error("Multiple input files")
  else file = arg == "-" ? "/dev/stdin" : arg
}
if (!file) throw new Error("No input file")
let chapter = /^\d{2}_([^\.]+)/.exec(file) || [null, "hints"]

let {tokens, metadata} = transformTokens(require("./markdown").parse(fs.readFileSync(file, "utf8"), {}), {
  defined: epub ? ["book", "html"] : ["interactive", "html"],
  strip: epub ? "hints" : "",
  takeTitle: true,
  index: false
})

let close = epub ? "/" : ""

let chapters = fs.readdirSync(__dirname + "/..")
    .filter(file => /^\d{2}_\w+\.md$/.test(file))
    .sort()
    .map(file => /^\d{2}_(\w+)\.md$/.exec(file)[1])
if (epub) chapters.push("hints")

/* DWA additions start */
let chapterNumber = null;
let subChapterNumber = 0;
let exerciseNumber = 0;
if (chapter) {
  chapterNumber = chapters.indexOf(chapter[1])
  if(chapterNumber == -1){
    chapterNumber=null;
  }
}
/* DWA additions end */

function escapeChar(ch) {
  return ch == "<" ? "&lt;" : ch == ">" ? "&gt;" : ch == "&" ? "&amp;" : "&quot;"
}
function escape(str) { return str.replace(/[<>&"]/g, escapeChar) }

function highlight(lang, text) {
  if (lang == "html") lang = "text/html"
  let result = ""
  CodeMirror.runMode(text, lang, (text, style) => {
    let esc = escape(text)
    result += style ? `<span class="${style.replace(/^|\s+/g, "$&cm-")}">${esc}</span>` : esc
  })
  return result
}

function maybeSplitInlineCode(html) {
  if (html.length <= 16) return html
  return html.replace(/[.\/](?!\/)/g, `$&<wbr${close}>`)
}

const seenIDs = Object.create(null)
function anchor(token) {
  let id = token.hashID
  if (!id || id in seenIDs) return ""
  seenIDs[id] = true
  return `<a class="${id.charAt(0)}_ident" id="${id}" href="#${id}" tabindex="-1" role="presentation"></a>`
}

function attrs(token) {
  return token.attrs ? token.attrs.map(([name, val]) => ` ${name}="${escape(String(val))}"`).join("") : ""
}

let linkedChapter = null

let renderer = {
  fence(token) {
    // dwa-addition
    if(token.info == "dontedit") {
      return `<pre>e${ escape(token.content.trimRight())}</pre>`
    }
    // end dwa-addition
    let config = /\S/.test(token.info) ? PJSON.parse(token.info) : {}
    if (config.hidden) return "";
    let lang = config.lang || "javascript"
    return `\n\n<pre${attrs(token)}`+
           ` class="snippet cm-s-default"`+
           ` data-language="${lang}"`+
           ` ${config.focus
                ? " data-focus=\"true\""
                : ""}`+
           ` ${config.sandbox
                ? ` data-sandbox="${config.sandbox}"`
                : ""}`+
           `${config.meta ?
                ` data-meta="${config.meta}"`
                : ""}>`+
           `${anchor(token)}${highlight(lang, token.content.trimRight())}</pre>`
  },

  hardbreak() { return `<br${close}>` },
  softbreak() { return " " },

  text(token) {
    let {content} = token
    if (linkedChapter != null) content = content.replace(/\?/g, linkedChapter)
    return escape(content)
  },

  paragraph_open(token) { return `\n\n<p${attrs(token)}>${anchor(token)}` },
  paragraph_close() { return "</p>" },

  /* DWA additions start */
  heading_open(token) {
    let numbering = "";
    if(token.tag == "h2") {
      subChapterNumber++;
      exerciseNumber = 0;
      numbering = subChapterNumber
      if(chapterNumber) {
        numbering = chapterNumber + "." + numbering
      }
      return `\n\n<div class="dwa-heading"><div class="numbering">${numbering}</div><div class="heading"><${token.tag}${attrs(token)}>${anchor(token)}`
    } else {
      return `\n\n<${token.tag}${attrs(token)}>${anchor(token)}${numbering}`
    }
  },
  heading_close(token) {
    if(token.tag == "h2") {
      return `</div></div></${token.tag}>`
    } else {
      return `</${token.tag}>`
    }
  },
  /* DWA additions end */

  bullet_list_open(token) { return `\n\n<ul${attrs(token)}>` },
  bullet_list_close() { return `</ul>` },

  ordered_list_open(token) { return `\n\n<ol${attrs(token)}>` },
  ordered_list_close() { return `\n\n</ol>` },

  list_item_open() { return "\n\n<li>" },
  list_item_close() { return "</li>" },

  table_open() { return "\n\n<table>" },
  table_close() { return "\n\n</table>" },
  tbody_open() { return "" },
  tbody_close() { return "" },
  tr_open() { return "\n\n<tr>" },
  tr_close() { return "\n\n</tr>" },
  td_open() { return "<td>" },
  td_close() { return "</td>" },

  html_block(token) { return token.content },

  code_inline(token) { return `<code>${maybeSplitInlineCode(escape(token.content))}</code>` },

  strong_open() { return "<strong>" },
  strong_close() { return "</strong>" },

  em_open() { return "<em>" },
  em_close() { return "</em>" },

  sub_open() { return "<sub>" },
  sub_close() { return "</sub>" },

  sup_open() { return "<sup>" },
  sup_close() { return "</sup>" },

  link_open(token) {
    let alt = token.attrGet("alt"), href= token.attrGet("href")
    let maybeChapter = /^(\w+)(#.*)?$/.exec(href)
    if (maybeChapter && chapters.includes(maybeChapter[1])) {
      let number = ""
      if (maybeChapter[1] != "hints") {
        linkedChapter = chapters.indexOf(maybeChapter[1])
        number =  pad(linkedChapter) + "_"
      }
      href = number + maybeChapter[1] + (epub ? ".xhtml" : ".html") + (maybeChapter[2] || "")
    }
    return `<a href="${escape(href)}"${alt ? ` alt="${escape(alt)}"` : ""}>`
  },
  link_close() { linkedChapter = null; return "</a>" },

  inline(token) { return renderArray(token.children) },

  meta_figure(token) {
    let {url, alt, chapter} = token.args[0]
    let className = !chapter ? null : "chapter" + (chapter == "true" ? "" : " " + chapter)
    return `<figure${attrs(token)}${className ? ` class="${className}"` : ""}><img src="${escape(url)}" alt="${escape(alt)}"${close}></figure>`
  },

  meta_quote_open() { return "\n\n<blockquote>" },
  meta_quote_close(token) {
    let {author, title} = token.args[0] || {}
    return (author ? `\n\n<footer>${escape(author)}${title ? `, <cite>${escape(title)}</cite>` : ""}</footer>` : "") +
      "\n\n</blockquote>"
  },
  meta_keyname_open() { return "<span class=\"keyname\">" },
  meta_keyname_close() { return "</span>" },

  meta_hint_open() { return "\n\n<div class=\"solution\"><div class=\"solution-text\">" },
  meta_hint_close() { return "\n\n</div></div>" },

  //-------- Added meta-things by DWA team -------------

  meta_youtube(token) {
      let id = token.args[0]
      return (
        `\n\n<div class="youtube dwa-addition">
          <iframe width="560" height="315"
                  src="https://www.youtube.com/embed/${id}?rel=0"
                  frameborder="0"
                  allow="autoplay; encrypted-media"
                  allowfullscreen>
          </iframe>
        </div>`)
  },

  meta_note_open(token) {
    return `\n\n<div class="note dwa-addition">`
  },
  meta_note_close(token) {
      return `\n\n</div>`
  },

  meta_exShort_open(token) {
    return renderer.meta_ex_open(token, "Short")
  },
  meta_exShort_close(token) {
    return renderer.meta_ex_close(token, "Short")
  },

  meta_exLong_open(token) {
    return renderer.meta_ex_open(token, "Long")
  },
  meta_exLong_close(token) {
    return renderer.meta_ex_close(token, "Long")
  },

  meta_exCode_open(token) {
    return renderer.meta_ex_open(token, "Code")
  },
  meta_exCode_close(token) {
    return renderer.meta_ex_close(token, "Code")
  },

  meta_exCommit_open(token) {
    return renderer.meta_ex_open(token, "Commit")
  },
  meta_exCommit_close(token) {
    return renderer.meta_ex_close(token, "Commit")
  },

  meta_qna_open(token) {
    const id = slugify(token.args[0])
    const minimum = token.args[1]
    return `\n\n<div class="dwa-qna" data-qnaid="${id}" data-minimum="${minimum}">`;
  },
  meta_qna_close(token) {
    return `\n\n</div><div class="sign-in dwa-addition"><button class="sign-in-btn">Log in</button> met je Github account om vragen in te sturen.</div>`;
  },


  meta_ex_open(token, exerciseType="Long") {
    exerciseNumber++
    const slug = slugify(token.args[1])
    let title = token.args[0]
    if( !title && !slug) {
      errorMsg = `Exercise ${chapterNumber}.${subChapterNumber}.${exerciseNumber} needs both a title and an internal name.`
      console.error("ERROR:",errorMsg);
      return `\n\n<div class="dwa-addition error-msg">INTERNAL BOOK ERROR: ${errorMsg}</div>`
    }
    if(chapterNumber) {
      title = `Oefening ${chapterNumber}.${subChapterNumber}.${exerciseNumber}: ${title}`
    }
    return `\n\n<div class="exercise dwa-addition"><div class="exercise-content"><header>${title}</header>`
  },
  meta_ex_close(token, exerciseType="Long") {
    const slug = slugify(token.args[1])
    const exNumber = `${chapterNumber}.${subChapterNumber}.${exerciseNumber}`
    return `</div>\n\n<div class="sign-in"><button class="sign-in-btn">Log in</button> met je Github account om antwoorden in te sturen.</div><div class="dwa-exercise-submit" data-exercise_number="${exNumber}" data-exercise_slug="${slug}" data-exercise_type="${exerciseType}"></div></div>`
  },

  meta_todo_open(token) {
    return `\n\n<div class="note todo dwa-addition"><strong>TO DO:</strong>`
  },
  meta_todo_close(token) {
      return `\n\n</div>`
  },

  meta_aside_open(token, isFixMe = false) {
    let fixmeClass = isFixMe ? "fixme" : ""
    let refStar = `<span class="aside-ref ${fixmeClass}">✱</span>`
    let asideStar = `<span class="aside-star ${fixmeClass}">✱</span>`
    let title = token.args[0]
    if(title || isFixMe) {
      title = `<span class="aside-title ${fixmeClass}">${asideStar} ${title || "FIX ME:"}</span>`
    } else {
      title = asideStar + "&nbsp; "
    }
    return refStar + `<span class="aside"><span class="sidenote ${fixmeClass}">${title}`
  },

  meta_aside_close(token) {
    return `</span></span>`
  },

  meta_fixme_open(token) {
    return renderer.meta_aside_open(token, true)
  },

  meta_fixme_close(token) {
    return renderer.meta_aside_close(token)
  },

  meta_skip_open(token) {

    return `<div class="skip-open">
      De volgende, grijze tekst hoef je niet te lezen. <br>
      Lees verder waar de tekst weer zwart-op-wit wordt.</div>
      <div class="skip">`
  },
  meta_skip_close(token) {
    return `</div><div class="skip-close">einde van tekst die overgeslagen kan worden</div>`
  },

  // allow html iside markdown:
  html_inline(token) {
    return token.content
  }

  //-------- End meta-things by DWA team -------------

}

function renderArray(tokens) {
  let result = ""
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i], f = renderer[token.type]
    if (!f) throw new Error("No render function for " + token.type)
    result += f(token)
  }
  return result
}

function pad(n) {
  return (n < 10 ? "0" : "") + n
}

metadata.content = renderArray(tokens)
let index
if (chapter && (index = chapters.indexOf(chapter[1])) > -1) {
  metadata.chap_num = index
  if (index > 0) metadata.prev_link = `${pad(index - 1)}_${chapters[index - 1]}`
  metadata.current_page = `${pad(index)}_${chapters[index]}`
  if (index < chapters.length - 1) metadata.next_link = `${pad(index + 1)}_${chapters[index + 1]}`
}

let template = mold.bake("chapter", fs.readFileSync(__dirname + `/${epub ? "epub_" : ""}chapter.html`, "utf8"))

console.log(template(metadata))
