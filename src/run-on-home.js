/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	let scriptToInject = ns.args[0]
	let target = ns.args[1]
	let maxRam = ns.getServerMaxRam('home') - 20 // reserve an amount of ram for home scripts
	let scriptRam = ns.getScriptRam(scriptToInject)
	let concurrency = Math.floor(maxRam / scriptRam)
	if (concurrency > 0) {
		ns.run(scriptToInject, concurrency, target)
	}
}
