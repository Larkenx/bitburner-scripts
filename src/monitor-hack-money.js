import * as utils from 'utils.js'
/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	ns.disableLog('ALL')
	let portNumber = 1
	while (true) {
		while (ns.peek(1) !== 'NULL PORT DATA') {
			let { hostname, target, moneyStolen } = JSON.parse(ns.readPort(portNumber))
			let padding = 20
			let moneyAvailable = ns.getServerMoneyAvailable(target)
			let fhostname = hostname.padStart(padding / 2)
			let fmoneyStolen = `${utils.colors.g}${ns.nFormat(moneyStolen, '$0,0').padStart(padding)}${utils.colors.d}`
			let ftarget = target.padStart(padding)
			let fremainingCash = `${utils.colors.y}${ns.nFormat(moneyAvailable, '$0,0').padStart(padding)}${utils.colors.d}`.padStart(
				padding
			)
			let fpercentMaxCash = ns.nFormat(moneyAvailable / ns.getServerMaxMoney(target), '0.0%').padStart(padding / 2)
			let fsecurityLevel = `${ns.getServerSecurityLevel(target).toFixed(2)} / ${ns.getServerMinSecurityLevel(target)}`.padStart(
				padding
			)
			ns.print(`│${fhostname}  │${fmoneyStolen}  │${ftarget}  │${fremainingCash}  │${fpercentMaxCash}  │ ${fsecurityLevel}|`)
			ns.print(
				'─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────'
			)
		}
		await ns.sleep(5000)
	}
}
