<template>
	<div id="app">
		<Menu></Menu>
		<router-view></router-view>
	</div>
</template>

<script>
import Menu from './components/Menu'
export default {
	name: 'app',
	components: {
		Menu,
	},
	data() {
		return {
			msg: 'Welcome to Your Vue.js App',
		}
	},
}
</script>

<style>
#app {
	font-family: 'Optima', Helvetica, Arial, sans-serif !important;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0; /* 2 */
}
.el-menu {
    background-color: #24305E;
}
.el-button {
    background-color: #24305E;
    border-color: #24305E;
}
.el-button:hover {
    background-color: #A8D0E6;
    border-color: #A8D0E6;
}
h1,
h2 {
	font-weight: normal;
}

ul {
	list-style-type: none;
	padding: 0;
}

li {
	display: inline-block;
	margin: 0 10px;
}

a {
	color: #42b983;
}
</style>
