import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components';
import { i18nConfig } from './src/data/I18n';
import theme from './src/global/styles/theme';
import { useApp } from './src/hooks/useApp';
import { AuthProvider } from './src/hooks/useAuth';
import { HomeProvider } from './src/hooks/useHome';
import { LocationProvider } from './src/hooks/useLocation';
import { PlotProvider } from './src/hooks/usePlot';
import { PropertyProvider } from './src/hooks/useProperty';
import { SampleProvider } from './src/hooks/useSample';
import { StatisticsProvider } from './src/hooks/useStatistics';
import { UploadProvider } from './src/hooks/useUpload';
import { Routes } from './src/routes';

SplashScreen.preventAutoHideAsync();

export const App: React.FC = () => {
  const { handleChangeTheme, getStoredTheme, fontsLoaded, selectedTheme } =
    useApp();

  useEffect(() => {
    i18nConfig();
    getStoredTheme();
  }, [getStoredTheme]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider theme={theme[selectedTheme]}>
      <AuthProvider>
        <LocationProvider>
          <UploadProvider>
            <HomeProvider>
              <SampleProvider>
                <PlotProvider>
                  <PropertyProvider>
                    <StatisticsProvider>
                      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
                        <SafeAreaProvider>
                          <StatusBar
                            barStyle={
                              selectedTheme === 'dark'
                                ? 'light-content'
                                : 'dark-content'
                            }
                            backgroundColor="transparent"
                            translucent
                          />
                          <Routes />
                        </SafeAreaProvider>
                      </GestureHandlerRootView>
                    </StatisticsProvider>
                  </PropertyProvider>
                </PlotProvider>
              </SampleProvider>
            </HomeProvider>
          </UploadProvider>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
