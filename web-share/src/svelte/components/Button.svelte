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
  export let handleClick;
</script>

<style>
  button {
    background-color: transparent;
    border-radius: 4px;
    border: 1px solid var(--secondary-color);
    color: var(--text-color);
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    height: 36px;
    letter-spacing: 1.25px;
    min-width: 64px;
    padding: 0 15px 0 15px;
    text-transform: uppercase;
  }

  button:active {
    filter: drop-shadow(1px 1px 7px var(--secondary-color));
  }
</style>

<button on:click={handleClick}>
  <slot></slot>
</button>
