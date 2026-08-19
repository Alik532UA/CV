<script lang="ts">
	import { onMount } from "svelte";
	import {
		BETA_TABS,
		BETA_UI,
		COVERAGE_ORDER,
		sortChecks,
		type Coverage
	} from "$lib/data/betaChecklist";
	import { betaChecklist, type Vote } from "$lib/controllers/BetaChecklistState.svelte";

	/**
	 * Сторінка ручної перевірки (BETA-CHECKLIST-v8).
	 *
	 * Адреса довга навмисно: `/beta-test/` читалося б як «пісочниця, де тестують
	 * якусь бета-механіку», `/beta-test-checklists/` не читається ніяк інакше
	 * (§ 4). Сторінки немає в меню, вона має `noindex` і не потрапляє в sitemap —
	 * але це не таємниця: статичний сайт із відкритого репозиторію її не тримає,
	 * і адресу дають посиланням тому, хто погодився допомогти.
	 *
	 * Жодного видимого рядка в цьому файлі: усі написи — у даних поруч із
	 * пунктами. Так виконуються обидва правила одразу — § 2.4 (тексти чеклиста
	 * не йдуть у 42 словники) і заборона кирилиці в `src/routes/**`.
	 */

	type Lang = "uk" | "en";

	let lang = $state<Lang>("uk");
	let activeTabId = $state(BETA_TABS[0].id);
	let copied = $state(false);

	const activeTab = $derived(BETA_TABS.find((t) => t.id === activeTabId) ?? BETA_TABS[0]);
	const ordered = $derived(sortChecks(activeTab.checks));

	const VOTES: readonly Vote[] = ["fail", "weird", "ok"];

	/** `theme_1` → `theme-1`: локатори лише kebab-case ASCII (TESTID § 1.2). */
	const slug = (id: string) => id.replace(/_/g, "-");

	onMount(() => betaChecklist.load());

	async function copyReport() {
		const text = betaChecklist.report(lang);
		// Запасний шлях обов'язковий (§ 6.2). Перша версія в джерелі канону лише
		// писала в лог: кнопка виглядала натиснутою, а звіту не було НІДЕ — уся
		// робота тестувальника зникала на останньому кроці.
		if (!navigator.clipboard?.writeText) {
			betaChecklist.reportFallback = text;
			return;
		}
		try {
			await navigator.clipboard.writeText(text);
			betaChecklist.reportFallback = "";
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			betaChecklist.reportFallback = text;
		}
	}
</script>

<svelte:head>
	<title>{BETA_UI.title.en} | Alik Zapolnov CV</title>
</svelte:head>

