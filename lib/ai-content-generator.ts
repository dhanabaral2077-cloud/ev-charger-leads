/**
 * AI Content Generation System
 * 
 * Uses OpenAI GPT-4o-mini to generate unique, data-augmented content
 * for each city page to avoid duplicate content penalties.
 * 
 * Features:
 * - City-specific introductions
 * - Local FAQ generation
 * - Cost breakdown tables
 */

import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface CityData {
    name: string;
    state: string;
    stateAbbr: string;
    population: number;
    electricityRate: number;
    avgInstallCost: number;
    incentives: string[];
}

interface GeneratedContent {
    intro: string;
    faq: Array<{ question: string; answer: string }>;
}

/**
 * Generate unique introduction for a city
 */
export async function generateCityIntro(city: CityData): Promise<string> {
    const prompt = `Write a unique, helpful 250-word introduction for an article about EV charger installation in ${city.name}, ${city.state}.

REQUIRED DATA POINTS TO INCLUDE NATURALLY:
- City: ${city.name}, ${city.state}
- Population: ${city.population.toLocaleString()} residents
- Average installation cost: $${city.avgInstallCost.toLocaleString()}
- Local electricity rate: $${city.electricityRate.toFixed(2)}/kWh
${city.incentives.length > 0 ? `- Available incentives: ${city.incentives.join(', ')}` : ''}

TONE: Helpful, authoritative, local-focused
AVOID: Generic advice, repetitive phrases, obvious statements
INCLUDE: Specific mention of ${city.name}'s characteristics (e.g., climate, EV adoption, local infrastructure)
FORMAT: 2-3 paragraphs, conversational but professional

Do not use phrases like "As a resident of..." or "If you live in...". Write directly and naturally.`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert content writer specializing in EV charging infrastructure and local home improvement guides. Write unique, data-driven content that helps homeowners make informed decisions.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.8, // Higher temperature for more variation
            max_tokens: 400,
        });

        return completion.choices[0].message.content || '';
    } catch (error) {
        console.error(`Error generating intro for ${city.name}:`, error);
        return getFallbackIntro(city);
    }
}

/**
 * Generate FAQ for a city
 */
export async function generateCityFAQ(city: CityData): Promise<Array<{ question: string; answer: string }>> {
    const prompt = `Generate 5 unique FAQ questions and answers about EV charger installation specifically for ${city.name}, ${city.state}.

CONTEXT:
- City: ${city.name}, ${city.state}
- Average cost: $${city.avgInstallCost.toLocaleString()}
- Electricity rate: $${city.electricityRate.toFixed(2)}/kWh
- State: ${city.state}
${city.incentives.length > 0 ? `- Available incentives: ${city.incentives.join(', ')}` : ''}

REQUIREMENTS:
1. Questions must be specific to ${city.name} or ${city.state}
2. Include local data points (costs, rates, incentives)
3. Answer common homeowner concerns
4. Be practical and actionable
5. Vary question structure

FORMAT: Return as JSON array:
[
  {"question": "...", "answer": "..."},
  ...
]`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert in EV charging installation. Generate helpful, locally-relevant FAQ content in JSON format.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 800,
            response_format: { type: 'json_object' },
        });

        const content = completion.choices[0].message.content || '{}';
        const parsed = JSON.parse(content);
        return parsed.faqs || parsed.questions || [];
    } catch (error) {
        console.error(`Error generating FAQ for ${city.name}:`, error);
        return getFallbackFAQ(city);
    }
}

/**
 * Generate content for a batch of cities
 */
export async function generateBatchContent(
    cities: CityData[],
    onProgress?: (current: number, total: number) => void
): Promise<Map<string, GeneratedContent>> {
    const results = new Map<string, GeneratedContent>();

    for (let i = 0; i < cities.length; i++) {
        const city = cities[i];

        try {
            const [intro, faq] = await Promise.all([
                generateCityIntro(city),
                generateCityFAQ(city),
            ]);

            results.set(`${city.name}-${city.stateAbbr}`, {
                intro,
                faq,
            });

            if (onProgress) {
                onProgress(i + 1, cities.length);
            }

            // Rate limiting: 60 requests per minute for GPT-4o-mini
            if ((i + 1) % 50 === 0) {
                await new Promise(resolve => setTimeout(resolve, 60000));
            }
        } catch (error) {
            console.error(`Error processing ${city.name}:`, error);
        }
    }

    return results;
}

