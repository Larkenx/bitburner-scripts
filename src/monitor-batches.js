import * as utils from 'utils.js'
/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	ns.disableLog('ALL')
	let portNumber = 2
	while (true) {
		while (ns.peek(portNumber) !== 'NULL PORT DATA') {
			let { script, scriptOutput, hostname, target, args } = JSON.parse(ns.readPort(portNumber))
			let parsedArgs = JSON.parse(args)
			let padding = 20
			let moneyAvailable = ns.getServerMoneyAvailable(target)
			let fscriptType = `${script} ${parsedArgs.id}`.padStart(padding)
			let fhostname = hostname.padStart(padding / 2)
			let ftarget = target.padStart(padding)
			let fremainingCash = `${utils.colors.y}${ns.nFormat(moneyAvailable, '$0,0').padStart(padding)}${utils.colors.d}`.padStart(
				padding
			)
			let fpercentMaxCash = ns.nFormat(moneyAvailable / ns.getServerMaxMoney(target), '0.0%').padStart(padding / 2)
			let fsecurityLevel = `${ns.getServerSecurityLevel(target).toFixed(2)} / ${ns.getServerMinSecurityLevel(target)}`.padStart(
				padding
			)
			ns.print(`| ${fscriptType} │ ${fhostname} │ ${ftarget}  │ ${fremainingCash} │ ${fpercentMaxCash} │ ${fsecurityLevel} | ${args}`)
		}
		await ns.sleep(1000)
	}
}
