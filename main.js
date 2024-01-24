import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { CharacterControls } from './CharacterControls'
import { KeyDisplay } from './util'
import { entryCircle, createSignBoards, createProjectDescriptionGround, createText, createTextGeometry, createBase, createClickMe } from './addons'

const scene = new THREE.Scene()
const canvas = document.querySelector('.webgl')
const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()
const fontLoader = new FontLoader()
const raycaster = new THREE.Raycaster()
let loaded = 0;
const total = 2;

const checkModelLoaded = ()=>{
  loaded++;
  if(loaded===total){
    // Hide the loading screen and display the canvas
    document.querySelector('.loading').style.display = 'none';
    document.querySelector('canvas').style.display = 'block';
  }
}
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

/**
 * Loading the Textures
 */
const grassTexture = textureLoader.load('/textures/grass.jpg')
grassTexture.repeat.set(10, 10)
grassTexture.wrapS = THREE.RepeatWrapping
grassTexture.wrapT = THREE.RepeatWrapping
grassTexture.magFilter = THREE.NearestFilter

const roadTexture = textureLoader.load('/textures/road.jpg')
roadTexture.repeat.set(1, 20)
roadTexture.wrapS = THREE.RepeatWrapping
roadTexture.wrapT = THREE.RepeatWrapping
roadTexture.magFilter = THREE.NearestFilter

const matcapTexture = textureLoader.load('/textures/8.png')


/**
 * Loading the Models
 */

let mixers = []
let character = null
let windmill_1 = null
let windmill_2 = null
let dog = null
// windMill
gltfLoader.load('/models/windmill_game_ready/scene.gltf',
  (gltf) => {
    gltf.scene.scale.set(1500, 1500, 1500)
    windmill_1 = gltf.scene.clone()
    windmill_2 = gltf.scene.clone()
    windmill_1.position.set(-250, 0, 100)
    windmill_2.position.set(-250, 0, 200)
    scene.add(windmill_1)
    scene.add(windmill_2)
    checkModelLoaded()
    const mixer1 = new THREE.AnimationMixer(windmill_1)
    const mixer2 = new THREE.AnimationMixer(windmill_2)
    const action1 = mixer1.clipAction(gltf.animations[0])
    action1.play()
    mixers.push(mixer1)
    const action2 = mixer2.clipAction(gltf.animations[0])
    action2.play()
    mixers.push(mixer2)
  })

// Bush
gltfLoader.load('/models/game_ready_bush/scene.gltf', (gltf) => {
  gltf.scene.scale.set(30, 30, 30)
  gltf.scene.position.set(-370, 0.04, -15)
  scene.add(gltf.scene)
})

// Moving Tree
gltfLoader.load('/models/tree_animate/scene.gltf', (gltf) => {
  const tree_2 = gltf.scene.clone()
  tree_2.position.set(-380, 0.04, 235)
  scene.add(tree_2)
  const mixer2 = new THREE.AnimationMixer(tree_2)
  const action2 = mixer2.clipAction(gltf.animations[0])
  action2.play()
  mixers.push(mixer2)
})

// Flower
gltfLoader.load('/models/lilac/scene.gltf', (gltf) => {
  gltf.scene.scale.set(15, 15, 15)
  const flower_1 = gltf.scene.clone()
  const flower_2 = gltf.scene.clone()
  const flower_3 = gltf.scene.clone()
  const flower_4 = gltf.scene.clone()
  flower_1.position.set(-50, 0, 100)
  flower_2.position.set(-50, 0.04, 230)
  flower_3.position.set(-100, 0, 100)
  flower_4.position.set(-100, 0.04, 230)
  scene.add(flower_1, flower_2, flower_3, flower_4)

})

// Talking Girl to Raju
let girl = null
gltfLoader.load('/models/student_green_talking_standing.glb', (gltf) => {
  gltf.scene.scale.set(15, 15, 15)
  gltf.scene.position.set(-84, 0.04, 160)
  gltf.scene.rotation.y = Math.PI / 2
  girl = gltf.scene
  scene.add(girl)
  const mixer = new THREE.AnimationMixer(girl)
  const action = mixer.clipAction(gltf.animations[0])
  action.play()
  mixers.push(mixer)
})

