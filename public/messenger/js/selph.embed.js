(function (window, document) {
  if (window.slphemb) {
    console.error("Selph embed already loaded");
    return;
  }

  // if (navigator.userAgent.indexOf("Chrome") === -1) {
  //   console.error("Your browser is not supported.");
  //   return;
  // }

  window.slphemb = {};
  
  var embedScript = document.querySelector(
    'script[data-id="tslphmbed"][data-selphid]'
  );
  var isProduction = embedScript.getAttribute("data-local") === null;

  var elm = document.createElement("script");
  elm.type = "text/javascript";
  elm.async = true;
  // elm.src = "http://localhost:3002/messenger/js/selph.shim.js";
  elm.src = `${
    isProduction ? "https://app.trueselph.com" : "http://localhost:3002"
  }/messenger/js/selph.shim.js`;

  var before = document.getElementsByTagName("script")[0];
  before.parentNode.insertBefore(elm, before);
})(window, document, undefined);
