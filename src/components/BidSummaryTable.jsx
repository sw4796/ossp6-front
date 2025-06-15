import React from 'react';

function BidSummaryTable({
  selectedSlots,
  bidValues,
  TIME_SLOTS,
  AVERAGE_BIDS,
}) {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {selectedSlots.map((slot) => {
        const bidValue = bidValues[slot] || 0;
        return (
          <tr key={slot}>
            <td className="px-4 py-3 whitespace-nowrap">{TIME_SLOTS[slot]}</td>
            <td className="px-4 py-3 whitespace-nowrap">
              ₩{bidValue.toLocaleString()}
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              ₩{AVERAGE_BIDS[slot].toLocaleString()}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}

export default BidSummaryTable;
