import { html, css, nothing } from "lit";
import { property, query } from "lit/decorators.js";

import "@material/web/dialog/dialog.js";
import "@material/web/textfield/outlined-text-field.js";

import { YpBaseElement } from "./@yrpri/common/yp-base-element";
import { PropertyValueMap } from "lit";

import { ShadowStyles } from "./@yrpri/common/ShadowStyles";
import { Cartographic, ImageryProvider, Viewer } from "cesium";
import { TileManager } from "./TileManager";
import { PlaneManager } from "./PlaneManager";
import { CharacterManager } from "./CharacterManager";
import { Dialog } from "@material/web/dialog/lib/dialog";

import "@material/mwc-textarea/mwc-textarea.js";
import { MdDialog } from "@material/web/dialog/dialog.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import { UIManager } from "./UIManager";

import { landMarks } from "./TestData";
import { DragonManager } from "./DragonManager";
import { BullManager } from "./BullManager";
import { EagleManager } from "./EagleManager";
import { YpServerApi } from "./@yrpri/common/YpServerApi";
import { LandUseAppGlobals } from "./LandUseAppGlobals";
import { YpAppUser } from "./@yrpri/yp-app/YpAppUser";
import { YpAppDialogs } from "./@yrpri/yp-dialog-container/yp-app-dialogs";

import "./@yrpri/yp-dialog-container/yp-app-dialogs.js";
import { YpPostEdit } from "./@yrpri/yp-post/yp-post-edit";
import { YpCommentDialog } from "./yp-comment-dialog.js";
import "./yp-comment-dialog.js";
import "./yp-new-comment-dialog.js";
import { YpNewCommentDialog } from "./yp-new-comment-dialog.js";
import { YpPageDialog } from "./@yrpri/yp-page/yp-page-dialog";

const GameStage = {
  Intro: 1,
  Play: 2,
  Results: 3,
};

export class YpLandUseGame extends YpBaseElement {
  @property({ type: String }) title = "Land Use Game";

  @property({ type: Number })
  gameStage = GameStage.Intro;

  @property({ type: String })
  selectedLandUse:
    | "energy"
    | "gracing"
    | "tourism"
    | "recreation"
    | "restoration"
    | "conservation"
    | undefined;

  @property({ type: Number })
  totalNumberOfTiles: number | undefined;

  @property({ type: Number })
  numberOfTilesWithLandUse: number | undefined;

  @property({ type: Number })
  numberOfTilesWithComments: number | undefined;

  @property({ type: Boolean })
  hideUI = true;

  @property({ type: Object })
  viewer: Viewer | undefined;

  @property({ type: Object })
  loggedInUser: YpUserData | undefined;

  @property({ type: Object })
  existingBoxes: Map<string, any> = new Map();

  @property({ type: Object })
  group: YpGroupData | undefined;

  @property({ type: Boolean })
  disableSubmitButton = true;

  @query("#newCommentDialog")
  newCommentDialog!: MdDialog;

  targetCommentCount = 5;
  tileManager!: TileManager;
  planeManager!: PlaneManager;
  characterManager!: CharacterManager;
  currentRectangleIdForComment: string | undefined;
  uiManager: UIManager | undefined;
  dragonManager!: DragonManager;
  bullManager!: BullManager;
  eagleManager!: EagleManager;
  frameCount = 0;
  lastFPSLogTime = new Date().getTime();
  orbit: ((clock: any) => void) | undefined;


  logFramerate() {
    this.frameCount++;

    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - this.lastFPSLogTime;

    if (elapsedTime >= 1000) {
      // Log framerate every second
      const fps = (this.frameCount / elapsedTime) * 1000;
      console.log(`Framerate: ${fps.toFixed(2)} FPS`);
      this.frameCount = 0;
      this.lastFPSLogTime = currentTime;
    }

    window.requestAnimationFrame(this.logFramerate.bind(this));
  }

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

