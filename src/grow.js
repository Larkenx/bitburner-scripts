/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	let { target, delay = 0 } = JSON.parse(ns.args[0])
	let scriptOutput = await ns.grow(target, { stock: true, additionalMsec: delay })
	ns.writePort(2, JSON.stringify({ script: 'grow.js', hostname: ns.getHostname(), target, args: ns.args, scriptOutput }))
}
