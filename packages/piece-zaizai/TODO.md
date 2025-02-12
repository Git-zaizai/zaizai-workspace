## docker 安装 nginx 
https://blog.csdn.net/BThinker/article/details/123507820
https://blog.csdn.net/m0_74823863/article/details/144793022

docker run \
-p 80:80 \
-p 443:443 \
--name nginx \
-v /home/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
-v /home/nginx/conf/conf.d:/etc/nginx/conf.d \
-v /home/nginx/log:/var/log/nginx \
-v /home/nginx/html:/usr/share/nginx/html \
-d nginx:latest
