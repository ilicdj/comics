<template>
  <div ref="container" class="webgl-container"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { defineComponent, onMounted } from 'vue'
import GUI from 'lil-gui'
import dylandog from '../assets/images/dylandog.jpg'
import batman from '../assets/images/batman.jpg'
import spiderman from '../assets/images/spiderman.jpg'
import onepiece from '../assets/images/onepiece.jpg'
import asterix from '../assets/images/asterix.jpg'

export default defineComponent({
  name: 'ThreeSketch',
  setup() {

    class Sketch {
      constructor(container) {
        this.scene = new THREE.Scene()
        this.container = container
        this.width = container.offsetWidth
        this.height = container.offsetHeight
        this.temporaryPlanes = []

        this.renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        })
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setSize(this.width, this.height)
        this.renderer.physicallyCorrectLights = true
        this.renderer.outputEncoding = THREE.sRGBEncoding

        container.appendChild(this.renderer.domElement)

        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.01, 1000)
        this.camera.position.set(0, 0, 1.5)

        // this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.time = 0

        this.images = [dylandog, batman, spiderman, onepiece, asterix]

        this.addObjects()
        this.resize()
        this.setupSettings()
        this.render()
      }

      setupSettings() {
        let that = this
        this.settings = {
          progress: 0,
          bloomStrength: 0,
          bloomThreshold: 0,
          bloomRadius: 0,
        }
        this.gui = new GUI()
        this.gui.add(this.settings, 'progress', 0, 1, 0.01)
      }

      getMaterial() {
        return new THREE.ShaderMaterial({
          vertexShader: `
            uniform float uTime;
            uniform float uProgress;
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float uProgress;
            uniform float uTime;
            uniform sampler2D uTexture;
            varying vec2 vUv;
            void main() {
              vec4 image = texture(uTexture, vUv);
              // gl_FragColor = vec4(uProgress,vUv, 1.0);
              gl_FragColor = image;
            }
          `,
          side: THREE.DoubleSide,
          transparent: true,
          uniforms: {
            uProgress: { type: 'f', value: 0 },
            uTime: { type: 'f', value: 0 },
            uTexture: { type: 't', value: new THREE.TextureLoader().load(dylandog) },
          },
          // wireframe: true,
        })
      }

      addObjects() {
        this.meshes = []
        this.geometry = new THREE.PlaneGeometry(1.5, 1.5, 50, 50) // Manje dimenzije da se ne preklapaju

        this.images.forEach((image, index) => {
          let material = new THREE.ShaderMaterial({
            vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
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
              uTime: { type: 'f', value: 0 },
              uTexture: { type: 't', value: new THREE.TextureLoader().load(image) },
            },
          })

          let mesh = new THREE.Mesh(this.geometry, material)
          mesh.position.x = (index - 2) * 1.8 // Razmakni ih po X osi
          this.scene.add(mesh)
          this.meshes.push(mesh)
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
        // this.controls.update()

        // Update main plane
        this.meshes.forEach((mesh) => {
          if (mesh.material.uniforms.uTime) {
            mesh.material.uniforms.uTime.value = this.time
          }
        })

        requestAnimationFrame(this.render.bind(this))
        this.renderer.render(this.scene, this.camera)
      }
    }

    onMounted(() => {
      const container = document.querySelector('.webgl-container')
      let sketch = new Sketch(container)
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
