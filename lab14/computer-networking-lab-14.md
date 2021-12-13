# 《计算机网络》 实验 14 配置静态动态 NAT

![在这里插入图片描述](https://img-blog.csdnimg.cn/21b59dd1990a4e60b98abe75fb37c359.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 1 实验步骤

# 配置实验拓扑图

![在这里插入图片描述](https://img-blog.csdnimg.cn/e70a5822f2da4735a46e4280b9419574.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 2 实验拓扑图

为了模拟“服务器”，相比以往的实验拓扑图，本实验多加了一台 server，选用 server-PT 型号，同时交换机选用 2960 型号，路由选用 2811 型号，串口连接如下：

PC1 f0/0 -> switch1 f0/2
PC2 f0/0 -> switch2 f0/3
switch1 f0/1 -> router1 f0/0
router1 f0/1 -> router2 f0/0
router2 f0/1 -> swerver-pt f0

# 配置静态 NAT

## 配置 PC

首先我们配置 PC 网关地址和 IP 地址：

PC1 网关 -> 192.168.0.1
PC1 IP 地址 -> 192.168.0.10
PC2 网关 -> 192.168.0.1
PC2 IP 地址 -> 192.168.0.20

![在这里插入图片描述](https://img-blog.csdnimg.cn/049958d2260b47c6b8e5c075ef4e1ef9.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 3 PC1 配置

![在这里插入图片描述](https://img-blog.csdnimg.cn/b6370fbfb3b049fe995cbc2fcf9d1776.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 4 PC2 配置

## 配置路由器

首先我们配置 router1 的端口 ip 地址及默认路由：

> en
> conf t
> interface f0/0
> ip address 192.168.0.1 255.255.255.0
> no shutdown
> interface f0/1
> ip address 201.1.1.1 255.255.255.0
> no shutdown
> exit
> 配置内网的静态路由
> ip route 0.0.0.0 0.0.0.0 201.1.1.254

接下来配置路由器 2，由于存在 NAT，对于外网来说，内网的地址会被转换和隐藏。

> en
> conft
> interface f0/0
> ip address 201.1.1.254 255.255.255.0
> no shutdown
> interface f0/1
> ip address 200.1.1.1 255.255.255.0
> no shutdown

## 配置 router1 上的 NAT 转换表

配置静态 NAT，其实就是配置静态映射，把内网的 IP 地址映射到外网去，由于是静态 NAT，所以需要在 router1 上手动配置：

> ip nat inside source static 192.168.0.10 201.1.1.2
> ip nat inside source static 192.168.0.20 201.1.1.3

除此之外，我们还要在 router1 上设置好 NAT 的内外端口,此处 f0/0 为内端口，f0/1 为外端口：

> interface f0/0
> ip nat inside
> interface f0/1
> ip nat outside

## 配置服务器

对于 server-PT，我们也需要配置网关和 IP 地址：

server 网关 -> 200.1.1.1
server IP 地址 -> 200.1.1.10

至此，对于静态 NAT 我们配置完毕，接下来我们进行测试，看 PC1 和 PC2 能否 ping 通 server。

# 测试通信结果

首先使用 PC1 ping server：

![在这里插入图片描述](https://img-blog.csdnimg.cn/e37fb8fb01284b49bb3540b65d77b802.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 5 PC1 ping server 结果

结果可以 ping 通。

再使用 PC2 ping server：

![在这里插入图片描述](https://img-blog.csdnimg.cn/a1023d8df40149efa244b45979f8c16d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 6 PC2 ping server 结果

通过配置静态 NAT，我们可以把 Router1 作为一个进出口，例如当 PC1 发送 ping 请求后，发送的数据包到达 Router1 之后，因为之前设置了这两条：

> ip nat inside source static 192.168.0.10 201.1.1.2
> ip nat inside source static 192.168.0.20 201.1.1.3

所以当 Router1 看到数据包源地址为 192.168.0.20 时就会把其源地址转换为 201.1.1.2，发送出去，即完成从内部 IP 地址转变为外部地址这个过程，PC2 发数据包的时候同理，再通过 router2 将数据包转发，即可到达 server 处。

我们还可以通过使用 show ip nat translations 查看 NAT 转换表:

![在这里插入图片描述](https://img-blog.csdnimg.cn/6f784c6d2c00495e97cce0a3467f0386.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 7 router1 NAT 转换表

# 配置动态 NAT

相比于静态 NAT，动态 NAT 其实“检测”的是网段，R1 可以向 ISP 申请地址池，通过配置 IP 地址池，内网指定范围的 IP 地址（ACL 决定）可以被动态、随机地转换为合法地址。（看 IP 池）

## 删除静态 NAT 配置

由于先前我们已经配置了 PC 和 server，对于配置动态 NAT，我们得先将之前再 Router1 上配置的静态 NAT 删除：

> en
> conf t
> no ip nat inside source static 192.168.0.10 201.1.1.2
> no ip nat inside source static 192.168.0.20 201.1.1.3

## 配置 IP 访问控制列表

接下来，我们就要指定哪些 IP 地址可以被访问、转换，为此我们需要在 Router1 上配置 ACL：

> access-list permit 1 192.168.0.0 0.0.0.255

我们指定开头为 192.168 的 IP 地址可以被访问。

## 在 R1 上配置 IP 地址池

ACL 中的 IP 地址都可以被转换到这个池子内的外网 IP 地址

> ip nat pool natpool 201.1.1.2 201.1.1.5 netmask 255.255.255.0

为了能够将内网转换为外网 IP 地址，我们需要将 ACL 和这个 IP 池联系起来：

> ip nat inside source list 1 pool natpool

## 测试网络通信

为了测试动态 NAT 是否配置成功，我将 PC1 的 IP 地址随便改了下，该成了 192.168.0.130，再 ping 服务器的 IP 地址，如果 ping 得通，说明我们的内网 IP 地址通过动态 NAT 随机地被转换成了外网地址：

![在这里插入图片描述](https://img-blog.csdnimg.cn/362a5dafcfdc4a2cabee4c7a6ecc2e1a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 8 PC1 ping server 结果

结果可以 ping 通，说明动态 NAT 配置成功。注意，NAT 转换表提供的是“转换过程”，假如你还没有使用 ping，那么你查看 NAT 转换表的时候是没有任何东西的。

我们可以查看此时的 Router1 的 NAT 转换表：

![在这里插入图片描述](https://img-blog.csdnimg.cn/349d0cec465d46e79517d60b9ba3292b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 9 PC1 ping 之后的 NAT 转换表

由于 IP 是被动态、随机的转换的，假如我们再 ping 一下， 那么 NAT 转换表中的内容就会变化：

![在这里插入图片描述](https://img-blog.csdnimg.cn/8f06e1dc55954c98a2ee4dfc86b18125.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

图 10 前后两次 ping 的 NAT 转换表对比

# 总结方法

静态 NAT 的配置是相对比较简单的，因为只涉及具体 IP 地址的转换，而动态 NAT 要考虑的是一个范围的 IP 地址，所以引入了 ACL 确定内网 IP 地址转换的范围，引入 IP 池确定由内网地址转换为外网 IP 地址的范围。
