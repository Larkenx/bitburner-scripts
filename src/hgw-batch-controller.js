import { runScript, getHackInfo, hack, grow, weaken } from './utils.js'

async function runWithDelay(ns, fn, delay, duration) {
	await ns.asleep(delay)
	return fn()
}

/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	ns.disableLog('ALL')
	const target = ns.args[0]
	const batchId = ns.args[1]
	let delayBuffer = 100
	await ns.asleep(delayBuffer * 2 * batchId)
	let { hackThreads, hackTime } = await getHackInfo(ns, target, 0.1)
	let growTime = ns.getGrowTime(target)
	let weakenTime = ns.getWeakenTime(target)

	let moneyToBeStolen = ns.hackAnalyze(target) * hackThreads
	let percentToGrowBackAfterHack = ns.getServerMaxMoney(target) / (ns.getServerMoneyAvailable(target) - moneyToBeStolen)
	let growThreads = Math.ceil(ns.growthAnalyze(target, percentToGrowBackAfterHack))

	const minSec = ns.getServerMinSecurityLevel(target)

	const secAfterHacking = ns.getServerSecurityLevel(target) + ns.hackAnalyzeSecurity(hackThreads)
	let weakenThreadsToCounterHack = Math.ceil((secAfterHacking - minSec) / ns.weakenAnalyze(1))

	const secAfterGrowing = ns.getServerSecurityLevel(target) + ns.growthAnalyzeSecurity(growThreads)
	let weakenThreadsToCounterGrowth = Math.ceil((secAfterGrowing - minSec) / ns.weakenAnalyze(1))

	let hackDelay = weakenTime - delayBuffer - hackTime
	let growDelay = weakenTime + delayBuffer - growTime
	let secondWeakenDelay = delayBuffer * 2

	await Promise.all([
		weaken(ns, target, batchId),
		runWithDelay(ns, () => weaken(ns, target, batchId), secondWeakenDelay),
		runWithDelay(ns, () => grow(ns, target, batchId), growDelay),
		runWithDelay(ns, () => hack(ns, target, 0.05), hackDelay),
	])
}
