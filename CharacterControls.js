import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { W, A, S, D, DIRECTIONS } from './util'

export class CharacterControls {
    constructor(model, mixer, animationsMap, orbitControl, camera, currentAction) {
        this.model = model
        this.mixer = mixer
        this.animationsMap = animationsMap
        this.currentAction = currentAction

        this.animationsMap.forEach((value, key) => {
            if (key == currentAction) {
                value.play()
            }
        })
        this.orbitControl = orbitControl
        this.camera = camera
        this.walkDirection = new THREE.Vector3()
        this.rotateAngle = new THREE.Vector3(0, 1, 0)
        this.rotateQuarternion = new THREE.Quaternion()
        this.cameraTarget = new THREE.Vector3()
        this.fadeDuration = 0.2
        this.updateCameraTarget(0, 0)
    }

    update(delta, keysPressed) {
        const directionPressed = DIRECTIONS.some(
            (key) => keysPressed[key] == true
        );
        let play = ''
        if (directionPressed) {
            play = 'CharacterArmature|Walk'
        } else {
            play = 'CharacterArmature|Idle'
        }

        if (this.currentAction != play) {
            const toPlay = this.animationsMap.get(play)
            const current = this.animationsMap.get(this.currentAction)

            current.fadeOut(this.fadeDuration)
            toPlay.reset().fadeIn(this.fadeDuration).play()

            this.currentAction = play
        }

        this.mixer.update(delta);

        if (this.currentAction == 'CharacterArmature|Walk') {
            // Angle between camera direction and model currrent direction in radians
            let angleYCameraDirection = Math.atan2(
                this.camera.position.x - this.model.position.x,
                this.camera.position.z - this.model.position.z
            )
            let directionOffset = this.directionOffset(keysPressed)

            // Rotate Model
            this.rotateQuarternion.setFromAxisAngle(
                this.rotateAngle,
                angleYCameraDirection + directionOffset
            )

            this.model.quaternion.rotateTowards(
                this.rotateQuarternion,
                0.2
            )

            // Calculate Direction
            this.camera.getWorldDirection(this.walkDirection)
            this.walkDirection.y = 0
            this.walkDirection.normalize()
            this.walkDirection.applyAxisAngle(
                this.rotateAngle,
                directionOffset
            )

            const velocity = 35

            const moveX = -(this.walkDirection.x * velocity * delta)
            const moveZ = -(this.walkDirection.z * velocity * delta)

            this.model.position.x = (this.model.position.x + moveX)
            this.model.position.z = (this.model.position.z + moveZ)

            this.updateCameraTarget(moveX, moveZ)
        }
    }

    updateCameraTarget(moveX, moveZ) {
        this.camera.position.x += moveX
        this.camera.position.z += moveZ

        this.cameraTarget.x = this.model.position.x
        this.cameraTarget.y = this.model.position.y + 1
        this.cameraTarget.z = this.model.position.z
        this.orbitControl.target = this.cameraTarget
    }

    // Find in which direction object move
    directionOffset(keysPressed) {
        let directionOffset = 0;

        if (keysPressed[W]) {
            if (keysPressed[A]) {
                directionOffset = -(Math.PI / 2 + Math.PI / 4);
            } else if (keysPressed[D]) {
                directionOffset = -(Math.PI + Math.PI / 4);
            }
            else {
                directionOffset = -Math.PI
            }
        } else if (keysPressed[S]) {
            if (keysPressed[A]) {
                directionOffset = -Math.PI / 4;
            } else if (keysPressed[D]) {
                directionOffset = Math.PI / 4;
            } else {
                directionOffset = 0;
            }
        } else if (keysPressed[A]) {
            directionOffset = -Math.PI / 2;
        } else if (keysPressed[D]) {
            directionOffset = Math.PI / 2;
        }
        return directionOffset;
    }

}