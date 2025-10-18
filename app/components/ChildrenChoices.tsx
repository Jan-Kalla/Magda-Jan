"use client";
import React from "react";

export default function ChildrenChoices({ children, dishes, childrenChoices, handleChildChoice }: any) {
  if (children.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6 text-[#4E0113]">Wybory dla dzieci</h2>
      {children.map((child: any) => (
        <div key={child.id} className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-[#4E0113]">
            {child.first_name} {child.last_name}
          </h3>
          <div className="space-y-4">
            {dishes.map((dish: any) => (
              <label
                key={dish.name}
                className={`flex items-center gap-6 border rounded-lg p-6 cursor-pointer transition ${
                  childrenChoices[child.id] === dish.name
                    ? "border-[#4E0113] bg-[#FAD6C8]/40 shadow-lg scale-[1.02]"
                    : "border-gray-300 hover:shadow-md hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name={`child-${child.id}`}
                  value={dish.name}
                  checked={childrenChoices[child.id] === dish.name}
                  onChange={() => handleChildChoice(child.id, dish.name)}
                  className="hidden"
                />
                {dish.img && <img src={dish.img} alt={dish.name} className="w-24 h-24 object-cover rounded-lg" />}
                <span className="text-[#4E0113] font-medium">{dish.name}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
