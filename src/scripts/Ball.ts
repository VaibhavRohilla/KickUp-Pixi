import { Body, Circle, FrictionEquation, OverlapKeeper, Material, ContactMaterial } from "p2";
import { CircleEntity } from "././Entity";
import { Globals } from "./Globals";
import * as PIXI from "pixi.js";
import { Container, Graphics, Point, Sprite } from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";
import { config } from "./appConfig";

export class Ball extends Container {
	container!: PIXI.Container;
	Ball!: CircleEntity;
	ballShadow!: Sprite;
	ballFire!: Sprite;
	enableFire: boolean = false;

	constructor(ballNo: number, posX: number, posY: number, mats: Material[]) {
		super();

		this.container = new PIXI.Container();

		//FIREE//
		this.ballFire = new PIXI.Sprite(Globals.resources.Ball_Fire.texture);
		this.ballFire.scale.set(0);
		this.ballFire.pivot.x = 145;
		this.ballFire.pivot.y = 295;
		this.ballFire.visible = false;
		this.container.addChild(this.ballFire);

		this.ballShadow = new PIXI.Sprite(Globals.resources["BallShadow"].texture);
		this.ballShadow.anchor.set(0.5);
		this.ballShadow.y = 1675;
		const id = 1;
		this.Ball = new CircleEntity(
			Globals.resources[`Ball${ballNo}`].texture,
			{
				type: Body.DYNAMIC,
				mass: 10,
				position: [posX, posY],
				gravityScale: 0.9,
				collisionResponse: true,
			},
			new Circle({
				radius: 110,
			}),
			id,
			this
		);
		this.Ball.pivot.set(0.5);
		// this.Ball.body.inertia = 5000;
		this.Ball.body.allowSleep = false;
		// this.Ball.body.sleepSpeedLimit = 1;  // Body will feel sleepy if speed<1 (speed is the norm of velocity)
		// this.Ball.body.sleepTimeLimit = 1;

		this.container.addChild(this.ballShadow, this.Ball);

		//BALL AND MOUSE
		Globals.App?.world.addContactMaterial(
			new ContactMaterial(this.GetMaterial(), mats[0], {
				friction: 0,
				restitution: 0.9,
			})
		);

		//SIDE LINES  R
		Globals.App?.world.addContactMaterial(
			new ContactMaterial(this.GetMaterial(), mats[1], {
				restitution: 0.9,
				friction: 0,
			})
		);

		//SIDE LINES  L
		Globals.App?.world.addContactMaterial(
			new ContactMaterial(this.GetMaterial(), mats[2], {
				restitution: 0.9,
				friction: 0,
			})
		);

		// THE UPPER COLLIDER
		Globals.App?.world.addContactMaterial(
			new ContactMaterial(this.GetMaterial(), mats[3], {
				restitution: 0.1,
				friction: 0,
			})
		);
	}

	GetMaterial(): Material {
		return this.Ball.shape.material;
	}
	startVelocity(): void {
		this.Ball.body.velocity = [0, -1400];
	}
	update(dt: number): void {
		this.ballShadow.position.x = this.Ball.position.x;
		this.ballShadow.scale.x = 1.2 * (this.Ball.y / 1200);
		this.ballShadow.scale.y = 1.2 * (this.Ball.y / 1200);
		this.ballShadow.alpha = this.Ball.y / 790;

		if (this.Ball.body.velocity[1] < -1600) {
			this.Ball.body.velocity[1] = -1600;
		}
		if (this.Ball.body.velocity[1] > 1400) {
			this.Ball.body.velocity[1] = 1400;
		}
		if (this.Ball.body.velocity[0] < -1000) {
			this.Ball.body.velocity[0] = -1000;
		}
		if (this.Ball.body.velocity[0] > 1000) {
			this.Ball.body.velocity[0] = 1000;
		}

		// if (
		// 	this.Ball.body.velocity[1] > 10 ||
		// 	this.Ball.body.velocity[0] > 20 ||
		// 	this.Ball.body.velocity[1] < -100 ||
		// 	this.Ball.body.velocity[0] < -200
		// ) {
		// 	if (this.Ball.body.velocity[0] > 1 || (this.Ball.body.velocity[0] < -1 && this.Ball.body.velocity[0] > 1) || this.Ball.body.velocity[0] < -1) {
		// 	}
		// }

		this.Ball.rotation = this.Ball.body.angle* -5 * 1000;
		this.Ball.rotation = this.Ball.angle;
		this.Ball.syncMovement();

		if (this.enableFire) {
			this.ballFire.rotation = this.Ball.rotation;
			this.ballFire.position.x = this.Ball.position.x;
			this.ballFire.position.y = this.Ball.position.y;
		}
	}

	changePos(point: { x: number; y: number }) {
		this.Ball.changePosition(point.x, point.y);
	}

	CircleEffectStart() {
		const CircleGraphic = new Graphics();

		CircleGraphic.beginFill(0xffffff, 1);
		CircleGraphic.drawCircle(0, 0, 50);
		CircleGraphic.endFill();
		this.container.addChild(CircleGraphic);
		CircleGraphic.zIndex = 0;
		CircleGraphic.x = this.Ball.x;
		CircleGraphic.y = this.Ball.y - 50;

		new TWEEN.Tween(CircleGraphic.scale).to({ x: 12, y: 12 }, 300).easing(TWEEN.Easing.Linear.None).start();

		new TWEEN.Tween(CircleGraphic)
			.to({ alpha: 0 }, 300)
			.easing(TWEEN.Easing.Linear.None)
			.onComplete(() => {
				CircleGraphic.destroy();
			})
			.start();
	}

	CircleEffectEnd() {
		const CircleGraphic = new Graphics();

		CircleGraphic.beginFill(0xffffff, 1);
		CircleGraphic.drawCircle(0, 0, 50);
		CircleGraphic.endFill();
		this.container.addChild(CircleGraphic);
		CircleGraphic.zIndex = 10;
		CircleGraphic.x = this.Ball.x;
		CircleGraphic.y = this.Ball.y - 50;

		new TWEEN.Tween(CircleGraphic.scale).to({ x: 12, y: 12 }, 300).easing(TWEEN.Easing.Linear.None).start();

		new TWEEN.Tween(CircleGraphic)
			.to({ alpha: 0 }, 300)
			.easing(TWEEN.Easing.Linear.None)
			.onComplete(() => {
				CircleGraphic.destroy();
				if (this)
					this.changePos({ x: 550, y: 1561 });
			})
			.start();
	}
	addFire(Can: Boolean) {
		if (Can) {
			this.ballFire.visible = true;
			this.enableFire = true;
			new TWEEN.Tween(this.ballFire.scale)
				.to({ x: 0.9, y: 0.9 }, 500)
				.easing(TWEEN.Easing.Elastic.Out)
				.onComplete(() => { })
				.start();
		} else {
			this.ballFire.visible = false;
			this.ballFire.scale.set(0);
			this.enableFire = false;
		}
	}


	destroyBall() {
		this.Ball.destroyEntity();
		this.container.destroy();
	}
}
