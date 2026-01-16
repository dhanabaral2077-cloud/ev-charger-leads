/**
 * Electricity Rates Data Collection
 * 
 * Collects average residential electricity rates by state using:
 * 1. EIA (Energy Information Administration) Open Data API
 * 2. Free tier: https://www.eia.gov/opendata/
 * 
 * Run: npm run collect-electricity-rates
 */

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'scripts', 'data');

// EIA API - Free tier available
// Register at: https://www.eia.gov/opendata/register.php
const EIA_API_KEY = process.env.EIA_API_KEY || 'YOUR_EIA_API_KEY';

// State abbreviations to full names
const STATE_MAPPING: Record<string, string> = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
    'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
    'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
    'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
    'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
    'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
    'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
    'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
    'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
    'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
    'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia'
};

interface ElectricityRate {
    stateAbbr: string;
    stateName: string;
    rate: number; // cents per kWh
    lastUpdated: string;
}

/**
 * Fetch electricity rates from EIA API
 */
async function fetchElectricityRates(): Promise<ElectricityRate[]> {
    console.log('⚡ Fetching electricity rates from EIA...');

    if (EIA_API_KEY === 'YOUR_EIA_API_KEY') {
        console.log('⚠️  EIA API key not set. Using fallback data...');
        return getFallbackRates();
    }

    try {
        // EIA API endpoint for average residential electricity prices
        const url = `https://api.eia.gov/v2/electricity/retail-sales/data/?api_key=${EIA_API_KEY}&frequency=annual&data[0]=price&facets[sectorid][]=RES&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=5000`;

        const response = await axios.get(url);
        const data = response.data.response.data;

        // Get most recent data for each state
        const stateRates = new Map<string, ElectricityRate>();

        for (const item of data) {
            const stateAbbr = item.stateid;
            if (stateAbbr && STATE_MAPPING[stateAbbr] && !stateRates.has(stateAbbr)) {
                stateRates.set(stateAbbr, {
                    stateAbbr,
                    stateName: STATE_MAPPING[stateAbbr],
                    rate: parseFloat(item.price),
                    lastUpdated: item.period,
                });
            }
        }

        return Array.from(stateRates.values());
    } catch (error) {
        console.error('❌ Error fetching from EIA API:', error);
        console.log('📋 Using fallback data...');
        return getFallbackRates();
    }
}

/**
 * Fallback electricity rates (2025 averages)
 * Source: EIA.gov historical data
 */
function getFallbackRates(): ElectricityRate[] {
    const fallbackData: Record<string, number> = {
        'AL': 12.41, 'AK': 22.54, 'AZ': 12.76, 'AR': 10.42, 'CA': 26.35,
        'CO': 12.28, 'CT': 22.11, 'DE': 12.05, 'FL': 11.37, 'GA': 11.92,
        'HI': 32.76, 'ID': 10.35, 'IL': 12.56, 'IN': 12.02, 'IA': 11.95,
        'KS': 12.89, 'KY': 10.56, 'LA': 9.53, 'ME': 16.13, 'MD': 12.84,
        'MA': 22.59, 'MI': 15.43, 'MN': 13.05, 'MS': 11.07, 'MO': 11.15,
        'MT': 11.19, 'NE': 10.87, 'NV': 12.23, 'NH': 19.63, 'NJ': 15.64,
        'NM': 12.58, 'NY': 18.49, 'NC': 11.07, 'ND': 10.23, 'OH': 12.55,
        'OK': 10.52, 'OR': 10.85, 'PA': 13.04, 'RI': 21.23, 'SC': 12.15,
        'SD': 11.89, 'TN': 10.79, 'TX': 11.86, 'UT': 10.34, 'VT': 17.92,
        'VA': 11.44, 'WA': 9.73, 'WV': 11.35, 'WI': 13.45, 'WY': 10.77,
        'DC': 12.38
    };

    return Object.entries(fallbackData).map(([abbr, rate]) => ({
        stateAbbr: abbr,
        stateName: STATE_MAPPING[abbr],
        rate,
        lastUpdated: '2025',
    }));
}

/**
 * Save electricity rates data
 */
function saveElectricityRates(rates: ElectricityRate[]): void {
    const outputPath = path.join(DATA_DIR, 'electricity-rates.json');
    fs.writeFileSync(outputPath, JSON.stringify(rates, null, 2));
    console.log(`💾 Saved electricity rates for ${rates.length} states to ${outputPath}`);

    // Create summary
    const summary = {
        totalStates: rates.length,
        averageRate: (rates.reduce((sum, r) => sum + r.rate, 0) / rates.length).toFixed(2),
        highestRate: rates.sort((a, b) => b.rate - a.rate)[0],
        lowestRate: rates.sort((a, b) => a.rate - b.rate)[0],
    };

    console.log(`📊 Average US electricity rate: ${summary.averageRate}¢/kWh`);
    console.log(`📈 Highest: ${summary.highestRate.stateName} (${summary.highestRate.rate}¢/kWh)`);
    console.log(`📉 Lowest: ${summary.lowestRate.stateName} (${summary.lowestRate.rate}¢/kWh)`);
}

/**
 * Main execution
 */
async function main() {
    try {
        console.log('🚀 Starting electricity rates collection...\n');

        const rates = await fetchElectricityRates();
        saveElectricityRates(rates);

        console.log('\n✅ Electricity rates collection complete!');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

main();
