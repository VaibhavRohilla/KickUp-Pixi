import { Easing, Tween } from "@tweenjs/tween.js";
import { AnimatedSprite, Container, FrameObject, Graphics, NineSlicePlane, ObservablePoint, Resource, Texture } from "pixi.js";
import { config } from "./appConfig";
import { ScoreFunctions } from "./DataHandler";
import { HGraphic, HGraphicType } from "./HGraphic";
import { Reward } from "./quest";
import { Rewards } from "./QuestsConfig";
import { TextLabel } from "./TextLabel";
import * as TWEEN from "@tweenjs/tween.js";
import { GameData, Globals } from "./Globals";
import { throws } from "assert";

export class PowerUpHolder extends Container {
	powerUps: PowerUp[] = [];

	widthOfChild: number = 0;
	noOfPowerups: number = 0;
	lowestPotionTime: number = 45;
	isOpened: boolean = false;
	totalPotionText!: TextLabel;
	totalPotionsGraphics: HGraphic;
	lowestPotionText !: TextLabel;
	lowestPotionGraphics: HGraphic;
	arrOfPowerUp: PowerUp[] = [];
	canPress: boolean = false;

	constructor(arrayOfPowerUps: PowerUp[], rightToLeft: boolean, x: number, y: number) {
		super();

		let startX = 0;
		this.x = x;
		this.y = y;
		this.arrOfPowerUp = arrayOfPowerUps;

		this.widthOfChild = this.arrOfPowerUp[0].width;

		for (let i = 0; i < this.arrOfPowerUp.length; i++) {
			this.arrOfPowerUp[i].x = startX;
			this.addChild(this.arrOfPowerUp[i]);
			this.arrOfPowerUp[i].setX(startX);
			this.powerUps.push(this.arrOfPowerUp[i]);

			if (rightToLeft) startX -= this.widthOfChild * 1.1;
			else startX += this.widthOfChild * 1.1;

			this.arrOfPowerUp[i].slideBack();
			this.noOfPowerups += this.arrOfPowerUp[i].counter;
			// this.arrOfPowerUp [i].addCounter();
		}

		this.zIndex = 20;

		this.interactive = true;

		this.on("pointerdown", () => {
			console.log(this.isOpened, "Opening");

			if (this.isOpened || this.isSliding) return;

			this.isOpened = true;
			this.totalPotionsGraphics.visible = false;
			this.lowestPotionGraphics.visible = false;


			this.powerUps.forEach((pwrUps) => {
				pwrUps.slideOut();
				if (pwrUps.n_powerUpCounter < 45 && pwrUps.n_powerUpCounter >= 1 && pwrUps.isActive) {
					pwrUps.setActiveCountdown(true)
				}
			});

			setTimeout(() => {
				this.pointerGotDown();
			}, 3000);
		});

		if (this.noOfPowerups == 0) this.renderable = true;

		this.totalPotionsGraphics = new HGraphic(HGraphicType.CIRCLE, 0x2c2c2c, { radius: 15 }, 1);
		this.totalPotionsGraphics.y = 55;
		this.totalPotionText = new TextLabel(0, -1.5, 0.5, this.noOfPowerups.toString(), 15, 0xffffff);
		this.totalPotionsGraphics.addChild(this.totalPotionText);
		this.totalPotionsGraphics.zIndex = 21;
		this.addChild(this.totalPotionsGraphics);
		this.totalPotionsGraphics.visible = true;

		this.lowestPotionGraphics = new HGraphic(HGraphicType.CIRCLE, 0x2c2c2c, { radius: 20 }, 0.8);
		this.lowestPotionGraphics.y = -60;
		this.lowestPotionText = new TextLabel(0, 0, 0.5, this.lowestPotionTime.toString(), 15, 0xffffff);
		this.lowestPotionGraphics.addChild(this.lowestPotionText);
		this.lowestPotionGraphics.visible = false;
		this.lowestPotionText.alpha = 1;
		// this.addChild(this.lowestPotionGraphics);

	}

	checkRenderable() {
		let counter = 0;
		for (let i = 0; i < this.powerUps.length; i++) {
			counter += this.powerUps[i].counter;
		}

		if (counter > 0) {
			this.renderable = true;
		} else this.renderable = false;
	}

	get isSliding() {
		for (let i = 0; i < this.powerUps.length; i++) {
			if (this.powerUps[i].isSliding) return true;
		}

		return false;
	}

