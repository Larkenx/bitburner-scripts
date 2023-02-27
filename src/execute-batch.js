// Easy mode delay calculations for batching
// let hackDelay= weakenTime - spacer - hackTime;
// let weaken1delay= 0;
// let growDelay= weakenTime + spacer - growTime;
// let weaken2delay= spacer * 2;

/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	ns.disableLog('ALL')
	const target = ns.args[0]
	const batchId = ns.args[1]
	let scriptDelay = 100

	let weakenTime = ns.getWeakenTime(target)
	let hackTime = ns.getHackTime(target)
	let growTime = ns.getHackTime(target)
	let hackPercent = 0.05

	await ns.asleep(batchId * scriptDelay)

	while (true) {
		let hackThreads = Math.ceil(hackPercent / ns.hackAnalyze(target))
		let weakenThreadsForHack = Math.ceil(ns.hackAnalyzeSecurity(hackThreads) / ns.weakenAnalyze(1))

		// weaken to counter a hack
		ns.exec('weaken.js', 'home', weakenThreadsForHack, JSON.stringify({ target, id: batchId }))

		// weaken to min level after grow
		let weakenDelayForGrow = scriptDelay * 2
		ns.exec('weaken-min-sec-level.js', 'home', 1, JSON.stringify({ target, id: batchId, delay: weakenDelayForGrow }))

		// grow to 100%
		let growthDelay = weakenTime - growTime + scriptDelay
		ns.exec('grow-100-percent.js', 'home', 1, JSON.stringify({ target, id: batchId, delay: growthDelay }))

		// hack a % of the money
		let hackDelay = weakenTime - hackTime - scriptDelay
		ns.exec('hack.js', 'home', hackThreads, JSON.stringify({ target, id: batchId, delay: hackDelay }))

		// wait for all the above scripts to finish execution
		await ns.asleep(weakenTime + scriptDelay * 2)
	}
}
