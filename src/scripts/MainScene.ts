import { Body, Box, ContactMaterial, Material } from "p2";
import { BoxEntity } from "././Entity";
import { Globals, GameData, soundValues, isMobile } from "./Globals";
import { Scene } from "./Scene";
import { Graphics, InteractionEvent, ObservablePoint, Sprite } from "pixi.js";
import { Ball } from "./Ball";
import { MouseCols } from "./MouseCol";
import { config } from "./appConfig";
import { Plane } from "./Plane";
import { TextLabel } from "./TextLabel";
import * as TWEEN from "@tweenjs/tween.js";
import * as PIXI from "pixi.js";
import { GameRestartPopup } from "./GameRestartPopup";
import { getBalance, ScoreFunctions, updateBalance } from "./DataHandler";
// import { Essentials } from "./Essentials";
import { OnBuyBallAssignCallback, addOnBallAssignCallback, addOnBallSlideOutCallback, addOnPlayCallback, showQuestPanel } from "./HtmlHandler";
import { getUnlockedQuests, RefereshAllQuests } from "./quest";
// getRewardValue;
import { PowerUp, PowerUpHolder } from "./PowerUpHolder";
import { Background } from "./Background";
import { lookup } from "dns";
import { fetchGlobalPosition } from "./Utilities";
import { fail } from "assert";
import { Fps } from "./Fps";


export class MainScene extends Scene {
	balls: Ball[] = [];
	mouseCol!: MouseCols;
	startGame: boolean = false;
	firstTouch: boolean = false;
	highScore: number = 0;
	currentScore: number = 0;
	currentScoreText!: TextLabel;
	highScoreText!: TextLabel;
	contactmaterial!: ContactMaterial;
	scoreOffset: number = 0;
	thumb!: Sprite;
	lastMousPos: { x: number; y: number } = { x: 0, y: 0 };
	currentMousPos: { x: number; y: number } = { x: 0, y: 0 };
	canBounce: boolean = false;
	canAddScore: boolean = true;
	colPoint!: { x: number; y: number };
	scoreCounterResetTimer!: NodeJS.Timeout;
	// essentials!: Essentials;
	scoreMultiplier: number = 1;
	heighestCombo: number = 0;
	currentMoney: number = 0;
	n_side_bounce: number = 0;
	sideLineR!: BoxEntity;
	sideLineL!: BoxEntity;
	upCol!: Plane;
	moneyText!: TextLabel;
	scoreBiscuit!: Sprite;
	potionCountDownNum!: number;
	TweenPotions!: TWEEN.Tween<ObservablePoint>;
	lastPotionUsed!: string;
	lastPotionCountDown: number = 46;
	canAddPotion: boolean = false;
	powerUps: PowerUp[];
	powerUpPotions: PowerUpHolder;
	potionToActive!: String;
	biscuitBreathe!: TWEEN.Tween<ObservablePoint>;
	potionbeingUsed: string[] = []
	isBgMusicInit: boolean = false;
	firstRound: boolean = false;
	increaseMoney: boolean = false;
	lastBallUsed !: number;
	bonusMoneyText!: TextLabel;
	bonusCoinTween !: TWEEN.Tween<ObservablePoint>;
	bg: Sprite[] = [];
	pressed: boolean = false;
	isMobile: boolean = false;
	isAd: boolean = false;
	Ground: Plane;
	// fps: Fps