// Raju talking to girl
let raju = null
gltfLoader.load('/models/talking_baju_merah.glb', (gltf) => {
  gltf.scene.scale.set(15, 15, 15)
  gltf.scene.position.set(-80, 0.04, 150)
  raju = gltf.scene
  scene.add(raju)
  const mixer = new THREE.AnimationMixer(raju)
  const action = mixer.clipAction(gltf.animations[0])
  action.play()
  mixers.push(mixer)
})

// Bee
let bee_1 = null
gltfLoader.load('/models/bee_bee_animals/scene.gltf', (gltf) => {
  gltf.scene.scale.set(0.2, 0.2, 0.2)
  gltf.scene.rotation.y = -Math.PI / 2
  bee_1 = gltf.scene
  bee_1.position.set(45, 30, 150)
  scene.add(bee_1)

  const mixer = new THREE.AnimationMixer(gltf.scene)
  const action = mixer.clipAction(gltf.animations[1])
  action.play()
  mixers.push(mixer)
})

// Girl standing at skills
let skill_girl = null
gltfLoader.load('/models/1221-black/scene.gltf', (gltf) => {
  gltf.scene.scale.set(15, 15, 15)
  gltf.scene.position.set(120, 0.05, 190)
  gltf.scene.rotation.y = Math.PI / 2
  skill_girl = gltf.scene
  scene.add(skill_girl)

  const mixer = new THREE.AnimationMixer(skill_girl)
  const action = mixer.clipAction(gltf.animations[0])
  action.play()
  mixers.push(mixer)
})


// Wolf
let wolf = null
gltfLoader.load('/models/low_poly_wolf.glb', (gltf) => {
  gltf.scene.scale.set(22, 22, 22)
  wolf = gltf.scene
  scene.add(wolf)
  wolf.position.set(-200, 30, 154)
  const mixer = new THREE.AnimationMixer(wolf)
  const action = mixer.clipAction(gltf.animations[3])
  action.play()
  mixers.push(mixer)
})

// Dog
let defaultAction, action_1, action_2, action_3, action_4
let isPlaying = false
gltfLoader.load('/models/dog.glb', (gltf) => {
  gltf.scene.scale.set(25, 25, 25)
  gltf.scene.rotation.y = -Math.PI / 2
  gltf.scene.position.set(160, 0.05, 140)
  dog = gltf.scene
  scene.add(dog)
  const mixer = new THREE.AnimationMixer(dog)
  defaultAction = mixer.clipAction(gltf.animations[3])
  action_1 = mixer.clipAction(gltf.animations[0])
  action_2 = mixer.clipAction(gltf.animations[1])
  action_3 = mixer.clipAction(gltf.animations[2])
  action_4 = mixer.clipAction(gltf.animations[4])
  mixer.addEventListener('finished', function () {
    stopAnimation()
  })
  defaultAction.play()
  mixers.push(mixer)
})

/**
 * Project Houses
 */
let house_1 = null
let house_2 = null
let house_3 = null
let house_4 = null
let house_5 = null
gltfLoader.load('/models/house_1.glb', (gltf) => {
  gltf.scene.scale.set(3, 3, 5)
  house_1 = gltf.scene.clone()
  house_2 = gltf.scene.clone()
  house_3 = gltf.scene.clone()
  house_4 = gltf.scene.clone()
  house_4.scale.z = 6
  house_5 = gltf.scene.clone()
  house_5.scale.z = 6
  house_1.position.set(-250, 0, -15)
  house_2.position.set(250, 0, -35)
  house_3.position.set(-50, 0, -200)
  house_4.position.set(50, 0, -175)
  house_5.position.set(-350, 0, -210)

  house_2.rotation.y = Math.PI
  house_3.rotation.y = Math.PI
  house_5.rotation.y = Math.PI

  scene.add(house_1, house_2, house_3, house_4, house_5)
  checkModelLoaded()
})

// Flying Bird
let bird = null
gltfLoader.load('/models/quetzal_animation__texture_test.glb', (gltf) => {
  gltf.scene.scale.set(2, 2, 2)
  gltf.scene.rotation.y = -Math.PI / 2
  gltf.scene.position.set(0, 100, 0)
  bird = gltf.scene
  scene.add(bird)
  const mixer = new THREE.AnimationMixer(bird)
  const action = mixer.clipAction(gltf.animations[0])
  action.play()
  mixers.push(mixer)
})

let amplitude = 10; // Adjust the amplitude of the sine wave
let frequency = 0.002; // Adjust the frequency of the sine wave
let rotationSpeed = 0.01; // Adjust the rotation speed
let rotationFlag = 1;

