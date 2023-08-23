
const symbols: Record<string, Record<string, string>> = {
	check: {
		small: 		'\u2714',	// ✔	(heavy)
		bkgGreen: 	'\u2705',	// ✅	(whiteHeavy)
		squareRoot: '\u221A'	// √
	},
	cross: {
		small: 		'\u2718',	// ✘	(heavyBallot)
		red: 		'\u274C'	// ❌	(crossMark)
	},
	clock: {
		stopwatch: 	'\u23F1'	// ⏱
	},
	arrow: {
		down: 		'\u2193'	// ↓	(downArrow)
	},
	selection: {
		fisheye: 	'\u25C9'	// ◉	(fishEye)
	}
}

// ALIASES
symbols.check.heavy = symbols.check.small
symbols.check.whiteHeavy =  symbols.check.bkgGreen

symbols.cross.heavyBallot = symbols.cross.small


export { symbols }
