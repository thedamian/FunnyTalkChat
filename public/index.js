const socket = io();

let talkingAudio = document.getElementById("Talking");
let talkBtn = document.getElementById("talkBtn");
let yourChatInput = document.getElementById("yourChat");
let voiceSelect = document.getElementById("voice");
let MessageDiv = document.getElementById("message");

//console.log("hello")
var voices = [];
 // Fetch the list of voices and populate the voice options.
function populateVoiceList() {
 voices = speechSynthesis.getVoices();
 for (i = 0; i < voices.length; i++) {
     var option = document.createElement('option');
     option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    if (voices[i].default) {   
    option.value=i;
    option.textContent += ' -- DEFAULT'; } 
    option.setAttribute('data-lang', voices[i].lang); 
    option.setAttribute('data-name', voices[i].name); 
    voiceSelect.appendChild(option);
}
}
setTimeout(populateVoiceList,1000);
window.speechSynthesis.onvoiceschanged = function(e) {
    populateVoiceList();
};



talkBtn.addEventListener("click",ISay());

yourChatInput.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      ISay();        
    }
  });

function ISay()  {
    if (yourChatInput.value) {
    socket.emit("newchat",{message:yourChatInput.value,voice:voiceSelect.selectedIndex});
    yourChatInput.value = '';
    }
}


socket.on("newchat", (chatInfo) => {
    var msg = new SpeechSynthesisUtterance();
    msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.rate = 1; // 0.1 to 10
    msg.pitch = 2; //0 to 2
    msg.text = 'Hello World';
    msg.lang = 'en-US';
    msg.onend = function(e) {
      console.log('Finished in ' + event.elapsedTime + ' seconds.');
    };
   // console.log(chatInfo.voice);
    //console.log(voices[chatInfo.voice])
    msg.voice = voices[chatInfo.voice] 
    msg.text = chatInfo.message
    //console.log(msg);
    speechSynthesis.speak(msg);
});