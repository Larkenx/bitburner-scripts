import * as asciichart from 'asciichart.js'
/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	ns.disableLog('ALL')
	let units = 1000000 // millions
	let startTime = Date.now()
	let startingMoney = ~~(ns.getServerMoneyAvailable('home') / units)
	let history = {
		money: [],
	}
	let width = 80
	while (true) {
		let currentMoney = ~~(ns.getServerMoneyAvailable('home') / units)
		let secondsSinceStart = (Date.now() - startTime) / 1000
		if (secondsSinceStart <= 0) secondsSinceStart = 1
		let moneyEarnedSinceStartPerSecond = ((currentMoney - startingMoney) * units) / secondsSinceStart
		ns.print('─'.repeat(width + 20))
		history.money.push(currentMoney)
		if (history.money.length > width) history.money.shift()
		ns.print(
			asciichart.plot(history.money, {
				height: 10,
				format: function (x) {
					return ` ${ns.nFormat(x * units, '$00,00')}`.padEnd(19)
				},
			})
		)
		ns.print('─'.repeat(width + 20))
		ns.print(` ${ns.nFormat(moneyEarnedSinceStartPerSecond, '$00,00')}/sec`)
		ns.print(' ')
		await ns.sleep(1000)
	}
}
