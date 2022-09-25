import { ReactNativeFirebase } from "@react-native-firebase/app";
import { firebase } from "@react-native-firebase/storage";

/**
 * gets an instance from the eSoja firebase app
 * 
 * @return {Promise<ReactNativeFirebase.FirebaseApp>} the firebase app instance
 * 
 * @author Port, B.
 */
export async function getApp(): Promise<ReactNativeFirebase.FirebaseApp> {
    const projectName: string = 'eSoja';

    const options: ReactNativeFirebase.FirebaseAppOptions = {
        apiKey: "AIzaSyBPD--ZaVpQAHxyzHIyZCJa-POf1dqQ3Eo",
        appId: "1:391481097709:android:9ef13137d0d2e4276f3be4",
        projectId: "esoja-90347",
        databaseURL: "https://esoja-90347-default-rtdb.firebaseio.com",
        messagingSenderId: '391481097709',
        storageBucket: "esoja-90347.appspot.com",
    };

    if (firebase.apps[0].name === '[DEFAULT]' && firebase.apps.length <= 1) {
        return await firebase.initializeApp(options, projectName);
    }
    else {
        return firebase.app(projectName);
    }
}
