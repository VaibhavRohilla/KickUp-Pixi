import { GSSolver, WorldOptions } from "p2";
import * as PIXI from "pixi.js";
import { App } from "./App";
import { MyEmitter } from "./MyEmitter";
import { SceneManager } from "./SceneManager";
import { ScoreFunctions } from "./DataHandler";
import { Howl } from "howler";

type globalDataType = {
	resources: PIXI.utils.Dict<PIXI.LoaderResource>;
	emitter: MyEmitter | undefined;
	isMobile: boolean;
	fpsStats: Stats | undefined,
	soundResources: { [key: string]: Howl }
	App: App | undefined;
	stats: any;
};

export const Globals: globalDataType = {
	resources: {},
	emitter: undefined,
	get isMobile() {
		//  return true;
		return PIXI.utils.isMobile.any;
	},
	fpsStats: undefined,
	stats: undefined,
	App: undefined,
	soundResources: {},


};


export const soundValues = {
	isMusicActive: false,
}


export const GameData = {
	Rounds: 0,
	highScore: 0,
	lastScore: 0,
	potionKick: 0,
	potionScore: 0,
	potionBall: 0,
	potionBisquit: 0,
	usedPotionKick: 0,
	usedPotionScore: 0,
	usedPotionBall: 0,
	usedPotionBisquit: 0,
};

export const TimeTracker = {
	maxTime: 40,
	currentTime: 0,

	update: (dt: number) => {
		TimeTracker.currentTime += dt;
		if (TimeTracker.currentTime > TimeTracker.maxTime) {
			TimeTracker.currentTime = TimeTracker.maxTime;
			return true;
		}
		return false;
	}
}

export const DefaultWorldOptions: WorldOptions = {
	gravity: [0, 800],
	solver: new GSSolver({
		iterations: 600,
		tolerance: 0.02,
	}),
};
export const isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
	},
	any: function () {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};