import { getAllRealCities, type RealCityData } from '@/lib/real-data';
import Link from 'next/link';

export default function HomePage() {
  // Get all real cities
  const topCities = getAllRealCities();

  // Group cities by state
  type CityData = typeof topCities[number];
  const citiesByState = topCities.reduce((acc: Record<string, CityData[]>, city: CityData) => {
    if (!acc[city.stateAbbr]) {
      acc[city.stateAbbr] = [];
    }
    acc[city.stateAbbr].push(city);
    return acc;
  }, {} as Record<string, CityData[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Find EV Charger Installers Near You
          </h1>
          <p className="text-xl md:text-2xl text-emerald-50 mb-8 max-w-3xl mx-auto">
            Get free quotes from licensed electricians in your city. Compare costs, find rebates, and install your home EV charger today.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Real Data, Real Savings</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl mb-2">⚡</div>
                <div className="font-semibold">Actual Utility Rates</div>
                <div className="text-sm text-emerald-100">From your local provider</div>
              </div>
              <div>
                <div className="text-4xl mb-2">💰</div>
                <div className="font-semibold">Specific Rebates</div>
                <div className="text-sm text-emerald-100">Up to $3,500 available</div>
              </div>
              <div>
                <div className="text-4xl mb-2">📊</div>
                <div className="font-semibold">ROI Calculations</div>
                <div className="text-sm text-emerald-100">See exact monthly savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search by City */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Top 10 Cities with Real Data
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Actual utility providers, specific rebate amounts, and ROI calculations
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(Object.entries(citiesByState) as [string, CityData[]][])
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([state, cities]) => (
              <div key={state} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  {cities[0].state}
                </h3>
                <ul className="space-y-3">
                  {cities.map((city) => (
                    <li key={city.slug}>
                      <Link
                        href={`/${city.slug}`}
                        className="block hover:bg-emerald-50 -mx-2 px-2 py-2 rounded transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-emerald-600 hover:text-emerald-700 font-medium">
                              {city.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {city.utilityProvider}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">
                              ${city.avgInstallCost.toLocaleString()}
                            </div>
                            <div className="text-xs text-emerald-600">
                              ${city.totalRebates.toLocaleString()} rebates
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">1️⃣</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Tell Us Your Needs
              </h3>
              <p className="text-gray-600">
                Fill out a simple form with your location, EV model, and timeline
              </p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">2️⃣</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Get Free Quotes
              </h3>
              <p className="text-gray-600">
                Receive up to 3 quotes from licensed electricians in your area
              </p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">3️⃣</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Choose & Install
              </h3>
              <p className="text-gray-600">
                Compare quotes, choose your installer, and get your charger installed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 EV Charger Leads. Connecting homeowners with licensed electricians nationwide.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Real data from official sources: EIA, DSIRE, Census Bureau, BLS
          </p>
        </div>
      </footer>
    </div>
  );
}