// Function to update bird's position and rotation in a sine wave motion
function updateBirdPosition() {
  if (bird) {
    bird.position.y = amplitude * Math.sin(performance.now() * frequency) + 80
    if (rotationFlag === 1) {
      bird.position.x -= 1
    } else {
      bird.position.x += 1
    }

    if (bird.position.x < -700 && rotationFlag === 1) {
      bird.rotation.y += rotationSpeed;
      if (bird.rotation.y >= Math.PI / 2) {
        rotationFlag = -1; // Set flag to rotate in the opposite direction
      }
    }
    else if (bird.position.x > 700 && rotationFlag === -1) {
      bird.rotation.y -= rotationSpeed;
      if (bird.rotation.y <= -Math.PI / 2) {
        rotationFlag = 1; // Set flag to rotate in the original direction
      }
    }
  }
}

// Sunflower
let sunflower_1 = null
let sunflower_2 = null
gltfLoader.load('/models/Sunflower.glb', (gltf) => {
  gltf.scene.scale.set(12, 12, 12)
  gltf.scene.rotation.y = -Math.PI / 2
  sunflower_1 = gltf.scene.clone()
  sunflower_2 = gltf.scene.clone()
  sunflower_1.position.set(-20, 15, 0)
  sunflower_2.position.set(20, 15, 0)
  scene.add(sunflower_1, sunflower_2)
})

// Indian Flag
gltfLoader.load('/models/india.glb', (gltf) => {
  gltf.scene.scale.set(10, 10, 10)
  gltf.scene.position.set(0, 40, -14)
  gltf.scene.rotation.y = Math.PI / 2
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 32, 20), new THREE.MeshBasicMaterial({ color: 'black' }))
  tube.position.set(0, 15, 0)
  const flag = new THREE.Group()
  flag.add(tube, gltf.scene)
  scene.add(flag)
  flag.position.set(-140, 0, 180)
  const mixer = new THREE.AnimationMixer(gltf.scene)
  const action = mixer.clipAction(gltf.animations[0])
  action.play()
  mixers.push(mixer)
})

let gauravText = null
let webText = null
let skillsText = null
let contactText = null
let projectBoard = null
let projectBoard_2 = null
let projectBoard_3 = null
let facebookBoard = null
let linkedinBoard = null
let instagramBoard = null
let gmailBoard = null
/**
 * Font Loading
 */
