# A human-readable timer

```js
var clock = new Clock();

clock.setInterval('1h 10m 15s 300ms');
clock.setTicker(function() {
	// ...
});

clock.start();

// stops the ticker
clock.stop();
```