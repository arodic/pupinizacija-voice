!function(e){"use strict";var t=e.querySelector("#app");t.addEventListener("dom-change",function(){var n=e.querySelector("#webspeech"),o=!1,r=["kako","gde","zašto","kada","koliko","da li","ko je","ko su"],s=function(){o||(n.recognition.lang="sr",n.start())};e.addEventListener("keydown",s),e.addEventListener("mousedown",s),t.onResult=function(e){console.log(n.recognition),console.log(e.detail.result),this.result=e.detail.result;for(var t=0;t<r.length;t++)0===this.result.search(r[t])&&(this.result+="?");n.text=""},t.onStart=function(){o=!0},t.onEnd=function(){o=!1}})}(document);