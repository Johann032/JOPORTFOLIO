"use client"

import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber"
import { useGLTF, AdaptiveDpr, AdaptiveEvents, Html } from "@react-three/drei"
import { Suspense, useRef, useEffect, Component, ReactNode, useMemo, useState } from "react"
import * as THREE from "three"
import { ChimeraModal } from "./chimera-modal"

class ModelErrorBoundary extends Component<{ fallback: ReactNode, children: ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback: ReactNode, children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

function ChimeraModel({ url, onModalOpen }: { url: string, onModalOpen: () => void }) {
  const { scene } = useGLTF(url)
  const group = useRef<THREE.Group>(null)
  const eyeMaterial = useRef<THREE.MeshStandardMaterial | null>(null)
  
  const hudLeftRef = useRef<HTMLDivElement>(null)
  const marker1Ref = useRef<HTMLDivElement>(null)
  const marker2Ref = useRef<HTMLDivElement>(null)
  const marker3Ref = useRef<HTMLDivElement>(null)
  
  const [systemState, setSystemState] = useState("SYSTEM ACTIVE")
  
  useEffect(() => {
    const states = ["SCANNING...", "ANALYSIS COMPLETE", "SYSTEM ACTIVE", "SYSTEM ACTIVE"]
    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % states.length
      setSystemState(states[i])
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const pointer = useRef({ x: 0, y: 0 })
  const lastPointerTime = useRef(0)
  const touchStart = useRef({ x: 0, y: 0 })
  const currentRotation = useRef({ x: 0, y: 0 })
  
  const intersectionPoint = useRef(new THREE.Vector3())
  const isHovering = useRef(false)
  const hoverStartTime = useRef(0)
  const lockTriggered = useRef(false)
  const nextLockTime = useRef(0)
  
  const reticleRef = useRef<HTMLDivElement>(null)
  const lockRef = useRef<HTMLDivElement>(null)
  const trailMeshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  const trailCount = 5
  const trailData = useRef(Array.from({ length: trailCount }, () => ({
    pos: new THREE.Vector3(),
    time: 0
  })))
  const trailIndex = useRef(0)
  
  const { size } = useThree()
  const isMobile = size.width < 768
  const isTablet = size.width >= 768 && size.width < 1024
  
  const aspect = size.width / size.height
  const baseScale = isMobile ? Math.max(0.45, aspect * 1.1) : isTablet ? 0.75 : 0.95
  const xOffset = isMobile ? 0.0 : isTablet ? 0.4 : 0.8
  const yOffset = isMobile ? -0.15 : isTablet ? -0.05 : 0.0

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const shaderUniforms = useMemo(() => ({
    uPointerPos: { value: new THREE.Vector3(0, 0, 0) },
    uHoverState: { value: 0.0 }
  }), [])

  const wireframeScene = useMemo(() => {
    if (!scene) return null
    const clone = scene.clone()
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const name = child.name.toLowerCase()
        if (name.includes("base") || name.includes("pedestal") || name.includes("cube") || name.includes("box")) {
          child.visible = false
        } else {
          const mat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0xcc0000),
            wireframe: true,
            transparent: true,
            depthWrite: false,
          })
          
          mat.onBeforeCompile = (shader) => {
            shader.uniforms.uPointerPos = shaderUniforms.uPointerPos
            shader.uniforms.uHoverState = shaderUniforms.uHoverState
            
            shader.vertexShader = `
              varying vec3 vWorldPosition;
              ${shader.vertexShader}
            `.replace(
              `#include <worldpos_vertex>`,
              `#include <worldpos_vertex>
               vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;`
            )
            
            shader.fragmentShader = `
              uniform vec3 uPointerPos;
              uniform float uHoverState;
              varying vec3 vWorldPosition;
              ${shader.fragmentShader}
            `.replace(
              `vec4 diffuseColor = vec4( diffuse, opacity );`,
              `
              float dist = distance(vWorldPosition, uPointerPos);
              // Broader, softer radius of ~0.9 world units. Opacity peaks at 0.5.
              float scanAlpha = smoothstep(0.9, 0.0, dist) * 0.5 * uHoverState;
              vec4 diffuseColor = vec4( diffuse, scanAlpha );
              `
            )
          }
          child.material = mat
        }
      }
    })
    return clone
  }, [scene, shaderUniforms])

  useEffect(() => {
    if (prefersReducedMotion) return
    const handleMouseMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1
      lastPointerTime.current = Date.now()
    }
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStart.current.x = e.touches[0].clientX
        touchStart.current.y = e.touches[0].clientY
        currentRotation.current.x = pointer.current.x
        currentRotation.current.y = pointer.current.y
      }
    }
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const dx = e.touches[0].clientX - touchStart.current.x
        const dy = e.touches[0].clientY - touchStart.current.y
        pointer.current.x = currentRotation.current.x + (dx / window.innerWidth) * 3
        pointer.current.y = currentRotation.current.y - (dy / window.innerHeight) * 3
        lastPointerTime.current = Date.now()
      }
    }
    const handlePointerLeave = () => { lastPointerTime.current = 0 }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchmove", handleTouchMove, { passive: true })
    window.addEventListener("mouseleave", handlePointerLeave)
    window.addEventListener("touchend", handlePointerLeave)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("mouseleave", handlePointerLeave)
      window.removeEventListener("touchend", handlePointerLeave)
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const name = child.name.toLowerCase()
          if (!(name.includes("base") || name.includes("pedestal") || name.includes("cube") || name.includes("box"))) {
            if (child.material) {
              const materials = Array.isArray(child.material) ? child.material : [child.material]
              materials.forEach((mat) => {
                const stdMat = mat as THREE.MeshStandardMaterial
                if (stdMat.name === "Material.001") {
                  stdMat.toneMapped = false
                  eyeMaterial.current = stdMat
                }
              })
            }
          }
        }
      })
    }
  }, [scene])

  const hoverTimeout = useRef<NodeJS.Timeout | null>(null)

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (prefersReducedMotion) return
    e.stopPropagation()
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    isHovering.current = true
    hoverStartTime.current = Date.now()
    lockTriggered.current = false
    intersectionPoint.current.copy(e.point)
    if (reticleRef.current) reticleRef.current.style.opacity = "1"
    document.body.style.cursor = "pointer"
  }

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (prefersReducedMotion) return
    e.stopPropagation()
    intersectionPoint.current.copy(e.point)
    const idx = trailIndex.current
    trailData.current[idx].pos.copy(e.point)
    trailData.current[idx].time = Date.now()
    trailIndex.current = (idx + 1) % trailCount
  }

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    if (prefersReducedMotion) return
    e.stopPropagation()
    hoverTimeout.current = setTimeout(() => {
      isHovering.current = false
      lockTriggered.current = false
      if (reticleRef.current) reticleRef.current.style.opacity = "0"
      if (lockRef.current) lockRef.current.style.opacity = "0"
      document.body.style.cursor = "auto"
    }, 150)
  }

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (prefersReducedMotion) return
    e.stopPropagation()
    onModalOpen()
  }

  useFrame((state, delta) => {
    if (!group.current) return
    const now = Date.now()
    let finalTargetX = 0
    let finalTargetY = 0
    if (!prefersReducedMotion && lastPointerTime.current > 0) {
      if (now - lastPointerTime.current < 1500) {
        finalTargetY = pointer.current.x * 0.12
        finalTargetX = -pointer.current.y * 0.06
      }
    }
    let idleRotY = 0
    let idleRotX = 0
    let idlePosY = 0
    // Removed idle wobble completely so model faces completely straight front
    const clampedTargetY = Math.max(-0.14, Math.min(0.14, finalTargetY))
    const clampedTargetX = Math.max(-0.08, Math.min(0.08, finalTargetX))
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, clampedTargetY + idleRotY, 4, delta)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, clampedTargetX + idleRotX, 4, delta)
    if (!prefersReducedMotion) {
      shaderUniforms.uPointerPos.value.lerp(intersectionPoint.current, 0.2)
      const targetHover = isHovering.current ? 1.0 : 0.0
      shaderUniforms.uHoverState.value = THREE.MathUtils.lerp(shaderUniforms.uHoverState.value, targetHover, 0.1)
    }
    if (isHovering.current && !prefersReducedMotion) {
      if (!lockTriggered.current && now > nextLockTime.current && now - hoverStartTime.current > 1000) {
        lockTriggered.current = true
        if (lockRef.current) {
          lockRef.current.style.opacity = "1"
          lockRef.current.style.transform = "translateX(4px)"
        }
        setTimeout(() => {
          if (lockRef.current) {
            lockRef.current.style.opacity = "0"
            lockRef.current.style.transform = "translateX(-4px)"
          }
        }, 800)
        nextLockTime.current = now + 6000
      }
    } else {
      hoverStartTime.current = now
    }
    if (trailMeshRef.current && !prefersReducedMotion) {
      for (let i = 0; i < trailCount; i++) {
        const tData = trailData.current[i]
        const age = now - tData.time
        if (age < 300 && isHovering.current) {
          const scale = Math.max(0, 1 - age / 300) * 0.015
          dummy.position.copy(tData.pos)
          dummy.scale.set(scale, scale, scale)
          dummy.updateMatrix()
          trailMeshRef.current.setMatrixAt(i, dummy.matrix)
        } else {
          dummy.position.set(0,0,0)
          dummy.scale.set(0,0,0)
          dummy.updateMatrix()
          trailMeshRef.current.setMatrixAt(i, dummy.matrix)
        }
      }
      trailMeshRef.current.instanceMatrix.needsUpdate = true
    }
    if (eyeMaterial.current && !prefersReducedMotion) {
      const basePulse = 1.0 + Math.sin(state.clock.elapsedTime * 1.5) * 0.3
      let intensityTarget = basePulse
      if (isHovering.current) {
        const eyeWorldPos = new THREE.Vector3(xOffset, yOffset + 0.5, 0.4)
        const distToEye = intersectionPoint.current.distanceTo(eyeWorldPos)
        if (distToEye < 1.0) intensityTarget = basePulse + (1.0 - distToEye) * 0.5
      }
      eyeMaterial.current.emissiveIntensity = THREE.MathUtils.damp(eyeMaterial.current.emissiveIntensity, intensityTarget, 5, delta)
    }
    const scrollY = window.scrollY
    const vh = window.innerHeight || 1000
    const progress = Math.min(Math.max(scrollY / vh, 0.0), 1.0)
    const lerpedScale = baseScale * (1.0 - progress * 0.1)
    group.current.scale.lerp(new THREE.Vector3(lerpedScale, lerpedScale, lerpedScale), 0.05)
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, xOffset, 0.1)
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, yOffset + idlePosY, 0.05)
  })

  return (
    <>
      <group ref={group} dispose={null} scale={baseScale} position={[xOffset, yOffset, 0]}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[0, 10, 5]} intensity={1.0} color="#ffffff" />
        <directionalLight position={[-5, -2, -5]} intensity={1.5} color="#880000" />
        <primitive object={scene} rotation={[0, -0.1, 0]} onPointerOver={handlePointerOver} onPointerMove={handlePointerMove} onPointerOut={handlePointerOut} onPointerDown={handlePointerDown} />
        {wireframeScene && <primitive object={wireframeScene} />}
        {!isMobile && (
          <>
            <Html position={[-0.6, 0.7, 0]} center wrapperClass="pointer-events-none"><div ref={marker1Ref} className="text-[7px] font-mono text-red-500/80 uppercase tracking-widest opacity-30 transition-all duration-300">[ THREAT ANALYSIS ]</div></Html>
            <Html position={[0.5, 0.3, 0.4]} center wrapperClass="pointer-events-none"><div ref={marker2Ref} className="text-[7px] font-mono text-red-500/80 uppercase tracking-widest opacity-30 transition-all duration-300">[ OPTICAL SYSTEM ]</div></Html>
            <Html position={[-0.7, -0.4, 0]} center wrapperClass="pointer-events-none"><div ref={marker3Ref} className="text-[7px] font-mono text-red-500/80 uppercase tracking-widest opacity-30 transition-all duration-300">[ STRUCTURE SCAN ]</div></Html>
          </>
        )}
        {!isTablet && !isMobile && (
          <Html position={[-1.3, 0.0, 0]} center zIndexRange={[0, 0]} wrapperClass="pointer-events-none">
            <div ref={hudLeftRef} className="flex flex-col gap-1 text-[9px] font-mono text-zinc-400/60 uppercase tracking-[0.2em] whitespace-nowrap select-none transition-transform duration-75">
              <div><span className="text-red-500/70 mr-1">■</span> ENTITY // CHIMERA-01</div>
              <div><span className="text-red-500/70 mr-1">■</span> STATUS // <span className="text-white/80">{systemState}</span></div>
              <div><span className="text-red-500/70 mr-1">■</span> THREAT // UNKNOWN</div>
            </div>
          </Html>
        )}
      </group>

      {/* World-space elements tied to raw intersection point */}
      <instancedMesh ref={trailMeshRef} args={[new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xcc0000, transparent: true, opacity: 0.8, depthWrite: false }), trailCount]} />
      
      <Html position={intersectionPoint.current} center wrapperClass="pointer-events-none" zIndexRange={[100, 0]}>
        <div ref={reticleRef} className="relative w-8 h-8 opacity-0 transition-opacity duration-300 pointer-events-none select-none flex items-center justify-center text-red-500/80 font-mono text-[10px]">
          <div className="absolute top-0 left-0 border-t border-l border-red-500/80 w-2 h-2" />
          <div className="absolute top-0 right-0 border-t border-r border-red-500/80 w-2 h-2" />
          <div className="absolute bottom-0 left-0 border-b border-l border-red-500/80 w-2 h-2" />
          <div className="absolute bottom-0 right-0 border-b border-r border-red-500/80 w-2 h-2" />
          <div className="w-[2px] h-[2px] bg-red-500/80" />
          
          <div className="absolute left-[calc(100%+24px)] top-1/2 -translate-y-1/2 text-[8px] font-mono text-red-500/70 whitespace-nowrap tracking-widest transition-opacity duration-300">
            [ ANALYZE ENTITY ]
          </div>
          
          <div ref={lockRef} className="absolute top-[calc(100%+16px)] left-1/2 -translate-x-1/2 flex flex-col items-center text-[7px] font-mono text-red-500/90 whitespace-nowrap opacity-0 transition-all duration-300">
            <span className="font-bold tracking-widest">TARGET // LOCKED</span>
            <span className="text-red-500/60 tracking-widest mt-1">STATUS // ACTIVE</span>
          </div>
        </div>
      </Html>
    </>
  )
}

function FallbackVisual() {
  return (
    <mesh>
      <icosahedronGeometry args={[2, 1]} />
      <meshBasicMaterial color={0x111111} wireframe />
    </mesh>
  )
}

export function ChimeraScene() {
  const [dpr, setDpr] = useState<[number, number]>([1, 2])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const isMobileDevice = window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    setDpr(isMobileDevice ? [1, 1.5] : [1, 2])
  }, [])

  return (
    <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'transparent' }}>
      <Canvas camera={{ position: [0, 0, 9], fov: 45 }} dpr={dpr} gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}>
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <ModelErrorBoundary fallback={<FallbackVisual />}>
          <Suspense fallback={null}>
            <ChimeraModel url="/models/chimera-final.glb" onModalOpen={() => setIsModalOpen(true)} />
          </Suspense>
        </ModelErrorBoundary>
      </Canvas>
      <ChimeraModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

useGLTF.preload("/models/chimera-final.glb")
