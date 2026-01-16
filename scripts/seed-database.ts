/**
 * Database Seeding Script
 * 
 * Combines all collected data and seeds the PostgreSQL database
 * 
 * Run: npm run seed-database
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const DATA_DIR = path.join(process.cwd(), 'scripts', 'data');

interface CityJSON {
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

interface ElectricityRateJSON {
    stateAbbr: string;
    stateName: string;
    rate: number;
}

interface IncentiveJSON {
    name: string;
    description: string;
    amount: number | null;
    percentage: number | null;
    type: string;
    provider: string;
    eligibility: string;
    applicationUrl: string | null;
    isNational: boolean;
    state: string | null;
}

/**
 * Load JSON data files
 */
function loadData() {
    const cities: CityJSON[] = JSON.parse(
        fs.readFileSync(path.join(DATA_DIR, 'cities.json'), 'utf-8')
    );

    const electricityRates: ElectricityRateJSON[] = JSON.parse(
        fs.readFileSync(path.join(DATA_DIR, 'electricity-rates.json'), 'utf-8')
    );

    const incentives: IncentiveJSON[] = JSON.parse(
        fs.readFileSync(path.join(DATA_DIR, 'incentives.json'), 'utf-8')
    );

    return { cities, electricityRates, incentives };
}

/**
 * Calculate average installation cost based on state
 */
function calculateAvgInstallCost(stateAbbr: string): number {
    // Base cost: $800 (equipment) + $1,000 (installation)
    const baseCost = 1800;

    // Adjust by state (higher cost of living = higher installation costs)
    const stateCostMultipliers: Record<string, number> = {
        'CA': 1.3, 'NY': 1.25, 'MA': 1.2, 'CT': 1.2, 'NJ': 1.2,
        'HI': 1.4, 'AK': 1.3, 'WA': 1.15, 'CO': 1.1, 'OR': 1.1,
        'TX': 0.95, 'FL': 0.95, 'GA': 0.9, 'NC': 0.9, 'TN': 0.85,
    };

    const multiplier = stateCostMultipliers[stateAbbr] || 1.0;
    return Math.round(baseCost * multiplier);
}

/**
 * Seed incentives
 */
async function seedIncentives(incentivesData: IncentiveJSON[]) {
    console.log('💰 Seeding incentives...');

    for (const incentive of incentivesData) {
        await prisma.incentive.create({
            data: {
                name: incentive.name,
                description: incentive.description,
                amount: incentive.amount,
                percentage: incentive.percentage,
                type: incentive.type,
                provider: incentive.provider,
                eligibility: incentive.eligibility || '',
                applicationUrl: incentive.applicationUrl,
                isNational: incentive.isNational,
                state: incentive.state,
            },
        });
    }

    console.log(`✅ Seeded ${incentivesData.length} incentives`);
}

/**
 * Seed cities
 */
async function seedCities(
    citiesData: CityJSON[],
    electricityRates: ElectricityRateJSON[]
) {
    console.log('🏙️  Seeding cities...');

    // Limit to top 1,000 cities by population for initial deployment
    const citiesToSeed = citiesData.slice(0, 1000);
    console.log(`  (Seeding top ${citiesToSeed.length} cities by population)\n`);

    // Create a map of state -> electricity rate
    const rateMap = new Map<string, number>();
    electricityRates.forEach(r => {
        rateMap.set(r.stateAbbr, r.rate / 100); // Convert cents to dollars
    });

    // Get all incentives for mapping
    const allIncentives = await prisma.incentive.findMany();

    let count = 0;
    const batchSize = 10; // Small batches for Supabase free tier (17 connection limit)

    for (let i = 0; i < citiesToSeed.length; i += batchSize) {
        const batch = citiesToSeed.slice(i, i + batchSize);

        await Promise.all(
            batch.map(async (city) => {
                const electricityRate = rateMap.get(city.stateAbbr) || 0.12;
                const avgInstallCost = calculateAvgInstallCost(city.stateAbbr);

                // Find applicable incentives (national + state-specific)
                const applicableIncentives = allIncentives.filter(
                    inc => inc.isNational || inc.state === city.state
                );

                await prisma.city.create({
                    data: {
                        name: city.name,
                        state: city.state,
                        stateAbbr: city.stateAbbr,
                        county: city.county,
                        zipCodes: city.zipCodes,
                        population: city.population,
                        latitude: city.latitude,
                        longitude: city.longitude,
                        slug: city.slug,
                        electricityRate,
                        avgInstallCost,
                        metaTitle: `EV Charger Installation ${city.name}, ${city.stateAbbr} | Cost & Rebates 2026`,
                        metaDescription: `Get your EV charger installed in ${city.name}, ${city.state}. Average cost: $${avgInstallCost.toLocaleString()}. Find local installers, rebates, and incentives.`,
                        incentives: {
                            connect: applicableIncentives.map(inc => ({ id: inc.id })),
                        },
                    },
                });

                count++;
            })
        );

        console.log(`  Progress: ${count} / ${citiesToSeed.length} cities`);
    }

    console.log(`✅ Seeded ${count} cities`);
}

/**
 * Main seeding function
 */
async function main() {
    try {
        console.log('🚀 Starting database seeding...\n');

        // Load data
        console.log('📂 Loading data files...');
        const { cities, electricityRates, incentives } = loadData();
        console.log(`  - ${cities.length} cities`);
        console.log(`  - ${electricityRates.length} electricity rates`);
        console.log(`  - ${incentives.length} incentives\n`);

        // Clear existing data (commented out to avoid connection limits on Supabase free tier)
        // console.log('🗑️  Clearing existing data...');
        // await prisma.lead.deleteMany();
        // await prisma.city.deleteMany();
        // await prisma.incentive.deleteMany();
        // console.log('✅ Database cleared\n');

        // Seed incentives first (referenced by cities)
        await seedIncentives(incentives);
        console.log();

        // Seed cities
        await seedCities(cities, electricityRates);
        console.log();

        // Print summary
        const cityCount = await prisma.city.count();
        const incentiveCount = await prisma.incentive.count();

        console.log('✅ Database seeding complete!\n');
        console.log('📊 Summary:');
        console.log(`  - Cities: ${cityCount}`);
        console.log(`  - Incentives: ${incentiveCount}`);
        console.log('\nNext steps:');
        console.log('1. Run: npm run generate-content (to create AI content)');
        console.log('2. Run: npm run dev (to start the development server)');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
