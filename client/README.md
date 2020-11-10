# Giao diện frontend của đề tài File Explorer

## Tác giả:

- CTK42 - 1812751 - Nguyễn Thị Hà

- CTK42 - 1812756 - Nguyễn Trọng Hiếu

## Tổng quan kiến trúc code

- CSR (Client Side Rendering): việc hiển thị giao diện người dùng được quyết định bởi Javascript

- Quy trình: 
  
  - B1: JS gọi AJAX đến end point tương ứng ở server
  
  - B2: Server phản hồi JSON
  
  - B3: JS parse JSON phản hồi và tạo các thành phần tương ứng (Gồm HTML + chèn các class để định kiểu)
  
  - B4: Chèn thành phần vừa tạo vào DOM để hiển thị

- Đây là 1 ứng dụng web, người dùng tương tác trực tiếp, giao diện tự động hiển thị tương ứng với thao tác, người dùng không cần phải reload lại trang web để thấy sự thay đổi

- Các công nghệ được sử dụng:
  
  - Javascript ES6
  
  - Thư viện fancy-tree để hiển thị cây thư mục
  
  - SASS
  
  - Bootstrap
  
  - Webpack
  
  - Babel
  
  - Linter: jslint
  
  - Code formater: prettier

## Lưu ý trong trường hợp cài thư viện bị lỗi:

- `npx install-peerdeps --dev eslint-config-airbnb`
- `npm install node-sass --unsafe-perms`
