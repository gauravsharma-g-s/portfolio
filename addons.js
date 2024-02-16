import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { onMouseClick } from './main'
const textureLoader = new THREE.TextureLoader()

const matcapTexture = textureLoader.load('/textures/8.png')
const matcapTexture_1 = textureLoader.load('/textures/4.png')
// Circles of project enter 
export function entryCircle() {
    const geometry = new THREE.TorusGeometry(10, 0.53, 10, 100);
    const particlesmaterial = new THREE.PointsMaterial({ color: 0xffff00, size: 0.01 });
    const particlesRing = new THREE.Points(geometry, particlesmaterial);
    particlesRing.position.set(0, 10, 0)
    particlesRing.rotation.x = Math.PI / 2
  
    const groundRing = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xffff00 }));
    groundRing.rotation.x = Math.PI / 2
  
    const enterCircle = new THREE.Group()
    enterCircle.add(particlesRing, groundRing)
    return enterCircle
  }


  // Create SignBoards
export function createSignBoards(font, text, scale, textAngle, boardAngle) {
    const projectTextGeometry = createTextGeometry(text, font)
    const projectText = createText(projectTextGeometry, scale, textAngle)
    projectText.position.set(-6, 28, 1)
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 60, 30), new THREE.MeshBasicMaterial({ color: 'brown' }))
    const circle = new THREE.Mesh(new THREE.CircleGeometry(9, 30), new THREE.MeshBasicMaterial({ color: 'red', side: THREE.TwoPassDoubleSide }))
    circle.position.set(0, 28, 1)
    document.addEventListener('click', (event) => {
      onMouseClick(event, circle)
    }, false)
    if (text === 'Email') {
      circle.addEventListener('click', () => {
        window.open('mailto:gauravsharma201102@gmail.com', '_blank')
      })
    }
    else if (text === 'Linkedin') {
      circle.addEventListener('click', () => {
        window.open('https://www.linkedin.com/in/gaurav-sharma-059576214', '_blank')
      })
    }
    else if (text === 'Facebook') {
      circle.addEventListener('click', () => {
        window.open('https://www.facebook.com/profile.php?id=100013333297895', '_blank')
      })
    }
    else if (text === 'Instagram') {
      circle.addEventListener('click', () => {
        window.open('https://www.instagram.com/gaurav_sharma_g_s/', '_blank')
      })
    }
    const group = new THREE.Group()
    group.add(tube, circle, projectText)
    group.rotation.y = boardAngle
    return group
  }


  // Create Project Description on Ground
export function createProjectDescriptionGround(text) {
    const textArray = text.split('/n')
    const textCanvas = document.createElement('canvas');
    const textContext = textCanvas.getContext('2d')
    textCanvas.width = 550
    textCanvas.height = 350
    textContext.font = 'Normal 30px Arial'
    textContext.fillStyle = 'rgba(255, 255, 255, 1)'
    textArray.forEach((line, index) => {
      const x = 10
      const y = 50 + index * 50
      textContext.fillText(line, x, y)
    })
  
    const texture = new THREE.CanvasTexture(textCanvas);
  
    const projectDescriptionGround = new THREE.Mesh(new THREE.PlaneGeometry(100, 100),
      new THREE.MeshMatcapMaterial({ transparent: true, map: texture })
    )
    return projectDescriptionGround
  }

// Click me on wall
export function createClickMe(text) {
  const textCanvas = document.createElement('canvas');
  const textContext = textCanvas.getContext('2d')
  textCanvas.width = 60
  textCanvas.height = 80
  textContext.font = 'Normal 25px Arial'
  textContext.fillStyle = 'rgba(255, 255, 255, 1)'
  textContext.fillText('Click',5,18)

  const texture = new THREE.CanvasTexture(textCanvas);

  const clickMeText = new THREE.Mesh(new THREE.PlaneGeometry(15, 20),
    new THREE.MeshMatcapMaterial({ transparent: true,map:texture,color:'orange' })
  )

  document.addEventListener('click', (event) => {
    onMouseClick(event, clickMeText)
  }, false)
  return clickMeText
}


// Function to create text geometry
export function createTextGeometry(text, font) {
    const geometry = new TextGeometry(
      text,
      {
        font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
      }
    )
    return geometry
  }
  
  // create Text Mesh
  export function createText(textGeometry, scale, angle) {
    const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
    const text = new THREE.Mesh(textGeometry, material)
    text.scale.set(scale, scale, scale)
    text.rotation.y = angle
    return text
  }

  // Function to create the base
export function createBase(length, width, depth) {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(0, width)
    shape.lineTo(length, width)
    shape.lineTo(length, 0)
    shape.lineTo(0, 0)
  
    const extrudeSettings = {
      steps: 3,
      depth,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 1,
      bevelOffset: -1,
      bevelSegments: 1
    }
  
    const basegeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const basematerial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture_1 });
    const base = new THREE.Mesh(basegeometry, basematerial);
    return base
  }



  export function createTv(){
    const tv = new THREE.Mesh(new THREE.PlaneGeometry(82, 28, 2), new THREE.MeshBasicMaterial({ color: 'green',side:THREE.DoubleSide}))
    const tube1 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 60, 30), new THREE.MeshBasicMaterial({ color: 'brown' }))
    const tube2 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 60, 30), new THREE.MeshBasicMaterial({ color: 'brown' }))
    tube1.position.set(-27,-24,-2)
    tube2.position.set(27,-24,-2)
    const group = new THREE.Group()
    group.add(tv,tube1,tube2)
    return group
  }