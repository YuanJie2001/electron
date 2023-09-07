<template>
  <div class="contain">
      <DeviceDataCardVue  class="detailData"  v-for="(item,index) in cardArray" :key="index" :item="item" :itemMapData="item.mapData">
      </DeviceDataCardVue>
  </div>
</template>

<script setup lang="ts">
import DeviceDataCardVue from "@/components/deviceDataCard.vue";
import { useCardArrayStore } from "@/store/cardStore.ts"
import {storeToRefs} from "pinia";
import {watch} from "vue";
const store = useCardArrayStore()

// store.connectWebSocket()
const {cardArray,socketMessage} = storeToRefs(store)
// console.log(store.socketMessage)

watch(cardArray, (newVal, oldVal) => {
  // console.log("cardArray",cardArray);
});
watch(store.socketMessage, (newVal, oldVal) => {
  // console.log("socketMessage", newVal, oldVal);
  // store.socketMessage.map((msg, idx) => {
  //           // console.log(msg,item,idx)
  //           if (msg.groupName == item.groupName &&
  //               msg.address == item.address) {
  //                   console.log("移除节点",msg)
  //               store.socketMessage.splice(idx, 1)
  //               return;
  //           }
  //       })
});

</script>

<style lang="less" scoped>
@import "@/assets/css/index.css";


.contain {
  height: 700px;
  width: 100%;
  /* background-color: saddlebrown; */
  display: flex;
  justify-content: left;
  flex-flow: wrap;
  overflow-y:auto;
  overflow-x:hidden;
  .detailData{
    margin-right: 14px;
  }
}
</style>
