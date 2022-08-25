# vue-style-extractor README
### what problem does this extension solve?
Sometimes you might assume the style of one element is simple and just wrote it inline, but finally it grow into a great mess, like the code blow:
```
<div
  style="
width:100%;height:100%;background-color: rgba(0.3,0.3,0.3,0.3);
position:absolute;left:0px;top:0px;display:flex;
align-items: center;justify-content: center;
color:white;font-size:16px;"
>
  balabala
</div>
```

After installing this extension, you just select the whole div tag and press `F1`, input `extract style`, then input the new selector, like `.button-wrap > #btn1`, and the style will be extracted into `<style>` tag, the original element will get a property `id="btn1"`.

![Preview](https://user-images.githubusercontent.com/6017664/186410910-b90257bd-bbbd-4bc1-877e-db67826cf55f.gif)
### todo-lists:
- [ ] support UnoCSS attributed class
- [ ] i18n