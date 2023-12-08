<script lang="ts">
	import { onMount } from 'svelte';
	import { MyGame, settings } from './game';

	let player1 = {
		x: 0,
		y: 0,
		pitch: 0,
		roll: 0,
		buttonA: 0,
		buttonHome: 0
	};
	class Movement extends Phaser.Plugins.BasePlugin {
		constructor(pluginManager) {
			super(pluginManager);
			//initialize player state
		}
		//Additional methods for getting managing player data
		getPlayer1() {
			return player1;
		}
	}

	const config = {
		type: Phaser.AUTO,
		parent: 'phaser-div',
		width: settings.width,
		zoom: 0.5,
		height: settings.height,
		backgroundColor: '#fff',
		pixelArt: true,
		physics: {
			default: 'matter',
			matter: {
				gravity: {
					y: 0
				},
				enableSleep: true,
				debug: false
			}
		},
		scene: MyGame,
		plugins: {
			global: [
				//make the Player global to all scenes (and other plugins)
				// key is plugin key, plugin is class, start true/false if there
				// is a start method to run, mapping is the name tagged of this
				// to access the plugin class
				{ key: 'Movement', plugin: Movement, start: false, mapping: 'movement' }
			]
		}
	};
	let game: Phaser.Game;
	let connected = 'disconnected';
	let debug = null;
	onMount(() => {
		game = new Phaser.Game(config);
	});
	function onRestart() {
		window.location.reload();
	}
	const url = 'ws:localhost:8080';
	const webSocket = new WebSocket(url);
	webSocket.onopen = (event) => {
		connected = 'connected';
	};
	webSocket.onclose = (event) => {
		connected = 'disconnect';
	};
	webSocket.onerror = (event) => {
		connected = 'websocket error!';
	};

	webSocket.onmessage = (event) => {
		if (event.data.includes('accelX')) {
			player1.x = +event.data.split(' ')[1];
		} else if (event.data.includes('accelY')) {
			player1.y = +event.data.split(' ')[1];
		} else if (event.data.includes('pitch')) {
			player1.pitch = +event.data.split(' ')[1];
		} else if (event.data.includes('roll')) {
			player1.roll = +event.data.split(' ')[1];
		} else if (event.data.includes('buttonA')) {
			player1.buttonA = +event.data.split(' ')[1];
		} else if (event.data.includes('buttonHome')) {
			player1.buttonHome = +event.data.split(' ')[1];
			debug = player1.buttonHome;
		} else {
			return;
		}
		player1 = player1;
	};
</script>

<div id="phaser-div"></div>
<div>
	<div>
		<button on:click={onRestart}>RESTART FOR ME PLEASSEE {'<3'} ( for nick)</button>
		<p style="font-size: 2rem; font-style:bold">press this button above if the thing brakes</p>
		<p>debugification</p>

		{#if player1}
			<p>
				{debug}
			</p>
		{/if}
		<p class={connected === 'connected' ? 'green' : 'red'}>
			{connected}
		</p>
	</div>
</div>

<style>
	:global(canvas) {
		letter-spacing: -20px;
	}
	.green {
		background: lightblue;
	}
	.red {
		background: rgb(240, 79, 79);
	}
	#phaser-div {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	button {
		padding: 1rem 2rem;
		background-color: yellow;
		margin-top: 4rem;
	}
</style>
