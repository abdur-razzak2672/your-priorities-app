import { LitElement, html, css } from "lit";
import { property, query } from "lit/decorators.js";

import "@material/web/dialog/dialog.js";
import "@material/web/textfield/outlined-text-field.js";

import { YpBaseElement } from "./@yrpri/common/yp-base-element";
import { PropertyValueMap } from "lit";

import { ShadowStyles } from "./@yrpri/common/ShadowStyles";
import {
  Cartographic,
  ImageryProvider,
  IonWorldImageryStyle,
  Rectangle,
  Viewer,
} from "cesium";
import { TileManager } from "./TileManager";
import { PlaneManager } from "./PlaneManager";
import { CharacterManager } from "./CharacterManager";
import { Dialog } from "@material/web/dialog/lib/dialog";

import "@material/mwc-textarea/mwc-textarea.js";
import { MdDialog } from "@material/web/dialog/dialog.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";

//const logo = new URL("../../assets/open-wc-logo.svg", import.meta.url).href;

const landMarks = [
  {
    jsonData: `{"position":{"x":2654952.929606032,"y":-1016221.3487241162,"z":5741820.767140159},"heading":0.18514839426342977,"pitch":-0.6884926785509595,"roll":0.000004798763947988505}`,
  },
  {
    jsonData: `{"position":{"x":2603954.015915357,"y":-987894.1669974888,"z":5723474.387481297},"heading":0.7194597796017312,"pitch":-0.0744418474365669,"roll":0.00024785400735183316}`,
  },
  {
    jsonData: `{"position":{"x":2608450.448217757,"y":-983956.0873921539,"z":5725021.02720951},"heading":0.4516151540332656,"pitch":-0.5574524531949243,"roll":0.0014720472302327536}`,
  },
  {
    jsonData: `{"position":{"x":2610244.8435150534,"y":-983175.4728537177,"z":5725699.596588212},"heading":0.4588847589872893,"pitch":-0.37953853967140194,"roll":0.002438891621989292}`,
  },
  {
    jsonData: `{"position":{"x":2594843.143514622,"y":-954502.41228975,"z":5730498.744925417},"heading":0.44818481070129224,"pitch":-0.2614333409478289,"roll":0.0000464284335048859}`,
  },
  {
    jsonData: `{"position":{"x":2613873.739571409,"y":-973586.3617570958,"z":5718332.700526537},"heading":0.04235783164121365,"pitch":-0.10943287945905267,"roll":0.00004924951058349336}`,
  },
  {
    jsonData: `{"position":{"x":2853297.0191392438,"y":-1100646.51907959,"z":5735649.018466557},"heading":0.19435325899631994,"pitch":-0.4779283166323647,"roll":0.000010742544064967774}`,
  },
  {
    jsonData: `{"position":{"x":2607037.2626592577,"y":-987102.9507233112,"z":5727420.9039692},"heading":0.6794331897043371,"pitch":-0.42845798915222355,"roll":0.00024172583265791303}`,
  },
  {
    jsonData: `{"position":{"x":2586527.6700988784,"y":-967547.8794308463,"z":5731526.940153026},"heading":3.4627563167442634,"pitch":-0.16078365173401377,"roll":0.00003878486565245254}`,
  },
  {
    jsonData: `{"position":{"x":2582967.5932254517,"y":-989522.1831641375,"z":5728775.872649812},"heading":3.7262135252909556,"pitch":-0.3873144529923971,"roll":0.00002876419102015859}`,
  },
  {
    jsonData: `{"position":{"x":2616466.5232743877,"y":-981239.4266582452,"z":5714685.454756667},"heading":0.5337684728326346,"pitch":-0.07168090089261958,"roll":6.283158352478661}`,
  },
  {
    jsonData: `{"position":{"x":2605468.8506080373,"y":-964598.5282954393,"z":5722305.954288225},"heading":6.179314307394964,"pitch":-0.4340799514568694,"roll":0.0000117225618820882}`,
  },
  {
    jsonData: `{"position":{"x":2575296.8511799383,"y":-925826.7618476085,"z":5742479.521849897},"heading":6.228172042373732,"pitch":-0.14680628178295696,"roll":0.000005087652989566038}`,
  },
];