        #submitButton {
          font-size: 24px;
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
          opacity: 0;
          transition: opacity 5s ease-in-out;
        }

        #gameStats[hidden] {
          opacity: 0;
        }

        #gameStats:not([hidden]) {
          opacity: 1;
        }

        #emptyCreditContainer {
          display: none;
        }

        #landUse1 {
          background: rgba(255, 0, 0, 0.2); /* red with 0.25 opacity */
        }

        #landUse1[selected] {
          background: rgba(255, 0, 0, 0.55); /* red with 0.25 opacity */
        }

        #landUse2 {
          background: rgba(0, 0, 255, 0.2); /* blue with 0.25 opacity */
        }

        #landUse2[selected] {
          background: rgba(0, 0, 255, 0.55); /* blue with 0.25 opacity */
        }

        #landUse3 {
          background: rgba(255, 165, 0, 0.2); /* orange with 0.25 opacity */
        }

        #landUse3[selected] {
          background: rgba(255, 165, 0, 0.55); /* orange with 0.25 opacity */
        }

        #landUse4 {
          background: rgba(255, 255, 0, 0.2); /* yellow with 0.25 opacity */
        }

        #landUse4[selected] {
          background: rgba(255, 255, 0, 0.55); /* yellow with 0.25 opacity */
        }

        #landUse5 {
          background: rgba(0, 255, 255, 0.2); /* cyan with 0.25 opacity */
        }

        #landUse5[selected] {
          background: rgba(0, 255, 255, 0.55); /* cyan with 0.25 opacity */
        }

        #landUse6 {
          background: rgba(128, 0, 128, 0.2); /* purple with 0.25 opacity */
        }

        #landUse6[selected] {
          background: rgba(128, 0, 128, 0.55); /* purple with 0.25 opacity */
        }

        #progressBars {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 250px;
          margin-bottom: 8px;
        }

        .progressBarContainer {
          width: 100%;
          height: 30px;
          background-color: rgba(220, 220, 220, 0.5);
          border-radius: 5px;
          position: relative;
        }

        .progressBar {
          height: 100%;
          width: 0%;
          border-radius: 3px;
          position: absolute;
          left: 0;
          background-color: #953000;
        }

        .progressBarComments {
          background-color: #3c87f2;
        }
      `,
    ];
  }

  constructor() {
    window.serverApi = new YpServerApi();
    window.appGlobals = new LandUseAppGlobals(window.serverApi);
    window.appUser = new YpAppUser(window.serverApi);
    super();
    this.addListener("yp-app-dialogs-ready", this._appDialogsReady.bind(this));
    this.addGlobalListener("yp-logged-in", this._loggedIn.bind(this));
  }

  async _loggedIn(event: CustomEvent) {
    this.loggedInUser = event.detail;
    this.hideUI = false;
    await this.updateComplete;
    this.setupEventListeners();
    if (this.gameStage === GameStage.Results) {
      setTimeout(() => {
        this.setupTileResults();
      }, 3000);
    }
  }

  async connectedCallback() {
    // @ts-ignore
    window.CESIUM_BASE_URL = "";
    this.group = await window.appGlobals.setupGroup();
    super.connectedCallback();
    const helpPages = (await window.serverApi.getHelpPages(
      "group",
      this.group!.id
    )) as YpHelpPageData[];

    let welcomePageId = this.group?.configuration?.welcomePageId;
    let welcomePage;

    if (welcomePageId) {
      welcomePage = helpPages.find((page) => page.id === welcomePageId);
    }

    this._openPage(welcomePage || helpPages[0]);
  }

  openUserLoginOrStart() {
    if (!this.loggedInUser) {
      window.appUser.openUserlogin();
    } else {
      this.gameStage = GameStage.Play;
    }
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);
    this.initScene();
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

  async setupTileResults() {
    const posts = await window.serverApi.getPublicPrivatePosts(this.group!.id);
    this.tileManager.setupTileResults(posts);
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

  setLandUse(landUse: string | undefined) {
    if (this.selectedLandUse === landUse) {
      this.selectedLandUse = undefined;
    } else {
      this.selectedLandUse = landUse as any;
    }
    this.setIsCommenting(false);
    this.tileManager.selectedLandUse = this.selectedLandUse;

    if (this.gameStage === GameStage.Results) {
      this.tileManager.updateTileResults();
    }
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

  openNewComment(event: any) {
    (this.$$("#newCommentDialog") as YpNewCommentDialog).openDialog();
    this.currentRectangleIdForComment = event.detail.rectangleId;
  }

  closeNewComment() {
    (this.$$("#newCommentDialog") as YpNewCommentDialog).openDialog();
    this.currentRectangleIdForComment = undefined;
  }

  openComment(event: any) {
    (this.$$("#commentDialog") as YpCommentDialog).openDialog(event);
  }

  closeComment() {
    (this.$$("#commentDialog") as YpCommentDialog).closeDialog();
  }

  _getPageLocale(page: YpHelpPageData) {
    let pageLocale = "en";
    if (page.title[window.locale]) {
      pageLocale = window.locale;
    } else if (page.title["en"]) {
      pageLocale = "en";
    } else {
      const key = Object.keys(page.title)[0];
      if (key) {
        pageLocale = key;
      }
    }

    return pageLocale;
  }

  _openPage(page: YpHelpPageData) {
    window.appGlobals.activity("open", "pages", page.id);
    window.appDialogs.getDialogAsync("pageDialog", (dialog: YpPageDialog) => {
      const pageLocale = this._getPageLocale(page);
      dialog.open(page, pageLocale, this.openUserLoginOrStart.bind(this));
    });
  }

  updateTileCount(event: any) {
    this.totalNumberOfTiles = event.detail.totalNumberOfTiles;
    this.numberOfTilesWithComments = event.detail.numberOfTilesWithComments;
    this.numberOfTilesWithLandUse = event.detail.numberOfTilesWithLandUse;

    if (this.numberOfTilesWithLandUse!/this.totalNumberOfTiles! > 0.1) {
      this.disableSubmitButton = false;
    }
  }

  setupEventListeners() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));

    document.addEventListener(
      "open-new-comment",
      this.openNewComment.bind(this)
    );
    document.addEventListener("open-comment", this.openComment.bind(this));

    document.addEventListener(
      "update-tile-count",
      this.updateTileCount.bind(this)
    );

    this.$$("#landUse1")!.addEventListener("click", () => {
      this.setLandUse("energy");
    });

    this.$$("#landUse2")!.addEventListener("click", () => {
      this.setLandUse("gracing");
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

    this.$$("#submitButton")!.addEventListener("click", () => {
      this._newPost();
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

  async afterNewPost() {
    this.gameStage = GameStage.Results;
    this.tileManager.clearLandUsesAndComments();
    // Await 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await this.setupTileResults();
    this.setLandUse(undefined);
    //this.startOrbit();
  }

  startOrbit() {
    const viewer = this.viewer!;
    const center = this.tileManager.computeCenterOfArea();
    const target = this.viewer!.scene.globe.ellipsoid.cartographicToCartesian(
      Cesium.Cartographic.fromDegrees(center.lon, center.lat)
    );

    this.orbit = function (clock: any) {
      const camera = viewer.camera;

      // Save the original camera direction and up in the East-North-Up frame at the target
      const enuCenter = new Cesium.Cartesian3();
      const centerTransform = Cesium.Transforms.eastNorthUpToFixedFrame(target);
      const originalDirection = Cesium.Matrix4.multiplyByPointAsVector(
        centerTransform,
        camera.direction,
        enuCenter
      );
      const originalUp = Cesium.Matrix4.multiplyByPointAsVector(
        centerTransform,
        camera.up,
        enuCenter
      );

      // Compute the angular distance and direction from the center to the camera
      const cameraCenter = Cesium.Cartesian3.subtract(
        camera.position,
        target,
        new Cesium.Cartesian3()
      );
      const radius = Cesium.Cartesian3.magnitude(cameraCenter);
      const directionToCamera = Cesium.Cartesian3.normalize(
        cameraCenter,
        cameraCenter
      );

      // Rotate directionToCamera by the angular speed about the angular axis
      const angularSpeed = 0.001; // radians per real-world second
      const angularAxis = Cesium.Cartesian3.cross(
        directionToCamera,
        Cesium.Cartesian3.UNIT_Z,
        new Cesium.Cartesian3()
      );
      const rotation = Cesium.Quaternion.fromAxisAngle(
        angularAxis,
        clock._clock._systemTime.multiplyByScalar(angularSpeed)
      );
      const directionQuaternion = new Cesium.Quaternion();
      Cesium.Quaternion.fromAxisAngle(
        directionToCamera,
        0,
        directionQuaternion
      );
      const rotatedQuaternion = new Cesium.Quaternion();
      Cesium.Quaternion.multiply(
        rotation,
        directionQuaternion,
        rotatedQuaternion
      );

      // Convert the quaternion back to a rotation matrix
      const rotationMatrix = new Cesium.Matrix3();
      Cesium.Matrix3.fromQuaternion(rotatedQuaternion, rotationMatrix);

      // Rotate the direction vector by the rotation matrix
      const directionToCameraRotated = new Cesium.Cartesian3();
      Cesium.Matrix3.multiplyByVector(
        rotationMatrix,
        directionToCamera,
        directionToCameraRotated
      );

      // Compute the new camera position
      const newCameraPosition = Cesium.Cartesian3.multiplyByScalar(
        directionToCameraRotated,
        radius,
        new Cesium.Cartesian3()
      );
      Cesium.Cartesian3.add(target, newCameraPosition, newCameraPosition);

      // Compute the new camera direction
      const newDirection = Cesium.Cartesian3.negate(
        directionToCameraRotated,
        new Cesium.Cartesian3()
      );
      const newDirectionTransformed = Cesium.Matrix4.multiplyByPointAsVector(
        centerTransform,
        newDirection,
        enuCenter
      );
      camera.direction = newDirectionTransformed;

      // Compute the new camera up
      const newUp = Cesium.Cartesian3.negate(
        angularAxis,
        new Cesium.Cartesian3()
      );
      const newUpTransformed = Cesium.Matrix4.multiplyByPointAsVector(
        centerTransform,
        newUp,
        enuCenter
      );
      camera.up = newUpTransformed;

      camera.position = newCameraPosition;
    };

    this.viewer!.clock.onTick.addEventListener(this.orbit);
  }

  // Add this method to your class
  stopOrbit() {
    if (this.orbit) {
      this.viewer!.clock.onTick.removeEventListener(this.orbit);
    }
  }

  _newPost() {
    window.appGlobals.activity("open", "newPost");
    //TODO: Fix ts type
    window.appDialogs.getDialogAsync("postEdit", (dialog: YpPostEdit) => {
      setTimeout(() => {
        dialog.setup(
          undefined,
          true,
          this.afterNewPost.bind(this),
          this.group as YpGroupData,
          {
            groupId: this.group!.id,
            group: this.group as YpGroupData,
            tileData: this.tileManager.exportJSON(),
          }
        );
      }, 50);
    });
  }

  _appDialogsReady(event: CustomEvent) {
    if (event.detail) {
      window.appDialogs = event.detail;
    }
  }

  async inputAction(event: any) {
    if (this.gameStage === GameStage.Play) {
      this.tileManager.setInputAction(event);
    } else if (this.gameStage === GameStage.Results) {
      this.tileManager.setInputActionForResults(event);
    }
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

    //this.logFramerate();

    this.viewer.scene.globe.baseColor = Cesium.Color.GRAY;
    try {
      this.tileManager = new TileManager(this.viewer);
      const iconUrls = [
        "models/CesiumBalloon.glb",
        "models/CesiumBalloon.glb",
        "models/CesiumBalloon.glb",
        "models/CesiumBalloon.glb",
        "models/CesiumBalloon.glb",
        "models/CesiumBalloon.glb",
        "models/chatBubble5.glb",
      ];
    } catch (error) {
      console.error(error);
    }

    //this.uiManager = new UIManager(this.viewer, iconUrls);

    //Enable lighting based on the sun position
    this.viewer.scene.globe.enableLighting = true;

    const screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );

    screenSpaceEventHandler.setInputAction(
      this.inputAction.bind(this),
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
      const giantStart = Cesium.Cartesian3.fromDegrees(
        longLatStart[1],
        longLatStart[0]
      );

      const giantEnd = Cesium.Cartesian3.fromDegrees(
        longLatEnd[1],
        longLatEnd[0]
      );

      this.characterManager = new CharacterManager(
        this.viewer!,
        giantStart,
        giantEnd
      );
      this.characterManager.setupCharacter();

      setTimeout(() => {
        const dragonLongLatStart = [65.56472600995652, -14.117065946587537];
        const dragonLongLatEnd = [64.80437929394297, -18.70322644445653];

        // Convert lang/lat to cartesian
        const dragonStart = Cesium.Cartesian3.fromDegrees(
          dragonLongLatStart[1],
          dragonLongLatStart[0]
        );

        const dragonEnd = Cesium.Cartesian3.fromDegrees(
          dragonLongLatEnd[1],
          dragonLongLatEnd[0]
        );

        this.dragonManager = new DragonManager(
          this.viewer!,
          dragonStart,
          dragonEnd
        );
        this.dragonManager.setupCharacter();
      }, 1000 * 60 * 60 * 60);

      setTimeout(() => {
        const eagleLongLatStart = [66.13323697690669, -18.916804650989715];
        const eagleLongLatEnd = [64.67281083721116, -18.55963945209211];

        const eagleStart = Cesium.Cartesian3.fromDegrees(
          eagleLongLatStart[1],
          eagleLongLatStart[0]
        );

        const eagleEnd = Cesium.Cartesian3.fromDegrees(
          eagleLongLatEnd[1],
          eagleLongLatEnd[0]
        );

        this.eagleManager = new EagleManager(
          this.viewer!,
          eagleStart,
          eagleEnd
        );
        this.eagleManager.setupCharacter();
      }, 1000 * 60 * 60 * 60);

      const bullLongLatStart = [64.80294898622358, -23.77641212993773];
      const bullLongLatEnd = [64.7634513702002, -19.572002677195176];

      const bullStart = Cesium.Cartesian3.fromDegrees(
        bullLongLatStart[1],
        bullLongLatStart[0]
      );

      const bullEnd = Cesium.Cartesian3.fromDegrees(
        bullLongLatEnd[1],
        bullLongLatEnd[0]
      );

      this.bullManager = new BullManager(this.viewer!, bullStart, bullEnd);
      this.bullManager.setupCharacter();
    });

    //Enable depth testing so things behind the terrain disappear.
    this.viewer.scene.globe.depthTestAgainstTerrain = true;

    await this.flyToPosition(
      -20.62592534987823,
      64.03985855384323,
      35000,
      44,
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

  saveComment(event: CustomEvent) {
    const pointId = event.detail;
    if (this.currentRectangleIdForComment) {
      this.tileManager.addCommentToRectangle(
        this.currentRectangleIdForComment,
        pointId
      );
    } else {
      console.error("Can't find rectangle for comment");
    }
  }

  renderUI() {
    if (this.hideUI) return nothing;
    else
      return html`
        <div id="landUseSelection" ?hidden="${this.gameStage===GameStage.Intro}">
          <button id="landUse1" ?selected=${this.selectedLandUse === "energy"}>
            Energy
          </button>
          <button id="landUse2" ?selected=${this.selectedLandUse === "gracing"}>
            Gracing
          </button>
          <button id="landUse3" ?selected=${this.selectedLandUse === "tourism"}>
            Tourism
          </button>
          <button
            id="landUse4"
            ?selected=${this.selectedLandUse === "recreation"}
          >
            Recreation
          </button>
          <button
            id="landUse5"
            ?selected=${this.selectedLandUse === "restoration"}
          >
            Restoration
          </button>
          <button
            id="landUse6"
            ?selected=${this.selectedLandUse === "conservation"}
          >
            Conservation
          </button>
          <button id="commentButton" ?hidden="${this.gameStage===GameStage.Results}">Comment</button>
        </div>

        <div id="navigationButtons" ?hidden="${this.gameStage===GameStage.Intro}">
          <button id="showAll">Show all</button>
          <button id="trackPlane">Plane</button>
        </div>

        <div id="terrainProviderSelection" ?hidden="${this.gameStage===GameStage.Intro}">
          <button id="chooseAerial">Aerial</button>
          <button id="chooseAerialWithLabels">Labels</button>
          <button id="chooseOpenStreetMap">Map</button>
        </div>

        <div id="gameStats" ?hidden="${this.gameStage!==GameStage.Play}">
          <div id="progressBars">
            ${this.numberOfTilesWithLandUse != undefined &&
            this.totalNumberOfTiles != undefined &&
            this.numberOfTilesWithComments != undefined
              ? html`
                  <div class="progressBarContainer">
                    <div
                      class="progressBar"
                      style="width: ${(this.numberOfTilesWithLandUse /
                        this.totalNumberOfTiles) *
                      100}%"
                    ></div>
                  </div>
                  <div class="progressBarContainer">
                    <div
                      class="progressBar progressBarComments"
                      style="width: ${(this.numberOfTilesWithComments /
                        this.targetCommentCount) *
                      100}%"
                    ></div>
                  </div>
                `
              : nothing}
          </div>
          <button
            id="submitButton"
            ?disabled="${this.disableSubmitButton}"
          >
            Submit
          </button>
        </div>
      `;
  }

  render() {
    return html`
      <yp-app-dialogs id="dialogContainer"></yp-app-dialogs>
      <div id="cesium-container"></div>
      <div id="emptyCreditContainer"></div>

      ${this.renderUI()}

      <yp-new-comment-dialog
        id="newCommentDialog"
        .group="${this.group}"
        @save="${this.saveComment}"
      ></yp-new-comment-dialog>
      <yp-comment-dialog
        id="commentDialog"
        .group="${this.group}"
      ></yp-comment-dialog>
    `;
  }
}
