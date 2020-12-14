<template>
  <div class="rank-wrapper">
    <div class="rank-section" v-show="maleRank.length">
      <h4>男生</h4>
      <div
        class="rank-item"
        v-for="(item, index) in maleRank"
        :key="index"
        @click="goRankDetail(item)"
      >
        <img :src="url + item.cover" alt="" />
        <span>{{ item.title }}</span>
      </div>

      <div class="rank-section" v-show="femaleRank.length">
        <h4>女生</h4>
        <div
          class="rank-item"
          v-for="(item, index) in femaleRank"
          :key="index"
          @click="goRankDetail(item)"
        >
          <img :src="url + item.cover" alt="" />
          <span>{{ item.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { rankCategory } from "../api/api";
export default {
  name: "Rank",
  data() {
    return {
      url: "http://statics.zhuishushenqi.com/",
      femaleRank: [],
      maleRank: [],
    };
  },
  created() {
    this.getRanking();
  },
  methods: {
    getRanking() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      rankCategory()
        .then((res) => {
          this.$toast.clear();
          if (res.data.ok) {
            this.femaleRank = res.data.female.slice(0, 6);
            this.maleRank = res.data.female.slice(0, 6);
          }
        })
        .catch((err) => {});
    },
    goRankDetail(item) {
      this.$router.push({
        path: `/rank/${item._id}`,
        query: { title: item.title },
      });
      this.setRank(item);
    },
    ...mapMutations({
      setRank: "SET_RANK",
    }),
  },
};
</script>

<style lang="scss" scoped>
.rank-wrapper {
  .rank-section {
    margin-bottom: 55px;
    h4 {
      line-height: 50px;
      padding: 0 20px;
      color: #666;
      font-weight: normal;
      font-size: 20px;
    }
    .rank-item {
      display: flex;
      height: 50px;
      align-items: center;
      padding-left: 20px;

      img {
        width: 30px;
        height: 30px;
      }
      span {
        flex: 1;
        margin-left: 20px;
        line-height: 50px;
        font-size: 18px;
        border-bottom: 1px solid #f5f5f5;
        padding: 20px 0;
        box-sizing: content-box;
      }
    }
  }
}
</style>