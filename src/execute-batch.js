import * as growUtils from './utils-grow.js'

let SCRIPT_DELAY_MS = 20

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

// Easy mode delay calculations for batching
// let hackDelay= weakenTime - spacer - hackTime;
// let weaken1delay= 0;
// let growDelay= weakenTime + spacer - growTime;
// let weaken2delay= spacer * 2;

/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	let [target, batchId] = ns.args
	let weakenTime = ns.getWeakenTime(target)
	let hackTime = ns.getHackTime(target)
	let growTime = ns.getGrowTime(target)

	let hackPercent = 0.05

	while (true) {
		let hackThreads = Math.ceil(hackPercent / ns.hackAnalyze(target))
		let weakenThreadsForHack = Math.ceil(ns.hackAnalyzeSecurity(hackThreads) / ns.weakenAnalyze(1))

		let serverObject = ns.getServer(target)
		serverObject.moneyAvailable = serverObject.moneyMax * (1 - hackPercent * 2)
		let growThreads = growUtils.calculateGrowThreads(ns, serverObject, ns.getPlayer(), 1)
		let weakenThreadsForGrow = Math.ceil(ns.growthAnalyzeSecurity(growThreads) / ns.weakenAnalyze(1))

		// hack a % of the money
		let hackDelay = weakenTime - hackTime - SCRIPT_DELAY_MS
		ns.exec('hack.js', 'home', hackThreads, JSON.stringify({ target, delay: hackDelay, id: batchId }))

		// weaken to counter a hack
		ns.exec('weaken.js', 'home', weakenThreadsForHack, JSON.stringify({ target, id: batchId }))

		// grow to recover hack
		let growthDelay = weakenTime - growTime + SCRIPT_DELAY_MS
		ns.exec('grow.js', 'home', growThreads, JSON.stringify({ target, delay: growthDelay, id: batchId }))

		// weaken to min level after grow
		let weakenDelayForGrow = SCRIPT_DELAY_MS * 2
		ns.exec('weaken.js', 'home', weakenThreadsForGrow, JSON.stringify({ target, delay: weakenDelayForGrow, id: batchId }))

		// wait for all the above scripts to finish execution
		await ns.asleep(weakenTime + SCRIPT_DELAY_MS * 3)
	}
}
