/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	ns.kill('share.js')
	let serv = ns.getServer()
	let scriptRam = ns.getScriptRam('share.js')
	let threads = ~~((serv.maxRam - serv.ramUsed) / scriptRam)
	if (threads > 0) {
		ns.exec('share.js', serv.hostname, threads)
	}
}
