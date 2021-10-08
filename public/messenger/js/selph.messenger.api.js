class SelphMessengerAPI {
  INTERACT = `
    query ($handle: String!, $utterance: String!) {
        interaction(input: { handle: $handle, utterance: $utterance }) {
          utterance
          label
          transcript
          caption
          sequenceUri
        }
    }
    `;

  ALL_PROMPTS_BY_SELPH = `
    query ($handle: String) {
        imprints(where: {_where: [{selph: {handle: $handle}}, {type_ne: "idle"}, {type_ne: "confused"}]}) {
          prompt
        }
    }
    `;

  init = (selphid, server) => {
    this.selphid = selphid;
    this.server = server;
    this.activePlayer = document.getElementById("activePlayer");
    this.activeSequence = document.getElementById("activeSequence");
    this.inputForm = document.getElementById("selphio__inputForm");
    this.inputField = document.getElementById("selphio__inputField");
    this.promptList = document.getElementById("promptList");
    // this.menu = document.getElementById("selphio__menu");
    // this.promptMenuToggle = document.getElementById("selphio__menuToggle");
    this.messagesList = document.querySelector(".chat-messages-list");
    this.messageDialog = document.getElementById("selphio__dialog");
    this.sttToggle = document.getElementById("selphio__sttToggle");
    this.chatLoaderContainer = document.querySelector(".chat-loader-container");
    this.chatInfoContainer = document.querySelector(".chat-info-container");
    this.idlePlayer = document.getElementById("idlePlayer");
    this.selphBanner =  document.querySelector('.avator_wrap');

    this.theList =  document.querySelector("#selphio__input > .list-group");

    this.closeMenu = document.querySelector(".fa-window-close");
    this.isSelphThinking = false;
    this.speechRecogEnabled = false;
    this.recognizing = false;
    this.speechRecogEngine = null;
    //set up speech recog
    this.initSpeechRecog();
    //fetch the quick response prompts
    this.initPrompts();
    //init the controls
    this.initControls();


    console.log("HERE>>>>>>>>>>>>>>>>>>>")
  };

  initControls = () => {

    this.activePlayer.oncanplaythrough = this.fadeFromIdle;
    this.activePlayer.onended = this.fadeToIdle;
    this.activePlayer.style.display = "None";
    // this.menu.style.display='None';

    this.idlePlayer.setAttribute(
      "src",
      `${this.server}/selph/stream/${this.selphid}/idle`
    );

    this.idlePlayer.addEventListener("loadedmetadata", () => {
      document
        .getElementById("selphio__loadmask")
        .classList.add("selphio__fade-out");
      setTimeout(function () {
        document.getElementById("selphio__loadmask").remove();
      }, 500);
      document
        .querySelector(".selphio__container")
        .classList.remove("selphio__loading");
    });

    //add event listener to the input field
    this.inputForm.addEventListener("submit", this.interact);


    var currentFocus;

    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }

    const prompt_set = new Set()

    var currentFocus;


    this.inputField.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");


      if (x) x = x.getElementsByTagName("div");


      console.log(e.keyCode, this.id)
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  })

    this.inputField.addEventListener("keypress", (e) => {
      
      console.log(this.inputField.value)
      // this.toggleMenu
      var self = this
      fetch(`${this.server}/selph/prompts/${this.selphid}`)
      .then((result) => result.json())
      .then((prompts) => {
        // console.log({prompts})
        // TODO: need testing
        self.theList.innerHTML = ''


        var a, b, i, val = this.inputField.value

        console.log(a, b, i, val)
        for (i = 0; i < prompts.length; i++) {

    


          if (prompts[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
           console.log(prompts[i])
         
            b = document.createElement("DIV");
            // b.setAttribute("id", i + "autocomplete-list");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong style='color:black;'>" + prompts[i].substr(0, val.length) + "</strong>";
            b.innerHTML += prompts[i].substr(val.length);


            var item =  document.createElement('li')
            item.classList.add("list-group-item")
            item.classList.add("text-secondary")
            item.classList.add("bg-light")
            item.setAttribute("id", this.id + "autocomplete-list");

            item.prepend(b)
            // item.appendChild(b)



            item.addEventListener("click", function () {
           console.log("TEXT",item.innerText)
              
              self.doPrompt(item.innerText);
              self.theList.innerHTML = ''

              // self.toggleMenu();
            });

            self.theList.appendChild(item)

          //   var element = document.getElementById("yourDivID");
          // element.scrollTop = element.scrollHeight;
          }

        }

      })
      .catch(function (error) {
        console.log(error);
      });


    });


    
    // this.closeMenu.addEventListener("click", () => {
    //   if (this.menu.classList.contains("expanded")) {
    //     this.menu.classList.remove("expanded");
    //     this.menu.classList.add("collapsed");
    //     this.menu.style.display='None';

    //   }
    // });

    // this.inputForm.addEventListener("keyup", function (){
    //   // this.toggleMenu
    //   if (!this.menu.classList.contains("collapsed")) {
    //     // this.menu.classList.remove("collapsed");
    //     // this.menu.classList.add("expanded");
    //     this.menu.classList.remove("expanded");
    //     this.menu.classList.add("collapsed");
    //   } else {
    //   }
    // });
    // this.promptMenuToggle.addEventListener("click", this.toggleMenu);
  };

  initPrompts = () => {
    var self = this;
    fetch(`${this.server}/selph/prompts/${this.selphid}`)
      .then((result) => result.json())
      .then((prompts) => {
        prompts.forEach(function (prompt) {
          if (prompt && prompt.trim()) {
            promptList.appendChild(self.createPromptItem(prompt));
          }
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  createPromptItem = (prompt) => {
    // Create the remove button
    const promptButton = document.createElement("button");
    promptButton.classList.add("__btn");
    promptButton.innerHTML = prompt;
    var self = this;
    // Attach an event to remove the todo
    promptButton.addEventListener("click", function () {
      self.doPrompt(prompt);
      self.toggleMenu();
    });

    // Create the list item
    const listItem = document.createElement("li");
    // append the remove item button
    listItem.appendChild(promptButton);

    return listItem;
  };

  doPrompt = (prompt) => {
    this.inputField.value = prompt;
    this.interact();
  };

  initSpeechRecog = () => {
    let SpeechRecog =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecog) {
      // speech recognition API supported
      this.speechRecogEngine = new SpeechRecog();
      this.speechRecogEnabled = true;
      this.speechRecogEngine.interimResults = true;

      this.speechRecogEngine.onstart = (event) => {
        this.recognizing = true;
        this.sttToggle.classList.add("active");
      };

      this.speechRecogEngine.onresult = (event) => {
        let transcript = event.results[0][0].transcript;
        this.inputField.value = transcript;
      };

      this.speechRecogEngine.onend = (event) => {
        this.recognizing = false;
        this.sttToggle.classList.remove("active");
        this.interact();
      };

      this.speechRecogEngine.onerror = (event) => {
        this.recognizing = false;
      };

      this.sttToggle.addEventListener("click", this.toggleSTT);
    } else {
      // speech recognition API not supported
      this.speechRecogEnabled = false;
    }
  };

  toggleSTT = () => {
    if (this.speechRecogEnabled && !this.recognizing) {
      this.speechRecogEngine.start();
    } else if (this.speechRecogEnabled) {
      this.speechRecogEngine.stop();
    }
  };

  interact = (event) => {
    if (event) event.preventDefault();

    let utterance = this.inputField.value;
    if (utterance.trim()) {
      this.inputField.value = "";
      this.addMessage(utterance, true);
      this.selphIsThinking();
      var self = this;

      fetch(`${this.server}/selph/interact`, {
        method: "POST",
        body: JSON.stringify({ handle: this.selphid, utterance }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((result) => result.json())
        .then((result) => {
          //if interrupted, pause and transition back to idle
          self.stopActiveSequence();
          //we need this to facilitate adding a one-time listener
          var f = function () {
            self.addMessage(result.transcript);
            self.selphStoppedThinking();
            self.activePlayer.removeEventListener("canplaythrough", f);
          };
          //add a delay to this to make it more relaistic
          setTimeout(function () {
            self.activeSequence.setAttribute("src", `${result.sequenceUri}`);
            self.activePlayer.load();
            self.activePlayer.addEventListener("canplaythrough", f);
            // this.activePlayer.style.display = "";
          }, 500);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  fadeFromIdle = () => {

    
    console.log("fadeFromIdle")

    if(this.idlePlayer.classList.contains('animate__fadeIn')){
      this.idlePlayer.classList.remove('animate__animated', 'animate__fadeIn');
      this.idlePlayer.classList.add('animate__animated', 'animate__fadeOut');

      this.idlePlayer.style.display = "None";
      this.activePlayer.style.display = "";
      this.activePlayer.classList.add('animate__animated', 'animate__fadeIn');
      
    }

    this.idlePlayer.classList.add('animate__animated', 'animate__fadeOut');
    this.idlePlayer.style.display = "None";
    this.activePlayer.style.display = "";
    this.activePlayer.classList.remove('animate__animated', 'animate__fadeOut');

    this.activePlayer.classList.add('animate__animated', 'animate__fadeIn');
    
    // this.activePlayer.classList.remove("hidden");
    // this.activePlayer.classList.add("active");
    // this.idlePlayer.classList.add("selphio__fade-out")
  };

  fadeToIdle = () => {
    console.log("fadeToIdle")

    this.activePlayer.classList.remove("active"); 
    this.activePlayer.style.display = "None";
    this.activePlayer.classList.add("hidden") ;
    // this.idlePlayer.style.display = "";
    this.activePlayer.classList.remove('animate__animated', 'animate__fadeIn');
    
    this.activePlayer.classList.add('animate__animated', 'animate__fadeOut');
    this.idlePlayer.style.display = "";
    
    this.idlePlayer.classList.remove('animate__animated', 'animate__fadeOut');
    this.idlePlayer.classList.add('animate__animated', 'animate__fadeIn');

  };

  addMessage = (message, self) => {
    var messageContainer = document.createElement("li");
    var messageBubble = document.createElement("div");
    messageContainer.classList.add("chat-message");
    messageBubble.classList.add("chat-message-bubble");
    if (self) {
      messageContainer.classList.add("chat-message-self")
      var thumbUp = document.createElement("i");
      var thumbDown = document.createElement("i");
    
      console.log("adding thumbs.................");
      thumbUp.classList.add("fa","fa-thumbs-up");
      thumbDown.classList.add("fa","fa-thumbs-down");
      messageBubble.appendChild(thumbUp)
      messageBubble.appendChild(thumbDown)



    }
    else {
      messageContainer.classList.add("chat-message-friend");
  }
    this.messagesList.appendChild(messageContainer);


    // messageBubble.innerText = 'afdsafs'
    messageBubble.innerHTML = message;


    messageContainer.appendChild(messageBubble);
    messageContainer.classList.add('animate__animated', 'animate__fadeIn');


    var oldScroll = this.messageDialog.scrollTop;
    this.messageDialog.scrollTop = 9999999;
    var newScroll = this.messageDialog.scrollTop;
    var scrollDiff = newScroll - oldScroll;
    TweenMax.fromTo(
      this.messageDialog,
      0.4,
      {
        y: scrollDiff,
      },
      {
        y: 0,
        ease: Quint.easeOut,
      }
    );

    return {
      container: messageContainer,
      bubble: messageBubble,
    };
  };

  selphIsThinking = () => {
    if (this.isSelphThinking) return;
    this.isSelphThinking = true;

    var dots = document.createElement("div");
    dots.classList.add("chat-effect-dots");
    dots.style.top = -130;
    dots.style.left = 10;
    this.chatLoaderContainer.appendChild(dots);

    for (var i = 0; i < 3; i++) {
      var dot = document.createElement("div");
      dot.classList.add("chat-effect-dot");
      dot.style.left = i * 20;
      dots.appendChild(dot);

      TweenMax.to(dot, 0.3, {
        delay: -i * 0.1,
        x: 30,
        yoyo: true,
        repeat: -1,
        ease: Quad.easeInOut,
      });
    }

    var info = document.createElement("div");
    info.classList.add("chat-info-typing");
    info.innerHTML = "replying...";
    info.style.transform = "translate3d(0,30px,0)";
    this.chatInfoContainer.appendChild(info);

    TweenMax.to(info, 0.3, {
      x: 0,
      force3D: true,
    });
  };

  selphStoppedThinking = () => {
    if (!this.isSelphThinking) return;

    this.isSelphThinking = false;

    var dots = document.querySelector(".chat-effect-dots");
    TweenMax.to(dots, 0.3, {
      x: 40,
      force3D: true,
      ease: Quad.easeIn,
    });

    var info = document.querySelector(".chat-info-typing");
    TweenMax.to(info, 0.3, {
      x: 30,
      force3D: true,
      ease: Quad.easeIn,
      onComplete: function () {
        dots.remove();
        info.remove();
      },
    });
  };

  stopActiveSequence = () => {
    if (this.activePlayer.classList.contains("active")) {
      this.fadeToIdle();
      //setTimeout(function () {
      this.activePlayer.pause();
      this.activePlayer.style.display = "None";

      //}, 250);
    }
  };

  // toggleMenu = () => {
  //   if (this.menu.classList.contains("collapsed")) {
  //     this.menu.classList.remove("collapsed");
  //     this.menu.classList.add("expanded");
  //     this.menu.style.display='';

  //   } else {
  //     this.menu.classList.remove("expanded");
  //     this.menu.classList.add("collapsed");
  //     this.menu.style.display='None';

  //   }
  // };
}

(function (window, document) {
  window.slphmsn = new SelphMessengerAPI();
  var selphid = document
    .querySelector('script[data-id="tslphmsn"][data-selphid]')
    .getAttribute("data-selphid");
  var server = document
    .querySelector('script[data-id="tslphmsn"][data-selphid]')
    .getAttribute("data-server");

  window.slphmsn.init(selphid, server);

  window.addEventListener(
    "message",
    (event) => {
      if (event.data === "stopActiveSequence") {
        window.slphmsn.stopActiveSequence();
      }

      if (event.data === "getServer") {
        return server;
      }
    },
    false
  );
})(window, document);
