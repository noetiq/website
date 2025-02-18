import React, { useRef, useEffect, useState } from 'react'

function ParticleCircle() {
  const canvasRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  // Store current mouse position
  const mousePosRef = useRef(null)
  // Store previous mouse position (to compute cursor velocity)
  const mousePrevRef = useRef(null)
  // Each particle now stores its original position, current position, velocity, and a random factor
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const width = 500
    const height = 500
    canvas.width = width
    canvas.height = height

    // 1) Draw a full black circle
    ctx.fillStyle = 'black'
    ctx.beginPath()
    ctx.arc(width / 2, height / 2, width / 2, 0, 2 * Math.PI)
    ctx.fill()

    // 2) Grab the pixel data
    const imageData = ctx.getImageData(0, 0, width, height)
    const { data } = imageData

    // 3) Convert each (x, y) pixel to a “particle”
    // We step by a few pixels for performance.
    particlesRef.current = []
    const step = 4
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const alpha = data[(y * width + x) * 4 + 3] // A channel
        // If alpha > 0, that pixel is inside the black circle
        if (alpha > 0) {
          particlesRef.current.push({
            ox: x, // original x
            oy: y, // original y
            x, // current x
            y, // current y
            vx: 0, // x velocity
            vy: 0, // y velocity
            // a random factor to introduce slight variations per particle
            factor: 0.8 + Math.random() * 0.4,
          })
        }
      }
    }

    // 4) Clear the canvas to prepare for animation
    ctx.clearRect(0, 0, width, height)

    // 5) Animate
    let animationFrameId

    // Simulation constants
    const repulsionRadius = 30 // pixels: area around cursor that affects particles
    const repulsionStrength = 1.0 // base strength for repulsion force
    const springFactor = 0.05 // how strongly particles pull back to their original positions
    const friction = 0.9 // velocity damping factor

    function animate() {
      ctx.clearRect(0, 0, width, height)

      // Compute cursor velocity if hovered
      let cursorVX = 0,
        cursorVY = 0,
        cursorSpeed = 0
      if (hovered && mousePosRef.current) {
        if (mousePrevRef.current) {
          cursorVX = mousePosRef.current.x - mousePrevRef.current.x
          cursorVY = mousePosRef.current.y - mousePrevRef.current.y
          cursorSpeed = Math.sqrt(cursorVX * cursorVX + cursorVY * cursorVY)
        }
        // Update previous mouse position (make a shallow copy)
        mousePrevRef.current = { ...mousePosRef.current }
      } else {
        // Reset previous mouse when not hovering so that a sudden jump doesn't occur later.
        mousePrevRef.current = null
      }

      // Update and draw each particle
      particlesRef.current.forEach((particle) => {
        // If hovered and mouse position exists, apply a repulsion force
        if (hovered && mousePosRef.current) {
          const dx = particle.x - mousePosRef.current.x
          const dy = particle.y - mousePosRef.current.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < repulsionRadius && distance > 0) {
            // The force increases as the particle gets closer to the cursor.
            const force = ((repulsionRadius - distance) / repulsionRadius) * repulsionStrength
            // Incorporate cursor speed so that fast movements push particles further.
            const scaledForce = force * cursorSpeed * particle.factor
            // Normalize the direction and add force to the velocity.
            particle.vx += (dx / distance) * scaledForce
            particle.vy += (dy / distance) * scaledForce
          }
        }
        // Apply a spring force to pull the particle back to its original position
        particle.vx += (particle.ox - particle.x) * springFactor
        particle.vy += (particle.oy - particle.y) * springFactor

        // Apply friction to slow down over time
        particle.vx *= friction
        particle.vy *= friction

        // Update particle position
        particle.x += particle.vx
        particle.y += particle.vy

        // Draw the particle (keeping the original size and color)
        ctx.fillStyle = 'black'
        ctx.fillRect(particle.x, particle.y, step, step)
      })

      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    // Cleanup on unmount
    return () => cancelAnimationFrame(animationFrameId)
  }, [hovered])

  // Update the mouse position relative to the canvas
  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    mousePosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      style={{ width: '500px', height: '500px', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        mousePosRef.current = null
        mousePrevRef.current = null
      }}
      onMouseMove={handleMouseMove}
    />
  )
}

export default ParticleCircle