	constructor() {

		super(0x3c3c3c);

		// this.fps = new Fps();
		// this.mainContainer.addChild(this.fps.fpsDisplay);
		// this.mainContainer.addChild(this.fps.avgFpsDisplay);


		this.mainContainer.interactive = true;

		let TotalRounds = ScoreFunctions.getOtherScore("TotalRounds");
		if (TotalRounds == null) {
			ScoreFunctions.addOtherScore("TotalRounds", 0);
		}
		if (isMobile.any())
			this.isMobile = true;

		// BACKGROUND 0
		this.bg[0] = new PIXI.Sprite(Globals.resources["BG_0"].texture);
		this.bg[0].pivot.set(0.5);
		this.bg[0].width = 7490;
		// this.bg[0].height = 5000;
		this.bg[0].position.x = -3240;
		this.bg[0].position.y = 0;
		this.addToScene(this.bg[0], 0);


		this.bg[1] = new PIXI.Sprite(Globals.resources["BG_1"].texture);
		this.bg[1].anchor.set(0.5);
		this.bg[1].scale.set(1);
		this.bg[1].position.x = 3500;
		this.bg[1].position.y = config.logicalHeight - 800;
		this.bg[1].zIndex = 0;
		this.addChild(this.bg[1]);

		this.bg[2] = new PIXI.Sprite(Globals.resources["BG_1"].texture);
		this.bg[2].anchor.set(0.5);
		this.bg[2].scale.set(1);
		this.bg[2].position.x = 500;
		this.bg[2].position.y = config.logicalHeight - 800;
		this.bg[2].zIndex = 0;
		this.addChild(this.bg[2]);

		this.bg[3] = new PIXI.Sprite(Globals.resources["BG_1"].texture);
		this.bg[3].anchor.set(0.5);
		this.bg[3].scale.set(1);
		this.bg[3].position.x = 2000;
		this.bg[3].position.y = config.logicalHeight - 800;
		this.bg[3].zIndex = 0;
		this.addChild(this.bg[3]);

		this.bg[4] = new PIXI.Sprite(Globals.resources["BG_1"].texture);
		this.bg[4].anchor.set(0.5);
		this.bg[4].scale.set(1);
		this.bg[4].position.x = -1000;
		this.bg[4].position.y = config.logicalHeight - 800;
		this.bg[4].zIndex = 0;
		this.addChild(this.bg[4]);

		this.bg[5] = new PIXI.Sprite(Globals.resources["BG_1"].texture);
		this.bg[5].anchor.set(0.5);
		this.bg[5].scale.set(1);
		this.bg[5].position.x = -2500;
		this.bg[5].position.y = config.logicalHeight - 800;
		this.bg[5].zIndex = 0;
		this.addChild(this.bg[5]);


		this.bg[6] = new PIXI.Sprite(Globals.resources["BG_2"].texture);
		this.bg[6].pivot.set(0.5);
		this.bg[6].width = 7490;
		// this.bg[6].height = 5000;
		this.bg[6].position.x = -3240;
		this.bg[6].position.y = window.innerHeight - 500 * config.minScaleFactor;
		// this.bg[6].height =;
		this.addToScene(this.bg[6], 1);

		const higschoreCrown = new PIXI.Sprite(Globals.resources["Crown"].texture);
		higschoreCrown.anchor.set(0.5);
		higschoreCrown.scale.set(0.17);
		higschoreCrown.position.x = 490;
		higschoreCrown.position.y = 120;
		higschoreCrown.zIndex = 0;

		this.mainContainer.addChild(higschoreCrown);



		// CREATIING THE SCORE BOARD FOR THE GAME
		this.currentScoreText = new TextLabel(550, 1800, 0.5, this.currentScore, 130, 0xffffff, "FredokaOne");
		this.currentScoreText.style.dropShadow = true;
		this.currentScoreText.style.dropShadowDistance = 2;
		this.currentScoreText.style.fontWeight = "bold";
		this.currentScoreText.style.lineJoin = "bevel";
		(this.currentScoreText.style.stroke = "0x4f3438"), (this.currentScoreText.style.strokeThickness = 20);

		this.highScoreText = new TextLabel(0, 120, 0.5, this.highScore, 60, 0xffffff, "FredokaOne");
		this.highScoreText.style.dropShadow = true;
		this.highScoreText.position.x = higschoreCrown.position.x + higschoreCrown.width / 2 + this.highScoreText.width;
		this.highScoreText.style.dropShadowDistance = 2;
		this.highScoreText.style.fontWeight = "bold";

		this.highScoreText.upadteLabelText(ScoreFunctions.getHighscore());
		this.mainContainer.addChild(this.highScoreText);
		this.mainContainer.addChild(this.currentScoreText);

		const goldenBiscuitCounter = new PIXI.Sprite(Globals.resources["golden_biscuitCounter"].texture);
		goldenBiscuitCounter.anchor.set(0.5);
		goldenBiscuitCounter.scale.set(1.2);
		goldenBiscuitCounter.y = 118;
		goldenBiscuitCounter.x = 250;
		this.mainContainer.addChild(goldenBiscuitCounter);

		this.scoreBiscuit = new PIXI.Sprite(Globals.resources["golden_biscuit"].texture);
		this.scoreBiscuit.anchor.set(0.5);
		this.scoreBiscuit.y = 118;
		this.scoreBiscuit.x = goldenBiscuitCounter.x - goldenBiscuitCounter.width / 2.5;
		this.mainContainer.addChild(this.scoreBiscuit);

		this.biscuitBreathe = new TWEEN.Tween(this.scoreBiscuit.scale)
			.to({ x: 1.1, y: 1.1 }, 1000)
			.easing(TWEEN.Easing.Quadratic.Out)
			.yoyo(true)
			.repeat(Infinity)
			.start();
		let totalMoney = getBalance();
		this.moneyText = new TextLabel(0, 0, 0.5, totalMoney, 50, 0xffffff);
		this.moneyText.x = 20;
		goldenBiscuitCounter.addChild(this.moneyText);

		// THE GROUND COLLIDER FOR THE GAME
		this.Ground = new Plane(config.logicalWidth*2, 50, 0, config.logicalHeight - 230, 3);
		this.addChild(this.Ground);

		// THE COLLIDER TO NOT GO WAY ABOVE THE GROUND
		this.upCol = new Plane(config.logicalWidth, 50, config.logicalWidth / 2, config.logicalHeight - 4500, 5);
		this.addChild(this.upCol);
		this.upCol.planeBody.damping = 0.5;

		//THE MOUSE POINTER FOR THE GAME
		this.mouseCol = new MouseCols();
		this.mainContainer.addChild(this.mouseCol.container);

		if (this.isMobile)
			this.mouseCol.setVisible(false);

		this.sideLineR = new BoxEntity(
			Globals.resources["sideLine"].texture,
			{
				type: Body.KINEMATIC,
				mass: 10,
				// id: 4,
				position: [4100, 0],
				force:[100,100]
			},
			new Box({
				width: 5900,
				height: 5000,
			}),
			4
		);
		this.sideLineR.shape.material = new Material();
		this.sideLineR.alpha = 0.3;
		this.sideLineR.anchor.set(0.5);
		this.sideLineR.x = 4100;

		this.mainContainer.addChild(this.sideLineR);

		this.sideLineL = new BoxEntity(
			Globals.resources["sideLine"].texture,
			{
				type: Body.KINEMATIC,
				mass: 0,
				// id: 4,
				position: [-2800, 0],
				angularForce:5,
				
			},
			new Box({
				width: 5500,
				height: 5000,
			}),
			4
		);

		this.sideLineL.shape.material = new Material();
		this.sideLineL.x = -2800;
		this.sideLineL.anchor.set(0.5);
		this.sideLineL.alpha = 0.3;

		this.mainContainer.addChild(this.sideLineL);

		//THE BALL FOR THE GAME
		let x = ScoreFunctions.getOtherScore("LastBallUsed");
		if (x != null) {
			this.lastBallUsed = x;
			this.balls.push(
				new Ball(x, 550, config.logicalHeight / 2, [
					this.mouseCol.GetMaterial(),
					this.sideLineR.shape.material,
					this.sideLineL.shape.material,
					this.upCol.planeShape.material,
					this.Ground.planeShape.material
				])
			);
		} else {
			this.lastBallUsed = 1;
			this.balls.push(
				new Ball(1, 550, config.logicalHeight - 460, [
					this.mouseCol.GetMaterial(),
					this.sideLineR.shape.material,
					this.sideLineL.shape.material,
					this.upCol.planeShape.material,
					this.Ground.planeShape.material
				])
			);
			ScoreFunctions.addOtherScore("LastBallUsed", 1);
		}
		this.mainContainer.addChild(this.balls[0].container);

		//POWER UPS
		// this.essentials = new Essentials();
		// this.mainContainer.addChild(this.essentials.container);



		//THUMB ANIMATION FOR THE START
		this.thumb = new PIXI.Sprite(Globals.resources["fingericon"].texture);
		this.thumb.anchor.set(0.5);
		this.thumb.scale.set(0.5);
		this.thumb.rotation = 0.5;
		this.thumb.x = 600;
		this.thumb.y = 1800;
		this.thumb.zIndex = 1;
		this.mainContainer.addChild(this.thumb);
		this.thumbAnim(true);


		this.mainContainer.on("pointerdown", (e: InteractionEvent) => {


			if (!this.pressed && this.isMobile && this.startGame) {

				if (this.isMobile)
					this.mouseCol.setVisible(true);


				this.pressed = true;
				const point = e.data.getLocalPosition(this.mainContainer);

				this.mouseCol.changePos(point);

				this.currentMousPos = {
					x: Math.floor(this.mouseCol.mousePointer.transform.position._x),
					y: Math.floor(this.mouseCol.mousePointer.transform.position._y),
				};

				// this.mouseCol.mousePointer.visible = true;
			}
			if (!this.isMobile && this.startGame) {

				this.pressed = true;
				const point = e.data.getLocalPosition(this.mainContainer);

				this.mouseCol.changePos(point);

				this.currentMousPos = {
					x: Math.floor(this.mouseCol.mousePointer.transform.position._x),
					y: Math.floor(this.mouseCol.mousePointer.transform.position._y),
				};
			}


		});
		this.mainContainer.on("pointermove", (e: InteractionEvent) => {


			if (this.pressed && this.isMobile && this.startGame) {
				
				if(!this.mouseCol.isVisible)
				this.mouseCol.setVisible(true);

				const point = e.data.getLocalPosition(this.mainContainer);
				// console.log(point);

				this.mouseCol.changePos(point);

				this.currentMousPos = {
					x: Math.floor(this.mouseCol.mousePointer.transform.position._x),
					y: Math.floor(this.mouseCol.mousePointer.transform.position._y),
				};

				// this.mouseCol.mousePointer.visible = true;
			}
			if (!this.isMobile && this.startGame) {
				const point = e.data.getLocalPosition(this.mainContainer);
				// console.log(point);

				this.mouseCol.changePos(point);

				this.currentMousPos = {
					x: Math.floor(this.mouseCol.mousePointer.transform.position._x),
					y: Math.floor(this.mouseCol.mousePointer.transform.position._y),
				};
			}


		});

		this.mainContainer.on("pointerup", (e: InteractionEvent) => {
			if (this.isMobile && this.startGame) {
				this.mouseCol.setVisible(false);
				this.pressed = false;
			}
		});

		this.powerUps = [
			new PowerUp([Globals.resources["potion_Ball"].texture], "potionBall"),
			new PowerUp([Globals.resources["poition_Kick"].texture], "potionKick"),
			new PowerUp([Globals.resources["potion_Bisquit"].texture], "potionBisquit"),
			new PowerUp([Globals.resources["potion_Score"].texture], "potionScore"),
		];
		this.powerUpPotions = new PowerUpHolder(this.powerUps, false, +this.powerUps[0].width, window.innerHeight - 100);
		this.powerUpPotions.scale.set(2);
		this.powerUpPotions.pivot.set(0.5);
		this.powerUpPotions.x = 100;
		this.powerUpPotions.y = 1750;
		this.mainContainer.addChild(this.powerUpPotions);

		if (this.firstRound) {
			this.powerUpPotions.potionTimeLeft();

		}
		// this.checkLowestTimerLeft();
		// for (let i = 0; i < this.powerUps.length; i++) {
		// 	let x = ScoreFunctions.getOtherScore(this.powerUps[i].cooldownID);
		// 	if (x != null && x < 45) {
		// 		this.powerUps.forEach((element) => {
		// 			element.setActiveCounter(false);
		// 		});
		// 	}
		// }






		const wholeStartButton = new Graphics();
		wholeStartButton.beginFill(0x00000, 0.4);
		wholeStartButton.drawRect(-3600, -500, 7000, 5000);
		wholeStartButton.endFill();


		const buttonBackDrop = new Graphics();
		buttonBackDrop.beginFill(0xFFFFFF, 1);
		buttonBackDrop.drawRoundedRect(200, 700, 700, 250, 20);
		buttonBackDrop.endFill();
		const backDropText1 = new TextLabel(550, 740, 0.5, "New Game ?", 45, 0x000000);
		const backDropText2 = new TextLabel(550, 805, 0.5, "Ready To Play?", 45, 0x606060);
		buttonBackDrop.addChild(backDropText1, backDropText2);


		const startGameButton = new Graphics();
		startGameButton.beginFill(0x42f5b0, 1);
		startGameButton.drawRoundedRect(200, 850, 700, 130, 20);
		startGameButton.endFill();
		startGameButton.interactive = true;
		startGameButton.buttonMode = true;
		const startButtonText = new TextLabel(550, 915, 0.5, "Let's GO", 55, 0xffffff);
		startButtonText.style.fontWeight = 'bolder'
		startGameButton.addChild(startButtonText);


		buttonBackDrop.beginFill(0xFFFFFF, 1);
		buttonBackDrop.drawRoundedRect(300, 700, 500, 250, 16);
		buttonBackDrop.endFill();

		wholeStartButton.addChild(buttonBackDrop, startGameButton);
		this.mainContainer.addChild(wholeStartButton);

		startGameButton.on("pointerdown", () => {





			startGameButton.interactive = false;
			startGameButton.buttonMode = false;
			new TWEEN.Tween(wholeStartButton)
				.to({ y: -1500 }, 1200)
				.easing(TWEEN.Easing.Elastic.InOut)
				.onComplete(() => {
					this.startGame = true;
					this.firstRound = true;

					this.mainContainer.removeChild(wholeStartButton);
				})
				.start();



		});

		Globals.App?.world.on("beginContact", (e: any) => {
			if ((e.bodyA.checkID === 3 && e.bodyB.checkID === 1) || (e.bodyA.checkID === 1 && e.bodyB.checkID == 3)) {

				if (this.startGame && this.firstTouch && this.balls.length == 1) this.restartGame();

				if (this.startGame && this.firstTouch && this.balls.length > 1) {
					const ballBody = e.bodyA.checkID == 1 ? e.bodyA : e.bodyB;
					ballBody.parentRef.destroyBall();
					this.balls.splice(this.balls.indexOf(ballBody.parentRef), 1);
					// console.log(this.balls);
					// delete this.balls[ballBody];
					this.balls.forEach((ball) => {
						ball.Ball.body.gravityScale = 1;
					});
					console.log("RESTARTED");
				}



			}

			if ((e.bodyA.checkID === 1 && e.bodyB.checkID === 2) || (e.bodyA.checkID === 2 && e.bodyB.checkID === 1)) {


				this.colPoint = {
					x: e.contactEquations[0].contactPointB[0] + e.bodyB.position[0],
					y: e.contactEquations[0].contactPointB[1] + e.bodyA.position[1],
				};

				const ballBody = e.bodyA.checkID == 1 ? e.bodyA : e.bodyB;


				if (this.firstTouch) {
					//score add
					if (this.canAddScore) {
						this.scoreOffset++;
						this.currentScore = this.currentScore + this.scoreOffset;

						// this.balls.forEach(element => {
						// 	element.Ball.body.velocity[0] = element.Ball.body.velocity[0] * 1.4;
						// 	element.Ball.body.velocity[1] = element.Ball.body.velocity[1] * 1.4;

						// });


						if (this.increaseMoney) {
							this.currentMoney = Math.ceil(this.currentScore);
						}
						else
							this.currentMoney = Math.ceil(this.currentScore / 2);

						this.showScore(this.currentScore + this.scoreOffset, this.colPoint);
						this.currentScoreText.upadteLabelText(this.currentScore);

						Globals.soundResources.ballCol.volume(0.15);
						Globals.soundResources.ballCol.fade(0.15, 0, 300);
						Globals.soundResources.ballCol.play();

					}

					this.resetScoreCounter();

					// console.log(this.canBounce);

					// ballBody.body.([ballBody.body.angle, 10000]);

					//    this.canAddScore= false
				} else {
					this.currentScoreText.upadteLabelText(this.currentScore);
				}

				if (!this.firstTouch && this.startGame) {
					this.mouseCol.Setcol();
					
					ballBody.parentRef.CircleEffectStart();
					ballBody.parentRef.startVelocity();
					this.thumbAnim(false);
					// for (let i = 0; i < this.powerUps.length; i++) {
					// 	let lastPotionUsed = ScoreFunctions.getOtherScore(this.powerUps[i].cooldownID);
					// 	if (lastPotionUsed != null)
					// 		if (lastPotionUsed < 45) {
					// 			console.log("CALLED LAST POTION");

					// 			this.potionToActive = this.powerUps[i].powerUpID;
					// 			//  this.powerUps[i].counter--;
					// 			//  this.powerUps[i].counterLabel.upadteLabelText( this.powerUps[i].counter);
					// 		}
					// }

					this.powerUps.forEach(element => {
						if (element.n_powerUpCounter != 45 && !element.isActive) {
							if (element.powerUpID == "potionKick") {
								this.increaseCol(true);
								console.log("Active Potion");
								element.powerupCountDown();
								element.setActiveCountdown(true);

							}
							if (element.powerUpID == "potionScore") {
								console.log("Active Potion");
								element.powerupCountDown();
								element.setActiveCountdown(true);

								this.slowDownBall(true);
							}
							if (element.powerUpID == "potionBisquit") {
								console.log("Active Potion");
								this.bonusCoins(true);
								element.powerupCountDown();
								element.setActiveCountdown(true);
							}



						}

					});
					let x = false;
					this.potionbeingUsed.forEach(element => {
						if (element == "potionKick" && !this.powerUps[1].isActive) {
							this.increaseCol(true);
							this.powerUps[1].powerupCountDown();
							this.powerUps[1].setActiveCountdown(true);

						}
						if (element == "potionScore" && !this.powerUps[3].isActive) {
							this.powerUps[3].powerupCountDown();
							this.powerUps[3].setActiveCountdown(true);


							this.slowDownBall(true);
						}
						if (element == "potionBisquit" && !this.powerUps[2].isActive) {
							this.bonusCoins(true);
							this.powerUps[2].powerupCountDown();
							this.powerUps[2].setActiveCountdown(true);


						}

						if (element == "potionBall" && !x) {
							this.addBall();
							this.powerUps[0].powerupCountDown();
							x = true;
						}



					});
					this.powerUpPotions.totalPotionsLeft();
					this.firstTouch = true;
				}
			}

			if ((e.bodyA.checkID === 1 && e.bodyB.checkID === 4) || (e.bodyA.checkID === 4 && e.bodyB.checkID === 1)) {
				this.scoreOffset = this.scoreOffset * 0;
				this.currentScore = this.currentScore + this.scoreOffset;
				this.currentScoreText.upadteLabelText(this.currentScore);
				this.n_side_bounce++;
			}
			if ((e.bodyA.checkID === 1 && e.bodyB.checkID === 1) || (e.bodyA.checkID === 1 && e.bodyB.checkID === 1)) {
				this.balls.forEach((ball) => {
					ball.Ball.body.angularDamping = 1;
				});
			}

		});
		Globals.App?.world.on("endContact", (e: any) => {
			if ((e.bodyA.checkID === 1 && e.bodyB.checkID === 2) || (e.bodyA.checkID === 2 && e.bodyB.checkID === 1)) {
				if (this.startGame) {
					this.canBounce = false;
				}
			
			}
			if ((e.bodyA.checkID === 1 && e.bodyB.checkID === 1) || (e.bodyA.checkID === 1 && e.bodyB.checkID === 1)) {
				setTimeout(() => {
					this.balls.forEach((ball) => {
						ball.Ball.body.angularDamping = 0.4;
					});
				}, 100);
			}
		});

		addOnPlayCallback(this.freezeGame.bind(this, false));

		addOnBallSlideOutCallback(this.ballSlideOut.bind(this));

		addOnBallAssignCallback(this.ballAssignCallback.bind(this));

		OnBuyBallAssignCallback(() => {
			updateBalance(this.currentMoney);
			this.moneyText.upadteLabelText(getBalance());
		})
		if (isMobile) {
			// is mobile.. 
			this.sideLineL.visible = false;
			this.sideLineR.visible = false;
		}
		else {
			this.sideLineL.visible = true;
			this.sideLineR.visible = true;
		}
	}



