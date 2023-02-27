/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	let weakenScriptArgs = ns.args[0]
	let { target } = JSON.parse(weakenScriptArgs)
	const minSec = ns.getServerMinSecurityLevel(target)
	const sec = ns.getServerSecurityLevel(target)
	let weakenThreads = Math.ceil((sec - minSec) / ns.weakenAnalyze(1))
	if (weakenThreads > 0) {
		ns.spawn('weaken.js', weakenThreads, weakenScriptArgs)
	}
}
