# 《计算机网络》 实验 12 RIP 路由协议基本配置

![在这里插入图片描述](https://img-blog.csdnimg.cn/563fe66e472742ccbc9a9366504f3142.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 1 实验步骤

# 配置实验拓扑图

![在这里插入图片描述](https://img-blog.csdnimg.cn/6c2e81ee59c44476ace2e5729bb46d2d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 2 实验拓扑图

对于本实验，我利用三个交换机创建了三个子网，对于子网与子网之间的通信，则需要路由器实现。
在配置实验拓扑图的时候，路由器我选用的是 1841，但由于该类型路由器只有一个 serial 串口，所以需要加载物理模块 WIC-2T，使其 serial 串口变为两个。进入路由器的 physical 界面，可以看到有个设备模拟界面，先按下电源，关闭它（红色框框）：

![在这里插入图片描述](https://img-blog.csdnimg.cn/bae1bf99c0c846cc9648348536ee8979.gif)

> 图 3 配置路由器物理模块

等灯灭了之后，拖动右边的 WIC-2T，移入电源右边的黑框中，然后退出即可。

接下来就可以配置实验拓扑图了，交换机选用型号 2950-24，路由器 1841 型号,以下为串口配置：

以下使用 copper straight-through 线：
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

以下使用 serial DCE 线，顺序不要反：
router1 serial0/0/0 -> router2 serial 0/0/0
router3 serial0/0/1 -> router3 serial 0/0/1

# 配置 PC 网关、IP

先配置网关地址

对于子网 1，PC1、PC2、PC3 的网关地址均为 192.168.1.1：

![在这里插入图片描述](https://img-blog.csdnimg.cn/cb1c2c20a3194c5ea74c9837a4255541.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 4 子网 1 网关
> 对于子网 2， PC4、PC5、PC6 的网关地址均为 192.168.2.1:

![在这里插入图片描述](https://img-blog.csdnimg.cn/e9cc85d79b0c4705b1dd9c61e23e4025.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 5 子网 2 网关

对于子网 3，PC7、PC8、PC9 的网关地址均为 192.168.3.1:

![在这里插入图片描述](https://img-blog.csdnimg.cn/e09193cf3a964d78bc803f302cabbd8f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 6 子网 3 网关

接下来配置 IP 地址：
PC1 -> 192.168.1.2
PC2 -> 192.168.1.3
PC3 -> 192.168.1.4

![在这里插入图片描述](https://img-blog.csdnimg.cn/8703e391139c495e858dc3fecf5af961.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 7 PC1、PC2、PC3 IP 地址
> PC4 -> 192.168.2.2
> PC5 -> 192.168.2.3
> PC6 -> 192.168.2.4

![在这里插入图片描述](https://img-blog.csdnimg.cn/f9fd024eb72e46e7b0e4ef69e27e7e16.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 8 PC4、PC5、PC6 IP 地址
> PC7 -> 192.168.3.2
> PC8 -> 192.168.3.3
> PC9 -> 192.168.3.4

![在这里插入图片描述](https://img-blog.csdnimg.cn/b92348889c2b45acba4d6f3a521dd036.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 9 PC7、PC8、PC9 IP 地址

# 配置路由器及 RIP 协议

接下来我们来配置路由器：
Router1:

> en
> conf t
> 配置 serial0/0/0 串口
> int serial0/0/0
> ip address 172.16.0.1 255.255.0.0
> no shut
> exit
> 配置 fa0/0 串口
> int fa0/0
> no ip address
> ip address 192.168.1.1 255.255.255.0
> no shut
> 配置 RIP
> router rip
> network 192.168.1.0
> network 172.16.0.0

Router2:

> en
> conf t
> 配置 serial0/0/0 串口
> int serial0/0/0
> ip address 172.16.0.2 255.255.0.0
> no shut
> exit
> 配置 serial0/0/1 串口
> int serial0/0/1
> ip address 172.17.0.1 255.255.0.0
> no shut
> exit
> 配置 fa0/0 端口
> int fa0/0
> ip address 192.168.2.1 255.255.255.0
> no shut
> exit
> 配置 RIP
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
> 配置 fa0/0 端口
> int fa0/0
> ip address 192.168.3.1 255.255.255.0
> no shut
> exit
> 配置 RIP
> router rip
> network 172.17.0.0
> network 192.168.3.0

# 测试网络连通性

首先我们使用 PC1，左键点击进入 Desktop 中的 terminal prompt，先测试本地子网中的 ip 地址能否 ping 通，使用 ping 192.168.1.3 和 ping 192.168.1.4 指令：

![在这里插入图片描述](https://img-blog.csdnimg.cn/b399e34ef74a41eea2916af9db887411.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 10 测试 PC1 ping 本地 PC
> 再测试另外两个子网中的 ip 地址能否 ping 通,使用 ping 192.168.2.3 和 ping 192.168.3.4 指令:

![在这里插入图片描述](https://img-blog.csdnimg.cn/ad6298f52d114881b800750c2abb5e72.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 11 测试 PC1 ping 其它子网中的 PC
> 发现都可 ping 通，说明路由功能正常。

接下来我们可以看下 RIP 协议是如何工作的。首先我们可以回顾之前的静态路由实验，我们需要通过 ip route 指令手动生成“路由表”，但通过 RIP 协议，我们不需要输入 ip route 指令，RIP 可以通过传递和接收路由信息，动态更新路由表，这样就方便后续的扩充。

比如我们可以查看 router2 的路由信息：

![在这里插入图片描述](https://img-blog.csdnimg.cn/78512c92724441b19acb34001251fed8.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 12 router2 的路由信息

我们可以着重看这两条以 R 开头的信息，其中 R 表示该路由条是通过 RIP 路由协议学到的，192.168.1.0 和 192.168.3.0 表示学到的目标路由信息，120 表示 RIP 默认的管理距离，1 表示该路由的度量值，via 表示经过，172.16.0.1 和 172.17.0.2 表示下一跳地址，后面的时间 00:00:10/14b 表示下一次更新时间，最后的 serial0/0/1 serial0/0/0 表示该路由条是分别通过这两个接口学习到的。

假如我们想从 PC1（192.168.1.2） ping PC7（192.168.3.2），也就是发包，那么 PC1 首先经过交换机到了 switch1，switch1 由于启用了 rip 协议，通过 RIP 协议“学”到了 router2 和 router3 中的路由信息，所以当该路由器看到目标地址为 192.168.3.2 时，根据“学”到的信息（R 192.168.3.0/24 [120/2] via 172.16.0.2, 00:00:12, Serial0/0/0）就知道下一跳要到 172.16.0.2 上，由于 172.16.0.2 是在 172.16.0.0 网段中，所以就会 switch1 通过 serial0/0/0 串口进行转发，到了 router2 中，router2 看了目标地址 192.168.3.2，根据从 serial0/0/1 串口学到了信息（R 192.168.3.0/24 [120/1] via 172.17.0.2, 00:00:15, Serial0/0/1），知道下一跳要到 172.17.0.2，而该 IP 地址在 172.17.0.0 网段中，所以就会通过 serial0/0/1 串口进行转发，数据包到了 router3 这里，也就是子网 3 的网关处 router3 看到目标的地址为 192.168.3.2 的数据包，就会通过交换机，转发给子网下的 PC7，由此 PC7 接收到了数据包。

另外，由于 RIP 协议每隔 30 秒就会接受和发送路由信息，所以我们可以通过 debug ip rip 看到 RIP 接受和发送路由信息的具体信息：

![在这里插入图片描述](https://img-blog.csdnimg.cn/a9aa0b72daed44d4a127817d7a696a31.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 13 router1 的接收/更新路由信息

对于 router1，由于我们宣告了两个网段，所以在发送本地的路由信息的时候，会发送两个网段的信息（一个是 fa0/0 本地的，一个是 serial0/0/0 向另外子网），而在接收的时候，会通过 serial0/0/0“学习”到其它路由器的路由信息。

我们也可以通过路由器进行 ping 指令，测试网络连通性，可以发现我们发送的是 ICMP 数据包：

![在这里插入图片描述](https://img-blog.csdnimg.cn/5bb4c20db3b446f59125c1b0a0389307.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 14 router3 ping 其它设备 IP

由于通过 RIP 协议更新了自身的路由信息，所以 router3 可以 ping 通其它子网的 ip 地址。

# 总结方法

RIP 协议和静态 IP 最大的不同是，它可以通过“学习”路由信息来动态更新路由器本地的路由表，对于新加进的子网，其它路由器也可以及时地更新路由信息，将新的子网信息加入路由表中，方便自己本地的子网设别和新的子网设备进行通信。RIP 其实还涉及一个距离（跳数）向量算法，通过此算法来维护从它自己到其它每一个目的网络的唯一最佳纪录。 RIP 协议只允许一条路由最多只能包含 15 个路由器，如果是 16 个的话，那么网络就不可达。
