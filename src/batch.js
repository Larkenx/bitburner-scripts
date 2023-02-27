import * as utils from './utils.js'

// -Find all servers (+ filter out the ones without ram)
// -Make a server purchasing script
// -Pick a good target
// -Pick a good percentage of moneys to steal
// -Prep the target to 100% money, min security
// -Calculate running times for HWGW
// -Calculate ending times for HWGW
// -Calculate needed threads for HWGW
// -Find server(s) that can fit a whole batch of H and G
// -Calculate free ram of server(s)
// -Same for W, but you can also split it into many scripts that have total of desired threads
// -Make HWGW worker scripts
// -Handle the executing and delaying of those HWGW worker scripts. With ns.sleep or some other way?
// -Check if shit hits the fan, halt the main script and start prepping again
// -Make a nice log that shows what's going on
// -What else?
// -In the end you'll have this:
// return "Great Success"

/** @param {import("../NetscriptDefinitions").NS} ns */
async function prepareForBatching(ns, serv) {
	await utils.weaken(ns, serv)
	await utils.grow(ns, serv)
	await utils.weaken(ns, serv)
}

/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	ns.disableLog('ALL')
	let target = ns.args[0]
	if (!target) {
		throw new Error('Must specify a target in script params')
	}
	await prepareForBatching(ns, target)
	ns.tprint(`${target} prepared for batching; at max money & min sec.`)

	let batchCount = 10
	for (let batchId = 0; batchId < batchCount; batchId++) {
		ns.exec('execute-batch.js', 'home', 1, target, batchId)
	}
}
