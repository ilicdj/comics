uniform float uTime;
uniform float uHover;
varying vec2 vUv;
#define PI 3.1415926535897932384626433832795

void main() {
    vUv = uv;
    vec3 newPos = position;

    // Apply animated distortion based on hover intensity
    newPos.z += 0.1 * sin(newPos.y * 2.0 + uTime * 0.1) * uHover;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPos, 1.0);
}