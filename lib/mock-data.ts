/**
 * Mock Data for Static Demo
 * 
 * Sample data for top 20 US cities to demonstrate the site
 * without requiring a database connection
 */

export interface City {
    id: string;
    name: string;
    state: string;
    stateAbbr: string;
    slug: string;
    population: number;
    electricityRate: number;
    avgInstallCost: number;
    metaTitle: string;
    metaDescription: string;
    aiGeneratedIntro: string;
    aiGeneratedFaq: Array<{ question: string; answer: string }>;
    incentives: Incentive[];
}

export interface Incentive {
    id: string;
    name: string;
    description: string;
    amount: number | null;
    type: string;
    provider: string;
    applicationUrl: string | null;
}

export const mockIncentives: Incentive[] = [
    {
        id: '1',
        name: 'Federal EV Charger Tax Credit',
        description: 'Get 30% of installation costs back, up to $1,000 for residential EV charger installations.',
        amount: 1000,
        type: 'federal',
        provider: 'IRS',
        applicationUrl: 'https://www.irs.gov/credits-deductions/alternative-fuel-vehicle-refueling-property-credit',
    },
    {
        id: '2',
        name: 'California EVSE Rebate',
        description: 'Up to $2,000 rebate for Level 2 EV charger installation in California.',
        amount: 2000,
        type: 'state',
        provider: 'California Energy Commission',
        applicationUrl: null,
    },
];