fontLoader.load('/fonts/helvetiker_regular.typeface.json',
  (font) => {
    // Material
    const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

    // Text
    const gauravTextGeometry = createTextGeometry('GAURAV SHARMA', font)
    const webTextGeometry = createTextGeometry('Web & Android Developer', font)
    const skillsTextGeometry = createTextGeometry('SKILLS', font)
    const mySkillsTextGeometry_1 = createTextGeometry('HTML  CSS  JAVASCRIPT  JAVA  C', font)
    const mySkillsTextGeometry_2 = createTextGeometry('C++  KOTLIN  pHP  MERN  THREEJS', font)
    const connectTextGeometry = createTextGeometry('Connect', font)
    const connectAboutTextGeometry = createTextGeometry('Socialmedia Application', font)
    const connectAbout_Textgeometry = createTextGeometry('Using MERN + Socket.io', font)
    const four04NoMoreTextGeometry = createTextGeometry('404NoMore', font)
    const four04NoMoreAboutTextGeometry = createTextGeometry('Community Application', font)
    const four04NoMore_About_Textgeometry = createTextGeometry('Using MERN + Material UI', font)
    const collegeTextGeometry = createTextGeometry('SCSE', font)
    const collegeTextAboutGeometry = createTextGeometry('College Application', font)
    const collegeTextAbout_Geometry = createTextGeometry('Java + Android', font)
    const mvTextGeometry = createTextGeometry('MV Player', font)
    const mvTextAboutGeometry = createTextGeometry('Music Video Player', font)
    const mvTextAbout_Geometry = createTextGeometry('Java + Android', font)
    const comingTextGeometry = createTextGeometry('Coming Soon', font)
    const comingAboutTextGeometry = createTextGeometry('*************', font)
    const contactTextGeometry = createTextGeometry('CONTACT', font)

    // Displaying Gaurav
    gauravText = createText(gauravTextGeometry, 30, (Math.PI / 2))
    gauravText.position.set(-200, 14, 256)

    // Displaying Web Developer
    webText = createText(webTextGeometry, 20, (Math.PI / 2))
    webText.position.set(-180, 0.4, 246)

    // Displaying Skills
    skillsText = createText(skillsTextGeometry, 25, (-Math.PI / 2))
    skillsText.position.set(50, 0.04, 130)

    // Displaying My Skills 1
    const mySkillsText_1 = createText(mySkillsTextGeometry_1, 15, (-Math.PI / 2))
    mySkillsText_1.position.set(208, 25, 80)

    // Displaying My Skills 2
    const mySkillsText_2 = createText(mySkillsTextGeometry_2, 15, (-Math.PI / 2))
    mySkillsText_2.position.set(188, 10, 80)

    // Display Contact Me
    contactText = createText(contactTextGeometry, 25, (Math.PI / 2))
    contactText.position.set(-340, 0.04, 230)

    // Display Connect Text
    const connectText = createText(connectTextGeometry, 20, (Math.PI / 2))
    connectText.position.set(-220, 0.04, 20)

    // Display COnnect About
    const connectAbouText = createText(connectAboutTextGeometry, 9, (Math.PI / 2))
    connectAbouText.position.set(-230, 54, 5)

    const connectAbout_Text = createText(connectAbout_Textgeometry, 9, (Math.PI / 2))
    connectAbout_Text.position.set(-230, 54, 5)
    connectAbout_Text.visible = false

    // Display 404NoMore
    const four04NoMoreText = createText(four04NoMoreTextGeometry, 20, (-Math.PI / 2))
    four04NoMoreText.position.set(220, 0, -64)

    const four04NoMoreAboutText = createText(four04NoMoreAboutTextGeometry, 9, (-Math.PI / 2))
    four04NoMoreAboutText.position.set(230, 52, -54)

    const four04NoMoreAbout_Text = createText(four04NoMore_About_Textgeometry, 8, (-Math.PI / 2))
    four04NoMoreAbout_Text.position.set(230, 52, -54)
    four04NoMoreAbout_Text.visible = false

    // Display College
    const collegeText = createText(collegeTextGeometry, 20, (-Math.PI / 2))
    collegeText.position.set(-80, 0, -230)
    const collegeAboutText = createText(collegeTextAboutGeometry, 9, (-Math.PI / 2))
    collegeAboutText.position.set(-70, 52, -218)
    const collegeAbout_Text = createText(collegeTextAbout_Geometry, 9, (-Math.PI / 2))
    collegeAbout_Text.position.set(-70, 52, -218)
    collegeAbout_Text.visible = false

    // Display MV Player
    const mvText = createText(mvTextGeometry, 20, (Math.PI / 2))
    mvText.position.set(80, 0, -138)
    const mvaboutText = createText(mvTextAboutGeometry, 9, (Math.PI / 2))
    mvaboutText.position.set(70, 52, -164)
    const mvabout_Text = createText(mvTextAbout_Geometry, 9, (Math.PI / 2))
    mvabout_Text.position.set(70, 52, -164)
    mvabout_Text.visible = false

    // Display Coming Soon
    const comingText = createText(comingTextGeometry, 20, (-Math.PI / 2))
    const comingAboutText = createText(comingAboutTextGeometry, 9, (-Math.PI / 2))
    comingText.position.set(-380, 0, -228)
    comingAboutText.position.set(-370, 52, -210)

    scene.add(gauravText, webText, skillsText, mySkillsText_1, mySkillsText_2,
      contactText, connectText, connectAbouText, connectAbout_Text, four04NoMoreText,
      four04NoMoreAboutText, four04NoMoreAbout_Text, collegeText, collegeAboutText,
      collegeAbout_Text, mvText, mvaboutText, mvabout_Text, comingText, comingAboutText)

    switchText()
    function switchText() {
      if (connectAbouText && connectAbout_Text
        && four04NoMoreAboutText && four04NoMoreAbout_Text
        && mvaboutText && mvabout_Text && collegeAboutText &&
        collegeAbout_Text) {
        connectAbouText.visible = !connectAbouText.visible
        connectAbout_Text.visible = !connectAbout_Text.visible
        four04NoMoreAboutText.visible = !four04NoMoreAboutText.visible
        four04NoMoreAbout_Text.visible = !four04NoMoreAbout_Text.visible
        mvaboutText.visible = !mvaboutText.visible
        mvabout_Text.visible = !mvabout_Text.visible
        collegeAbout_Text.visible = !collegeAbout_Text.visible
        collegeAboutText.visible = !collegeAboutText.visible
      }
      setTimeout(switchText, 5000)
    }

    // Create Ground Boards
    projectBoard = createSignBoards(font, 'Projects', 5, 0, 0)
    projectBoard.position.set(40, 0, 25)

    projectBoard_2 = createSignBoards(font, 'Projects', 5, 0, Math.PI / 2)
    projectBoard_2.position.set(30, 0, -125)

    projectBoard_3 = createSignBoards(font, 'Projects', 5, 0, -Math.PI / 2)
    projectBoard_3.position.set(-250, 0, -125)

    /**
     * Contact Me Boards
     */
    facebookBoard = createSignBoards(font, 'Facebook', 4, 0, Math.PI / 2)
    facebookBoard.position.set(-550, 0, 200)

    instagramBoard = createSignBoards(font, 'Instagram', 4, 0, Math.PI / 2)
    instagramBoard.position.set(-550, 0, 160)

    linkedinBoard = createSignBoards(font, 'Linkedin', 5, 0, Math.PI / 2)
    linkedinBoard.position.set(-550, 0, 120)

    gmailBoard = createSignBoards(font, 'Email', 5, 0, Math.PI / 2)
    gmailBoard.position.set(-550, 0, 80)
    scene.add(projectBoard, projectBoard_2, projectBoard_3, facebookBoard, instagramBoard, linkedinBoard, gmailBoard)
  }
)