	pointerGotDown() {
		console.log(this.isOpened, "Opened");

		if (!this.isOpened || this.isSliding) this.totalPotionsGraphics.visible = false;

		this.isOpened = false;
		this.totalPotionsGraphics.visible = true;



		this.powerUps.forEach((pwrUps) => {
			pwrUps.slideBack();
			if (pwrUps.n_powerUpCounter < 45 && pwrUps.n_powerUpCounter >= 1) {
				this.lowestPotionGraphics.visible = true;
			}
			else {
				this.lowestPotionGraphics.visible = true;

			}
			if (!pwrUps.isActive)
				pwrUps.setActiveCountdown(false)

		});
	}

	totalPotionsLeft() {
		this.noOfPowerups = this.powerUps[0].counter + this.powerUps[1].counter + this.powerUps[2].counter + this.powerUps[3].counter;
		this.totalPotionText.upadteLabelText(this.noOfPowerups);

	}
	// resize() {

	// 	this.totalPotionsGraphics.y = 60;
	// 	this.totalPotionsGraphics.x = -window.innerWidth + (2320 * config.minScaleFactor) / 2;
	// 	this.totalPotionsGraphics.zIndex = 21;
	// 	if (this.isOpened)
	// 		this.totalPotionsGraphics.visible = false;
	// 	else
	// 		this.totalPotionsGraphics.visible = true;


	// 	this.lowestPotionGraphics.x = -window.innerWidth + (2320 * config.minScaleFactor) / 2;
	// 	this.lowestPotionGraphics.y = -60;
	// 	if (this.isOpened)
	// 		this.lowestPotionGraphics.visible = true;
	// 	else
	// 		this.lowestPotionGraphics.visible = false;

	// 	this.lowestPotionText.alpha = 1;
	// }

	potionTimeLeft() {
		let n_lowestCooldown;
		let s_lowestCooldown = 45;

		for (let i = 0; i < this.powerUps.length; i++) {
			let n_cooldown = ScoreFunctions.getOtherScore(this.powerUps[i].cooldownID);
			if (n_cooldown != null) {
				if (n_cooldown < 45 && n_lowestCooldown == null) {
					n_lowestCooldown = n_cooldown;
					s_lowestCooldown = this.powerUps[i].n_powerUpCounter;
				}
				if (n_cooldown < 45 && n_lowestCooldown != null) {
					if (n_lowestCooldown > n_cooldown && n_cooldown != 0 && n_lowestCooldown != 0) {
						n_lowestCooldown = n_cooldown;
						s_lowestCooldown = this.powerUps[i].n_powerUpCounter;
					}
				}

			}
		}
		if (s_lowestCooldown < 45 && s_lowestCooldown >= 1) {
			this.lowestPotionText.upadteLabelText(s_lowestCooldown);
		}
		else
			this.lowestPotionGraphics.visible = false;

		return s_lowestCooldown;
	}
}

export class PowerUp extends AnimatedSprite {
	isSliding: boolean = false;
	defaultX: number = 0;
	counterBG: Graphics;
	counterLabel: TextLabel;
	counter: number = 0;
	defaultInteractivity: boolean = false;
	powerUpID: string;
	isActive: Boolean = false;
	n_powerUpCounter: number = 45;
	potionTween!: Tween<ObservablePoint>;
	showPotion: boolean = true;
	useCallback!: () => void;
	cooldownID!: string;
	potionCountDownGraphics!: HGraphic;
	potionCounterText!: TextLabel;
	canPress: boolean = false;

