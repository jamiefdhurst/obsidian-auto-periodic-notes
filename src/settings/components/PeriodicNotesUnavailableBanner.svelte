<script lang="ts">
  import { slide } from 'svelte/transition';
</script>
<div out:slide class="settings-banner">
  <h3>No Periodic Notes Enabled</h3>

  <div class="setting-item">
    <div class="setting-item-info">
      <p class="setting-item-description">
        No periodic notes settings are enabled. You must turn on one of daily,
        weekly, monthly, quarterly or yearly notes within the Periodic Notes
        plugin settings to be able to configure them to generate automatically.
      </p>
    </div>
  </div>
</div>
