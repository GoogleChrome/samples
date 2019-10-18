<!--
Copyright 2019 Google, Inc.

Licensed under the [Apache License, Version 2.0](LICENSE) (the "License");
you may not use this file except in compliance with the License. You may
obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->
<script>
  import NavbarButton from './NavbarButton.svelte';

  export let buttons = [];
</script>

<style>
  div {
    align-items: center;
    background-color: var(--secondary-color);
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }
</style>

<div>
  {#each buttons as button}
    <NavbarButton {...button}/>
  {/each}
</div>
