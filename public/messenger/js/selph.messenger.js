(function(window, document){
  if(window.slphmsn) {
      console.error('Selph messenger already loaded');
      return;
  }

  window.slphmsn = {};

  var elm = document.createElement('script');
  elm.type = "text/javascript";
  elm.async = true;
  elm.src = "/messenger/js/selph.messenger.api.js";
  var before = document.getElementsByTagName('script')[0];
  before.parentNode.insertBefore(elm, before);

})(window, document, undefined);
