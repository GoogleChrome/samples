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
	export let active = false;
	export let href = '';
	export let src = '';
	export let text = '';
	export let title ='';
</script>

<style>
	.active {
		filter: invert(9%) sepia(100%) saturate(7131%) hue-rotate(250deg) brightness(81%) contrast(138%);
	}

	a {
		align-items: center;
		color: black;
		display: flex;
		filter: invert(66%) sepia(1%) saturate(0%) hue-rotate(6deg) brightness(91%) contrast(96%);;
		flex-direction: column;
		font-size: 12px;
		justify-content: center;
		padding: 12px;
		text-decoration: none;
	}
</style>

<a {href} {title} class:active="{active}">
	<img {src} alt='icon'>
	<span>{text}</span>
</a>
