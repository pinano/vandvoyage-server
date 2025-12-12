import "dotenv/config"; // MUST be first to load environment variables
import express from "express";
import cors from "cors";
import {
    stationsRouter,
    bikeRoutesRouter,
    viaRailRouter,
    ttcLineOneRouter,
    ttcLineTwoRouter,
    ttcLineThreeRouter,
    ttcLineFourRouter,
    liveRouter,
    goLinesBarrieRouter,
    goLinesKitchenerRouter,
    goLinesLSEastRouter,
    goLinesLSWestRouter,
    goLinesMiltonRouter,
    goLinesRHRouter,
    goLinesStouffvilleRouter,
    goLinesUPRouter,
    waterlooIonRouter,
    waterlooIonStageTwoRouter,
} from "./router/index.js";
import "mongoose";
import "./db/index.js";

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/stations", stationsRouter);
app.use("/bikeroutes", bikeRoutesRouter);
app.use("/viarail", viaRailRouter);

app.use("/ttclineone", ttcLineOneRouter);
app.use("/ttclinetwo", ttcLineTwoRouter);
app.use("/ttclinethree", ttcLineThreeRouter);
app.use("/ttclinefour", ttcLineFourRouter);

app.use("/live", liveRouter);

app.use("/golinesbarrie", goLinesBarrieRouter);
app.use("/golineskitchener", goLinesKitchenerRouter);
app.use("/golineslakeshoreeast", goLinesLSEastRouter);
app.use("/golineslakeshorewest", goLinesLSWestRouter);
app.use("/golinesmilton", goLinesMiltonRouter);
app.use("/golinesrichmondhill", goLinesRHRouter);
app.use("/golinesstouffville", goLinesStouffvilleRouter);
app.use("/golinesunionpearson", goLinesUPRouter);

app.use("/waterlooion", waterlooIonRouter);
app.use("/waterlooionstagetwo", waterlooIonStageTwoRouter);

app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
});
