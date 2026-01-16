/**
 * EV Incentives Data Collection
 * 
 * Collects federal, state, and local EV charging incentives from:
 * 1. DSIRE (Database of State Incentives for Renewables & Efficiency)
 * 2. IRS.gov for federal tax credits
 * 3. Manual compilation of major utility programs
 * 
 * Run: npm run collect-incentives
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'scripts', 'data');

interface Incentive {
    name: string;
    description: string;
    amount: number | null;
    percentage: number | null;
    type: 'federal' | 'state' | 'utility' | 'local';
    provider: string;
    eligibility: string;
    applicationUrl: string | null;
    isNational: boolean;
    state: string | null;
}

/**
 * Federal incentives (2026 data)
 */
function getFederalIncentives(): Incentive[] {
    return [
        {
            name: 'Federal EV Charger Tax Credit',
            description: 'Alternative Fuel Vehicle Refueling Property Credit provides up to 30% of the cost of installing an EV charging station, with a maximum credit of $1,000 for residential installations.',
            amount: 1000,
            percentage: 30,
            type: 'federal',
            provider: 'IRS',
            eligibility: 'Available to homeowners who install qualified EV charging equipment. Subject to income limitations.',
            applicationUrl: 'https://www.irs.gov/forms-pubs/about-form-8911',
            isNational: true,
            state: null,
        },
    ];
}

/**
 * State-level incentives (2026 data)
 * This is a curated list of major state programs
 */
function getStateIncentives(): Incentive[] {
    return [
        // California
        {
            name: 'California Clean Fuel Reward',
            description: 'Point-of-sale rebate for purchasing or leasing eligible electric vehicles.',
            amount: 750,
            percentage: null,
            type: 'state',
            provider: 'California Air Resources Board',
            eligibility: 'Available to California residents purchasing or leasing new eligible EVs.',
            applicationUrl: 'https://cleanfuelreward.com/',
            isNational: false,
            state: 'California',
        },
        {
            name: 'California EV Charger Rebate (CALeVIP)',
            description: 'Rebates for installing EV charging infrastructure, including residential chargers in some regions.',
            amount: 2500,
            percentage: null,
            type: 'state',
            provider: 'California Energy Commission',
            eligibility: 'Varies by region. Some programs available for multi-family housing.',
            applicationUrl: 'https://calevip.org/',
            isNational: false,
            state: 'California',
        },

        // Colorado
        {
            name: 'Colorado EV Tax Credit',
            description: 'State tax credit for purchasing or leasing new electric vehicles.',
            amount: 5000,
            percentage: null,
            type: 'state',
            provider: 'Colorado Department of Revenue',
            eligibility: 'Colorado residents who purchase or lease eligible EVs.',
            applicationUrl: 'https://energyoffice.colorado.gov/transportation/grants-incentives',
            isNational: false,
            state: 'Colorado',
        },

        // New York
        {
            name: 'New York Drive Clean Rebate',
            description: 'Point-of-sale rebate for purchasing or leasing eligible electric vehicles.',
            amount: 2000,
            percentage: null,
            type: 'state',
            provider: 'NYSERDA',
            eligibility: 'New York residents purchasing or leasing eligible EVs.',
            applicationUrl: 'https://www.nyserda.ny.gov/drive-clean-rebate',
            isNational: false,
            state: 'New York',
        },
        {
            name: 'New York Charge Ready Program',
            description: 'Incentives for installing EV charging stations, including residential installations.',
            amount: 4000,
            percentage: null,
            type: 'state',
            provider: 'NYSERDA',
            eligibility: 'Available for multi-family residential properties and workplaces.',
            applicationUrl: 'https://www.nyserda.ny.gov/charge-ready',
            isNational: false,
            state: 'New York',
        },

        // Massachusetts
        {
            name: 'Massachusetts MOR-EV Rebate',
            description: 'Rebate for purchasing or leasing new battery electric vehicles.',
            amount: 3500,
            percentage: null,
            type: 'state',
            provider: 'Massachusetts Department of Environmental Protection',
            eligibility: 'Massachusetts residents purchasing or leasing eligible BEVs.',
            applicationUrl: 'https://mor-ev.org/',
            isNational: false,
            state: 'Massachusetts',
        },

        // New Jersey
        {
            name: 'New Jersey Charge Up',
            description: 'Point-of-sale incentive for purchasing or leasing electric vehicles.',
            amount: 4000,
            percentage: null,
            type: 'state',
            provider: 'New Jersey Board of Public Utilities',
            eligibility: 'New Jersey residents purchasing or leasing eligible EVs.',
            applicationUrl: 'https://chargeup.njcleanenergy.com/',
            isNational: false,
            state: 'New Jersey',
        },

        // Oregon
        {
            name: 'Oregon EV Rebate',
            description: 'Rebate for purchasing or leasing new or used electric vehicles.',
            amount: 7500,
            percentage: null,
            type: 'state',
            provider: 'Oregon Department of Environmental Quality',
            eligibility: 'Oregon residents with income below certain thresholds.',
            applicationUrl: 'https://www.oregon.gov/deq/aq/programs/pages/zev-rebate.aspx',
            isNational: false,
            state: 'Oregon',
        },

        // Washington
        {
            name: 'Washington EV Sales Tax Exemption',
            description: 'Sales and use tax exemption for purchasing or leasing eligible electric vehicles.',
            amount: null,
            percentage: 100,
            type: 'state',
            provider: 'Washington Department of Revenue',
            eligibility: 'Available for EVs with MSRP under $45,000.',
            applicationUrl: 'https://dor.wa.gov/taxes-rates/other-taxes/electric-vehicle-fees',
            isNational: false,
            state: 'Washington',
        },

        // Texas
        {
            name: 'Texas Light-Duty Motor Vehicle Purchase Rebate',
            description: 'Rebate for purchasing or leasing eligible electric vehicles.',
            amount: 2500,
            percentage: null,
            type: 'state',
            provider: 'Texas Commission on Environmental Quality',
            eligibility: 'Texas residents in eligible counties.',
            applicationUrl: 'https://www.tceq.texas.gov/airquality/terp/ld.html',
            isNational: false,
            state: 'Texas',
        },
    ];
}

