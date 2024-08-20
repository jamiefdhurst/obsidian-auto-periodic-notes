<script lang="ts">
  import { onDestroy } from 'svelte';
  import { writable, type Writable } from 'svelte/store';
  import { slide } from 'svelte/transition';
  import OpenAndPinSetting from '../components/OpenAndPinSetting.svelte';
  import PeriodicNotesUnavailableBanner from '../components/PeriodicNotesUnavailableBanner.svelte';
  import type { IPeriodicity, ISettings } from '../index';
  import { capitalise } from '../../utils';

  export let settings: ISettings;
  export let onUpdateSettings: (newSettings: ISettings) => void;

  let settingsStore: Writable<ISettings> = writable(settings);

  const unsubscribeFromSettings = settingsStore.subscribe(onUpdateSettings);

  const periodicities: IPeriodicity[] = [
    'daily',
    'weekly',
    'monthly',
    'quarterly',
    'yearly',
  ];

  onDestroy(() => {
    unsubscribeFromSettings();
  });
</script>
{#if !$settingsStore['daily'].available && !$settingsStore['weekly'].available && !$settingsStore['monthly'].available && !$settingsStore['quarterly'].available && !$settingsStore['yearly'].available}
  <PeriodicNotesUnavailableBanner />
{/if}
{#each periodicities as periodicity}
  {#if $settingsStore[periodicity].available}
    <div class="setting-item setting-item-heading">
      <div class="setting-item-info">
        <div class="setting-item-name">
          <h3>
            Automatic {capitalise(periodicity)} Notes
          </h3>
        </div>
      </div>
      <div class="setting-item-control">
        <div
          class="checkbox-container"
          class:is-enabled={$settingsStore[periodicity].enabled}
          on:click={() => {
            $settingsStore[periodicity].enabled =
              !$settingsStore[periodicity].enabled;
          }}
        />
      </div>
    </div>
    {#if $settingsStore[periodicity].enabled}
      <div in:slide out:slide>
        <OpenAndPinSetting {periodicity} settings={settingsStore} />
      </div>
    {/if}
  {/if}
{/each}
