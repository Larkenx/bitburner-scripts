/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	let { target, delay = 0 } = JSON.parse(ns.args[0])
	if (delay > 0) await ns.asleep(delay)
	let moneyStolen = await ns.hack(target, { stock: true })
	ns.writePort(1, JSON.stringify({ moneyStolen, hostname: ns.getHostname(), target }))
}
