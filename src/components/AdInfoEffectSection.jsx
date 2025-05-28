import React from "react";

function AdInfoEffectSection({ data }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">광고 효과 분석</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((item, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-500">{item.label}</div>
              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${item.iconBg}`}>
                <i className={`${item.icon} ${item.iconColor}`}></i>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{item.value}</div>
            <div className="mt-2 text-xs text-gray-500">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdInfoEffectSection;
