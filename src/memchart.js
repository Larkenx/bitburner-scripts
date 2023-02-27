import * as asciichart from 'asciichart.js'
import * as utils from 'utils.js'
/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	ns.disableLog('ALL')
	let tickRate = ns.args[0] || 1000
	let history = {
		ram: [],
	}
	let width = 80
	const maxRam = await utils.getMaxGlobalRam(ns)
	while (true) {
		let ramUsage = await utils.getUsedGlobalRam(ns)
		ns.print('─'.repeat(width + 20))
		history.ram.push(ramUsage)
		if (history.ram.length > width) history.ram.shift()
		ns.print(
			asciichart.plot(history.ram, {
				height: 10,
				format: function (x) {
					return ` ${ns.nFormat(x, '00,00')}gb`.padEnd(15)
				},
			})
		)
		ns.print('─'.repeat(width + 20))
		ns.print(' ')
		ns.print(
			`Memory Utilization: ${ns.nFormat(ramUsage / maxRam, '0.00%')} | ${ns.nFormat(ramUsage, '00,00')}gb used of ${ns.nFormat(
				maxRam,
				'00,00'
			)}gb`
		)
		await ns.sleep(tickRate)
	}
}
