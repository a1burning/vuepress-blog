---
title: 用Vue3简单写一个单行横向滚动组件
tags: 
  - Vue3
  - 横向滚动
prev: false
next: false
sidebarDepth: 5
---
# 用Vue3简单写一个单行横向滚动组件

## 效果图:tada:
把之前完成的一个效果图摘出来记录一下，核心代码在这里，如果项目中用到其他的技术，也很容易改。

![scroll.gif](~@public/assets/javascript/scroll.gif)

## 需求分析
::: tip 实现以下功能
1. 展示数据`始终一行`，多余的部分可以出滚动条，同时隐藏滚动条样式。
2. 支持笔记本`触控滑动`展示
3. 支持`鼠标点击滑动`，多余的时候出现箭头按钮，默认滑动3个卡片的位置，顶头就切换方向
4. 当`页面出现变动的时候要监听`及时显示或隐藏按钮
:::

## 实现分析

::: tip 样式展示分析
- 外层控制总体组件宽度
    + 内层箭头区域展示，内部使用flex布局，绝对定位到右侧
        * 内部箭头svg图标，垂直居中
    + 内层控制滚动区域宽度，内部使用flex布局，控制一层展示，溢出滚动展示，并隐藏滚动条
        * 内部确定卡片宽高和间距，最后一个右边距为0
:::

::: tip 变量分析
1. 卡片 `list：Array`
2. 控制箭头显隐 `arrowShow：Boolean`，控制箭头方向 `direction：String`
3. 获取滚动位置 `scrollPosition = {left: 0, top: 0}`
4. 计算宽度需要的ref：控制滚动条层 `groupBoxRef`，卡片 `groupCardRef`
:::

::: tip 方法分析
1. 获取list（可以http，也可以props，根据需求来定）
2. 页面挂载之后，监听groupBoxRef的scroll事件和窗口变化的resize事件
3. 箭头的显隐判断方法，改变箭头方向的方法
4. 鼠标点击箭头的方法
:::

## 实现步骤
### 1. 实现模板
```js
<template>
  <div class="index-group-box">
    <!-- 右边滑动箭头 -->
    <div class="scrollX">
      <img src='../assets/arrow-left-bold.svg'/>
    </div>
    <!-- 卡⽚ -->
    <div class="index-group-boxIn" ref="groupBoxRef">
      <div
        v-for="item in groupInfo"
        :key="item.id"
        ref="groupCardRef"
        class="group-card"
      >
        <div class="card-name">
          名称
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
```

### 2. 实现css

- 滚动平滑：`scroll-behavior: smooth`;
- 隐藏滚动条
- 最后一个卡片右边距为0

```html{29,31-32,34,36-37,40-42,65-67}
<style scoped>
  .index-group-box {
    padding-right: 16px;
    position: relative;
    box-sizing: border-box;
    width: 100%;
  }  

  .scrollX {
    width: 16px;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    background-color: #512D6D;
    display: flex;
    justify-content: center;
    align-items: center
  }

  .scrollX:hover {
    cursor: pointer;
    background-color: #65447d;
  }

  .index-group-boxIn {
    display: flex;
    /* 这个可以让滚动平滑 */
    scroll-behavior: smooth;
    /* 一行展示，多余出现滚动条 */
    white-space: nowrap;
    overflow-x: auto;
    /* 不让flex影响内容宽高 */
    flex: none;
    /* 隐藏滚动条 */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
  }

  .index-group-boxIn::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }

  .group-card {
    padding: 8px 16px;
    box-sizing:border-box;
    width: 200px;
    height: 100px;
    border-radius: 4px;
    margin-right: 16px;
    flex: none;
    background-color: #71EFA3;
    color: #54436B;
  }

  .group-card span{
    color: #54436B;
  }

  .group-card:hover{
    background-color: #ACFFAD;
  }

  /* 最后一个元素右边距为0 */
  .group-card:nth-last-of-type(1){
    margin-right: 0px;
  }
</style>
```

### 3. 首先获取list
```js
<script>
import { defineComponent, ref } from 'vue';
export default defineComponent({
    name: 'scroll',
    setup() {
        const groupInfo = ref([]);
        
        // 获取卡片列表
        const getMyGroup = async () => {
            const data = [{
                id: 1,
                name:'卡片1'
            },{
                id: 2,
                name:'卡片2'
            },{
                id: 3,
                name:'卡片3'
            },{
                id: 4,
                name:'卡片4'
            },{
                id: 5,
                name:'卡片5'
            }]
            groupInfo.value = data;
        }
        // 进入页面调用
        getMyGroup();
        return {
            // data
            groupInfo,
        };
    },
});
</script>
```

### 4. 页面挂载后监听groupBoxRef的scroll事件并获取当前的滚动位置

