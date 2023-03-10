import { Component, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Texture,StandardMaterial, Scalar, Engine,DirectionalLight, ParticleSystem, Scene, ExecuteCodeAction, ActionManager, MeshBuilder,Vector3, HemisphericLight, ArcRotateCamera, SceneLoader, Color3} from '@babylonjs/core';
import { AdvancedDynamicTexture, Ellipse, Control } from '@babylonjs/gui/2D';
import "@babylonjs/loaders/glTF"
const log = console.log
let _canKeyPress = false
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})


export class GameComponent implements OnInit, AfterViewInit {
  @ViewChild('renderCanvas') canvas: any
  @ViewChild('startBtn') startBtn: any
  @ViewChild('gameOverCont') gameOverCont: any
  @ViewChild('again') againBtn: any
  @ViewChild('installGame') installGame: any
  @ViewChild('chooseControllerCont') chooseCont: any
  @ViewChild ('windDetail') windCaution: any
  @ViewChild ('guide') guide: any
  @ViewChild ('yesBtn') yesBtn: any
  @ViewChild ('noBtn') noBtn: any

  _engine: any
  _scene: any

  actionMode:any
  goingLeft:any
  goingRight:any
  onBoard:any
  boardMoving:any

  boardSpd:any
  windSpd:any
  windDir:any
  anims:any
  canKeyPress:any
  surfingTo:any
  isSurfing:any
  doNotMove:any
  steeringNum:any
  sharkRadius:any
  sharkRotatSpd:any
  isHunting:any
  sharKToChase:any
  falling:any
  boardInfo:any
  surferInfo:any
  killerInfo:any
  kiteInfo:any
  leftPuck:any
  leftThumbContainer:any
  isTilting:any
  // intervals
  changeWindInterv:any
  makeCloudInterv:any
  makingWaveInterv:any
  intervalForSplash:any
  intervalForSurferSplash:any
  constructor(){}

  ngOnInit():void{}

