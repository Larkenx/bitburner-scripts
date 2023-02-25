/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	// let initialMoney = ns.getServerMoneyAvailable(ns.args[0])
	let moneyGrownPercentage = await ns.grow(ns.args[0], { stock: true })
	// ns.tprint(`${ns.getHostname()} :: [INFO] Money increased by ${moneyGrownPercentage} for ${ns.args[0]} | serv money: ${ns.nFormat(initialMoney * moneyGrownPercentage, "$0,0")}`)
}