/**
 * Creating Objects
 */
const groundGeometry = new THREE.PlaneGeometry(1000, 1500)
const geometryMaterial = new THREE.MeshStandardMaterial({
  map: grassTexture
})
const field = new THREE.Mesh(
  groundGeometry,
  geometryMaterial)
field.rotation.x = -Math.PI / 2
field.position.set(-100, 0.01, -100)
scene.add(field)

const field1 = new THREE.Mesh(
  groundGeometry,
  geometryMaterial)
field1.rotation.x = -Math.PI / 2
field1.position.set(-900, 0.01, -100)
scene.add(field1)

const field2 = new THREE.Mesh(
  groundGeometry,
  geometryMaterial)
field2.rotation.x = -Math.PI / 2
field2.position.set(900, 0.01, -100)
scene.add(field2)

const roadGeometry = new THREE.PlaneGeometry(40, 600)
const roadMaterial = new THREE.MeshStandardMaterial({ map: roadTexture })
const road_1 = new THREE.Mesh(roadGeometry, roadMaterial)
road_1.rotation.x = -Math.PI / 2
road_1.position.set(0, 0.02, 0)
scene.add(road_1)

const road_2 = new THREE.Mesh(roadGeometry, roadMaterial)
road_2.rotation.x = -Math.PI / 2
road_2.position.set(-300, 0.02, 0)
scene.add(road_2)

const road_3 = new THREE.Mesh(roadGeometry, roadMaterial)
road_3.rotation.x = -Math.PI / 2
road_3.position.set(-600, 0.02, 0)
scene.add(road_3)

const horizontalRoadGeometry = new THREE.PlaneGeometry(40, 900)
const horizontalRoadMaterial = new THREE.MeshStandardMaterial({ map: roadTexture })
const road_4 = new THREE.Mesh(horizontalRoadGeometry, roadMaterial)
road_4.rotation.x = -Math.PI / 2
road_4.rotation.z = -Math.PI / 2
road_4.position.set(-170, 0.03, 50)
scene.add(road_4)

const road_5 = new THREE.Mesh(horizontalRoadGeometry, horizontalRoadMaterial)
road_5.rotation.x = -Math.PI / 2
road_5.rotation.z = -Math.PI / 2
road_5.position.set(-170, 0.03, 280)
scene.add(road_5)

const road_6 = new THREE.Mesh(horizontalRoadGeometry, horizontalRoadMaterial)
road_6.rotation.x = -Math.PI / 2
road_6.rotation.z = -Math.PI / 2
road_6.position.set(-170, 0.03, -280)
scene.add(road_6)

const road_7 = new THREE.Mesh(horizontalRoadGeometry, horizontalRoadMaterial)
road_7.rotation.x = -Math.PI / 2
road_7.rotation.z = -Math.PI / 2
road_7.position.set(-170, 0.03, -100)
scene.add(road_7)

