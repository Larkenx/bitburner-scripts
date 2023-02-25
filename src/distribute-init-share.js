/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	let purchasedServs = await ns.getPurchasedServers()
	for (let serv of purchasedServs) {
		ns.scp(['init-share.js', 'share.js', 'utils.js'], serv)
		ns.exec('init-share.js', serv, 1)
	}
}