export const mockCities: City[] = [
    {
        id: '1',
        name: 'New York',
        state: 'New York',
        stateAbbr: 'NY',
        slug: 'new-york-ny',
        population: 8336817,
        electricityRate: 0.18,
        avgInstallCost: 2250,
        metaTitle: 'EV Charger Installation New York, NY | Cost & Rebates 2026',
        metaDescription: 'Get your EV charger installed in New York, New York. Average cost: $2,250. Find local installers, rebates, and incentives.',
        aiGeneratedIntro: `Installing an EV charger at your New York home has never been more important. With electric vehicle adoption growing rapidly across New York, more than 8,336,817 residents in New York are making the switch to cleaner transportation. The average cost to install a Level 2 home charging station in New York is approximately $2,250, which includes professional installation by a licensed electrician.

With local electricity rates at $0.18 per kWh, charging your EV at home is both convenient and cost-effective compared to public charging stations. A full charge for a typical 60 kWh battery costs around $10.80, making home charging 50-70% cheaper than using commercial charging networks.

New York residents can take advantage of several incentives to reduce installation costs, including the Federal EV Charger Tax Credit. Combined with the federal tax credit of up to $1,000, you could save significantly on your upfront investment. This guide will walk you through everything you need to know about installing an EV charger in New York.`,
        aiGeneratedFaq: [
            {
                question: 'How much does it cost to install an EV charger in New York, NY?',
                answer: 'The average cost to install a Level 2 EV charger in New York is approximately $2,250. This includes the charging equipment ($400-$800) and professional installation by a licensed electrician ($600-$1,500). Your final cost may vary based on your home\'s electrical panel capacity, the distance from the panel to your charging location, and whether any electrical upgrades are needed.',
            },
            {
                question: 'What incentives and rebates are available in New York for EV charger installation?',
                answer: 'New York residents can claim the federal Alternative Fuel Vehicle Refueling Property Credit, which provides up to $1,000 (30% of installation costs) for residential EV charger installations. Check with your local utility company, as many offer rebates or special electricity rates for EV owners.',
            },
        ],
        incentives: [mockIncentives[0]],
    },
    {
        id: '2',
        name: 'Los Angeles',
        state: 'California',
        stateAbbr: 'CA',
        slug: 'los-angeles-ca',
        population: 3979576,
        electricityRate: 0.24,
        avgInstallCost: 2340,
        metaTitle: 'EV Charger Installation Los Angeles, CA | Cost & Rebates 2026',
        metaDescription: 'Get your EV charger installed in Los Angeles, California. Average cost: $2,340. Find local installers, rebates, and incentives.',
        aiGeneratedIntro: `As Los Angeles joins the electric vehicle revolution, homeowners across California are discovering the convenience of charging at home. Whether you drive a Tesla, Chevrolet Bolt, Ford Mustang Mach-E, or any other electric vehicle, installing a Level 2 home charger is the smartest investment you can make for your EV ownership experience.

The typical installation cost in Los Angeles ranges around $2,340, covering both the charging equipment and professional installation. This one-time investment pays for itself through the convenience of never needing to visit public charging stations and the significant savings on fuel costs. With Los Angeles's electricity rate of $0.24 per kWh, you'll spend approximately $172.80 per month charging your vehicle at home, compared to $150-200 at public stations.

Residents of Los Angeles can access multiple rebate programs, including the California EVSE Rebate, which can reduce your installation costs by hundreds or even thousands of dollars. Our comprehensive guide will help you find qualified electricians in Los Angeles, understand local permit requirements, and maximize available incentives.`,
        aiGeneratedFaq: [
            {
                question: 'How much does it cost to install an EV charger in Los Angeles, CA?',
                answer: 'The average cost to install a Level 2 EV charger in Los Angeles is approximately $2,340. This includes the charging equipment ($400-$800) and professional installation by a licensed electrician ($600-$1,500). California has higher installation costs due to stricter building codes and higher labor rates.',
            },
            {
                question: 'What incentives and rebates are available in California for EV charger installation?',
                answer: 'California residents have access to several incentive programs. These include the California EVSE Rebate (up to $2,000) and the Federal EV Charger Tax Credit. Additionally, the federal Alternative Fuel Vehicle Refueling Property Credit offers up to $1,000 (30% of installation costs). These incentives can be combined, potentially saving you $2,000-$3,000.',
            },
        ],
        incentives: [mockIncentives[0], mockIncentives[1]],
    },
    // Add 18 more cities here for a total of 20
    {
        id: '3',
        name: 'Chicago',
        state: 'Illinois',
        stateAbbr: 'IL',
        slug: 'chicago-il',
        population: 2693976,
        electricityRate: 0.13,
        avgInstallCost: 1800,
        metaTitle: 'EV Charger Installation Chicago, IL | Cost & Rebates 2026',
        metaDescription: 'Get your EV charger installed in Chicago, Illinois. Average cost: $1,800. Find local installers, rebates, and incentives.',
        aiGeneratedIntro: `Planning to install an EV charger in Chicago, Illinois? You're making a smart choice for both your wallet and the environment. Home EV charging is the most convenient and economical way to keep your electric vehicle powered up and ready to go. In Chicago, the average installation cost is $1,800, which typically includes a Level 2 charging station (capable of adding 25-30 miles of range per hour) and professional installation by a licensed electrician.

Your home's electrical system will need to support the charger, usually requiring a dedicated 240-volt circuit similar to what powers your electric dryer or oven. Most Chicago homes can accommodate this without major electrical panel upgrades, though your electrician will assess your specific situation. At Chicago's current electricity rate of $0.13 per kWh, you'll enjoy significantly lower operating costs compared to gasoline vehicles.

Federal tax credits can help offset up to $1,000 of your installation costs. This guide covers everything from choosing the right charger to finding licensed installers in Chicago and navigating the permit process.`,
        aiGeneratedFaq: [
            {
                question: 'How much does it cost to install an EV charger in Chicago, IL?',
                answer: 'The average cost to install a Level 2 EV charger in Chicago is approximately $1,800. This includes the charging equipment ($400-$800) and professional installation by a licensed electrician ($600-$1,500). Most installations in Chicago are completed in 2-4 hours.',
            },
            {
                question: 'Do I need a permit to install an EV charger in Chicago?',
                answer: 'Yes, most EV charger installations in Chicago require an electrical permit from your local building department. This is a standard requirement across Illinois to ensure the installation meets electrical codes and safety standards. The good news is that your licensed electrician will typically handle the permit application process for you as part of their service. Permit fees in Chicago usually range from $50-$150.',
            },
        ],
        incentives: [mockIncentives[0]],
    },
];

// Helper function to get city by slug
export function getCityBySlug(slug: string): City | undefined {
    return mockCities.find(city => city.slug === slug);
}

// Helper function to get all cities
export function getAllCities(): City[] {
    return mockCities;
}
