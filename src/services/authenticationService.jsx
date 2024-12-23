import { getToken, removeToken, setToken } from "./localStorageService";
import httpClient from "../configurations/httpClient";
import { API, CONFIG } from "../configurations/configuration";

export const logIn = async (username, password) => {
  const response = await httpClient.post(API.LOGIN, {
    username: username,
    password: password,
  });

  if (response.data?.authenticated) {
    setToken(response.data.token);
    return response.data;
  }

  throw new Error("Xác thực thất bại!");
};

export const introspect = async () => {
  const token = getToken();
  if (token === null) return false;

  try {
    const response = await fetch(`${CONFIG.API_GATEWAY}/identity/auth/introspect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }), // Body gửi token
    });

    const data = await response.json();

    if (data?.valid === false) {
      removeToken(); // Xóa token nếu không hợp lệ
      return false;
    }

    return true; // Token hợp lệ
  } catch (error) {
    console.error("Lỗi khi gọi API introspect:", error);
    return false;
  }
};

// export const introspect = async () =>{
//   const token = getToken(); 
//   if(token === null)
//     return false;
//   const response = await httpClient.post(API.INTROSPECT, {
//     token: token
//   });

//   if(response.data?.valid === false)
//   {
//     removeToken();
//     return false;
//   }

//   return true;
// }

export const logOut = () => {
  removeToken();
};

export const isAuthenticated = () => {
  return getToken();
};

// Tệp này cung cấp các chức năng liên quan đến xác thực người dùng, như đăng nhập (logIn), đăng xuất (logOut) và kiểm tra trạng thái xác thực (isAuthenticated).

// Nó sử dụng httpClient để gửi yêu cầu đến API đăng nhập và lưu trữ token vào localStorage thông qua các phương thức từ localStorageService​(authenticationService)