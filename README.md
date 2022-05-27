![babbler_logo](public/logo.png)

Simple programmable Web Speech API implementation.

### Usage

This is a really simple implementation of the Web Speech API.

```js

const babbler = new Babbler({
  lang: 'en', // language
  voice: 'Microsoft George - English (United Kingdom)' // voice name
});

```

To say something, use:

```js

babbler.Speak("Hello World!");

babbler.Speak("Hello!").then(()=>{
  // do something
  babbler.Speak("How are you today?");
});

```

To listen, use:

```js
const callbacks = {
  start: () => console.log("Babbler listener has started"),
  end: () => console.log("Babbler listener has started"),
  error: (e) => console.error("Babbler error", e),
  result: (r) => console.log("Babbler result", r),
};

babbler.Listen(callbacks);

const doSomethingWithResult = (r) => {
  const result = event.results[0][0].transcript;
  // do something with your result here
}

babbler.Listen({
  result: doSomethingWithResult
});

```

You can easily extend Babbler with your own functionalities.

```js

Babbler.prototype.customBabblerFunction = () => {
  console.log("This is my custom functionality!");
}

const babbler = new Babbler(/* config */);

babbler.customBabblerFunction();

```

You can also read more about Web Speech API in the [docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API).

## License

This project is licensed under the MIT License.