```js
// 添加reactive和onMounted
import { defineComponent, ref, reactive, onMounted } 
...
const groupBoxRef = ref(null); // 获取外层卡⽚ref
const groupCardRef = ref(null); // 获取卡⽚ref
const scrollPosition = reactive({
    left: 0,
    top: 0
}); // 滚动位置
...
// 获取scroll函数的位置
const handleScroll = e => {
    scrollPosition.left = e.target.scrollLeft;
    scrollPosition.top = e.target.scrollTop;
}

onMounted(() => {
    // 监听scroll事件
    groupBoxRef.value.addEventListener('scroll', handleScroll, true);
})

return {
    // data
    groupInfo,
    // ref
    groupBoxRef,
    groupCardRef,
};
```

### 5. 计算展示的宽度显隐箭头，当卡片宽度大于外层宽度就展示
- 卡片宽度：`groupCardRef.value.offsetWidth`
- 外层宽度：`groupBoxRef.value.offsetWidth`
- 滚动区域宽度：`卡片数量 * （卡片宽度 + 右边距）- 最后一个右边距`

```html
<div class="scrollX" v-if="arrowShow">
    <img src='../assets/arrow-left-bold.svg'/>
</div>
```

```js
...
const arrowShow = ref(false); // 滚动箭头是否显示

// 获取卡⽚宽度，第⼀个参数是卡⽚个数，默认是整个数组，第⼆个参数是剩余的margin
const getWidth = (num = groupInfo.value.length, restMargin = 16) => {
    // 如果没有内容就返回0
    if(!groupCardRef.value) return 0;
    return num * (groupCardRef.value.offsetWidth + 16) - restMargin;
}

// 判断arrow是否展示
const checkArrowShow = () => {
    arrowShow.value = getWidth() > groupBoxRef.value?.offsetWidth ? true : false;
}
...
onMounted(() => {
    // 监听scroll事件
    ...
    // 首次检查箭头展示
    checkArrowShow();
})
```

### 6. 控制箭头展示方向
- 初始朝右，`横向滚动区域为0就朝右，剩余宽度比外层宽度小就朝左`
- 剩余宽度：`滚动区域宽度 - 滚动距离`

```html
<!-- 添加点击箭头事件和箭头方向svg -->
<div class="scrollX" @click="groupScroll" v-if="arrowShow">
    <img v-if="direction === 'left'" src='../assets/arrow-left-bold.svg'/>
    <img v-else src='../assets/arrow-right-bold.svg'/>
</div>
```

```js
...
const direction = ref('right'); // 默认项⽬组箭头向右
...
// 改变滚动⽅向
const changeArrow = (scrollLeft) => {
    // 默认获取scoll部分整个宽度
    const getScrollWidth = getWidth();
    // 计算得出剩余宽度
    const restWidth = getScrollWidth - scrollLeft
    if (restWidth <= groupBoxRef.value.offsetWidth) {
        direction.value = 'left'
    } else if ( scrollLeft === 0 ) {
        direction.value = 'right'
    }
}

// ⿏标点击滚动
const groupScroll = async () => {
    // 计算移动宽度，现在是移动3个卡片的数量
    const getMoveWidth = getWidth(3, 0);
    // 如果方向是右边就+，左边就-
    if (direction.value === 'right') {
        groupBoxRef.value.scrollLeft += getMoveWidth;
    } else {
        groupBoxRef.value.scrollLeft -= getMoveWidth;
    }
    // 滚动需要时间才能获取最新的距离，根据新的距离看箭头的方向
    setTimeout(() => {
        changeArrow(groupBoxRef.value.scrollLeft);
    }, 500)
}

// 触摸板滑动的时候位置实时改变箭头方向
const handleScroll = e => {
    ...
    changeArrow(scrollPosition.left);
}

return {
        
    // 新加的data
    ...
    direction,
    // ref
    ...
    // 新加的methods
    groupScroll
};
```

### 7. 监听外层宽度改变和窗口大小改变箭头显隐

```js
import { defineComponent, ref, reactive, onMounted, watchEffect } from 'vue';
...
watchEffect(() => {
    checkArrowShow();
})

onMounted(() => {
    ...
    // 监听窗⼝变化事件，判断arrow的展示
    window.addEventListener('resize', checkArrowShow, true);
})
```

## 完整代码

