通过配置项，我们可以决定开启或关闭某些功能。

## name
- Desc: `应用名称`
- Type: `string`
- Default: `必传参数`
- 使用方式: `<micro-app name='xx'></micro-app>`

`name`为必传参数，需要确保每个应用的`name`值是全局唯一的。

当`name`的值发生变化时，会卸载当前应用并重新渲染。

## url
- Desc: `应用地址`
- Type: `string`
- Default: `必传参数`
- 使用方式: `<micro-app name='xx' url='xx'></micro-app>`

`url`只作为加载资源的地址，不会对子应用造成影响，子应用的locaiton和此值无关。

当`url`的值发生变化时，会卸载当前应用并根据新的`url`值重新渲染。

## baseurl
- Desc: `子应用的路由前缀`
- Type: `string`
- Default: `''`
- 使用方式: `<micro-app name='xx' url='xx' baseurl='/my-page/'></micro-app>`

在微前端环境下，子应用可以从window上获取baseurl的值，用于设置路由前缀。

以react-router为例，在子应用的路由中配置`basename`：
```js
<BrowserRouter basename={window.__MICRO_APP_BASE_URL__ || '/'}>
  <Switch>
    ...
  </Switch>
</BrowserRouter>
```

## inline
- Desc: `是否使用内联script`
- Type: `string(boolean)`
- Default: `'false'`
- 使用方式: `<micro-app name='xx' url='xx' inline></micro-app>`

默认情况下，子应用的js会被提取并在后台运行。

开启inline后，被提取的js会作为script标签插入应用中运行，在开发环境中更方便调试。

> [!TIP]
> 开启inline后会稍微损耗性能，一般在开发环境中使用。

## destory
- Desc: `卸载时是否强制删除缓存资源`
- Type: `string(boolean)`
- Default: `'false'`
- 使用方式: `<micro-app name='xx' url='xx' destory></micro-app>`

默认情况下，子应用被卸载后会缓存静态资源，以便在重新渲染时获得更好的性能。

开启destory，子应用在卸载后会清空缓存资源，再次渲染时重新请求数据。

## disableScopecss
- Desc: `禁用样式隔离`
- Type: `string(boolean)`
- Default: `'false'`
- 使用方式: `<micro-app name='xx' url='xx' disableScopecss></micro-app>`

在禁用样式隔离前，请确保基座应用和子应用，以及子应用之间样式不会相互污染。

> [!NOTE]
> 禁用样式隔离，css中的静态资源补全功能失效，请设置__webpack_public_path__，详情请看[静态资源](/zh-cn/static-source)一章

## disableSandbox
- Desc: `禁用js沙箱`
- Type: `string(boolean)`
- Default: `'false'`
- 使用方式: `<micro-app name='xx' url='xx' disableSandbox></micro-app>`

禁用沙箱可能会导致一些不可预料的问题，通常情况不建议这样做。

> [!NOTE]
> 禁用沙箱的副作用:
> 
> 1、样式隔离失效
>
> 2、元素隔离失效
> 
> 3、数据通信功能失效
>
> 4、静态资源地址补全功能失效
>
> 5、插件系统失效
>
> 6、`__MICRO_APP_ENVIRONMENT__`、`__MICRO_APP_PUBLIC_PATH__`等全局变量失效
>
> 7、baseurl失效

## macro
- Desc: `以宏任务方式绑定元素作用域`
- Type: `string(boolean)`
- Default: `'false'`
- 使用方式: `<micro-app name='xx' url='xx' macro></micro-app>`

在一些场景下(如react-router生产环境、vue3)，可能出现元素无法绑定当前子应用的现象，导致样式丢失和资源补全功能失效。

开启macro可以有效避免这个问题，但macro在解绑作用域是高延迟的，有可能导致基座应用频繁切换路由时产生问题，此时可以在路由跳转前[主动解除元素作用域绑定](/zh-cn/dom-scope?id=主动解除元素作用域绑定)。

## shadowDOM
- Desc: `是否开启shadowDOM`
- Type: `string(boolean)`
- Default: `'false'`
- 使用方式: `<micro-app name='xx' url='xx' shadowDOM></micro-app>`

shadowDOM具有更强的样式隔离能力，开启后，`<micro-app>`标签会成为一个真正的WebComponent。

但shadowDOM在React16及以下、vue3中的兼容不是很好，请谨慎使用。


## 全局配置
全局配置会影响每一个子应用，上述几个选项都可以配置到全局。

**使用方式**

只在入口文件定义一次，不要多次定义。
```js
import microApp from '@micro-zoe/micro-app'

microApp.start({
  inline: true, // 默认值false
  destory: true, // 默认值false
  disableScopecss: true, // 默认值false
  disableSandbox: true, // 默认值false
  macro: true, // 默认值false
  shadowDOM: true, // 默认值false
})
```

如果希望在某个应用中不使用全局配置，可以单独配置关闭：
```html
<micro-app 
  name='xx' 
  url='xx' 
  inline='false'
  destory='false'
  disableScopecss='false'
  disableSandbox='false'
  macro='false'
  shadowDOM='false'
></micro-app>
```

## 其它配置
### exclude
如果子应用的一些静态资源不希望被基座应用加载并渲染，可以在标签上添加`exclude`属性进行过滤。

**使用方式**
```html
<link rel="stylesheet" href="xx.css" exclude>
<script src="xx.js" exclude></script>
<style exclude></style>
```

### global
当多个子应用使用相同的js或css资源，在link、script设置`global`属性会将文件提取为公共缓存。

设置`global`后文件第一次加载会放入公共缓存，其它子应用加载相同的资源时直接从缓存中读取内容并渲染，从而提升性能、节省流量。

**使用方式**
```html
<link rel="stylesheet" href="xx.css" global>
<script src="xx.js" global></script>
```