//todo: Have a giant finger come from the sky to press the land areas (or a mouse arrow on desktop)
//todo: Sounds effects when you choose a land are and also if nothing is selectes
//todo: Engine sound for plane and muffled Ómar Ragnarsson songs in a meedle (less than 30 sec) loop
//todo: Integrate three.js for the 3D UI icons and for intro texts and effects
//// https://cesium.com/blog/2017/10/23/integrating-cesium-with-threejs/
//Have overlay fully transparent except when very high up with an overview look
// Íslensku landvættirnir eru með
// Create JSON for FX animations like landvættir with options to fly or walk across the landscape or to stay in one place - with animation points
// The four landvættir are traditionally regarded as the protectors of the four quarters of Iceland: the dragon (Dreki) in the east, the eagle (Gammur) in the north, the bull (Griðungur) in the west, and the giant (Bergrisi) in the south.
// Have one land use type icon hovering over that type of land use areas flying between the rectangles
// 3D comment icon to make a comment on a rectangle
// Add wall around the area: https://sandcastle.cesium.com/?src=Wall.html&label=Geometries
// Animation basd on walking speed: https://sandcastle.cesium.com/?src=Manually%20Controlled%20Animation.html&label=All
// Ómar lög https://www.youtube.com/watch?v=55T1VWOHGBo&list=OLAK5uy_nhsD368G66EbyitSjwI5YcNj5sks2QPEQ&index=14
// Maybe use tween to animate the quick objects: https://groups.google.com/g/cesium-dev/c/k_Kk3CCuxDw
// Add cover % how much you have filled in of the tiles
// Make layers load more smoothly when changing between aerial and other modes
// Make chat bubbles float above the terrain at a fixed height

export class YpLandUseGame extends YpBaseElement {
  @property({ type: String }) title = "Land Use Game";

  @property({ type: String })
  selectedLandUse: string | undefined;

  @property({ type: Object })
  viewer: Viewer | undefined;

  @property({ type: Object })
  existingBoxes: Map<string, any> = new Map();

  @query("#commentDialog")
  commentDialog!: MdDialog;

  tileManager!: TileManager;
  planeManager!: PlaneManager;
  characterManager!: CharacterManager;
  currentRectangleIdForComment: string | undefined;

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        :host {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          font-size: calc(10px + 2vmin);
          color: #1a2b42;
          max-width: 960px;
          margin: 0 auto;
          text-align: center;
          background-color: var(--yp-land-use-game-background-color);
        }

        main {
          flex-grow: 1;
        }

