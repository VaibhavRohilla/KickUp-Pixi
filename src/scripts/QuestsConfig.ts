import { GameData, Globals } from "./Globals";
import { LoaderConfig } from "./LoaderConfig";
import { checkIfClaimed, DIRECTION, Quest, Reward } from "./quest";

export const images = {
	package: require("../sprites/soccer-game/package.png"),
	packageHover: require("../sprites/soccer-game/package-hover.png"),
	ball0: require("../sprites/soccer-game/ball0.png"),
	ball1: require("../sprites/soccer-game/ball1.png"),
	ball2: require("../sprites/soccer-game/ball2.png"),
	ball3: require("../sprites/soccer-game/ball3.png"),
	ball4: require("../sprites/soccer-game/ball4.png"),
	ball5: require("../sprites/soccer-game/ball5.png"),
	ball6: require("../sprites/soccer-game/ball6.png"),
	ball7: require("../sprites/soccer-game/ball7.png"),
	ball6Visual: require("../sprites/soccer-game/ball6-visual.png"),
	ball7Visual: require("../sprites/soccer-game/ball7-visual.png"),
	ball8: require("../sprites/soccer-game/ball8.png"),
	ball9: require("../sprites/soccer-game/ball9.png"),
	Potion_Kick: require("../sprites/soccer-game/potion-kick.png"),
	Potion_Ball: require("../sprites/soccer-game/potion-ball.png"),
	Potion_Score: require("../sprites/soccer-game/potion-score.png"),
	potion_Biscuit: require("../sprites/soccer-game/potion-bisquit.png"),
	biscuit: require("../sprites/soccer-game/golden-biscuit-small.png"),
	arrowLeft: require("../sprites/soccer-game/button-left.png"),
	arrowRight: require("../sprites/soccer-game/button-right.png"),
	helpFullBiscuit: require("../sprites/soccer-game/helpful-biscuit.png"),
	mascotMessage: require("../sprites/soccer-game/message.png"),
};

export const Rewards: { [id: string]: Reward } = {
	potionBall: new Reward(
		"Potion Ball",
		"potionBall",
		"Gives Extra balls",
		"This potion give you Extra ball each time!\n Tap it to use it (valid till you drop the Ball)",
		images.Potion_Ball.default,

		() => {
			console.log("Toggle Powerup");
			Globals.emitter?.Call("potionBall", 0);
		},
		DIRECTION.LeftToRight
	),

	potionBisquit: new Reward(
		"Potion Biscuit",
		"potionBisquit",
		"Collect 2x Biscuits",
		"This potion helps you\ncollect +100% more biscuits!\n \n Tap it to use it (valid for 45 secs)",
		images.potion_Biscuit.default,
		() => {
			console.log("Toggle Powerup");
			Globals.emitter?.Call("potionBisquit", true);
		},
		DIRECTION.LeftToRight
	),
	potionKick: new Reward(
		"Potion Kick",
		"potionKick",
		"Increase Kick Size",
		"This potion helps you\nincreasing Kick size!\n\nTap it to use it (valid for 45 secs)",
		images.Potion_Kick.default,
		() => {
			console.log("Toggle Powerup");
			Globals.emitter?.Call("potionKick", true);
		},
		DIRECTION.LeftToRight
	),
	potionScore: new Reward(
		"Potion Score",
		"potionScore",
		"Makes the ball Easy to Handle",
		"This potion helps you\ncontrol the Ball\n \nTap it to use it (valid for 45 secs)",
		images.Potion_Score.default,
		() => {
			console.log("Toggle Powerup");
			Globals.emitter?.Call("potionScore", true);
		},
		DIRECTION.LeftToRight
	),
};

