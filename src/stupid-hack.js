import * as utils from 'utils.js'
/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	ns.tprint('Spinning up hgw controllers for any newly hackable servers')
	let allServs = await utils.fetchAllServers(ns)
	let hackable = (await utils.filterHackableServers(ns, allServs, 1)).map((s) => s.hostname)
	for (let s of hackable) {
		let money = ns.getServerMoneyAvailable(s) * 0.95
		let hackThreads = Math.ceil(ns.hackAnalyzeThreads(s, money))
		if (hackThreads > 0) {
			await utils.runScript(ns, 'hack.js', hackThreads, { target: s })
		}
	}
}