<section class="beta">
	<header>
		<h1>{BETA_UI.title[lang]}</h1>
		<p class="beta-sub">{BETA_UI.subtitle[lang]}</p>

		<div class="beta-toolbar" data-testid="beta-actions-toolbar">
			<span class="beta-progress" data-testid="beta-progress-value">
				{betaChecklist.done}/{betaChecklist.total}
			</span>
			<button
				type="button"
				onclick={() => (lang = lang === "uk" ? "en" : "uk")}
				data-testid="beta-lang-btn"
			>
				{lang === "uk" ? "EN" : "UK"}
			</button>
			<button type="button" onclick={copyReport} data-testid="beta-report-btn">
				{copied ? BETA_UI.copied[lang] : BETA_UI.copy[lang]}
			</button>
			<button
				type="button"
				class="danger"
				onclick={() => betaChecklist.clear()}
				data-testid="beta-clear-btn"
			>
				{BETA_UI.clear[lang]}
			</button>
		</div>

		{#if betaChecklist.reportFallback}
			<p class="beta-hint" data-testid="beta-report-hint">{BETA_UI.clipboardFailed[lang]}</p>
			<textarea
				class="beta-fallback"
				readonly
				value={betaChecklist.reportFallback}
				data-testid="beta-report-textarea"
			></textarea>
		{/if}
	</header>

	<nav class="beta-tabs" data-testid="beta-tabs-toolbar">
		{#each BETA_TABS as tab (tab.id)}
			<button
				type="button"
				class:active={tab.id === activeTabId}
				onclick={() => (activeTabId = tab.id)}
				data-testid="beta-tab-{tab.id}-btn"
			>
				{tab.title[lang]}
			</button>
		{/each}
	</nav>

	{#each COVERAGE_ORDER as level (level)}
		{@const checks = ordered.filter((c: { coverage: Coverage }) => c.coverage === level)}
		{#if checks.length > 0}
			<section class="beta-level" data-testid="beta-level-{level}-section">
				<h2>{BETA_UI.level[level].title[lang]}</h2>
				<p class="beta-level-hint">{BETA_UI.level[level].hint[lang]}</p>

				<ol class="beta-list">
					{#each checks as check (check.id)}
						{@const mark = betaChecklist.markOf(check.id)}
						<li
							class="beta-item"
							class:negative={check.negative}
							data-testid="beta-check-{slug(check.id)}-item"
						>
							<p class="beta-category" data-testid="beta-check-{slug(check.id)}-category-text">
								{check.category[lang]}
							</p>
							<p class="beta-text" data-testid="beta-check-{slug(check.id)}-text">
								{check.text[lang]}
							</p>

							<div class="beta-votes">
								{#each VOTES as vote (vote)}
									<button
										type="button"
										class="vote vote-{vote}"
										class:chosen={mark?.vote === vote}
										aria-pressed={mark?.vote === vote}
										onclick={() => betaChecklist.vote(check.id, vote)}
										data-testid="beta-vote-{slug(check.id)}-{vote}-btn"
									>
										{BETA_UI.vote[vote][lang]}
									</button>
								{/each}
							</div>

							{#if betaChecklist.isStale(check.id)}
								<p class="beta-stale" data-testid="beta-check-{slug(check.id)}-stale-hint">
									{BETA_UI.staleMark[lang]}
								</p>
							{/if}
						</li>
					{/each}
				</ol>
			</section>
		{/if}
	{/each}
</section>

<style>
	.beta {
		max-width: 900px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: clamp(16px, 3dvh, 32px);
	}

	h1 {
		font-size: clamp(1.4rem, 4dvh, 2rem);
		color: var(--text-primary);
		margin: 0;
	}

	.beta-sub,
	.beta-level-hint {
		color: var(--text-secondary);
		margin: 6px 0 0;
		font-size: 0.9rem;
	}

	.beta-toolbar,
	.beta-tabs,
	.beta-votes {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
	}

	.beta-toolbar {
		margin-top: 16px;
	}

	.beta-progress {
		font-weight: 700;
		font-size: 1.1rem;
		color: var(--accent-primary);
		margin-inline-end: 8px;
	}

	button {
		min-height: 44px;
		padding: 8px 14px;
		border-radius: 10px;
		border: 1px solid var(--border-color);
		background: var(--panel-bg);
		color: var(--text-primary);
		font-family: inherit;
		font-size: 0.9rem;
		cursor: pointer;
	}

	button:hover {
		border-color: var(--accent-primary);
	}

	.beta-tabs button.active {
		border-color: var(--accent-primary);
		color: var(--accent-primary);
		font-weight: 700;
	}

	button.danger:hover {
		border-color: var(--error-text);
		color: var(--error-text);
	}

	.beta-hint {
		color: var(--error-text);
		margin: 12px 0 6px;
		font-size: 0.9rem;
	}

	.beta-fallback {
		width: 100%;
		min-height: 180px;
		padding: 12px;
		border-radius: 10px;
		border: 1px solid var(--border-color);
		background: var(--panel-bg);
		color: var(--text-primary);
		font-family: monospace;
		font-size: 0.8rem;
	}

	.beta-level h2 {
		font-size: clamp(1.05rem, 2.6dvh, 1.3rem);
		color: var(--text-primary);
		margin: 0;
	}

	.beta-list {
		list-style: none;
		margin: 16px 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
		counter-reset: beta;
	}

	/* Номер малює сторінка з позиції; вписаний у текст, він розійшовся б із нею
	   на першій же вставці нового пункта (§ 2.2). */
	.beta-item {
		counter-increment: beta;
		position: relative;
		padding: 14px 16px 14px 46px;
		border: 1px solid var(--border-color);
		border-radius: 14px;
		background: var(--panel-bg);
	}

	.beta-item::before {
		content: counter(beta);
		position: absolute;
		inset-inline-start: 16px;
		top: 14px;
		color: var(--text-secondary);
		font-weight: 700;
	}

	/* Межа помітна не лише кольором: рамка товща і штрихова (ACCESSIBILITY § 6). */
	.beta-item.negative {
		border-width: 2px;
		border-style: dashed;
	}

	.beta-category {
		margin: 0 0 4px;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-secondary);
	}

	.beta-text {
		margin: 0 0 12px;
		color: var(--text-primary);
		line-height: 1.5;
	}

	/* Стан позначено рамкою й насиченістю, а не самим лише кольором. */
	.vote.chosen {
		border-width: 2px;
		font-weight: 700;
	}

	.vote-fail.chosen {
		border-color: var(--error-text);
		color: var(--error-text);
	}

	.vote-weird.chosen {
		border-color: var(--score-low);
		color: var(--score-low);
	}

	.vote-ok.chosen {
		border-color: var(--score-high);
		color: var(--score-high);
	}

	.beta-stale {
		margin: 10px 0 0;
		font-size: 0.8rem;
		color: var(--score-low);
	}
</style>