const road_8 = new THREE.Mesh(roadGeometry, roadMaterial)
road_8.rotation.x = -Math.PI / 2
road_8.position.set(300, 0.02, 0)
scene.add(road_8)


const geometry = new THREE.TorusGeometry(10, 0.53, 10, 100);
const particlesmaterial = new THREE.PointsMaterial({ color: 0xffff00, size: 0.01 });
const particlesRing = new THREE.Points(geometry, particlesmaterial);
particlesRing.position.set(-215, 10, -50)
particlesRing.rotation.x = Math.PI / 2

const userCircle_1 = entryCircle()
userCircle_1.position.set(-215, 0.9, -50)

const userCircle_2 = entryCircle()
userCircle_2.position.set(215, 0.9, 18)

const userCircle_3 = entryCircle()
userCircle_3.position.set(-80, 0.9, -168)

const userCircle_4 = entryCircle()
userCircle_4.position.set(85, 0.9, -218)

const userCircle_5 = entryCircle()
userCircle_5.position.set(-400, 0.9, -168)
scene.add(userCircle_1, userCircle_2, userCircle_3, userCircle_4, userCircle_5)

const connectClick = createClickMe()
connectClick.rotation.y = Math.PI / 2
connectClick.position.set(-230, 23, -53)
connectClick.addEventListener('click', () => {
  window.open('https://connect-cdgy.onrender.com/', '_blank')
})

const four04Click = createClickMe()
four04Click.rotation.y = -Math.PI / 2
four04Click.position.set(230, 23, 3)
four04Click.addEventListener('click', () => {
  window.open('https://four04nomore.onrender.com/#/', '_blank')
})

scene.add(connectClick, four04Click)
// WindMIll Add On Shape
const coverMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
let aboutTextCover = new THREE.Mesh(new THREE.BoxGeometry(30, 40, 180, 20), coverMaterial)
aboutTextCover.position.set(-190, 20, 165)

let skillsCover = new THREE.Mesh(new THREE.BoxGeometry(30, 45, 180, 20), coverMaterial)
skillsCover.position.set(200, 20, 165)

let skillCover = new THREE.Mesh(new THREE.BoxGeometry(8, 12, 50, 10), coverMaterial)
skillCover.position.set(47, 25, 155)

let contactCover = new THREE.Mesh(new THREE.BoxGeometry(8, 12, 75, 10), coverMaterial)
contactCover.position.set(-340, 25, 190)
scene.add(aboutTextCover, skillsCover, skillCover, contactCover)

// Project 1 Description
const text_1 = 'Connect is a social media application/n--> Allow post content/n--> Make new friends/n--> Real Time Chat/n--> Interact with Posts/n--> Fully Responsive'
const connectGround = createProjectDescriptionGround(text_1)
connectGround.position.set(-160, 0.5, -25)
connectGround.rotation.set(-Math.PI / 2, 0, Math.PI / 2)

// Project 2 Description
const text_2 = '404NoMore is a community application/n--> Allow users to ask questions/n--> Other users answer question/n--> Knowledge Sharing/n--> Provides beautiful editor/n--> Fully Responsive'
const four04Ground = createProjectDescriptionGround(text_2)
four04Ground.position.set(160, 0.5, -24)
four04Ground.rotation.set(-Math.PI / 2, 0, -Math.PI / 2)

// Project 3 Description
const text_3 = 'SCSE is a college application/n--> Allows student to check latest notices/n--> Download or view question papers/n--> Comes with College Admin App/n--> Admin App controls everything/n--> Admin post notices and PYQs'
const collegeGround = createProjectDescriptionGround(text_3)
collegeGround.position.set(-140, 0.5, -190)
collegeGround.rotation.set(-Math.PI / 2, 0, -Math.PI / 2)
scene.add(four04Ground, connectGround, collegeGround)

// Project 4 Description
const text_4 = 'MV Player is android application/n--> Allows user to play audio/n--> Allow user to play video/n--> Plays music in background/n Uses ExoPlayer API'
const mvGround = createProjectDescriptionGround(text_4)
mvGround.position.set(140, 0.5, -180)
mvGround.rotation.set(-Math.PI / 2, 0, Math.PI / 2)

// COntact Me Description
const text_5 = 'Click on the boards to access my/nSocial Media and connect with me'
const contactGround = createProjectDescriptionGround(text_5)
contactGround.position.set(-480, 0.1, 160)
contactGround.rotation.set(-Math.PI / 2, 0, Math.PI / 2)

