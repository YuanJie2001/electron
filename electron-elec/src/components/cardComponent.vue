<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <slot name="context-header"></slot>
            </div>
            <slot name="context-body"></slot>
        </template>
    </el-card>
</template>  
    
    
<script setup lang="ts">

</script>

<style>
@import "../assets/css/index.css";

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.box-card {
    width: 800px;
}

</style>