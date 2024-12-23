export const CONFIG = {
    API_GATEWAY: "http://localhost:8080/api/v1",
  };
  
  export const API = {
    LOGIN: "/identity/auth/customer/log-in",
    MY_INFO: "/identity/user/get-info",
    INTROSPECT:"/identity/auth/introspect"
  };

//  Tệp này chứa các cấu hình cần thiết cho ứng dụng, bao gồm các URL của API và các endpoint cụ thể.
//  API_GATEWAY là địa chỉ cơ bản của API mà các yêu cầu sẽ gửi đến.
//  API chứa các endpoint cụ thể cho việc đăng nhập (LOGIN) và lấy thông tin người dùng (MY_INFO)​(configuration).