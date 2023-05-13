---
tags: [Note, Draft]
---

UPDATE：昨天升级到了 Fedora 36，GNOME Shell 和 大部分内置应用（因为使用了 GTK 4）主题失效了，所以得更新一下

比较喜欢 VS Code 里的 [One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme) 主题，所以在维护[一份 One Dark 配色的 Adwaita 主题（GNOME 默认主题）](https://github.com/lonr/adwaita-one-dark)

GNOME 的主题是使用 SCSS 写的，而且本质上只需要修改其中几个颜色值。但我想做成一个提供 accent、bg 颜色和 terminal palette 后生成多种软件主题的 monorepo

## Monorepo

UPDATE 2023-05-14: 现在使用了 pnpm 和自带的 [workspace](https://pnpm.io/pnpm-workspace_yaml) 和 TurboPack（貌似就多了一个缓存功能）；Node 版本也使用 [pnpm env](https://pnpm.io/cli/env) 管理（[虽然全局包在删除 Node 版本后有 bug](https://github.com/pnpm/pnpm/issues/6122)）

`dnf` -> `zsh` -> `zinit` -> `zsh-nvm` -> `nvm` -> `node` -> `npm` -> `corepack` -> `pnpm` -> `rush` 😅

nvm 会隔离全局的 npm 包，而 `pnpm install -g` 的话安装路径没有隔离，感觉全局包使用 npm 安装好一点？

参考 monorepo.tools

---

尝试使用了一下：

- pnpm 真不错
- heft 确实 opinionated
  - 想要添加一个编译 SCSS 的任务，好像得写 plugin
- tsc 和 Webpack 比较慢

## Material Palette 生成工具

- Material 主题生成器工具 [Material color utilities](https://github.com/material-foundation/material-color-utilities)
  - HCT 的色彩空间是工具的核心，见 [The Science of Color & Design](https://material.io/blog/science-of-color-design)
  - 使用此工具的项目：
    - [vscode-dynamic-theme](https://github.com/rodydavis/vscode-dynamic-theme)
    - [canisminor-colors](https://github.com/canisminor1990/canisminor-colors)
- Material 的[主题生成器](https://material-foundation.github.io/material-theme-builder/#/custom)
- 旧的 [Color palettes](https://material.io/inline-tools/color/)

---

Material 工具生成的原始主题有一些问题：

工具输入 Accent（Primary） color，生成其他所有颜色

- 生成的 primary 颜色和 accent 颜色不一致（因为自动生成的颜色 tone 是固定的）
- 自动生成的颜色没法满足暗色主题自定义背景颜色的需求

所以：

1. 参考 Material 的命名规则：`primary.dark.color`、`neutral.dark.background`、`error.dark.background`
2. 参考 Material 和 Adwaita 的

## Primer Primitives

[Primer Primitives](https://github.com/primer/primitives) 是 Primer design system 的原始值（比如 palette），可以被不同应用的主题使用（比如 primer/css、primer/react、github-vscode-theme）

另见：

- [primer/github-vscode-theme](https://github.com/primer/github-vscode-theme/blob/main/package.json)

## Terminals

发现 terminal.sexy（通过它开源的 [termcolors](https://github.com/stayradiated/termcolors)）可以生成各种终端的主题

## One Dark 主题

Atom 的[原版 One Dark 主题定义的颜色](https://github.com/atom/atom/blob/master/packages/one-dark-syntax/styles/colors.less)更少，因为 Atom 没有自带 terminal

VS Code 主题 [OneDark-Pro](https://github.com/Binaryify/OneDark-Pro/blob/master/themes/OneDark-Pro.json) 里可以找到 ANSI 16 色

## 关于颜色和设计规范

不同的设计规范定义了各自的颜色 palette，因为主要生成开发者工具的主题，所以我感觉我只需要 ANSI 颜色

ANSI：

- ANSI 使用 black red green yellow blue magenta cyan white
- Tilix 使用 black red green orange blue purple turquoise grey
- [Terminal Colors](https://chrisyeh96.github.io/2020/03/28/terminal-colors.html)，16 色的颜色名倒是无所谓

[libadwaita](https://gnome.pages.gitlab.gnome.org/libadwaita/doc/main/named-colors.html) 使用 [GNOME color palette](https://developer.gnome.org/hig/reference/palette.html)，Yaru 也定义了这些颜色，所以我修改的 GNOME 主题应该也得定义这些颜色

GNOME 使用 blue green yellow orange red purple brown light dark。有几个颜色和 ANSI 对不上而且每种颜色都有 5 阶（我不懂颜色，名词可能用错，下同）

- [颜色的知识色彩关系色彩理论](https://www.bilibili.com/video/BV1nx411p7s1)
- [什么是色彩模型 (理解色彩空间的基础)](https://www.bilibili.com/video/BV13i4y1G79c?)
- [Color and Perception](https://www.bilibili.com/video/BV1X7411F744?p=20)

参考一些规范：

- [GNOME](https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/named-colors.html#named-colors)
- [Primer](https://primer.style/primitives/colors)
- [Material](https://m3.material.io/styles/color/the-color-system/key-colors-tones)
- [Dracula](https://spec.draculatheme.com/#sec-Interpreting-this-specification)]
- [iOS](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/color/)

一些应用：

- [vscode-dynamic-theme](https://github.com/rodydavis/vscode-dynamic-theme)

## GTK 主题

### GTK 3

[adw-gtk3](https://github.com/lassekongo83/adw-gtk3) 这个移植 libadwaita 为 GTK 3 主题，直接基于这个项目修改

另见：

- [Yaru](https://github.com/ubuntu/yaru)
- [The Need for a FreeDesktop Dark Style Preference](https://www.youtube.com/watch?v=gi_3b81eBUE)，也总结了各个平台的黑色主题
- 一些其他实现：
  - [adwaita-color-gen](https://github.com/Gnostiphage/adwaita-color-gen)，更改 accent color 并生成主题
  - [Themix project](https://github.com/themix-project)，Materia 和 Oomox 颜色变体生成器
  - [Personalize](https://extensions.gnome.org/extension/4010/personalize/)，Accent color 修改扩展
  - [gtk-theme-config](https://github.com/satya164/gtk-theme-config)，修改主题和 accent color，一个十年前的工具
- 可以参考 Manjaro 的 [adwaita-maia](https://gitlab.manjaro.org/packages/community/themes/adwaita-maia) 和 [AdwMod](https://gitlab.com/hrdwrrsk/AdwMod-theme)
- [The FACTS about GNOME’s plans for THEMES](https://www.youtube.com/watch?v=Pdx_MwcMtnM)
- [Style & Appearances - libadwaita](https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/styles-and-appearance.html#styles-appearance)

### GTK 4 和 libadwaita

GTK 4（具体由 Libadwaita 提供）将支持 [Recoloring for everything](https://gitlab.gnome.org/GNOME/libadwaita/-/merge_requests/304)，我的理解是类似于 [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)（`--bg-color`）——修改能在运行时生效

还不是很明白，不过已知可以 link `~/.config/gtk-4.0/` 到 `~/.local/share/themes/Adwaita-One-Dark/gtk-4.0` 或者 `GTK_THEME=Adwaita-One-Dark` 来应用 GTK 4 主题

参考：

- [The Truth they are not telling you about “Themes”](https://blogs.gnome.org/alatiera/2021/09/18/the-truth-they-are-not-telling-you-about-themes/)
- [Introducing Libadwaita](https://aplazas.pages.gitlab.gnome.org/blog/blog/2021/03/31/introducing-libadwaita.html)
- [What’s the Fuss About GNOME’s Libadwaita Library in Linux World?](https://news.itsfoss.com/gnome-libadwaita-library/)
- [Why is not libadwaita merged into gtk4?](https://discourse.gnome.org/t/why-is-not-libadwaita-merged-into-gtk4/9739)

### GNOME Shell 和 GTK 主题

[GTK](https://gitlab.gnome.org/GNOME/gtk) 应用和 [Shell](https://gitlab.gnome.org/GNOME/gnome-shell/) 的主题文件由 SCSS 编译而成，组件使用的各种颜色是由几个基础颜色（`$bg_color`、`$base_color`、`selected_bg_color`）衍生（通过 `darken` 等）而来的，因此可以比较方便地修改

但目前（GTK 3）编译后 CSS 中的颜色是硬编码的，修改配色就需要重新编译 SCSS

我可能不需要制作 GTK 4 主题，只提供一份 palette 就好。整个项目的意义主要在于其他主题

编写模板的时候最讨厌的是 SVG 图片，不知道 GTK 4 怎么解决这个问题的

## GTK 主题相关工具和文档

- `GTK_DEBUG=interactive gtk3-widget-factory`
- awf-gtk4 等
- [GtkInspector](https://wiki.gnome.org/Projects/GTK+/Inspector)，类似浏览器的 inspector 工具
- [Color Picker](https://extensions.gnome.org/extension/3396/color-picker/)，Wayland 下可用的颜色拾取
- [GTK Theming Tutorial](https://wiki.gnome.org/Attic/GnomeArt/Tutorials/GtkThemes)
- [Migrating Themes from GTK 2.x to GTK 3](https://docs.gtk.org/gtk3/migrating-themes.html)
- [Widget Factory for gtk2 on Arch/Manjaro?](https://forum.manjaro.org/t/widget-factory-for-gtk2-on-arch-manjaro/73140) / [luigifab/awf-extended](https://github.com/luigifab/awf-extended)
- [Introducing Libadwaita](https://aplazas.pages.gitlab.gnome.org/blog/blog/2021/03/31/introducing-libadwaita.html)
- [Libadwaita 1.0](https://blogs.gnome.org/alexm/2021/12/31/libadwaita-1-0/)
- [Named Colors](https://gnome.pages.gitlab.gnome.org/libadwaita/doc/main/named-colors.html)
- [A Coloring API for GTK](https://adrienplazas.com/blog/2020/04/02/coloring-api.html)
- [Draft: Add AdwColorTheme for recoloring API](https://gitlab.gnome.org/GNOME/libadwaita/-/merge_requests/369)
- [Recoloring for everything](https://gitlab.gnome.org/GNOME/libadwaita/-/merge_requests/304)

### `.gresource`

已知选择对应主题的情况下 `~/share/themes/NAME/gtk-3.0/gtk.gresource` 会被加载

而 GNOME Shell theme 是由 [user theme 扩展](https://gitlab.gnome.org/GNOME/gnome-shell-extensions/-/blob/main/extensions/user-theme/extension.js#L52)更换的，似乎没有加载 `gnome-shell-theme.gresource`；系统 Adwaita 的资源有被加载

参考：

- [Building a binary for GTK3 theme](https://web.archive.org/web/20170501023949/https://wibblystuff.blogspot.com/2012/06/building-binary-for-gtk3-theme.html)

### Qt 等其他主题

- 对于非 GTK 3 应用有 [`adwaita-qt`](https://github.com/FedoraQt/adwaita-qt)、[`adwaita-gtk2-theme`](https://gitlab.gnome.org/GNOME/gnome-themes-extra) 等项目，但我无从下手 😭️

## Gedit 和 Sushi

GNOME 自带的编辑器 Gedit 和空格键预览 [Sushi](https://gitlab.gnome.org/GNOME/sushi) 共用一样的语法高亮配置文件  
最好修改高亮规则和 VS Code 统一

- Gedit
  1. 下载一个 One Dark 的 [Gtk Source Style](https://libraries.io/github/isdampe/gedit-gtk-one-dark-style-scheme)，添加并选择
  2. 通过 Gedit 的设置添加，会保存在 `~/.local/share/gedit/styles`
  3. 或者手动添加到 `/home/lonr/.local/share/gtksourceview-4/styles` 里
  4. 或者手动添加到 `/usr/share/gtksourceview-4/styles` 里
- Sushi 使用同样格式的配置文件，不过优先搜索 `/usr/share/sushi/gtksourceview-4/styles/` 目录下 `style-scheme` 标签 `id` 属性为 `builder-dark` 的主题。默认会命中自带的主题文件
  - 复制一份上面下载的文件修改 `id="builder-dark"` 替换掉 `/usr/share/sushi/gtksourceview-4/styles/` 里的那个
  - 如果主题文件放在了共享配置文件里（3. 和 4.），也可以修改 `id="builder-dark"` 后删除掉 `/usr/share/sushi/gtksourceview-4/styles/` 里的那个
  - 每次更新 Sushi 后都要设置一次
  - [Sushi 相关代码](https://github.com/GNOME/sushi/blob/75f2ca211e94e199a57c803f7e7ce51f2f85c040/src/viewers/text.js#L64-L72)、[相关函数文档](https://lazka.github.io/pgi-docs/GtkSource-3.0/classes/StyleSchemeManager.html#GtkSource.StyleSchemeManager.prepend_search_path)、[配置文件优先级](https://wiki.gnome.org/Projects/GtkSourceView/StyleSchemes)
- [Sushi 没有使用系统主题的配色](https://gitlab.gnome.org/GNOME/sushi/-/issues/4)
- [语法高亮](https://gitlab.gnome.org/GNOME/sushi/-/issues/24)
- [GtkSourceView style schemes](https://wiki.gnome.org/Projects/GtkSourceView/StyleSchemes)
- [Schemes](https://gitlab.gnome.org/chergert/schemes), a GtkSourceView style schemes creator

## Tilix 和 fish 和 Zsh

[Gist](https://gist.github.com/lonr/6c6081fbcdc23c8b35f0d32cd06b2ba6) 配置文件

分别：

1. `onedark.json` 是 [Tilix Theme](https://gnunn1.github.io/tilix-web/manual/themes/)，放到 `~/.config/tilix/schemes/`
2. `prompt.fish` 基于 `Screen Savvy` prompt 样式修改了配色，放在 `~/.config/fish/conf.d/` 里，fish 自动加载
3. `sethighlight.fish` 设置 Fish One Dark 配色，运行一次 `./sethighlight.fish`

之前写了个 Zsh 主题 [ghoti](https://github.com/lonr/ghoti)，里面的颜色值使用的是预设 16 色（没有写死）。修改 Tilix 颜色后发现和 VS Code 终端配色不同，感觉是 One Dark Pro 或 VS Code 的问题（其实早就发现 VS Code 终端高亮和代码高亮颜色不同：更亮）。相关 issues：

- [Terminal colors are different (lighter) after upgrading to macOS Catalina](https://github.com/microsoft/vscode/issues/83130)）
- [Too shiny terminal output](https://github.com/Binaryify/OneDark-Pro/issues/547)

## Visual Studio Theme

有一个官方的工具 [Bring VS Code themes to Visual Studio 2022!](https://devblogs.microsoft.com/visualstudio/vs-code-themes-in-vs/)

## Misc

### Monochromatic

使用 Material 的工具修改 tone 就可以了

---

[Monochromatic colors](https://en.wikipedia.org/wiki/Monochromatic_color) 指同样 hue 的一组颜色，可以通过对单一颜色 [Tint, shade and tone](https://en.wikipedia.org/wiki/Tint,_shade_and_tone) 获得。一番搜索后发现：

- [Tint & Shade Generator](https://github.com/edelstone/tints-and-shades) 这个工具使用的公式：
  - Tints: `New value = current value + ((255 - current value) x tint factor)`
  - Shades: `New value = current value x shade factor`
- [Ant Design 色板生成算法演进之路](https://juejin.cn/post/6844903543321657351)：
  - v1 参考另一种 [Tint and Shade Functions](https://css-tricks.com/snippets/sass/tint-shade-functions/)，tints 算法和上面的不一致（目测 tints 时会改变 hue）
  - v2 最复杂
  - v3 直接调整 HSV 中的 V 值。TinyColor 的 [`monochromatic`](https://github.com/bgrins/TinyColor/blob/2322a1a70a0cd075b98829d67dbd90228abebab4/tinycolor.js#L681) 也是直接调整 V 的
- StackOverflow [这篇回答](https://stackoverflow.com/a/31325812/5783347)提到还可以直接调整 HSL 的 Lightness。SCSS 的 lighten 和 darken 也是这样的
- 发现 Chroma.js 作者有一个 [vis4.net/palettes](https://github.com/gka/palettes) 工具
  - Chroma 的 darken 用的是 lab 空间

### VS Code(Electron) 和 Chrome 的颜色显示问题

取色器取 VS Code 的颜色时发现和主题里写的不一致，和之前遇到的 Chrome 颜色问题一样，需要强制使用 `sRGB`：

```sh
# 对 Chrome，打开 chrome://flags/；搜索 force color profile 选择 sRGB

code --force-color-profile=srgb
# ⬇️ 正常的警告
# Warning: 'force-color-profile' is not in the list of known options, but still passed to Electron/Chromium.
```

另见：

- [Electron and Webkit browsers display wrong colors](https://stackoverflow.com/questions/67318677/electron-and-webkit-browsers-display-wrong-colors)
- [Add a setting to support RGB color profile chosen by OS #65816](https://github.com/microsoft/vscode/issues/65816)
- [Where is the location of application shortcuts in Gnome?](https://askubuntu.com/questions/747118/where-is-the-location-of-application-shortcuts-in-gnome)

## 希望有朝一日我能搞明白 GTK 主题设置

影响因素太多了

一些信息：

- GTK 2 主题在 `~/.themes` 下有效，但在 `~/.local/share/themes` 下无效，[见](https://github.com/jnsh/arc-theme/blob/master/INSTALL.md#note-about-installation-in-users-home-directory)
- GNOME 自带 GTK 4 应用使用 libadwaita，所以 `themes/gtk-4.0` 的主题无效，[见](https://bbs.archlinux.org/viewtopic.php?pid=2030402#p2030402)
  - 使用 GTK 4 但未使用 libadwaita 的应用应该可以利用 `themes/gtk-4.0` 的主题
  - 设置环境变量 `GTK_THEME=Adwaita-One-Dark:dark gnome-calculator` 有效，[见](https://docs.gtk.org/gtk4/running.html#gtk_theme)，[见](https://www.reddit.com/r/swaywm/comments/qodk20/comment/hjnglha/?utm_source=share&utm_medium=web2x&context=3)
  - `~/.config/gtk-4.0/gtk.css` 会被加载，所以可以 link 到 `~/.local/share/themes/Adwaita-One-Dark/gtk-4.0/gtk.css`，[见](https://news.ycombinator.com/item?id=28940373)
  - `gsettings set org.gnome.desktop.wm.preferences theme` 这个是废弃且无效的，[见](https://github.com/GNOME/gsettings-desktop-schemas/blob/1d83f6e5a23451bcc7865f0882c639c7eb4c9c11/schemas/org.gnome.desktop.wm.preferences.gschema.xml.in#L176-L183)
- 暗色主题设置，[见](https://askubuntu.com/a/882515)：
  - `~/.config/gtk-4.0/settings.ini`（还有 3.0）中的 `gtk-application-prefer-dark-theme = 1` 有用？
  - `gsettings set org.gnome.desktop.interface color-scheme prefer-dark` 等价于设置里选择 `Dark`
    - 对有些（官方）GTK 3 应用有效，对如 Tilix 无效
  - 最简单的做法是复制 `gtk-dark.css` 为 `gtk.css`，缺点是无法切换
- `index.theme` 很可能没用，[见](https://askubuntu.com/questions/867050/where-to-find-index-theme-specification-for-gtk-theme)
- 如何打包 `gresource`

[[Gimp-user] How to design new GIMP themes from scratch](https://mail.gnome.org/archives/gimp-user-list/2013-February/msg00038.html)

[Widget Factory for gtk2 on Arch/Manjaro?](https://forum.manjaro.org/t/widget-factory-for-gtk2-on-arch-manjaro/73140)

[Telegram](https://github.dev/desktop-app/lib_ui/blob/master/ui/style/style_palette_colorizer.cpp#L43)
