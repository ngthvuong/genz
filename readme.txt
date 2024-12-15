- Khi chạy ứng dụng, cần chép đầy đủ mã nguồn Express - NodeJs, file môi trường (.env).
- Cài đặt nodejs vào máy (https://nodejs.org/en/). Mở command line gõ `node -v` để kiểm tra node đã được cài đặt
- Cài đặt Posgres SQL Server và tạo mới một database
- Cài đặt Redis:
    + Server Ubuntu ảo (Đối với môi trường Window): https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-windows/
    + Môi trường Ubuntu: 
        sudo apt update && sudo apt upgrade -y
        sudo apt install redis-server -y

- Điều hướng đến thư mục chứa mã nguồn bằng lệnh `cd path/to/your-project`

* Khởi tạo ứng dụng
    - Mở command line cài đặt thư viện: npm install

* Hướng dẫn Thầy kết nối database và tạo bảng:
	- Kết nối với database thông qua các biến môi trường trong file config\config.json tương ứng với môi trường
	- Tạo bảng tự động: node .\syncDB.js 
    - Tạo dữ liệu mẫu: npx sequelize db:seed:all

* Chạy ứng dụng:
	- Đối với môi trường dev, khởi động ứng dụng bằng lệnh `npx nodemon`
	- Đối với môi trường production
        + Cài đặt pm2: sudo npm install -g pm2
        + tạo tiến trình cho ứng dụng: pm2 start index.js --watch --ignore-watch="node_modules logs" --update-env --name genz
