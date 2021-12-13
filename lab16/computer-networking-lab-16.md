# 《计算机网络》 实验 16 DHCP 的基本配置

![在这里插入图片描述](https://img-blog.csdnimg.cn/5c0b1474de07404dacc2acb4a4837de9.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 1 实验步骤

# 配置实验拓扑图

![在这里插入图片描述](https://img-blog.csdnimg.cn/f37728a8fa0c4d7b8ea2536e6254cc00.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 2 实验拓扑图

本次实验中，我们使用一个 DHCP 的服务器给两个网段的设备分配 IP 地址，同时利用 router1 作为 DHCP 中继。server 使用 server-PT 型号，router 使用 router-PT 型号，交换机使用 2950-24 型号，每个子网有 3 台 PC，以下为串口配置：

DHCP f0 -> switch1 fa0/1
PC1 f0 -> switch1 fa0/2
PC2 f0 -> switch1 fa0/3
PC3 f0 -> switch1 fa0/4
switch1 fa0/6 -> router1 f0/0
router1 fa1/0 -> switch2 fa0/1
switch2 fa0/2 -> PC3 f0
switch2 fa0/3 -> PC4 f0
switch2 fa0/4 -> PC5 f0

线材均使用直通线。

# 配置服务器

对于服务器，我们首先要配置它的 IP 地址和网关：

网关 -> 172.16.0.1
IP 地址 -> 172.16.0.2

配置完之后才能动态分配主机 IP。
在这之后，我们打开 services 界面，点击左边的 DHCP，进入配置界面，在点击“service on”之后，我们要为两个网段的设备分别配置 IP 地址：

![在这里插入图片描述](https://img-blog.csdnimg.cn/667f8c8779a24c3c8545d24a526c9d4a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 3 PC1、2、3 所在网段 配置

![在这里插入图片描述](https://img-blog.csdnimg.cn/1d2197fe9c5349ab9412dace73fdbea1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 4 PC4、5、6 所在网段配置

值得注意的是，当 DHCP 中有多个地址池的时候，每个地址池需要有对应的网关（这个非常重要），终端的 PC 与哪个网关处于一个网络中，就获取网关的对应的地址池中的 IP 地址，以实现网络主机地址信息的动态配置。例如，server 直接与交换机连接，server 的网关地址为 172.16.0.1，恰好是 DHCP 中配置的网关，那么服务器的 DHCP 就会为 switch 下的设备分配 172.16.0.1 网关对应的 IP 地址池中的 IP 地址。

# 配置 DHCP 中继

而对于 swtich2 构建的子网来说，它并没有和 server 在同一个子网中，所以就需要 DHCP 中继代理，来实现 DHCP 服务器的动态分配功能，即在 DHCP 服务器和客户端之间转发 DHCP 数据包（DHCP 中继代理在收到 DHCP 消息后，会重新生成一个 DHCP 消息转发出去，所以并不是原来的）。对于 DHCP 客户端（子网下的设备）来说，DHCP 中继代理就像 DHCP 服务器；而对 DHCP 服务器看来，DHCP 中继代理就像 DHCP 客户端。
在本拓扑网络中，我们选用 router1 作为 DHCP 中继，要配置 DHCP 中继，我们需要找到 roter1 和交换机 switch2 连接的串口，然后在该串口上进行操作：
Router1

> en
> conf t
> ip helper-address 172.16.0.2

最后一条指令就是指定 DHCP 服务器，通过 fa1/0 串口向该服务器发送 DHCP 请求包。

# 测试动态分配结果

要测试动态分配结果，我们需要点进 PC，然后选中 Desktop，进入第一个 IP Configuration。

![在这里插入图片描述](https://img-blog.csdnimg.cn/46aab0841e4c4e66bed40c7e9929d714.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 5 PC Desktop 界面

然后点中进入，选中 DHCP，然后等待分配结果：

![在这里插入图片描述](https://img-blog.csdnimg.cn/6298fba208a64220852fc97aeeb00f0e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 6 子网 1 中设备分配结果

![在这里插入图片描述](https://img-blog.csdnimg.cn/04313ed00c324524a197f8bfbe50e612.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 7 子网 2 中设备分配结果

发现子网中的设备都可以获取网关地址以及动态分配的 IP 地址，说明 DHCP 及 DHCP 中继代理配置成功。

# 总结方法

DHCP 在日常生活中也经常可见，例如你连接 wifi 后，再查看电脑的 IP 地址，会发现连接不同的 wifi 给你分配的 ip 地址可能不一样，这跟电脑里 DHCP 的配置有关。在本实验中，只是进行了简单的 DHCP 配置，没有涉及到新设备加入之后 DHCP 是如何分配的，其实有分四个步骤，分别是 DHCP server discovery/ DHCP server offer/ DHCP request/ DHCP ACK，具体细节还得看书中细节了。
