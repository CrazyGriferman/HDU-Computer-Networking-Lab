---
title:  《计算机网络》 实验 12 RIP 路由协议基本配置
categories: technology
---

![在这里插入图片描述](https://img-blog.csdnimg.cn/563fe66e472742ccbc9a9366504f3142.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图1 实验步骤

# 配置实验拓扑图

![在这里插入图片描述](https://img-blog.csdnimg.cn/6c2e81ee59c44476ace2e5729bb46d2d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图2 实验拓扑图

对于本实验，我利用三个交换机创建了三个子网，对于子网与子网之间的通信，则需要路由器实现。
在配置实验拓扑图的时候，路由器我选用的是1841，但由于该类型路由器只有一个serial串口，所以需要加载物理模块WIC-2T，使其serial串口变为两个。进入路由器的physical界面，可以看到有个设备模拟界面，先按下电源，关闭它（红色框框）：
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/bae1bf99c0c846cc9648348536ee8979.gif)
 
> 图3 配置路由器物理模块

等灯灭了之后，拖动右边的WIC-2T，移入电源右边的黑框中，然后退出即可。

接下来就可以配置实验拓扑图了，交换机选用型号2950-24，路由器1841型号,以下为串口配置：

以下使用copper straight-through线：
PC1 fa0/0 -> switch1 fa1/0
PC2 fa1/0 -> switch1 fa2/0
PC3 fa2/0 -> switch1 fa3/0
switch1 fa4/0 -> router1 fa0/0
PC4 fa0/0 -> switch2 fa1/0
PC5 fa1/0 -> switch2 fa2/0
PC6 fa2/0 -> switch2 fa3/0
switch2 fa4/0 -> router2 fa0/0
PC7 fa0/0 -> switch3 fa1/0
PC8 fa1/0 -> switch3 fa2/0
PC9 fa2/0 -> switch3 fa3/0
switch3 fa4/0 -> router3 fa0/0

以下使用serial DCE线，顺序不要反：
router1 serial0/0/0 -> router2 serial 0/0/0
router3 serial0/0/1 -> router3 serial 0/0/1

# 配置PC网关、IP
先配置网关地址

对于子网1，PC1、PC2、PC3的网关地址均为192.168.1.1：

![在这里插入图片描述](https://img-blog.csdnimg.cn/cb1c2c20a3194c5ea74c9837a4255541.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图4 子网1 网关
对于子网2， PC4、PC5、PC6的网关地址均为192.168.2.1:

 ![在这里插入图片描述](https://img-blog.csdnimg.cn/e9cc85d79b0c4705b1dd9c61e23e4025.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图5 子网2 网关

对于子网3，PC7、PC8、PC9的网关地址均为192.168.3.1:

![在这里插入图片描述](https://img-blog.csdnimg.cn/e09193cf3a964d78bc803f302cabbd8f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图6 子网3 网关

接下来配置IP地址：
PC1 -> 192.168.1.2
PC2 -> 192.168.1.3
PC3 -> 192.168.1.4
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/8703e391139c495e858dc3fecf5af961.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图7 PC1、PC2、PC3 IP地址
PC4 -> 192.168.2.2
PC5 -> 192.168.2.3
PC6 -> 192.168.2.4
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/f9fd024eb72e46e7b0e4ef69e27e7e16.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图8 PC4、PC5、PC6 IP地址
PC7 -> 192.168.3.2
PC8 -> 192.168.3.3
PC9 -> 192.168.3.4
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/b92348889c2b45acba4d6f3a521dd036.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图9 PC7、PC8、PC9 IP地址

# 配置路由器及RIP协议

接下来我们来配置路由器：
Router1:

> en
> conf t
配置serial0/0/0串口
> int serial0/0/0
> ip address 172.16.0.1 255.255.0.0
> no shut
> exit
配置fa0/0串口
> int fa0/0
> no ip address
> ip address 192.168.1.1 255.255.255.0
> no shut
配置RIP
> router rip
> network 192.168.1.0
> network 172.16.0.0

Router2:
> en
> conf t
配置serial0/0/0串口
> int serial0/0/0
> ip address 172.16.0.2 255.255.0.0
> no shut
> exit
配置serial0/0/1串口
> int serial0/0/1
> ip address 172.17.0.1 255.255.0.0
> no shut
> exit
配置fa0/0端口
> int fa0/0
> ip address 192.168.2.1 255.255.255.0
> no shut
> exit
配置RIP
> router rip
> network 192.168.2.0
> network 172.16.0.0
> network 172.17.0.0

Router3:
> end
> conf t
> int serial0/0/1
> ip address 172.17.0.2 255.255.0.0
> no shut
> exit
配置fa0/0端口
> int fa0/0
> ip address 192.168.3.1 255.255.255.0
> no shut
> exit
配置RIP
> router rip
> network 172.17.0.0
> network 192.168.3.0

# 测试网络连通性

首先我们使用PC1，左键点击进入Desktop中的terminal prompt，先测试本地子网中的ip地址能否ping通，使用ping 192.168.1.3 和 ping 192.168.1.4指令：

![在这里插入图片描述](https://img-blog.csdnimg.cn/b399e34ef74a41eea2916af9db887411.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图10 测试PC1 ping 本地PC
再测试另外两个子网中的ip地址能否ping通,使用ping 192.168.2.3和ping 192.168.3.4指令:
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/ad6298f52d114881b800750c2abb5e72.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图11 测试PC1 ping 其它子网中的PC
发现都可ping通，说明路由功能正常。

接下来我们可以看下RIP协议是如何工作的。首先我们可以回顾之前的静态路由实验，我们需要通过ip route指令手动生成“路由表”，但通过RIP协议，我们不需要输入ip route指令，RIP可以通过传递和接收路由信息，动态更新路由表，这样就方便后续的扩充。

比如我们可以查看router2的路由信息：
 
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/78512c92724441b19acb34001251fed8.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图12 router2的路由信息

我们可以着重看这两条以R开头的信息，其中R表示该路由条是通过RIP路由协议学到的，192.168.1.0和192.168.3.0表示学到的目标路由信息，120表示RIP默认的管理距离，1表示该路由的度量值，via表示经过，172.16.0.1和172.17.0.2表示下一跳地址，后面的时间00:00:10/14b表示下一次更新时间，最后的serial0/0/1 serial0/0/0 表示该路由条是分别通过这两个接口学习到的。

假如我们想从PC1（192.168.1.2） ping PC7（192.168.3.2），也就是发包，那么PC1首先经过交换机到了switch1，switch1由于启用了rip协议，通过RIP协议“学”到了router2和router3中的路由信息，所以当该路由器看到目标地址为192.168.3.2时，根据“学”到的信息（R 192.168.3.0/24 [120/2] via 172.16.0.2, 00:00:12, Serial0/0/0）就知道下一跳要到172.16.0.2上，由于172.16.0.2是在172.16.0.0网段中，所以就会switch1通过serial0/0/0串口进行转发，到了router2中，router2看了目标地址192.168.3.2，根据从serial0/0/1串口学到了信息（R 192.168.3.0/24 [120/1] via 172.17.0.2, 00:00:15, Serial0/0/1），知道下一跳要到172.17.0.2，而该IP地址在172.17.0.0网段中，所以就会通过serial0/0/1串口进行转发，数据包到了router3这里，也就是子网3的网关处router3看到目标的地址为192.168.3.2的数据包，就会通过交换机，转发给子网下的PC7，由此PC7接收到了数据包。

另外，由于RIP协议每隔30秒就会接受和发送路由信息，所以我们可以通过debug ip rip看到RIP接受和发送路由信息的具体信息：

![在这里插入图片描述](https://img-blog.csdnimg.cn/a9aa0b72daed44d4a127817d7a696a31.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 
> 图13 router1的接收/更新路由信息

对于router1，由于我们宣告了两个网段，所以在发送本地的路由信息的时候，会发送两个网段的信息（一个是fa0/0本地的，一个是serial0/0/0向另外子网），而在接收的时候，会通过serial0/0/0“学习”到其它路由器的路由信息。

我们也可以通过路由器进行ping指令，测试网络连通性，可以发现我们发送的是ICMP数据包：

![在这里插入图片描述](https://img-blog.csdnimg.cn/5bb4c20db3b446f59125c1b0a0389307.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

 
> 图14 router3 ping 其它设备IP

由于通过RIP协议更新了自身的路由信息，所以router3 可以ping通其它子网的ip地址。

# 总结方法

RIP协议和静态IP最大的不同是，它可以通过“学习”路由信息来动态更新路由器本地的路由表，对于新加进的子网，其它路由器也可以及时地更新路由信息，将新的子网信息加入路由表中，方便自己本地的子网设别和新的子网设备进行通信。RIP其实还涉及一个距离（跳数）向量算法，通过此算法来维护从它自己到其它每一个目的网络的唯一最佳纪录。 RIP协议只允许一条路由最多只能包含15个路由器，如果是16个的话，那么网络就不可达。
