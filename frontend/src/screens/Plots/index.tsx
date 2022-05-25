import { Query } from 'nestjs-prisma-querybuilder-interface';
import React, { useCallback, useEffect, useState } from 'react';
import { PlotCard } from '../../components/PlotCard';
import { Separator } from '../../components/Separator';
import Title from '../../components/Title';
import { translate } from '../../data/I18n';
import { Plot } from '../../data/Model/Plot';
import { PlotsScreenRouteProps } from '../../data/routes/app';
import { useAuth } from '../../hooks/useAuth';
import { useSample } from '../../hooks/useSample';
import { AddButton, Container, Header, Icon, PlotList } from './styles';

export const Plots: React.FC<PlotsScreenRouteProps> = ({ navigation }) => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const { getPlot } = useSample();
  const { authUser } = useAuth();

  const getData = useCallback(async () => {
    const query: Query = {
      select: 'cropYear areaTotal photo',
      populate: [{ path: 'property', select: 'userId' }]
      // filter: [{ path: 'userId', operator: 'equals', value: authUser.id }]
    };
    setPlots(await getPlot(query));
  }, [getPlot]);

  useEffect(() => {
    const subscription = navigation.addListener('focus', () => {
      getData();
    });
    return subscription;
  }, [getData, navigation]);

  return (
    <Container>
      <Header>
        <Title
          title={translate('plots.plots')}
          subtitle={translate('plots.SeeAllYourPlots')}
        />
      </Header>

      <PlotList
        data={plots}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <Separator />}
        renderItem={({ item }) => <PlotCard plot={item} />}
      />

      <AddButton onPress={() => navigation.navigate('CreatePlotStepOne')}>
        <Icon name="plus" />
      </AddButton>
    </Container>
  );
};
