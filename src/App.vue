<template>
	<div id="app">
		<Menu></Menu>
		<transition name="slide" mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
import Menu from './components/Navbar'
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
@font-face {
	font-family: Panton;
	src: url('./style/PantonDemo-LightItalic.woff') format('woff');
}
@font-face {
	font-family: PantonDark;
	src: url('./style/PantonDemo-BlackItalic.woff') format('woff');
}
#app {
	font-family: 'Panton', Helvetica, Arial, sans-serif !important;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
button {
	font-family: PantonDark !important;
}
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
	background-color: white;
}
.el-icon-loading {
	color: white !important;
}
.el-loading-spinner .el-loading-text {
	font-family: Panton !important;
	color: white !important;
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    user-select: text !important;
}
.el-button {
	background-color: #24305e;
	border-color: #24305e;
}
.el-button:hover {
	background-color: #a8d0e6;
	border-color: #a8d0e6;
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
.slide-leave-active {
	transition: opacity 0.5s ease;
	opacity: 0;
	animation: slide-out 0.5s ease-out forwards;
}
.slide-leave {
	opacity: 1;
	transform: translateX(0);
}
.slide-enter-active {
	animation: slide-in 0.5s ease-out forwards;
}
@keyframes slide-out {
	0% {
		transform: translateY(0);
	}
	100% {
		transform: translateY(-30px);
	}
}
@keyframes slide-out {
	0% {
		transform: translateY(-30);
	}
	100% {
		transform: translateY(0px);
	}
}
</style>
