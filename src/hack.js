// import { colors } from 'utils.js'

/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	let target = ns.args[0]
	// let hostname = ns.getHostname()
	// let padding = 20
	// let moneyAvailable = ns.getServerMoneyAvailable(target)
	// let fhostname = hostname.padStart(padding / 2)
	// let ftarget = target.padStart(padding)
	// let fremainingCash = `${colors.y}${ns.nFormat(moneyAvailable, '$0,0').padStart(padding)}${colors.d}`.padStart(padding)
	// let fpercentMaxCash = ns.nFormat(moneyAvailable / ns.getServerMaxMoney(target), '0.0%').padStart(padding / 2)
	let moneyStolen = await ns.hack(target, { stock: false })
	// let fmoneyStolen = `${colors.g}${ns.nFormat(moneyStolen, '$0,0').padStart(padding)}${colors.d}`
	// let securityLevel = ns.getServerSecurityLevel(target)
	// // ns.writePort(1, JSON.stringify({ hostname, moneyStolen, target }))
	// ns.tprint(`│${fhostname}  │${fmoneyStolen}  │${ftarget}  │${fremainingCash}  │${fpercentMaxCash}  │ ${securityLevel}`)
}