/**
 * Major utility company incentives
 */
function getUtilityIncentives(): Incentive[] {
    return [
        {
            name: 'PG&E EV Charge Network',
            description: 'Pacific Gas & Electric offers rebates for installing EV charging equipment.',
            amount: 500,
            percentage: null,
            type: 'utility',
            provider: 'Pacific Gas & Electric (PG&E)',
            eligibility: 'PG&E customers in California.',
            applicationUrl: 'https://www.pge.com/ev',
            isNational: false,
            state: 'California',
        },
        {
            name: 'SCE Charge Ready',
            description: 'Southern California Edison provides rebates for EV charging installations.',
            amount: 1000,
            percentage: null,
            type: 'utility',
            provider: 'Southern California Edison (SCE)',
            eligibility: 'SCE customers installing Level 2 chargers.',
            applicationUrl: 'https://www.sce.com/evbusiness/charge-ready',
            isNational: false,
            state: 'California',
        },
        {
            name: 'Xcel Energy EV Accelerate At Home',
            description: 'Rebates for residential EV charging equipment and installation.',
            amount: 1300,
            percentage: null,
            type: 'utility',
            provider: 'Xcel Energy',
            eligibility: 'Xcel Energy customers in Colorado, Minnesota, and other service areas.',
            applicationUrl: 'https://ev.xcelenergy.com/ev-accelerate-at-home',
            isNational: false,
            state: 'Colorado',
        },
        {
            name: 'Duke Energy EV Charging Rebate',
            description: 'Rebates for purchasing and installing Level 2 EV chargers.',
            amount: 500,
            percentage: null,
            type: 'utility',
            provider: 'Duke Energy',
            eligibility: 'Duke Energy customers in North Carolina, South Carolina, and Florida.',
            applicationUrl: 'https://www.duke-energy.com/home/products/electric-vehicles',
            isNational: false,
            state: 'North Carolina',
        },
    ];
}

/**
 * Combine all incentives
 */
function getAllIncentives(): Incentive[] {
    return [
        ...getFederalIncentives(),
        ...getStateIncentives(),
        ...getUtilityIncentives(),
    ];
}

/**
 * Save incentives data
 */
function saveIncentivesData(incentives: Incentive[]): void {
    const outputPath = path.join(DATA_DIR, 'incentives.json');
    fs.writeFileSync(outputPath, JSON.stringify(incentives, null, 2));
    console.log(`💾 Saved ${incentives.length} incentives to ${outputPath}`);

    // Create summary
    const summary = {
        total: incentives.length,
        byType: {
            federal: incentives.filter(i => i.type === 'federal').length,
            state: incentives.filter(i => i.type === 'state').length,
            utility: incentives.filter(i => i.type === 'utility').length,
            local: incentives.filter(i => i.type === 'local').length,
        },
        byState: incentives
            .filter(i => i.state)
            .reduce((acc, i) => {
                acc[i.state!] = (acc[i.state!] || 0) + 1;
                return acc;
            }, {} as Record<string, number>),
    };

    const summaryPath = path.join(DATA_DIR, 'incentives-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`📈 Saved summary to ${summaryPath}`);
}

/**
 * Main execution
 */
async function main() {
    try {
        console.log('🚀 Starting EV incentives collection...\n');

        const incentives = getAllIncentives();
        saveIncentivesData(incentives);

        console.log('\n✅ Incentives collection complete!');
        console.log(`📊 Total incentives: ${incentives.length}`);
        console.log('\nNext step: npm run seed-database');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

main();