  setup(){
    // character and board speed
      this.boardSpd = -.03
  
      this.windSpd = .29
      this.windDir = 'left'
      this.anims = []
  
      this.canKeyPress = true
      this.boardMoving = false
      this.surfingTo = undefined
      this.isSurfing = false
      this.doNotMove = true
  
      this.steeringNum = 0
      this.sharkRadius = 79
      this.sharkRotatSpd = -.01
      this.isHunting = true
      this.sharKToChase = undefined
  
      this.goingRight = false
      this.goingLeft = false
      this.onBoard = true
      this.actionMode = "sitting"
      this.falling = false
  
      // MAIN MESH IN THE GAME
      this.boardInfo
      this.surferInfo
      this.killerInfo
      this.kiteInfo
  
      // joystick && tilting
      this.leftPuck // 
      this.leftThumbContainer // 
      this.isTilting = false
      // Intervals
      this.changeWindInterv
      this.makeCloudInterv
      this.makingWaveInterv
      this.intervalForSplash
      this.intervalForSurferSplash
  }
  setCamera(cam: ArcRotateCamera, meshTarg: any){
    const fPos = meshTarg.box.position
    cam.setTarget(new Vector3(fPos.x,fPos.y,fPos.z))
    cam.alpha = Math.PI + Math.PI/2
    cam.beta = .47
  }
  setUpCharacter(actionName: any, toParent: any, charBody: any, loc: any){

    this.actionMode = actionName

    charBody.parent = toParent
    charBody.position.y = loc.y
    charBody.position.z = loc.z
  }
  clearAllInterval(){
    clearInterval(this.changeWindInterv)
    clearInterval(this.makeCloudInterv)
    clearInterval(this.makingWaveInterv)
    clearInterval(this.intervalForSplash)
    clearInterval(this.intervalForSurferSplash)
  }
  goRight(farent: any, surferBody: any){
    this.goingLeft = false
    this.goingRight = true
    this.boardMoving = true
    if(this.onBoard) this.actionMode = "surfright"
    if(this.onBoard) farent.rotation.y = -1.29
    if(!this.onBoard) surferBody.rotation.y = -1.29
  }
  goLeft(farent: any, surferBody: any){
    this.goingRight = false
    this.goingLeft = true
    this.boardMoving = true
    if(this.onBoard) this.actionMode = "surfleft"
    if(this.onBoard) farent.rotation.y = 1.29
    if(!this.onBoard) surferBody.rotation.y = 1.29
  }
  createSplashSmall(scene: Scene){
    const box = MeshBuilder.CreateBox("asd", {size: .5}, scene)
    let boardSplashJson = {"name":"CPU particle system","id":"default system","capacity":10000,"disposeOnStop":false,"manualEmitCount":-1,"emitter":[0,0,0],"particleEmitterType":{"type":"CylinderParticleEmitter","radius":1,"height":0.5,"radiusRange":1,"directionRandomizer":1},"texture":{"tags":null,"url":"https://assets.babylonjs.com/textures/flare.png","uOffset":0,"vOffset":0,"uScale":1,"vScale":1,"uAng":0,"vAng":0,"wAng":0,"uRotationCenter":0.5,"vRotationCenter":0.5,"wRotationCenter":0.5,"homogeneousRotationInUVTransform":false,"isBlocking":true,"name":"https://assets.babylonjs.com/textures/flare.png","hasAlpha":false,"getAlphaFromRGB":false,"level":1,"coordinatesIndex":0,"optimizeUVAllocation":true,"coordinatesMode":0,"wrapU":1,"wrapV":1,"wrapR":1,"anisotropicFilteringLevel":4,"isCube":false,"is3D":false,"is2DArray":false,"gammaSpace":true,"invertZ":false,"lodLevelInAlpha":false,"lodGenerationOffset":0,"lodGenerationScale":0,"linearSpecularLOD":false,"isRenderTarget":false,"animations":[],"invertY":true,"samplingMode":3,"_useSRGBBuffer":false},"isLocal":false,"animations":[],"beginAnimationOnStart":false,"beginAnimationFrom":0,"beginAnimationTo":60,"beginAnimationLoop":false,"startDelay":0,"renderingGroupId":0,"isBillboardBased":true,"billboardMode":7,"minAngularSpeed":0,"maxAngularSpeed":0,"minSize":0.1,"maxSize":0.1,"minScaleX":2,"maxScaleX":1,"minScaleY":1,"maxScaleY":1,"minEmitPower":2,"maxEmitPower":2,"minLifeTime":1,"maxLifeTime":1.5,"emitRate":1000,"gravity":[0,1,10],"noiseStrength":[10,10,10],"color1":[0.12156862745098039,0.45098039215686275,0.403921568627451,1],"color2":[0.0196078431372549,0.1568627450980392,0.20784313725490197,1],"colorDead":[0.5372549019607843,0.5764705882352941,0.5686274509803921,1],"updateSpeed":0.029,"targetStopDuration":0,"blendMode":0,"preWarmCycles":0,"preWarmStepOffset":1,"minInitialRotation":0.01,"maxInitialRotation":0,"startSpriteCellID":0,"spriteCellLoop":true,"endSpriteCellID":0,"spriteCellChangeSpeed":1,"spriteCellWidth":0,"spriteCellHeight":0,"spriteRandomStartCell":false,"isAnimationSheetEnabled":false,"useLogarithmicDepth":false,"sizeGradients":[{"gradient":0,"factor1":0.1,"factor2":0.71},{"gradient":0.87,"factor1":0.1,"factor2":0.3},{"gradient":1,"factor1":0.009,"factor2":0.01}],"textureMask":[1,1,1,1],"customShader":null,"preventAutoStart":false}
    const splashPs = ParticleSystem.Parse(boardSplashJson, scene, "")
    splashPs.emitter = box
    splashPs.stop()
    box.isVisible = false
    return {box: box, ps: splashPs}
  }
  introStart(){
    this.actionMode = undefined
    this.playAnim(this.anims, "sittostand", false)

    const rotatingMesh = this._scene.getMeshByName("rotatingMesh")
    let sharkOpeningInterval:any
    clearInterval(sharkOpeningInterval)
    sharkOpeningInterval = setInterval(() => {
        if(!rotatingMesh) return log('rotating mesh not found')
        if(rotatingMesh.position.y <= 5) rotatingMesh.position.y+=.05
        if(rotatingMesh.position.y > 5) clearInterval(sharkOpeningInterval)
    },50)
    setTimeout(() => {
        this.doNotMove = false
        this.canKeyPress = true
        this.setUpCharacter('surfing', this.boardInfo.farent, this.surferInfo.surferBody, {z: 1, y: -4.5})
    }, 2000)
  }
  async main(){
    this.clearAllInterval()
    await this._goToStart()

    this._engine.runRenderLoop( () => {
        this._scene.render()
    })

    window.addEventListener("resize", e => {
        this._engine.resize()
    })
  }
  async _goToStart(){
    this.setup()
    
    let floatingWaters: any = []
    let leftWindz: any = []
    let rightWindz: any = []
    let waves: any = []

    const scene = new Scene(this._engine)
    const light = new HemisphericLight("lug", new Vector3(0,10,0), scene)
    const dirLight = new DirectionalLight("lug", new Vector3(2,-1,4), scene)
    const cam = new ArcRotateCamera("arc",-1,0,197, new Vector3(0,0,1), scene)
    // cam.attachControl(canvas, true)

    const { box, theFront, farent, boardSplashPS} = await this.createBoard(scene)
    
    this.createWaterThatLoops(scene, floatingWaters)

    this.setCamera(cam, theFront)

    // start of babylon js playground
    this.createSkyBox(scene)

    const windMat = this.createWindMat(scene, 'smoke.png')

    const  { surferPs, surferBody, surferPsmesh, surfer} = await this.createSurfer(farent,scene)

    const {Kite, theKite} = await this.createKite(scene)

    clearInterval(this.intervalForSurferSplash)
    this.intervalForSurferSplash = setInterval(() => {
        if(this.onBoard) return
        surferPs.emitRate = 500 + Math.random()* 500
        surferPs.start()
        surferPs.targetStopDuration = .5
    }, 2000)

    surferPsmesh.actionManager.registerAction(
      new ExecuteCodeAction(
          {
              trigger: ActionManager.OnIntersectionEnterTrigger, 
              parameter: { 
                  mesh: farent, 
                  usePreciseIntersection: true
              }
        }, () => { 
            if(this.falling) return log("i am falling stop climb")
            if(this.leftPuck !== undefined) this.leftPuck.isDown = false
            this.canKeyPress = false
            this.actionMode = "none"
            this.doNotMove = true
            const bPos = surferBody.getAbsolutePosition()
            farent.position = new Vector3(bPos.x,6.9,bPos.z)
            this.onBoard = true
            
            surferBody.lookAt(new Vector3(farent.position.x, surferBody.position.y, farent.position.z),0,0,0)
            this.playAnim(this.anims, 'climb', false)
            setTimeout(() =>{
                this.canKeyPress = true
                this.resetRotatAndDir(farent, surferBody)
                surferBody.parent = farent
                surferBody.position = new Vector3(0,0,3)

                this.boardSpd = -.03
                this.doNotMove = false
                this.setUpCharacter('surfing', farent, surferBody, {z: 4, y: -4.5})
            }, 1200)
        }
      )
    );
            
    this.setUpCharacter('sitting', farent, surferBody, {z: 4, y: -4.5})

    const {killerMesh,killerAnims, rotatingMesh} = await this.createKiller(scene, surferPsmesh)        

    await scene.whenReadyAsync()
    this._scene.dispose()
    this._scene = scene
    this.startBtn.style.display = "block"
    this._engine.hideLoadingUI()

    // changing wind direction every 7s
    this.changeWindInterv = setInterval(() => {
        this.sharkRotatSpd = Scalar.RandomRange(-.008,-.02)
        if(Math.random() > .1){
          if(this.windDir === "left"){
              setTimeout(() => this.windDir = "right", 1000)
              this.showPrecaution(4000, "incoming wind from right")
          }else{
              setTimeout(() =>this.windDir = "left", 1000)  
              this.showPrecaution(4000, "incoming wind from left")
          }
        }
    }, 7000)

    // making clouds
    this.makeCloudInterv = setInterval(() => {
      for (let win = 0; win < 5; win++) {
        const addSpd = Math.random()*.07
        const wind = MeshBuilder.CreateGround("wind", { height: 15, width: 90})
        wind.material = windMat
        wind.visibility = .2 + Math.random()*.3

        if(this.windDir === "left"){
            wind.position.x = Scalar.RandomRange(-170, -200);
        }else if(this.windDir === "right"){
            wind.position.x = Scalar.RandomRange(170, 200);
        }
        wind.position.y = Scalar.RandomRange(19,19);
        wind.position.z = Scalar.RandomRange(-80, 80);

        if(this.windDir === "left") leftWindz.push({mesh: wind, spd: addSpd})
        if(this.windDir === "right") rightWindz.push({mesh: wind, spd: addSpd})
        setTimeout(() => wind.dispose(), 10000)
      }
    }, 500)
      
    let bigSplashWaveJson = {"name":"CPU particle system","id":"default system","capacity":10000,"disposeOnStop":false,"manualEmitCount":-1,"emitter":[0,0,0],"particleEmitterType":{"type":"CylinderParticleEmitter","radius":1,"height":45,"radiusRange":1,"directionRandomizer":1},"texture":{"tags":null,"url":"https://assets.babylonjs.com/textures/flare.png","uOffset":0,"vOffset":0,"uScale":1,"vScale":1,"uAng":0,"vAng":0,"wAng":0,"uRotationCenter":0.5,"vRotationCenter":0.5,"wRotationCenter":0.5,"homogeneousRotationInUVTransform":false,"isBlocking":true,"name":"https://assets.babylonjs.com/textures/flare.png","hasAlpha":false,"getAlphaFromRGB":false,"level":1,"coordinatesIndex":0,"optimizeUVAllocation":true,"coordinatesMode":0,"wrapU":1,"wrapV":1,"wrapR":1,"anisotropicFilteringLevel":4,"isCube":false,"is3D":false,"is2DArray":false,"gammaSpace":true,"invertZ":false,"lodLevelInAlpha":false,"lodGenerationOffset":0,"lodGenerationScale":0,"linearSpecularLOD":false,"isRenderTarget":false,"animations":[],"invertY":true,"samplingMode":3,"_useSRGBBuffer":false},"isLocal":false,"animations":[],"beginAnimationOnStart":false,"beginAnimationFrom":0,"beginAnimationTo":60,"beginAnimationLoop":false,"startDelay":0,"renderingGroupId":0,"isBillboardBased":true,"billboardMode":7,"minAngularSpeed":0,"maxAngularSpeed":0,"minSize":0.1,"maxSize":0.1,"minScaleX":2,"maxScaleX":1,"minScaleY":1,"maxScaleY":1,"minEmitPower":2,"maxEmitPower":2,"minLifeTime":4,"maxLifeTime":4,"emitRate":1000,"gravity":[0,-4,0],"noiseStrength":[10,10,10],"color1":[0.00784313725490196,0.2823529411764706,0.2823529411764706,1],"color2":[0.0196078431372549,0.1568627450980392,0.20784313725490197,1],"colorDead":[0.13725490196078433,0.15294117647058825,0.23529411764705882,1],"updateSpeed":0.045,"targetStopDuration":0,"blendMode":0,"preWarmCycles":0,"preWarmStepOffset":1,"minInitialRotation":0.01,"maxInitialRotation":0,"startSpriteCellID":0,"spriteCellLoop":true,"endSpriteCellID":0,"spriteCellChangeSpeed":1,"spriteCellWidth":0,"spriteCellHeight":0,"spriteRandomStartCell":false,"isAnimationSheetEnabled":false,"useLogarithmicDepth":false,"sizeGradients":[{"gradient":0,"factor1":1,"factor2":1.5},{"gradient":0.5,"factor1":2,"factor2":2.5},{"gradient":1,"factor1":0.01,"factor2":0.5}],"textureMask":[1,1,1,1],"customShader":null,"preventAutoStart":false}
    const bigSplashWave = ParticleSystem.Parse(bigSplashWaveJson, scene, "")
        
    // making big waves
    this.makingWaveInterv = setInterval(() => {
        if(this.doNotMove) return
        const bigwavePsClone = bigSplashWave.clone('bigSplashWave', undefined, false)
        const forPSMesh = MeshBuilder.CreateBox("bigwave", {size: .5}, scene)
        bigwavePsClone.emitter = forPSMesh
        bigwavePsClone.emitRate = Scalar.RandomRange(400, 2000)
       
        const movingWave = MeshBuilder.CreateBox("movingWave", {size: 5.5, width: 34}, scene)
        forPSMesh.parent = movingWave
        forPSMesh.rotation.z = Math.PI/2
        forPSMesh.position.y += 4
        
        movingWave.position.x = Scalar.RandomRange(-95, 95);
        movingWave.position.z = Scalar.RandomRange(-90, -120);
        // movingWave.position.z = BABYLON.Scalar.RandomRange(-40, 60);
        movingWave.position.y = Scalar.RandomRange(2,2);
        
        waves.push({mesh: movingWave, spdRise: Math.random()*.1})
        movingWave.isVisible = false
        
        farent.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger, 
                    parameter: { 
                        mesh: movingWave, 
                        usePreciseIntersection: true
                    }
                }, () => {
                    if(!this.onBoard) return
                    farent.rotationQuaternion = null
                    if(this.goingLeft) farent.rotation = new Vector3(0,Math.PI/2,.76)
                    if(this.goingRight) farent.rotation = new Vector3(0,-Math.PI/2,-.76)

                    if(this.goingLeft && this.windDir === 'left') return this.fall()
                    if(this.goingRight && this.windDir === 'right') return this.fall()
                    if(!this.boardMoving && this.onBoard) return this.fall()
                    this.surfUp(movingWave)
                }
            )
        );
        farent.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionExitTrigger, 
                    parameter: { 
                        mesh: movingWave, 
                        usePreciseIntersection: true
                    }
                }, () => {
                    
                    if(!this.onBoard) return
                    if(this.onBoard){
                        farent.rotation.x = 0
                        farent.rotationQuaternion = null
   
                        farent.rotation.z = 0
                        farent.position.y = 6.9
                    }
                    log("farent left the wave")
                    this.surfDown()
                }
            )
        );
        setTimeout(() => {
            bigwavePsClone.dispose()
            movingWave.dispose()
        }, 50000)
    },5000)
    // bigSplashWave.disposeOnStop = true
    bigSplashWave.stop()
    this.showPrecaution(4000, "incoming wind from left")

    // this will run 40-60times per sec // run per Fps
    scene.registerBeforeRender(() => {
        this.loopEnvironment(waves, floatingWaters, leftWindz, rightWindz)

        if(this.actionMode !== undefined) this.playAnim(this.anims, this.actionMode, false)

        if(this.surfingTo) farent.position.z = this.surfingTo.getAbsolutePosition().z
        if(this.doNotMove) return
        if(this.falling){
            farent.addRotation(.09,0,0)
            farent.position.y -= .06
            
            surferBody.addRotation(.14,0,0)
            surferBody.position.y -= .06
            surferBody.position.z += .06
            return
        }
        // RELATED TO STEERING
        if(this.onBoard){
            const bodyPos = surferBody.getAbsolutePosition()
            this.kiteInfo.theKite.position.x = bodyPos.x
            this.kiteInfo.theKite.position.z = bodyPos.z - 15
            this.kiteInfo.theKite.position.y = bodyPos.y
            this.playAnim(this.kiteInfo.Kite.animationGroups, this.windDir, false)
            if(this.isHunting){
                this.playAnim(killerAnims, "hunting", false)
                this.killerInfo.rotatingMesh.addRotation(0,this.sharkRotatSpd,0)
            } 
            if(this.boardMoving){ 
                farent.locallyTranslate(new Vector3(0,0,this.boardSpd*this._engine.getDeltaTime()))
                if(this.goingLeft && this.windDir === 'left' || this.goingRight && this.windDir === 'right'){
                    log("nakikipag bang gaan ka")
                    if(this.boardSpd <= -.01) this.boardSpd = this.boardSpd + .01
                    this.stopAnim(this.anims, 'surfing')
                }else{
                    this.boardSpd = -.03
                }
            }else if(!this.boardMoving && this.surfingTo === undefined){ 
                if(farent.position.z < 60) farent.position.z += .4 
                this.windDir === "left" ? farent.position.x += this.windSpd : farent.position.x -= this.windSpd
            }
        }else if(!this.onBoard){
            if(farent.position.y < 6.8) farent.position.y += .05
            if(this.sharKToChase !== undefined){
                const surfPos = surferBody.getAbsolutePosition()
                killerMesh.lookAt(new Vector3(surfPos.x, killerMesh.position.y, surfPos.z),0,0,0)
                killerMesh.locallyTranslate(new Vector3(0,0,.3))
                this.playAnim(killerAnims, "charging", false)
            }
            this.playAnim(Kite.animationGroups, 'onsea', false)
            if(this.boardMoving){ 
                this.actionMode = "swimming"
                surferBody.locallyTranslate(new Vector3(0,0,this.boardSpd*this._engine.getDeltaTime()))
            }else{ 
                if(surferBody.position.z < 100) surferBody.position.z += .4 
            }
        }         
    })
    this._makeJoyStick(this.goLeft, this.goRight, boardSplashPS, theFront, farent, surferBody,surferPs, surferPsmesh)
    this.pressControllers(killerMesh, rotatingMesh, this.kiteInfo.Kite,boardSplashPS, theFront, farent, surferBody,surferPs, surferPsmesh)
    this.tiltControllers(boardSplashPS, farent, surferBody,surferPs, surferPsmesh)
  }
  initWin(){
    this.canKeyPress = false
    this.doNotMove = true
    this.actionMode = undefined
    this.goingLeft = false
    this.goingRight = false
    this.leftThumbContainer.isVisible = false

    this.playAnim(this.anims, "win", true)
  }
  makeThumbArea(name: any, thickness: any, color: any, background: any){
    let rect = new Ellipse();
    rect.name = name;
    rect.thickness = thickness;
    rect.color = color;
    rect.background = background;
    rect.paddingLeft = "0px";
    rect.paddingRight = "0px";
    rect.paddingTop = "0px";
    rect.paddingBottom = "0px";    
    
    return rect;
  }
  _makeJoyStick(goL:any, goR: any,boardSplashPS:any, theFront:any, farent:any, surferBody:any,surferPs:any, surferPsmesh:any){
      log(GameComponent)

      let adt = AdvancedDynamicTexture.CreateFullscreenUI("UI");
      let xAddPos = 0;
      let yAddPos = 0;
      let xAddRot = 0;
      let yAddRot = 0;
      let sideJoystickOffset = 50;
      let bottomJoystickOffset = -50;
      let translateTransform 
      let leftThumbContainer = GameComponent.prototype.leftThumbContainer
      leftThumbContainer = this.makeThumbArea("leftThumb", 2, "gray", null);
      leftThumbContainer.height = "120px";
      leftThumbContainer.width = "120px";
      leftThumbContainer.isPointerBlocker = true;
      leftThumbContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      leftThumbContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
      leftThumbContainer.alpha = 0.3;

      leftThumbContainer.left = sideJoystickOffset;
      leftThumbContainer.top = bottomJoystickOffset;

      let leftPuck = GameComponent.prototype.leftPuck
      leftPuck = this.makeThumbArea("leftPuck", 0, "blue", "black");
      leftPuck.height = "65px";
      leftPuck.width = "65px";
      leftPuck.isVisible = true
      leftPuck.left = 0
      leftPuck.isDown = true
      leftPuck.isPointerBlocker = true;
      leftPuck.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
      leftPuck.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

      leftThumbContainer.onPointerDownObservable.add(function(coordinates:any) {
        if(!GameComponent.prototype.canKeyPress) return log("your isCanKeyPress is false")

        leftPuck.isVisible = true;
        leftPuck.floatLeft = coordinates.x-(leftThumbContainer._currentMeasure.width*.5)-sideJoystickOffset;
        leftPuck.left = leftPuck.floatLeft;
        // leftPuck.floatTop = adt._canvas.height - coordinates.y-(leftThumbContainer._currentMeasure.height*.5)+bottomJoystickOffset;
        leftPuck.top = leftPuck.floatTop*-1;
        leftPuck.isDown = true;
        leftThumbContainer.alpha = 0.3;
        leftPuck.alpha = 1    
        console.log(leftPuck.isDown);
        console.log(leftPuck.isDown);
        // botMoving = true
      });

      leftThumbContainer.onPointerUpObservable.add(function(coordinates:any) {
          xAddPos = 0;
          yAddPos = 0;
          leftPuck.isDown = false;
          leftPuck.isVisible = false;
          leftThumbContainer.alpha = 0.2;

          // if(GameComponent.prototype.surfingTo !== undefined) return GameComponent.prototype.fall()
          
          // GameComponent.prototype.boardSpd = -.03
          // GameComponent.prototype.steeringNum = 0
          // if(GameComponent.prototype.onBoard){
          //     GameComponent.prototype.actionMode = "surfing"
          // }else{
          //     GameComponent.prototype.actionMode = "0sinking"
          // }
          // boardSplashPS.stop()
          // GameComponent.prototype.resetRotatAndDir(farent, surferBody)
          // clearInterval(GameComponent.prototype.intervalForSplash)
          // surferPsmesh.position.z = 0
          // surferPs.stop()
          
      });

      leftThumbContainer.onPointerMoveObservable.add(function(coordinates:any) {
        if (leftPuck.isDown) {
            xAddPos = coordinates.x-(leftThumbContainer._currentMeasure.width*.5)-sideJoystickOffset;
            // yAddPos = adt._canvas.height - coordinates.y-(leftThumbContainer._currentMeasure.height*.5)+bottomJoystickOffset;
            leftPuck.floatLeft = xAddPos;
            leftPuck.floatTop = yAddPos*-1;
            leftPuck.left = leftPuck.floatLeft;
            leftPuck.top = leftPuck.floatTop;
            // line code starts here
            // log(Object.getPrototypeOf(GameComponent))
            // GameComponent.prototype.boardMoving = true
            // GameComponent.prototype.goingLeft = false
            // GameComponent.prototype.goingRight = false
            surferPs.stop()

            // // if(!GameComponent.prototype.canKeyPress) return log('cankeypress false')
            // if(!GameComponent.prototype.boardMoving){
            
            //     clearInterval(GameComponent.prototype.intervalForSplash)
            //     GameComponent.prototype.intervalForSplash = setInterval(() => {
            //         theFront.ps.emitRate = 1000 + Math.random()* 1000
            //         theFront.ps.start()
            //         theFront.ps.targetStopDuration = .8 + Math.random()*.5
            //     }, 500)
                
            // } 
            surferPs.stop()
            if(xAddPos > 10){
                GameComponent.prototype.goLeft(farent, surferBody)
                boardSplashPS.stop()
            }
            if(xAddPos < -10) {
                GameComponent.prototype.goLeft(farent, surferBody)
                boardSplashPS.stop()
            }
        }       
      });

      adt.addControl(leftThumbContainer);
      leftThumbContainer.addControl(leftPuck);
      // leftThumbContainer.addControl(leftPuckCont);
      leftPuck.isVisible = true;
      // if(this._desktopMode)
      leftThumbContainer.isVisible = false
      GameComponent.prototype.leftThumbContainer = leftThumbContainer
      return
  }
  tiltControllers(boardSplashPS:any, farent:any, surferBody:any,surferPs:any, surferPsmesh:any){
    window.addEventListener("deviceorientation", e => {
        let beta:any = e.beta
        
        if(beta < 4 && beta > -4 && this.isTilting){
            if(!this.canKeyPress) return
            if(this.surfingTo !== undefined){
                log("will fall after keyup")
                return this.fall()
            } 
            
            this.boardSpd = -.03
            this.steeringNum = 0
            if(this.onBoard){
                log('We are on board so our action is surfing')
                this.actionMode = "surfing"
            }else{
                this.actionMode = "0sinking"
            }
            boardSplashPS.stop()
            this.resetRotatAndDir(farent, surferBody)
            clearInterval(this.intervalForSplash)
            surferPsmesh.position.z = 0
            surferPs.stop()
            
            return
        }
        if(beta > 5 && this.isTilting && this.canKeyPress) this.goRight(farent, surferBody)
        if(beta < 5 && this.isTilting && this.canKeyPress) this.goLeft(farent, surferBody)
    })
  }
  pressControllers(killerMesh:any, rotatingMesh:any, Kite:any,boardSplashPS:any, theFront:any, farent:any, surferBody:any,surferPs:any, surferPsmesh:any){
    window.addEventListener("keyup", e => {
        if(e.key === " "){
            log(surferBody.getAbsolutePosition())
        }
        if(!this.canKeyPress) return
        if(this.surfingTo !== undefined) return this.fall()
        
        if(e.key === "ArrowRight" || e.key === "ArrowLeft"){
            this.boardSpd = -.03
            this.steeringNum = 0
            if(this.onBoard){
                log('on board tayo kaya surfing dapat')
                this.actionMode = "surfing"
            }else{
                this.actionMode = "0sinking"
            }
            boardSplashPS.stop()
            this.resetRotatAndDir(farent, surferBody)
            clearInterval(this.intervalForSplash)
            surferPsmesh.position.z = 0
            surferPs.stop()
        }
    })
    window.addEventListener("keydown", e => {
     
        if(!this.canKeyPress) return log('cankeypress false')
        if(!this.boardMoving){
        
            clearInterval(this.intervalForSplash)
            this.intervalForSplash = setInterval(() => {
                theFront.ps.emitRate = 1000 + Math.random()* 1000
                theFront.ps.start()
                theFront.ps.targetStopDuration = .8 + Math.random()*.5
            }, 500)
        } 
        // if(!onBoard) surferPsmesh.position.z = -7.5
        surferPs.stop()
        if(e.key === "ArrowRight"){
            
            this.goRight(farent, surferBody )
            boardSplashPS.stop()
        }
        if(e.key === "ArrowLeft") {
  
            this.goLeft(farent, surferBody )
            boardSplashPS.stop()
        }
    })
  }
  loopEnvironment(waves:[], floatingWaters:[], leftWindz:[], rightWindz:[]){
    waves.forEach((wve: any) => {
        wve.mesh.locallyTranslate(new Vector3(0,0,.5))
        if(wve.mesh.position.y < 8.8) wve.mesh.position.y += wve.spdRise    
    })
    floatingWaters.forEach((fwater: any) => {
        fwater.mesh.locallyTranslate(new Vector3(0,0,fwater.spd))
        if(fwater.mesh.position.z > 150) fwater.mesh.position.z = -105
    })
    leftWindz.forEach((wnd: any) => {
        wnd.mesh.locallyTranslate(new Vector3(this.windSpd+wnd.spd*this._engine.getDeltaTime(),0,0))
    })
    rightWindz.forEach((wnd: any) => {
        wnd.mesh.locallyTranslate(new Vector3(-this.windSpd-wnd.spd*this._engine.getDeltaTime(),0,0))
    })
  }
  resetRotatAndDir(farent:any, surferBody: any){
    farent.rotationQuaternion = null
    farent.rotation = new Vector3(0,0,0)
    surferBody.rotationQuaternion = null
    surferBody.rotation = new Vector3(0,0,0)
    this.goingRight = false
    this.goingLeft = false
    this.boardMoving = false
    this.steeringNum = 0
  }
  showPrecaution(dura: number, mes: string){
    this.windCaution.innerHTML = mes
    this.windCaution.style.display = "block"
    setTimeout(() => {
        this.windCaution.style.display = "none"
    }, dura)
  }
  playAnim(anims: any, animName: string, isPerma: Boolean){
    anims.forEach( (ani:any) => ani.name === animName && ani.play(isPerma))
  }
  stopAnim(anims:any, animName:string){
    anims.forEach((ani:any) => ani.name === animName && ani.stop())
  }
  fall(){
    const {surferBody, surferPs} = this.surferInfo
    const {farent} = this.boardInfo

    let recoveryInterval:any
    this.actionMode = 'none'
    this.stopAnim(this.anims, 'surfing')
    this.surfingTo = undefined
    this.canKeyPress = false
    const fPos = farent.getAbsolutePosition()
    surferBody.parent = null
    surferBody.position = new Vector3(fPos.x, 0,fPos.z)
    this.falling = true
    this.kiteInfo.Kite.animationGroups.forEach((ani:any) => {
        if(ani.name === "falling"){
            ani.play()
        }else{
            ani.stop()
        }
    })
    
    surferPs.start()
    surferPs.targetStopDuration = .5

    setTimeout(() =>{
        const {killerMesh, rotatingMesh} = this.killerInfo
        const bPos = surferBody.getAbsolutePosition()
        this.resetRotatAndDir(farent, surferBody)
        farent.position.y = -5
        if(bPos.z > 35) surferBody.position.z = 34
        surferBody.position.y = -4
        this.boardSpd -.01
        this.falling = false 
        this.onBoard = false
        this.actionMode = "0sinking"
        this.canKeyPress = true
        this.steeringNum = 0
        
        this.sharkAlert(killerMesh, rotatingMesh, surferBody)
        clearInterval(recoveryInterval)
        recoveryInterval = setInterval(() => {
            if(this.onBoard) return clearInterval(recoveryInterval)
            if(surferBody.position.y < .6){
                surferBody.position.y += .09
                log('recovering')
            }else{
                clearInterval(recoveryInterval)
            }
        },100)
    }, 4000)
  }
  surfUp(farent:any){
    this.surfingTo = farent
    this.isSurfing = true
  }
  surfDown(){
    this.surfingTo = undefined
    this.isSurfing = false
  }
  sharkAlert(killerMesh: any, rotatingMesh: any, surferBody: any){
    const sharkPos = killerMesh.getAbsolutePosition()
    killerMesh.parent = null
    killerMesh.position = new Vector3(sharkPos.x, sharkPos.y,sharkPos.z)
    const surfPos = surferBody.getAbsolutePosition()
    killerMesh.lookAt(new Vector3(surfPos.x, killerMesh.position.y,surfPos.z),0,0,0)
    
    this.sharKToChase = surferBody
  }
    // CREATIONS
  createSkyBox(scene:Scene){
    // const skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
    // const skyboxMaterial = new StandardMaterial("skyBox", scene);
    // skyboxMaterial.backFaceCulling = false;
    // skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("https://assets.babylonjs.com/textures/TropicalSunnyDay", scene);
    // skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    // skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    // skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    // skyboxMaterial.disableLighting = true;
    // skybox.material = skyboxMaterial;
  }
  createWaters(length: number, toClone: any, floatingWaters: any, scene: Scene){
      for (let p = 0; p < length; p++) {
          const mySpd = .4 + Math.random()*.55
          const newWave = toClone.createInstance('newWave')
          const fId = Math.random().toString()
          newWave.parent = null
          newWave.position.x = Scalar.RandomRange(-205, 205);
          newWave.position.y = 5
          newWave.position.z = Scalar.RandomRange(-105, 155);
          newWave.actionManager = new ActionManager(scene)
          
          floatingWaters.push({_id: fId, spd: mySpd, mesh: newWave, isDown: Math.random() > .05 ? true : false })
      }
  }
  createWindMat(scene: Scene, image: string){
      var windMat = new StandardMaterial('spheremat', scene);
      windMat.useAlphaFromDiffuseTexture = true;
      // windMat.useSpecularOverAlpha = true;
      windMat.alphaCutOff = 0.1;
      windMat.diffuseTexture = new Texture(`assets/imagez/${image}`, scene);
      windMat.diffuseTexture.hasAlpha = true;

      return windMat
  }
  async createKite(scene: Scene){
    const Kite = await SceneLoader.ImportMeshAsync("", "/assets/models/", "kite.glb", scene)
    const theKite = Kite.meshes[0]
    theKite.addRotation(.5,0,0);
    this.kiteInfo = {theKite, Kite}
    return this.kiteInfo
  }
  async createWaterThatLoops(scene: Scene, floatingWaters: any){
    // CREATING THE WATER THAT LOOPS
    const Wave = await SceneLoader.ImportMeshAsync("", "/assets/models/", "waves.glb", scene)
    Wave.meshes[1].parent = null;Wave.meshes[1].position.y = 5
    floatingWaters.push({_id: '435ZSDF', spd: .4, mesh: Wave.meshes[1], isDown: Math.random() > .05 ? true : false })
    this.createWaters(10, Wave.meshes[1], floatingWaters, scene); 
  }
  async createKiller(scene:Scene, surferPsmesh: any){
    const killerMesh = MeshBuilder.CreateBox("killerMesh", {size: 8, depth: 30}, scene)
    const Killer = await SceneLoader.ImportMeshAsync("", "/assets/models/", "surferkiller.glb", scene)
    const theKiller = Killer.meshes[0];
    theKiller.scaling = new Vector3(.8,.8,.8)
    
    theKiller.parent = killerMesh
    // theKiller.rotationQuaternion = null
    const killerAnims = Killer.animationGroups

    killerMesh.position.x = this.sharkRadius

    const rotatingMesh = MeshBuilder.CreateBox("rotatingMesh", {size: 8, depth: 30}, scene)
    killerMesh.parent = rotatingMesh
    rotatingMesh.position = new Vector3(0,0,0)
    killerMesh.isVisible=false
    rotatingMesh.isVisible=false

    killerMesh.actionManager = new ActionManager(scene)
    killerMesh.actionManager.registerAction(
      new ExecuteCodeAction(
          {
              trigger: ActionManager.OnIntersectionEnterTrigger, 
              parameter: { 
                  mesh: surferPsmesh, 
                  usePreciseIntersection: true
              }
          }, () => { 
              const actionNum = Math.random() > .5 ? 1 : 2
              killerAnims.forEach((ani: any) => {
                  if(ani.name === `eat${actionNum}`){
                      ani.play()
                  }else{
                      ani.stop()
                  }
              })
              this.sharKToChase = undefined
              surferPsmesh.parent.position.y = -70
              this.canKeyPress = true
              this.doNotMove = true
              setTimeout(() => this.gameOverCont.classList.remove("close"), 1500)
          }
      )
    );
    this.killerInfo = {killerMesh, killerAnims, rotatingMesh}
    return this.killerInfo
  }
  async createBoard(scene: Scene){
      let boardSplashJson = {"name":"CPU particle system","id":"default system","capacity":10000,"disposeOnStop":false,"manualEmitCount":-1,"emitter":[0,0,0],"particleEmitterType":{"type":"CylinderParticleEmitter","radius":1,"height":0.5,"radiusRange":1,"directionRandomizer":1},"texture":{"tags":null,"url":"https://assets.babylonjs.com/textures/flare.png","uOffset":0,"vOffset":0,"uScale":1,"vScale":1,"uAng":0,"vAng":0,"wAng":0,"uRotationCenter":0.5,"vRotationCenter":0.5,"wRotationCenter":0.5,"homogeneousRotationInUVTransform":false,"isBlocking":true,"name":"https://assets.babylonjs.com/textures/flare.png","hasAlpha":false,"getAlphaFromRGB":false,"level":1,"coordinatesIndex":0,"optimizeUVAllocation":true,"coordinatesMode":0,"wrapU":1,"wrapV":1,"wrapR":1,"anisotropicFilteringLevel":4,"isCube":false,"is3D":false,"is2DArray":false,"gammaSpace":true,"invertZ":false,"lodLevelInAlpha":false,"lodGenerationOffset":0,"lodGenerationScale":0,"linearSpecularLOD":false,"isRenderTarget":false,"animations":[],"invertY":true,"samplingMode":3,"_useSRGBBuffer":false},"isLocal":false,"animations":[],"beginAnimationOnStart":false,"beginAnimationFrom":0,"beginAnimationTo":60,"beginAnimationLoop":false,"startDelay":0,"renderingGroupId":0,"isBillboardBased":true,"billboardMode":7,"minAngularSpeed":0,"maxAngularSpeed":0,"minSize":0.1,"maxSize":0.1,"minScaleX":2,"maxScaleX":1,"minScaleY":1,"maxScaleY":1,"minEmitPower":2,"maxEmitPower":2,"minLifeTime":1,"maxLifeTime":1.5,"emitRate":1000,"gravity":[0,1,10],"noiseStrength":[10,10,10],"color1":[0.12156862745098039,0.45098039215686275,0.403921568627451,1],"color2":[0.0196078431372549,0.1568627450980392,0.20784313725490197,1],"colorDead":[0.5372549019607843,0.5764705882352941,0.5686274509803921,1],"updateSpeed":0.029,"targetStopDuration":0,"blendMode":0,"preWarmCycles":0,"preWarmStepOffset":1,"minInitialRotation":0.01,"maxInitialRotation":0,"startSpriteCellID":0,"spriteCellLoop":true,"endSpriteCellID":0,"spriteCellChangeSpeed":1,"spriteCellWidth":0,"spriteCellHeight":0,"spriteRandomStartCell":false,"isAnimationSheetEnabled":false,"useLogarithmicDepth":false,"sizeGradients":[{"gradient":0,"factor1":0.1,"factor2":0.71},{"gradient":0.87,"factor1":0.1,"factor2":0.3},{"gradient":1,"factor1":0.009,"factor2":0.01}],"textureMask":[1,1,1,1],"customShader":null,"preventAutoStart":false}
      const boardSplashPS = ParticleSystem.Parse(boardSplashJson, scene, "")
      const theBack = MeshBuilder.CreateBox("asd", {size: .5}, scene)
      const farent = MeshBuilder.CreateBox("farent", {size: 4}, scene)

      const Board = await SceneLoader.ImportMeshAsync("", "/assets/models/", "board.glb", scene)
      const theBoard = Board.meshes[0]
      theBoard.parent = farent
      farent.position = new Vector3(0,6.9,25)
      theBack.parent =  theBoard
      boardSplashPS.emitter = theBack; boardSplashPS.gravity.y = -.5
      theBack.position = new Vector3(0,0,4.6)
      theBack.isVisible = false
      farent.isVisible = false

      farent.actionManager = new ActionManager(scene)

      const theFront = this.createSplashSmall(scene)
      theFront.box.parent = theBoard; theFront.box.position = new Vector3(0,0,-4.7)
      this.boardInfo = { theBack,theFront, farent, boardSplashPS }
      return this.boardInfo
  }
  async createSurfer(farent: any,scene: Scene){
    const surferJson = {"name":"CPU particle system","id":"default system","capacity":10000,"disposeOnStop":false,"manualEmitCount":-1,"emitter":[0,0,0],"particleEmitterType":{"type":"CylinderParticleEmitter","radius":1,"height":0.4,"radiusRange":0,"directionRandomizer":1},"texture":{"tags":null,"url":"https://assets.babylonjs.com/textures/flare.png","uOffset":0,"vOffset":0,"uScale":1,"vScale":1,"uAng":0,"vAng":0,"wAng":0,"uRotationCenter":0.5,"vRotationCenter":0.5,"wRotationCenter":0.5,"homogeneousRotationInUVTransform":false,"isBlocking":true,"name":"https://assets.babylonjs.com/textures/flare.png","hasAlpha":false,"getAlphaFromRGB":false,"level":1,"coordinatesIndex":0,"optimizeUVAllocation":true,"coordinatesMode":0,"wrapU":1,"wrapV":1,"wrapR":1,"anisotropicFilteringLevel":4,"isCube":false,"is3D":false,"is2DArray":false,"gammaSpace":true,"invertZ":false,"lodLevelInAlpha":false,"lodGenerationOffset":0,"lodGenerationScale":0,"linearSpecularLOD":false,"isRenderTarget":false,"animations":[],"invertY":true,"samplingMode":3,"_useSRGBBuffer":false},"isLocal":false,"animations":[],"beginAnimationOnStart":false,"beginAnimationFrom":0,"beginAnimationTo":60,"beginAnimationLoop":false,"startDelay":0,"renderingGroupId":0,"isBillboardBased":true,"billboardMode":7,"minAngularSpeed":0,"maxAngularSpeed":0,"minSize":0.1,"maxSize":0.1,"minScaleX":2,"maxScaleX":1,"minScaleY":1,"maxScaleY":1,"minEmitPower":2,"maxEmitPower":2,"minLifeTime":3,"maxLifeTime":3.3,"emitRate":700,"gravity":[0,-0.3,0],"noiseStrength":[10,10,10],"color1":[0,0.25098039215686274,0.2784313725490196,1],"color2":[0.011764705882352941,0.24705882352941178,0.34901960784313724,1],"colorDead":[0.3333333333333333,0.4470588235294118,0.4588235294117647,1],"updateSpeed":0.028,"targetStopDuration":0,"blendMode":0,"preWarmCycles":0,"preWarmStepOffset":1,"minInitialRotation":0,"maxInitialRotation":0,"startSpriteCellID":0,"spriteCellLoop":true,"endSpriteCellID":0,"spriteCellChangeSpeed":1,"spriteCellWidth":0,"spriteCellHeight":0,"spriteRandomStartCell":false,"isAnimationSheetEnabled":false,"useLogarithmicDepth":false,"sizeGradients":[{"gradient":0,"factor1":0.03,"factor2":0.05},{"gradient":0.54,"factor1":0.7,"factor2":1.1},{"gradient":1,"factor1":0.01,"factor2":0.2}],"textureMask":[1,1,1,1],"customShader":null,"preventAutoStart":false}
    const surferPs = ParticleSystem.Parse(surferJson, scene, "")
    const Surfer = await SceneLoader.ImportMeshAsync("", "/assets/models/", "surfer.glb", scene)

    const rightHand = Surfer.meshes[0].getChildren()[0].getChildren()[3].getChildren()[0].getChildren()[0].getChildren()[2].getChildren()[0].getChildren()[0].getChildren()[0]
    const leftHand = Surfer.meshes[0].getChildren()[0].getChildren()[3].getChildren()[0].getChildren()[0].getChildren()[1].getChildren()[0].getChildren()[0].getChildren()[0]

    const surferBody = MeshBuilder.CreateBox("surferBody", {size: .5}, scene)
    const surferPsmesh = MeshBuilder.CreateBox("surferPsmesh", {size: 1}, scene)

    surferPs.emitter = surferPsmesh;
    surferPsmesh.parent = surferBody;
    surferPsmesh.position.y += 7.6
    surferPsmesh.isVisible = false
    surferBody.parent = farent

    surferPs.stop()
    Surfer.animationGroups.forEach(an => this.anims.push(an))
    Surfer.meshes.forEach(wve => wve.rotationQuaternion = null)
    const surfer = Surfer.meshes[0]
    surfer.position.y = 6.4
    surfer.scaling = new Vector3(7.5,7.5,7.5)
    surfer.parent = surferBody

    surferPsmesh.actionManager = new ActionManager(scene)
    this.surferInfo = { surferPs, surferBody, surferPsmesh, surfer, rightHand, leftHand}
    return this.surferInfo
  }
  showGuide(mess:string, dura:number){

    this.guide.style.display = "block"
    this.guide.innerHTML = mess

    setTimeout(() => this.guide.style.display = "none", dura)
  }
  ngAfterViewInit(){
    this.canvas = this.canvas.nativeElement
    this.guide = this.guide.nativeElement
    this.startBtn = this.startBtn.nativeElement
    this.gameOverCont = this.gameOverCont.nativeElement
    this.againBtn = this.againBtn.nativeElement
    this.yesBtn = this.yesBtn.nativeElement
    this.noBtn = this.noBtn.nativeElement
    this.installGame = this.installGame.nativeElement
    this.windCaution = this.windCaution.nativeElement
    this.chooseCont = this.chooseCont.nativeElement
    this._engine = new Engine(this.canvas, true)
    this._scene = new Scene(this._engine)

    this.setup()
    this.main()

    this.startBtn.addEventListener("click", () => {
      if(window.innerWidth < 600) return this.showGuide('landscape your screen to start', 3000)
      if(window.innerWidth > 600 && window.innerHeight < 500){ 
        // if true means on mobile mode
        this.chooseCont.style.display = "flex" // choosing controllersUI will open
        return this.startBtn.style.display = "none"
      }
      this.introStart()
      this.startBtn.style.display = "none"
    })
    this.againBtn.addEventListener("click", () => {
      this.gameOverCont.classList.add("close")
      //  theGame._engine.displayLoadingUI()
      //  await theGame.main()
      setTimeout(() => location.reload(), 1000)
    })
    this.yesBtn.addEventListener("click", () => {
      log("YES")
      this.isTilting = true
      this.introStart()
      this.leftThumbContainer.isVisible = false
      this.chooseCont.display = "none"
    })
    this.noBtn.addEventListener("click", () => {
      log("NO TILTING")
      this.isTilting = false
      this.introStart()
      this.leftThumbContainer.isVisible = true
      this.chooseCont.display = "none"
    })

    // FOR INSTALLATION
    let deferredPrompt: any
    window.addEventListener("beforeinstallprompt", (e:any) => {
        deferredPrompt = e
    })        
    this.installGame.addEventListener("click", () => {
        if(!deferredPrompt) return this.showGuide("App already Installed or not compatible", 3000)
        deferredPrompt.prompt()
        deferredPrompt.userChoice
        .then( (choiceResult: any) => {
            if(choiceResult.outcome === "accepted") console.log("User want to install the game")
            deferredPrompt = null
            localStorage.setItem("surfApp", JSON.stringify({isInstalled: true})) === null
        })
        .catch((error:any) => console.log(error))
    })
  }
}
