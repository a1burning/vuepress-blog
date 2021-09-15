---
title: waterfall瀑布流布局+动态渲染
tags: 
  - H5
  - Example
date: 2017-06-08
sidebarDepth: 5
---
## 瀑布流典型网站
花瓣网、堆糖
## 瀑布流布局原理
### 大体思路
首先先是页面布局
特点是：宽度一样，长度不一样

![瀑布流布局原理图.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cde0209b77e4801b0556a4a2acee520~tplv-k3u1fbpfcp-zoom-1.image)

由此可以知道，这种布局要用到**绝对定位**的思想来做。

上面的五个正常排列，到了第六个以后就要找最矮的追加了。

> **如何获取最矮的一列呢？**
>
> 第一个最好找，其他的每一个盒子可以获取它的高度，找最矮的盒子，然后找到最矮盒子的定位。
                                                            
> **新追加进去的盒子的定位是：**
>
> - `left`：最矮盒子的索引*（盒子的宽度+左右间距）
> - `top`: 这个盒子的高度 + 上下间距

放进去之后这一列的高度变化，记录下来生成新的高度，然后进行下一轮高度的比较。以此类推。

`waterful`是一个组件，基于`jquery`的一个组件。


### 具体思路

![瀑布流原理.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c19ee00606546c4b0dc40717721c31e~tplv-k3u1fbpfcp-zoom-1.image)

最外边的左右两边是没有间距的，所以`5`列的情况下有`4`个间距。所以宽度`width`一定的情况下，间距的宽度`space`是可以计算出来的：

**间距**
```js
var space = (wParent - 5 * width) / (col - 1);
// wParent 父盒子的宽度，width是子盒子的宽度，col是列数
```

**第一排的盒子的定位：**
- top ： 0
- left ： 索引*(width + space)

**第二排的盒子的定位：**
- top ： minHeight + space
- left ： 索引*(width + space)

所以`5`列的高度要用一个数组表示，可以找到最矮的元素以及其当前的索引。

## 插件封装
因为在第一次加载和第`n`次加载的时候，都要进行瀑布流布局。所以将瀑布流布局的方法进行一个插件进行封装，可以形成代码的复用。
首先了解瀑布流的`html`布局
```html
<!--页面容器-->
<div class = "container">
      <!--所有item的集合，距离顶部有距离-->
      <div class = "items">
             <!--每一个小块，包含了图片和文字-->
              <div class = "item">
                    <img src = "" />
                    <p>hello</p>
              </div>

              <div class = "item">
                    <img src = "" />
                    <p>hello</p>
              </div>
      </div>
</div>
<div class = "btn">正在加载...</div>
```

下面就来封装一个`jquery`的插件

### 第一步
将`jquery`中的全局变量转化为局部变量。
1. 防止全局污染，提高性能
2. 形成一个闭包，闭包里面定义的变量是不会影响外部变量的。

```javascript
/*自调用  形成一个闭包 */
(function($){
/*如果不加jQuery里面使用的$是全局变量，加了之后使用的就是成员变量*/

})(jQuery);
```

### 第二步
> jquery.fn.extend(object)
>
> `jquery`中的`fn`函数<br/>
> 提供一个第三方方法的一个入口，扩展`jquery`元素集(使用`$`可以获取到的元素) 来提供新的方法（通常用来制作插件）

```javascript
/*js/jquery-waterfall.js*/
(function($){
     $.fn.waterfall = function(){
        /*this指向的是当前调用这个方法的元素集（元素集是jquery获取元素是一个伪数组）*/
         console.log(this);
     }
})(jQuery);
```

### 第三步
对第一排进行排列
```javascript
(function($){
    $.fn.waterfall = function(){
    // this指向的是当前调用这个方法的元素集
    // 当前的瀑布流父容器
        var items = $(this);
        //父容器的宽度
        var wParent = items.width();
        //当前的瀑布流子容器
        var child = items.children();
        //获取子容器的宽度
        var width = child.width();
        //假设排多少列
        var col = 5;
        //计算间距(父元素的宽度减所有盒子的宽度/4)
        var space = (wParent - col * width) / (col - 1);

        //记录每列高度的数组
        var colHeightArr = [];

        //遍历每一个子元素
        $.each(child,function(i,item){
            var $item = $(item);
            var height = $item.height();

            //设置定位
            //第一排的元素都是靠顶部的，所以索引从0开始，小于5的时候都是靠顶部的
            if(i < col ){
                $item.css({
                    top: 0,
                    left:i * (width + space)  
                });
               //把高度添加进数组中
                colHeightArr[i] = height;
                //也可以用   colHeightArr.push(height);
            }
            //其他的都要根据最矮的一列进行排列
        });
    }
})(jQuery);
```

