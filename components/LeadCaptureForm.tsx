'use client';

import { useState } from 'react';

interface LeadCaptureFormProps {
    cityId: string;
    cityName: string;
    state: string;
}

export default function LeadCaptureForm({ cityId, cityName, state }: LeadCaptureFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        propertyType: 'single-family',
        evModel: '',
        timeline: 'immediate',
        hasGarage: true,
        zipCode: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    cityId,
                }),
            });

            if (response.ok) {
                setSubmitted(true);
            }
        } catch (error) {
            console.error('Error submitting lead:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-8 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-emerald-900 mb-2">
                    Thank You!
                </h3>
                <p className="text-emerald-700">
                    We'll connect you with up to 3 licensed electricians in {cityName} within 24 hours.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-emerald-500">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Get Free Quotes
                </h3>
                <p className="text-gray-600">
                    Connect with licensed electricians in {cityName}, {state}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                    </label>
                    <input
                        type="email"
                        id="email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>

                <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Zip Code *
                    </label>
                    <input
                        type="text"
                        id="zipCode"
                        required
                        pattern="[0-9]{5}"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    />
                </div>

                <div>
                    <label htmlFor="evModel" className="block text-sm font-medium text-gray-700 mb-1">
                        EV Model (Optional)
                    </label>
                    <input
                        type="text"
                        id="evModel"
                        placeholder="e.g., Tesla Model 3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        value={formData.evModel}
                        onChange={(e) => setFormData({ ...formData, evModel: e.target.value })}
                    />
                </div>

                <div>
                    <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-1">
                        Installation Timeline *
                    </label>
                    <select
                        id="timeline"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    >
                        <option value="immediate">ASAP</option>
                        <option value="1-3 months">1-3 Months</option>
                        <option value="3-6 months">3-6 Months</option>
                        <option value="planning">Just Planning</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting...' : 'Get Free Quotes'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                    By submitting, you agree to be contacted by local electricians
                </p>
            </form>
        </div>
    );
}
