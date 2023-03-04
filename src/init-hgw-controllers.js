import { runScript, fetchAllServers, filterHackableServers } from './utils'
/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	while (true) {
		ns.tprint('Spinning up hgw controllers for any newly hackable servers')
		let allServs = await fetchAllServers(ns)
		let hackable = (await filterHackableServers(ns, allServs, 2)).map((s) => s.hostname)
		for (let s of hackable.reverse()) {
			await runScript(ns, 'hgw-controller.js', 1, { target: s })
		}
		await ns.sleep(1000 * 60 * 2) // every 2 minutes, check for more hackable ones because of hack lvl
	}
}
