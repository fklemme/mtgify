'use strict'

class AutoTag {
  constructor(cardApi){
    this.textParserPromise = cardApi.newTextParser({
      ignoreCase: false,
      trimWhitespace: false,
    })

    const self = this
    document.addEventListener("DOMContentLoaded", function() {
      self.tagBody()
    })
  }
  tagBody() {
    return this.tagElement(document.body)
  }
  tagElement(elm) {
    const self = this
    return self.textParserPromise.then(tp => self._searchElement(tp, elm))
  }
  _searchElement(tp, elm) {
    if (elm.hasAttribute && elm.hasAttribute('no-autocard')){
      // check for function, not all node types have it
      return
    }
    const self = this
    if (elm.nodeType === Node.TEXT_NODE){
      const text = elm.textContent
      if (text) {
        const result = tp.replaceFirst(text)
        if (result.changed) {
          const nextSibling = elm.nextSibling

          // beforeText
          const beforeNode = document.createTextNode(result.beforeText)
          elm.parentNode.insertBefore(beforeNode, nextSibling)

          // newHTML
          elm.parentNode.insertBefore(result.newHTML, nextSibling)

          // afterText
          const afterNode = document.createTextNode(result.afterText)
          elm.parentNode.insertBefore(afterNode, nextSibling)

          elm.remove()
          self._searchElement(tp, afterNode)
        }
      }
    } else {
      if (elm.tagName.toLowerCase().includes('card-')){
        // skip autocard tags
        return
      }
      for(var ci = 0; ci < elm.childNodes.length; ci++){
        const childElm = elm.childNodes[ci]
        self._searchElement(tp, childElm)
      }
    }
    return ''
  }
}

module.exports = cardApi => new AutoTag(cardApi)