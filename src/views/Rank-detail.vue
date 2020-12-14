<template>
  <div class="bookLists">
    <van-nav-bar
      :title="title"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />

    <div class="select">
      <ul class="select-bar">
        <li
          v-for="(item, index) in largeTypes"
          :key="index"
          :class="{ active: index === largeTypeIndex }"
          @click="setLargeType(item.type, index)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div class="load-more" ref="load">
      <div class="book-list">
        <book-list
          :book="book"
          v-for="(book, index) in bookLists"
          :key="index"
          :ranks="ranks"
          :isLoadMore="isLoadMore"
        >
        </book-list>
        <div class="loading-container" v-show="!bookLists.length">
          <div style="text-align: center; margin-top: 10px">
            没有找到更多书籍
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { rank } from "../api/api";
import BookList from "../components/book-list";
export default {
  name: "Rank-detail",
  data() {
    return {
      largeTypeIndex: 0,
      title: "",
      largeTypes: [
        {
          name: "周榜",
          type: "week",
        },
        {
          name: "月榜",
          type: "month",
        },
        {
          name: "总榜",
          type: "total",
        },
      ],

      bookLists: [],
      allLoad: false,
      monthRank: "",
      totalRank: "",
      weekRank: "",
      currentLoadPage: 1,
      type: "week",
      ranks: true,
      isLoadMore: false,
    };
  },

  computed: {
    ...mapGetters(["rank"]),
  },
  methods: {
    setLargeType(type, index) {
      //点击后重置滚动距离
      this.$refs.load.scrollTop = 0;
      this.bookLists = [];
      this.currentLoadPage = 1;
      this.largeTypeIndex = index;
      this.type = type;
      this.allLoaded = false;
      this._getBookLists(type);
    },
    _getBookLists(url) {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      if (!this.rank.weekRank) {
        //在刷新页面的时候记录每个排行榜的id值
        rank(this.$route.params.id).then((res) => {
          //
          this.$toast.clear();
          this.weekRank = res.data.ranking.id;
          this.monthRank = res.data.ranking.monthRank;
          this.totalRank = res.data.ranking.totalRank;
          this.title = res.data.ranking.title;
        });
      } else {
        this.$toast.clear();
        //从排行榜列表也点击进去排行榜详情记录id的值
        this.weekRank = this.rank.weekRank;
        this.monthRank = this.rank.monthRank;
        this.totalRank = this.rank.totalRank;
      }
      if (!url) {
        //判断是否传参，如果没有传参那证明是用户在当前页面刷新，即把$route.params.id传给下面
        url = this.$route.params.id;
      } else {
        //有传参那么证明是用户单击tab切换，直接把上面记录的值赋值给url
        url = this[url + "Rank"];
      }
      rank(url)
        .then((res) => {
          this.$toast.clear();
          if (res.data.ok) {
            this.bookLists = this._unEscape(
              this.normalizeBooks(res.data.ranking.books.slice(0, 20))
            );
          } else {
            this.bookLists = [];
          }
        })
        .catch((err) => {});
    },
    _unEscape(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i].cover = unescape(arr[i].cover);
        arr[i].cover = arr[i].cover.replace("/agent/", "");
      }
      return arr;
    },

    onClickLeft() {
      this.$router.go(-1);
    },
  },
  components: {
    BookList,
  },
  components: { BookList },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.title = vm.$route.query.title;
      vm._getBookLists();
      vm.largeTypeIndex = 0;
    });
  },
};
</script>

<style lang="scss" scoped>
.bookLists {
  .select {
    position: absolute;
    top: 40px;
    left: 0;
    background: #fff;
    z-index: 10;
    width: 100%;
  }

  .select-bar {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: nowrap;
    height: 60px;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    border-bottom: 1px solid #f2f2f2;
  }

  .select-bar li {
    text-align: center;
    flex: 1;
    line-height: 80px;
    padding: 0 20px;
    font-size: 16px;
  }

  .book-list {
    width: 100%;
    background: #fff;
  }

  .load-more {
    padding-top: 50px;
    overflow-y: scroll;
    height: 100vh;
    box-sizing: border-box;
  }

  .active {
    color: #409eff;
    border-bottom: 1px solid #409eff; /* no */
  }
}
</style>