import React from 'react';

function BidSummaryTable({
  selectedSlots,
  bidValues,
  TIME_SLOTS,
  AVERAGE_BIDS,
  COMPETITION,
}) {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {selectedSlots.map((slot) => {
        const bidValue = bidValues[slot] || 0;
        let compColor = '';
        if (COMPETITION[slot] === '매우 높음') compColor = 'text-red-600';
        else if (COMPETITION[slot] === '높음') compColor = 'text-orange-500';
        else if (COMPETITION[slot] === '보통') compColor = 'text-yellow-600';
        else if (COMPETITION[slot] === '낮음') compColor = 'text-green-600';
        else if (COMPETITION[slot] === '매우 낮음')
          compColor = 'text-green-700';
        return (
          <tr key={slot}>
            <td className="px-4 py-3 whitespace-nowrap">{TIME_SLOTS[slot]}</td>
            <td className="px-4 py-3 whitespace-nowrap">
              ₩{bidValue.toLocaleString()}
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              ₩{AVERAGE_BIDS[slot].toLocaleString()}
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              <span className={`${compColor} font-medium`}>
                {COMPETITION[slot]}
              </span>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}

export default BidSummaryTable;
