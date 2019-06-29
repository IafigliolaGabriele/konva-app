import { Component, ViewChild } from '@angular/core';
import { Observable, of, from, BehaviorSubject } from 'rxjs';
import Konva, * as konva from 'konva';
import { KonvaComponent } from 'ng2-konva';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('stage') stage: KonvaComponent;
  @ViewChild('layer') layer: KonvaComponent;
  title = 'konva-app';
  public configStage: Observable<any> = of({
    width: 500,
    height: 500
  });
  configImages: Array<Observable<Konva.Image>> = [];
  images = []
  positions = []
  imagesNames = ['nada','Ingeniero.svg', 'BaseCarita-I.svg', 'Mano Ingeniero.svg', 'Casco Ingeniero.svg', 'Eyes_3.svg',]
  currentSelected: Konva.Image;
  dragLayer: Konva.Layer;
  currentLayer:Konva.Layer;
  layers:Array<Konva.Layer> = []
  numberOfLayers;

  ngOnInit() {
    this.numberOfLayers = 6;
  }

  ngAfterViewInit() {
    this.createLayers()
  }

  createLayers(){
    console.log("before stage",this.stage)
    let stage = this.stage.getStage();
    console.log("after Stage",stage)
    for(let i = 0; i< this.numberOfLayers; i++){
      let layer = new Konva.Layer();
      stage.add(layer)
      this.layers.push(layer)
    }
    this.dragLayer = new Konva.Layer();
    stage.add(this.dragLayer)
    this.layers.push(this.dragLayer)
  }

  drawImage(image, name, index) {
    let stage = this.stage.getStage();
    console.log("Dimensions: " + image.width + " y " +image.height)
    let config = new Konva.Image({
      image: image,
      x: stage.width() / 2 - image.width / 2,
      y: stage.height() / 2 - image.height / 2,
      draggable: false,
      opacity: 1
    })
    config.on('dragstart', (event) => { return this.handleDragEnd(event) })
    config.on('mouseover', function (event) { document.body.style.cursor = 'pointer'; });
    config.on('mouseout', function (event) { document.body.style.cursor = 'default'; });
    // image.setPosition({ x: 100, y: 100 })
    // image.setDraggable(true);
    let configOb = new BehaviorSubject(config)
    // configOb.subscribe((data: Konva.Image) => {
    //   console.log(data)
    //   //console.log("Dimensions: " + data.attrs.image.width + " y " + data.attrs.image.height)
    //   // let stage = this.stage.getStage();
    //   // let layer = this.layers[index]; //new Konva.Layer();
    //   // layer.add(data)
    //   // layer.draw()
    //   // stage.add(layer)
    //   // stage.draw();
    // })
    let layer = this.layers[index]; //new Konva.Layer();
    layer.add(config)
    layer.draw()
    //stage.add(layer)
    stage.draw();
    this.configImages.push(configOb)
    this.images.push({'name': name, 'image': config})
  }

  public reDraw() {
    console.log("Redraawing")
    let stage = this.stage.getStage();
    for (let layer of stage.getLayers()) {
      console.log("Layer", layer)
      layer.draw()
    }
  }

  public addImage() {
    let image2 = new Image();
    image2.src = 'assets/'.concat(this.imagesNames[0])
    let config = new Konva.Image({
      image: image2,
      x: 100,
      y: 100,
      draggable: true
    })
    let configOb = new BehaviorSubject(config)
    configOb.subscribe((data: Konva.Image) => {
      console.log("Data from URL    " + data.x())
    })
    this.configImages.push(configOb)
  }

  public addImages() {
    let stage = this.stage.getStage();
    this.createLayers()
    for (let i = 1; i < 6; i++) {
      let image = new Image();
      image.src = 'assets/'.concat(this.imagesNames[i])
      image.onload = data => { this.drawImage(image,this.imagesNames[i], i) }
    }
    this.dragLayer = new Konva.Layer();
    stage.add(this.dragLayer)
  }

  public addImageFromURL() {
    Konva.Image.fromURL(
      "https://picsum.photos/200",
      (image: Konva.Image) => { return this.drawImage(image.attrs.image, 'URL',0) });
  }

  public handleDragEnd(event) {
    console.log(event)
    //event.currentTarget.opacity(1);
    this.reDraw()
    console.log("Border", event.currentTarget.attrs.image.style.border)
    // console.log(event._config._id+') Dragend',event._stage._lastPos);
    // this.positions[event._config._id-1] = event._stage._lastPos;
  }

  makeDraggable(image){
    console.log("tal",image)
    let stage = this.stage.getStage();
    if(!this.currentSelected){
      this.currentSelected = image;
      this.currentLayer = image.parent;
    }else{
      this.currentSelected.moveTo(this.currentLayer)
      this.currentLayer = image.parent;
      this.currentSelected.setDraggable(false)
      this.currentSelected.opacity(1)
      this.currentSelected = image;
    }
    image.opacity(0.7)
    image.moveTo(this.dragLayer)
    image.setDraggable(true)
    stage.draw()
  }

  printCoordinates() {
    for (let config of this.configImages) {
      config.subscribe(data => {
        console.log(data)
        console.log("X: " + data.x())
        console.log("Y: " + data.y())
      })
    }
  }
}
