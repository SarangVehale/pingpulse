"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, OrbitControls } from "@react-three/drei"
import { Points, PointMaterial } from "@react-three/drei"
import * as random from "maath/random"
import { Color } from "three"

function Stars() {
  const ref = useRef<any>()
  const sphere = random.inSphere(new Float32Array(5000), { radius: 1.5 })

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10
    ref.current.rotation.y -= delta / 15
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#ffffff" size={0.002} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  )
}

function GlobeMesh() {
  const meshRef = useRef<any>()

  useFrame((state) => {
    meshRef.current.rotation.y += 0.001
  })

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]}>
      <meshPhongMaterial
        color={new Color("#4338ca")}
        emissive={new Color("#312e81")}
        specular={new Color("#818cf8")}
        shininess={20}
        transparent
        opacity={0.8}
        wireframe
      />
    </Sphere>
  )
}

export function Globe() {
  return (
    <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} />
      <GlobeMesh />
      <Stars />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  )
}

