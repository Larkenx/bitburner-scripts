/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	let sym = ns.args[0]
	let sharePrice = ns.stock.getPrice(sym)
	let maxAffordableShares = Math.floor(ns.getServerMoneyAvailable('player') / sharePrice, ns.stock.getMaxShares(sym))
	while (true) {
		await ns.sleep(2000)
	}
	if (true) {
		ns.stock.buyStock(sym, maxAffordableShares)
	}
}
