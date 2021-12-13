---
title:  《计算机网络》 实验 8 交换机的基本配置
categories: technology
---

![在这里插入图片描述](https://img-blog.csdnimg.cn/9dfef72303514951bebb887e618907db.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
> 图1 实验步骤

# 设置实验环境
由于是mac系统，所以我安装的是mac系统上的packet tracer软件，然后进行安装注册。

![在这里插入图片描述](https://img-blog.csdnimg.cn/ff1a00fd07914095bba107d3423edc98.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 

> 图2 packet tracer软件登陆界面

我们这里选择guest login 进入。

# 配置packet tracer软件

下面我们进入到了软件界面，由于原先字体比较小，不便于字体展示，所以在preference中把字体大小修改下。

![在这里插入图片描述](https://img-blog.csdnimg.cn/14199050330344cb96262d995bff0131.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图3 packet tracer软件应用界面
 
![在这里插入图片描述](https://img-blog.csdnimg.cn/daae2e65934f46a4975747e952573816.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图4 修改字体大小

# 配置交换机

要配置交换机，我们需要一台PC和一台交换机，然后使用，我们这里选择PC-PT1和2960switch，然后使用console蓝线，进行连接，效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/743166cde3d9447cb54647d81c1cc644.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)


 
> 图5 配置交换机

需要注意的是，在连接线的过车过那种姑娘，PC端连接RS232口，交换机连接console口，这样之后才能在terminal中编辑命令。

# 输入各种命令
这之后，我们点击PC，选择desktop中的terminal，然后编辑各种命令，配置交换机。

![在这里插入图片描述](https://img-blog.csdnimg.cn/378c40bd41e14e40a07acb7311238583.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图6 terminal界面

进入terminal界面后，我们首先进入特权模式：

![在这里插入图片描述](https://img-blog.csdnimg.cn/db7bdb1a1dfc4ddd910c256ffdc84262.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图7 进入特权模式

然后进入全局配置模式

![在这里插入图片描述](https://img-blog.csdnimg.cn/b56c48b832874976960433382e8c2fc8.png)
 
> 图8 全局配置模式

![在这里插入图片描述](https://img-blog.csdnimg.cn/e2beaf857d2e4b209b1eff6d907c44d8.png)
 
> 图9 端口模式
 
![在这里插入图片描述](https://img-blog.csdnimg.cn/082210544e2f4950994c342493673c85.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图10 用户模式
 
![在这里插入图片描述](https://img-blog.csdnimg.cn/c48a2cd90c8647c8bbc82643303f6490.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图11 特权模式

之后我们可以配置交换机的名称以及接口状态等:
hostname 19205133zq //配置交换机名字
interface fastEthernet 0/1 //进入端口F 0/1配置模式
speed 10 //端口速率为10M
duplex half //端口半双工模式
no shutdown //发送数据
description "19205133"  end //端口描述信息
show interface fastEthernet 0/1 //显示配置信息
show running-config //查看交换机配置信息
copy running-config startup-config //保存配置

![在这里插入图片描述](https://img-blog.csdnimg.cn/fabc69172b874d0fbed2f756e04a35bb.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图12 基础交换机设置
 
![在这里插入图片描述](https://img-blog.csdnimg.cn/d98ca9ad944441c0bb0e4e60222af776.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图13 显示配置信息

![在这里插入图片描述](https://img-blog.csdnimg.cn/d69c05f62f204aa0af227811a1c1cb43.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图14 查看交换机配置信息

# 总结方法

这个packet tracer其实就是利用图形化的方式模拟设备之间的通信，还是比较直观的，但是还是要了解一些基本的交换机配置信息，这样才能更好地理解交换机。
