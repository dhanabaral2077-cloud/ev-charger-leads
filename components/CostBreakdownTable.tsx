interface CostBreakdownTableProps {
    avgInstallCost: number;
    electricityRate: number;
}

export default function CostBreakdownTable({ avgInstallCost, electricityRate }: CostBreakdownTableProps) {
    const equipmentCost = Math.round(avgInstallCost * 0.4);
    const laborCost = Math.round(avgInstallCost * 0.6);
    const monthlyChargingCost = (electricityRate * 60 * 12).toFixed(2);
    const yearlyChargingCost = (electricityRate * 60 * 12 * 12).toFixed(2);

    return (
        <div className="space-y-6">
            {/* Installation Costs */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                Installation Cost Breakdown
                            </th>
                            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                                Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        <tr>
                            <td className="px-6 py-4 text-sm text-gray-700">
                                Level 2 Charger Equipment
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                                ${equipmentCost.toLocaleString()}
                            </td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 text-sm text-gray-700">
                                Professional Installation & Labor
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                                ${laborCost.toLocaleString()}
                            </td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 text-sm text-gray-700">
                                Permits & Inspection
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                                $150 - $300
                            </td>
                        </tr>
                        <tr className="bg-emerald-50">
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                Total Average Cost
                            </td>
                            <td className="px-6 py-4 text-lg font-bold text-emerald-600 text-right">
                                ${avgInstallCost.toLocaleString()}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Operating Costs */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                Charging Costs (60 kWh Battery)
                            </th>
                            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                                Cost
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        <tr>
                            <td className="px-6 py-4 text-sm text-gray-700">
                                Per Full Charge
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                                ${(electricityRate * 60).toFixed(2)}
                            </td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 text-sm text-gray-700">
                                Monthly (12 charges)
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                                ${monthlyChargingCost}
                            </td>
                        </tr>
                        <tr className="bg-blue-50">
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                Yearly Charging Cost
                            </td>
                            <td className="px-6 py-4 text-lg font-bold text-blue-600 text-right">
                                ${yearlyChargingCost}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                    <strong>💡 Savings Tip:</strong> Charging at home is typically 50-70% cheaper than public charging stations.
                    With gas prices averaging $3.50/gallon, you could save over $1,500/year on fuel costs.
                </p>
            </div>
        </div>
    );
}
