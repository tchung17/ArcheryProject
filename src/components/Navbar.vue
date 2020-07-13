<template>
	<div>
		<el-menu
			class="el-menu-demo"
			mode="horizontal"
			@select="handleSelect"
		>
			<div class="all" style="display: flex; justify-content: space-between">
				<div class="left" style="margin-left: 20px;">
					<el-menu-item style="color: #24305E; font-family: PantonDark" index="1">Home</el-menu-item>
					<!-- <el-menu-item style="color: #24305E;" index="2">Leaderboards</el-menu-item>
					<el-menu-item style="color: #24305E;" index="3">Info</el-menu-item> -->
				</div>
				<div class="right" style="margin-right: 20px;">
					<el-menu-item style="color: #24305E;" index="4">Profile</el-menu-item>
				</div>
			</div>
		</el-menu>
	</div>
</template>

<script>
export default {
    name: 'Menu',
    methods: {
        handleSelect(index) {
            if (index == 1) {
                this.$router.push({ name: 'PlayFriend'}) //for now
                return
            }
            if (index == 2) {
                //TODO
            }
            if (index == 3) {

            }
            if (index == 4) {

            }
        }
    },
}
</script>

<style scoped></style>