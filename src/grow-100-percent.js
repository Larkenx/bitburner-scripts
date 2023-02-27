/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	let growScriptArgs = ns.args[0]
	let { target } = JSON.parse(growScriptArgs)
	let money = ns.getServerMoneyAvailable(target)
	let maxMoney = ns.getServerMaxMoney(target)
	let growThreads = Math.ceil(ns.growthAnalyze(target, maxMoney / money))
	if (growThreads > 0) {
		ns.spawn('grow.js', growThreads, growScriptArgs)
	}
}
