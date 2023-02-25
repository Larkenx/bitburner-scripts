import * as utils from 'utils.js'
/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	ns.disableLog('ALL')
	while (true) {
		let hackableServs = await utils.filterHackableServers(ns, await utils.fetchAllServers(ns))
		let weakenExecs = hackableServs.map(async (serv) => {
			const weakenTime = ns.getWeakenTime(serv.hostname)
			const minSec = ns.getServerMinSecurityLevel(serv.hostname)
			const sec = ns.getServerSecurityLevel(serv.hostname)
			let weakenThreads = Math.ceil((sec - minSec) / ns.weakenAnalyze(1))
			if (weakenThreads > 0) {
				await utils.runScript(ns, 'weaken.js', weakenThreads, serv.hostname, ...ns.args)
				await ns.asleep(weakenTime)
			}
		})
		await Promise.all(weakenExecs)
	}
}