这样你就看到了效果图（因为模拟做了`13`个盒子，所以剩下的叠在了一起）

![第一排布局.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/987db17526d04942a7e9c8c43a1249f1~tplv-k3u1fbpfcp-zoom-1.image)

这个时候打印以下高度数组：

![colHeightArr.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b25c637127db4bdc8761cfbb53beb96e~tplv-k3u1fbpfcp-zoom-1.image)

可以看到前`5`个的高度都存到数组中去了。可以判断出来数组中最小的是`289`，`289`对应的数组的索引就是那一列的索引。

### 第四步
对其余的排进行排列。找最小的追加，然后本列的高度增加。以此类推。
最大的`items`等于最大的高度。这样才可以把下面的加载移动到下边去。
```javascript
(function($){
    $.fn.waterfall = function(){
    // this指向的是当前调用这个方法的元素集
    // 当前的瀑布流父容器
        var items = $(this);
        //父容器的宽度
        var wParent = items.width();
        //当前的瀑布流子容器
        var child = items.children();
        //获取子容器的宽度
        var width = child.width();
        //假设排多少列
        var col = 5;
        //计算间距
        var space = (wParent - col * width) / (col - 1);

        //记录每列高度的数组
        var colHeightArr = [];

        //遍历每一个子元素
        $.each(child,function(i,item){
            var $item = $(item);
            var height = $item.height();

            //定位

            //第一排的元素都是靠顶部的

            //索引从0开始，小于5的时候都是靠顶部的
            if(i < col ){
                $item.css({
                    top: 0,
                    left:i * (width + space)
                });

                //colHeightArr[i] = height;
                colHeightArr.push(height);
   
             //其他的都要根据最矮的一列进行排列
             }else{    
                //找到最矮的那一列进行排列
                //索引
                var index = 0;
                //假设最小的高度是第一个索引对应的高度
                var minHeight = colHeightArr[index];
                //遍历数组，找到最小值和最小值对应的索引
                //k是索引，v是值
                $.each(colHeightArr,function(k,v){
                    if(minHeight > v){
                        index = k;
                        minHeight = v;
                    }
                });

                //定位
                $item.css({
                    top:minHeight + space,
                    left:index * (width + space)
                })

                //当前数组中最小的高度进行新的高度的更新
                colHeightArr[index] = minHeight + space + height;
            }
            //console.log(colHeightArr);
        });

        //设置父容器的高度
        var maxHeight = colHeightArr[0];
        $.each(colHeightArr,function(k,v){
            if(maxHeight < v){
                maxHeight = v;
            }
        });
        //给父容器设置最高的高度
        items.height(maxHeight);
    }
})(jQuery);
```

效果图：

![其余排的布局.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32032d1eb1dd42ffaf73f7db6fabe260~tplv-k3u1fbpfcp-zoom-1.image)


### 第五步
`html`中调用（上面的效果图都是已经调用过的）
```javascript
$(".items").waterfall();
```
但是如果有图片的话，这样调用在网络比较慢的情况下会出现问题。在图片没有加载出来的时候排列，中间图片加载完毕会造成盒子重叠的效果。

解决办法：

```javascript
/*页面上所有的资源都加载完成后进行布局，否则获取不到图片的尺寸撑不开盒子的高度*/
window.onload = function(){
  $(".items").waterfall();
}

//为什么不用jquery的，因为这个是在dom元素下载完毕之后进行加载这个方法，需要等所有的资源加载完之后进行排列
/*   
$(function(){
	//console.log('dom loaded');
});    
*/
```

## 动态渲染
因为数据很多，所以会进行分批次渲染。

原理图：

![数据交互原理图.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6c0d1adb417460396801b7f9f7261b7~tplv-k3u1fbpfcp-zoom-1.image)



