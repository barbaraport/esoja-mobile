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
        apiKey: "X",
        appId: "X",
        projectId: "X",
        databaseURL: "X",
        messagingSenderId: 'X',
        storageBucket: "X",
    };

    if (firebase.apps[0].name === '[DEFAULT]' && firebase.apps.length <= 1) {
        return await firebase.initializeApp(options, projectName);
    }
    else {
        return firebase.app(projectName);
    }
}