/**
 * Fallback intro if API fails
 */
function getFallbackIntro(city: CityData): string {
    return `Installing an EV charger in ${city.name}, ${city.state} is becoming increasingly popular as more residents make the switch to electric vehicles. With a population of ${city.population.toLocaleString()}, ${city.name} is seeing growing demand for residential charging infrastructure.

The average cost to install a Level 2 EV charger in ${city.name} is approximately $${city.avgInstallCost.toLocaleString()}, which includes the equipment and professional installation. With local electricity rates at $${city.electricityRate.toFixed(2)} per kWh, charging your EV at home is both convenient and cost-effective.

${city.incentives.length > 0 ? `${city.state} residents can take advantage of several incentives, including ${city.incentives[0]}, which can significantly reduce your upfront costs.` : 'Federal tax credits may be available to help offset installation costs.'} This guide will help you understand the process, costs, and options for installing an EV charger at your ${city.name} home.`;
}

/**
 * Fallback FAQ if API fails
 */
function getFallbackFAQ(city: CityData): Array<{ question: string; answer: string }> {
    return [
        {
            question: `How much does it cost to install an EV charger in ${city.name}, ${city.state}?`,
            answer: `The average cost to install a Level 2 EV charger in ${city.name} is approximately $${city.avgInstallCost.toLocaleString()}. This includes the charging equipment ($400-$800) and professional installation by a licensed electrician ($600-$1,500). Your final cost may vary based on your home's electrical panel capacity and the distance from the panel to your charging location.`,
        },
        {
            question: `What incentives are available in ${city.state} for EV charger installation?`,
            answer: city.incentives.length > 0
                ? `${city.state} residents can access several incentives including ${city.incentives.join(', ')}. Additionally, the federal Alternative Fuel Vehicle Refueling Property Credit offers up to $1,000 for residential installations.`
                : `While ${city.state} may not have specific state incentives currently, you can still claim the federal Alternative Fuel Vehicle Refueling Property Credit, which provides up to $1,000 for residential EV charger installations.`,
        },
        {
            question: `Do I need a permit to install an EV charger in ${city.name}?`,
            answer: `Yes, most EV charger installations in ${city.name} require an electrical permit. Your licensed electrician will typically handle the permit application and ensure the installation meets ${city.state} electrical codes and local building requirements.`,
        },
        {
            question: `How long does EV charger installation take in ${city.name}?`,
            answer: `Most residential EV charger installations in ${city.name} take 2-4 hours to complete. However, if your electrical panel needs upgrading or the charger location is far from the panel, installation may take longer and require additional work.`,
        },
        {
            question: `What's the cost to charge an EV at home in ${city.name}?`,
            answer: `With ${city.name}'s average electricity rate of $${city.electricityRate.toFixed(2)} per kWh, charging a typical EV (with a 60 kWh battery) from empty to full costs approximately $${(city.electricityRate * 60).toFixed(2)}. Most drivers charge overnight during off-peak hours, which may offer even lower rates.`,
        },
    ];
}

/**
 * Estimate API costs
 */
export function estimateAPICosts(cityCount: number): { totalCost: number; perCity: number } {
    // GPT-4o-mini pricing (as of 2026):
    // Input: $0.15 per 1M tokens
    // Output: $0.60 per 1M tokens

    // Estimated tokens per city:
    // - Intro: ~500 input + 400 output = 900 tokens
    // - FAQ: ~600 input + 800 output = 1,400 tokens
    // Total: ~2,300 tokens per city

    const tokensPerCity = 2300;
    const costPer1MTokens = 0.30; // Average of input/output
    const costPerCity = (tokensPerCity / 1_000_000) * costPer1MTokens;

    return {
        perCity: costPerCity,
        totalCost: costPerCity * cityCount,
    };
}
