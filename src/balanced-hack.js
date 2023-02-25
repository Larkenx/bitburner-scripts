/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	var target = ns.args[0]
	var moneyThresh = ns.getServerMaxMoney(target) * 0.9
	var securityThresh = ns.getServerMinSecurityLevel(target) + 3
	while (true) {
		if (ns.getServerSecurityLevel(target) > securityThresh) {
			await ns.weaken(target, { stock: true })
		} else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
			await ns.grow(target, { stock: true })
		} else {
			let moneyStolen = await ns.hack(target, { stock: true })
			if (moneyStolen > 0) {
				ns.tprint(
					`Stole +${ns.nFormat(moneyStolen, '$0,0')} from ${target} | Total Money: ${ns.nFormat(
						ns.getServerMoneyAvailable('home'),
						'$0,0'
					)}`
				)
			}
		}
	}
}
