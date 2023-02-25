/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	let target = ns.args[0]
	let moneyStolen = await ns.hack(target, { stock: false })
	let hostname = ns.getHostname()
	ns.writePort(1, JSON.stringify({ hostname, moneyStolen, target }))
}
