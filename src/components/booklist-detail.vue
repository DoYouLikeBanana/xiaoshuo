<template>
  <div class="booklist-item">
    <van-nav-bar
      title="书单详情"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="author" v-show="author.nickname">
      <div class="author-top">
        <img :src="img + author.avatar" alt="" />
        <div class="top-right">
          <div class="name">{{ author.nickname }}</div>
          <div class="lastTime">
            {{ upDate &lt;= 0 ? "刚刚更新" : `${upDate}小时前更新` }}
          </div>
        </div>
      </div>
      <div class="author-des">
        <h1>{{ title }}</h1>
        <div class="desc">{{ desc }}</div>
      </div>
    </div>
    <div class="item" v-show="booklist.length > 0">
      <ul>
        <li
          @click="goBooks(item.book._id)"
          v-for="(item, index) in booklist"
          :key="index"
        >
          <div class="book-info">
            <div class="img">
              <img :src="imgEscpe(item.book.cover)" alt="" />
            </div>
            <div class="book-right">
              <h1>{{ item.book.title }}</h1>
              <div class="book-data">
                <span>{{ item.book.author }}</span> |
                <span>{{ item.book.cat }}</span> |
                <span class="c-rq">{{
                  latelyFollower(item.book.latelyFollower)
                }}</span
                >万人气
              </div>
            </div>
          </div>
          <div class="book-comment">{{ item.comment }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { bookListsInfo } from "../api/api";
export default {
  name: "booklist-detail",
  data() {
    return {
      booklist: [],
      title: "",
      desc: "",
      author: {},
      img: "http://statics.zhuishushenqi.com",
      upDate: "",
    };
  },
  created() {
    this.getBooksList(this.$router.params.id);
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },

    latelyFollower(lately) {
      return (lately / 10000).toFixed(1);
    },
    imgEscpe(url) {
      return unescape(url.replace("/agent/", ""));
    },
    goBooks(id) {
      this.$router.push({
        path: `/book/${id}`,
      });
    },
    getBooksList(id) {
      bookListsInfo(id).then((res) => {
        this.upDate = this._time(res.data.bookList.updated);
        this.author = res.data.bookList.author;
        this.desc = res.data.bookList.desc;
        this.title = res.data.bookList.title;
        this.booklist = res.data.bookList.books;
      });
    },
    _unEscape(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i].cover = unescape(arr[i].cover);
        arr[i].cover = arr[i].cover.replace("/agent/", "");
      }
      return arr;
    },
    _time(time) {
      let currentTime = Math.round(new Date() / 1000);
      this.upDate = time.replace("T", " ").replace("Z", " ");
      this.upDate = Date.parse(new Date(this.upDate)) / 1000;
      return Math.floor(((currentTime - this.upDate) % 86400) / 3600);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>