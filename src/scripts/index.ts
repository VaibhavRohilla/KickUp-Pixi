import "../styles/style.css";
import * as HTMLHANDLER from "./HtmlHandler";
import * as QUEST from "./quest";
import { AllQuests, ArrOfBalls } from "./QuestsConfig";
import { App } from "./App";
import { Globals } from "./Globals";
import Stats from "stats.js";
import { LoadQuestsData } from "./DataHandler";
import { getUnlockedQuests, RefereshAllQuests } from "./quest";
import { showQuestPanel } from "./HtmlHandler";
const test = require("./test");

Globals.fpsStats = new Stats();
Globals.fpsStats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
Globals.fpsStats.dom.style.cssText = "position:absolute;top:25px;left: 250px;scale:1";

Globals.stats = new Stats();
Globals.stats.showPanel(2); // 0: fps, 1: ms, 2: mb, 3+: custom
Globals.stats.domElement.style.cssText = "position:absolute;top:25px;left: 125px;";

Globals.App = new App();


for (let i = 0; i < AllQuests.length; i++) {
	QUEST.addQuest(AllQuests[i]);
}


test.setCallbackMethod(HTMLHANDLER.showQuestCompletedEffect);
// HTMLHANDLER.AssignClaimCallback((questID) => {
// 	//
// 	QUEST.getQuest(questID).claim();
// });
for (let i = 0; i < AllQuests.length; i++) {
	QUEST.addQuest(AllQuests[i]);
}

const loadQuests = LoadQuestsData();

console.log(loadQuests);

Object.keys(loadQuests).forEach((key) => {
	QUEST.getQuest(key).claimed = loadQuests[key].claimed;
	QUEST.getQuest(key).completed = loadQuests[key].completed;
	QUEST.getQuest(key).isUnlocked = loadQuests[key].isUnlocked;
});

test.setCallbackMethod(HTMLHANDLER.showQuestCompletedEffect);

HTMLHANDLER.AssignClaimCallback((questID) => {
	QUEST.getQuest(questID).claim();
});


HTMLHANDLER.addBallsToGameOverPanel(ArrOfBalls);
HTMLHANDLER.addOnBallAssignCallback((index: number) => {
	return false;
});
HTMLHANDLER.OnBuyBallAssignCallback((index: number) => {
	return false;
});
// HTMLHANDLER.showPanel(1);




// RefereshAllQuests();
// showQuestPanel(getUnlockedQuests(), 10);

// HTMLHANDLER.callMascot("Welcome to the testing g game")
