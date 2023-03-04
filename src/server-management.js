/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	function getServerName(n) {
		return `pserv-${n}`
	}

	function canAffordServer(ram) {
		return ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(ram)
	}

	async function topservs() {
		let allServersPurchased = ns.getPurchasedServers()
		for (let serv of allServersPurchased) {
			let usedRam = ns.getServerUsedRam(serv)
			let maxRam = ns.getServerMaxRam(serv)
			ns.tprint(`${serv}:: [${usedRam} / ${maxRam}]`)
		}
	}

	async function upgradeAllServers(ram) {
		let allServersPurchased = ns.getPurchasedServers()
		for (let serv of allServersPurchased) {
			let cost = ns.getPurchasedServerUpgradeCost(serv, ram)
			if (ns.getServerMoneyAvailable('home') > cost) {
				ns.tprint(`Upgrading ${serv} to ${ram}gb of ram for ${ns.nFormat(cost, '$0,0')}`)
				ns.upgradePurchasedServer(serv, ram)
			}
		}
	}

	async function upgradeServer(serv, ram = 0) {
		let currentRam = ns.getServerMaxRam(serv)
		let ramUpgrade = ram ? ram : currentRam * 2
		let costToUpgrade = ns.getPurchasedServerUpgradeCost(serv, ramUpgrade)
		if (ns.getServerMoneyAvailable('home') > costToUpgrade && currentRam !== ns.getPurchasedServerMaxRam()) {
			ns.tprint(`Upgrading ${serv} to ${ramUpgrade}gb of ram for ${ns.nFormat(costToUpgrade, '$0,0')}`)
			ns.upgradePurchasedServer(serv, ramUpgrade)
		}
	}

	async function upgradeCost(serv, ram = 0) {
		let currentRam = ns.getServerMaxRam(serv)
		let ramUpgrade = ram ? ram : currentRam * 2
		let costToUpgrade = ns.getPurchasedServerUpgradeCost(serv, ramUpgrade)
		ns.tprint(`Cost to upgrade ${serv} to ${ramUpgrade}gb of ram is ${ns.nFormat(costToUpgrade, '$0,0')}`)
	}

	async function continuousUpgrades() {
		await purchaseMaxServers(1)
		let allServersPurchased = ns.getPurchasedServers()
		while (true) {
			allServersPurchased = allServersPurchased.sort((a, b) => ns.getServerMaxRam(a) - ns.getServerMaxRam(b))
			for (let serv of allServersPurchased) {
				let currentRam = ns.getServerMaxRam(serv)
				let ramUpgrade = currentRam * 2
				let costToUpgrade = ns.getPurchasedServerUpgradeCost(serv, ramUpgrade)
				if (ns.getServerMoneyAvailable('home') > costToUpgrade && currentRam !== ns.getPurchasedServerMaxRam()) {
					ns.tprint(`Upgrading ${serv} to ${ramUpgrade}gb of ram for ${ns.nFormat(costToUpgrade, '$0,0')}`)
					ns.upgradePurchasedServer(serv, ramUpgrade)
				}
			}
			await ns.sleep(500)
		}
	}

	async function purchaseMaxServers(ram) {
		let maxOwnedServers = ns.getPurchasedServerLimit()
		ns.tprint(`Purchasing new servers with ${ram}gb. Can purchase up to ${maxOwnedServers}`)
		while (ns.getPurchasedServers().length < maxOwnedServers) {
			for (let i = 0; i < maxOwnedServers; i++) {
				if (!ns.serverExists(getServerName(i))) {
					if (canAffordServer(ram)) {
						ns.tprint(`Buying ${getServerName(i)} serv with ${ram}gb`)
						ns.purchaseServer(getServerName(i), ram)
					}
				}
			}
			await ns.sleep(10000)
		}
	}

	let CLI = {
		purchaseMaxServers: purchaseMaxServers,
		upgradeAllServers: upgradeAllServers,
		topservs: topservs,
		continuousUpgrades: continuousUpgrades,
		upgradeServer,
		upgradeCost,
	}
	let command = ns.args[0]
	if (!command) {
		ns.tprint('ERROR Must enter a command:')
		ns.tprint(Object.keys(CLI))
	} else {
		await CLI[command](...ns.args.slice(1))
	}
}
