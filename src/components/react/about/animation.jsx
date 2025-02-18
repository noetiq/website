import React from 'react'
import ParticleCircle from './ParticleCircle' // <-- import the new component

const BlackBallsLarge = () => {
  return (
    <div className="bg-gray-200 min-h-screen flex flex-col justify-center items-center relative overflow-hidden py-48">
      {/* First Founder (Left) */}
      <div className="flex justify-between items-center w-4/5 mb-72 relative">
        {/* Founder Text (Left Side) */}
        <div className="max-w-xs text-gray-800 text-2xl relative z-10">
          <h1 className="mb-2 text-3xl font-bold">Henry Wilcox</h1>
          <p>CEO & Founder</p>
        </div>
        {/* Particle Circle (Right, partially off-screen) */}
        <div className="absolute right-[-250px] top-1/2 transform -translate-y-1/2" style={{ width: 500, height: 500 }}>
          <ParticleCircle />
        </div>
      </div>

      {/* Second Founder (Right) */}
      <div className="flex items-center w-4/5 mb-72 relative">
        {/* Particle Circle (Left, partially off-screen) */}
        <div className="absolute left-[-250px] top-1/2 transform -translate-y-1/2" style={{ width: 500, height: 500 }}>
          <ParticleCircle />
        </div>
        {/* Founder Text (Right Side) */}
        <div className="max-w-xs ml-auto text-gray-800 text-2xl text-right relative z-10">
          <h1 className="mb-2 text-3xl font-bold">Patrick Black</h1>
          <p>CTO & Co-Founder</p>
        </div>
      </div>

      {/* Third Founder (Left, same as first) */}
      <div className="flex justify-between items-center w-4/5 mb-72 relative">
        {/* Founder Text (Left Side) */}
        <div className="max-w-xs text-gray-800 text-2xl relative z-10">
          <h1 className="mb-2 text-3xl font-bold">Noah Applebaum</h1>
          <p>COO & Co-Founder</p>
        </div>
        {/* Particle Circle (Right, partially off-screen) */}
        <div className="absolute right-[-250px] top-1/2 transform -translate-y-1/2" style={{ width: 500, height: 500 }}>
          <ParticleCircle />
        </div>
      </div>
    </div>
  )
}

export default BlackBallsLarge
