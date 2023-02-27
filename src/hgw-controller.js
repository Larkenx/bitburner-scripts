import { runScript } from './utils.js'
/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	const pid = ns.args[1]
	ns.disableLog('ALL')
	const target = ns.args[0]
	const moneyThresh = ns.getServerMaxMoney(target) * 0.9
	const securityThresh = ns.getServerMinSecurityLevel(target) + 5

	// Infinite loop that continuously hacks/grows/weakens the target server
	while (true) {
		// We recalculate times each loop, because the security will go up and down as we go, affecting those times
		const hackTime = ns.getHackTime(target)
		const growTime = ns.getGrowTime(target)
		const weakenTime = ns.getWeakenTime(target)

		// Weaken thread calculation:
		const minSec = ns.getServerMinSecurityLevel(target)
		const sec = ns.getServerSecurityLevel(target)
		let weakenThreads = Math.ceil((sec - minSec) / ns.weakenAnalyze(1))

		// Hack thread calculation:
		let money = ns.getServerMoneyAvailable(target)
		let hackPercentage = 0.8
		if (money <= 0) money = 1 // division by zero safety
		let hackThreads = Math.ceil(ns.hackAnalyzeThreads(target, money * hackPercentage))

		// Grow thread calculation:
		let maxMoney = ns.getServerMaxMoney(target)
		let growThreads = Math.ceil(ns.growthAnalyze(target, maxMoney / money))

		if (ns.getServerSecurityLevel(target) > securityThresh) {
			// If the server's security level is above our threshold, weaken it
			await runScript(ns, 'weaken.js', weakenThreads, { target, pid })
			await ns.sleep(weakenTime)
		} else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
			// If the server's money is less than our threshold, grow it
			await runScript(ns, 'grow.js', growThreads, { target, pid })
			await ns.sleep(growTime)
		} else {
			// Otherwise, hack it
			await runScript(ns, 'hack.js', hackThreads, { target, pid })
			await ns.sleep(hackTime)
		}
	}
}
