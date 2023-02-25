export const colors = {
	r: '\x1b[31m',
	g: '\x1b[32m',
	b: '\x1b[34m',
	c: '\x1b[36m',
	m: '\x1b[35m',
	y: '\x1b[33m',
	bk: '\x1b[30m',
	w: '\x1b[37m',
	d: '\x1b[0m', //default color
}

/** @param {import("../NetscriptDefinitions").NS} ns */
export async function dfs(ns, mapFunction, log = false) {
	let output = []
	let visitedServers = []
	let serversToVisit = ['home']
	while (serversToVisit.length > 0) {
		let currentServer = serversToVisit.shift()
		visitedServers.push(currentServer)
		let servers = ns.scan(currentServer)
		if (log) {
			ns.tprint(currentServer, ' => ', servers)
		}
		output.push(await mapFunction(ns, currentServer))
		// visit all of connected servers if they haven't been explored yet
		for (let server of servers) {
			if (!visitedServers.includes(server) && !serversToVisit.includes(server)) {
				serversToVisit.push(server)
			}
		}
	}
	return output
}

/** @param {import("../NetscriptDefinitions").NS} ns */
async function listNumOfThreads(ns, hostname) {
	let runningThreads = 0
	let scripts = ns.ps(hostname)
	scripts.forEach((s) => {
		runningThreads += s.threads
	})

	return runningThreads
}

/** @param {import("../NetscriptDefinitions").NS} ns */
async function killAllScripts(ns, hostname) {
	ns.killall(hostname)
}

/** @param {import("../NetscriptDefinitions").NS} ns */
export async function getServerInformation(ns, hostname) {
	let stats = {
		hostname: hostname,
		moneyRatio: ns.getServerMoneyAvailable(hostname) / ns.getServerMaxMoney(hostname),
		moneyAvailable: ns.getServerMoneyAvailable(hostname),
		maxMoney: ns.getServerMaxMoney(hostname),
		minSecurityLevel: ns.getServerMinSecurityLevel(hostname),
		hackingLevelRequired: ns.getServerRequiredHackingLevel(hostname),
		securityLevel: ns.getServerSecurityLevel(hostname),
		maxRam: ns.getServerMaxRam(hostname),
		usedRam: ns.getServerUsedRam(hostname),
		rootAccess: ns.hasRootAccess(hostname),
	}
	return stats
}

export async function fetchAllServers(ns) {
	return dfs(ns, getServerInformation, ns.args[1])
}

/** @param {import("../NetscriptDefinitions").NS} ns */
export async function filterHackableServers(ns, servers) {
	let sortedByMoneyAvailable = servers
		.filter((servInfo) => {
			return servInfo.rootAccess && servInfo.maxMoney > 0 && servInfo.hackingLevelRequired <= Math.ceil(ns.getHackingLevel() / 2)
		})
		.sort((a, b) => b.maxMoney - a.maxMoney)

	return sortedByMoneyAvailable
}

/** @param {import("../NetscriptDefinitions").NS} ns */
export async function runScript(ns, scriptName, threads, target, pid = 0) {
	const MIN_HOME_RAM_PCT = 0.4
	let ramPerThread = ns.getScriptRam(scriptName)

	let pservs = (await fetchAllServers(ns))
		.filter((serv) => serv.rootAccess && serv.maxRam > 0)
		.sort((a, b) => b.maxRam - a.maxRam)
		.map((s) => s.hostname)

	let threadsStarted = 0

	for (let serv of pservs) {
		let maxRam = ns.getServerMaxRam(serv)
		let availableRam = maxRam - ns.getServerUsedRam(serv)
		let possibleThreads = Math.floor(availableRam / ramPerThread)
		if (serv.hostname === 'home' && availableRam <= maxRam * MIN_HOME_RAM_PCT) {
			continue
		}

		// Check if server is already at max capacity
		if (possibleThreads <= 0) continue
		// Lower thread count if we are over target
		if (possibleThreads > threads) possibleThreads = threads

		ns.scp('utils.js', serv)
		ns.scp(scriptName, serv)

		ns.print(`Starting script ${scriptName} on ${serv} with ${possibleThreads} threads`)

		ns.exec(scriptName, serv, possibleThreads, target, pid)

		// Did we already run *all* the threads of this script?
		threadsStarted += possibleThreads
		if (threadsStarted >= threads) return threadsStarted
	}

	return threadsStarted
}

/** @param {import("../NetscriptDefinitions").NS} ns */
export async function getGlobalRam(ns) {
	let servs = await fetchAllServers(ns)
	let format = (n) => {
		return ns.nFormat(n, '00,00')
	}
	let usedRam = servs.reduce((acc, s) => s.usedRam + acc, 0)
	let maxRam = servs.reduce((acc, s) => {
		return s.maxRam + acc
	}, 0)
	if (ns.args[0]) {
		ns.tprint(`${ns.nFormat(usedRam / maxRam, '0.0%')} Global Ram Usage: ${format(usedRam)}gb/${format(maxRam)}gb`)
	}
	return maxRam - usedRam
}

/** @param {import("../NetscriptDefinitions").NS} ns */
export async function getMaxGlobalRam(ns) {
	let servs = await fetchAllServers(ns)
	let maxRam = servs.reduce((acc, s) => {
		return s.maxRam + acc
	}, 0)
	return maxRam
}

/** @param {import("../NetscriptDefinitions").NS} ns */
export async function getUsedGlobalRam(ns) {
	let servs = await fetchAllServers(ns)
	let usedRam = servs.reduce((acc, s) => {
		return s.usedRam + acc
	}, 0)
	return usedRam
}

/** @param {import("../NetscriptDefinitions").NS} ns */
async function getAccessToServ(ns, hostname) {
	let portsOpened = 0
	if (ns.fileExists('brutessh.exe')) {
		ns.brutessh(hostname)
		portsOpened++
	}
	if (ns.fileExists('ftpcrack.exe')) {
		ns.ftpcrack(hostname)
		portsOpened++
	}
	if (ns.fileExists('relaysmtp.exe')) {
		ns.relaysmtp(hostname)
		portsOpened++
	}
	if (ns.fileExists('sqlinject.exe')) {
		ns.sqlinject(hostname)
		portsOpened++
	}
	if (ns.fileExists('httpworm.exe')) {
		ns.httpworm(hostname)
		portsOpened++
	}

	if (ns.getServerNumPortsRequired(hostname) <= portsOpened) {
		try {
			ns.nuke(hostname)
			ns.tprint(`SUCCESS NUKED ${hostname} Access Granted \$.`)
		} catch (e) {
			ns.tprint(`ERROR Unexpected failure; couldn't get root access on serv: ${hostname}`)
		}
	}
}

/** @param {import("../NetscriptDefinitions").NS} ns */
export async function getRootOnAllServers(ns) {
	let allServs = await fetchAllServers(ns)
	for (let serv of allServs.map((s) => s.hostname)) {
		if (!ns.hasRootAccess(serv)) {
			await getAccessToServ(ns, serv)
		}
	}
}

/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	let CLI = {
		runScript,
		filterHackableServers,
		getServerInformation,
		dfs,
		fetchAllServers,
		getGlobalRam,
		getRootOnAllServers,
	}
	let command = ns.args[0]
	if (!command) {
		ns.tprint('ERROR Must enter a command:')
		ns.tprint(Object.keys(CLI))
	} else {
		await CLI[command](ns, ...ns.args.slice(1))
	}
}
