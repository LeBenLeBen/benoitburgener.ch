---
layout: post
title:  "Organize your declarations"
date:   2014-09-01 08:00:00
---

Working in a large frontend environement forces you to take care of each line of CSS you write. You reuse the code as much as possible by abstracting it and avoiding creating new classes.

But something you can’t avoid, is writing less declarations. If you want your button to have a certain style, you need to add the according properties; sometimes 2, sometimes 10. The more you have, the more it’s hard to read and maintain. However, you can organize them.

Look at this code from a project I had to work on recently for example:

```css
.foo {
  font-family: "GillSansStdLight";
  position: absolute;
  left: 0;
  text-align: center;
  display: block;
  color: #2B2B2B;
  font-size: 144px;
  z-index: 0;
  width: 100%;
}
```

If you’re interested in one part of the styling, let say the font, you will have to scan all the lines because these declarations are scattered in the whole block.

Now suppose we group them by categories:

```css
.foo {
  display: block;
  width: 100%;

  position: absolute;
  left: 0;
  z-index: 0;

  font-family: "GillSansStdLight";
  font-size: 144px;
  text-align: center;
  color: #2B2B2B;
}
```

Much better, isn’t it? I got used to this method in all my projects and I stopped wasting time looking for a declaration since then. Here’s a more complete example with various properties and comments.

```scss
.foo {
  // The box
  display: block;
  width: 100px;
  height: 100px;
  margin: 10px;
  padding: 10px;

  // Positioning
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;

  // Typeface
  font-family: 'Helvetica', sans-serif;
  font-size: 1.2em;
  font-weight: bold;
  color: white;

  // Styling
  background-color: red;
  border: 1px solid blue;
  border-radius: 3px;
  cursor: pointer;

  // All other properties
  pointer-events: none;
}
```

### Edit

As pointed out by [Emmanuel](https://twitter.com/maiis/status/506394722915856384), you can use [CSScomb](https://github.com/csscomb) to batch process an existing project.