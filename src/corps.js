const COMPANY_NAME = 'LarkenCorp'
const AGRICULTURE_INDUSTRY_NAME = 'AG'
const TOBACCO_INDUSTRY_NAME = 'TB'

const jobs = {
	Operations: 'Operations',
	Engineer: 'Engineer',
	Business: 'Business',
	Management: 'Management',
	RND: 'Research & Development',
}

const UPGRADES = {
	SmartFactories: 'Smart Factories',
	WilsonAnalytics: 'Wilson Analytics',
	NeuralAccelerators: 'Neural Accelerators',
	ProjectInsight: 'Project Insight',
	SmartStorage: 'Smart Storage',
	NuoptimalNootropicInjectorImplants: 'Nuoptimal Nootropic Injector Implants',
	FocusWires: 'FocusWires',
	DreamSense: 'DreamSense',
	SpeechProcessorImplants: 'Speech Processor Implants',
	SalesBots: 'ABC SalesBots',
}

const productivityMaterials = ['Hardware', 'Robots', 'AI Cores', 'Real Estate']
const cities = ['Aevum', 'Chongqing', 'New Tokyo', 'Ishima', 'Volhaven', 'Sector-12']

/** @param {import("../NetscriptDefinitions").NS} ns */
function startCorporation(ns) {
	ns.corporation.createCorporation(COMPANY_NAME, false)
	ns.corporation.unlockUpgrade('Smart Supply')
}

/** @param {import("../NetscriptDefinitions").NS} ns */
function createAgricultureDivison(ns, industryName) {
	ns.corporation.expandIndustry('Agriculture', industryName)
	for (let city of cities) {
		ns.corporation.expandCity(industryName, city)
		ns.corporation.purchaseWarehouse(industryName, city)
		ns.corporation.setSmartSupply(industryName, city, true)
		while (ns.corporation.hireEmployee()) {}
		ns.corporation.setAutoJobAssignment(industryName, city, jobs.Operations, 1)
		ns.corporation.setAutoJobAssignment(industryName, city, jobs.Engineer, 1)
		ns.corporation.setAutoJobAssignment(industryName, city, jobs.Business, 1)

		ns.corporation.sellMaterial(industryName, city, 'Plants', 'MAX', 'MP')
		ns.corporation.sellMaterial(industryName, city, 'Food', 'MAX', 'MP')
	}

	ns.corporation.hireAdVert(industryName)

	for (let i = 0; i < 2; i++) {
		ns.corporation.levelUpgrade(UPGRADES.SmartFactories)
		ns.corporation.levelUpgrade(UPGRADES.FocusWires)
		ns.corporation.levelUpgrade(UPGRADES.NeuralAccelerators)
		ns.corporation.levelUpgrade(UPGRADES.SpeechProcessorImplants)
		ns.corporation.levelUpgrade(UPGRADES.NuoptimalNootropicInjectorImplants)
	}

	for (let i = 0; i < 2; i++) {
		for (let city of cities) {
			try {
				ns.corporation.upgradeWarehouse(industryName, city, 1)
			} catch {}
		}
	}
}
/** @param {import("../NetscriptDefinitions").NS} ns */
function coffeeParty(ns, industryName) {
	for (const city of cities) {
		const office = ns.corporation.getOffice(industryName, city)
		if (office.avgEne < 95) ns.corporation.buyCoffee(industryName, city)
		if (office.avgHap < 95 || office.avgMor < 95) ns.corporation.throwParty(industryName, city, 500_000)
	}
}

/** @param {import("../NetscriptDefinitions").NS} ns */
function setUpAgricultureSpeedRun(ns) {
	startCorporation(ns)
	createAgricultureDivison(ns, AGRICULTURE_INDUSTRY_NAME)
}

/** @param {import("../NetscriptDefinitions").NS} ns */
function getUpgradesByCost(ns) {
	let upgradeCosts = []
	for (let upgrade of Object.values(UPGRADES)) {
		upgradeCosts.push({
			upgrade,
			upgradeCost: ns.corporation.getUpgradeLevelCost(upgrade),
		})
	}

	return upgradeCosts.sort((a, b) => {
		return a.upgradeCost - b.upgradeCost
	})
}

