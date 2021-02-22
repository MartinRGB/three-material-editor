import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Canvas, useFrame } from 'react-three-fiber';
import './index.css'
import { Perf } from 'r3f-perf';
import { MaterialEditor, useEditorComposer } from '@three-material-editor/react';
import { Environment, MeshDistortMaterial, Sphere, Text, useTexture } from '@react-three/drei'
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from '@react-three/postprocessing'

import * as THREE from 'three';



const ShaderCustom = {
  uniforms: {
    color: { value: new THREE.Color() },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
  fragmentShader: `
    varying vec2 vUv;
    uniform vec3 color;
    void main() {
      vec2 uv = vUv;
      gl_FragColor = vec4(color, 1.);
    }`
}

// const ShaderCustom = {
//   uniforms: {
//     factor: { type: "f", value: 0 },
//     color: { value: new THREE.Color() },
//     offset: { value: new THREE.Vector2() },
//     tex: { value: undefined },
//   },
//   vertexShader: `
//   uniform vec3 offset;

//     varying vec2 vUv;
//     void main() {
//       vUv = uv;
//       vec3 pos = vec3(position.x + offset.x * 10., position.y + offset.y * 10., position.z);
//       gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
//     }`,
//   fragmentShader: `
//     varying vec2 vUv;
//     uniform vec3 color;
//     uniform float factor;
//     uniform sampler2D tex;
//     void main() {
//       vec2 uv = vUv;
//       vec4 texx = texture2D(tex, uv);
//       vec3 grad = mix(texx.rgb, color, factor);
//       gl_FragColor = vec4(grad, 1.);
//     }`
// }

const BoxStandard = (props) => {
  return (
    <mesh {...props}>
      <boxGeometry args={[1, 1]} />
      <meshStandardMaterial />
    </mesh>
  );
}


const BoxNormal = (props) => {
  const mesh = React.useRef()

  useFrame(() => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01
  })

  return (
    <mesh ref={mesh} {...props}>
      <boxGeometry args={[1, 1]} />
      <meshNormalMaterial />
    </mesh>
  );
}

const BoxShader = (props) => {
  const shader = React.useMemo(() => new THREE.MeshNormalMaterial())
  return (
    <group>
      <mesh {...props} material={shader}>
        <boxGeometry args={[1, 1]} />
      </mesh>
      <mesh {...props} material={shader} position={[0, -1, 0]} >
        <sphereBufferGeometry args={[1, 32, 32, 32 ]} />
      </mesh>
    </group>
  );
}

const BoxShader2 = (props) => {
  const tex = useTexture('/test.jpeg')
  return (
    <mesh {...props}>
      <boxGeometry args={[1, 1]} />
      <shaderMaterial
        args={[ShaderCustom]} />
    </mesh>
  );
}

const App = () => {
  return (
    <Canvas concurrent shadowMap orthographic pixelRatio={[1, 2]} camera={{ position: [0, 0, 5], near: 1, far: 15, zoom: 100 }}>
      {/* <Perf showGraph={false} position={'top-left'} /> */}
      <MaterialEditor />
      {/* <ambientLight intensity={0.5} /> */}

      <React.Suspense fallback={null}>
        <BoxShader2 position={[2, 1, 0]} rotation={[.35,.35,.35]} />
        <Sphere
          args={[1, 32, 32]}
        >
          <MeshDistortMaterial factor={2} color={'black'} />
        </Sphere>
        <Environment preset={'studio'} />
        {/* <EffectComposer ref={useEditorComposer()}>
          <Noise opacity={0.4} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer> */}

      </React.Suspense>

    
      {/* <pointLight position={[5, 0, 10]} intensity={1} /> */}
     {/*  <BoxStandard position={[-2, 0, 0]} rotation={[.35,.35,.35]} /> */}
      {/* <BoxNormal position={[2, 0, 0]} rotation={[.35,.35,.35]} /> */}
      {/* <BoxShader position={[0, 1, 0]} rotation={[.35,.35,.35]} /> */}
       {/* <BoxShader2 position={[2, 1, 0]} rotation={[.35,.35,.35]} /> */}
       {/* <Text fontSize={3} letterSpacing={-0.06}>
          drei
          <MeshDistortMaterial factor={2} color={'black'} />
        </Text> */}
    </Canvas>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
