<template>
  <div class="myBooks">
    <van-nav-bar right-text="编辑" />
    <div class="addBooks" v-show="books.length < 8">
      <van-button type="primary" @click="goAdd">去添加</van-button>
    </div>
    <div class="book-list">
      <div
        class="book-item"
        v-for="(book, index) in books"
        :key="index"
        @click="goReadBooks(book.id)"
      >
        <div class="cover">
          <img :src="_unEscape(book.cover)" />
        </div>
        <p class="name">{{ book.title }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyBooks",
  data() {
    return {
      books: [],
      isShowCheck: false,
    };
  },
  created() {
    this.getBooks();
  },
  methods: {
    goAdd() {
      this.$router.push({
        path: "categories",
      });
    },
    getBooks() {
      let bookIdArray = [];
      let localShelf = JSON.parse(window.localStorage.getItem("book"))
        ? JSON.parse(window.localStorage.getItem("book"))
        : {};
      for (let i in localShelf) {
        localShelf[i].cover = this._unEscape(localShelf[i].cover);
        this.books.push(localShelf[i]);
        bookIdArray.push(i);
      }
      this.option = bookIdArray;
    },
    _unEscape(str) {
      str = unescape(str).replace("/agent/", "");
      return str;
    },
    showCheck() {
      this.isShowCheck = true;
      let check = this.$refs.checklist;

      this.$refs.delete.style.opacity = 1;
      for (let i = 0; i < check.length; i++) {
        check[i].$el.style.display = "block";
      }
    },

    goReadBooks(id) {
      if (this.isShowCheck) {
        return;
      }
      this.$router.push({
        path: `/readBook/${id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.myBooks {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  overflow-y: scroll;
  max-width: 750px;
  margin: 0 auto;

  .edit {
    width: 100%;
    height: 20px;
    color: tomato;
    font-size: 20px;
    margin-left: 8px;
  }
  .addBooks {
    position: absolute;
    width: 130px;
    height: 40px;
    left: 50%;
    top: 70%;
    z-index: 200;
    background: #409eff;
    margin-left: -60px;
    margin-top: -80px;
    font-size: 25px;
    border-radius: 15px;

    /deep/ .van-button {
      width: 100%;
      height: 100%;
    }
    /deep/ .van-button--primary {
      background: tomato;
      border: none;
    }
  }
  .book-list {
    padding: 10px;
    box-sizing: border-box;
    overflow: hidden;

    .book-item {
      float: left;
      width: 25%;
      overflow: hidden;
      padding-right: 8px;
      box-sizing: border-box;
      text-align: center;
      margin-bottom: 10px;
      position: relative;

      &:nth-child(4n) {
        padding-right: 0;
      }

      .cover {
        width: 100%;
        background: url("../assets/images/default.jpg") no-repeat;
        background-position: 50%;
        background-size: 100%;

        img {
          width: 100%;
          height: 110px;
        }
      }

      .name {
        width: 100%;
        margin-top: 5px;
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
.btn {
  margin-right: 10px;
}
</style>