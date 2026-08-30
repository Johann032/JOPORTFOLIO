"use client"

import { Canvas, useFrame, useThree, createPortal } from "@react-three/fiber"
import { useGLTF, AdaptiveDpr, AdaptiveEvents, useFBO } from "@react-three/drei"
import { Suspense, useRef, useEffect, Component, ReactNode, useMemo, useState } from "react"
import * as THREE from "three"


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

function HalftoneOwl({ url, onLoaded }: { url: string, onLoaded?: () => void }) {
  const { size, camera } = useThree()
  const isMobile = size.width < 768
  const isTablet = size.width >= 768 && size.width < 1024
  
  const aspect = size.width / size.height
  
  // Hidden scene to render the pure depth/lighting silhouette
  const hiddenScene = useMemo(() => {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000) // Pure black for alpha masking
    return scene
  }, [])
  
  // FBO setup - strictly controlled resolution to prevent 4K overhead
  const fboWidth = isMobile ? 256 : 512
  const fboHeight = fboWidth / aspect

  const renderTarget = useFBO(fboWidth, fboHeight, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    type: THREE.HalfFloatType,
  })

  // GLB Setup
  const { scene } = useGLTF(url)
  const group = useRef<THREE.Group>(null)
  
  // Scale and position - Small Minimal Owl (30-38% viewport)
  const baseScale = isMobile ? Math.max(1.1, aspect * 2.0) : isTablet ? 1.5 : 2.1
  const yOffset = 0.0

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const name = child.name.toLowerCase()
          if (!(name.includes("base") || name.includes("pedestal") || name.includes("cube") || name.includes("box"))) {
            // Apply a matte white material to capture flawless structural lighting
            child.material = new THREE.MeshStandardMaterial({
              color: 0xffffff,
              roughness: 0.9,
              metalness: 0.1,
            })
          } else {
             // Hide pedestal/bases from the FBO
             child.visible = false
          }
        }
      })
    }
  }, [scene])

  // Mouse interaction state
  const pointer = useRef({ x: 0, y: 0 })
  const lastPointerTime = useRef(0)
  const intersectionPoint = useRef(new THREE.Vector3())

  
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return
    const handleMouseMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1
      lastPointerTime.current = Date.now()
    }
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        pointer.current.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1
        pointer.current.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1
        lastPointerTime.current = Date.now()
      }
    }
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        pointer.current.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1
        pointer.current.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1
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

  // Grid Geometry Setup
  const gridGeo = useMemo(() => {
    // 220-280 cols on desktop, 120-160 on mobile
    const cols = isMobile ? 140 : 250
    const rows = Math.floor(cols / aspect)
    
    // Frustum dimensions at z=0 plane
    const distance = camera.position.z
    const vFov = (camera as THREE.PerspectiveCamera).fov * Math.PI / 180
    const height = 2 * Math.tan(vFov / 2) * distance
    const width = height * aspect
    
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(cols * rows * 3)
    const uvs = new Float32Array(cols * rows * 2)
    
    let index = 0
    let uvIndex = 0
    for(let i = 0; i < cols; i++) {
      for(let j = 0; j < rows; j++) {
        const x = (i / cols) * width - (width / 2) + (width / cols / 2)
        const y = (j / rows) * height - (height / 2) + (height / rows / 2)
        
        positions[index++] = x
        positions[index++] = y
        positions[index++] = 0
        
        uvs[uvIndex++] = i / cols
        uvs[uvIndex++] = j / rows
      }
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    return geo
  }, [aspect, camera, isMobile])

  const shaderMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uPointerPos: { value: new THREE.Vector3(0, 0, 0) },
        uHoverState: { value: 0.0 },
        uBreath: { value: 1.0 },
        uTime: { value: 0.0 },
        uPulse: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(0, 0) }
      },
      transparent: true,
      depthWrite: false,
      vertexShader: `
        uniform sampler2D uTexture;
        uniform vec3 uPointerPos;
        uniform float uHoverState;
        uniform float uBreath;
        uniform float uTime;
        uniform float uPulse;
        
        varying vec3 vColor;
        varying float vVisibility;
        
        void main() {
          vec2 texUv = uv;
          vec4 texColor = texture2D(uTexture, texUv);
          
          // Calculate luminance for structural dot mapping
          float lum = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
          
          // Mask out pure black background (ZERO dots outside the silhouette)
          if (lum < 0.02) {
             vVisibility = 0.0;
             gl_Position = vec4(0.0);
             gl_PointSize = 0.0;
             return;
          }
          vVisibility = 1.0;
          
          vec3 pos = position;
          
          // Subtle idle breathing particle displacement
          float breathOffset = sin(pos.y * 2.5 + uTime * 1.4) * cos(pos.x * 2.5 + uTime * 1.4) * 0.02 * uBreath;
          pos.z += breathOffset;
          
          float dist = distance(pos.xy, uPointerPos.xy);
          
          // Interaction radius for digital sensor effect
          float influence = smoothstep(1.8, 0.0, dist) * uHoverState;
          
          // Subtle radial push
          vec2 dir = normalize(pos.xy - uPointerPos.xy);
          pos.xy += dir * influence * 0.15;
          
          // Pulse wave on click
          float pulseWave = uPulse * sin(dist * 12.0 - uTime * 15.0) * exp(-dist * 1.5);
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Dot size depends strictly on Owl geometry luminance and hover interaction
          float baseSize = mix(1.0, 3.8, smoothstep(0.1, 0.8, lum));
          float hoverBoost = influence * 2.5;
          
          // Depth attenuation
          gl_PointSize = (baseSize + hoverBoost + pulseWave * 4.0) * (10.0 / -mvPosition.z) * (1.0 + breathOffset * 3.0);
          
          // Color remains calm, monochromatic, and structural
          vec3 baseColor = mix(vec3(0.4, 0.4, 0.45), vec3(1.0, 1.0, 1.0), lum);
          vColor = mix(baseColor, vec3(1.0, 1.0, 1.0), influence * 0.4 + pulseWave);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vVisibility;
        
        void main() {
          if (vVisibility < 0.5) discard;
          
          // Render a perfect, crisp circular dot
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;
          
          // Smooth edge for premium display feel
          float alpha = smoothstep(0.5, 0.35, dist);
          
          gl_FragColor = vec4(vColor, alpha * 0.9);
        }
      `
    })
  }, [])

  // Update uniforms that change on resize/initialization without recreating the material
  useEffect(() => {
    shaderMat.uniforms.uTexture.value = renderTarget.texture
    shaderMat.uniforms.uResolution.value.set(size.width, size.height)
  }, [renderTarget.texture, size.width, size.height, shaderMat])

  const tempVec = useMemo(() => new THREE.Vector3(), [])
  const hasLoaded = useRef(false)

  useFrame((state, delta) => {
    // 1. Update uniforms (pointer math mapped to Z=0 grid)
    if (!prefersReducedMotion) {
      tempVec.set(pointer.current.x, pointer.current.y, 0.5)
      tempVec.unproject(state.camera)
      tempVec.sub(state.camera.position).normalize()
      const dist = -state.camera.position.z / tempVec.z
      intersectionPoint.current.copy(state.camera.position).add(tempVec.multiplyScalar(dist))

      shaderMat.uniforms.uTime.value = state.clock.elapsedTime
      shaderMat.uniforms.uPointerPos.value.lerp(intersectionPoint.current, 0.15)
      
      const now = Date.now()
      const timeSinceLastMove = now - lastPointerTime.current
      const targetHover = (timeSinceLastMove < 500 && lastPointerTime.current > 0) ? 1.0 : 0.0
      shaderMat.uniforms.uHoverState.value = THREE.MathUtils.lerp(shaderMat.uniforms.uHoverState.value, targetHover, 0.1)
      
      // Breathing fades in gradually when idle, fades out smoothly on mouse move
      const targetBreath = (timeSinceLastMove > 1000 || lastPointerTime.current === 0) ? 1.0 : 0.0
      shaderMat.uniforms.uBreath.value = THREE.MathUtils.damp(shaderMat.uniforms.uBreath.value, targetBreath, 3, delta)
      
      if (targetHover > 0.5 && timeSinceLastMove < 100) {
        document.body.style.cursor = "crosshair"
      } else {
        document.body.style.cursor = "auto"
      }
      

    }

    // 2. Render Hidden Scene to FBO
    if (group.current) {
      // Scroll parallax scaling
      const scrollY = window.scrollY
      const vh = window.innerHeight || 1000
      const progress = Math.min(Math.max(scrollY / vh, 0.0), 1.0)
      const lerpedScale = baseScale * (1.0 - progress * 0.1)
      
      const time = state.clock.elapsedTime
      const breathPhase = time * 1.4 // ~4.5 seconds per cycle
      const breathIntensity = prefersReducedMotion ? 0 : shaderMat.uniforms.uBreath.value
      
      // Vertical bob (~2-4 pixels)
      const idlePosY = Math.sin(breathPhase) * 0.015 * breathIntensity
      
      // Depth bob (forward/back)
      const idlePosZ = Math.cos(breathPhase) * 0.01 * breathIntensity
      
      // Scale breath (0.7% change)
      const scaleBreath = 1.0 + (Math.sin(breathPhase - Math.PI/2) * 0.007 * breathIntensity)
      const currentScale = lerpedScale * scaleBreath
      
      group.current.scale.set(currentScale, currentScale, currentScale)
      group.current.position.y = yOffset + idlePosY
      group.current.position.z = idlePosZ
      
      // Smooth Rotation Tracking
      let finalTargetX = 0
      let finalTargetY = 0
      
      if (!prefersReducedMotion && lastPointerTime.current > 0) {
        const timeSinceLastMove = Date.now() - lastPointerTime.current
        if (timeSinceLastMove < 1000) {
           finalTargetY = pointer.current.x * 0.14 // approx +/- 8 deg
           finalTargetX = -pointer.current.y * 0.087 // approx +/- 5 deg
        }
      }
      
      const clampedTargetY = Math.max(-0.14, Math.min(0.14, finalTargetY))
      const clampedTargetX = Math.max(-0.08, Math.min(0.08, finalTargetX))
      
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, clampedTargetY, 4, delta)
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, clampedTargetX, 4, delta)
    }

    state.gl.setRenderTarget(renderTarget)
    state.gl.render(hiddenScene, state.camera)
    state.gl.setRenderTarget(null)
    
    if (!hasLoaded.current) {
      hasLoaded.current = true
      if (onLoaded) {
        onLoaded()
      }
    }
  })



  return (
    <>
      {/* Hidden Scene Portal */}
      {createPortal(
        <group ref={group}>
          <ambientLight intensity={0.15} color="#ffffff" />
          <directionalLight position={[5, 10, 5]} intensity={2.5} color="#ffffff" />
          <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#a0a0a0" />
          <primitive object={scene} />
        </group>,
        hiddenScene
      )}

      {/* Main Visible 2D Dot Matrix */}
      <points geometry={gridGeo} material={shaderMat} />


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

export function OwlScene({ onLoaded }: { onLoaded?: () => void }) {
  const [dpr, setDpr] = useState<[number, number]>([1, 2])

  useEffect(() => {
    const isMobileDevice = window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    setDpr(isMobileDevice ? [1, 1.5] : [1, 2])
  }, [])

  return (
    <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'transparent' }}>
      <Canvas camera={{ position: [0, 0, 9], fov: 45 }} dpr={dpr} gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}>
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <ModelErrorBoundary fallback={<FallbackVisual />}>
          <Suspense fallback={null}>
            <HalftoneOwl url="/models/cyber-owl.glb" onLoaded={onLoaded} />
          </Suspense>
        </ModelErrorBoundary>
      </Canvas>
    </div>
  )
}

useGLTF.preload("/models/cyber-owl.glb")
