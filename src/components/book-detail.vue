<template>
  <div>
    <div class="books-detail">
      <van-nav-bar
        left-text="返回"
        title="书单详情"
        left-arrow
        @click-left="onClickLeft"
      />

      <div class="book-detail" v-show="book.title">
        <div class="cover">
          <img :src="_unEscape(book.cover)" alt="" />
        </div>
        <div class="desc">
          <h1>{{ book.title || "FengYun" }}</h1>
          <p class="info">
            <span>{{ book.author || "FengYun" }}</span> |
            <span>{{ book.minorCate || 0 }}</span> |
            <span>{{ latelyCount(book.wordCount || 0) }}</span>
          </p>
          <p class="update">
            {{ upDate > 1 ? upDate + "小时前" : upDate * 60 + "分钟前" }}更新
          </p>
          <p>{{ book.lastChapter }}</p>
        </div>
      </div>

      <div class="read-link" v-show="book.title">
        <div class="sj" @click="setBookLocalStorage()">
          {{ flag ? "不追了" : "追更新" }}
        </div>
        <div class="read" @click="goReadBooks(), setUserLocalStorage()">
          开始阅读
        </div>
      </div>
      <div class="reader-data">
        <p class="item">
          <span class="key">追人气</span>
          <span>{{ latelyFollower(book.latelyFollower) || 0 }}万</span>
        </p>
        <p class="item">
          <span class="key">读者存留率</span>
          <span>{{ book.retentionRatio || 0 }}%</span>
        </p>
        <p class="item">
          <span class="key">日更字数/天</span>
          <span>{{ book.serializeWordCount || 0 }}</span>
        </p>
      </div>
      <div class="introduction">
        {{ book.longIntro }}
      </div>
      <div class="comment">
        <p class="comment-title">热门评论</p>
        <ul>
          <li
            v-for="(item, index) in comments"
            :key="index"
            class="comment-list"
          >
            <div class="inner">
              <div class="cover">
                <img :src="imgUrl + item.author.avatar" alt="" />
              </div>
              <div class="right">
                <p class="name">{{ item.author.nickname }}</p>
                <p class="title">{{ item.title }}</p>
                <p class="content">{{ item.content }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { book, bookComments } from "../api/api";
export default {
  name: "book-detail",
  data() {
    return {
      title: "书籍详情",
      book: {},
      upDate: 0,
      comments: [],
      sUrl: "http://statics.zhuishushenqi.com",
      flag: false,
      fontSize: 18,
      fontColor: "#5c5d58",
      background: "#eee6dd",
      readePattern: 0,
      pagingPattern: 0,
    };
  },
  computed: {
    imgUrl() {
      return this.sUrl;
    },
  },
  created() {
    this.getBook(this.$route.params.id);
    this.getComments(this.$route.params.id);
  },
  watch: {
    $route: function (newVal, oldVal) {
      this.getBook(newVal.params.id);
      this.getComments(newVal.params.id);
    },
  },
  methods: {
    latelyFollower(lately) {
      if (lately > 10000) {
        return (lately / 10000).toFixed(1);
      } else {
        return lately;
      }
    },
    latelyCount(count) {
      if (count > 10000) {
        return (count / 10000).toFixed() + "万字";
      } else {
        return count + "字";
      }
    },
    getBook(id) {
      book(id).then((res) => {
        this.book = res.data;
        this.upDate = this._time(this.book.updated);
        this.isFlag();
        this.setBook(this.book);
      });
    },
    _unEscape(str) {
      str = unescape(str).replace("/agent/", "");
      return str;
    },
    _time(time) {
      let currentTime = Math.round(new Date() / 1000);
      time = new Date(time).getTime() / 1000;
      let timer = Math.floor(((currentTime - time) % 86400) / 3600);
      return timer;
    },
    getComments(id) {
      bookComments(id).then((res) => {
        if (res.data.ok) {
          this.comments = res.data.reviews;
        }
      });
    },
    isFlag() {
      // 返回本地是否缓存（加入书架）
      let localShelf = JSON.parse(window.localStorage.getItem("book"));

      this.flag = !!(localShelf && localShelf[this.book._id]);
    },
    setBookLocalStorage() {
      let localShelf = JSON.parse(window.localStorage.getItem("book"))
        ? JSON.parse(window.localStorage.getItem("book"))
        : {};
      if (this.flag) {
        delete localShelf[this.book._id];
        window.localStorage.setItem("book", JSON.stringify(localShelf));
        this.flag = !this.flag;
      } else {
        localShelf[this.book._id] = {
          cover: this.book.cover,
          title: this.book.title,
          id: this.book._id,
          chapterIndexCache: 0,
          bookSource: 0,
          pageIndexCache: 0,
        };
        window.localStorage.setItem("book", JSON.stringify(localShelf));
        this.flag = !this.flag;
      }
    },

    //将用户设置进行缓存
    setUserLocalStorage() {
      let localShelf = JSON.parse(window.localStorage.getItem("userSet"))
        ? JSON.parse(window.localStorage.getItem("userSet"))
        : {};
      if (localShelf.color) {
        return;
      } else {
        localShelf = {
          fontSize: this.fontSize,
          background: this.background,
          color: this.fontColor,
          readePattern: this.readePattern,
          pagingPattern: this.pagingPattern,
        };
        window.localStorage.setItem("userSet", JSON.stringify(localShelf));
      }
    },

    goReadBooks() {
      this.$router.push({
        path: `/readBook/${this.$route.params.id}/`,
      });
    },
    ...mapMutations({
      setBook: "SET_BOOK",
    }),
    onClickLeft() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  vertical-align: baseline;
}
.books-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  width: 100%;
  overflow-y: scroll;
  max-width: 750px;
  margin: 0 auto;

  .book-detail {
    display: flex;
    padding: 30px;

    .cover {
      flex: 0 0 2rem;
      height: 2.666667rem;
      margin-right: 0.133333rem;
      overflow: hidden;
      background: url("../assets/images/default.jpg") no-repeat;
      background-position: 50%;
      background-size: 100%;

      img {
        max-width: 100%;
      }
    }

    .desc {
      h1 {
        height: 25px;
        font-size: 14px;
      }

      p {
        height: 20px;
        color: #999;
      }
    }
  }

  .read-link {
    display: flex;
    padding: 0 18px 18px 18px;
    font-size: 12px;

    div {
      flex: 1;
      text-align: center;
      line-height: 40px;
      height: 40px;
    }

    .sj {
      border: 1px solid #409eff;
      color: #409eff;
      box-sizing: border-box;
      margin-right: 10px;
    }

    .read {
      background: #409eff;
      color: #fff;
      margin-left: 10px;
    }
  }

  .reader-data {
    padding: 15px 0;
    border-top: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
    box-sizing: border-box;
    font-size: 0;

    .item {
      display: inline-block;
      width: 33%;
      text-align: center;
      vertical-align: middle;

      span {
        font-size: 16px;
      }

      .key {
        display: block;
        font-size: 12px;
        color: #999;
        margin-bottom: 20px;
      }
    }
  }

  .introduction {
    width: 100%;
    padding: 0.4rem;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 0.173333rem;
    color: #999;
    line-height: 0.533333rem;
    overflow: hidden;
    text-align: justify;
    border-bottom: 0.013333rem solid #ebebeb;
  }

  .comment {
    padding-left: 15px;

    .comment-title {
      height: 30px;
      line-height: 30px;
    }

    .comment-list {
      padding: 15px 0;
      border-bottom: 1px solid #ebebeb;

      .inner {
        position: relative;

        .cover {
          position: absolute;
          width: 35px;
          height: 35px;
          background: url("../assets/images/default.jpg") no-repeat;
          background-position: 50%;
          background-size: 100%;
          border-radius: 50%;

          img {
            width: 35px;
            height: 35px;
            border-radius: 50%;
          }
        }

        .right {
          padding: 0 15px 0 40px;

          .name {
            font-size: 10px;
            color: #999;
            height: 15px;
          }

          .title {
            font-size: 10px;
            font-weight: 600;
            height: 15px;
          }

          .content {
            height: 1.06667rem;
            overflow: hidden;
            line-height: 0.53333rem;
            text-align: justify;
            color: #999;
          }
        }
      }
    }
  }
}
</style>