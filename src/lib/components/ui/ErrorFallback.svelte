<script lang="ts">
    let { sectionName } = $props<{ sectionName: string }>();
</script>

<div class="error-fallback">
    <h3>Помилка завантаження секції "{sectionName}"</h3>
    <p>Спробуйте оновити сторінку або перевірте підключення до мережі.</p>
</div>

<style>
    .error-fallback {
        padding: 20px;
        background-color: var(--error-bg);
        color: var(--error-text);
        border-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
        border: 1px solid var(--error-border);
    }

    .error-fallback h3 {
        color: var(--error-text);
        margin-bottom: 10px;
    }
</style>
