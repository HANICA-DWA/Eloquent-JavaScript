(function () {
  let asideRefs = Array.from(document.getElementsByClassName('aside-ref'))
  // console.log("@@@", asideRefs);
  asideRefs.forEach(el => {
    let note = el.nextElementSibling
    let xOffset = el.offsetLeft;
    let dx = el.offsetParent.offsetWidth - xOffset + 20
    note.firstChild.style.left = dx+"px";
    // console.log("### Moved", note, "by", dx, el);
  })
})()
