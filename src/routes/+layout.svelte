<script lang="ts">
	import Lightswitch from '$lib/components/Lightswitch.svelte';
	import '../app.css';
	import { SignIn } from '@auth/sveltekit/components';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher />

<nav class="rounded border border-border bg-card p-4">
	<div class="actions">
		<SignIn provider="discord">
			<div slot="submitButton" class="buttonPrimary">Sign in with Discord</div>
		</SignIn>
	</div>

	<Lightswitch />
</nav>

{@render children()}
