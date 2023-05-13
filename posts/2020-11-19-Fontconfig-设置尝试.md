---
upated: 2023-05-27
tags: [TL;DR, Note]
---

[Fontconfig](https://www.freedesktop.org/wiki/Software/fontconfig/) 配置文件很难写，此文是我第二次修改后的使用总结。

但想要通过它来改变 Chrome 里网页的字体显示是徒劳的，所以说是“尝试”。

**以下很多内容是猜测得出的，所以不一定准确**

## 前言

**Chrome 和 Fontconfig 分别有自己的 fallback 逻辑，所以不要通过 Chrome 网页观察 Fontconfig 设置效果。**

以一个 GTK 应用为例，有很多地方可以设置字体：

- 应用本身的设置。默认为主题的字体
- GTK 主题（CSS）的字体设置。默认为 GNOME Tweaks 设置
- GNOME Tweaks 设置（[如何 GSettings 设置](https://askubuntu.com/a/905134)）[影响 GTK 应用和 GNOME Shell 的字体](https://www.omgubuntu.co.uk/2019/07/finally-change-gnome-shell-font-interface)
- Fontconfig 设置
- 字体文件。有一种选择是使用自己修改过的字体，比如 [Nerd Fonts](https://www.nerdfonts.com/)

有时需要重启应用或其他操作来应用字体。X11
 下 可以使用 <kbd>Alt</kbd> + <kbd>F2</kbd>；输入 `r`；<kbd>Enter</kbd> 来重启 GNOME

## 安装字体

我的设想是和安卓系统的默认字体基本一致：

| Lang \ Generic | `sans-serif` & `system-ui` | `serif`           | `monospace`           |
| -------------- | -------------------------- | ----------------- | --------------------- |
| Latin          | Roboto                     | Noto Serif        | Fira Code             |
| CJK            | Noto Sans CJK SC           | Noto Serif CJK SC | Noto Sans Mono CJK SC |
| Emoji          | Noto Color Emoji           | Noto Color Emoji  | Noto Color Emoji      |

- Fedora（`/usr/share/fonts`）本身已经安装了：
  - UPDATE：Fedora 38，[现在系统默认安装 `google-noto-sans-cjk-vf-fonts` 和 `google-noto-serif-cjk-vf-fonts`](https://fedoraproject.org/wiki/Changes/Noto_CJK_Variable_Fonts)
  - [Noto Sans CJK OTC 版本](https://www.google.com/get/noto/help/cjk/#:~:text=OTC%20fonts%20for%20Regular%20and%20Bold,Mono%20CJK%20%7BJP%2C%20KR%2C%20SC%2C%20TC%7D.) `google-noto-sans-cjk-ttc-fonts` ，这里面包含了 Noto Sans Mono CJK
  - [Noto Color Emoji](https://github.com/googlei18n/noto-emoji) `google-noto-emoji-color-fonts`
- 剩下的也恰好可以通过 DNF 安装：
  - [Roboto](https://fonts.google.com/specimen/Roboto) `sudo dnf install google-roboto-fonts`
  - [Noto Sans 和 Noto Serif](https://www.google.com/get/noto/) `sudo dnf install google-noto-sans-fonts google-noto-serif-fonts`
  - [Fira Code](https://github.com/tonsky/FiraCode/wiki/Linux-instructions#fedora) `sudo dnf install fira-code-fonts`
  - [Noto Serif CJK OTC 版本](https://www.google.com/get/noto/help/cjk/) `sudo dnf install google-noto-serif-cjk-ttc-fonts`
- 字体包还添加了附带的配置文件到 `/etc/fonts/conf.d`
- 添加字体后可能需要 `fc-cache -r` 重新建立缓存
- 手动安装字体需要复制字体文件到 `~/.local/share/fonts`（`~/.fonts` 是旧路径）
- misc
  - https://fedoraproject.org/wiki/Changes/DefaultFontsToNoto
  - https://wiki.archlinux.org/index.php/Fonts
  - https://wiki.archlinux.org/index.php/Font_configuration

## Fontconfig 简介

一个简化的例子：应用设置了字体 `Roboto`；应用需要渲染字符时向 Fontconfig _请求 pattern（模式）_`Roboto`；Fontconfig 将模式与本地安装*字体的信息*进行匹配，返回*匹配结果* `Roboto,'Noto Sans CJK SC'`，依次尝试这些字体。应用最终使用 Roboto 渲染英文，使用 Noto Sans CJK SC 渲染中文

Fontconfig 配置可以：1. 修改应用请求 pattern 2. 修改字体信息 3. 修改匹配结果  
最常用的修改应用请求 pattern 的配置，下文也以此为重点

如何书写配置文件见 Fontconfig [用户文档](https://www.freedesktop.org/software/fontconfig/fontconfig-user.html) 和 [Font configuration](https://wiki.archlinux.org/index.php/Font_configuration)/[Examples](https://wiki.archlinux.org/index.php/Font_configuration/Examples) [Metric-compatible fonts](https://wiki.archlinux.org/index.php/Metric-compatible_fonts)和 [如何使用 fontconfig](http://samwhelp.github.io/book-ubuntu-qna/read/howto/configure-font/fontconfig/)。

Fontconfig 配置文件使用 XML 格式，系统配置文件在 `/etc/fonts`，里面的文件链接到 `/usr/share/fontconfig/conf.avail`  
为了方便下文把 `/etc/fonts` 里的配置文件，即 Fontconfig（或又经发行版修改）提供的配置和字体包提供的配置称为系统配置，以与用户的配置文件区分
注：可以运行 `install -D -t ./builtin.conf/conf.avail /usr/share/fontconfig/conf.avail/* ; install -t ./builtin.conf /etc/fonts/fonts.conf` 复制一份系统配置文件以供查阅  
用户自定义文件可以放到 `~/.config/fontconfig/font.conf` 和 `~/.config/fontconfig/conf.d` 文件夹里

Fontconfig 提供了一些命令 `fc-scan(1) fc-query(1) fc-cat(1) fc-cache(1) fc-list(1) fc-match(1) fc-pattern(1)`，下面通过它们来了解字体匹配的过程

## 字体信息

字体文件本身包含一些 Fontconfig 关注的信息，可以使用 `fc-scan` 读取字体文件（或文件夹内字体）的这些信息。参数可以是字体文件或者文件夹的路径  
运行 `fc-scan '/usr/share/fonts/lohit-assamese/Lohit-Assamese.ttf'` 输出：

```
Pattern has 25 elts (size 32)
	family: "Lohit Assamese"(s)
	familylang: "en"(s)
	style: "Regular"(s)
	stylelang: "en"(s)
	fullname: "Lohit Assamese"(s)
	fullnamelang: "en"(s)
	slant: 0(i)(s)
	weight: 80(f)(s)
	width: 100(f)(s)
	foundry: "ACE "(s)
	file: "/usr/share/fonts/lohit-assamese/Lohit-Assamese.ttf"(s)
	index: 0(i)(s)
	outline: True(s)
	scalable: True(s)
	charset:
	0000: 00000000 ffffffff f8000001 78000001 00000000 00000004 00800000 00800000
	0009: 00000000 00000000 00000000 00000030 fff99fef f3c5fdff b080799f 0fffffcf
	0020: 33183000 00000040 00000000 00000000 00000000 02000000 00000000 00000000
	0022: 00040000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
	0025: 00000000 00000000 00000000 00000000 00000000 00000000 00001000 00000000
(s)
	lang: as|bn|mni(s)
	fontversion: 163840(i)(s)
	capability: "otlayout:beng otlayout:bng2"(s)
	fontformat: "TrueType"(s)
	decorative: False(s)
	postscriptname: "Lohit-Assamese"(s)
	color: False(s)
	symbol: False(s)
	variable: False(s)
	fonthashint: False(s)
```

这些属性组成的信息被称为 pattern。应用请求的 pattern 自然也是一些字体信息（一般只提供字体名），Fontconfig 匹配返回的结果则是一列 pattern

使用 `fc-query` 也可以获得一个字体文件的信息。有的字体文件里包含多个字体，可以使用 `-i` 选项指定 index。参数是字体文件的路径，不可以是字体文件夹  
运行 `fc-query /usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc` 打印这个字体文件中多个 CJK 字体的信息  
运行 `fc-query -i 2 /usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc` 选择性地打印其中中文简体字体的信息

## 缓存字体信息

Fontconfig 会将上述这些信息缓存到 `~/.cache/fontconfig/`（使用 `fc-cache` 刷新缓存）

注：配置 `<selectfont>` 可以选择要缓存的字体，可以以此屏蔽一些字体但不必删除字体文件（比如没权限删除系统预装字体的情况）  
另外经测试当用户和系统都安装同名字体后 Fontconfig 会优先使用系统安装的版本。这显然不符合预期，可以通过屏蔽掉系统安装的那个解决

具体地，一个文件夹内的字体信息被缓存到一个缓存文件中。可以使用 `fc-cat` 获取缓存的字体信息，参数是包含字体文件的文件夹或者缓存文件。`-v` 选项可以额外输出字体文件和缓存文件的路径  
运行 `fc-cat /usr/share/fonts/lohit-assamese` 输出：

```
"Lohit-Assamese.ttf" 0 "Lohit Assamese:familylang=en:style=Regular:stylelang=en:fullname=Lohit Assamese:fullnamelang=en:slant=0:weight=80:width=100:foundry=ACE :index=0:outline=True:scalable=True:charset=20-40 5b-60 7b-7e a2 d7 f7 964-965 980-983 985-98c 98f-990 993-9a8 9aa-9b0 9b2 9b6-9b9 9bc-9c4 9c7-9c8 9cb-9ce 9d7 9dc-9dd 9df-9e3 9e6-9fb 200c-200d 2013-2014 2018-2019 201c-201d 2026 20b9 2212 25cc:lang=as|bn|mni:fontversion=163840:capability=otlayout\\:beng otlayout\\:bng2:fontformat=TrueType:decorative=False:postscriptname=Lohit-Assamese:color=False:symbol=False:variable=False:fonthashint=False"
```

因为原字体文件夹里只有一个字体文件所以输出了这一个字体的信息  
开头的 `"Lohit-Assamese.ttf"` 是字体名，接下来的 `0` 是字体文件的索引。  
剩下的内容为 pattern 的文本表述，格式为 `<families>-<point sizes>:<name1>=<values1>:<name2>=<values2>...`

可以使用 `fc-pattern` 从 pattern 的文本表述解析并输出格式化的 pattern  
运行

```
fc-pattern "Lohit Assamese:familylang=en:style=Regular:stylelang=en:fullname=Lohit Assamese:fullnamelang=en:slant=0:weight=80:width=100:foundry=ACE :index=0:outline=True:scalable=True:charset=20-40 5b-60 7b-7e a2 d7 f7 964-965 980-983 985-98c 98f-990 993-9a8 9aa-9b0 9b2 9b6-9b9 9bc-9c4 9c7-9c8 9cb-9ce 9d7 9dc-9dd 9df-9e3 9e6-9fb 200c-200d 2013-2014 2018-2019 201c-201d 2026 20b9 2212 25cc:lang=as|bn|mni:fontversion=163840:capability=otlayout\\:beng otlayout\\:bng2:fontformat=TrueType:decorative=False:postscriptname=Lohit-Assamese:color=False:symbol=False:variable=False:fonthashint=False"
```

可以重新得到 `fc-scan '/usr/share/fonts/lohit-assamese/Lohit-Assamese.ttf'` 一样的输出

## 使用 Pattern 筛选缓存的字体

使用 `fc-list` 可以列出所有可用的（被 Fontconfig 缓存）字体。`-v` 输出格式化的 pattern

`fc-list` 还支持提供 pattern 的文本表述 作为参数进行筛选  
运行
`fc-list "Lohit Assamese:familylang=en:style=Regular:stylelang=en:fullname=Lohit Assamese:fullnamelang=en:slant=0:weight=80:width=100:foundry=ACE :index=0:outline=True:scalable=True:charset=20-40 5b-60 7b-7e a2 d7 f7 964-965 980-983 985-98c 98f-990 993-9a8 9aa-9b0 9b2 9b6-9b9 9bc-9c4 9c7-9c8 9cb-9ce 9d7 9dc-9dd 9df-9e3 9e6-9fb 200c-200d 2013-2014 2018-2019 201c-201d 2026 20b9 2212 25cc:lang=as|bn|mni:fontversion=163840:capability=otlayout\\:beng otlayout\\:bng2:fontformat=TrueType:decorative=False:postscriptname=Lohit-Assamese:color=False:symbol=False:variable=False:fonthashint=False"`
得到输出 `/usr/share/fonts/lohit-assamese/Lohit-Assamese.ttf: Lohit Assamese:style=Regular`

运行 `fc-list 'Lohit Assamese'` 也会得到同样的结果

## 字体匹配

应用提供 pattern 向 Fontconfig 请求合适的字体，Fontconfig 会返回其认为匹配的字体的 pattern 列表，最上面的最匹配  
注：Fontconfig 总是会返回结果以保证文字显示

相应的命令是 `fc-match`，这个命令接受 pattern 的文本表述作为参数。默认返回最匹配的结果，`-s` 选项则返回匹配程度排序的列表；`-v` 选项输出完整的 pattern
单运行 `fc-match`（未指定字体信息）返回默认最匹配的字体的信息  
运行 `fc-match 'sans-serif'` 返回 `DejaVuSans.ttf: "DejaVu Sans" "Regular"`  
运行 `fc-match -s 'sans-serif'` 返回更多字体
注：`fc-list` 只能从缓存信息里精准筛选出字体，`fc-list sans-serif` 返回结果为空

可以这样 `fc-match Arial,'Noto Sans CJK SC','sans-serif'` 像 CSS 一样在 pattern 里提供多个字体  
等价于 `fc-match :family=Arial,'Noto Sans CJK SC','sans-serif'`  
Pattern 各属性的值是一个数组

`fc-pattern :family=Arial,'Noto Sans CJK SC','sans-serif'` 查看 pattern 的格式化输出

## Debugging 和配置文件

可以设置 `FC_DEBUG` 环境变量来让 Fontconfig 输出一些信息

| Name    | Value | Meaning                                          |
| ------- | ----: | ------------------------------------------------ |
| MATCH   |     1 | Brief information about font matching            |
| MATCHV  |     2 | Extensive font matching information              |
| EDIT    |     4 | Monitor match/test/edit execution                |
| FONTSET |     8 | Track loading of font information at startup     |
| CACHE   |    16 | Watch cache files being written                  |
| CACHEV  |    32 | Extensive cache file writing information         |
| PARSE   |    64 | (no longer in use)                               |
| SCAN    |   128 | Watch font files being scanned to build caches   |
| SCANV   |   256 | Verbose font file scanning information           |
| MEMORY  |   512 | Monitor fontconfig memory usage                  |
| CONFIG  |  1024 | Monitor which config files are loaded            |
| LANGSET |  2048 | Dump char sets used to construct lang values     |
| MATCH2  |  4096 | Display font-matching transformation in patterns |

设置 `env FC_DEBUG=1024`（CONFIG）可以看到 Fontconfig 加载了哪些配置文件  
运行 `env FC_DEBUG=1024 fc-pattern -c Arial` 发现 Fontconfig 依次加载了：
注：`-c` 选项表示应用配置文件

1. `/etc/fonts/fonts.conf`
2. `/etc/fonts/conf.d` 里序号 \< 50 的配置文件
   - `/etc/fonts/fonts.conf` 里有 [Fontconfig 提供的配置](https://gitlab.freedesktop.org/fontconfig/fontconfig/-/tree/master/conf.d) 和通过安装包安装字体附带的配置
3. `/etc/fonts/conf.d/50-user` 以及用户的配置文件
4. `/etc/fonts/conf.d` 剩下 \> 50 的配置文件
5. `/usr/share/fontconfig/conf.avail` 里的一些配置文件，这个应该是 Fontconfig 硬编码的  
   例如 `/usr/share/fontconfig/conf.avail/35-lang-normalize.conf`

设置 `env FC_DEBUG=4`（EDIT）观察配置文件是如何被加载和执行来修改 pattern（包含应用请求和 Fontconfig 返回的）的  
运行 `env FC_DEBUG=1028 fc-pattern -c Arial`（EDIT + CONFIG）可以看到 Fontconfig 加载每个配置文件中规则的过程  
注：规则分为三种，Fontconfig 加载了所有规则。先讨论其中 `kind: 0`，代表 `<match target="pattern">`，即修改应用请求的 pattern

Fontconfig 加载完配置文件中的规则时并没有立即执行这些规则，执行前添加了两个属性：

- `lang: "en"(w)`。`lang` 属性和 `FC_LANG` 或 locale 设置一致。这就是中文界面汉字显示差强人意的原因
- `prgname: "fc-pattern"(s)`
- 注：搜索 `FcConfigSubstitute Pattern` 定位

之后 Fontconfig 便开始执行规则，先执行所有 `kind: 0` 规则修改应用请求 pattern

## 默认配置对 pattern 的修改

以 pattern `Arial,sans` 为例，未执行这些规则前的 pattern 为：

```
FcConfigSubstitute Pattern has 3 elts (size 16)
        family: "Arial"(s) "sans"(s)
        lang: "en"(w)
        prgname: "fc-pattern"(s)
```

执行完 `kind: 0` 规则，即 `fc-pattern -c Arial,sans`，其输出为：

```
Pattern has 6 elts (size 16)
	family: "Arial"(s) "Liberation Sans"(s) "Arimo"(s) "Liberation Sans"(s) "Albany"(s) "Albany AMT"(s) "DejaVu Sans"(w) "PT Sans"(w) "PT Sans Caption"(w) "Bitstream Vera Sans"(w) "DejaVu Sans"(w) "Verdana"(w) "Arial"(w) "Albany AMT"(w) "Luxi Sans"(w) "Nimbus Sans L"(w) "Nimbus Sans"(w) "Nimbus Sans"(w) "Helvetica"(w) "Nimbus Sans"(w) "Lucida Sans Unicode"(w) "BPG Glaho International"(w) "Tahoma"(w) "Comfortaa"(w) "Montserrat"(w) "URW Gothic"(w) "Nimbus Sans"(w) "Nimbus Sans Narrow"(w) "Carlito"(w) "Roboto"(w) "Droid Sans"(w) "Nachlieli"(w) "Lucida Sans Unicode"(w) "Yudit Unicode"(w) "Kerkis"(w) "ArmNet Helvetica"(w) "Artsounk"(w) "BPG UTF8 M"(w) "Waree"(w) "Loma"(w) "Garuda"(w) "Umpush"(w) "Saysettha Unicode"(w) "JG Lao Old Arial"(w) "GF Zemen Unicode"(w) "Pigiarniq"(w) "B Davat"(w) "B Compset"(w) "Kacst-Qr"(w) "Urdu Nastaliq Unicode"(w) "Raghindi"(w) "Mukti Narrow"(w) "malayalam"(w) "Sampige"(w) "padmaa"(w) "Hapax Berbère"(w) "MS Gothic"(w) "UmePlus P Gothic"(w) "Microsoft YaHei"(w) "Microsoft JhengHei"(w) "WenQuanYi Zen Hei"(w) "WenQuanYi Bitmap Song"(w) "AR PL ShanHeiSun Uni"(w) "AR PL New Sung"(w) "MgOpen Modata"(w) "VL Gothic"(w) "IPAMonaGothic"(w) "IPAGothic"(w) "Sazanami Gothic"(w) "Kochi Gothic"(w) "AR PL KaitiM GB"(w) "AR PL KaitiM Big5"(w) "AR PL ShanHeiSun Uni"(w) "AR PL SungtiL GB"(w) "AR PL Mingti2L Big5"(w) "ＭＳ ゴシック"(w) "ZYSong18030"(w) "TSCu_Paranar"(w) "NanumGothic"(w) "UnDotum"(w) "Baekmuk Dotum"(w) "Baekmuk Gulim"(w) "KacstQura"(w) "Lohit Bengali"(w) "Lohit Gujarati"(w) "Lohit Hindi"(w) "Lohit Marathi"(w) "Lohit Maithili"(w) "Lohit Kashmiri"(w) "Lohit Konkani"(w) "Lohit Nepali"(w) "Lohit Sindhi"(w) "Lohit Punjabi"(w) "Lohit Tamil"(w) "Meera"(w) "Lohit Malayalam"(w) "Lohit Kannada"(w) "Lohit Telugu"(w) "Lohit Oriya"(w) "LKLUG"(w) "Mingzat"(w) "Padauk"(w) "Noto Sans"(w) "Nuosu SIL"(w) "FreeSans"(w) "Arial Unicode MS"(w) "Arial Unicode"(w) "Code2000"(w) "Code2001"(w) "sans-serif"(s) "Roya"(w) "Koodak"(w) "Terafik"(w) "Helvetica"(w) "TeX Gyre Heros"(w) "Nimbus Sans"(w) "sans-serif"(w) "sans-serif"(w) "sans-serif"(w) "sans-serif"(w) "sans-serif"(w) "Arial"(w) "sans-serif"(w) "sans-serif"(w) "sans-serif"(w) "ITC Avant Garde Gothic"(w) "URW Gothic"(w) "sans-serif"(w) "sans-serif"(w) "Helvetica"(w) "Helvetica Narrow"(w) "Nimbus Sans Narrow"(w) "sans-serif"(w) "sans-serif"(w) "sans-serif"(w) "sans-serif"(w)
	hintstyle: 1(i)(w)
	lang: "en"(w)
	prgname: "fc-pattern"(s)
	fonthashint: True(w)
```

可以看到 [Fontconfig 提供的配置](https://gitlab.freedesktop.org/fontconfig/fontconfig/-/tree/master/conf.d) 和通过安装包安装字体附带的配置最终在 pattern 里添加了很多字体

可以运行 `env FC_DEBUG=1028 fc-pattern -c Arial,sans | less -p 'FcConfigSubstitute Pattern'` 查看规则执行过程，可以同时翻看对应的配置文件

可以看到 `sans`、`sans-serif`、`system-ui` 等“字体族”在 Fontconfig 看来除了没有对应字体文件外和普通的字体名没有不同  
注：GNOME 的字体选择框可以像普通字体一样选择字体族

现在解释系统配置文件的作用

`fonts.conf` 把一些不规范的字体族（比如 `sans`、`mono`）书写改成规范的（`sans-serif`、`monospace`）：

```xml
<match target="pattern">
  <test qual="any" name="family">
    <string>sans</string>
  </test>
  <edit name="family" mode="assign" binding="same">
    <string>sans-serif</string>
  </edit>
</match>
```

`<match>` 元素代表一条规则，会对通过所有 `<test>` 的 pattern 应用所有 `<edit>` 修改  
可以不提供 `<test>`，对所有 pattern 应用 `<edit>`  
例子中的 `<match target="pattern">` 表示这条规则（`kind: 0`）用于 应用请求的 pattern。因为 `target` 属性的默认值就是 `pattern`，所以和 `<match>` 是一样的。其他 `target` 值：`scan` 用于对字体信息 pattern 的修改；`font` 用于对返回结果（pattern 数组）的修改

`<test>` 元素各属性默认值：`<test qual="any" name="property" target="default" compare="eq">`  
`qual="any"` 表示只要属性值数组中的一个 item 值满足比较条件就应用 `<edit>`，`qual="all"` 则表示需要全部值都满足条件  
`name` 的值表示要测试的属性名，`name="family"` 表示要测试 `family` 属性  
`target="default"` 表示 `target` 值和 `<match>` 的 `target` 值一致。例子中就表示 `target="pattern"`  
`compare="eq"` 表示测试属性的值需要和 `<test>` 子元素的值相同，其他值还有 `"eq", "not_eq", "less", "less_eq", "more", "more_eq", "contains" or "not_contains"`

例子中的 `<test>` 测试 pattern 的 `family` 属性值数组中是否有一个 item 为 `sans`，例子的 `family: "Arial"(s) "sans"(s)` 显然是命中了

`<edit>` 元素各属性默认值：`<edit name="property" mode="assign" binding="weak">`  
`name="property"` 表示修改哪个属性  
`mode` 表示修改方式，具体的：

| Mode             | With Match             | Without Match          |
| ---------------- | ---------------------- | ---------------------- |
| "assign"         | Replace matching value | Replace all values     |
| "assign_replace" | Replace all values     | Replace all values     |
| "prepend"        | Insert before matching | Insert at head of list |
| "prepend_first"  | Insert at head of list | Insert at head of list |
| "append"         | Append after matching  | Append at end of list  |
| "append_last"    | Append at end of list  | Append at end of list  |
| "delete"         | Delete matching value  | Delete all values      |
| "delete_all"     | Delete all values      | Delete all values      |

`With Match`：`<test>` 命中属性值数组中的一个 item，`<edit>` 又要修改这个属性值数组时，可以选择添加的位置相对于命中的 item，可以只删除或修改这个 item
`Withou Match`：`<edit>` 要修改的属性和 `<test>` 测试并命中的属性不同，添加的位置只能相对整个属性值，只能删除或修改整个属性值

执行这条规则后的结果：

```
FcConfigSubstitute editPattern has 3 elts (size 16)
        family: "Arial"(s) "sans-serif"(s)
        lang: "en"(w)
        prgname: "fc-pattern"(s)
```

可以看到 `family` 属性的 `"sans"(s)` 被修改为了 `"sans-serif"(s)`

输出里属性数组的 item 后面的 `(s)` 表示这个 item 是 strong binding，`(w)` 代表 weak binding。其他字母应该代表类型，string 类型应该被省略了  
`<edit>` 的 `binding` 属性值表示添加或修改的属性为 `weak` 或 `strong` binding，或者使用 `same` 值使其和 `<test>` 命中的属性一致  
binding 的作用后文有述

## 别名和 `30-metric-aliases.conf`

接着 `/etc/fonts/conf.d/10-hinting-slight.conf` 添加了 `hintstyle: 1(i)(w)`，pattern 变为

```
FcConfigSubstitute editPattern has 4 elts (size 16)
        family: "Arial"(s) "sans-serif"(s)
        hintstyle: 1(i)(w)
        lang: "en"(w)
        prgname: "fc-pattern"(s)
```

然后便迎来了 `/etc/fonts/conf.d/30-metric-aliases.conf`，这个配置文件目的是通过一堆 `<alias>` 在应用请求 pattern 中的字体不可用时修改请求——添加与原请求字体接近的字体作为默认（添加到 pattern 字体数组最后）、候选（不可用字体 item 之后）、更偏好（不可用字体 item 之前）

```
FcConfigSubstitute editPattern has 4 elts (size 16)
        family: "Arial"(s) "sans-serif"(s) "Helvetica"(w)
        hintstyle: 1(i)(w)
        lang: "en"(w)
        prgname: "fc-pattern"(s)
```

可以看到 `family` 属性最后面加上了 `"Helvetica"(w)`，具体执行的规则：

```xml
<alias>
  <family>Arial</family>
  <default>
  <family>Helvetica</family>
  </default>
</alias>
```

`<alias>` 其实是一类 `<match>` 的缩写，上面等价于：

```xml
<match>
  <test name="family">
    <string>Arial</string>
  <test>
  <edit mode="append_last">
    <string>Helvetica</string>
  </edit>
</match>
```

`<default>` 对应 `<edit mode="append_last">`；`<accept>` 对应 `<edit mode="append">`；`<prefer>` 对应 `<edit mode="prepend">`

`<alias>` 有 `binding` 属性，默认为 `weak`，即缩写前 `<edit>` 的 `binding` 属性。所以上一条规则添加了 `weak` binding 的 `Helvetica`，而 `<alias binding="same">` 即 `<edit binding="same">` 所以之后的规则

```xml
<alias binding="same">
  <family>Helvetica</family>
  <accept>
  <family>TeX Gyre Heros</family>
  </accept>
</alias>
```

添加的 `TeX Gyre Heros` 也是 `weak` binding

同理，再之后的

```xml
<alias binding="same">
  <family>Arial</family>
  <accept>
    <family>Arimo</family>
    <family>Liberation Sans</family>
    <family>Albany</family>
    <family>Albany AMT</family>
  </accept>
</alias>
```

添加了和 `"Arial"(s)` 相同 binding 的一串 `"Arimo"(s) "Liberation Sans"(s) "Albany"(s) "Albany AMT"(s)`

执行完这个配置文件里的所以规则后的结果：

```
FcConfigSubstitute editPattern has 4 elts (size 16)
        family: "Arial"(s) "Arimo"(s) "Liberation Sans"(s) "Albany"(s) "Albany AMT"(s) "sans-serif
"(s) "Helvetica"(w) "TeX Gyre Heros"(w)
        hintstyle: 1(i)(w)
        lang: "en"(w)
        prgname: "fc-pattern"(s)
```

## 字体族

之后的 `40-nonlatin.conf`、`45-generic.conf`、`45-latin.conf` 主要使用类似

```xml
<alias>
  <family>Arial</family>
  <default><family>sans-serif</family></default>
</alias>
```

给各常见字体在 `family` 数组最后加上一个对应的字体族名字。前面的规则已经添加了好多字体，这些字体可能会命中这些规则，所以经过这些规则 `family` 属性后面被添加了好多 `sans-serif`

`45-generic.conf` 针对 Emoji 和数学相关字体，还修改了 `lang` 属性

`49-sansserif.conf` 的作用是：如果此时 pattern `family` 属性数组里还没有 `serif`、`sans-serif` 等字体族，添加 `sans-serif` 作为 fallback

结果：

```
FcConfigSubstitute editPattern has 5 elts (size 16)
        family: "Arial"(s) "Arimo"(s) "Liberation Sans"(s) "Albany"(s) "Albany AMT"(s) "sans-serif"(s) "Helvetica"(w) "TeX Gyre Heros"(w) "sans-serif"(w) "sans-serif"(w) "sans-serif"(w) "sans-serif"(w) "sans-serif"(w)
        hintstyle: 1(i)(w)
        lang: "en"(w)
        prgname: "fc-pattern"(s)
```

## 系统规则对用户自定义规则的影响

`/etc/fonts/conf.d` 里 \<50 的配置文件主要使 Fontconfig 提供的

`50-user.conf` 里的

```xml
<include ignore_missing="yes" prefix="xdg">fontconfig/conf.d</include>
<include ignore_missing="yes" prefix="xdg">fontconfig/fonts.conf</include>
```

表示自此将执行用户的配置文件  
注：用户配置文件的序号和系统配置文件的序号相互独立

执行完用户配置文件后还会接着执行 `/etc/fonts/conf.d` 里 \>50 的配置文件，主要是类似：

```xml
<alias>
  <family>monospace</family>
  <prefer>
    <family>Fira Code</family>
  </prefer>
</alias>
```

这样 Fontconfig 提供的配置和一些字体包附带的配置

注意系统规则对用户规则的可能不合预期的影响：

- \<50 的配置设置的 default alias 优先于用户配置的 default alias
- 用户配置的 accept alias 会被 \>50 的配置设置的 accept alias“覆盖”
  Fontconfig 附带的规则没有在 \>50 配置里使用 accept alias，字体包附带的配置可能使用并让相关用户配置失效
- ~~\<50 的配置设置的 prefer alias 优先于用户配置的 prefer alias，所幸没有这样的配置~~

TLDR:

以应用请求 `Arial` 为例：
如果 \<50 的系统配置对 `Arial` 设置 default alias，修改结果是 `Arial,Arial-system-default`  
用户也设置 default alias，结果是 `Arial,Arial-system-defualt,Arial-user-default`。这样系统设置优先用户设置
注：default alias 在 family 列表最后添加字体

如果 \<50 的系统配置对 `Arial` 设置 accept alias，结果是 `Arial,Arial-system-accept`  
用户也设置 accept alias，结果是 `Arial,Arial-user-accept,Arial-system-accept`。这样用户设置优先系统设置

所以 \<50 的系统配置对 `Arial` 设置 accept default，结果是 `Arial,Arial-system-default`  
用户可以设置 accept alias，结果是 `Arial,Arial-user-accept,Arial-system-default`。这样用户设置优先系统设置

同样的，如果 \>50 的系统配置使用 accept alias，可能会使用户的 accept alias 失效：  
用户配置对 `Arial` 设置 accept alias，结果是 `Arial,Arial-user-accept`  
如果 \> 50 的系统配置也设置 accept alias，结果是 `Arial,Arial-system-accept,Arial-user-accept`

同样的原因，\<50 的配置文件没有使用 prefer alias：
如果 \<50 的系统配置对 `Arial` 设置 prefer alias，结果是 `Arial-system-prefer,Arial`  
用户也设置 prefer alias，结果是 `Arial-system-prefer,Arial-user-prefer,Arial`。这样系统设置优先用户设置

类似的，`57-dejavu-sans-fonts.conf` 对 `sans-serif` 设置了 prefer alias。我安装的 Roboto 字体包附带的配置在 `64-google-roboto.conf` 对 `sans-serif` 设置了 prefer alias 但不起作用因为优先级太低

## The canonical font pattern

Fontconfig 执行完以上 `<match target="pattern">` 规则（即 `fc-pattern -c <pattern>`）得到的 pattern 还会被 Fontconfig 加上一些属性（即 `fc-pattern -cd <pattern>`）。`-d` 选项表示应用应用最后这些配置

`fc-pattern -cd Arial,sans` 输出

```
Pattern has 25 elts (size 32)
	family: "Arial"(s) "Liberation Sans"(s) "Arimo"(s) "Liberation Sans"(s) "Albany"(s) "Albany AMT"(s) "DejaVu Sans"(w) "PT Sans"(w) "PT Sans Caption"(w) "Bitstream Vera Sans"(w) "DejaVu Sans"(w) "Verdana"(w) "Arial"(w) "Albany AMT"(w) "Luxi Sans"(w) "Nimbus Sans L"(w) "Nimbus Sans"(w) "Nimbus Sans"(w) "Helvetica"(w) "Nimbus Sans"(w) "Lucida Sans Unicode"(w) "BPG Glaho International"(w) "Tahoma"(w) "Comfortaa"(w) "Montserrat"(w) "URW Gothic"(w) "Nimbus Sans"(w) "Nimbus Sans Narrow"(w) "Carlito"(w) "Roboto"(w) "Droid Sans"(w) "Nachlieli"(w) "Lucida Sans Unicode"(w) "Yudit Unicode"(w) "Kerkis"(w) "ArmNet Helvetica"(w) "Artsounk"(w) "BPG UTF8 M"(w) "Waree"(w) "Loma"(w) "Garuda"(w) "Umpush"(w) "Saysettha Unicode"(w) "JG Lao Old Arial"(w) "GF Zemen Unicode"(w) "Pigiarniq"(w) "B Davat"(w) "B Compset"(w) "Kacst-Qr"(w) "Urdu Nastaliq Unicode"(w) "Raghindi"(w) "Mukti Narrow"(w) "malayalam"(w) "Sampige"(w) "padmaa"(w) "Hapax Berbère"(w) "MS Gothic"(w) "UmePlus P Gothic"(w) "Microsoft YaHei"(w) "Microsoft JhengHei"(w) "WenQuanYi Zen Hei"(w) "WenQuanYi Bitmap Song"(w) "AR PL ShanHeiSun Uni"(w) "AR PL New Sung"(w) "MgOpen Modata"(w) "VL Gothic"(w) "IPAMonaGothic"(w) "IPAGothic"(w) "Sazanami Gothic"(w) "Kochi Gothic"(w) "AR PL KaitiM GB"(w) "AR PL KaitiM Big5"(w) "AR PL ShanHeiSun Uni"(w) "AR PL SungtiL GB"(w) "AR PL Mingti2L Big5"(w) "ＭＳ ゴシック"(w) "ZYSong18030"(w) "TSCu_Paranar"(w) "NanumGothic"(w) "UnDotum"(w) "Baekmuk Dotum"(w) "Baekmuk Gulim"(w) "KacstQura"(w) "Lohit Bengali"(w) "Lohit Gujarati"(w) "Lohit Hindi"(w) "Lohit Marathi"(w) "Lohit Maithili"(w) "Lohit Kashmiri"(w) "Lohit Konkani"(w) "Lohit Nepali"(w) "Lohit Sindhi"(w) "Lohit Punjabi"(w) "Lohit Tamil"(w) "Meera"(w) "Lohit Malayalam"(w) "Lohit Kannada"(w) "Lohit Telugu"(w) "Lohit Oriya"(w) "LKLUG"(w) "Mingzat"(w) "Padauk"(w) "Noto Sans"(w) "Nuosu SIL"(w) "FreeSans"(w) "Arial Unicode MS"(w) "Arial Unicode"(w) "Code2000"(w) "Code2001"(w) "sans-serif"(s) "Roya"(w) "Koodak"(w) "Terafik"(w) "Helvetica"(w) "TeX Gyre Heros"(w) "Nimbus Sans"(w) "sans-serif"(w) "sans-serif"(w) "sans-serif"(w) "sans-serif"(w) "sans-serif"(w) "Arial"(w) "sans-serif"(w) "sans-serif"(w) "sans-serif"(w) "ITC Avant Garde Gothic"(w) "URW Gothic"(w) "sans-serif"(w) "sans-serif"(w) "Helvetica"(w) "Helvetica Narrow"(w) "Nimbus Sans Narrow"(w) "sans-serif"(w) "sans-serif"(w) "sans-serif"(w) "sans-serif"(w)
	familylang: "en"(s) "en-us"(w)
	stylelang: "en"(s) "en-us"(w)
	fullnamelang: "en"(s) "en-us"(w)
	slant: 0(i)(s)
	weight: 80(i)(s)
	width: 100(i)(s)
	size: 12(f)(s)
	pixelsize: 12.5(f)(s)
	hintstyle: 1(i)(w)
	hinting: True(s)
	verticallayout: False(s)
	autohint: False(s)
	globaladvance: True(s)
	dpi: 75(f)(s)
	scale: 1(f)(s)
	lang: "en"(w)
	fontversion: 2147483647(i)(s)
	embeddedbitmap: True(s)
	decorative: False(s)
	namelang: "en"(s)
	prgname: "fc-pattern"(s)
	symbol: False(s)
	variable: False(s)
	fonthashint: True(w)
```

成为最终被拿去进行匹配的请求 pattern

之后（？）Fontconfig 对缓存的字体信息执行 `<match target="scan">` 规则得到修改后的字体信息

Fontconfig 使用最终 pattern 与上述所有字体信息进行匹配得出结果——一个字体信息 pattern 数组

Fontconfig 对上一步结果的字体信息 pattern 执行 `<match target="font">` 规则得到最终结果并返回给应用

还可以这样使用 `<test>` 的 `target` 属性：

```xml
<match target="font">
  <test target="pattern" name="weight" compare="more_eq">
    <const>bold</const>
  </test>
  <edit name="weight" mode="assign">
    <const>bold</const>
  </edit>
</match>
```

> 具体如何匹配和返回我还没弄明白

## `FC_LANG`、`lang` 和 Weak、Strong

Fontconfig 进行 pattern 和字体信息匹配时不同的属性有不同的优先级：`foundry, charset, family, lang, spacing, pixelsize, style, slant, weight, antialias, rasterizer and outline.` 从高到低。因为应用一般不指定 `foundry, charset`，实际从 `family` 和 `lang` 开始

需要特别注意的是 `family` 属性值数组的每一个字体 item 是 strong binding 还是 weak binding 会影响 `family` 与 `lang` 的优先级，strong binding 的字体优先级高于 `lang` 而 weak binding 的优先级低于 `lang`。这也意味着**所有 strong binding 字体优先级高于所有 weak binding 字体**

前文说过 Fontconfig 在加载配置文件后，执行前对应用请求的 pattern 根据 locale 或 `FC_LANG` 环境变量的值添加了 `lang` 属性：当使用中文界面时 `lang` 被设置为 `"zh-cn"(w)`

举例说，假设 `env FC_LANG=zh-cn fc-pattern -c` 输出：

```
family: "Roboto"(w) "Noto Sans CJK SC"(w)
lang: "zh-cn"(w)
```

因为 Roboto 是 weak binding 且不支持中文，`env FC_LANG=zh-cn fc-match -s` 最终匹配：

```
NotoSansCJK-Regular.ttc: "Noto Sans CJK SC" "Regular"
Roboto-Regular.ttf: "Roboto" "Regular"
```

> 除了 family 外的其他属性也有 weak 或 strong 的区别，我不知道有什么作用 🤷‍♂️

发现一个 bug，default alias 在 binding="same" 时，bar 的 binding 并不和 foo 保持一致

```xml
<alias binding="same">
  <family>foo</family>
  <default>
    <family>bar</family>
  </default>
</alias>
```

## 吐槽字体包附带配置的影响

Fontconfig 本身的配置和发行版自带字体包带的配置中真正产生影响的是它们在应用请求 pattern 字体数组里添加的 strong binding 的字体，因为它们设置的 weak binding 字体优先级不如被用户或配置设置的 strong binding 字体

其中 `30-metric-aliases.conf` 的

```xml
<alias binding="same">
  <family>Arial</family>
  <accept>
    <family>Arimo</family>
    <family>Liberation Sans</family>
    <family>Albany</family>
    <family>Albany AMT</family>
  </accept>
</alias>
```

用户可以通过配置可以使其失效，而字体包的配置文件比如 `57-dejavu-sans-fonts.conf` 的

```xml
<alias binding="same">
  <family>Arial</family>
    <accept>
      <family>Liberation Sans</family>
    </accept>
</alias>
```

倒会使用户相应配置失效，虽然可能有这样做的道理在

因为这个问题，之前我是直接屏蔽了含有 Emoji 字形的字体的。现在 Chrome 似乎改善了 Emoji 显示（见 [1](https://chromium.googlesource.com/chromium/src.git/+/671511b00e2d6c374a3079c1c379d2d0dfad32fe)、[2](https://github.com/google/emoji-segmenter)，就由这些字体包去吧。想要调整的话用 Stylus 好了

## 我的自定义设置

终于可以开心地设置字体了？

通过 GNOME Tweaks 把各字体设置为字体族

节选 `sans-serif` 字体族相关配置

```xml

<alias binding="same">
  <family>cursive</family>
  <accept>
    <family>sans-serif</family>
  </accept>
</alias>

<!-- Chrome UI 似乎使用 `system-ui` -->
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
```

## 猜猜应用是如何使用字体的

对于设置了一个字体的应用，请求后 Fontconfig 返回一个字体信息 pattern 数组，done

对于浏览器，网页支持设置一列字体（例如 `Arial,'sans-serif'`）。看起来好像直接用这个列表向 Fontconfig 发出请求并使用返回的信息数组，但因为跨系统等原因，浏览器需要自己的一套匹配逻辑

自然的猜测：浏览器不直接使用 `fc-match -s Arial,'sans-serif'` 的返回结果，而是先尝试 `fc-match -s Arial'`。结果不可用再尝试 `fc-match -s 'sans-serif'`  
问题是请求 `fc-match -s Arial'` 就会返回一列可用字体，若浏览器使用返回的所有值那么网页设置的其他字体就不会起作用，所以浏览器应该只尝试使用返回的第一个字体，若不可用则 `fc-match 'sans-serif'` 重复本步骤。直到请求列表中的最后一个字体（或浏览器设置的默认字体）`fc-match -s 'final-family'`，尝试这此返回的所有字体

假设网页设置 `Roboto,'Microsoft Yahei',example`，Fontconfig 设置了 `Roboto` 的 alias `Roboto,'Noto Sans CJK SC'`。浏览器尝试渲染一个中文字符：

1. 浏览器请求 `Roboto`，返回 `Roboto,'Noto Sans CJK SC'`。Roboto 没有中文字形
2. 浏览器请求 `'Microsoft Yahei'`，返回 `'Microsoft Yahei'`。应用雅黑字体

这可能不符合预期

TODO：阅读 [Blink's Text Stack](https://chromium.googlesource.com/chromium/src/+/master/third_party/blink/renderer/platform/fonts/README.md)

## Misc

- [修改字体的 charset](https://stackoverflow.com/questions/47501411/how-to-set-font-per-unicode-range-codepoint-in-fontconfig)，[issue](https://bugs.freedesktop.org/show_bug.cgi?id=31969)
- 系统字体位置 `/usr/share/fonts`
- 系统字体设置位置 `/etc/fonts`（软链接到 `/usr/share/fontconfig`）
- `/usr/share/xml/fontconfig/fonts.dtd`
- `fonts.dtd` [GitHub](https://github.com/freedesktop/fontconfig/blob/master/fonts.dtd)
- `/etc/xml/catalog`
- [Fedora fontconfig packaging tips](https://fedoraproject.org/wiki/Fontconfig_packaging_tips#Templates_and_Examples)
- [Deepin fontconfig](https://github.com/linuxdeepin/default-settings/blob/master/usr.share.d/fontconfig/conf.avail/55-language-deepin-zh-cn.conf)
- https://lists.freedesktop.org/archives/fontconfig/2016-March/005742.html
- https://lists.freedesktop.org/archives/fontconfig/2012-September/004334.html
- https://wiki.archlinux.org/index.php/Fonts
- https://wiki.archlinux.org/index.php/Font_configuration
- https://wiki.archlinux.org/index.php/Localization/Simplified_Chinese
- https://www.freedesktop.org/software/fontconfig/fontconfig-user.html
- https://www.freedesktop.org/software/fontconfig/fontconfig-devel/x19.html
- https://gitlab.freedesktop.org/fontconfig/fontconfig
- [Issue 908541: Noto Color Emoji is partially used](https://bugs.chromium.org/p/chromium/issues/detail?id=908541)
- [Issue 767754: Ask fontconfig for "emoji" font when SymbolsIterator mandates emoji preference](https://bugs.chromium.org/p/chromium/issues/detail?id=767754)
- [Bug 94551 - Provide a means for matching and selecting a color emoji font](https://bugs.freedesktop.org/show_bug.cgi?id=94551)
- [Bug 191976 - [FreeType] Color emoji not properly supported](https://bugs.webkit.org/show_bug.cgi?id=191976)
- https://en.wikipedia.org/wiki/Miscellaneous_Symbols#Emoji
- https://www.unicode.org/emoji/charts-12.0/emoji-versions.html


## Backup

```xml
<selectfont>
  <acceptfont>
    <!-- <pattern><patelt name="lang"><string>und-zsye</string></patelt></pattern> -->
    <!-- <pattern>
      <patelt name="family"><string>Fira Code</string></patelt>
    </pattern> -->
    <pattern>
      <patelt name="family">
        <string>Noto Color Emoji</string>
      </patelt>
    </pattern>
  </acceptfont>
  <rejectfont>
    <pattern><description>Reject fonts that conflict with Noto Color Emoji</description>

      <!-- <patelt name="color"><bool>false</bool></patelt> -->
      <patelt name="charset">
        <charset>
          <!-- <int>9786</int> -->
          <int>0x1f600</int>
        </charset>
      </patelt>
    </pattern>
    <pattern>
      <patelt name="family"><string>DejaVu Sans</string></patelt>
    </pattern>
  </rejectfont>
</selectfont>
```
