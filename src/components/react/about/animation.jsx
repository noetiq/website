import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TransformingBallEnhanced = () => {
  // References for the ball container, founder text, and individual polygon tiles.
  const ballRef = useRef(null)
  const founderRef = useRef(null)
  const tileRefs = useRef([])

  // Always reset the tileRefs array on each render.
  tileRefs.current = []

  // Helper to add a tile’s reference.
  const addTileRef = (el) => {
    if (el && !tileRefs.current.includes(el)) {
      tileRefs.current.push(el)
    }
  }

  // Define several polygon shapes for variety.
  const clipPaths = [
    'polygon(0% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%, 0% 15%)',
    'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)',
    'polygon(10% 0%, 100% 10%, 90% 100%, 0% 90%)',
    'polygon(0% 10%, 90% 0%, 100% 90%, 10% 100%)',
  ]

  // Create an array of 100 tiles (10×10 grid).
  const numTiles = 100
  const tiles = Array.from({ length: numTiles }, (_, index) => ({
    id: index,
    clipPath: clipPaths[Math.floor(Math.random() * clipPaths.length)],
  }))

  useEffect(() => {
    // For a 10×10 grid, we define “outer” tiles as those in the first/last row or first/last column.
    const outerTiles = tileRefs.current.filter((tile, i) => {
      const row = Math.floor(i / 10)
      const col = i % 10
      return row === 0 || row === 9 || col === 0 || col === 9
    })
    const innerTiles = tileRefs.current.filter((tile, i) => {
      const row = Math.floor(i / 10)
      const col = i % 10
      return row > 0 && row < 9 && col > 0 && col < 9
    })

    // Create a GSAP timeline linked to scroll progress.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ballRef.current,
        start: 'top center', // when the ball is well in view (adjust as needed)
        end: 'bottom center',
        scrub: true,
      },
    })

    // STEP 1: Remove the circular clip-path so that the tightly packed pieces become individually visible.
    tl.to(ballRef.current, {
      clipPath: 'none',
      duration: 0.1,
      ease: 'power1.inOut',
    })

    // STEP 2: Gentle initial detachment – animate only the outer tiles.
    tl.to(
      outerTiles,
      {
        x: () => gsap.utils.random(-10, -15),
        y: () => gsap.utils.random(5, 10),
        rotation: () => gsap.utils.random(-3, 3),
        duration: 0.3,
        stagger: { amount: 0.2 },
        ease: 'power2.out',
      },
      '+=0.05'
    )

    // STEP 3: Full migration – now all tiles (outer and inner) fly diagonally down-left.
    tl.to(
      tileRefs.current,
      {
        x: () => gsap.utils.random(-250, -350),
        y: () => gsap.utils.random(150, 250),
        rotation: () => gsap.utils.random(-20, 20),
        duration: 0.7,
        stagger: { amount: 0.3 },
        ease: 'power2.inOut',
      },
      '+=0.1'
    )

    // STEP 4: Founder text fades out and drifts upward as the polygon flight intensifies.
    tl.to(
      founderRef.current,
      {
        opacity: 0,
        y: -30,
        duration: 0.7,
        ease: 'power2.inOut',
      },
      '-=0.7' // Start fading concurrently with the full migration
    )

    // Once the scroll-triggered animation is complete, start a gentle, looping oscillation for the cluster.
    tl.eventCallback('onComplete', () => {
      tileRefs.current.forEach((tile) => {
        gsap.to(tile, {
          // These relative shifts create a subtle “jostling” effect.
          x: '+= ' + gsap.utils.random(-5, 5),
          y: '+= ' + gsap.utils.random(-5, 5),
          rotation: gsap.utils.random(-5, 5),
          duration: gsap.utils.random(2, 4),
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        })
      })
    })
  }, [])

  return (
    <div style={{ height: '300vh', position: 'relative', background: '#eaeaea' }}>
      {/* Founder Text: Fixed on the left at roughly one-third down from the top. */}
      <div
        ref={founderRef}
        style={{
          position: 'fixed',
          top: '33%',
          left: '5%',
          maxWidth: '300px',
          color: '#333',
          zIndex: 10,
          opacity: 1,
        }}
      >
        <h1 style={{ margin: '0 0 10px' }}>Founder Name</h1>
        <p style={{ margin: 0 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.
        </p>
      </div>

      {/* Ball of Polygons: Fixed on the right in line with the founder text.
          Initially clipped to a circle so that the pieces appear as a solid ball. */}
      <div
        ref={ballRef}
        style={{
          position: 'fixed',
          top: '33%',
          right: '5%',
          width: '300px',
          height: '300px',
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 1fr)',
          gridTemplateRows: 'repeat(10, 1fr)',
          clipPath: 'circle(50% at 50% 50%)',
        }}
      >
        {tiles.map((tile) => (
          <div
            key={tile.id}
            ref={addTileRef}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#000',
              clipPath: tile.clipPath,
              transition: 'filter 0.3s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, { filter: 'brightness(1.4)', duration: 0.2 })
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { filter: 'brightness(1)', duration: 0.2 })
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default TransformingBallEnhanced
