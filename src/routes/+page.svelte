<script lang="ts">
	import Paper from '$lib/paper.svelte';
</script>

<section>
	<article class="demo">
		<h1>THnaks for coming t o my project</h1>
		<p>btw sometimes this needs a full browser restart</p>
	</article>
	<Paper />
</section>

<style>
	:global(html, body) {
		background: linear-gradient(180deg, #fff 0%, #efefef 100%);
		font-family: Arial, Helvetica, sans-serif;
		min-height: 100vh;
		margin: 0;
	}
	.demo {
	}
	.demo h1 {
		font-size: 2rem;
	}
	section {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		width: 100%;
	}
	article {
		padding: 0.1rem 0.1rem;
	}
</style>
