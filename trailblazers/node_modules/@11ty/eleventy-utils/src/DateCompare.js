class DateCompare {
	static isTimestampWithinDuration(timestamp, duration, compareDate = Date.now()) {
		// the default duration is Infinity (also "*")
		if (!duration || duration === "*" || duration === Infinity) {
			return true;
		}

		let expiration = timestamp + this.getDurationMs(duration);

		// still valid
		if (expiration > compareDate) {
			return true;
		}

		// expired
		return false;
	}

	static getDurationMs(duration = "0s") {
		let durationUnits = duration.slice(-1);
		let durationMultiplier;
		if (durationUnits === "s") {
			durationMultiplier = 1;
		} else if (durationUnits === "m") {
			durationMultiplier = 60;
		} else if (durationUnits === "h") {
			durationMultiplier = 60 * 60;
		} else if (durationUnits === "d") {
			durationMultiplier = 60 * 60 * 24;
		} else if (durationUnits === "w") {
			durationMultiplier = 60 * 60 * 24 * 7;
		} else if (durationUnits === "y") {
			durationMultiplier = 60 * 60 * 24 * 365;
		}

		let durationValue = parseInt(duration.slice(0, duration.length - 1), 10);
		return durationValue * durationMultiplier * 1000;
	}
}

module.exports = DateCompare;