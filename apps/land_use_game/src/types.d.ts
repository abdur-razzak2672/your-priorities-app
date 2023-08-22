// Interface for GeoJSON feature properties
interface FeatureProperties {
  Name: string;
  LandUse: string;
}

type TutorialStage =
  | "allStages"
  | "navigation"
  | "chooseType"
  | "clickOnMap"
  | "afterFirstSelection"
  | "openResults";

// Interface for GeoJSON feature
interface GeoJSONFeature {
  type: string;
  properties: FeatureProperties;
  geometry: {
    type: string;
    coordinates: number[][][][];
  };
}

interface YpPostNewsStoryReturn {
  point_id: number;
}

interface TutorialPageData extends YpHelpPageData {
  stage: TutorialStage
}
