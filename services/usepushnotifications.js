// import { useState,useEffect, useRef } from "react";
// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
// import Constants from "expo-constants";
// import { Platform } from "react-native";

// export interface PushNotificationState {
//     notification?:Notifications.Notification;
//     expoPushToken?: Notifications.ExpoPushToken;
// }

// export const usePushNotifications = (): PushNotificationState => {
//     Notifications.setNotificationHandler({
//      handleNotification: async() =>({
//         shouldPlaySound: false,
//         shouldShowAlert: true,
//         shouldSetBadge: false,
//      })
//     });
 
//     const {expoPushToken,setExpoPushToken} = useState<
//         Notifications.ExpoPushToken | undefined
//     >();

//     const [notification,setNotification] = useState<
//         Notifications.Notification | undefined
//     >();

//     const notificationlistener = useRef<Notifications.Subscription>();
//     const responselistener = useRef<Notifications.Subscription>();

//     async function registerforpushnotificationsasync {
//         let token;

//         if(Device.isDevice){
//             const{status:existingStatus} = 
//                 await Notifications.getPermissionsAsync();
            
//             let finalStatus = existingStatus;

//             if (existingStatus !== "granted") {
//                 const {status} = await Notifications.requestPermissionsAsync();
//                 finalStatus = status;
//             }
//             if(finalStatus !== "granted"){
//                 alert("Failed to get push token");
//             }
        
//             token = await Notifications.getDevicePushTokenAsync({
//                 projectId: Constants.expoConfig?.extra?.eas?.projectId,

//             });
//             if (Platform.OS === 'android'){
//                 Notifications.setNotificationChannelAsync("default",{
//                     name:'default',
//                     importance:Notifications.AndroidImportance.MAX,
//                     vibrationPattern:[0,250,250,250],
//                     lightColor:"#FF231F7C",
//                 });
//             }
//             return token;
//         }else{
//             console.log("Error: Please use a physical device");
//         }
//     }
//     useEffect(()=>{
//         registerforpushnotificationsasync().then((token)=>{
//             setExpoPushToken(token);
//         });

//         notificationlistener.current = 
//             Notifications.addNotificationReceivedListener((notification)=>{
//                 setNotification(notification);
//             });
//         responselistener.current = 
//             Notifications.addNotificationResponseReceivedListener((response)=>{
//                 console.log(response);
//             });
//         return()=>{
//             Notifications.removeNotificationSubscription(
//                 notificationlistener.current!
//             );
//             Notifications.removeNotificationSubscription(responselistener.current!);
//         };
//     },[]);

//     return{
//         expoPushToken,
//         notification,
//     };

// };