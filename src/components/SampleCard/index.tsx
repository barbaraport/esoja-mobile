import React from 'react';
import { SampleData, SampleInformationContainer, SampleName } from './styles';
import { translate } from '../../data/I18n';

interface SampleCardProps {
  sample: any;
}

export const SampleCard: React.FC<SampleCardProps> = ({ sample }) => {
  return (
    <SampleInformationContainer>
      <SampleName>{sample?.name}</SampleName>
      <SampleData>
        {translate('plots.PlotCardPlants.plant1')}: {sample?.grainsPlant1}{' '}
        {translate('plots.PlotCardPlants.grains')}
      </SampleData>
      <SampleData>
        {translate('plots.PlotCardPlants.plant2')}: {sample?.grainsPlant2}{' '}
        {translate('plots.PlotCardPlants.grains')}
      </SampleData>
      {!!sample?.description && (
        <SampleData>
          {translate('plots.PlotCardPlants.description')}: {sample?.description}
        </SampleData>
      )}
    </SampleInformationContainer>
  );
};
