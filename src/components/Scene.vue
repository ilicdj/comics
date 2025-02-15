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
import vertex from '../assets/shaders/vertex.glsl'
import fragment from '../assets/shaders/fragment.glsl'

// Images for textures
import dylandog from '/images/dylandog.webp'
import batman from '/images/batman.webp'
import spiderman from '/images/spiderman.webp'
import onepiece from '/images/onepiece.webp'
import asterix from '/images/asterix.webp'

// Other
import gsap from 'gsap'
import VirtualScroll from 'virtual-scroll'
import imagesLoaded from 'imagesloaded'

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

        // Add scroll activity tracking
        this.isScrolling = false
        this.scrollTimeout = null

        this.scroller = new VirtualScroll()
        this.scroller.on((event) => {
          // Calculate the target scroll position
          let newTarget = this.targetScroll + event.deltaY * 0.001

          // Prevent scrolling left at the start position
          if (newTarget > 0) {
            newTarget = 0
          }

          this.targetScroll = newTarget

          // Set scrolling state to true
          this.isScrolling = true

          // Clear the previous timeout
          if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout)
          }

          // Set a timeout to detect when scrolling stops
          this.scrollTimeout = setTimeout(() => {
            this.isScrolling = false
            // Reset hover effect on all meshes when scrolling stops
            this.meshes.forEach((m) => {
              gsap.to(m.mesh.material.uniforms.uHover, {
                value: 0,
                duration: 0.4,
              })
            })
          }, 150)
        })

        container.appendChild(this.renderer.domElement)

        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.1, 10)
        this.camera.position.set(0, 0, 1.5)

        this.time = 0

        this.images = [dylandog, batman, spiderman, onepiece, asterix]
        // Preload images
        const preloadImages = new Promise((resolve) => {
          imagesLoaded(this.images, resolve)
        })

        let allDone = [preloadImages]

        Promise.all(allDone).then(() => {
          this.setupSettings()
          this.addObjects()
          this.resize()
          this.render()
        })
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
        this.gui.hide()
      }

      getMaterial(image) {
        return new THREE.ShaderMaterial({
          vertexShader: vertex,
          fragmentShader: fragment,
          side: THREE.DoubleSide,
          transparent: true,
          uniforms: {
            uTime: { type: 'f', value: 0 },
            uHover: { type: 'f', value: 0 },
            uTexture: { type: 't', value: new THREE.TextureLoader().load(image) },
          },
        })
      }

      addObjects() {
        this.meshes = []
        this.geometry = new THREE.PlaneGeometry(1.5, 1.5, 10, 10)

        this.images.forEach((image, index) => {
          let material = this.getMaterial(image)
          let mesh = new THREE.Mesh(this.geometry, material)
          mesh.position.x = (index - 2) * 1.8

          this.scene.add(mesh)
          this.meshes.push({
            mesh: mesh,
            progress: 0,
            pos: 2 * index,
          })
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

        this.meshes.forEach((mesh) => {
          if (mesh.mesh.material.uniforms.uTime) {
            mesh.mesh.material.uniforms.uTime.value = this.time
            mesh.mesh.position.x = mesh.pos + this.scrollProgress

            // Apply hover effect based on scroll state
            if (this.isScrolling) {
              gsap.to(mesh.mesh.material.uniforms.uHover, {
                value: 0.07,
                duration: 0.4,
              })
            }

            // Reset position when mesh goes off-screen to the left
            if (mesh.mesh.position.x < -5) {
              mesh.mesh.position.x += this.meshes.length * 1.8 + 1
              mesh.pos += this.meshes.length * 1.8 + 1
            }

            // Reset position when mesh goes off-screen to the right (for reverse scroll)
            if (mesh.mesh.position.x > 5) {
              mesh.mesh.position.x -= this.meshes.length * 1.8 + 1
              mesh.pos -= this.meshes.length * 1.8 + 1
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
