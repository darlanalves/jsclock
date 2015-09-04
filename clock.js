(function(global) {
	'use strict';

	function factory($interval) {
		function Clock() {
			this.interval = 1;
			this.clock = null;
			this.ticker = null;
		}

		Clock.prototype = {
			constructor: Clock,
			setInterval: _setInterval,
			setTicker: setTicker,
			start: start,
			stop: stop
		};

		function _setInterval(interval) {
			if (typeof interval === 'string') {
				this.interval = parseInterval(interval);
			} else {
				this.interval = interval;
			}

		}

		function setTicker(fn) {
			this.ticker = fn;
		}

		function tick() {
			this.ticker();
		}

		function start() {
			this.clock = $interval(tick.bind(this), this.interval);
		}

		function stop() {
			if (this.clock) {
				$interval.cancel(this.clock);
				this.clock = null;
			}
		}

		var multipliers = {
			'h': 36e5,
			'm': 6e5,
			's': 1e3,
			'ms': 1
		};

		function parseInterval(string) {
			var interval = 0;
			var valueRe = /\D+/;
			var suffixRe = /\d+/;

			string.replace(/([0-9]+[hms]{1,2}\s*)/g, function(exp) {
				var value = Number(exp.replace(valueRe, '')),
					suffix = exp.replace(suffixRe, '');

				if (!isNaN(value) && suffix in multipliers) {
					interval += value * multipliers[suffix];
				}
			});

			return interval;
		}

		return Clock;
	}

	if (typeof global.angular !== 'undefined' && global.angular.module) {
		global.angular.module('jsclock', []).factory('Clock', ['$interval', factory]);
	} else {
		var $interval = function(fn, interval) {
			return setInterval(fn, interval);
		};
		$interval.cancel = clearInterval;

		var Clock = factory($interval);

		if (typeof define === 'function' && define.amd) {
			define(function() {
				return Clock;
			});
		} else if (typeof module !== 'undefined' && module.exports) {
			module.exports = Clock;
		} else {
			global.Clock = Clock;
		}
	}
})(this);
