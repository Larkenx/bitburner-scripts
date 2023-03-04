// https://github.com/xxxsinx/bitburner/blob/76531688be9580aac6dc9bdf63d4f1a55fa86ffd/metrics.js#L650-L690
/** @param {import("../NetscriptDefinitions").NS} ns */

export function calculateGrowThreads(ns, serverObject, playerObject, cores) {
	if (serverObject.moneyAvailable >= serverObject.moneyMax) return 0
	let min = 1

	// Use the flawed API to find a maximum value
	const growFactor = 1 / (1 - (serverObject.moneyMax - 1) / serverObject.moneyMax)
	let max = Math.ceil(Math.log(growFactor) / Math.log(ns.formulas.hacking.growPercent(serverObject, 1, playerObject, cores)))

	let threads = binarySearchGrow(ns, min, max, serverObject, playerObject, cores)

	let newMoney = calcGrowth(ns, serverObject, playerObject, threads, cores)
	let diff = newMoney - serverObject.moneyMax
	if (diff < 0) ns.tprint('FAIL: undershot by ' + diff)

	return threads
}
/** @param {import("../NetscriptDefinitions").NS} ns */

function binarySearchGrow(ns, min, max, so, po, cores) {
	//ns.tprint('min: ' + min + ' max: ' + max);
	if (min == max) return max
	let threads = Math.ceil(min + (max - min) / 2)

	let newMoney = calcGrowth(ns, so, po, threads, cores)
	if (newMoney > so.moneyMax) {
		if (calcGrowth(ns, so, po, threads - 1, cores) < so.moneyMax) return threads
		return binarySearchGrow(ns, min, threads - 1, so, po, cores)
	} else if (newMoney < so.moneyMax) {
		return binarySearchGrow(ns, threads + 1, max, so, po, cores)
	} else {
		//(newMoney == so.moneyMax)
		return threads
	}
}
/** @param {import("../NetscriptDefinitions").NS} ns */

function calcGrowth(ns, so, po, threads, cores) {
	let serverGrowth = ns.formulas.hacking.growPercent(so, threads, po, cores)
	return (so.moneyAvailable + threads) * serverGrowth
}