scene.add(four04Ground, connectGround, collegeGround, mvGround, contactGround)


// Set up the camera
const camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 280, 300);

// Creating Base for Gaurav Sharma
const base = createBase(180, 14, 16)
base.position.set(-200, 0.4, 255)
base.rotation.y = Math.PI / 2

// Base for skills  line 1
const base_skill_1 = createBase(180, 24, 14)
base_skill_1.position.set(200, 0.4, 255)
base_skill_1.rotation.y = Math.PI / 2

const base_skill_2 = createBase(180, 10, 14)
base_skill_2.position.set(185, 0.4, 255)
base_skill_2.rotation.y = Math.PI / 2
scene.add(camera, base, base_skill_1, base_skill_2)

// TV for About
const conectTV = new THREE.Mesh(new THREE.PlaneGeometry(82, 28, 2), new THREE.MeshBasicMaterial({ color: 'red' }))
conectTV.position.set(-230, 55, -27)
conectTV.rotation.y = Math.PI / 2

const four04TV = new THREE.Mesh(new THREE.PlaneGeometry(82, 28, 2), new THREE.MeshBasicMaterial({ color: 'red' }))
four04TV.position.set(230, 55, -23)
four04TV.rotation.y = -Math.PI / 2

const collegeTV = new THREE.Mesh(new THREE.PlaneGeometry(82, 28, 2), new THREE.MeshBasicMaterial({ color: 'red' }))
collegeTV.position.set(-70, 55, -188)
collegeTV.rotation.y = -Math.PI / 2

const mvplayerTV = new THREE.Mesh(new THREE.PlaneGeometry(82, 28, 2), new THREE.MeshBasicMaterial({ color: 'red' }))
mvplayerTV.position.set(70, 55, -192)
mvplayerTV.rotation.y = Math.PI / 2

const comingTV = new THREE.Mesh(new THREE.PlaneGeometry(82, 28, 2), new THREE.MeshBasicMaterial({ color: 'red' }))
comingTV.position.set(-370, 55, -188)
comingTV.rotation.y = -Math.PI / 2

scene.add(conectTV, four04TV, collegeTV, mvplayerTV, comingTV)

/**
 * Adding Lights
 */
const light = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(light)

// Orbit Controls
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true
orbitControls.minDistance = 40
orbitControls.maxDistance = 55
orbitControls.enablePan = false
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05
orbitControls.update();

// Man
let characterControls;

gltfLoader.load('/models/character/boy.glb',
  (gltf) => {
    gltf.scene.scale.set(15, 15, 15)
    character = gltf.scene;
    character.traverse(function (object) {
      if (object.isMesh) object.castShadow = true;
    });
    character.position.set(0, 0.1, 0)
    scene.add(character);

    const gltfAnimations = gltf.animations;
    const mixer = new THREE.AnimationMixer(character);
    const animationsMap = new Map();
    gltfAnimations
      .forEach((a) => {
        animationsMap.set(a.name, mixer.clipAction(a))
      })

    characterControls = new CharacterControls(character, mixer, animationsMap, orbitControls, camera, 'CharacterArmature|Idle');
  })

// CONTROL KEYS
const keysPressed = {}
const keyDisplayQueue = new KeyDisplay();
document.addEventListener('keydown', function (event) {
  keyDisplayQueue.down(event.key)
  keysPressed[event.key] = true

}, false);

document.addEventListener('keyup', function (event) {
  keyDisplayQueue.up(event.key)
  keysPressed[event.key] = false
}, false);
// handle resizing of Window
window.addEventListener('resize', (e) => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update Camera aspect
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update Renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Handle the Touch Screen Controls
const buttons = document.querySelectorAll('div')

buttons.forEach((button)=>{
  button.addEventListener('touchstart',()=>{
    if(button.textContent==='w'){
      keyDisplayQueue.down('w')
      keysPressed['w'] = true
    }
    else if(button.textContent==='a'){
      keyDisplayQueue.down('a')
      keysPressed['a'] = true
    }
    else if(button.textContent==='s'){
      keyDisplayQueue.down('s')
      keysPressed['s'] = true
    }
    else if(button.textContent==='d'){
      keyDisplayQueue.down('d')
      keysPressed['d'] = true
    }
  })

    button.addEventListener('touchend',()=>{
      if(button.textContent==='w'){
        keyDisplayQueue.up('w')
        keysPressed['w'] = false
      }
      else if(button.textContent==='a'){
        keyDisplayQueue.up('a')
        keysPressed['a'] = false
      }
      else if(button.textContent==='s'){
        keyDisplayQueue.up('s')
        keysPressed['s'] = false
      }
      else if(button.textContent==='d'){
        keyDisplayQueue.up('d')
        keysPressed['d'] = false
      }
    })

})


// Full Screen mode
window.addEventListener('dblclick', () => {
  const fullScreenElement = document.fullscreenElement || document.webkitFullscreenElement
  if (!fullScreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    }
    else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen()
    }
  }
  else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
    else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }
})

