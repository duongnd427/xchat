// import {
//     API_CHANGEPASS,
//     API_LOGIN,
//     DECRYPT_KEY,
//     API_FOLLOW,
//     API_SALE,
//     MV_SERVICE,
//     MV_SERVICE_DETECT,
//     API_Cmp_DATA,
//     API_CHECK_DATA_INFO,
//     API_REG_INFO_FROM_ID, API_CHECKSTATUS_VIDEO, API_ACCEPT_VIDEO, API_DETECT_USER, USER_INFO, IS_DETECTED, EXPIRE_TIME,API_REG_INFO_FROM_ID_NEW, API_CHECK_DATA_INFO_NEW
// } from "../../config/Config";
// import axios from 'axios';
// import Helper from "../../utils/helpers/Helper";
// import Router from 'next/router';
//
// function follow(idChannel, status) {
//     var bodyFormData = new FormData();
//     bodyFormData.set("channelId", idChannel);
//     bodyFormData.set("status", status);
//     bodyFormData.set("token", Helper.getTokenPost());
//
//     return axios.post(API_FOLLOW,
//         bodyFormData,
//         {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             },
//         }
//     ).catch(function (error) {
//         console.log(error);
//     });
// }
//
// function login(username, password) {
//     let timeStamp = new Date().getTime();
//     username = "84" + username;
//     password = Helper.md5Str(password);
//
//     var bodyFormData = new FormData();
//     bodyFormData.set("username", username);
//     bodyFormData.set("password", password);
//     bodyFormData.set("timestamp", timeStamp);
//
//     return axios.post(API_LOGIN,
//         bodyFormData,
//         {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             },
//         }
//     ).then(function (response) {
//
//         // handle success
//         let data = null;
//         if (response.status === 200) {
//             data = response.data;
//
//             if (data) {
//                 if (data.code === 200) {
//                     Helper.removeCookie(USER_INFO);
//                     Helper.removeCookie(IS_DETECTED);
//
//                     Helper.setUserInfo(data.dataEnc, false);
//                     let timeExp = new Date().getTime() + 1800000;
//                     let expires = new Date(timeExp); // 30 minutes
//                     Helper.setCookie(EXPIRE_TIME, timeExp, expires);
//                 } else {
//                     Helper.removeCookie(USER_INFO);
//
//                     //let error = (data && data.error.message);
//                     let error;
//                     if (data.code === 404) {
//                         error = 'Account chưa được khởi tạo.';
//                     } else if (data.code === 401) {
//                         error = 'Xác thực không thành công.';
//                     } else if (data.code === 505) {
//                         error = 'Có lỗi xảy ra.';
//                     } else {
//                         error = 'Đăng nhập không thành công.';
//                     }
//                     return Promise.reject(error);
//                 }
//
//             } else {
//                 let error = 'Đăng nhập không thành công.';
//                 return Promise.reject(error);
//             }
//         }
//         return data;
//     });
// }
//
// function logout() {
//     // remove user from local storage to log user out
//     Helper.removeCookie(USER_INFO);
//     Helper.removeCookie(EXPIRE_TIME);
//     let expires = new Date(new Date().getTime() + 1800000); // 30 minutes
//     Helper.setCookie(IS_DETECTED,100, expires);
//
//     Router.push(
//         { pathname: '/login'},
//         'login.html'
//     );
// }
//
// function changePassword(pass, newPass) {
//
//     let user = Helper.getUserInfo();
//     if (user) {
//         var bodyFormData = new FormData();
//         bodyFormData.set("oldpassword", Helper.md5Str(pass));
//         bodyFormData.set("newpassword", Helper.encryptStr(newPass));
//         bodyFormData.set("token", user.token);
//
//         return axios.post(MV_SERVICE + API_CHANGEPASS,
//             bodyFormData,
//             {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 },
//             }
//         ).then(function (response) {
//
//             // handle success
//             if (response.status === 200) {
//                 let data = response.data;
//                 Helper.renewToken(data);
//
//                 if (data) {
//                     if (data.code === 200) {
//
//                         let dataDec = Helper.decryptData(response.data.dataEnc);
//                         if (Helper.checkObjExist(dataDec, "token")) {
//                             user.token = dataDec.token;
//                             Helper.setUserInfo(user);
//                         }
//                         return true;
//                     } else if (data.code === 421) {
//                         let error = "Mật khẩu cũ không đúng.";
//                         return Promise.reject(error);
//                     } else {
//                         let error = 'Thao tác không thành công.';
//                         return Promise.reject(error);
//                     }
//
//                 } else {
//                     let error = 'Thao tác không thành công.';
//                     return Promise.reject(error);
//                 }
//             }
//         });
//     }
//
// }
//
// function getUserDetect() {
//     return axios.get(MV_SERVICE_DETECT + API_DETECT_USER,
//         {
//             headers: {
//                 'content-type': 'application/x-www-form-urlencoded'
//             },
//         }
//     );
// }
//
// function checkStatusVideo(security, videoId) {
//     var bodyFormData = new FormData();
//     bodyFormData.set("security", security);
//     bodyFormData.set("videoId", videoId);
//     bodyFormData.set("token", Helper.getTokenPost());
//
//     return axios.post(MV_SERVICE + API_CHECKSTATUS_VIDEO,
//         bodyFormData,
//         {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             },
//         }
//     ).then(function (response) {
//         // handle success
//         if (response.status === 200) {
//             let data = response.data;
//
//             if (data) {
//                 return data;
//             }
//         }
//     }).catch(function (error) {
//         console.log(error);
//     });
// }
//
// function acceptVideo(security, videoId, active) {
//     var bodyFormData = new FormData();
//     bodyFormData.set("security", security);
//     bodyFormData.set("videoId", videoId);
//     bodyFormData.set("active", active);
//     bodyFormData.set("token", Helper.getTokenPost());
//
//     return axios.post(MV_SERVICE + API_ACCEPT_VIDEO,
//         bodyFormData,
//         {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             },
//         }
//     ).then(function (response) {
//         // handle success
//         if (response.status === 200) {
//             return response;
//         }
//     }).catch(function (error) {
//         console.log(error);
//     });
// }
//
// function rejectVideo(security, videoId, desc) {
//     var bodyFormData = new FormData();
//     bodyFormData.set("security", security);
//     bodyFormData.set("videoId", videoId);
//     bodyFormData.set("desc", desc);
//     bodyFormData.set("token", Helper.getTokenPost());
//
//     return axios.post(MV_SERVICE + API_REJECT_VIDEO,
//         bodyFormData,
//         {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             },
//         }
//     ).then(function (response) {
//         // handle success
//         if (response.status === 200) {
//             return response;
//         }
//     }).catch(function (error) {
//         console.log(error);
//     });
// }
//
// function sale(from, id, category_id, channel_id) {
//     let token = Helper.getTokenPost();
//     let timestamp = new Date().getTime();
//     let security = Helper.encryptData(token + from + id + timestamp);
//     return axios.get(MV_SERVICE_DETECT + API_SALE, {
//         params: {
//             token: token,
//             from: from,
//             id: id,
//             timestamp: timestamp,
//             security: security,
//             category_id: category_id,
//             channel_id: channel_id
//         },
//     }).then(function (response) {
//         return response;
//     }).catch(function (error) {
//         console.log(error);
//     });
//
// }
//
// function checkDataInfoFromId(from, id, videoId, dataId) {
//     let token = Helper.getTokenPost();
//     let timestamp = new Date().getTime();
//     let security = Helper.encryptData(token + from + id + timestamp);
//     return axios.get(MV_SERVICE_DETECT + API_CHECK_DATA_INFO, {
//         params: {
//             token: token,
//             from: from,
//             id: id,
//             timestamp: timestamp,
//             video_id: videoId,
//             security: security,
//             dataId: dataId
//         },
//     }).then(function (response) {
//         return response;
//     })
//     .catch(function (error) {
//         console.log(error);
//     });
//
// }
//
// function regCmpData(from, id, category_id, channel_id, action) {
//     let token = Helper.getTokenPost();
//     let timestamp = new Date().getTime();
//     let security = Helper.encryptData(token + from + id + timestamp);
//     var bodyFormData = new FormData();
//     bodyFormData.set("from", from);
//     bodyFormData.set("id", id);
//     bodyFormData.set("timestamp", timestamp);
//     bodyFormData.set("security", security);
//     bodyFormData.set("category_id", category_id);
//     bodyFormData.set("channel_id", channel_id);
//     bodyFormData.set("action", action);
//     bodyFormData.set("token", Helper.getTokenPost());
//
//     return axios.post(MV_SERVICE_DETECT + API_Cmp_DATA,
//         bodyFormData,
//         {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             },
//         }
//     ).then(function (response) {
//         // handle success
//         if (response.status === 200) {
//             return response;
//         }
//     }).catch(function (error) {
//         console.log(error);
//     });
// }
//
// function regInfo(from, id, videoId, action) {
//     let token = Helper.getTokenPost();
//     let timestamp = new Date().getTime();
//     let security = Helper.encryptData(token + from + id + timestamp);
//     var bodyFormData = new FormData();
//     bodyFormData.set("from", from);
//     bodyFormData.set("id", id);
//     bodyFormData.set("video_id", videoId);
//     bodyFormData.set("timestamp", timestamp);
//     bodyFormData.set("action", action);
//     bodyFormData.set("security", security);
//     bodyFormData.set("token", Helper.getTokenPost());
//
//     //return axios.post(MV_SERVICE_DETECT + API_REG_INFO_FROM_ID,//test ho DamTV
//
//     return axios.post(MV_SERVICE + API_REG_INFO_FROM_ID,
//         bodyFormData,
//         {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             },
//         }
//     ).then(function (response) {
//         // handle success
//         if (response.status === 200) {
//             return response;
//         }
//     }).catch(function (error) {
//         console.log(error);
//     });
// }
// function regInfoNew(from, id, videoId, action) {
//     let token = Helper.getTokenPost();
//     let timestamp = new Date().getTime();
//     let security = Helper.encryptData(token + from + id + timestamp);
//     var bodyFormData = new FormData();
//     bodyFormData.set("from", from);
//     bodyFormData.set("id", id);
//     bodyFormData.set("video_id", videoId);
//     bodyFormData.set("timestamp", timestamp);
//     bodyFormData.set("action", action);
//     bodyFormData.set("security", security);
//     bodyFormData.set("token", Helper.getTokenPost());
//
//     return axios.post(MV_SERVICE + API_REG_INFO_FROM_ID_NEW,
//         bodyFormData,
//         {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             },
//         }
//     ).then(function (response) {
//         // handle success
//         if (response.status === 200) {
//             return response;
//         }
//     }).catch(function (error) {
//         console.log(error);
//     });
// }
//
// function checkDataInfoFromIdNew(from, id, videoId, dataId) {
//     let token = Helper.getTokenPost();
//     let timestamp = new Date().getTime();
//     let security = Helper.encryptData(token + from + id + timestamp);
//     return axios.get(MV_SERVICE + API_CHECK_DATA_INFO_NEW, {
//         params: {
//             token: token,
//             from: from,
//             id: id,
//             timestamp: timestamp,
//             video_id: videoId,
//             security: security,
//             dataId: dataId
//         },
//     }).then(function (response) {
//         return response;
//     })
//         .catch(function (error) {
//             console.log(error);
//         });
//
// }
//
// export default {
//     regInfoNew,
//     login,
//     logout,
//     follow,
//     changePassword,
//     getUserDetect,
//     checkStatusVideo,
//     acceptVideo,
//     rejectVideo,
//     sale,
//     regCmpData,
//     regInfo,
//     checkDataInfoFromId,
//     checkDataInfoFromIdNew
// };
