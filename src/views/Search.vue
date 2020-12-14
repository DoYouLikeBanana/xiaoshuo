<template>
  <div class="search">
    <van-nav-bar
      :title="title"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft('Home')"
    />

    <div class="book-list">
      <book-list
        :book="book"
        v-for="book in bookLists"
        :key="book._id"
        :isSearch="isSearch"
        :isLoadMore="isLoadMore"
      >
      </book-list>
      <div class="loading-container" v-show="!bookLists.length">
        <div style="text-align: center; margin-top: 10px">没有找到更多书籍</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import BookList from "../components/book-list.vue";
import { search } from "../api/api";
export default {
  name: "Search",
  data() {
    return {
      title: "",
      bookLists: [],
      isSearch: true,
      isLoadMore: false,
    };
  },
  computed: {
    ...mapGetters(["search"]),
  },

  methods: {
    _getBookLists(val) {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      search(val).then((res) => {
        this.$toast.clear();
        if (res.data.ok) {
          this.bookLists = this._unEscape(
            this.normalizeBooks(res.data.books.slice(0, 20))
          );
          if (
            this.bookLists <= 20 ||
            this.bookLists.length === res.data.books.length
          ) {
            this.allLoaded = true;
          }
        }
      });
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
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.title = `跟"${vm.$route.query.val}"有关的书籍`;
      vm._getBookLists(vm.$route.query.val);
    });
  },
};
</script>

<style lang="scss" scoped>
</style>