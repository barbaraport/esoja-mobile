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
      <SampleName>
        {translate('plots.PlotCardPlants.plant1')}
      </SampleName>
      <SampleData>
        {translate('plots.PlotCardPlants.pods')}: {sample?.podsPlantA}{' '}
      </SampleData>
      <SampleData>
        {translate('plots.PlotCardPlants.stage')}: {getStageText(sample?.stagePlantA)}
      </SampleData>
      <SampleName>
        {translate('plots.PlotCardPlants.plant2')}
      </SampleName>
      <SampleData>
        {translate('plots.PlotCardPlants.pods')}: {sample?.podsPlantB}{' '}
      </SampleData>
      <SampleData>
        {translate('plots.PlotCardPlants.stage')}: {getStageText(sample?.stagePlantB)}
      </SampleData>
    </SampleInformationContainer>
  );
};

function getStageText(stageCode: number) {
  switch (stageCode) {
    case 1:
      return translate('CreatePlotStepSix.selectVegetativeDevelopment');
    case 2:
      return translate('CreatePlotStepSix.selectFlowering');
    case 3:
      return translate('CreatePlotStepSix.selectGrainFilling');
    case 4:
      return translate('CreatePlotStepSix.selectMaturation');
    case 5:
      return translate('CreatePlotStepSix.selectDesiccatedMaturation');
    case 6:
      return translate('CreatePlotStepSix.selectInHarvest');
    default:
      return translate('plots.PlotCardPlants.stageNotFound');
  }
}
