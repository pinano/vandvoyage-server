export const endpoint = process.env.REACT_APP_API_URL || "http://localhost:5001";

export const HTTP_STATUS = Object.freeze({
    PENDING: "PENDING",
    FULFILLED: "FULFILLED",
    REJECTED: "REJECTED",
});

export const CREATE = "CREATE";
export const UPDATE = "UPDATE";
export const DELETE = "DELETE";
export const FETCH_ALL = "FETCH_ALL";

// colours can be rgb, hex, or written out (written out might not always work due to leaflet)
export const viaRailLineColour = "rgb(156,0,0)";

export const torontoBikeLineColour = "grey";

export const ttcLineOneColour = "rgb(218,204,7)";
export const ttcLineTwoColour = "green";
export const ttcLineThreeColour = "purple";
export const ttcLineFourColour = "blue";

export const waterlooIonCurrentLineColour = "olive";
export const waterlooIonStage2LineColour = "darkgreen";

export const goLineBarrieLineColour = "black";
export const goLineKitchenerLineColour = "black";
export const goLineLSEastLineColour = "black";
export const goLineLSWestLineColour = "black";
export const goLineMiltonLineColour = "black";
export const goLineRHLineColour = "black";
export const goLineStouffvilleLineColour = "black";
export const goLineUnionPearsonLineColour = "black";

export const stationsColours = "black";
export const amtrakStationColours = "purple";
export const viaRailStationColours = "rgb(156,0,0)";
export const TTCColours = "green";
