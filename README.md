# :vibration_mode: eSoja app :seedling:
## :running_woman: How to run the app

First of all, you'll need to clone the repository. Pay attention to the path of the clone that you'll download. Avoid any folders having special characters and/or spaces in the name. Afterwards, follow these steps:

## Android :robot:

1. Install the JDK (Java Development Kit). We recomend using the [JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html). You may need to restart your computer to the installation be recognized.
2. Install the NodeJS. You may need to restart your computer to the installation be recognized.
3. Create the environment variable ```JAVA_HOME```. It will have the path where the JDK is installed. For example: ```C:\Program Files\Java\jdk-17.0.0```.
4. Add the path ```C:\Program Files\Java\jdk-17.0.0\bin``` (don't forget to verify your JDK's version) to an already existing variable called `Path` in the system variables. Create a new line (:warning: be careful to don't change existing paths :warning:) This step makes Java commands recognizable in the terminal.
5. Type ```java --version``` in the terminal to see if everything is configured correctly. If it doesn't work, restart your computer to make sure everything has been applied. If it still doesn't work, check that you correctly configured the variables in the previous steps.
6. Install Android Studio to get the necessary SDK to run your app on a mobile device.
7. Create an environment variable for the system called ANDROID_HOME. Its value should be the Android SDK path inside your computer. Example: `C:\Users\username\AppData\Local\Android\Sdk`.
8. Add the path `C:\Users\username\AppData\Local\Android\Sdk\platform-tools` to an already existing variable called ```Path``` in the system variables.  Create a new line (:warning: be careful to don't change existing paths :warning:) This step makes ADB commands recognizable in the terminal. Type ```adb devices``` to check. Thus, when connecting your smartphone via USB, you can see if it is recognized as a device capable of running the app or not.
9. In your mobile device's developer settings, enable the `USB debugging` option so that your smartphone can be recognized as an available device and the app can be installed on your mobile via USB. Due to some Android customizations, it you may also need to enable more settings available under `Install via USB` in order for the app to install successfully. Check all available options in your mobile developer settings.
10. Open the `esoja-mobile` folder in Visual Studio Code. This folder corresponds to the mobile app's React Native project.
11. In the terminal, run the ```npm install``` command to install all the app's dependencies, you may need to add the ```--legacy-peer-deps``` or ```--force``` argument.
12. Another detail for you to have the full experience: you need to run the [back-end fom the app's functionalities in a new version](https://github.com/barbaraport/esoja-api) and the [back-end of the new app functionality](https://github.com/barbaraport/softtelie-ehsoja/tree/main/src/server/imageRecognition) and insert **IP Address** and the **port** in the `esoja-mobile\src\data\services\api.ts` file.
13. Enter the Open Weather API keys in the ```\src\data\services\weather.services.ts``` file.
14. The simplest way to run the application is via USB. So, connect your phone to the computer. The cell phone must be unlocked.
15. Make sure you are in the `esoja-mobile` folder and run our app with the ```npm run android``` command. The app will go through a build process and the first time may take a while. When everything is finished, the app will automatically open on your phone!