::: details 点击查看代码
```js
<template>
    <div class="index-group-box">
        <!-- 右边滑动箭头 -->
        <div class="scrollX" @click="groupScroll" v-if="arrowShow">
            <img v-if="direction === 'left'" src='../assets/arrow-left-bold.svg'/>
            <img v-else src='../assets/arrow-right-bold.svg'/>
        </div>
        <!-- 卡⽚ -->
        <div class="index-group-boxIn" ref="groupBoxRef">
            <div
                v-for="item in groupInfo"
                :key="item.id"
                ref="groupCardRef"
                class="group-card"
            >
                <div class="card-name">
                    名称
                    <span>{{ item.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent, ref, reactive, onMounted, watchEffect } from 'vue';
export default defineComponent({
    name: 'scroll',
    setup() {
        const groupInfo = ref([]); // 卡片list
        const direction = ref('right'); // 默认箭头向右
        const arrowShow = ref(false); // 滚动箭头是否显示
        const groupBoxRef = ref(null); // 获取外层卡⽚ref
        const groupCardRef = ref(null); // 获取卡⽚ref
        const scrollPosition = reactive({
            left: 0,
            top: 0
        }); // 滚动位置

  
        // 获取卡片列表
        const getMyGroup = async () => {
            const data = [{
                id: 1,
                name:'卡片1'
            },{
                id: 2,
                name:'卡片2'
            },{
                id: 3,
                name:'卡片3'
            },{
                id: 4,
                name:'卡片4'
            },{
                id: 5,
                name:'卡片5'
            }]
            groupInfo.value = data;
        }
    
        // 获取卡⽚宽度，第⼀个参数是卡⽚个数，默认是整个数组，第⼆个参数是剩余的margin
        const getWidth = (num = groupInfo.value.length, restMargin = 16) => {
            // 如果没有内容就返回0
            if(!groupCardRef.value) return 0;
            return num * (groupCardRef.value.offsetWidth + 16) - restMargin;
        }
        // 改变滚动⽅向
        const changeArrow = (scrollLeft) => {
            // 默认获取scoll部分整个宽度
            const getScrollWidth = getWidth();
            // 获取剩余宽度
            const restWidth = getScrollWidth - scrollLeft
            if (restWidth <= groupBoxRef.value.offsetWidth) {
                direction.value = 'left'
            } else if ( scrollLeft === 0 ) {
                direction.value = 'right'
            }
        }
        // ⿏标点击滚动
        const groupScroll = async () => {
            // 获取滚动宽度
            const getMoveWidth = getWidth(3, 0);
            if (direction.value === 'right') {
                groupBoxRef.value.scrollLeft += getMoveWidth;
            } else {
                groupBoxRef.value.scrollLeft -= getMoveWidth;
            }
            // 滚动需要时间才能获取最新的距离
            setTimeout(() => {
                changeArrow(groupBoxRef.value.scrollLeft);
            }, 500)
        }

        // 判断arrow是否展示
        const checkArrowShow = () => {
            arrowShow.value = getWidth() > groupBoxRef.value?.offsetWidth ? true : false;
        }

        watchEffect(() => {
            checkArrowShow();
        })

        // 获取scroll函数的位置
        const handleScroll = e => {
            scrollPosition.left = e.target.scrollLeft;
            scrollPosition.top = e.target.scrollTop;
            changeArrow(scrollPosition.left);
        }

        getMyGroup();

        onMounted(() => {
            // 监听scroll事件
            groupBoxRef.value.addEventListener('scroll', handleScroll, true);
            // 监听窗⼝变化事件，判断arrow的展示
            window.addEventListener('resize', checkArrowShow, true);
            // 首次检查箭头展示
            checkArrowShow();
        })

        return {
            // data
            groupInfo,
            direction,
            arrowShow,
            // ref
            groupBoxRef,
            groupCardRef,
            // methods
            groupScroll
        };
    },
});
</script>
<style scoped>
.index-group-box {
    padding-right: 16px;
    position: relative;
    box-sizing: border-box;
    width: 100%;
}  

.scrollX {
    width: 16px;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    background-color: #512D6D;
    display: flex;
    justify-content: center;
    align-items: center
}

.scrollX:hover {
    cursor: pointer;
    background-color: #65447d;
}

.index-group-boxIn {
    display: flex;
    /* 这个可以让滚动平滑 */
    scroll-behavior: smooth;
    /* 一行展示，多余出现滚动条 */
    white-space: nowrap;
    overflow-x: auto;
    /* 不让flex影响内容宽高 */
    flex: none;
    /* 隐藏滚动条 */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
}

.index-group-boxIn::-webkit-scrollbar {
    display: none; /* Chrome Safari */
}

.group-card {
    padding: 8px 16px;
    box-sizing:border-box;
    width: 200px;
    height: 100px;
    border-radius: 4px;
    margin-right: 16px;
    flex: none;
    background-color: #71EFA3;
    color: #54436B;
}

.group-card span{
    color: #54436B;
}

.group-card:hover{
    background-color: #ACFFAD;
}

/* 最后一个元素右边距为0 */
.group-card:nth-last-of-type(1){
    margin-right: 0px;
}
</style>
```
:::