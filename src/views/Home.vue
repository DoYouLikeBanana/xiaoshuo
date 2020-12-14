<template>
  <div>
    <div class="home">
      <!-- 轮播图 -->
      <div class="banner-box">
        <van-swipe :autoplay="3000" loop>
          <van-swipe-item v-for="(item, index) in bannerData" :key="index">
            <img :src="item" alt="banner" class="banner-item" />
          </van-swipe-item>
        </van-swipe>
      </div>
      <!-- 搜索栏 -->
      <div class="search">
        <van-search
          v-model="search"
          :placeholder="placeholder"
          @search="goSearch()"
        />
      </div>
      <!-- 小说列表 -->
      <div class="books" v-show="maleList.length">
        <h4 class="title">
          男生最爱
          <i class="tip"></i>
        </h4>
        <div class="book-list">
          <book-list
            v-for="book in maleList"
            :book="book"
            :key="book._id"
            :home="home"
            >{{ book }}</book-list
          >
        </div>
        <div class="see-more" @click="goMaleList" v-show="maleList.length">
          查看更多>
        </div>
      </div>

      <div class="books" v-show="femaleList.length">
        <h4 class="title">
          女生最爱
          <i class="tip"></i>
        </h4>
        <div class="book-list">
          <book-list
            v-for="book in femaleList"
            :book="book"
            :key="book._id"
            :home="home"
          ></book-list>
        </div>
        <div class="see-more" @click="goMaleList">查看更多></div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import "../assets/scss/home.scss";
import BookList from "../components/book-list.vue";
import { rank } from "../api/api";
import { mapMutations } from "vuex";
export default {
  name: "Home",
  data() {
    return {
      //轮播数据
      bannerData: [
        "http://statics.zhuishushenqi.com/recommendPage/15313940968984",
        "http://statics.zhuishushenqi.com/recommendPage/153139416791777",
        "http://statics.zhuishushenqi.com/recommendPage/153139401503529",
        "http://statics.zhuishushenqi.com/recommendPage/153139406636473",
      ],
      maleList: [],
      femaleList: [],
      search: "",
      placeholder: "圣墟",
      home: true,
    };
  },

  created() {
    this.getBookBill();
  },

  methods: {
    getBookBill() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      rank("54d42d92321052167dfb75e3")
        .then((res) => {
          this.$toast.clear();

          if (res.data.ok) {
            this.maleList = this._unEscape(
              this.normalizeBooks(res.data.ranking.books.slice(0, 5))
            );
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });

      rank("54d43437d47d13ff21cad58b")
        .then((res) => {
          this.$toast.clear();

          if (res.data.ok) {
            this.femaleList = this._unEscape(
              this.normalizeBooks(res.data.ranking.books.slice(0, 5))
            );
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    _unEscape(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i].cover = unescape(arr[i].cover);
        arr[i].cover = arr[i].cover.replace("/agent/", "");
      }
      return arr;
    },

    goMaleList() {
      this.$router.push({
        path: "rank",
      });
    },
    //搜索栏
    goSearch() {
      if (!this.search) {
        this.$router.push({
          path: "/search",
          query: {
            val: this.placeholder,
          },
        });
        this.setSearch(this.placeholder);
      } else {
        this.$router.push({
          path: "/search",
          query: {
            val: this.search,
          },
        });
        this.setSearch(this.search);
      }
    },
    ...mapMutations({
      setSearch: "SET_SEARCH",
    }),
  },
  components: {
    BookList,
  },
};
</script>

<style lang="scss" scoped>
</style>