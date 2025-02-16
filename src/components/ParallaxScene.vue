<template>
  <div ref="container" class="webgl-container"></div>
</template>

<script>
import { defineComponent, onMounted } from 'vue'

import * as THREE from 'three'
import GUI from 'lil-gui'
import vertex from '../assets/shaders/vertex.glsl'
import fragment from '../assets/shaders/fragment.glsl'

import dylandog from '/images/dylandog.webp'
import dylandog2 from '/images/dylan2.webp'
import batman from '/images/batman.webp'
import spiderman from '/images/spiderman.webp'
import spiderman2 from '/images/spiderman2.webp'
import onepiece from '/images/onepiece.webp'
import onepiece2 from '/images/green.webp'
import asterix from '/images/asterix.webp'
import asterix2 from '/images/asterix2.webp'
import batman2 from '/images/batman2.webp'

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

        this.meshSpacing = 1.8

        this.scrollProgress = 0
        this.targetScroll = 0
        this.ease = 0.05

        this.scrollSpeed = 0
        this.lastScroll = 0

        this.isScrolling = false
        this.scrollTimeout = null

        this.scroller = new VirtualScroll()
        this.scroller.on((event) => {
          let newTarget = this.targetScroll + event.deltaY * 0.001

          if (newTarget > 0) {
            newTarget = 0
          }

          this.targetScroll = newTarget

          this.isScrolling = true

          if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout)
          }

          this.scrollTimeout = setTimeout(() => {
            this.isScrolling = false

            this.meshes.forEach((m) => {
              gsap.to(m.mesh.material.uniforms.uHover, {
                value: 0,
                duration: 0.4,
              })
            })
          }, 150)
        })

        container.appendChild(this.renderer.domElement)

        this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 10)
        this.camera.position.set(0, 0, 2)

        this.time = 0

        this.images = [
          dylandog,
          batman,
          spiderman,
          onepiece,
          asterix,
          onepiece2,
          spiderman2,
          batman2,
          dylandog2,
          asterix2,
        ]

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
            uScrollSpeed: { type: 'f', value: 0 },
          },
        })
      }

      addObjects() {
        this.meshes = []
        this.geometry = new THREE.PlaneGeometry(1.5, 1.5, 10, 10)

        this.images.forEach((image, index) => {
          let material = this.getMaterial(image)
          let mesh = new THREE.Mesh(this.geometry, material)

          const zLayer = index % 3
          const zPos = zLayer * 0.3 - 0.3

          const scale = 1 - zPos * 0.1
          mesh.scale.set(scale, scale, 1)

          const parallaxFactor = 1 + zPos * 0.2

          mesh.position.x = index * this.meshSpacing
          mesh.position.z = zPos

          this.scene.add(mesh)
          this.meshes.push({
            mesh: mesh,
            progress: 0,
            pos: this.meshSpacing * index,
            parallaxFactor: parallaxFactor,
            baseZ: zPos,
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

        this.scrollProgress += (this.targetScroll - this.scrollProgress) * this.ease
        this.scrollSpeed = Math.abs(this.scrollProgress - this.lastScroll) * 100
        this.lastScroll = this.scrollProgress

        this.meshes.forEach((mesh) => {
          if (mesh.mesh.material.uniforms.uTime) {
            mesh.mesh.material.uniforms.uTime.value = this.time

            mesh.mesh.position.x = (mesh.pos + this.scrollProgress) * mesh.parallaxFactor
            mesh.mesh.material.uniforms.uScrollSpeed.value = this.scrollSpeed

            if (this.isScrolling) {
              gsap.to(mesh.mesh.material.uniforms.uHover, {
                value: 0.07,
                duration: 0.4,
              })
            }

            const totalWidth = this.meshes.length * this.meshSpacing

            if (mesh.mesh.position.x < -5 * mesh.parallaxFactor) {
              mesh.mesh.position.x += totalWidth * mesh.parallaxFactor
              mesh.pos += totalWidth
            }

            if (mesh.mesh.position.x > 5 * mesh.parallaxFactor) {
              mesh.mesh.position.x -= totalWidth * mesh.parallaxFactor
              mesh.pos -= totalWidth
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
