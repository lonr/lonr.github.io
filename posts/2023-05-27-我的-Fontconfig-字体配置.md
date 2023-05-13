---
tags: [Fontconfig, Linux]
---

> [Fedora 38 使用了 Noto CJK 的可变字体](https://fedoraproject.org/wiki/Changes/Noto_CJK_Variable_Fonts)，遇到了一些字体问题，所以又看了一下之前写的 [Fontconfig 配置](./2020-11-19-Fontconfig-%E8%AE%BE%E7%BD%AE%E5%B0%9D%E8%AF%95.md) ~~并总结一下~~太长了，不想看。

## 我的配置

我的设想是和安卓系统的默认字体基本一致：

| Lang \ Generic | `sans-serif` & `system-ui` | `serif`           | `monospace`           |
| -------------- | -------------------------- | ----------------- | --------------------- |
| Latin          | Roboto                     | Noto Serif        | Fira Code             |
| CJK            | Noto Sans CJK SC           | Noto Serif CJK SC | Noto Sans Mono CJK SC |
| Emoji          | Noto Color Emoji           | Noto Color Emoji  | Noto Color Emoji      |

最终配置 `~/.config/fontconfig/conf.d/60-preferable.conf`：

```xml
<?xml version="1.0" ?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>

  <alias binding="same">
    <family>cursive</family>
    <accept>
      <family>sans-serif</family>
    </accept>
  </alias>

  <alias binding="same">
    <family>system-ui</family>
    <accept>
      <family>ui-sans-serif</family>
    </accept>
  </alias>

  <alias binding="same">
    <family>ui-sans-serif</family>
    <accept>
      <family>sans-serif</family>
    </accept>
  </alias>

  <alias binding="same">
    <family>ui-serif</family>
    <accept>
      <family>serif</family>
    </accept>
  </alias>

  <alias binding="same">
    <family>ui-monospace</family>
    <accept>
      <family>monospace</family>
    </accept>
  </alias>

  <alias binding="same">
    <family>sans-serif</family>
    <prefer>
      <family>Roboto</family>
      <family>Noto Sans CJK SC</family>
      <family>emoji</family>
    </prefer>
  </alias>

  <alias binding="same">
    <family>Roboto</family>
    <accept>
      <family>Noto Sans CJK SC</family>
      <family>emoji</family>
      <family>sans-serif</family>
    </accept>
  </alias>

  <alias binding="same">
    <family>Noto Sans CJK SC</family>
    <prefer>
      <family>Roboto</family>
    </prefer>
    <accept>
      <family>emoji</family>
      <family>sans-serif</family>
    </accept>
  </alias>

  <alias binding="same">
    <family>serif</family>
    <prefer>
      <family>Noto Serif</family>
      <family>Noto Serif CJK SC</family>
      <family>emoji</family>
    </prefer>
  </alias>

  <alias binding="same">
    <family>Noto Serif</family>
    <accept>
      <family>Noto Serif CJK SC</family>
      <family>emoji</family>
      <family>serif</family>
    </accept>
  </alias>

  <alias binding="same">
    <family>Noto Serif CJK SC</family>
    <prefer>
      <family>Noto Serif</family>
    </prefer>
    <accept>
      <family>emoji</family>
      <family>serif</family>
    </accept>
  </alias>

  <alias binding="same">
    <family>monospace</family>
    <prefer>
      <family>Fira Code</family>
      <family>Noto Sans Mono CJK SC</family>
      <family>emoji</family>
    </prefer>
  </alias>

  <alias binding="same">
    <family>Fira Code</family>
    <accept>
      <family>Noto Sans Mono CJK SC</family>
      <family>emoji</family>
      <family>monospace</family>
    </accept>
  </alias>

  <alias binding="same">
    <family>Noto Sans Mono CJK SC</family>
    <prefer>
      <family>Fira Code</family>
    </prefer>
    <accept>
      <family>emoji</family>
      <family>monospace</family>
    </accept>
  </alias>
</fontconfig>
```

大概作用是：

- 给每个字体族设置好优先级，例如：在应用或 Tweaks 中设置字体为 `sans-serif`，会依次尝试 `Roboto, "Noto Sans CJK SC", "Noto Color Emoji"`
- 给 Web 规范中的 `ui-sans-serif` 这些字体族设置好 fallback
- 设置一种字体的情况下会补全 fallback，例如：设置字体为 `Noto Serif CJK SC` 时会补全为 `Roboto, "Noto Sans CJK SC", "Noto Color Emoji"`

## 目标

当初之所以捣鼓配置是因为：

1. 把系统语言设置为英语后，系统不知道 CJK 用户想用哪种汉字（中？日？韩？）来渲染中文，不巧的是系统选择使用了日本汉字
2. 顺便设置系统字体 fallback，比如：设置 `sans-serif` 字体为 `Roboto, "Noto Sans CJK SC", "Noto Color Emoji"`
3. 顺便为 Chrome 配置和 2. 类似的字体

> 最后发现“顺便”其实是个坑

## 现实

实际上以上配置可以解决一些问问题，但是解决不了所有问题：

- 不要想着使用 Fontconfig 来配置 Chrome 的字体：
  - 网页作者设置了一些 `font-family`，优先级最高（其实我无所谓，这是作者设计的一部分，虽然有时候在 Linux 下的效果可能不如不设置）
  - Chrome 自带的字体设置只是网页设置的 fallback，所以基本没有用（除非网页没有设置字体）
  - [Advanced Font Settings](https://chrome.google.com/webstore/detail/advanced-font-settings/caclkomlalccbpcdllchkeecicepbmbm) 可以基于 `lang` 设置字体，但作用也有限（没记错的话也是 fallback）
  - Chrome 使用了 Fontconfig，但是没有完全使用。导致 Fontconfig 大部分配置不起作用
  - 最近发现网友们的[吐槽](https://www.v2ex.com/t/853093)
  - 最好的解决方案是写一个扩展来配置，有空我会做一个
  - [servo/font-kit](https://github.com/servo/font-kit) 大概才是浏览器正确的使用字体的方式
- 在 Fedora 中安装（或预装）一些字体时会附带 Fontconfig 配置，这些配置可能会起反效果
  - 所以发现渲染的字体不是自己配置好的时候，一种选择是卸载这款字体

可以想到的另一种字体设置方式是学习 [Nerd Fonts](https://www.nerdfonts.com/)——从其他字体抽出想要的 latin、中文、Emoji 字体，然后合并为一个。（只是想想）

## 开头遇到的字体问题（未解决）

自从更新到 Fedora 38 后，有一个 Appimage 打包的 Electron 应用的中文字体不显示了，找到一些类似情况：

- [flatapk 和 AppImage 打包的 Wine 应用中文变方框了，怎么解决？](https://s.v2ex.com/t/935160)
- [Since updating to Fedora 38, Japanese fonts no longer work properly in multiple apps](https://www.reddit.com/r/Fedora/comments/1385372/since_updating_to_fedora_38_japanese_fonts_no/)

原因是 [Fedora 38 更新了 Noto CJK 的字体](https://fedoraproject.org/wiki/Changes/Noto_CJK_Variable_Fonts)，从静态字体到可变字体（大概是通过变量控制字体变化（自重、倾斜），灵活且减少了字体大小），删除了我自定义配置中相关的配置就好了。

但具体原因未知，按道理不是我配置的问题，可能的其他解决方案：

- 卸载新字体，安装回旧字体
- 调整 Fontconfig，比如单独给这个应用加一个规则

先不折腾了，坐等上游解决
