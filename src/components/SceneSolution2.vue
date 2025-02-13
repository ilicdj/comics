<template>
  <!-- HTML element for CANVAS to be mounted on -->
  <div ref="container" class="webgl-container"></div>
</template>

<script>
// Vue
import { defineComponent, onMounted } from 'vue'

// Three.js Library
import * as THREE from 'three'
import GUI from 'lil-gui'

// Images for textures
import dylandog from '../assets/images/dylandog.jpg'
import batman from '../assets/images/batman.jpg'
import spiderman from '../assets/images/spiderman.jpg'
import onepiece from '../assets/images/onepiece.jpg'
import asterix from '../assets/images/asterix.jpg'

// Other
import gsap from 'gsap'
import VirtualScroll from 'virtual-scroll'

export default defineComponent({
  name: 'ThreeSketch',
  setup() {
    class Sketch {
      constructor(container) {
        this.scene = new THREE.Scene()
        this.container = container
        this.width = container.offsetWidth
        this.height = container.offsetHeight

        this.renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        })
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setSize(this.width, this.height)
        this.renderer.physicallyCorrectLights = true

        // Virtual Scroll
        this.scrollProgress = 0
        this.targetScroll = 0
        this.ease = 0.05 // Smoothing factor

        this.scroller = new VirtualScroll()
        this.scroller.on((event) => {
          let newTarget = this.targetScroll + event.deltaY * 0.001
          // Set reasonable bounds for the scroll value
          const maxScroll = 7
          newTarget = Math.max(Math.min(newTarget, maxScroll), -maxScroll)
          this.targetScroll = newTarget
        })

        container.appendChild(this.renderer.domElement)

        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.1, 10)
        this.camera.position.set(0, 0, 1.5)

        this.time = 0
        this.images = [dylandog, batman, spiderman, onepiece, asterix]

        this.meshSpacing = 1.8 // Distance between meshes
        this.totalWidth = this.images.length * this.meshSpacing // Total width of all meshes

        this.addObjects()
        this.resize()
        this.setupSettings()
        this.render()
      }

      setupSettings() {
        this.settings = {
          progress: 0,
          bloomStrength: 0,
          bloomThreshold: 0,
          bloomRadius: 0,
        }
        this.gui = new GUI()
        this.gui.add(this.settings, 'progress', 0, 1, 0.01)
      }

      getMaterial(image) {
        return new THREE.ShaderMaterial({
          vertexShader: `
            uniform float uTime;
            uniform float uProgress;
            uniform float uHover;
            varying vec2 vUv;
            #define PI 3.1415926535897932384626433832795

            void main() {
              vUv = uv;
              vec3 newPos = position;
              
              // Animated sin wave that reacts to hover
              newPos.z = 0.09 * sin(newPos.x * 2.0 + uTime) * 0.;
              
              gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPos, 1.0);
            }
          `,
          fragmentShader: `
            uniform float uProgress;
            uniform float uTime;
            uniform sampler2D uTexture;
            varying vec2 vUv;
            void main() {
              vec4 image = texture(uTexture, vUv);
              gl_FragColor = image;
            }
          `,
          side: THREE.DoubleSide,
          transparent: true,
          uniforms: {
            uProgress: { type: 'f', value: 0 },
            uTime: { type: 'f', value: 0 },
            uHover: { type: 'f', value: 0 },
            uTexture: { type: 't', value: new THREE.TextureLoader().load(image) },
          },
        })
      }

      addObjects() {
        this.meshes = []
        this.geometry = new THREE.PlaneGeometry(1.5, 1.5, 50, 50)

        this.images.forEach((image, index) => {
          let material = this.getMaterial(image)
          let mesh = new THREE.Mesh(this.geometry, material)

          // Initial positioning
          const initialX = (index - Math.floor(this.images.length / 2)) * this.meshSpacing
          mesh.position.x = initialX

          mesh.onMouseEnter = () => gsap.to(material.uniforms.uHover, { value: 0, duration: 0 })
          mesh.onMouseLeave = () => gsap.to(material.uniforms.uHover, { value: 1, duration: 0 })

          this.scene.add(mesh)
          this.meshes.push({
            mesh: mesh,
            progress: 0,
            pos: initialX, // Store initial position
            initialX: initialX, // Keep track of initial position
          })
        })

        // Rest of the mouse event handling remains the same
        window.addEventListener('mousemove', (event) => {
          const raycaster = new THREE.Raycaster()
          const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
          )

          raycaster.setFromCamera(mouse, this.camera)
          const intersects = raycaster.intersectObjects(this.meshes.map((m) => m.mesh))

          this.meshes.forEach((m) => m.mesh.onMouseLeave())
          if (intersects.length > 0) {
            intersects[0].object.onMouseEnter()
          }
        })
      }

      handleResize() {
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight
        this.renderer.setSize(this.width, this.height)
        this.camera.aspect = this.width / this.height
        this.camera.updateProjectionMatrix()
      }

      resize() {
        window.addEventListener('resize', this.handleResize.bind(this))
      }

      render() {
        this.time += 0.01

        // Smooth scroll interpolation
        this.scrollProgress += (this.targetScroll - this.scrollProgress) * this.ease

        const leftBoundary = -5
        const rightBoundary = 5

        this.meshes.forEach((mesh) => {
          if (mesh.mesh.material.uniforms.uTime) {
            mesh.mesh.material.uniforms.uTime.value = this.time

            // Calculate new position based on scroll
            const newX = mesh.initialX + this.scrollProgress * this.meshSpacing

            // Handle wrapping
            if (newX < leftBoundary) {
              mesh.mesh.position.x = newX + this.totalWidth
            } else if (newX > rightBoundary) {
              mesh.mesh.position.x = newX - this.totalWidth
            } else {
              mesh.mesh.position.x = newX
            }
          }
        })

        requestAnimationFrame(this.render.bind(this))
        this.renderer.render(this.scene, this.camera)
      }
    }

    onMounted(() => {
      const container = document.querySelector('.webgl-container')
      new Sketch(container)
    })

    return {}
  },
})
</script>

<style scoped lang="scss">
.webgl-container {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: #1d1d1d;
  canvas {
    display: block;
  }
}
</style>