> **接口文档：**<br/>
> 接口说明: 瀑布流分页数据<br/>
> 接口地址：data.php<br/>
> 请求方式：get<br/>
> 接口参数：page 当前是第几页<br/>
>          pageSize 当前页要显示多少条<br/>
> 返回类型：json<br/>
> 返回数据：<br/>
> { page:2,items:[{path:"./images/1.jpg",text:'''},...] }<br/>
> <br/>
>	page  下一页的页码（根据页码获取下一页的数据）<br/>
>	items  返回当前页的数据<br/>
>	path  图片地址<br/>
>	text  文字


此时我们要准备好壳子
```html
<div class="container">
    <div class="items">
        <!--TODO 需要渲染数据的地方-->
    </div>
    <div class="btn loading">正在加载中...</div>
</div>
```

#### 需求分析
- 加载第一页的时候
  +  1.加载第一页的数据   `ajax`
  +  2.按钮需要显示成加载更多
  +  3.加载完成渲染到页面当中  `artTemplate`
  +  4.初始化成瀑布流布局   `waterfall`
- 加载下一页的时候 
  +  1.加载数据
      *  手动加载：点击按钮加载下一页的数据
      *   自动加载：滚动到底部的时候主动加载下一页
  +  2.按钮需要显示`“正在加载中...”`不能点击 防止重复提交
  +  3.加载完成渲染到页面当中
  +  4.初始化成瀑布流布局
  +  5.按钮需要显示成加载更多
- 没有更多数据  把按钮禁用  显示`“没有更多数据了”`

#### 渲染第一页数据
##### 发送请求
既然加载页面的时候都会用到加载数据、渲染页面、初始化瀑布流，就把这三个动能封装到一个函数中去,先实现第一个功能：

```javascript
 $(function(){
        //实现动态的瀑布流渲染
      
        //渲染
        var render = function(){
            // 加载数据  渲染页面  瀑布流布局
            $.ajax({
                type:'get',
                url:'data.php',
                data:{
                    //第一页
                    page:1,
                    //每页10条
                    pageSize:10
                },
                dataType:'json',
                success:function(data){
                    console.log(data);
                }
            });
        }

        render();
    });
```

拿到的数据如图：

![data.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f21d76b2d11403890babf675f1742a1~tplv-k3u1fbpfcp-zoom-1.image)

#### 渲染页面
准备模板
```javascript
<script type="text/template" id="template">
    <% for(var i=0 ; i<items.length ; i++){ %>
        <div class="item">
            <img src="<%=items[i].path%>" alt="">
            <p><%=items[i].text%></p>
        </div>
    <% } %>
</script>

<script>
  $(function(){
    //获取需要操作的dom
    var $items = $(".items");
    var $btn = $(".btn");
    //渲染
    var render = function(){
        // 加载数据  渲染页面  瀑布流布局
        $.ajax({
            type:'get',
            url:'data.php',
            data:{
                page:1,
                pageSize:10
            },
            dataType:'json',
            success:function(data){
                console.log(data);
                $items.append(template('template',data));
                //瀑布流布局
                $items.waterfall();
                //更改按钮
                $btn.removeClass('loading').html('加载更多');
            }
        });
    }
    
    render();
  });
</script>
```
#### 第二页面的渲染（手动加载）
第二页需要改变的东西：
1. 添加按钮的点击事件，点击按钮之后就进行渲染。
2. 点击按钮加载的时候，要给按钮加锁，因为不加的话会发送多个`ajax`请求，判断按钮是不是`loading`状态，如果是的话就不渲染数据。
3. `render`函数中，在进行按钮状态改变的时候，用自定义属性记录下来下一页的要获取的页数。利用`data()`，里面传一个`page`,把`data.page`放进去。所以在拿数据的时候，要从按钮的`data`中获取`page`的值。第一次是空的，所以就设定一个默认值为`1`
4. `render`函数中在数据成功加载之前，按钮还是`loading`状态，所以加一个`beforeSend`的函数，里面是`loading`状态。
5. `render`函数中在渲染的时候判断一下是不是没有数据了，根据返回的数组中的长度是不是为零来判断，如果是零的话就显示没有更多数据了。

```javascript
 $(function(){
    //获取需要操作的dom
    var $items = $(".items");
    var $btn = $(".btn");

    //渲染
    var render = function(){
        // 加载数据  渲染页面  瀑布流布局
        $.ajax({
            type:'get',
            url:'data.php',
            data:{
                //取下一页的页码，没有的话就默认是1
                page:$btn.data("page")||1,
                //每页10条
                pageSize:10
            },
            beforeSend:function(){
                $btn.addClass("loading").html('正在加载中...');
            },
            dataType:'json',
            success:function(data){
                console.log(data);
                //准备模板
                //因为是追加所以不能用html，要用append
                        //直接用data的原因是因为data本来就是一个对象，里面有很多的属性，而不是一个数组，数组的话不能这样，因为数据只有length一个属性
                $items.append(template('template',data));
                //瀑布流布局
                $items.waterfall();

                if(data.items.length){
                    //更改按钮
                    //data是一个自定义属性,把数据中传输出来的page保存在自定义属性当中，
                    $btn.data("page",data.page).removeClass('loading').html('加载更多');
                }else{
                    //没有更多数据
                    //判断什么时候就没有数据了，打开最后的一个对象，里面items的数组的长度为零
                    $btn.addClass("loading").html("没有更多数据了");
                }
            }
        });
    }

    //按钮加载
    $btn.on('click',function(){
        //避免发送多个ajax请求，就进行判断，如果是loading状态，就退出，
        if($btn.hasClass("loading")){
            return false;
        }
        render();
    })

    render();
});
```


#### 第二页面的渲染（滚动加载）
说到滚动渲染，就是要我们渲染过的页面到浏览器底部的一定距离就要进行下一次的请求了，这就要进行一个判断了。

原理图：

![Paste_Image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d44b503d3c04c53ad2cc234dbaaf18f~tplv-k3u1fbpfcp-zoom-1.image)

当`bottom < 200px`的时候进行`ajax`请求。

> **其中`bottom`要怎么计算？**<br/>
> bottom = items的高度 + items距离顶部的距离 - 向上卷曲的高度 - 整个浏览器的高度

```javascript
 $(function(){
    //实现动态的瀑布流渲染

    //获取需要操作的dom
    var $items = $(".items");
    var $btn = $(".btn");

    //渲染
    var render = function(){
        // 加载数据  渲染页面  瀑布流布局
        $.ajax({
            type:'get',
            url:'data.php',
            data:{
                page:$btn.data("page")||1,   
                pageSize:10
            },
            beforeSend:function(){
                $btn.addClass("loading").html('正在加载中...');
            },
            dataType:'json',
            success:function(data){
                console.log(data);
                $items.append(template('template',data));
                //瀑布流布局
                $items.waterfall();

                //判断数组中有没有数据
                if(data.items.length){
                 $btn.data("page",data.page).removeClass("loading").html('加载更多');
                }else{
                    $btn.addClass("loading").html("没有更多数据了");
                }
            }
        });
    }

    //滚动加载
    $(window).on('scroll',function(){
        //文档距离底部的距离小于200px 去加载
        //并且加载完成才能继续加载

        //items的高度
        var itemsHeight = $items.height();
        //items距离顶部的偏移量
        var itemsTop = $items.offset().top;
        //整个页面距离顶部的卷曲出去的距离
        var scrollTop = $(document).scrollTop();
        // 浏览器的高度
        var winHeight = $(window).height();
        //  浏览器底部距离items底部的距离
        var bottom = itemsHeight + itemsTop - scrollTop -winHeight;
        //  判断按钮是不是loading状态
        var loading = $btn.hasClass("loading");

        //如果按钮小于200 且 不是loading状态就开始加载
        if(bottom < 200 && !loading){
            render();
        }
    })

    render();
});
```

## 需要特别注意的问题
之前我们在静态加载页面的时候使用的是`window.onload`，是为了让页面上的资源全部加载完成之后再进行页面的渲染。否则就会产生页面重叠的现象。

在动态加载页面的时候，我们先拿到后台的数据，然后转化成`html`追加到页面上之后，才开始加载`img`图片。这里也遇到了之前的问题。

之所以后面没有用`window.onload`那样的做，是因为原本设置的图片已经设定可宽和高。`img`有的设定了`250px`，有的设定了`450px`。
但是这样做不合理，因为有的图片会变形。

**下面提供解决问题的方法：**
1. 等所有的图片加载完成进行页面渲染，但是这样时间会比较长，不合理。
2. 参考花瓣

花瓣在加载图片的时候也进行了宽高的设定，但是这个大小要根据原图片的尺寸进行大小的缩放。

![huaban.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0236ab1059d4441892ff56e30d2a363~tplv-k3u1fbpfcp-zoom-1.image)

原来的尺寸是`608`，现在的宽度是`200`，那么现在的高度就进行一个换算

> 现在的高度 = 200 / 806 * 782
>
> `width` 是现在的宽度

```javascript
// 模板引擎中写
<img height = "<%=items[i].width * items[i].height / width%>" src = "<%=items[i].path%>" />
/*  
同样在ajax的success中
$items.append(
    template('template',{
        data:data,
        width:width
    })
);
这样width变量就可以使用了。
*/
```

这样瀑布流就完成了.

