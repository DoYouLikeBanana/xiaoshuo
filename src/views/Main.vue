<template>
  <div class="main">
    <van-nav-bar title="风云小说" left-arrow:false />
    <div>
      <router-view></router-view>
    </div>

    <van-tabbar v-model="activeName" route active-color="tomato">
      <van-tabbar-item
        :icon="item.icon"
        v-for="(item, index) in tabbarData"
        :key="index"
        replace
        :name="item.name"
        :to="item.path"
        >{{ item.title }}

        <!-- 具有插槽作用域的插槽 -->
        <template #icon="props">
          <img :src="props.active ? item.activeImg : item.inactiveImg" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import BookListsVue from "./BookLists.vue";
export default {
  name: "Main",
  data() {
    return {
      activeName: "Home",
      tabbarData: [
        {
          title: "首页",
          icon: "home-o",
          name: "Home",
          path: "/main/home",

          inactiveImg: require("../assets/images/home.png"),
          activeImg: require("../assets/images/home-active.png"),
        },
        {
          title: "分类",
          icon: "search",
          name: "Categories",
          path: "/main/categories",
          inactiveImg: require("../assets/images/fl.png"),
          activeImg: require("../assets/images/fl-active.png"),
        },
        {
          title: "排行榜",
          icon: "friends-o",
          name: "Rank",
          path: "/main/rank",
          inactiveImg: require("../assets/images/ph.png"),
          activeImg: require("../assets/images/ph-active.png"),
        },
        {
          title: "书架",
          icon: "setting-o",
          name: "BookLists",
          path: "/main/bookLists",
          inactiveImg: require("../assets/images/sj.png"),
          activeImg: require("../assets/images/sj-active.png"),
        },
      ],
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
/deep/ .van-nav-bar__title {
  color: tomato;
  font-size: 20px;
  font-weight: bold;
  background-color: #fff;
}
</style>