	bgMusicInit() {
		Globals.soundResources.bgMusic.play();
		Globals.soundResources.bgMusic.loop(true);
		Globals.soundResources.bgMusic.volume(0.7);
	}

	ballSlideOut(questID: string, rewardID: string) {
		// const rewardValue = getRewardValue(questID);
		// console.log(Q);

		for (let x = 0; x < this.powerUps.length; x++) {
			if (this.powerUps[x].powerUpID == rewardID) {
				this.powerUps[x].addCounter();
				Globals.soundResources.ui_scroll.play();
				this.powerUpPotions.totalPotionsLeft();
			}
		}
		// this.essentials.addPotion(rewardID, rewardValue);
	}
	resize(): void {
		super.resize();

		if (isMobile && window.innerWidth > window.innerHeight) {
			// is mobile.. 
			this.sideLineL.visible = true;
			this.sideLineR.visible = true;
		}
		else if (isMobile && window.innerWidth < window.innerHeight) {
			this.sideLineL.visible = false;
			this.sideLineR.visible = false;
		}
		// this.powerUpPotions.resize();
		this.bg[6].position.y = window.innerHeight - 500 * config.minScaleFactor;
	}
	ballAssignCallback(index: number) {
		// console.log(index + " _ BallChanged");
		Globals.soundResources.ui_click.play();
		if (index >= 0 && index < 13) {
			this.mainContainer.removeChild(this.thumb);
			this.balls.forEach((element) => {
				element.destroyBall();
				this.balls.pop();
				// console.log(this.balls);
			});
			this.lastBallUsed = index + 1;
			this.balls.push(
				new Ball(index + 1, 550, config.logicalHeight - 360, [
					this.mouseCol.GetMaterial(),
					this.sideLineR.shape.material,
					this.sideLineL.shape.material,
					this.upCol.planeShape.material,
					this.Ground.planeShape.material
				])
			);

			if (ScoreFunctions.getOtherScore("LastBallUsed")) ScoreFunctions.setOtherScore("LastBallUsed", index + 1);
			else ScoreFunctions.addOtherScore("LastBallUsed", index + 1);

			this.mainContainer.addChild(this.balls[0].container, this.thumb);
		} else {

			console.log("Play More to Buy Balls");
		}
	}

