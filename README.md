
# 标签模版设计器
一个用来给TSPL标签打印机设计模版的模版设计器

## 创建一个为标签打印机设计标签模版的设计器
#### 目标：
- 能够通过本设计器设计标签打印模版
- 能够将可视化的模版生成成带有占位符的字符串
- 能够读取之前生成的字符串，并且读取JSON中的数据并替换
- 通过模版字符串和JSON数据生成真正的标签打印命令

#功能：
- 定义了部分标签元素（线条、文本、条形码、二维码 矩形）
- 定义了一个Class表征模版文件，内部可以容纳各种组件
- 定义了一个属性编辑器，可以读取特定类型的属性显示并支持修改
- 生成带有占位符的模版字符串
- 定义了一个模版读取器

#尚未完成：
- 在画布中绘制模版中的元素
- 将画布中的元素的属性和对应属性编辑器建立绑定关系
- 画布中元素属性修改时同时改变属性编辑器内的值，属性编辑器的值变化之后重绘画布中的元素，使得所见即所得
- 调试

# tag-template-designer
A tag template designer.  Design template for TSPL tag printer.

## To build a template designer for tag printer.
#### Goal:
  - Design a template with designer.
  - Generate print template which contain placehoder as a string
  - Read a template in a string and replace those placeholder with JSON data
  - Generate real command which can be send to a printer(maybe need Brand specified)
  

## Feature:
- Define some elements（Like：Bar Text BarCode QrCode Box）
- Define a template object witch can hold a tag template
- Define an simple property editor witch can display and edit elements property
- Generate print command for print whit property holder
- Define a command reader 

## TODOs:
- Draw tag elementes in a Canvas
- Bind element properties to the property editor
- Sync those propertes between elementes and those property editors(Properties changes after change those elementes in canvas. Canvas elementes changes after change properties in proerty editor)
- Debug