	constructor(textures: any[], idName: string) {
		super(textures);
		this.isActive = false;
		this.powerUpID = idName;
		this.anchor.set(0.5);
		this.gotoAndStop(0);
		this.interactive = true;
		this.scale.set(0.4);
		const score = ScoreFunctions.getOtherScore(this.powerUpID);
		if (score) {
			this.counter = score;
		} else {
			ScoreFunctions.addOtherScore(this.powerUpID, 0);
			this.counter = 0;
		}

		if (this.powerUpID != "potionBall") {
			this.potionCountDownGraphics = new HGraphic(HGraphicType.CIRCLE, 0x2c2c2c, { radius: 50 }, 1);
			this.potionCountDownGraphics.y = -150;

			this.potionCounterText = new TextLabel(0, -150, 0.5, this.n_powerUpCounter.toString(), 35, 0xffffff);
			this.potionCounterText.alpha = 1;
			this.addChild(this.potionCountDownGraphics, this.potionCounterText);

			this.cooldownID = this.powerUpID + "cd";
			const cooldown = ScoreFunctions.getOtherScore(this.cooldownID);
			// console.log(cooldown);

			if (cooldown) {
				if (cooldown > 1) {
					this.n_powerUpCounter = cooldown;
					this.potionCounterText.upadteLabelText(this.n_powerUpCounter);
				} else this.n_powerUpCounter = 45;
			} else {
				this.n_powerUpCounter = 45;
				ScoreFunctions.addOtherScore(this.cooldownID, this.n_powerUpCounter);
			}
		}

		Text;
		this.counterBG = new HGraphic(HGraphicType.CIRCLE, 0x2c2c2c, { radius: 40 }, 0.8);
		this.counterBG.y = 140;
		this.counterLabel = new TextLabel(0, 0, 0.5, this.counter.toString(), 34, 0xffffff);
		this.counterBG.addChild(this.counterLabel);
		this.addChild(this.counterBG);

		this.on("pointerover", () => {
			if (this.currentFrame != 1) this.gotoAndStop(1);
		});

		this.on("pointerout", () => {
			if (this.currentFrame != 0) this.gotoAndStop(0);
		});

		this.on("pointerdown", () => {

			this.usePowerUp();
		});

		if (this.counter > 0) this.defaultInteractivity = true;
		else this.disablePowerUp();



		// if (this.counter > 0 && this.n_powerUpCounter < 45 && this.powerUpID != "potionBall") {
		// 	this.setActiveCountdown(true);
		// }
	}

	addCounter(val: number = 1) {
		this.counter += val;

		this.counterLabel.upadteLabelText(this.counter.toString());
		if (!this.defaultInteractivity && this.counter > 0) {
			this.disablePowerUp(false);
		}

		if (ScoreFunctions.getOtherScore(this.powerUpID)) ScoreFunctions.setOtherScore(this.powerUpID, this.counter);
		else ScoreFunctions.addOtherScore(this.powerUpID, 1);

		Globals.emitter?.Call("AddedBall");
	}
	// resize()
	// { 
	// 	console.log(window.innerWidth);

	// 	// this.x = (window.innerWidth + (140 * config.minScaleFactor))/2;

	// 	this.scale.set(config.minScaleFactor*0.85);
	// }

	usePowerUp() {

		if (!this.isActive && this.counter > 0 && this.n_powerUpCounter == 45 && !this.canPress) {


			if (this.powerUpID == "potionBall") GameData.usedPotionBall++;
			if (this.powerUpID == "potionKick") GameData.usedPotionKick++;
			if (this.powerUpID == "potionScore") GameData.usedPotionScore++;
			if (this.powerUpID == "potionBisquit") GameData.usedPotionBisquit++;

			this.counterLabel.upadteLabelText(this.counter.toString());

			if (this.counter <= 0 && this.powerUpID != "potionBall") {
				this.disablePowerUp();
			}
			this.alpha = 0.5;

				this.canPress = true;

				if(this.powerUpID == "potionBall")
				  setTimeout(()=>{this.canPress = false;this.alpha = 1;},200);

			Globals.emitter?.Call(this.powerUpID, true);
			this.playUseEffect();

		}
	}

	playUseEffect() {
		new TWEEN.Tween(this.scale)
			.to({ x: 0.6, y: 0.6 }, 100)
			.onComplete(() => {
				Rewards[this.powerUpID]?.use();
			})
			.easing(Easing.Bounce.InOut)
			.repeat(1)
			.yoyo(true)
			.start();
	}

