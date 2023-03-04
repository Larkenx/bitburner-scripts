/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	let { target, delay = 0 } = JSON.parse(ns.args[0])
	let moneyStolen = await ns.hack(target, { stock: true, additionalMsec: delay })
	ns.writePort(1, JSON.stringify({ moneyStolen, hostname: ns.getHostname(), target }))
	ns.writePort(2, JSON.stringify({ script: 'hack.js', hostname: ns.getHostname(), target, args: ns.args, scriptOutput: moneyStolen }))
}
