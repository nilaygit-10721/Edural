import React from "react";

const GameCard = ({
  title = "Gravity Voyager",
  minutes = 5,
  grade = "Grade 8",
  tag = "Physics",
  cta = "Start Game",
  image = "/images/space.jpg", // default image
  description = "Learn About Gravitational Forces and how it works", // default description
}) => {
  return (
    <div className="w-72 transform transition duration-300 hover:scale-105 hover:shadow-xl bg-white rounded-lg shadow-md overflow-hidden">
      <div
        className="h-36 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <span className="rounded-full bg-green-700 text-xs text-white px-2 py-1">
            {grade}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-gray-500">
            {minutes} mins • {tag}
          </div>
          <button className="bg-green-600 text-white px-3 py-1.5 rounded-md cursor-pointer">
            {cta}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
