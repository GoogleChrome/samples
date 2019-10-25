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
  import {link} from 'svelte-spa-router';
  import active from 'svelte-spa-router/active';

  export let href = '';
  export let svg = '';
  export let text = '';
  export let title ='';
</script>

<style>
  :global(a.active) {
    filter: inherit !important;
  }

  a {
    align-items: center;
    color: var(--background-color);
    display: flex;
    fill: var(--background-color);
    filter: brightness(0.6);
    flex-direction: column;
    font-size: 12px;
    justify-content: center;
    padding: 12px;
    text-decoration: none;
  }
</style>

<a {href} {title} use:link use:active>
  <span class="svg">{@html svg}</span>
  <span>{text}</span>
</a>
