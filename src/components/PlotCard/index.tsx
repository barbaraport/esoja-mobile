import React from 'react';
import { Avatar } from 'react-native-paper';
import { translate } from '../../data/I18n';
import { Plot } from '../../data/Model/Plot';
import { defaultImage } from '../../utils/default';
import {
  InformationContainer,
  PlotArea,
  PlotCropYear,
  PlotInformationContainer,
  PlotName,
  PlotProduction
} from './styles';

interface PlotCardProps {
  plot: Plot;
  onPress: (plotId: string) => void;
}

export const PlotCard: React.FC<PlotCardProps> = ({ plot, onPress }) => {
  return (
    <PlotInformationContainer onPress={() => onPress(plot.id)}>
      <Avatar.Image source={{ uri: plot?.photo || defaultImage }} />
      <InformationContainer>
        <PlotName>{plot?.description}</PlotName>
        <PlotCropYear>
          {translate('plots.PlotCardCropYear')}: {plot?.cropYear}
        </PlotCropYear>
        <PlotArea>{translate('plots.PlotCardPlants.area')}: {plot?.areaTotal} {translate('plots.PlotCardPlants.areaSize')}</PlotArea>
        {plot?.expectedProduction !== null && (
          <PlotProduction>
            {translate('plots.PlotCardProdExpectation')}:{' '}
            {plot.expectedProduction.toFixed(2)} {translate('plots.PlotCardPlants.productionExpectation')}
          </PlotProduction>
        )}
      </InformationContainer>
    </PlotInformationContainer>
  );
};