	resetScoreCounter() {
		this.canAddScore = false;
		clearTimeout(this.scoreCounterResetTimer);

		this.scoreCounterResetTimer = setTimeout(() => {
			this.canAddScore = true;
		}, 400);
	}
	bgResize() {
		this.bg
	}
	update(dt: number): void {
		// this.fps.update(dt);
		// console.log(Globals.resources)
		if (!soundValues.isMusicActive && Globals.soundResources.bgMusic) {
			this.bgMusicInit();//
			soundValues.isMusicActive = true;

		}


		for (let i = 0; i < this.balls.length; i++) {
			const element = this.balls[i];
			if (element != null) element.update(dt);
		}

		this.mouseCol.update(dt);

		if (Math.abs(this.currentMousPos.y - this.lastMousPos.y) >= 1.5) {
			this.canBounce = true;

			this.lastMousPos = {
				x: Math.floor(this.mouseCol.mousePointer.transform.position._x),
				y: Math.floor(this.mouseCol.mousePointer.transform.position._y),
			};
		} else {
			this.canBounce = false;
		}
		if (this.scoreOffset >= 5) {
			this.balls.forEach((ball) => {
				if (ball != null) ball.addFire(true);
			});
		} else {
			this.balls.forEach((ball) => {
				if (ball != null) ball.addFire(false);
			});
		}
		if (this.firstTouch) {
			this.powerUpPotions.potionTimeLeft();
		}
	}

