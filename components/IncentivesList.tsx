interface Incentive {
    id: string;
    name: string;
    description: string;
    amount: number | null;
    percentage: number | null;
    type: string;
    provider: string;
    eligibility: string;
    applicationUrl: string | null;
}

interface IncentivesListProps {
    incentives: Incentive[];
}

export default function IncentivesList({ incentives }: IncentivesListProps) {
    const getIncentiveIcon = (type: string) => {
        switch (type) {
            case 'federal':
                return '🇺🇸';
            case 'state':
                return '🏛️';
            case 'utility':
                return '⚡';
            case 'local':
                return '🏘️';
            default:
                return '💰';
        }
    };

    const getIncentiveColor = (type: string) => {
        switch (type) {
            case 'federal':
                return 'bg-blue-50 border-blue-200';
            case 'state':
                return 'bg-purple-50 border-purple-200';
            case 'utility':
                return 'bg-amber-50 border-amber-200';
            case 'local':
                return 'bg-green-50 border-green-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const formatAmount = (incentive: Incentive) => {
        if (incentive.amount) {
            return `Up to $${incentive.amount.toLocaleString()}`;
        } else if (incentive.percentage) {
            return `${incentive.percentage}% off`;
        }
        return 'Varies';
    };

    return (
        <div className="space-y-4">
            {incentives.map((incentive) => (
                <div
                    key={incentive.id}
                    className={`border rounded-lg p-6 ${getIncentiveColor(incentive.type)}`}
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{getIncentiveIcon(incentive.type)}</span>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">
                                    {incentive.name}
                                </h3>
                                <p className="text-sm text-gray-600 capitalize">
                                    {incentive.type} • {incentive.provider}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-600">
                                {formatAmount(incentive)}
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-700 mb-3">{incentive.description}</p>

                    {incentive.eligibility && (
                        <div className="bg-white/50 rounded p-3 mb-3">
                            <p className="text-sm text-gray-600">
                                <strong>Eligibility:</strong> {incentive.eligibility}
                            </p>
                        </div>
                    )}

                    {incentive.applicationUrl && (
                        <a
                            href={incentive.applicationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                        >
                            Learn More & Apply
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </a>
                    )}
                </div>
            ))}

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-lg p-6">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-2xl">💡</span>
                    Stack Your Savings
                </h4>
                <p className="text-gray-700">
                    Many of these incentives can be combined! For example, you could claim the federal tax credit
                    AND a state rebate AND a utility incentive, potentially saving thousands on your installation.
                </p>
            </div>
        </div>
    );
}
