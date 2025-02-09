import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { FieldValues } from 'react-hook-form';
import { ImageSourcePropType } from 'react-native';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import { api } from '../data/services/api';
import { useUpload } from './useUpload';

export interface Sample {
  metersBetweenPlants?: string;
  plantsPerMeter?: string;
  plantA?: {
    plantASize?: string;
    plantAStage?: string;
    plantAImage?: ImageOrVideo;
    plantBSize?: string;
    plantBStage?: string;
    plantBImage?: ImageOrVideo;
  };
  plantB?: {
    plantASize?: string;
    plantAStage?: string;
    plantAImage?: ImageOrVideo;
    plantBSize?: string;
    plantBStage?: string;
    plantBImage?: ImageOrVideo;
  };
  plantC?: {
    plantASize?: string;
    plantAStage?: string;
    plantAImage?: ImageOrVideo;
    plantBSize?: string;
    plantBStage?: string;
    plantBImage?: ImageOrVideo;
  };
  cultiveId?: string;
}

interface SampleContextData {
  saveStep: (data: FieldValues) => Promise<void>;
  getPersistedData: () => Promise<Sample | null>;
  createSample: (photoUri: string) => Promise<any>;
}

type SampleContextProps = {
  children: ReactNode;
};

const SampleContext = createContext({} as SampleContextData);

const SampleProvider: React.FC<SampleContextProps> = ({ children }) => {
  const [sample, setSample] = useState<Sample | null>(null);
  const { pictureUpload } = useUpload();

  const persistData = async (data: Sample) => {
    await AsyncStorage.setItem('@esoja:sample', JSON.stringify(data));
  };

  const removeData = async () => {
    await AsyncStorage.removeItem('@esoja:sample');
  };

  const getPersistedData = useCallback(async () => {
    if (sample) {
      return sample;
    }
    const data = await AsyncStorage.getItem('@esoja:sample');
    if (data) {
      setSample(JSON.parse(data));
      return JSON.parse(data);
    }
    return null;
  }, [sample]);

  const saveStep = useCallback(
    async (data: FieldValues) => {
      setSample(prev => ({ ...prev, ...data }));
      await persistData({ ...sample, ...data });
    },
    [sample]
  );

  const createSample = useCallback(
    async (photoUri: string) => {
      const fullData: Sample = await getPersistedData();
      const updatePlot = {
        plantsPerMeter: fullData?.plantsPerMeter,
        metersBetweenPlants: (Number(fullData?.metersBetweenPlants) || 0) / 100,
      };
      await api.put(
        `/cultive/sample-information/${fullData?.cultiveId}`,
        updatePlot
      );
      const newSample = {
        cultiveId: fullData?.cultiveId,
        samples: [
          { ...fullData?.plantA, name: 'Amostra 1' },
          { ...fullData?.plantB, name: 'Amostra 2' },
          { ...fullData?.plantC, name: 'Amostra 3' }
        ]
      };
      await api.post('/sample', newSample);
      removeData();
    },
    [getPersistedData, pictureUpload]
  );

  const providerValue = useMemo(
    () => ({
      saveStep,
      getPersistedData,
      createSample
    }),
    [saveStep, getPersistedData, createSample]
  );
  return (
    <SampleContext.Provider value={providerValue}>
      {children}
    </SampleContext.Provider>
  );
};

const useSample = () => {
  const context = useContext(SampleContext);

  if (!context) {
    throw new Error('useSample must be used within an SampleProvider');
  }

  return context;
};

export { useSample, SampleProvider };
