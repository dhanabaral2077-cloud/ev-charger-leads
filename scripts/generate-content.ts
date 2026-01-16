/**
 * Manual Content Generation Runner
 * 
 * Generates unique content for all cities using pre-written templates
 * No AI API needed - all content is crafted by the development team!
 * 
 * Run: npm run generate:content
 */

import { PrismaClient } from '@prisma/client';
import { getCityContent } from '../lib/content-generator';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🚀 Starting content generation...\n');

        // Get all cities without generated content
        const cities = await prisma.city.findMany({
            where: {
                contentGenerated: false,
            },
            include: {
                incentives: true,
            },
            orderBy: {
                population: 'desc', // Start with largest cities
            },
        });

        console.log(`📊 Found ${cities.length} cities needing content\n`);

        if (cities.length === 0) {
            console.log('✅ All cities already have content generated!');
            return;
        }

        console.log('🚀 Generating content using pre-written templates...\n');

        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < cities.length; i++) {
            const city = cities[i];

            try {
                console.log(`[${i + 1}/${cities.length}] Generating content for ${city.name}, ${city.stateAbbr}...`);

                const cityData = {
                    name: city.name,
                    state: city.state,
                    stateAbbr: city.stateAbbr,
                    population: city.population,
                    electricityRate: city.electricityRate || 0.12,
                    avgInstallCost: city.avgInstallCost || 1800,
                    incentives: city.incentives.map(inc => inc.name),
                };

                // Generate content using manual templates
                const content = getCityContent(cityData);

                // Update database
                await prisma.city.update({
                    where: { id: city.id },
                    data: {
                        aiGeneratedIntro: content.intro,
                        aiGeneratedFaq: content.faq,
                        contentGenerated: true,
                        published: true, // Auto-publish
                    },
                });

                successCount++;
                console.log(`  ✅ Success (${successCount} total)\n`);

            } catch (error) {
                errorCount++;
                console.error(`  ❌ Error: ${error}\n`);
            }
        }

        console.log('\n✅ Content generation complete!');
        console.log(`📊 Summary:`);
        console.log(`  - Successful: ${successCount}`);
        console.log(`  - Errors: ${errorCount}`);
        console.log(`  - Total: ${cities.length}`);
        console.log('\n🎉 All content generated using hand-crafted templates!');
        console.log('   No AI API costs - everything is pre-written and optimized for SEO.');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