/** @param {import("../NetscriptDefinitions").NS} ns */
async function buyAffordableUpgrades(ns) {
	let upgradeList = getUpgradesByCost(ns)
	let upgradeLimit = 500
	while (ns.corporation.getCorporation().funds > ns.corporation.getCorporation().revenue * 10) {
		let cheapestUpgrade = upgradeList.shift()

		if (cheapestUpgrade.upgradeCost >= ns.corporation.getCorporation().revenue * 10) {
			return
		}

		ns.corporation.levelUpgrade(cheapestUpgrade.upgrade)
		ns.tprint(
			`LEVELED UP ~ Level ${ns.corporation.getUpgradeLevel(cheapestUpgrade.upgrade)} ${cheapestUpgrade.upgrade} for ${ns.formatNumber(
				cheapestUpgrade.upgradeCost
			)}`
		)
		await ns.sleep(0)
		upgradeList = getUpgradesByCost(ns)
	}
}

async function buyAffordableAdverts(ns) {
	let advertCost = ns.corporation.getHireAdVertCost(TOBACCO_INDUSTRY_NAME)
	if (ns.corporation.getCorporation().funds > 1_000_000_000 + advertCost) {
		ns.corporation.hireAdVert(TOBACCO_INDUSTRY_NAME)
		ns.tprint('Buying advertisement for tobacco')
	}
}

/** @param {import("../NetscriptDefinitions").NS} ns */
async function startNextProduct(ns) {
	let division = ns.corporation.getDivision(TOBACCO_INDUSTRY_NAME)
	let allDivisionProducts = division.products.map((pname) => ns.corporation.getProduct(TOBACCO_INDUSTRY_NAME, pname))
	let shouldStartNewProduct = allDivisionProducts.every((product) => product.developmentProgress === 100)
	if (shouldStartNewProduct) {
		if (allDivisionProducts.length === 3) {
			let worstRatedProduct = allDivisionProducts.reduce(
				(product, worstSoFar) => (product.rat < worstSoFar.rat ? product : worstSoFar),
				allDivisionProducts[0]
			)
			ns.corporation.discontinueProduct(TOBACCO_INDUSTRY_NAME, worstRatedProduct.name)
			ns.tprint(`Discontinued product ${worstRatedProduct.name}.`)
		}
		let productPrefix = 'Product'
		let newProductName = `${productPrefix}${Date.now()}`
		let productPrice = ns.corporation.getCorporation().revenue * 10
		if (ns.corporation.getCorporation().funds >= productPrice * 2) {
			ns.corporation.makeProduct(TOBACCO_INDUSTRY_NAME, 'Aevum', newProductName, productPrice, productPrice)
			ns.tprint(`Started new product ${newProductName} for ${ns.formatNumber(productPrice * 2)}`)
		}
	}

	for (let product of ns.corporation.getDivision(TOBACCO_INDUSTRY_NAME).products) {
		ns.corporation.sellProduct(TOBACCO_INDUSTRY_NAME, 'Aevum', product, 'MAX', 'MP', true)
		ns.corporation.setProductMarketTA1(TOBACCO_INDUSTRY_NAME, product, true)
		ns.corporation.setProductMarketTA2(TOBACCO_INDUSTRY_NAME, product, true)
	}
}

/** @param {import("../NetscriptDefinitions").NS} ns */
export async function main(ns) {
	// setUpAgricultureSpeedRun(ns)
	while (true) {
		while (ns.corporation.getCorporation().state != 'EXPORT') {
			await startNextProduct(ns)
			await buyAffordableUpgrades(ns)
			if (
				ns.corporation.getDivision(TOBACCO_INDUSTRY_NAME).awareness <= 1.798e307 ||
				ns.corporation.getDivision(TOBACCO_INDUSTRY_NAME).popularity <= 1.798e307
			) {
				await buyAffordableAdverts(ns)
			}
			await ns.sleep(0)
		}

		while (ns.corporation.getCorporation().state == 'EXPORT') {
			//same as above
			await ns.sleep(0)
		}

		//and to this part put things you want done exactly once per cycle
		if (!ns.corporation.hasResearched(TOBACCO_INDUSTRY_NAME, 'AutoBrew')) {
			coffeeParty(ns, TOBACCO_INDUSTRY_NAME)
		}
	}
}