const renderer = new THREE.WebGLRenderer({
  canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
const clock = new THREE.Clock()
let previousTime = 0

const animate = () => {
  const currentTime = clock.getElapsedTime()
  let deltaTime = currentTime - previousTime
  previousTime = currentTime

  for (let mixer of mixers) {
    if (mixer != null) {
      mixer.update(deltaTime)
    }
  }
  if (characterControls) {
    characterControls.update(deltaTime, keysPressed);
  }
  orbitControls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
  castRays()
  checkProximityToDog()
  updateBirdPosition()
  renderer.setClearColor(new THREE.Color('#77BAEF'))
}
animate()

// Character Rays
function castRays() {
  const rayDirections = [
    new THREE.Vector2(0, 1),
    new THREE.Vector2(1, 0),
    new THREE.Vector2(0, -1),
    new THREE.Vector2(-1, 0)
  ]
  const objects = [house_1, house_2, house_3, house_4, house_5,
    windmill_1, windmill_2, aboutTextCover, skillCover, skillsCover,
    projectBoard, projectBoard_2, projectBoard_3, facebookBoard,
    linkedinBoard, instagramBoard, gmailBoard, contactCover, girl, raju,
    sunflower_1, sunflower_2]
  const canMove = [true, true, true, true]
  if (character) {
    const origin = character.position.clone()
    origin.y = 25
    rayDirections.forEach((direction, i) => {
      raycaster.set(origin, new THREE.Vector3(direction.x, 0, direction.y).normalize())
      raycaster.far = 20
      try {
        const intersects = raycaster.intersectObjects(objects)
        if (intersects.length > 0) {
          canMove[i] = false
        }
      } catch (error) {

      }
    })
  }
  if (!canMove[0]) {
    character.position.z -= 1
  }
  else if (!canMove[1]) {
    character.position.x -= 1
  }
  else if (!canMove[2]) {
    character.position.z += 1
  }
  else if (!canMove[3]) {
    character.position.x += 1
  }
}

// Check someone close to dog
function checkProximityToDog() {
  const raycaster = new THREE.Raycaster()
  raycaster.set(new THREE.Vector3(160, 10, 140), new THREE.Vector3(-1, 0, 0))
  raycaster.far = 40
  try {
    const intersect = raycaster.intersectObject(character)
    if (intersect.length > 0) {
      playRandomDogAnimation(action_1, action_2, action_3, action_4)
    }
    else {
      if (defaultAction) {
        defaultAction.play()
      }
    }
  } catch (error) {

  }

}

// Stop Dog Animation
export function stopAnimation() {
  isPlaying = false
}

// Play Dog Random animation 
export function playRandomDogAnimation(action_1, action_2, action_3, action_4) {
  if (!isPlaying) {
    isPlaying = true
    let animation = Math.floor((Math.random() * 4) + 1)
    switch (animation) {
      case 1:
        action_1.reset().play().setLoop(THREE.LoopOnce, 1)
        break
      case 2:
        action_2.reset().play().setLoop(THREE.LoopOnce, 1)
        break
      case 3:
        action_3.reset().play().setLoop(THREE.LoopOnce, 1)
      case 4:
        action_4.reset().play().setLoop(THREE.LoopOnce, 1)
        break
      default:
        break
    }
  }
}

export function onMouseClick(event, clickableMesh) {
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster()
  // Calculate mouse position in normalized device coordinates (-1 to +1) for raycasting
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  // Check for intersections with the clickable mesh
  const intersects = raycaster.intersectObject(clickableMesh);
  if (intersects.length > 0) {
    // Trigger the click event on the mesh
    clickableMesh.dispatchEvent({ type: 'click' });
  }
}

