import { getCityBySlug, getAllCities, type City } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import CostBreakdownTable from '@/components/CostBreakdownTable';
import FAQSection from '@/components/FAQSection';
import IncentivesList from '@/components/IncentivesList';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate static params for all mock cities
export async function generateStaticParams() {
    const cities = getAllCities();

    return cities.map((city: { slug: string }) => ({
        slug: city.slug,
    }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const city = getCityBySlug(slug);

    if (!city) {
        return {
            title: 'City Not Found',
        };
    }

    return {
        title: city.metaTitle,
        description: city.metaDescription,
        openGraph: {
            title: city.metaTitle,
            description: city.metaDescription,
            type: 'website',
        },
    };
}

export default async function CityPage({ params }: PageProps) {
    const { slug } = await params;
    const city = getCityBySlug(slug);

    if (!city) {
        notFound();
    }

    // Calculate monthly charging cost
    const monthlyChargingCost = (city.electricityRate * 60 * 12).toFixed(2);

    // Schema.org structured data
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `EV Charger Installation in ${city.name}, ${city.state}`,
        description: city.metaDescription,
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
            price: city.avgInstallCost.toString(),
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
                        <p className="text-xl text-emerald-50 mb-8">
                            Get 3 free quotes from licensed electricians in {city.name}
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-3xl font-bold">${city.avgInstallCost.toLocaleString()}</div>
                                <div className="text-sm text-emerald-100">Avg. Installation Cost</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-3xl font-bold">${city.electricityRate.toFixed(2)}</div>
                                <div className="text-sm text-emerald-100">Per kWh</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-3xl font-bold">${monthlyChargingCost}</div>
                                <div className="text-sm text-emerald-100">Monthly Charging</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-3xl font-bold">{city.incentives.length}</div>
                                <div className="text-sm text-emerald-100">Available Rebates</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Main Content Column */}
                        <div className="md:col-span-2 space-y-8">
                            {/* AI-Generated Introduction */}
                            <section className="bg-white rounded-xl shadow-sm p-8">
                                <div className="prose prose-lg max-w-none">
                                    {city.aiGeneratedIntro.split('\n\n').map((paragraph: string, idx: number) => (
                                        <p key={idx} className="text-gray-700 leading-relaxed mb-4">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </section>

                            {/* Cost Breakdown */}
                            <section className="bg-white rounded-xl shadow-sm p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Cost Breakdown for {city.name}
                                </h2>
                                <CostBreakdownTable
                                    avgInstallCost={city.avgInstallCost}
                                    electricityRate={city.electricityRate}
                                />
                            </section>

                            {/* Incentives */}
                            {city.incentives.length > 0 && (
                                <section className="bg-white rounded-xl shadow-sm p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                        Available Rebates & Incentives in {city.state}
                                    </h2>
                                    <IncentivesList incentives={city.incentives as any} />
                                </section>
                            )}

                            {/* FAQ Section */}
                            <section className="bg-white rounded-xl shadow-sm p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Frequently Asked Questions
                                </h2>
                                <FAQSection
                                    faqs={city.aiGeneratedFaq}
                                    cityName={city.name}
                                    state={city.state}
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
