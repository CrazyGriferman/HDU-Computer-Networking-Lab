# 《计算机网络》 实验 7 ARP 协议分析

![在这里插入图片描述](https://img-blog.csdnimg.cn/c2391e79c9c4413e9b3e73cae37604aa.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 1 实验步骤

# 设置实验环境

我这里用的是本地 WIFI，然后启动 VMware 虚拟机，以下分别是 mac 主机和 VMware 虚拟机的 IP 地址：

![在这里插入图片描述](https://img-blog.csdnimg.cn/714597eab45e4f1790beedb47d55da71.png)

> 图 2 mac 主机 IP 地址

![在这里插入图片描述](https://img-blog.csdnimg.cn/e856e2b9db084872bcabe4cdf893bba7.png)

> 图 3 VMware ubuntu 虚拟机 IP 地址

接下来我们在 wireshark 中选择 vmnet8 网卡进行抓包，这是虚拟机上的网卡。

![在这里插入图片描述](https://img-blog.csdnimg.cn/e9ef93e00512408e96ce6074e28e3d0e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 4 vmnet8 网卡抓包

就此，初始实验环境设置完毕。

# 使用 wireshark 进行抓包

ARP 协议是根据 IP 地址获取物理地址的一个 TCP/IP 协议。

当 PCA 想和 PCB 进行通信的时候，需要同时知道 PCB 的 IP 地址和 MAC 地址，而在广播的时候，往往只知道 IP 地址，不知道物理 MAC 地址。所以这个时候就要通过 ARP 协议进行分析，获取 IP 地址对应的物理 MAC 地址。那么我们可以在 ubuntu 虚拟机上对 mac 主机的 IP 地址 ping，因为这个时候虚拟机只知道 IP 地址，所以 ARP 协议就会来帮忙解析，获取对应的物理 MAC 地址。

我们先启动 wireshark 抓包，然后在 ubuntu 虚拟的控制台中输入 ping 172.16.246.1，这个时候 wireshark 就会抓到 ARP 数据包，一次一共有两条，分别是请求和回应。

![在这里插入图片描述](https://img-blog.csdnimg.cn/b2dc18ce306e4b76b7b758bdb89450fb.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 5 wireshark 捕获 ARP 数据包

接下来我们分析 ARP 协议的报文格式

# 了解 ARP 报文格式

![在这里插入图片描述](https://img-blog.csdnimg.cn/4372e3e677f44a6487918a64d0549fc8.jpg?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 6 ARP 报文格式

硬件类型：表明 ARP 协议实现在哪种类型的网络上；
协议类型：表示解析协议（上层协议）；
硬件地址长度：即 MAC 地址长度，此处为 6 个字节；
协议地址长度：IP 地址长度，此处为 4 个字节；
操作类型：表示 ARP 协议数据类型。1 表示 ARP 协议请求，2 表示 ARP 协议应答；
源 MAC 地址：发送端 MAC 地址
源 IP 地址：发送端 IP 地址
目标 MAC 地址：接收端 MAC 地址
目标 IP 地址：接收端 IP 地址

了解了 ARP 报文格式之后，我们就可以对捕获到的 ARP 数据包进行分析。

# 对抓到的 ARP 数据包进行具体分析

首先我们分析 ARP 请求包

![在这里插入图片描述](https://img-blog.csdnimg.cn/06c8b5da93304182b47fb00d453bae8d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 7 ARP 请求包 第一帧

Frame 1 表示第一帧数据包，提供了一些基本信息，如封装类型、到达时间等。

![在这里插入图片描述](https://img-blog.csdnimg.cn/4ac1bb38578841269ea1d279ab5ec1d6.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 8 ARP 请求包 以太网帧

方框内容表示以太网帧的头部信息，其中源 MAC 地址为：00:50:56:c0:00:08，目标 MAC 地址为 ff:ff:ff:ff:ff:ff，后者表示广播地址，表示局域网中的所有设备都会收到该数据包。

![在这里插入图片描述](https://img-blog.csdnimg.cn/00afe007a1bb42f3a0a9504aab6a02f0.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 9 ARP 请求包 地址解析协议内容

可以看到，request 表示“请求”，硬件类型为以太网，协议类型为 IPV4，硬件地址长度 6 位，协议长度 4 位，操作码为 1，表示这是 ARP 请求包，发送端的 MAC 地址为 00:0c:29:71:f8:94，发送端的 IP 地址为：172.16.246.128，接收端的 MAC 地址为 00:00:00:00:00:00，接收端的 IP 地址为 172.16.246.1。

下面分析 ARP 接收包的内容：

![在这里插入图片描述](https://img-blog.csdnimg.cn/271b3712c4cd41cbaf9f4995ef037313.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 10 ARP 请求包 第一帧

Frame 1 表示第一帧数据包，长度为 42bytes。

![在这里插入图片描述](https://img-blog.csdnimg.cn/57c3bda9e883407487858115611108ca.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 11 ARP 请求包 以太网帧

方框内容表示以太网帧的头部信息，其中源 MAC 地址为：00:50:56:c0:00:08，目标 MAC 地址为 00:0c:29:71:f8:94，说明我们找到了目标 IP 地址对应的 MAC 物理地址，Great！

![在这里插入图片描述](https://img-blog.csdnimg.cn/1781b408942745d5bdeceecc3b3b415f.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 12 ARP 请求包 地址解析协议内容

可以看到，reply 表示“接收”，硬件类型为以太网，协议类型为 IPV4，硬件地址长度 6 位，协议长度 4 位，操作码为 1，表示这是 ARP 请求包，发送端的 MAC 地址为 00:50:56:c0:00:08，接收端的 IP 地址为 172.16.246.1, 接收的 MAC 地址为 00:0c:29:71:f8:94，接收的 IP 地址为：172.16.246.12。

# 总结方法

要想捕捉到 ARP 协议，请求包一定是广播，因为你不知道 IP 地址对应的物理地址在哪里，要想达到这个目的，要么是局域里有人发广播，要么是你本地通过虚拟机往自己主机发送请求。
