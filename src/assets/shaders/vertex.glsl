uniform float uTime;
uniform float uHover;
uniform float uScrollSpeed;
varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

void main() {
    vUv = uv;
    vec3 newPos = position;

    // Dramatic distortion - exaggerated waves
    float wave = sin(newPos.y * 4.0 + uTime * 2.0) * 0.6 * uHover;
    // float wave = sin(newPos.y * 4.0 + uTime * (1.0 + uScrollSpeed * 0.01)) * 0.5 * uHover;

    float ripple = sin(distance(newPos.xy, vec2(0.0)) * 6.0 - uTime * 3.0) * 5.1 * uHover;
    
    // Jitter effect - like an old film reel shake
    float jitter = sin(uTime * 10.0 + newPos.y * 20.0) * 0.005;

    newPos.z += wave + ripple * uHover;
    newPos.x += jitter * uHover;
    newPos.y += jitter * 0.5 * uHover;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPos, 1.0);
}
