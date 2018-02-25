'use strict'

const DeckList = require('../lib/DeckList')

const CardAPI = new (class {
  constructor() {
    const self = this
    self.lookupMultiverse = new Promise((resolve, reject) => {
      self.resolveMultiverse = lookup => resolve(lookup)
    })
    self.lookupAllCards = new Promise((resolve, reject) => {
      self.resolveAllCards = lookup => resolve(lookup)
    })
    self.baseUrl = (
      window.location.pathname.includes('test') ?
      `${window.location.href}/../../` :
      'http://autocard.mpaulweeks.com'
    )
    fetch(`${self.baseUrl}/json/Multiverse.lower.json`)
      .then(res => res.json())
      .then(lookup => self.resolveMultiverse(lookup))
    fetch(`${self.baseUrl}/json/AllCards.lower.json`)
      .then(res => res.json())
      .then(lookup => self.resolveAllCards(lookup))
  }
  normalizeCardName(cardName) {
    return cardName.trim().toLowerCase()
  }
  performLookup(lookup, cardName) {
    return lookup[this.normalizeCardName(cardName)]
  }
  getMultiverseId(cardName) {
    const self = this
    return self.lookupMultiverse
      .then(lookup => self.performLookup(lookup, cardName))
  }
  getCard(cardName) {
    const self = this
    return self.lookupAllCards
      .then(lookup => self.performLookup(lookup, cardName))
  }
})()

class _TextListener extends HTMLElement {
  setupTextListener(callback) {
    const self = this
    const callbackWrapper = function() {
      self._observer.disconnect();
      callback()
    }
    self._observer = new MutationObserver(callbackWrapper)
    self._observer.observe(self, { childList: true })
  }
}
class _AutoCard extends _TextListener {
  connectedCallback() {
    this.name = this.getAttribute('name')
    this.innerHTML = ''

    const url = `http://magiccards.info/query?q=${this.name}`
    const anchor = document.createElement('a')
    anchor.setAttribute('href', url)
    anchor.setAttribute('target', '_blank')
    anchor.innerHTML = this.name
    this.appendChild(anchor)
    this.anchor = anchor

    this.onLoad()
  }
  onLoad() {
    // do nothing, children override
  }
}
class CardText extends _AutoCard {}
class CardImage extends _AutoCard {
  onLoad() {
    const self = this
    CardAPI.getMultiverseId(self.name)
      .then(mid => self.loadMultiverseId(mid))
  }
  loadMultiverseId(mid) {
    this.mid = mid
    if (this.mid){
      const url = `http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${mid}&type=card`
      const image = document.createElement('img')
      image.setAttribute('src', url)
      image.setAttribute('alt', this.name)
      image.setAttribute('title', this.name)
      this.anchor.innerHTML = ''
      this.anchor.appendChild(image)
      this.image = image
    }
  }
}

class CardList extends _TextListener {
  connectedCallback() {
    const listSrc = this.getAttribute('src')
    this.renderText(listSrc)
  }
  renderText(listSrc) {
    const self = this;
    self.innerHTML = 'loading deck list...'
    DeckList.DeckListFromUrl(listSrc, cardName => CardAPI.getCard(cardName))
      .then(data => {
        self.innerHTML = ''
        data.forEach(typeData => {
          self.innerHTML += `<h3>${typeData.type}</h3>`
          typeData.cards.forEach(card => {
            self.innerHTML += `<div>${card.quantity}x ${card.card.name}</div>`
          })
        })
      })
  }
}

customElements.define('card-text', CardText)
customElements.define('card-image', CardImage)
customElements.define('card-list', CardList)

module.exports = {}