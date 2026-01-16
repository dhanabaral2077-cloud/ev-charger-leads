import { getRealCityBySlug, getAllRealCities, type RealCityData } from '@/lib/real-data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import CostBreakdownTable from '@/components/CostBreakdownTable';
import FAQSection from '@/components/FAQSection';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate static params for all real cities
export async function generateStaticParams() {
    const cities = getAllRealCities();

    return cities.map((city: { slug: string }) => ({
        slug: city.slug,
    }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const city = getRealCityBySlug(slug);

    if (!city) {
        return {
            title: 'City Not Found',
        };
    }

    const title = `EV Charger Installation ${city.name}, ${city.stateAbbr} | ${city.utilityProvider} Customers Save $${city.totalRebates.toLocaleString()}`;
    const description = `Install an EV charger in ${city.name} with ${city.utilityProvider}. Get up to $${city.totalRebates.toLocaleString()} in rebates. Average cost: $${city.avgInstallCost.toLocaleString()}. Save $${city.monthlySavings}/month vs gas.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
        },
    };
}

export default async function CityPage({ params }: PageProps) {
    const { slug } = await params;
    const city = getRealCityBySlug(slug);

    if (!city) {
        notFound();
    }

    // Schema.org structured data
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `EV Charger Installation in ${city.name}, ${city.state}`,
        description: `Professional EV charger installation for ${city.utilityProvider} customers in ${city.name}`,
        areaServed: {
            '@type': 'City',
            name: city.name,
            containedInPlace: {
                '@type': 'State',
                name: city.state,
            },
        },
        offers: {
            '@type': 'Offer',
            price: (city.avgInstallCost - city.totalRebates).toString(),
            priceCurrency: 'USD',
        },
    };

    return (
        <>
            {/* Schema.org JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
            />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16">
                    <div className="max-w-6xl mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            EV Charger Installation in {city.name}, {city.stateAbbr}
                        </h1>
                        <p className="text-xl text-emerald-50 mb-2">
                            {city.utilityProvider} Customers
                        </p>
                        <p className="text-lg text-emerald-100 mb-8">
                            Get up to ${city.totalRebates.toLocaleString()} in rebates • Save ${city.monthlySavings}/month vs gas
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-3xl font-bold">${city.avgInstallCost.toLocaleString()}</div>
                                <div className="text-sm text-emerald-100">Avg. Installation</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-3xl font-bold">${city.totalRebates.toLocaleString()}</div>
                                <div className="text-sm text-emerald-100">Total Rebates</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-3xl font-bold">${city.electricityRate.toFixed(2)}</div>
                                <div className="text-sm text-emerald-100">Per kWh Rate</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-3xl font-bold">${city.monthlySavings}</div>
                                <div className="text-sm text-emerald-100">Monthly Savings</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Main Content Column */}
                        <div className="md:col-span-2 space-y-8">
                            {/* Real Data Introduction */}
                            <section className="bg-white rounded-xl shadow-sm p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    EV Charging in {city.name}: Real Data, Real Savings
                                </h2>
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Installing an EV charger at your {city.name} home has never been more affordable. As a <strong>{city.utilityProvider}</strong> customer, you'll pay just <strong>${city.electricityRate.toFixed(2)} per kWh</strong> to charge at home—significantly less than public charging stations.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        The average installation cost in {city.name} is <strong>${city.avgInstallCost.toLocaleString()}</strong>, which includes professional installation by a licensed electrician (averaging ${city.laborRate}/hour in {city.state}) and local permits (${city.permitCostMin}-${city.permitCostMax}).
                                    </p>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        However, {city.name} residents can access <strong>${city.totalRebates.toLocaleString()} in combined rebates</strong>:
                                    </p>
                                    <ul className="list-disc pl-6 mb-4 text-gray-700">
                                        <li>Federal Tax Credit: $1,000</li>
                                        {city.stateRebateName && (
                                            <li>{city.stateRebateName}: ${city.stateRebateAmount.toLocaleString()}</li>
                                        )}
                                        {city.utilityRebateName && (
                                            <li>{city.utilityRebateName}: ${city.utilityRebateAmount.toLocaleString()}</li>
                                        )}
                                    </ul>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        <strong>Your net cost: ${(city.avgInstallCost - city.totalRebates).toLocaleString()}</strong>
                                    </p>
                                </div>
                            </section>

                            {/* ROI Breakdown */}
                            <section className="bg-white rounded-xl shadow-sm p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    ROI: EV Charging vs. Gasoline in {city.name}
                                </h2>
                                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-6 mb-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <div className="text-sm text-gray-600 mb-1">EV Charging Cost (Full Charge)</div>
                                            <div className="text-3xl font-bold text-emerald-600">${city.evChargeCost}</div>
                                            <div className="text-xs text-gray-500 mt-1">75 kWh × ${city.electricityRate}/kWh</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600 mb-1">Gas Equivalent Cost</div>
                                            <div className="text-3xl font-bold text-red-600">${city.gasEquivalentCost}</div>
                                            <div className="text-xs text-gray-500 mt-1">15 gallons × $3.50/gallon</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                        <span className="font-semibold text-gray-700">Savings per charge:</span>
                                        <span className="text-2xl font-bold text-emerald-600">${city.savingsPerCharge}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                        <span className="font-semibold text-gray-700">Monthly savings (12 charges):</span>
                                        <span className="text-2xl font-bold text-emerald-600">${city.monthlySavings}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-emerald-100 rounded-lg border-2 border-emerald-300">
                                        <span className="font-bold text-gray-900">Annual savings:</span>
                                        <span className="text-3xl font-bold text-emerald-700">${city.annualSavings}</span>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 mt-4">
                                    * Based on Tesla Model Y (75 kWh battery), 12 charges/month, {city.utilityProvider} rate of ${city.electricityRate}/kWh
                                </p>
                            </section>

                            {/* Local Insights */}
                            <section className="bg-white rounded-xl shadow-sm p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Local Installation Details
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="border-l-4 border-emerald-500 pl-4">
                                        <div className="text-sm text-gray-600 mb-1">Electrician Labor Rate</div>
                                        <div className="text-2xl font-bold text-gray-900">${city.laborRate}/hour</div>
                                        <div className="text-xs text-gray-500 mt-1">Average in {city.state}</div>
                                    </div>
                                    <div className="border-l-4 border-blue-500 pl-4">
                                        <div className="text-sm text-gray-600 mb-1">Permit Cost Range</div>
                                        <div className="text-2xl font-bold text-gray-900">${city.permitCostMin}-${city.permitCostMax}</div>
                                        <div className="text-xs text-gray-500 mt-1">Typical in {city.name}</div>
                                    </div>
                                    <div className="border-l-4 border-purple-500 pl-4">
                                        <div className="text-sm text-gray-600 mb-1">Homes with Garages</div>
                                        <div className="text-2xl font-bold text-gray-900">{city.garageRate}%</div>
                                        <div className="text-xs text-gray-500 mt-1">Census data for {city.name}</div>
                                    </div>
                                    <div className="border-l-4 border-orange-500 pl-4">
                                        <div className="text-sm text-gray-600 mb-1">Utility Provider</div>
                                        <div className="text-lg font-bold text-gray-900">{city.utilityProvider}</div>
                                        <div className="text-xs text-gray-500 mt-1">Your local electric company</div>
                                    </div>
                                </div>
                            </section>

                            {/* Cost Breakdown */}
                            <section className="bg-white rounded-xl shadow-sm p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Complete Cost Breakdown
                                </h2>
                                <CostBreakdownTable
                                    avgInstallCost={city.avgInstallCost}
                                    electricityRate={city.electricityRate}
                                />
                            </section>
                        </div>

                        {/* Sidebar - Lead Capture */}
                        <div className="md:col-span-1">
                            <div className="sticky top-4">
                                <LeadCaptureForm
                                    cityId={city.id}
                                    cityName={city.name}
                                    state={city.state}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
