# 《计算机网络》 实验 11 静态路由的配置

![在这里插入图片描述](https://img-blog.csdnimg.cn/a353af68f8804aafbb1f33794ae4b85d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 1 实验步骤

# 配置实验拓扑图

![在这里插入图片描述](https://img-blog.csdnimg.cn/c132446112b54ff4a172d28cadfaefcd.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 2 实验拓扑图

为了配置静态路由，本实验使用了两个交换机，构建了两个局域网。路由器使用 serial DCE 线连接（先连接的需要配置时钟频率以便路由器的两个串口可以正常通信），端口为 se2/0 其它都使用直通线连接，图 2 为实验拓扑图。

# 配置 PC

对于 PC，我们只需配置两者的 IP 地址和网关即可。

以下为 PC1 的网关地址和 IP 地址:

![在这里插入图片描述](https://img-blog.csdnimg.cn/17f0df43403d453ca7bff079b101628b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 3 PC1 网关地址

![在这里插入图片描述](https://img-blog.csdnimg.cn/fb7d4c0feb0448989a2452de067640ce.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 4 PC1 IP 地址

以下为 PC2 的网关地址和 IP 地址:

![在这里插入图片描述](https://img-blog.csdnimg.cn/821c8633b8224f27a848ed9debbe91b8.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 5 PC2 网关地址

![在这里插入图片描述](https://img-blog.csdnimg.cn/bd17921624be40b5b4d17825fdb27890.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 6 PC2 IP 地址

# 配置路由器

首先我们得理解路由器的工作原理，在配置的过程中才能理解为什么这么做。

比如我刚才配置了 PC1 的 ip 地址为 192.168.1.2，PC2 的 ip 地址为 192.168.2.2，那么这两个 PC 其实不是在同一个网段的，如果要 PC1 要和 PC2 通信，一定要通过路由器。比如我 PC1 要和 PC2 通信，那么就会先给路由器 1 发送一个数据包，告诉它我要和 PC2 通信。然后路由器 1 这里收到数据包后，发现目的 ip 地址对应的网段是 2.0，所以它会查看路由表（ip route 192.168.2.0 255.255.255.0 192.168.5.3）中网段 2.0 应该由哪个端口转发。在本例中，192.168.5.3 对应的是 se2/0 端口，所以路由器 1 就会把 PC1 发过来的数据包从 se2/0 端口转发出去，然后就到了路由器 2 这里，发现是目标 ip 地址为网段 2.0 的数据包，那么就会查看路由表，从 fa0/1 端口转发给出去（开启了 no shutdown），最终到达 PC2。PC2 到 PC1 其实也是同理。

在配置的过程中，路由器 1 的 fa0/1 端口 ip 地址对应为 192.168.1.1（作为 PC1 的网关），serial2/0 端口的 ip 地址为 192.168.5.2，路由器 2 的 fa0/1 端口 ip 地址对应为 192.168.2.1（作为 PC2 的网关），serial2/0 端口的 ip 地址为 192.168.5.3。这样两个路由器的 se2/0 端口的 ip 地址都是在 5.0 的网段。

以下为配置指令。

对于路由器 1:

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
> 对于图中的 ip 路由，C 为连接状态，S 为配置的静态路由。

![在这里插入图片描述](https://img-blog.csdnimg.cn/47e25b70ca3941f9a773fa642b90b879.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 7 路由器 1 路由配置结果

对于路由器 2：

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

注意到路由器 2 并没有在 serial2/0 端口配置 clockwise，这是因为之前提到的两个路由器的 se2/0 端口使用的是 serial DCE 进行连接，先连接的是路由器 1，所以只需要配置路由器 1 se2/0 端口的时钟频率即可。

![在这里插入图片描述](https://img-blog.csdnimg.cn/36fdb190080941ed971e7e2d286592f8.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 8 路由器 2 路由配置结果

# 测试路由功能

一切配置完毕之后，我们就可以用 PC1 来 ping PC2 的 ip 地址。进入 PC1 的控制台，输入 ipconfig 查看 PC1 的 ip 地址。

![在这里插入图片描述](https://img-blog.csdnimg.cn/a719bab36ef44cffa500cb96481b716e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 9 PC1 IP 地址
> 然后输入 PC2 的 ip 地址测试结果：

![在这里插入图片描述](https://img-blog.csdnimg.cn/39f4da295aea481c99327351f214e6d4.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 10 测试结果

发现可以 ping 通，说明静态路由配置成功。

# 总结方法

配置静态路由需要注意以下几点：

1. 需要有目标 IP；
2. 需要有与静态路由直接相连的下一路由器接口的 IP 地址或静态路由的本地接口；
3. 静态路由是由管理员手动设置的，除非管理员干预，否则静态路由不会发生变化；

静态路由的特点：

1. 静态路由是单向的；
2. 静态路由缺乏灵活性；
3. 允许对路由的行为进行精准的控制；
