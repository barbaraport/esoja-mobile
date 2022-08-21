import { ReactNativeFirebase } from "@react-native-firebase/app";
import { firebase } from "@react-native-firebase/storage";

export async function getApp(): Promise<ReactNativeFirebase.FirebaseApp> {

    const projectName: string = 'eSoja';
    const firebaseApps: Array<ReactNativeFirebase.FirebaseApp> = firebase.apps;

    // Delete "secondary" if it exists
    firebaseApps.forEach(async firebaseApp => {
        if (firebaseApp.name !== projectName) {
            await firebaseApp.delete();
        }
    });

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
