"use client";
import React from "react";

export default function MainCourseSelector({ dishes, mainCourse, setMainCourse }: any) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-6 text-[#4E0113]">Danie główne</h2>
      <div className="space-y-6 mb-12">
        {dishes.map((dish: any) => (
          <label
            key={dish.name}
            className={`flex items-center gap-6 border rounded-lg p-6 cursor-pointer transition ${
              mainCourse === dish.name
                ? "border-[#4E0113] bg-[#FAD6C8]/40 shadow-lg scale-[1.02]"
                : "border-gray-300 hover:shadow-md hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="mainCourse"
              value={dish.name}
              checked={mainCourse === dish.name}
              onChange={(e) => setMainCourse(e.target.value)}
              className="hidden"
            />
            {dish.img && <img src={dish.img} alt={dish.name} className="w-40 h-40 object-cover rounded-lg" />}
            <span className="text-[#4E0113] font-semibold text-xl">{dish.name}</span>
          </label>
        ))}
      </div>
    </>
  );
}
