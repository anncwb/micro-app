预加载是指在应用尚未渲染时提前加载资源并缓存，从而提升首屏渲染速度。

预加载并不是同步执行的，它会在浏览器空闲时间执行，以确保不会影响基座应用的性能。

### microApp.preFetch(Array\<app\> | Function => Array\<app\>)
preFetch接受app数组或一个返回app数组的函数，app的值如下：

```js
app: {
  name: string, // 应用名称，必传
  url: string, // 应用地址，必传
  disableScopecss?: boolean // 是否关闭样式隔离，非必传
  disableSandbox?: boolean // 是否关闭沙盒，非必传
  macro?: boolean // 是否以宏任务方式绑定元素作用域，非必传
  shadowDOM?: boolean // 是否开启shadowDOM，非必传
}
```

### 使用方式
```js
import microApp from '@micro-zoe/micro-app'

microApp.preFetch([
  { name: 'my-app', url: 'xxx' }
])

// 或者
microApp.preFetch(() => [
  { name: 'my-app', url: 'xxx' }
])

// 或者
microApp.start({
  preFetchApps: [
    { name: 'my-app', url: 'xxx' }
  ],
  // 函数类型
  // preFetchApps: () => [
  //   { name: 'my-app', url: 'xxx' }
  // ],
})
```

> [!NOTE]
> 预加载入参：`disableScopecss`、`disableSandbox`、`macro`、`shadowDOM` 必须和 `<micro-app>`[配置项](/zh-cn/configure)保持一致。如果产生冲突，以先执行的一方为准。
> 
