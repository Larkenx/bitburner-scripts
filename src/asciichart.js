// control sequences for coloring

const black = "\x1b[30m"
const red = "\x1b[31m"
const green = "\x1b[32m"
const yellow = "\x1b[33m"
const blue = "\x1b[34m"
const magenta = "\x1b[35m"
const cyan = "\x1b[36m"
const lightgray = "\x1b[37m"
const darkgray = "\x1b[90m"
const lightred = "\x1b[91m"
const lightgreen = "\x1b[92m"
const lightyellow = "\x1b[93m"
const lightblue = "\x1b[94m"
const lightmagenta = "\x1b[95m"
const lightcyan = "\x1b[96m"
const white = "\x1b[97m"
const reset = "\x1b[0m"

export function colored(char, color) {
	// do not color it if color is not specified
	return (color === undefined) ? char : (color + char + reset)
}

export function plot(series, cfg = undefined) {
	// this function takes both one array and array of arrays
	// if an array of numbers is passed it is transformed to
	// an array of exactly one array with numbers
	if (typeof (series[0]) == "number") {
		series = [series]
	}

	cfg = (typeof cfg !== 'undefined') ? cfg : {}

	let min = (typeof cfg.min !== 'undefined') ? cfg.min : series[0][0]
	let max = (typeof cfg.max !== 'undefined') ? cfg.max : series[0][0]

	for (let j = 0; j < series.length; j++) {
		for (let i = 0; i < series[j].length; i++) {
			min = Math.min(min, series[j][i])
			max = Math.max(max, series[j][i])
		}
	}

	let defaultSymbols = ['┼', '┤', '╶', '╴', '─', '╰', '╭', '╮', '╯', '│']
	let range = Math.abs(max - min)
	let offset = (typeof cfg.offset !== 'undefined') ? cfg.offset : 4
	let padding = (typeof cfg.padding !== 'undefined') ? cfg.padding : '              $'
	let height = (typeof cfg.height !== 'undefined') ? cfg.height : range
	let colors = (typeof cfg.colors !== 'undefined') ? cfg.colors : []
	let ratio = range !== 0 ? height / range : 1;
	let min2 = Math.round(min * ratio)
	let max2 = Math.round(max * ratio)
	let rows = Math.abs(max2 - min2)
	let width = 0
	for (let i = 0; i < series.length; i++) {
		width = Math.max(width, series[i].length)
	}
	width = width + offset
	let symbols = (typeof cfg.symbols !== 'undefined') ? cfg.symbols : defaultSymbols
	let format = (typeof cfg.format !== 'undefined') ? cfg.format : function (x) {
		return ('  $' + x.toFixed(0) + 'm')
	}

	let result = new Array(rows + 1) // empty space
	for (let i = 0; i <= rows; i++) {
		result[i] = new Array(width)
		for (let j = 0; j < width; j++) {
			result[i][j] = ' '
		}
	}
	for (let y = min2; y <= max2; ++y) { // axis + labels
		let label = format(rows > 0 ? max - (y - min2) * range / rows : y, y - min2)
		result[y - min2][Math.max(offset - label.length, 0)] = label
		result[y - min2][offset - 1] = (y == 0) ? symbols[0] : symbols[1]
	}

	for (let j = 0; j < series.length; j++) {
		let currentColor = colors[j % colors.length]
		let y0 = Math.round(series[j][0] * ratio) - min2
		result[rows - y0][offset - 1] = colored(symbols[0], currentColor) // first value

		for (let x = 0; x < series[j].length - 1; x++) { // plot the line
			let y0 = Math.round(series[j][x + 0] * ratio) - min2
			let y1 = Math.round(series[j][x + 1] * ratio) - min2
			if (y0 == y1) {
				result[rows - y0][x + offset] = colored(symbols[4], currentColor)
			} else {
				result[rows - y1][x + offset] = colored((y0 > y1) ? symbols[5] : symbols[6], currentColor)
				result[rows - y0][x + offset] = colored((y0 > y1) ? symbols[7] : symbols[8], currentColor)
				let from = Math.min(y0, y1)
				let to = Math.max(y0, y1)
				for (let y = from + 1; y < to; y++) {
					result[rows - y][x + offset] = colored(symbols[9], currentColor)
				}
			}
		}
	}
	return result.map(function (x) { return x.join('') }).join('\n')
}