	thumbAnim(canAnim: Boolean) {
		if (canAnim) {
			new TWEEN.Tween(this.thumb)
				.to({ x: 650, y: 1300 }, 750)
				.easing(TWEEN.Easing.Quadratic.InOut)
				.onComplete(() => {
					new TWEEN.Tween(this.thumb)
						.to({ x: 650, y: 1750 }, 750)
						.easing(TWEEN.Easing.Quadratic.InOut)
						.onComplete(() => {
							this.thumbAnim(canAnim);
						})
						.start();
				})
				.start();
		}

		if (!canAnim) {
			this.thumb.visible = false;
		}
	}

	recievedMessage(msgType: string, msgParams: any): void {
		//this.powerUpPotions.totalPotionsLeft(this.powerUps);


		if (msgType == "Restart") {
			this.restartGame();
		}

		if (msgType == "resume") {
			if (msgParams)
				Globals.soundResources.bgMusic.mute(false);
			if (!msgParams)
				Globals.soundResources.bgMusic.mute(true);

		}

		// if (msgType == "potionKick" && !msgParams) {
		// 	this.increaseCol(false);

		// }
		// if (msgType == "potionScore" && !msgParams) {
		// 	this.slowDownBall(false);
		// }
		// if (msgType == "potionBisquit" && !msgParams) {
		// 	this.bonusCoins(false);
		// }

		// if (msgType == "potionBall") {
		// 	this.addBall();
		// 	this.powerUps[0].powerupCountDown();
		// }


		if (this.firstTouch) {
			{
				if (msgType == "potionKick" && !this.powerUps[1].isActive) {
					this.increaseCol(true);
					this.powerUps[1].powerupCountDown();
					this.powerUps[1].setActiveCountdown(true);

				}
				if (msgType == "potionScore" && !this.powerUps[3].isActive) {
					this.powerUps[3].powerupCountDown();
					this.powerUps[3].setActiveCountdown(true);


					this.slowDownBall(true);
				}
				if (msgType == "potionBisquit" && !this.powerUps[2].isActive) {
					this.bonusCoins(true);
					this.powerUps[2].powerupCountDown();
					this.powerUps[2].setActiveCountdown(true);


				}

				if (msgType == "potionBall" && !this.powerUps[0].isActive) {
					this.addBall();
					this.powerUps[0].powerupCountDown();
				}

				// for (let i = 0; i < this.powerUps.length; i++) {
				// 	if (this.powerUps[i].powerUpID == msgType && !this.powerUps[i].isActive) {
				// 		this.powerUps[i].powerupCountDown();
				// 		// this.powerUps[i].isActive = true;
				// 	}
				// }
				this.powerUpPotions.totalPotionsLeft();
			}


		}
		 if (!this.firstTouch) {
			if (msgType == "potionKick") {
				this.potionbeingUsed.push(msgType)
			}
			if (msgType == "potionScore") {
				if (msgParams == true) {
					this.potionbeingUsed.push(msgType)

				}
			}
			if (msgType == "potionBisquit") {
				this.potionbeingUsed.push(msgType)

			}
			if (msgType == "potionBall") {
				this.potionbeingUsed.push(msgType)

			}

		}
		this.powerUpPotions.totalPotionsLeft();

	}


