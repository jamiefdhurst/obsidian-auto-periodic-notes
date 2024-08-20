<script lang="ts">
  import type { Writable } from 'svelte/store';
  import type { IPeriodicity, ISettings } from '..';
  import { capitalise } from '../../utils';

  export let settings: Writable<ISettings>;
  export let periodicity: IPeriodicity;
</script>
<div class="setting-item">
  <div class="setting-item-info">
    <div class="setting-item-name">Open and Pin New {capitalise(periodicity)} Notes</div>
    <div class="setting-item-description">
      Whether to automatically open the new note and pin it to your tabs.
    </div>
  </div>
  <div class="setting-item-control">
    <div
      class="checkbox-container"
      class:is-enabled={$settings[periodicity].openAndPin}
      on:click={() => {
        $settings[periodicity].openAndPin =
          !$settings[periodicity].openAndPin;
      }}
    />
  </div>
</div>
