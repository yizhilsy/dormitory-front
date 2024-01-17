<template>
  <div id="app">
    <div class="scroll-view"
         ref="scrollView"
         id="scroll-view"
         @scroll="handleScroll">
      <div
          v-for="(item, index) in list"
          :key="index"
          class="list-item">
        列表项{{item}}
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'HelloWorld',
  data() {
    return {
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    };
  },
  mounted() {
    this.$nextTick(() => {
      console.log('clientHeight', this.$refs.scrollView.clientHeight)
    })
  },
  methods: {
    handleScroll(e) {
      const {scrollTop, clientHeight, scrollHeight} = e.target
      // console.log(scrollTop, clientHeight, scrollHeight)
      if (scrollTop + clientHeight === scrollHeight){
        alert('滚动到底部啦')
      }
    }
  }
}
</script>
<style scoped>
.scroll-view {
  width: 400px;
  height: 300px;
  overflow-y: scroll;
  background-color: #68b687;
}

.list-item {
  padding: 40px 0;
}

.list-item:nth-child(2n + 1){
  background-color: rgba(0, 0, 0, .2);
}

.list-item:nth-child(2n + 2){
  background-color: rgba(222, 221, 221, 0.2);
}
</style>
