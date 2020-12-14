<template>
  <div class="bookLists">
    <van-nav-bar
      :title="major"
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
      <ul class="select-bar" v-show="mins.length > 0">
        <!--<li data-type="hot">全部</li>-->
        <li
          v-for="(minor, index) in mins"
          :key="index"
          :class="{ active: index === smallTypeIndex }"
          @click="setSmallType(minor, index)"
        >
          {{ minor }}
        </li>
      </ul>
    </div>
    <div
      class="load-more"
      ref="load"
      :class="[mins.length > 0 ? 'padding10' : 'padding20']"
    >
      <div class="book-list">
        <book-list
          :book="book"
          v-for="(book, index) in bookLists"
          :key="index"
          :cate="cate"
          :isLoadMore="isLoadMore"
        ></book-list>
        <div
          v-show="!bookLists.length"
          style="margin-top: 10px; text-align: center"
        >
          暂无数据
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BookList from "../components/book-list";
import { categoriesInfo, subCategories } from "../api/api";
export default {
  name: "category-detail",
  data() {
    return {
      largeTypeIndex: 0,
      smallTypeIndex: 0,
      type: "hot",
      duration: "last-seven-days",
      major: "",
      minor: "",
      gender: "",
      start: 0,
      currentPage: 1,
      largeTypes: [
        {
          type: "hot",
          name: "热门",
        },
        {
          type: "new",
          name: "新书",
          duration: "all",
        },
        {
          type: "reputation",
          name: "好评",
        },
        {
          type: "over",
          name: "完结",
        },
        {
          type: "monthly",
          name: "包月",
        },
      ],
      mins: [],
      bookLists: [],
      cate: true,
      isLoadMore: false,
    };
  },
  methods: {
    setLargeType(type, index) {
      this.largeTypeIndex = index;
      if (this.type === type) {
        return;
      }

      this.type = type;
      this._getBookLists(this.gender, this.type, this.major, this.minor);
      //点击后重置滚动距离
      this.$refs.load.scrollTop = 0;
    },
    setSmallType(minor, index) {
      this.smallTypeIndex = index;
      if (this.minor === minor) {
        return;
      }
      if (minor === "" || minor === "全部") {
        this.minor = "";
      } else {
        this.minor = minor;
      }
      this.currentPage = 1;

      this._getBookLists(this.gender, this.type, this.major, this.minor);
      //点击后重置滚动距离
      this.$refs.load.scrollTop = 0;
    },
    _getBookLists(gender, type, major, minor = "", start = 0, limit = 20) {
      categoriesInfo(gender, type, major, minor, start, limit)
        .then((res) => {
          if (res.data.ok) {
            this.bookLists = this._unEscape(
              this.normalizeBooks(res.data.books.slice(0, 10))
            );
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

    loadBottom() {
      //加载更多
      this.isLoadMore = true;
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      categoriesInfo(
        this.gender,
        this.type,
        this.major,
        this.minor,
        this.currentPage * 20,
        20
      )
        .then((res) => {
          if (res.data.ok) {
            this.bookLists = this.bookLists.concat(
              this._unEscape(this.normalizeBooks(res.data.books.slice(0, 5)))
            );

            setTimeout(() => {
              this.isLoadMore = false;
            }, 350);
            this.currentPage++;
          }
        })
        .catch((err) => {
          this.$refs.loadmore.onBottomLoaded();
        });
    },
    loadTop() {
      //下拉加载
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      categoriesInfo(this.gender, this.type, this.major, this.minor, 0, 20)
        .then((res) => {
          if (res.data.ok) {
            this.bookLists = this._unEscape(
              this.normalizeBooks(res.data.books.slice(0, 5))
            );
          }
        })
        .catch((err) => {});
      this.$refs.loadmore.onTopLoaded();
    },
    onClickLeft() {
      this.$router.go(-1);
    },
  },
  components: {
    BookList,
  },
  beforeRouteEnter(to, from, next) {
    /*获取大类中的小类*/
    next((vm) => {
      vm.major = vm.$route.query.major;
      vm.gender = vm.$route.query.gender;
      subCategories()
        .then((res) => {
          res.data[vm.$route.query.gender].forEach((type) => {
            if (type.major === vm.$route.query.major) {
              vm.mins = type.mins;
              if (type.mins.length > 0) {
                vm.mins.unshift("全部");
              }
            }
          });
        })
        .catch((err) => {
          this.$toast.clear();
        });
      vm._getBookLists(vm.$route.query.gender, vm.type, vm.$route.query.major);
    });
  },
};
</script>

<style lang="scss" scoped>
.bookLists {
  .selecet {
    position: absolute;
    top: 100px;
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
    height: 50px;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    border-bottom: 1px solid #f2f2f2;
  }

  .select-bar li {
    flex-shrink: 0;
    line-height: 80px;
    padding: 0 10px;
    font-size: 14px;
  }

  .active {
    color: red;
  }

  .book-list {
    width: 100%;
    background: #fff;
  }

  .load-more {
    overflow-y: scroll;
    height: 100vh;
    box-sizing: border-box;
  }

  .padding10 {
    padding-top: 10px;
  }

  .padding20 {
    padding-top: 20px;
  }

  .active {
    color: #409eff;
  }
}
</style>