import { getAllCities, type City } from '@/lib/mock-data';
import Link from 'next/link';

export default function HomePage() {
  // Get all mock cities
  const topCities = getAllCities();

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
            <h2 className="text-2xl font-bold mb-4">Why Install a Home Charger?</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl mb-2">⚡</div>
                <div className="font-semibold">Faster Charging</div>
                <div className="text-sm text-emerald-100">Full charge overnight</div>
              </div>
              <div>
                <div className="text-4xl mb-2">💰</div>
                <div className="font-semibold">Save Money</div>
                <div className="text-sm text-emerald-100">50-70% cheaper than public</div>
              </div>
              <div>
                <div className="text-4xl mb-2">🏠</div>
                <div className="font-semibold">Convenience</div>
                <div className="text-sm text-emerald-100">Charge while you sleep</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search by City */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Find Installers in Your City
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(Object.entries(citiesByState) as [string, CityData[]][])
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([state, cities]) => (
              <div key={state} className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  {cities[0].state}
                </h3>
                <ul className="space-y-2">
                  {cities.map((city) => (
                    <li key={city.slug}>
                      <Link
                        href={`/${city.slug}`}
                        className="text-emerald-600 hover:text-emerald-700 hover:underline flex justify-between items-center"
                      >
                        <span>{city.name}</span>
                        <span className="text-sm text-gray-500">
                          ${city.avgInstallCost.toLocaleString()}
                        </span>
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
            Demo version with sample data
          </p>
        </div>
      </footer>
    </div>
  );
}
