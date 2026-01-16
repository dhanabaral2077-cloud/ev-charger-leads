'use client';

import { useState } from 'react';

interface FAQ {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    faqs: FAQ[];
    cityName: string;
    state: string;
}

export default function FAQSection({ faqs, cityName, state }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    // Schema.org FAQ structured data
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
                        >
                            <span className="font-semibold text-gray-900 pr-4">
                                {faq.question}
                            </span>
                            <svg
                                className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''
                                    }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {openIndex === index && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
