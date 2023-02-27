import * as utils from 'utils.js'
/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	while (true) {
		ns.tprint('Spinning up hgw controllers for any newly hackable servers')
		let allServs = await utils.fetchAllServers(ns)
		let hackable = (await utils.filterHackableServers(ns, allServs, 1)).map((s) => s.hostname)
		for (let s of hackable) {
			ns.exec('hgw-controller.js', 'home', 1, s, 0)
		}
		await ns.sleep(100)
		await ns.sleep(1000 * 60 * 2) // every 2 minutes, check for more hackable ones because of hack lvl
	}
}