	cameraShake(): void {
		const tween = new TWEEN.Tween(this.mainContainer)
			.to({ x: config.minLeftX + 7.5, y: config.minTopY + 7.5 }, 45)
			.easing(TWEEN.Easing.Linear.None)
			.onComplete(() => {
				new TWEEN.Tween(this.mainContainer)
					.to({ x: config.minLeftX - 7.5, y: config.minTopY - 7.5 }, 45)
					.easing(TWEEN.Easing.Linear.None)
					.onComplete(() => {
						this.mainContainer.x = config.minLeftX;
						this.mainContainer.y = config.minTopY;
					})
					.repeat(2)
					.start();
			})
			.start();
	}

	freezeGame(stop: boolean) {
		
		this.mouseCol.changePos({ x: this.mouseCol.mousePointer.position.x, y: this.mouseCol.mousePointer.position.y + config.logicalHeight*2 });
	


		if (stop) {
			// if (this.lastPotionCountDown > 1) {
			//   this.essentials.updatePotions(this.lastPotionUsed, this.lastPotionCountDown);
			//   console.log(this.lastPotionCountDown);
			// }

			this.balls.forEach((ball) => {
				this.cameraShake();
				ball.CircleEffectEnd();
				ball.Ball.body.angularDamping = 1;
				ball.Ball.body.velocity = [0, 0];
			});

			this.firstTouch = false;
			this.canAddPotion = false;
			this.startGame = false;
			this.mainContainer.interactive = false;
			this.potionbeingUsed = [];
			this.potionToActive = "";
			// this.mouseCol.mousePointer.visible = false;
			if (this.isMobile)
				this.mouseCol.setVisible(false);

			this.mouseCol.mousePointer.body.collisionResponse = false;
			this.canBounce = false;

			this.increaseCol(false);
			this.bonusCoins(false);
			this.slowDownBall(false);

			for (let i = 0; i < this.powerUps.length; i++) {
				if (this.powerUps[i].isActive == true) {
					this.powerUps[i].potionTween?.stop();
				}
			}

			// this.checkLowestTimerLeft();

			GameData.potionScore = ScoreFunctions.getOtherScore("potionScore") || 0;
			GameData.potionKick = ScoreFunctions.getOtherScore("potionKick") || 0;
			GameData.potionBisquit = ScoreFunctions.getOtherScore("potionBisquit") || 0;
			GameData.potionBall = ScoreFunctions.getOtherScore("potionBall") || 0;

			//  this.essentials.canUse = true;
		}
		if (!stop) {
			this.currentMoney = 0;
			this.potionCountDownNum = 46;
			this.currentScore = 0;
			this.currentScoreText.upadteLabelText(this.currentScore);

			this.startGame = true;

			this.scoreOffset = 0;
			this.thumb.visible = true;

			for (let i = 0; i < this.powerUps.length; i++) {
				if (this.powerUps[i].isActive == true) {
					this.powerUps[i].potionTween?.stop();
				}
			}
			//this.essentials.canUse = true;
			// console.log(this.startGame);
			this.balls.forEach((ball) => {
				ball.Ball.body.angularDamping = 1;
				ball.Ball.body.velocity = [0, 0];
			});
			this.mainContainer.interactive = true;
			this.isAd = false;
		}
	}

