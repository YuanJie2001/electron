<template>
    <div class="page-component">
        <div v-for="item in l">
            <one-title :title="item.title"></one-title>
            <img-list-horizontal :list="list[item.type]"></img-list-horizontal>
        </div>
    </div>
</template>
<script>
import ajax from "@/libs/ajax";

export default {
    data() {
        return {
            l: [
                {
                    title: "最近更新",
                    type: "date_added"
                },
                {
                    title: "热榜",
                    type: "hot"
                },
                {
                    title: "收藏榜",
                    type: "favorites"
                },
                {
                    title: "查看榜",
                    type: "views"
                }
            ],
            list: {
                favorites: [],
                hot: [],
                views: []
            }
        }
    },
    created() {
        this.l.forEach(item => this.getData(item.type))
    },
    methods: {
        onRefresh() {
            this.l.forEach(item => {
                this.list[item.type] = []
                this.getData(item.type)
            })
        },
        getData(type) {
            return ajax(`search?sorting=${type}&order=desc&categories=111&purity=110&page=1`)
                .then(res => {
                    let { data, meta } = res;
                    this.list[type] = Object.freeze(data)
                })
        }
    }
}
</script>
<style lang="less" scoped>
.page-component {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 20px 20px;
    box-sizing: border-box;

    >div {
        overflow: hidden;
    }
}

</style>