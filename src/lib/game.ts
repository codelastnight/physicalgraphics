import Phaser from 'phaser';
const scale = 2;
const canvasHeight = 1000 * scale;
const fontSize = 32 * scale;

export const settings = {
	height: canvasHeight,
	width: canvasHeight * 1.3
};

export class MyGame extends Phaser.Scene {
	private textData: Phaser.GameObjects.Text[] = [];
	private player1: Phaser.GameObjects.Image | undefined;
	private plugin;
	private debugtext;
	private didclick = false;
	constructor() {
		super();
	}

	preload() {
		//  This is an example of loading a static image from the public folder:
		this.load.image('cursor1', '/assets/cursor1.png');
		this.load.image('guy01', '/assets/guy01.png');
		this.load.image('guy03', '/assets/guy04.png');

		this.load.image('guy04', '/assets/guy02.png');
	}

	create() {
		this.matter.world.setBounds();

		const canDrag = this.matter.world.nextGroup();
		const text = 'Pick up the wiimote';

		const textObjectData = generateText(
			this,
			{
				x: 100,
				y: 400,
				text: text,
				collisionGroup: canDrag
			},
			{
				fontSize: fontSize * 1.2 * 1.2 * 1.2 * 1.2 * 1.2 * 1.2,
				fontFamily: 'Arial Narrow ',
				fontStyle: 'bold',
				fill: '#000'
			}
		);
		this.textData = [...this.textData, ...textObjectData];
		const textObjectData2 = generateText(
			this,
			{
				x: 100,
				y: 800,
				text: 'Try to move around and such. ',
				collisionGroup: canDrag
			},
			{
				fontSize: fontSize * 1.2 * 1.2 * 1.2,
				fontFamily: 'Arial Narrow ',
				fontStyle: 'bold',
				fill: '#000'
			}
		);
		this.textData = [...this.textData, ...textObjectData2];
		const textObjectData3 = generateText(
			this,
			{
				x: 100,
				y: 1200,
				text: 'This was originally meant to be for like 2 wiimotes but we only had one working one :( also the software doesnt support it anyways so like this is waht i got. enjoy!',
				collisionGroup: canDrag
			},
			{
				fontSize: fontSize * 1.2 * 1.2,
				fontFamily: 'Arial Narrow ',
				fontStyle: 'bold',
				fill: '#000'
			}
		);
		this.textData = [...this.textData, ...textObjectData3];
		const textObjectData4 = generateText(
			this,
			{
				x: 100,
				y: 1700,
				text: 'The gyro deosnt work, so im detecting acceleration. move your hands in big motions',
				collisionGroup: canDrag
			},
			{
				fontSize: fontSize,
				fontFamily: 'Arial Narrow ',
				fontStyle: 'bold',
				fill: '#000'
			}
		);
		this.textData = [...this.textData, ...textObjectData4];

		this.debugtext = this.add.text(settings.width / 2, 1800, 'Press the Home button to reset', {
			fontSize: fontSize * 1.2,
			fontFamily: 'Arial Narrow ',
			fontStyle: 'bold',
			fill: '#ff0000'
		});

		this.player1 = this.matter.add
			.image(settings.width / 2, settings.height / 2, 'cursor1', null, { chamfer: 16 })
			.setBounce(0.9)
			.setCollisionGroup(canDrag);
		this.matter.add
			.image(800, 600, 'guy01', undefined, { chamfer: 16 })
			.setBounce(0.9)
			.setCollisionGroup(canDrag);

		const noDrag = this.matter.world.nextGroup();
		this.matter.add
			.image(140, 1500, 'guy03', null, { chamfer: 16 })
			.setBounce(0.9)
			.setCollisionGroup(canDrag);

		this.matter.add
			.image(400, 800, 'guy04', null, { chamfer: 16 })
			.setBounce(0.9)
			.setCollisionGroup(canDrag);

		this.matter.add.mouseSpring({ length: 1, stiffness: 0.6, collisionFilter: { group: canDrag } });
	}

	update() {
		if (this.textData && this.textData.length > 0) {
			this.textData.forEach((element) => {
				element.rotation = 0;
			});
		}

		const plugin = this.plugins.get('Movement');
		const data = plugin?.getPlayer1();
		if (data) {
			if (data.buttonHome && !this.didclick) {
				window.location.reload();
				this.didclick = true;
			} else if (!data.buttonHome && this.didclick) {
				this.didclick = false;
			}
		}
		if (this.player1) {
			this.player1?.setScale(1 + 2 * data.pitch, 1 + 2 * data.roll);
			this.player1?.setRotation(this.player1?.rotation + data.roll);

			if (75 * data.x < 400 || 75 * data.x < 400) {
				this.player1?.setX(this.player1.x + 75 * data.x);
				this.player1?.setY(this.player1.y + 75 * data.y);
			}

			if (
				this.player1.x < 0 ||
				this.player1.x > settings.width ||
				this.player1.y < 0 ||
				this.player1.y > settings.height
			) {
				this.player1?.setX(settings.width / 2);
				this.player1?.setY(settings.height / 2);
			}
		}
	}
}

const defaultTextStyle = {
	fontSize: fontSize,
	fontFamily: 'Arial Narrow',
	fill: '#000'
};
const defaultTextOptions = {
	x: 100,
	y: 100,
	text: 'this is a pen',
	collisionGroup: 0
};
function generateText(scene: Phaser.Scene, options = defaultTextOptions, style = defaultTextStyle) {
	let textObjectData = [];
	let nextPosition = 0;
	let newLinePosition = 0;
	const array = options.text.split(' ');
	for (let i = 0; i < array.length; i++) {
		if (nextPosition > settings.width - 400 * scale) {
			newLinePosition += fontSize * 1.4;
			nextPosition = 0;
		}
		const text2 = scene.add.text(
			options.x + nextPosition,
			options.y + newLinePosition,
			array[i],
			style
		);
		text2.setX(text2.x + text2.width / 2);
		const textPhysics: Phaser.GameObjects.Text = scene.matter.add
			.gameObject(text2)
			.setFrictionAir(0.01)
			.setBounce(0.8)
			.setCollisionGroup(options.collisionGroup);
		nextPosition += fontSize / 4 + text2.width;
		textObjectData.push(textPhysics);
	}

	return textObjectData;
}
