# 《计算机网络》 实验 3 ApacheWeb 服务器安装配置

![在这里插入图片描述](https://img-blog.csdnimg.cn/4aedf088072640c1aaded0ac0d020e7f.png)

> 图 1 实验步骤

# 前往 homebrew 官网安装命令行下载工具

![在这里插入图片描述](https://img-blog.csdnimg.cn/12c0d558314b4a4e8362292afd099193.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 2 homebrew 官网

# 输入 brew install apache2 下载 apache 服务

![在这里插入图片描述](https://img-blog.csdnimg.cn/ed269a37b7694cbf9d13d32af5a6eb33.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 3 apache 服务安装成功

从图中可以看出，我安装的 apache 服务是 2.4.41。

# 输入 sudo apachectl start 启动服务

![在这里插入图片描述](https://img-blog.csdnimg.cn/ba30756a8ffa4fb78b04004da6568f47.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 4 apache 启动页面

可以看到，apache 服务在 ip 地址 127.0.0.1 启动，端口为 8080（可在 httpd.conf 中看到）

4. 修改 apache 启动页面

在 Mac 终端软件中输入 cd /Library/WebServer/Documents,后输入
sudo vim index.html.en\~orig, 输入后可以进入 index.html 文件对 apache 启动主页进行修改，可以从图中看到我从终端中修改了主页的内容，修改为"19205133 zhaoqi"()

![在这里插入图片描述](https://img-blog.csdnimg.cn/18647e58730143faa8bf562ea0ec84ce.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 5 启动页面修改

# 重启 apache 服务

在终端输入 sudo apachectl restart

![在这里插入图片描述](https://img-blog.csdnimg.cn/b2cc0f4ae3a540e2bdab84be8b859b6a.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5aSp5LiLNTkxMg==,size_20,color_FFFFFF,t_70,g_se,x_16)

> 图 6 启动页面修改成功

# 验证结果

实验结果表明，apache 页面设置成功。

# 实验总结

## 遇到的问题

1. apache 无法安装
   解决办法： 安装了 VPN，同时没有更新 homebrew，因此需要输入 brew update 进行更新。

2. index.html 文件无法修改
   解决办法： 要进入管理员模式，再输入 sudo vim index.html.en\~orig。

## 体会

apache 是世界排名第一的 web 服务器软件，在这次实验中，让我极大地提升了命令行的使用。同时 apache 服务的便携性让我感受到 web 服务器的魅力。