	powerupCountDown() {

		if (this.powerUpID != "potionBall") {
			if (this.cooldownID != null) {
				// console.log(this.powerUpID);
				this.isActive = true;
				this.setActiveCountdown(true);

				if (this.counter > 0 && this.n_powerUpCounter >= 45) {
					this.counter--;
					if (ScoreFunctions.getOtherScore(this.powerUpID)) ScoreFunctions.setOtherScore(this.powerUpID, this.counter);
					else ScoreFunctions.addOtherScore(this.powerUpID, this.counter);
				}
				this.potionCounterText.upadteLabelText(this.n_powerUpCounter);
				this.counterLabel.upadteLabelText(this.counter);
				Globals.emitter?.Call("StartedTween");
				let CountDown = this.n_powerUpCounter;
				this.potionCountDownGraphics.zIndex = 20;
				this.potionCounterText.zIndex = 21;

				this.potionTween = new Tween(this.potionCounterText.scale)
					.to({ x: 1, y: 1 }, 1000)
					.yoyo(true)
					.onComplete(() => {
						Globals.emitter?.Call(this.powerUpID, false);
						console.log("CALLED STOPPPP");

						if (ScoreFunctions.getOtherScore(this.powerUpID)) ScoreFunctions.setOtherScore(this.powerUpID, this.counter);
						else ScoreFunctions.addOtherScore(this.powerUpID, this.counter);

						this.potionTween.stop();

						this.n_powerUpCounter = 45;
						this.isActive = false;
						this.canPress = false;
						this.setActiveCountdown(false);
						// Globals.emitter?.Call("EndedTween");
						if (this.counter == 0)
							this.disablePowerUp(false);
					})
					.onRepeat(() => {
						this.n_powerUpCounter--;
						this.potionCounterText.upadteLabelText(this.n_powerUpCounter);
						ScoreFunctions.setOtherScore(this.cooldownID, this.n_powerUpCounter);
						if(this.counter == 0)
						{
							this.disablePowerUp(false);
							this.setActiveCountdown(false);
						}


					})

					.onStop(() => {
						Globals.emitter?.Call(this.powerUpID, false);
						this.counterBG.visible = true;
						this.isActive = false;
						if (this.n_powerUpCounter >= 1) {
							// this.addCounter(1);
							this.counterLabel.upadteLabelText(this.counter);
						}
					})
					.repeat(CountDown)
					.start();
			}
		}
		if (this.powerUpID == "potionBall" ) {
			console.log("CALLED BALL COUNTDOWN");
			this.isActive = true;
			setTimeout(()=>{this.isActive = false;},1000);
			this.counter--;
			this.counterLabel.upadteLabelText(this.counter);
			ScoreFunctions.setOtherScore(this.powerUpID, this.counter);
		}
	}
	setVisible(Visible: boolean) {
		if (Visible) {
			this.counterBG.visible = true;
		} else this.counterBG.visible = false;
	}

	disablePowerUp(val: boolean = true) {
		this.defaultInteractivity = !val;
		this.alpha = val ? 0.5 : 1;

		if (this.interactive) this.interactive = this.defaultInteractivity;
	}

	setX(x: number) {
		this.defaultX = x;
	}

	slideBack() {
		if (this.isSliding) return;

		this.interactive = false;
		this.gotoAndStop(0);

		this.isSliding = true;

		const tween = new Tween(this)
			.to({ x: 0 }, 750)
			.onComplete(() => {
				this.isSliding = false;
			})
			.easing(Easing.Bounce.Out)
			.start();

		if (!this.isActive)
			this.setActiveCountdown(false);

		if (this.counter == 0 || this.canPress) {
			this.disablePowerUp(false);
		}
	}

	slideOut() {
		if (this.isSliding) return;

		this.isSliding = true;
		if (this.counter >= 1 && this.n_powerUpCounter < 45) {
			this.setActiveCountdown(true);
		}
		const tween = new Tween(this)
			.to({ x: this.defaultX }, 750)
			.onComplete(() => {
				this.isSliding = false;
				this.interactive = this.defaultInteractivity;
			})
			.easing(Easing.Bounce.Out)
			.start();
	}
	setActiveCounter(Active: boolean) {
		if (Active) {
			this.counterBG.visible = true;
			this.disablePowerUp(false);
		}
		if (!Active) {
			this.counterBG.visible = false;
			this.disablePowerUp(true);
		}
	}
	setActiveCountdown(Active: boolean) {
		console.log("ACTIVB CONTDOWN  " + Active);

		if (Active && this.powerUpID != "potionBall") {
			this.potionCountDownGraphics.visible = true;
			this.potionCounterText.visible = true;
			this.disablePowerUp(true);
		}
		if (!Active && this.powerUpID != "potionBall" && !this.canPress) {
			this.potionCountDownGraphics.visible = false;
			this.potionCounterText.visible = false;
			this.disablePowerUp(false);
			this.potionCountDownGraphics.alpha = 2;
			this.potionCounterText.alpha = 2;
		}
		if (!Active && this.powerUpID != "potionBall" && this.canPress) {
			this.disablePowerUp(true);
			// this.potionCountDownGraphics.visible = false;
			// this.potionCounterText.visible = false;

		}
	}
}
