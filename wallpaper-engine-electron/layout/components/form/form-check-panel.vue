<template>
    <div class="respicker-panel">
        <div v-for="item in list" class="respicker-label-group">
            <div class="respicker-label-group-title">
                <slot name="title" v-bind="item">{{ item.title }}</slot>
            </div>
            <div>
                <div v-for="i, idx in item.children" :key="idx" class="respicker-label-item"
                    :class="{ active: isChecked(i) }" @click="handleClick(i)">
                    <slot name="item" v-bind="{ item: i, index: idx }">
                        {{ i.label || i }}
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "FormCheckPanel",
    model: {
        prop: 'checked',
        event: 'change'
    },
    props: {
        checked: {
            type: [Array, String],
            default: () => ([])
        },
        type: {
            type: String,
            default: 'checkbox',
            validator: value => ['checkbox', 'radio'].includes(value)
        },
        list: {
            type: Array,
            default: () => ([])
        }
    },
    watch: {
        type(val) {
            if (val === 'radio') {
                this.$emit('change', '')
            } else {
                this.$emit('change', [])
            }
        }
    },
    methods: {
        isChecked(item) {
            let val = item.value === undefined ? item : item.value

            if (this.type === 'radio') {
                return this.checked === val
            } else {
                let len = this.checked.length
                return len === 0 ? false : this.checked.findIndex(item => item === val) > -1
            }
        },
        handleClick(item) {
            let val = item.value === undefined ? item : item.value

            if (this.type === 'radio') {
                this.$emit('change', val)
            } else {
                let vals = this.checked.filter(v => v !== val)
                if (vals.length === this.checked.length) vals.push(val)
                this.$emit('change', vals)
            }
        }
    }
}
</script>
<style lang="less" scoped>
.respicker-panel {
    display: flex;

    .respicker-label-group {
        flex: 1;
        text-align: center;
        margin: 0 2px;

        .respicker-label-group-title {
            margin-bottom: 5px;
        }
    }

    .respicker-label-item {
        cursor: pointer;
        border-radius: 4px;
        padding: 6px 10px;
        border: 1px solid var(--respicker-border-color);
        color: var(--respicker-color);

        +.respicker-label-item {
            margin-top: 5px;
        }

        &.active {
            color: var(--respicker-acvite-color);
            border: 1px solid var(--respicker-acvite-border-color);
            background-color: var(--respicker-acvite-bg-color);
        }
    }
}
</style>