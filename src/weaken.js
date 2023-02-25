/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	return ns.weaken(ns.args[0], { stock: true })
}
