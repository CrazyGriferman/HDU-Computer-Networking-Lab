---
title:  《计算机网络》 实验 11 静态路由的配置
categories: technology
---

![在这里插入图片描述](https://img-blog.csdnimg.cn/a353af68f8804aafbb1f33794ae4b85d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图1 实验步骤

# 配置实验拓扑图

![在这里插入图片描述](https://img-blog.csdnimg.cn/c132446112b54ff4a172d28cadfaefcd.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
 > 图2 实验拓扑图
 
 
为了配置静态路由，本实验使用了两个交换机，构建了两个局域网。路由器使用serial DCE线连接（先连接的需要配置时钟频率以便路由器的两个串口可以正常通信），端口为se2/0其它都使用直通线连接，图2为实验拓扑图。

# 配置PC

对于PC，我们只需配置两者的IP地址和网关即可。

以下为PC1的网关地址和IP地址:

![在这里插入图片描述](https://img-blog.csdnimg.cn/17f0df43403d453ca7bff079b101628b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图3 PC1 网关地址
 
![在这里插入图片描述](https://img-blog.csdnimg.cn/fb7d4c0feb0448989a2452de067640ce.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图4 PC1 IP地址

  以下为PC2的网关地址和IP地址:
  
![在这里插入图片描述](https://img-blog.csdnimg.cn/821c8633b8224f27a848ed9debbe91b8.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

 
> 图5 PC2 网关地址
 
![在这里插入图片描述](https://img-blog.csdnimg.cn/bd17921624be40b5b4d17825fdb27890.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图6 PC2 IP地址

# 配置路由器

首先我们得理解路由器的工作原理，在配置的过程中才能理解为什么这么做。

比如我刚才配置了PC1的ip地址为192.168.1.2，PC2的ip地址为192.168.2.2，那么这两个PC其实不是在同一个网段的，如果要PC1要和PC2通信，一定要通过路由器。比如我PC1要和PC2通信，那么就会先给路由器1发送一个数据包，告诉它我要和PC2通信。然后路由器1这里收到数据包后，发现目的ip地址对应的网段是2.0，所以它会查看路由表（ip route 192.168.2.0 255.255.255.0 192.168.5.3）中网段2.0应该由哪个端口转发。在本例中，192.168.5.3对应的是se2/0端口，所以路由器1就会把PC1发过来的数据包从se2/0端口转发出去，然后就到了路由器2这里，发现是目标ip地址为网段2.0的数据包，那么就会查看路由表，从fa0/1端口转发给出去（开启了 no shutdown），最终到达PC2。PC2到PC1其实也是同理。

在配置的过程中，路由器1的fa0/1端口ip地址对应为192.168.1.1（作为PC1的网关），serial2/0端口的ip地址为192.168.5.2，路由器2的fa0/1端口ip地址对应为192.168.2.1（作为PC2的网关），serial2/0端口的ip地址为192.168.5.3。这样两个路由器的se2/0端口的ip地址都是在5.0的网段。

以下为配置指令。

对于路由器1:
> end
> conf t
> hostname R1
> interface fa1/0
> no shutdown
> ip address 192.168.1.1 255.255.255.0
> exit
> interface serial 2/0
> no shutdown
> clcok rate 64000
> ip address 192.168.5.2 255.255.255.0
> end
> conf t
> ip route 192.168.2.0 255.255.255.0 192.168.5.3
> end
对于图中的ip路由，C为连接状态，S为配置的静态路由。

![在这里插入图片描述](https://img-blog.csdnimg.cn/47e25b70ca3941f9a773fa642b90b879.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图7 路由器1 路由配置结果

对于路由器2：

> end
> conf t
> hostname R2
> interface fa0/1
> no shutdown
> ip address 192.168.2.1 255.255.255.0
> interface serial 2/0
> no shutdown
> ip address 192.168.5.3 255.255.255.0
> end
> conf t
> ip route 192.168.1.0 255.255.255.0 192.168.5.2

注意到路由器2并没有在serial2/0端口配置clockwise，这是因为之前提到的两个路由器的se2/0端口使用的是serial DCE进行连接，先连接的是路由器1，所以只需要配置路由器1 se2/0端口的时钟频率即可。

![在这里插入图片描述](https://img-blog.csdnimg.cn/36fdb190080941ed971e7e2d286592f8.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图8 路由器2 路由配置结果

# 测试路由功能
一切配置完毕之后，我们就可以用PC1来ping PC2的ip地址。进入PC1的控制台，输入ipconfig查看PC1的ip地址。
 
![在这里插入图片描述](https://img-blog.csdnimg.cn/a719bab36ef44cffa500cb96481b716e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图9 PC1 IP地址
然后输入PC2的ip地址测试结果：
 
![在这里插入图片描述](https://img-blog.csdnimg.cn/39f4da295aea481c99327351f214e6d4.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图10 测试结果

发现可以ping通，说明静态路由配置成功。

# 总结方法

配置静态路由需要注意以下几点：
1. 需要有目标IP；
2. 需要有与静态路由直接相连的下一路由器接口的IP地址或静态路由的本地接口；
3. 静态路由是由管理员手动设置的，除非管理员干预，否则静态路由不会发生变化；

静态路由的特点：
1. 静态路由是单向的；
2. 静态路由缺乏灵活性；
3. 允许对路由的行为进行精准的控制；