        #commentTextField {
          text-align: left;
          min-height: 220px;
          min-width: 500px;
        }

        #cesium-container,
        .cesium-viewer,
        .cesium-viewer-cesiumWidgetContainer,
        .cesium-widget,
        .cesium-widget > canvas {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }

        #landUseSelection {
          position: absolute;
          bottom: 10px;
          left: auto;
          right: auto;
          z-index: 1;
          padding: 8px;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 5px;
        }

        #landUseSelection button {
          margin: 5px;
          font-size: 32px;
        }

        #navigationButtons {
          position: absolute;
          top: 10px;
          left: auto;
          right: auto;
          z-index: 1;
          padding: 8px;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 5px;
        }

        #navigationButtons button {
          margin: 5px;
          font-size: 32px;
        }

        #terrainProviderSelection {
          position: absolute;
          top: 10px;
          right: 32px;
          z-index: 1;
          padding: 8px;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 5px;
        }

        #terrainProviderSelection button {
          margin: 5px;
          font-size: 32px;
        }

        #gameStats {
          position: absolute;
          top: 10px;
          left: 32px;
          z-index: 1;
          padding: 8px;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 5px;
        }

        #emptyCreditContainer {
          display: none;
        }
      `,
    ];
  }

  constructor() {
    super();
  }

  connectedCallback(): void {
    // @ts-ignore
    window.CESIUM_BASE_URL = "";
    super.connectedCallback();
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);
    this.initScene();
    this.setupEventListeners();
  }

  handleKeyDown(event: KeyboardEvent) {
    if (!this.currentRectangleIdForComment) {
      if (event.key === "c") {
        this.copyCameraPositionAndRotation();
      } else if (event.key === "h") {
        this.horizonMode();
      }

      // If key is 1-9 choose camera data from landMarks and fly the camera to that position
      const key = parseInt(event.key);
      if (key >= 1 && key <= 9) {
        this.setCameraFromLandMark(key - 1);
      }

    }
  }

  copyCameraPositionAndRotation() {
    const position = this.viewer!.camera.position;
    const heading = this.viewer!.camera.heading;
    const pitch = this.viewer!.camera.pitch;
    const roll = this.viewer!.camera.roll;
    const clipboardData = {
      position: position,
      heading: heading,
      pitch: pitch,
      roll: roll,
    };
    navigator.clipboard.writeText(JSON.stringify(clipboardData));
  }

  async horizonMode() {
    const clipboardData = await navigator.clipboard.readText();
    if (clipboardData) {
      const { position, heading, pitch, roll } = JSON.parse(clipboardData);

      this.viewer!.camera.setView({
        destination: position,
        orientation: {
          heading: heading,
          pitch: pitch,
          roll: roll,
        },
      });
    }
  }

  flyToPosition(
    longitude: number,
    latitude: number,
    altitude: number,
    duration: number,
    pitch: number
  ) {
    return new Promise((resolve) => {
      this.viewer!.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          longitude,
          latitude,
          altitude
        ),
        orientation: {
          heading: 0.0,
          pitch: pitch,
          roll: 0.0,
        },
        duration: duration,
        //@ts-ignore
        complete: resolve,
      });
    });
  }

  async getTerrainHeight(position: Cartographic): Promise<number> {
    const terrainProvider = this.viewer!.terrainProvider;
    const positions = [position];

    const sampledPositions = await Cesium.sampleTerrainMostDetailed(
      terrainProvider,
      positions
    );

    return sampledPositions[0].height;
  }

  setLandUse(landUse: string) {
    this.selectedLandUse = landUse;
    this.tileManager.selectedLandUse = landUse;
    this.setIsCommenting(false);
  }

  setIsCommenting(isCommenting: boolean) {
    this.tileManager.isCommenting = isCommenting;
  }

  setCameraFromLandMark(landMarkIndex: number) {
    const landMark = landMarks[landMarkIndex];
    if (landMark && this.viewer) {
      const { position, heading, pitch, roll } = JSON.parse(landMark.jsonData);
      this.cancelFlyToPosition();
      this.viewer.camera.setView({
        destination: position,
        orientation: {
          heading: heading,
          pitch: pitch,
          roll: roll,
        },
      });
    } else {
      console.warn("No landMark or viewer found for index", landMarkIndex);
    }
  }

  cancelFlyToPosition() {
    if (this.viewer) {
      this.viewer.camera.cancelFlight();
    }
  }

  openComment(event: any) {
    (this.$$("#commentDialog") as Dialog).open = true;
    this.currentRectangleIdForComment = event.detail.rectangleId;
  }

  closeComment() {
    (this.$$("#commentDialog") as Dialog).open = false;
    this.currentRectangleIdForComment = undefined;
  }

  setupEventListeners() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));

    document.addEventListener("open-comment", this.openComment.bind(this));

    this.$$("#landUse1")!.addEventListener("click", () => {
      this.setLandUse("energy");
    });

    this.$$("#landUse2")!.addEventListener("click", () => {
      this.setLandUse("farming");
    });

    this.$$("#landUse3")!.addEventListener("click", () => {
      this.setLandUse("tourism");
    });

    this.$$("#landUse4")!.addEventListener("click", () => {
      this.setLandUse("recreation");
    });

    this.$$("#landUse5")!.addEventListener("click", () => {
      this.setLandUse("restoration");
    });

    this.$$("#landUse6")!.addEventListener("click", () => {
      this.setLandUse("conservation");
    });

    this.$$("#commentButton")!.addEventListener("click", () => {
      this.setIsCommenting(true);
    });

    this.$$("#showAll")!.addEventListener("click", () => {
      this.viewer!.trackedEntity = undefined;
      this.cancelFlyToPosition();
      this.setCameraFromLandMark(0);
    });

    this.$$("#trackPlane")!.addEventListener("click", () => {
      this.cancelFlyToPosition();
      this.viewer!.trackedEntity = this.planeManager.plane;
    });

    // Add event listeners for terrainProvider change
    this.$$("#chooseAerial")!.addEventListener("click", () => {
      this.viewer!.imageryLayers.removeAll();
      this.viewer!.imageryLayers.addImageryProvider(
        Cesium.createWorldImagery({
          style: Cesium.IonWorldImageryStyle.AERIAL,
        })
      );
    });

    this.$$("#chooseAerialWithLabels")!.addEventListener("click", () => {
      this.viewer!.imageryLayers.removeAll();
      this.viewer!.imageryLayers.addImageryProvider(
        Cesium.createWorldImagery({
          style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
        })
      );
    });

    this.$$("#chooseOpenStreetMap")!.addEventListener("click", () => {
      this.viewer!.imageryLayers.removeAll();
      this.viewer!.imageryLayers.addImageryProvider(
        new Cesium.OpenStreetMapImageryProvider({
          url: "https://a.tile.openstreetmap.org/",
        })
      );
    });
  }

  async initScene() {
    const container = this.$$("#cesium-container")!;
    const emptyCreditContainer = this.$$("#emptyCreditContainer")!;

    //@ts-ignore
    Cesium.Ion.defaultAccessToken = __CESIUM_ACCESS_TOKEN__;

    let imageProvider: false | ImageryProvider | undefined;

    if (window.location.href.indexOf("localhost") > -1) {
      imageProvider = new Cesium.IonImageryProvider({ assetId: 3954 });
    } else {
      imageProvider = Cesium.createWorldImagery({
        style: Cesium.IonWorldImageryStyle.AERIAL,
      });
    }

    this.viewer = new Cesium.Viewer(container, {
      infoBox: false, //Disable InfoBox widget
      selectionIndicator: false, //Disable selection indicator
      shouldAnimate: true, // Enable animations
      animation: false,
      creditContainer: emptyCreditContainer,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      //      requestRenderMode: true,
      homeButton: false,
      //    infoBox: false,
      sceneModePicker: false,
      //      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      vrButton: false,
      //ts-ignore
      terrainProvider: await Cesium.createWorldTerrainAsync(),
      imageryProvider: imageProvider,
    });

    this.viewer.scene.globe.baseColor = Cesium.Color.GRAY;

    this.tileManager = new TileManager(this.viewer);

    //Enable lighting based on the sun position
    this.viewer.scene.globe.enableLighting = true;

    const screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );

    screenSpaceEventHandler.setInputAction(
      async (event: any) => this.tileManager.setInputAction(event),
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );

    //this.viewer.scene.postProcessStages.bloom.enabled = true;
    setTimeout(async () => {
      await this.tileManager.readGeoData();
      this.planeManager = new PlaneManager(
        this.viewer!,
        this.tileManager.geojsonData
      );
      this.planeManager.setup();
      const longLatStart = [63.46578246639273, -18.86733120920245];
      const longLatEnd = [64.74664895142547, -19.35433358999831];

      // Convert lang/lat to cartesian
      const start = Cesium.Cartesian3.fromDegrees(
        longLatStart[1],
        longLatStart[0]
      );

      const end = Cesium.Cartesian3.fromDegrees(longLatEnd[1], longLatEnd[0]);

      this.characterManager = new CharacterManager(this.viewer!, start, end);
      this.characterManager.setupCharacter();
    });

    //Enable depth testing so things behind the terrain disappear.
    this.viewer.scene.globe.depthTestAgainstTerrain = true;

    await this.flyToPosition(
      -20.62592534987823,
      64.03985855384323,
      35000,
      7,
      -Cesium.Math.PI_OVER_TWO / 1.3
    );

    // Second flyTo
    await this.flyToPosition(
      -20.62592534987823,
      64.03985855384323,
      20000,
      3,
      -Cesium.Math.PI_OVER_TWO / 3.2
    );
  }

  saveComment() {
    const comment = (this.$$("#commentTextField") as HTMLInputElement)!.value;
    this.commentDialog.close();
    if (this.currentRectangleIdForComment) {
      this.tileManager.addCommentToRectangle(
        this.currentRectangleIdForComment,
        comment
      );
    } else {
      console.error("Can't find rectangle for comment");
    }
  }

  renderFooter() {
    return html` <div class="layout horizontal">
      <md-outlined-button
        label="Close"
        class="cancelButton self-start"
        @click="${this.closeComment}"
      ></md-outlined-button>
      <md-filled-button
        label="Submit"
        id="save"
        @click="${this.saveComment}"
      ></md-filled-button>
    </div>`;
  }

  render() {
    return html`
      <div id="cesium-container"></div>
      <div id="emptyCreditContainer"></div>
      <div id="landUseSelection">
        <button id="landUse1">Energy</button>
        <button id="landUse2">Farming</button>
        <button id="landUse3">Tourism</button>
        <button id="landUse4">Recreation</button>
        <button id="landUse5">Restoration</button>
        <button id="landUse6">Conservation</button>
        <button id="commentButton">Comment</button>
      </div>

      <div id="navigationButtons">
        <button id="showAll">Show all</button>
        <button id="trackPlane">Plane</button>
      </div>

      <div id="terrainProviderSelection">
        <button id="chooseAerial">Aerial</button>
        <button id="chooseAerialWithLabels">Labels</button>
        <button id="chooseOpenStreetMap">Map</button>
      </div>

      <div id="gameStats"></div>
      <md-dialog id="commentDialog">
        <div slot="header" class="postHeader">Your comment</div>
        <div id="content">
          <mwc-textarea rows="7" id="commentTextField" label=""></mwc-textarea>
        </div>
        <div slot="footer">${this.renderFooter()}</div>
      </md-dialog>
    `;
  }
}
