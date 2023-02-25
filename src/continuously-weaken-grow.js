import * as utils from 'utils.js'
/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	ns.disableLog('ALL')
	while (true) {
		let target = ns.args[0]
		let script = 'weaken.js'
		let serverInfo = ns.getServer(target)
		let memAvailable = (await utils.getGlobalRam(ns)) * 0.8
		ns.tprint(
			`${serverInfo.hostname} :: Current Sec Level ${ns.getServerSecurityLevel(
				target
			)} :: Min Sec Level ${ns.getServerMinSecurityLevel(target)} :: Money Available ${ns.nFormat(
				ns.getServerMoneyAvailable(target),
				'$00,00'
			)}`
		)

		let possibleThreads = ~~(memAvailable / ns.getScriptRam(script))
		let sleepTime
		if (script === 'weaken.js') {
			sleepTime = ns.getWeakenTime(target)
		} else {
			sleepTime = ns.getGrowTime(target)
		}

		await utils.runScript(ns, script, possibleThreads, target)
		await ns.asleep(sleepTime)
		script = script === 'weaken.js' ? 'grow.js' : 'weaken.js'
	}
}
