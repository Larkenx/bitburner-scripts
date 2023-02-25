/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	while (true) {
		ns.tprint(ns.getSharePower())
		await ns.sleep(1000)
	}
}