	restartGame(): void {
		if (!this.isAd) {
			this.isAd = true;

			this.balls[0].Ball.body.STATIC;
			this.freezeGame(true);

			if (this.currentScore > 0)
				this.addCoins();

			GameData.highScore = ScoreFunctions.getHighscore();
			let HighestCombo = ScoreFunctions.getOtherScore("Heighest Combo");
			if (HighestCombo != null) {
				if (this.heighestCombo > HighestCombo) {
					ScoreFunctions.setOtherScore("Heighest Combo", this.heighestCombo);
				}

			} else {
				ScoreFunctions.addOtherScore("Heighest Combo", this.heighestCombo);
			}

			let totalMoney = getBalance();
			if (totalMoney != null) {
				updateBalance(this.currentMoney);
			}

			let c_Side_Bounce = ScoreFunctions.getOtherScore("Heighest Side Bounce");
			if (c_Side_Bounce != null) {
				if (c_Side_Bounce < this.n_side_bounce) ScoreFunctions.setOtherScore("Heighest Side Bounce", this.n_side_bounce);
			} else {
				ScoreFunctions.addOtherScore("Heighest Side Bounce", this.n_side_bounce);
			}

			let c_CurrentScore = ScoreFunctions.getOtherScore("CurrentScore");
			if (c_CurrentScore != null) {
				GameData.lastScore = c_CurrentScore + this.currentScore;
				ScoreFunctions.setOtherScore("CurrentScore", c_CurrentScore + this.currentScore);
			} else {
				ScoreFunctions.addOtherScore("CurrentScore", this.currentScore);
				GameData.lastScore = this.currentScore;
			}

			let RoundsPlayed = ScoreFunctions.getOtherScore("TotalRounds");
			if (RoundsPlayed != null) {
				ScoreFunctions.setOtherScore("TotalRounds", RoundsPlayed + 1);
				GameData.Rounds = RoundsPlayed + 1;
			} else {
				ScoreFunctions.addOtherScore("TotalRounds", 1);
			}

			ScoreFunctions.setHighScore(this.currentScore);

			if (this.currentScore > 0 && this.currentScore >= ScoreFunctions.getHighscore()) {
				this.highScoreText.upadteLabelText(ScoreFunctions.getHighscore());
				GameData.highScore = ScoreFunctions.getHighscore();
				Globals.soundResources.winSound.play();

				this.mainContainer.addChild(new GameRestartPopup(10, this.onWatchAd.bind(this), this.onWatchAd.bind(this)));
			}
			if (this.currentScore > 0 && this.currentScore < ScoreFunctions.getHighscore()) {

				if (this.currentScore > 0 && this.currentScore > ScoreFunctions.getHighscore() / 2) {
					Globals.soundResources.loseSound.play();

				}

				this.onWatchAd();
			}
			if (this.currentScore == 0) { setTimeout(() => { this.freezeGame(false) }, 500) }


		}
	}



	bonusCoins(can: boolean) {
		if (can) {
			if (this.bonusMoneyText == null) {
				this.bonusMoneyText = new TextLabel(0, 120, 0.5, "2X", 45);
				this.bonusMoneyText.x = this.highScoreText.x + this.highScoreText.width + this.bonusMoneyText.width / 2;
			}
			if (this.bonusCoinTween == null) {
				this.bonusCoinTween = new TWEEN.Tween(this.bonusMoneyText.scale);
				this.bonusCoinTween.to({ x: 1.2, y: 1.2 }, 450)
				this.bonusCoinTween.easing(TWEEN.Easing.Bounce.InOut)
				this.bonusCoinTween.yoyo(true);
				this.bonusCoinTween.repeat(Infinity);
				this.bonusCoinTween.start();
				this.mainContainer.addChild(this.bonusMoneyText);
			}
			else {
				this.mainContainer.addChild(this.bonusMoneyText);
				this.bonusCoinTween?.start();
			}

			this.increaseMoney = true;
			this.scoreMultiplier = 2;

		} else {
			this.increaseMoney = false;
			this.scoreMultiplier = 1;
			this.bonusCoinTween?.stop();
			this.mainContainer.removeChild(this.bonusMoneyText);



		}
	}

