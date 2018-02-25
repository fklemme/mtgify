!function(){return function t(e,n,r){function o(i,a){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!a&&c)return c(i,!0);if(s)return s(i,!0);var d=new Error("Cannot find module '"+i+"'");throw d.code="MODULE_NOT_FOUND",d}var u=n[i]={exports:{}};e[i][0].call(u.exports,function(t){var n=e[i][1][t];return o(n||t)},u,u.exports,t,e,n,r)}return n[i].exports}for(var s="function"==typeof require&&require,i=0;i<r.length;i++)o(r[i]);return o}}()({1:[function(t,e,n){"use strict";const r=t("./DeckList"),o=t("./HoverCard"),s=t("./CardAPI");class i extends HTMLElement{setupTextListener(t){const e=this;e._observer=new MutationObserver(function(){e._observer.disconnect(),t()}),e._observer.observe(e,{childList:!0})}}class a extends i{connectedCallback(){this.name=this.getAttribute("name"),this.innerHTML="";const t=`http://magiccards.info/query?q=${this.name}`,e=document.createElement("a");e.setAttribute("href",t),e.setAttribute("target","_blank"),e.innerHTML=this.name,this.appendChild(e),this.anchor=e,this.onLoad()}getCardInfo(){return s.getCardInfo(this.name)}onLoad(){}}customElements.define("card-text",class extends a{onLoad(){this.onmouseover=(t=>{o.show(this)}),this.onmouseout=(t=>{o.hide(this)})}}),customElements.define("card-image",class extends a{onLoad(){this.loadMultiverseId()}loadMultiverseId(t){const e=this;e.getCardInfo().then(t=>{const n=document.createElement("img");n.setAttribute("src",t.imgUrl),n.setAttribute("alt",e.name),n.setAttribute("title",e.name),e.anchor.innerHTML="",e.anchor.appendChild(n),e.image=n})}}),customElements.define("card-list",class extends i{connectedCallback(){const t=this.getAttribute("src");this.renderText(t)}renderText(t){const e=this;e.innerHTML="loading deck list...",r.DeckListFromUrl(t,t=>s.getCardInfo(t)).then(t=>{e.innerHTML="",t.forEach(t=>{e.innerHTML+=`<h3>${t.type}</h3>`,t.cards.forEach(t=>{e.innerHTML+=`<div>${t.quantity}x <card-text name="${t.card.name}"></card-text></div>`})})})}}),e.exports={}},{"./CardAPI":2,"./DeckList":3,"./HoverCard":4}],2:[function(t,e,n){"use strict";const r=new class{constructor(){const t=this;t.lookupInfo=new Promise((e,n)=>{t.resolveInfo=(t=>e(t))}),t.baseUrl=window.location.pathname.includes("test")?`${window.location.href}/../../`:"http://autocard.mpaulweeks.com",fetch(`${t.baseUrl}/json/CardInfo.lower.json`).then(t=>t.json()).then(e=>t.resolveInfo(e))}normalizeCardName(t){return t.trim().toLowerCase()}performLookup(t,e){return t[this.normalizeCardName(e)]}getCardInfo(t){const e=this;return e.lookupInfo.then(n=>e.performLookup(n,t)).then(t=>({...t,imgUrl:`http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${t.multiverseid}&type=card`}))}};e.exports=r},{}],3:[function(t,e,n){"use strict";const r=["Land","Creature","Artifact","Enchantment","Planeswalker","Instant","Sorcery"].reverse(),o=["Creature","Planeswalker","Artifact","Enchantment","Instant","Sorcery","Land"];class s{constructor(t,e){this.text=t,this.allCardsLookup=e}categorizeCardList(){const{text:t,allCardsLookup:e}=this,n={},o=[];return t.split("\n").forEach(t=>{const s=t.trim();if(0===s.length)return;const i=s.indexOf("x "),a=s.substring(0,i),c=s.substring(i+2),d=e(c).then(e=>{if(!e)return void console.log("failed to find card",t);let o=null;r.forEach(t=>{e.types.includes(t)&&(o=t)}),o&&(n[o]||(n[o]=[]),n[o].push({quantity:a,card:e}))});o.push(d)}),Promise.all(o).then(()=>n)}getDataPromise(){return this.categorizeCardList().then(t=>{const e=[];return o.forEach(n=>{t[n]&&e.push({type:n,cards:t[n]})}),e})}}e.exports={DeckList:s,DeckListFromUrl:function(t,e){return fetch(t).then(t=>t.text()).then(t=>new s(t,e).getDataPromise())}}},{}],4:[function(t,e,n){const r=311,o=220,s=document.createElement("div");s.style="visibility: hidden; position: absolute;",document.addEventListener("DOMContentLoaded",function(){document.body.appendChild(s)});const i=document.createElement("img");i.onerror="this.onerror=null;this.onmouseout=null;this.onmouseover=null;hideImgPopup();",i.width=o,i.height=r,s.appendChild(i),e.exports={show:function(t){t.getCardInfo().then(e=>{s.setAttribute("data-mid",e.multiverseid),s.style.top=`${function(t){const e=document.body;let n=t.offsetTop,o=t;for(;null!=o.offsetParent;)n+=null==(o=o.offsetParent).offsetTop?0:o.offsetTop;return e.offsetHeight<n+r&&(n-=r-t.offsetHeight),n}(t)}px`,s.style.left=`${function(t){const e=document.body;let n=t.offsetLeft+t.offsetWidth+10,r=t;for(;null!=r.offsetParent;)n+=null==(r=r.offsetParent).offsetLeft?0:r.offsetLeft;return e.offsetWidth<n+o&&(n-=t.offsetWidth+o),n}(t)}px`,i.src="",i.src=e.imgUrl,s.style.visibility="Visible"})},hide:function(t){t.getCardInfo().then(t=>{s.getAttribute("data-mid")===String(t.multiverseid)&&(s.style.visibility="Hidden")})}}},{}],5:[function(t,e,n){t("./AutoCard.js")},{"./AutoCard.js":1}]},{},[5]);