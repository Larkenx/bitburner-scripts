import * as utils from 'utils.js'
/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	ns.disableLog('ALL')
	while (true) {
		let hackableServs = await utils.filterHackableServers(ns, await utils.fetchAllServers(ns))
		let growFns = hackableServs.map(async (serv) => {
			const growTime = ns.getGrowTime(serv.hostname)
			let money = ns.getServerMoneyAvailable(serv.hostname)
			let maxMoney = ns.getServerMaxMoney(serv.hostname)
			let growthRatio = Math.ceil(maxMoney / money)
			let growThreads = Math.ceil(ns.growthAnalyze(serv.hostname, growthRatio))
			if (growThreads > 0) {
				await utils.runScript(ns, 'grow.js', growThreads, { target: serv.hostname })
				await ns.asleep(growTime)
			}
		})
		await Promise.all(growFns)
	}
}
