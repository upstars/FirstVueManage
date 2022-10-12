<template>
    <div class="tags">
        <el-tag
            v-for="(tag,index) in tags"
            :key="tag.name"
            :closable="tag.name !== 'home'"
            :disable-transitions="false"
            :effect="$route.name === tag.name ?'dark':'plain'"
            @click="changeMenu(tag)"
            @close="handleClose(tag,index)"
        >
            {{tag.label}}
        </el-tag>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex"

const router = useRouter();
const route = useRoute();
const store = useStore();
const tags = store.state.tagsList

const changeMenu = (item) => {
    router.push({ name: item.name })
}
const handleClose = (tag, index) => {
    let length = tags.length - 1;
    //处理tagsList
    store.commit("closeTag", tag);
    if (tag.name !== route.name) {
        return;
    }
    if (index === length) {
        router.push({
            name: tags[index - 1].name
        })
    } else {
        router.push({
            name: tags[index].name
        })
    }
}
</script>

<style lang="less" scoped>
.tags {
    padding: 2px;
    width: 100%;

    .el-tag {
        margin-left: 10px;
        cursor: pointer;
    }
}
</style>