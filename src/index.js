'use strict';

function Babbler(config) {
    if (!window.hasOwnProperty("speechSynthesis")) {
        throw Error("Babbler can't chat without the Speech Synthesis API.");
    }

    if (!window.hasOwnProperty("SpeechRecognition") && !window.hasOwnProperty("webkitSpeechRecognition")) {
        throw Error("Babbler can't eavesdrop you without the Speech Recognition API.");
    }

    this.Commands = [];

    const recognizer = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.SpeechRecognition = new recognizer()
    this.SpeechRecognition.lang = config.lang;
    this.SpeechRecognition.continuous = true;
    this.SpeechRecognition.interimResults = false;
    this.SpeechRecognition.maxAlternatives = 1;

    this.SpeechSynthesis = new SpeechSynthesisUtterance()
    this.SpeechSynthesis.lang = config.lang;

    getVoices().then(voices => {
        this.SpeechSynthesis.voice = voices.find(v => v.name === config.voice) ?? voices[0];
    }).catch(() => {
        throw Error("Babbler couldn't find the right words... (Voice setting error)");
    })
}

function getVoices() {
    return new Promise(
        function (resolve) {
            const Synth = window.speechSynthesis,
                id = setInterval(() => {
                    if (Synth.getVoices().length !== 0) {
                        resolve(Synth.getVoices());
                        clearInterval(id);
                    }
                }, 10);
        }
    )
}

function Speak(text) {
    const Synth = window.speechSynthesis;
    this.SpeechSynthesis.text = text;
    Synth.speak(this.SpeechSynthesis);

    return new Promise(
        function (resolve) {
            const id = setInterval(() => {
                if (!Synth.speaking) {
                    resolve({ speaking: false, text });
                    clearInterval(id);
                }
            }, 10);
        }
    )
}

function Listen(c) {
    const defaultCallbacks = {
        start: () => console.log("Babbler listener has started"),
        end: () => console.log("Babbler listener has started"),
        error: (e) => console.error("Babbler error", e),
        result: (r) => console.log("Babbler result", r),
    }

    const callbacks = { ...defaultCallbacks, ...c };

    this.SpeechRecognition.start();

    this.SpeechRecognition.onstart = function () {
        callbacks.start();
    }

    this.SpeechRecognition.onspeechend = function () {
        callbacks.end();
    }

    this.SpeechRecognition.onerror = function (event) {
        callbacks.error(event);
    }

    this.SpeechRecognition.onresult = function (event) {
        callbacks.result(event);
    }
}

Babbler.prototype = {
    Speak,
    Listen
}