# Đề tài môn hệ điều hành - Lớp CTK42

## Tác giả:

- CTK42 - 1812751 - Nguyễn Thị Hà 

- CTK42 - 1812756 - Nguyễn Trọng Hiếu

## Giới thiệu về đề tài:

- Chương trình tương tự File Explorer, cho phép người dùng tương tác với các tập tin và thư mục. Tuy nhiên hoạt động thông qua môi trường internet, tức là người dùng có thể dùng các thiết bị có thể truy cập vào internet như máy tính, điện thoại thông minh,... để truy cập và quản lý.

- Gồm các chức năng chính như sau:
  
  - Quản lý thư mục, tập tin: các thao tác như tạo mới, đổi tên, xóa, cập nhật nội dung, copy, cut, paste
  
  - Có cây thư mục cho phép người dùng quan sát trực quan hệ thống thư mục, tập tin trong máy
  
  - Có thanh điều hướng giúp người dùng xem đường dẫn hiện tại, bên cạnh đó cho phép người dùng di chuyển nhanh giữa thư mục hiện tại và các thư mục trước đó

## Tổng quan kiến trúc code

- Gồm 2 phần riêng biệt, backend chạy trên môi trường NodeJS và frontend được viết bởi Javascript ES6, HTML, CSS, Bootstrap

- Backend được thiết kế theo dạng Web service, tạo 1 API cung cấp các end point tương ứng với các thao tác quản lý thư mục, tập tin

- Giao diện người dùng được render thông qua cơ chế CLR (Client Side Rendering). Code Javascript ở frontend thực hiện gọi AJAX đến các end point được cung cấp bởi API, sau đó nhận về chuỗi JSON kết quả để tiến hành tạo các thành phần tương ứng trên giao diện và chèn vào DOM để hiển thị

## Hướng dẫn cài đặt

- Chú ý: Phiên bản Node và NPM
  
  - Phiên bản node hiện tại: 12.19.0 `node -v`
  
  - Phiên bản npm hiện tại: 6.14.8 `npm -v`

- Clone repo về: `git clone https://github.com/DalatCoder/webos-hedieuhanh`

- Mở terminal và di chuyển vào thư mục webos-hedieuhanh vừa clone và chạy lệnh: `npm install`

- Di chuyển vào thư mục client: `cd client`

- Cài đặt hết các thư viện mà frontend cần: `npm install`

- Di chuyển về thư mục ban đầu: `cd ..`

- Chạy server ở backend và server ở client cùng lúc: `npm run dev`