export const AllQuests = [
	new Quest(
		"scorePoints1",
		"Score Points",
		"Score 10 points",
		Rewards.potionKick,
		1,
		true,
		() => {
			// return true;
			return GameData.lastScore >= 10;
		},
		() => {
			return true;
		},
		() => {
			const lastScore = Math.min(GameData.lastScore, 10);
			// const lastScore = 10;
			return [lastScore, 10];
		}
	),

	new Quest(
		"scorePoints2",
		"Score Points",
		"Score 50 points",
		Rewards.potionBisquit,
		1,
		false,
		() => {
			return GameData.lastScore >= 50;
		},
		() => {
			return checkIfClaimed("scorePoints1");
		},
		() => {
			const maxScore = Math.min(GameData.lastScore, 50);
			return [maxScore, 50];
		}
	),

	new Quest(
		"potionScore1",
		"Use Kick Potion",
		"Use Kick Potion Once",
		Rewards.potionBisquit,
		1,
		false,
		() => {
			return GameData.usedPotionKick >= 1;
		},
		() => {
			return true;
		},
		() => {
			const ballPotion = Math.min(GameData.usedPotionKick, 1);
			return [ballPotion, 1];
		}
	),
	new Quest(
		"potionScore2",
		"Use Score Potion",
		"Use Score Potion Once",
		Rewards.potionBall,
		1,
		false,
		() => {
			return GameData.usedPotionScore >= 1;
		},
		() => {
			return checkIfClaimed("scorePoints4");
		},
		() => {
			const scorePotion = Math.min(GameData.usedPotionScore, 1);
			return [scorePotion, 1];
		}
	),
	new Quest(
		"potionScore3",
		"Use Ball Potion",
		"Use Ball Potion Once",
		Rewards.potionBisquit,
		1,
		false,
		() => {
			return GameData.usedPotionBall >= 1;
		},
		() => {
			return checkIfClaimed("potionScore2");
		},
		() => {
			const ballPotion = Math.min(GameData.usedPotionBall, 1);
			return [ballPotion, 1];
		}
	),
	new Quest(
		"potionScore4",
		"Use bisc Potion",
		"Use biscuit Potion Once",
		Rewards.potionScore,
		1,
		false,
		() => {
			return GameData.usedPotionBisquit >= 1;
		},
		() => {
			return checkIfClaimed("potionScore1");
			return true;
		},
		() => {
			const bisquitPotion = Math.min(GameData.usedPotionBisquit, 1);
			return [bisquitPotion, 1];
		}
	),
	new Quest(
		"totalTimePlayed1",
		"Total Rounds",
		"Play 15 Rounds",
		Rewards.potionScore,
		1,
		false,
		() => {
			return GameData.Rounds >= 30;
		},
		() => {
			return checkIfClaimed("potionScore4");
		},
		() => {
			const Rounds = Math.min(GameData.Rounds, 30);
			return [Rounds, 30];
		}
	),
	new Quest(
		"totalTimePlayed2",
		"Total Rounds",
		"Play 30 Rounds",
		Rewards.potionBall,
		1,
		false,
		() => {
			return GameData.Rounds >= 30;
		},
		() => {
			return checkIfClaimed("totalTimePlayed1");
		},
		() => {
			const Rounds = Math.min(GameData.Rounds, 30);
			return [Rounds, 30];
		}
	),
	new Quest(
		"totalTimePlayed3",
		"Total Rounds",
		"Play 45 Rounds",
		Rewards.potionBisquit,
		1,
		false,
		() => {
			return GameData.Rounds >= 45;
		},
		() => {
			return checkIfClaimed("totalTimePlayed2");
		},
		() => {
			const Rounds = Math.min(GameData.Rounds, 45);
			return [Rounds, 45];
		}
	),
	new Quest(
		"totalTimePlayed4",
		"Total Rounds",
		"Play 60 Rounds",
		Rewards.potionKick,
		1,
		false,
		() => {
			return GameData.Rounds >= 60;
		},
		() => {
			return checkIfClaimed("totalTimePlayed3");
		},
		() => {
			const Rounds = Math.min(GameData.Rounds, 60);
			return [Rounds, 60];
		}
	),
	new Quest(
		"totalTimePlayed5",
		"Total Rounds",
		"Play 75 Rounds",
		Rewards.potionScore,
		1,
		false,
		() => {
			return GameData.Rounds >= 75;
		},
		() => {
			return checkIfClaimed("totalTimePlayed4");
		},
		() => {
			const Rounds = Math.min(GameData.Rounds, 75);
			return [Rounds, 75];
		}
	),
	new Quest(
		"totalTimePlayed6",
		"Total Rounds",
		"Play 90 Rounds",
		Rewards.potionBisquit,
		1,
		false,
		() => {
			return GameData.Rounds >= 90;
		},
		() => {
			return checkIfClaimed("totalTimePlayed5");
		},
		() => {
			const Rounds = Math.min(GameData.Rounds, 90);
			return [Rounds, 90];
		}
	),

	new Quest(
		"highScore1",
		"High Score",
		"Set 25 Highscore",
		Rewards.potionBall,
		1,
		true,
		() => {
			return GameData.highScore >= 25;
		},
		() => {
			return true;
		},
		() => {
			const highScore = Math.min(GameData.highScore, 25);
			return [highScore, 25];
		}
	),

	new Quest(
		"highScore2",
		"High Score",
		"Set 50 Highscore",
		Rewards.potionKick,
		2,
		false,
		() => {
			return GameData.highScore >= 50;
		},
		() => {
			return checkIfClaimed("highScore1");
		},
		() => {
			const highScore = Math.min(GameData.highScore, 50);
			return [highScore, 50];
		}
	),

	new Quest(
		"highScore3",
		"High Score",
		"Set 100 Highscore",
		Rewards.potionKick,
		1,
		false,
		() => {
			return GameData.highScore >= 100;
		},
		() => {
			return checkIfClaimed("highScore2");
		},
		() => {
			const highScore = Math.min(GameData.highScore, 100);
			return [highScore, 100];
		}
	),

	new Quest(
		"highScore4",
		"High Score",
		"Set 200 Highscore",
		Rewards.potionBall,
		1,
		false,
		() => {
			return GameData.highScore >= 200;
		},
		() => {
			return checkIfClaimed("highScore3");
		},
		() => {
			const highScore = Math.min(GameData.highScore, 200);
			return [highScore, 200];
		}
	),
	new Quest(
		"highScore5",
		"High Score",
		"Set 300 Highscore",
		Rewards.potionKick,
		1,
		false,
		() => {
			return GameData.highScore >= 300;
		},
		() => {
			return checkIfClaimed("highScore4");
		},
		() => {
			const highScore = Math.min(GameData.highScore, 300);
			return [highScore, 300];
		}
	),
	new Quest(
		"highScore5",
		"High Score",
		"Set 400 Highscore",
		Rewards.potionScore,
		1,
		false,
		() => {
			return GameData.highScore >= 400;
		},
		() => {
			return checkIfClaimed("highScore5");
		},
		() => {
			const highScore = Math.min(GameData.highScore, 400);
			return [highScore, 400];
		}
	),

	new Quest(
		"scorePoints3",
		"Score Points",
		"Score 70 points",
		Rewards.potionScore,
		2,
		false,
		() => {
			return GameData.lastScore >= 70;
		},
		() => {
			return checkIfClaimed("scorePoints2");
		},
		() => {
			const maxScore = Math.min(GameData.lastScore, 70);
			return [maxScore, 70];
		}
	),

	new Quest(
		"scorePoints4",
		"Score Points",
		"Score 120 points",
		Rewards.potionKick,
		2,
		false,
		() => {
			return GameData.lastScore >= 120;
		},
		() => {
			return checkIfClaimed("scorePoints3");
		},
		() => {
			const lastScore = Math.min(GameData.lastScore, 120);
			return [lastScore, 120];
		}
	),
	new Quest(
		"scorePoints5",
		"Score Points",
		"Score 200 points",
		Rewards.potionScore,
		1,
		false,
		() => {
			return GameData.lastScore >= 200;
		},
		() => {
			return checkIfClaimed("scorePoints4");
		},
		() => {
			const lastScore = Math.min(GameData.lastScore, 200);
			return [lastScore, 200];
		}
	),
	new Quest(
		"scorePoints5",
		"Score Points",
		"Score 400 points",
		Rewards.potionBisquit,
		2,
		false,
		() => {
			return GameData.lastScore >= 400;
		},
		() => {
			return checkIfClaimed("scorePoints4");
		},
		() => {
			const lastScore = Math.min(GameData.lastScore, 400);
			return [lastScore, 400];
		}
	),
	new Quest(
		"scorePoints6",
		"Score Points",
		"Score 600 points",
		Rewards.potionKick,
		2,
		false,
		() => {
			return GameData.lastScore >= 600;
		},
		() => {
			return checkIfClaimed("scorePoints5");
		},
		() => {
			const lastScore = Math.min(GameData.lastScore, 600);
			return [lastScore, 600];
		}
	),

	new Quest(
		"scorePoints7",
		"Score Points",
		"Score 800 points",
		Rewards.potionBisquit,
		2,
		false,
		() => {
			return GameData.lastScore >= 800;
		},
		() => {
			return checkIfClaimed("scorePoints6");
		},
		() => {
			const lastScore = Math.min(GameData.lastScore, 800);
			return [lastScore, 800];
		}
	),
];

export const ArrOfBalls = [
	{
		url: images.ball0.default,
		price: -1,
	},
	{
		url: images.ball1.default,
		price: 200,
	},
	{
		url: images.ball2.default,
		price: 300,
	},
	{
		url: images.ball3.default,
		price: 400,
	},
	{
		url: images.ball4.default,
		price: 500,
	},
	{
		url: images.ball5.default,
		price: 600,
	},
	{
		url: images.ball6Visual.default,
		price: 700,
	},
	{
		url: images.ball7Visual.default,
		price: 800,
	},
	{
		url: images.ball8.default,
		price: 900,
	},
	{
		url: images.ball9.default,
		price: 1000,
	},


];
