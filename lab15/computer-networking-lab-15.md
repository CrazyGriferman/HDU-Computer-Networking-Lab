# 《计算机网络》 实验 15 ACL 网络访问控制

![在这里插入图片描述](https://img-blog.csdnimg.cn/60e2118d77c84f8686f94289a828d1c1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 1 实验步骤

# 配置实验拓扑图

![在这里插入图片描述](https://img-blog.csdnimg.cn/348d322d71d24aa0bba2d877124c430a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 2 实验拓扑图

本次实验主要参考书上的，但是书上对于具体网段的设备如何实现没说，我就用了三个交换机，创建三个子网。在配置实验拓扑图时，交换机用的是 2950-24 型号。实验指导书上路由器使用的是 loopback 虚拟接口，而我这里用的是物理接口。路由器使用的是 2811 型号，但是该型号只有两个 fa 口，不足三个，为了能够让路由器连接三个设备，所以我网上查了下，只要给 2811 路由器设备添加 NM-2FE2W 模块即可，添加方法跟之前 RIP 实验的很像，就是先把路由器关了，然后从左边拖模块到右边的黑块中，然后再开启电源即可。

![在这里插入图片描述](https://img-blog.csdnimg.cn/8bc9cc990eb04ac1bf36e14849564bc0.gif)

> 图 3 为路由器添加 fa 口

添加好之路由器就有了四个 fa 口，就可以实现拓扑图上的效果。除去路由器间用的是交叉线，其它用的都是直连线。

以下为端口连接：

PC1 fa0 -> switch1 fa0/2
PC2 fa0 -> swich1 fa0/3
switch1 fa0/1 -> router1 fa0/1
PC3 fa0 -> switch2 fa0/2
PC4 fa0 -> switch3 fa0/3
switch2 fa1/0 -> router1 fa1/0
router1 fa0/0 -> router2 fa0/0
router2 fa0/1 -> switch3 fa0/1
switch3 fa0/2 -> PC5 fa0
switch3 fa0/3 -> PC6 fa0

# 配置路由器

配置路由器比较常规，就是给各个串口添加 ip 地址，并在路由器 1 和路由器 2 中分别输入:

ip route 0.0.0.0 0.0.0.0 172.16.3.2
ip route 0.0.0.0 0.0.0.0 172.16.3.1

以此让所有发送来的数据包都分别转发到 172.16.3.2 对应串口（router2 的 fa0/0 口）和 172.16.3.1 对应串口（router1 的 fa0/0 口）。

实验指导书中对于 ip 配置的地方有个问题，对于 router2 的 fa0/0 ip 地址应该配置为 172.16.3.2。

以下为配置指令：

Router1

> en
> conf t
> int fa0/1
> ip add 172.16.1.1 255.255.255.0
> no shut
> int fa1/0
> ip add 172.16.2.1 255.255.255.0
> no shut
> int fa0/0
> ip add 172.16.3.1 255.255.255.0
> no shut
> end
> ip route 0.0.0.0 0.0.0.0 172.16.3.2

Router2

> en
> conf t
> int fa0/1
> ip add 172.16.4.1 255.255.255.0
> no shut
> int fa0/0
> ip add 172.16.3.2 255.255.255.0
> no shut
> exit
> ip route 0.0.0.0 0.0.0.0 172.16.3.1

# 配置 ACL 访问控制列表

ACL 是 Access Control List 的简写，由一系列条件规则组成，可以为报文源地址、目的地址、端口号等，主要的使用场景有过滤、分类等。

对于标准命令，只能根据源地址设置 IP 报文过滤条件，对于扩展命令，可以根据源目地址、TCP/IP 协议和和 TCP/UDP 源目的端口条件设置 IP 报文过滤条件。

为了达到“只允许网段 172.16.2.0 与 172.16.4.0 的主机进行通信，不允许 172.16.1.0 去访问 172.16.4.0 网段的主机”，我们需要一条 permit 和一条 deny 指令，同时还需要拒绝 deny 的 ip 地址从串口出去：

Router2 配置

> access-list 10 deny 172.16.1.0 0.0.0.255
> access-list 10 permit 172.16.2.0 0.0.0.255
> int fa0/1
> ip access-group 10 out

10 表示的是我么你创建的列表号是 10，最后一条指令是对于串口 fa0/1，将第一、二条指令作为过滤条件过滤从该串口转发出去的包。看了下实验指导书，没有提及对财务部访问销售部、经理部的需求，所以只设置了 out 的过滤规则。
如果想要删除 access-list 中的内容，可以进入 config 模式，然后输入 ip access-list standard 10，然后输入 do show access-list，可以看到每行前有个数字，只要输入 no 数字，就可以把对应的过滤规则删去。

我们可以通过 show access-list 指令看到设置的过滤规则：

![在这里插入图片描述](https://img-blog.csdnimg.cn/5a558265047549c191055d54c04f329e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 4 ACL 设置

# 配置 PC

对于 PC，其实之前实验都配置过了，只需要注意 PC 的网关地址要对应交换机和路由器连接的串口 IP 即可：

PC1 IP -> 172.16.1.2
PC1 网关 -> 172.16.1.1
PC2 IP -> 172.16.1.3
PC2 网关 -> 172.16.1.1

PC3 IP -> 172.16.2.2
PC3 网关 -> 172.16.2.1
PC4 IP -> 172.16.2.3
PC4 网关 -> 172.16.2.1

PC5 IP -> 172.16.4.2
PC5 网关 -> 172.16.4.1
PC6 IP -> 172.16.4.3
PC6 网关 -> 172.16.4.1

# 测试通信结果

在未配置 access-list 前，我们可以使用 172.16.1.0 网段的 PC ping 以下 172.16.4.0 网段的 PC：

![在这里插入图片描述](https://img-blog.csdnimg.cn/23f43f5bd7f14e88b052e3b8b64188a6.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 5 未配置 ACL 前 PC1 ping PC5

发现可以 ping 得通，说明两个网段间的主机可以相互通信。

在配置完 ACL 之后，再使用 PC1 ping PC5，发现显示 Destination host unreachable，说明 ACL 配置成功，该数据包被阻断了：

![在这里插入图片描述](https://img-blog.csdnimg.cn/a48f4cdbec74410385e7c08ad13b07f3.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 6 配置完 ACL 后 PC1 ping PC5

然后我们可以使用 172.16.2.0 网段的 PC，例如 PC3 ping 以下 PC5:

![在这里插入图片描述](https://img-blog.csdnimg.cn/5afaedf8da0d46ec866215c07abbfe48.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 7 配置完 ACL 后 PC3 ping PC5

发现可以 ping 通，说明 permit 指令配置成功。

# 总结方法

其实 ACL 和 wireshark 里的过滤规则有点像，都是你输入指定的规则，然后可以进行过滤，不过 ACL 主要应用在路由器和三层交换机上，网上查询了一下 ACL 的具体工作原理，主要如下：

1. 当一个数据包进入下一个端口，路由器会检查这个数据包是否可以路由，如果可以路由，那么路由器会检查这个端口是否有 ACL 控制进入数据包，如果有，根据 ACL 中的条件指令，检查这个数据包，如果数据包是被允许的，那么就查询路由表，决定数据包的目标端口。
2. 路由器会检查目标端口是否存在 ACL 控制流出的数据包。如果不存在，那么这个数据包就会直接发送到目标端口，如果存在，那么就会根据 ACL 进行取舍，然后再转发到目的端口。
