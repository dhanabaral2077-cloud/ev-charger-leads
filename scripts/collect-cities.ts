/// <reference types="node" />
/**
 * US Cities Data Collection Script
 * 
 * This script collects data from free sources:
 * 1. SimpleMaps Free US Cities Database (https://simplemaps.com/data/us-cities)
 * 2. US Census Bureau API
 * 
 * Run: npm run collect-cities
 */

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
// @ts-ignore
import Papa from 'papaparse';

const DATA_DIR = path.join(process.cwd(), 'scripts', 'data');
const CACHE_DIR = path.join(DATA_DIR, 'cache');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

interface RawCityData {
    city: string;
    city_ascii: string;
    state_id: string;
    state_name: string;
    county_name: string;
    lat: string;
    lng: string;
    population: string;
    density: string;
    timezone: string;
    zips: string;
}

interface ProcessedCity {
    name: string;
    state: string;
    stateAbbr: string;
    county: string;
    zipCodes: string[];
    population: number;
    latitude: number;
    longitude: number;
    slug: string;
}

/**
 * Download SimpleMaps free US cities database
 * Free version: https://simplemaps.com/data/us-cities
 */
async function downloadCitiesDatabase(): Promise<string> {
    console.log('📥 Downloading US Cities database from SimpleMaps...');

    const csvUrl = 'https://simplemaps.com/static/data/us-cities/1.76/basic/simplemaps_uscities_basicv1.76.zip';

    // Note: The free version is a ZIP file. For now, we'll use a pre-downloaded CSV
    // In production, you'd extract the ZIP programmatically

    console.log('⚠️  Please download the free CSV from: https://simplemaps.com/data/us-cities');
    console.log('    Save it as: scripts/data/cache/uscities.csv');

    const csvPath = path.join(CACHE_DIR, 'uscities.csv');

    if (!fs.existsSync(csvPath)) {
        throw new Error('CSV file not found. Please download it manually first.');
    }

    return csvPath;
}

/**
 * Parse and filter cities
 */
async function parseCitiesCSV(csvPath: string): Promise<ProcessedCity[]> {
    console.log('📊 Parsing cities CSV...');

    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    return new Promise((resolve, reject) => {
        Papa.parse<RawCityData>(csvContent, {
            header: true,
            skipEmptyLines: true,
            complete: (results: Papa.ParseResult<RawCityData>) => {
                const cities: ProcessedCity[] = results.data
                    .filter((row: RawCityData) => {
                        const pop = parseInt(row.population || '0');
                        return pop >= 5000; // Only cities with 5k+ population
                    })
                    .map((row: RawCityData) => {
                        const slug = `${row.city_ascii.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${row.state_id.toLowerCase()}`;

                        return {
                            name: row.city,
                            state: row.state_name,
                            stateAbbr: row.state_id,
                            county: row.county_name || '',
                            zipCodes: row.zips ? row.zips.split(' ') : [],
                            population: parseInt(row.population || '0'),
                            latitude: parseFloat(row.lat),
                            longitude: parseFloat(row.lng),
                            slug,
                        };
                    });

                console.log(`✅ Parsed ${cities.length} cities with 5k+ population`);
                resolve(cities);
            },
            error: (error: Error) => {
                reject(error);
            },
        });
    });
}

/**
 * Save processed cities to JSON
 */
function saveCitiesData(cities: ProcessedCity[]): void {
    const outputPath = path.join(DATA_DIR, 'cities.json');
    fs.writeFileSync(outputPath, JSON.stringify(cities, null, 2));
    console.log(`💾 Saved ${cities.length} cities to ${outputPath}`);

    // Also create a summary
    const summary = {
        totalCities: cities.length,
        byState: cities.reduce((acc, city) => {
            acc[city.stateAbbr] = (acc[city.stateAbbr] || 0) + 1;
            return acc;
        }, {} as Record<string, number>),
        topCities: cities
            .sort((a, b) => b.population - a.population)
            .slice(0, 50)
            .map(c => ({ name: c.name, state: c.stateAbbr, population: c.population })),
    };

    const summaryPath = path.join(DATA_DIR, 'cities-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`📈 Saved summary to ${summaryPath}`);
}

/**
 * Main execution
 */
async function main() {
    try {
        console.log('🚀 Starting US Cities data collection...\n');

        // Step 1: Download or locate CSV
        const csvPath = await downloadCitiesDatabase();

        // Step 2: Parse and filter cities
        const cities = await parseCitiesCSV(csvPath);

        // Step 3: Save processed data
        saveCitiesData(cities);

        console.log('\n✅ Data collection complete!');
        console.log(`📊 Total cities collected: ${cities.length}`);
        console.log('\nNext steps:');
        console.log('1. Run: npm run collect-electricity-rates');
        console.log('2. Run: npm run collect-incentives');
        console.log('3. Run: npm run seed-database');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

main();
