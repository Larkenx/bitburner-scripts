/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	let { target, delay = 0 } = JSON.parse(ns.args[0])
	if (delay > 0) await ns.asleep(delay)
	await ns.weaken(target, { stock: true })
}