	onWatchAd() {
		RefereshAllQuests();
		showQuestPanel(getUnlockedQuests(), this.currentScore);
	}

	slowDownBall(can: boolean) {
		for (let i = 0; i < this.balls.length; i++) {
			if (can) {
				this.balls[i].Ball.body.damping = 0.2;
			} else {
				this.balls[i].Ball.body.damping = 0;
			}
		}
	}

	increaseCol(can: boolean) {
		if (can) {
			new TWEEN.Tween(this.mouseCol.mousePointer.shape).to({ radius: 140 }, 700).easing(TWEEN.Easing.Bounce.InOut).start();
		} else {
			new TWEEN.Tween(this.mouseCol.mousePointer.shape).to({ radius: 110 }, 700).easing(TWEEN.Easing.Bounce.InOut).start();
		}
	}

	tweenCoins(spriteID: Sprite, noOfCoins: number, toPosition: { x: number; y: number }, time: number) {
		// let TotalMoney = ScoreFunctions.getOtherScore("bal");

		this.biscuitBreathe.stop();
		new TWEEN.Tween(spriteID)
			.to({ x: toPosition.x, y: toPosition.y }, time)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onComplete(() => {
				spriteID.destroy();
				new TWEEN.Tween(this.scoreBiscuit.scale)
					.to({ x: 0.5, y: 0.5 }, 100)
					.easing(TWEEN.Easing.Elastic.In)
					.onComplete(() => {
						new TWEEN.Tween(this.scoreBiscuit.scale)
							.to({ x: 1.2, y: 1.2 }, 500)
							.easing(TWEEN.Easing.Quadratic.Out)
							.onComplete(() => {
								this.biscuitBreathe.start();
							})
							.start();
					})
					.start();
			})
			.start();

		new TWEEN.Tween(spriteID.scale)
			.to({ x: 0.8, y: 0.8 }, time)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onComplete(() => { })
			.start();
	}
	addCoins() {
		let TotalMoney = getBalance();
		console.log("CURRENT MONEY " + this.currentMoney);

		let x: number;

		if (this.currentMoney <= 6) {
			x = this.currentMoney;
		}

		if (this.currentMoney > 6) {
			x = 10;
		}
		let i = 0;

		Globals.soundResources.claimCoin.volume(0.4);
		Globals.soundResources.claimCoin.play();

		if (this.currentMoney > 0) {
			let Interval = setInterval(() => {
				const Coins = new PIXI.Sprite(Globals.resources["golden_biscuit"].texture);
				Coins.pivot.set(0.5);
				Coins.position.x = 550;
				Coins.position.y = 1561;
				Coins.scale.set(0.2);
				this.mainContainer.addChild(Coins);
				this.tweenCoins(Coins, x, this.scoreBiscuit.position, 700);
				i++;
				if (i >= x) {
					clearInterval(Interval);
					this.scoreBiscuit.scale.set(1.2);
				}
			}, 100);

		}
		setTimeout(() => {
			if (TotalMoney != null) this.moneyText.upadteLabelText(TotalMoney + this.currentMoney);
			else this.moneyText.upadteLabelText(this.currentMoney);
		}, 1000);
	}
	addBall() {
		this.balls.push(
			new Ball(this.lastBallUsed, 550, 100, [
				this.mouseCol.GetMaterial(),
				this.sideLineR.shape.material,
				this.sideLineL.shape.material,
				this.upCol.planeShape.material,
				this.Ground.planeShape.material
			])
		);
		this.mainContainer.addChild(this.balls[1].container);
		this.balls.forEach((ball) => {
			ball.Ball.body.gravityScale = 0.5;
		});
	}
	showScore(score: number, point: { x: number; y: number }) {
		const scoreText = new TextLabel(point.x, point.y, 0.5, "+" + this.scoreOffset * this.scoreMultiplier, 36, 0xffffff);
		scoreText.zIndex = 1;
		scoreText.alpha = 0;
		scoreText.style.dropShadowDistance = 2;

		scoreText.style.fontWeight = "bold";
		scoreText.style.lineJoin = "bevel";
		(scoreText.style.stroke = "0x4f3438"), this.addChild(scoreText);

		new TWEEN.Tween(scoreText.scale)
			.to({ x: 2.4, y: 2.7 }, 750)
			.easing(TWEEN.Easing.Linear.None)
			.onComplete(() => {
				new TWEEN.Tween(scoreText).to({ alpha: 0 }, 250).easing(TWEEN.Easing.Quadratic.Out).start();
			})
			.start();

		new TWEEN.Tween(scoreText).to({ alpha: 1 }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();

		new TWEEN.Tween(scoreText)
			.to({ x: point.x, y: point.y - 300 }, 750)
			.easing(TWEEN.Easing.Linear.None)
			.onComplete(() => {
				new TWEEN.Tween(scoreText)
					.to({ alpha: 0 }, 250)
					.easing(TWEEN.Easing.Quadratic.Out)
					.onComplete(() => {
						scoreText.destroy();
					})
					.start();
			})
			.start();
	}

}
