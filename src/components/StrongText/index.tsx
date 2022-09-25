import React from 'react';
import { StrongTextStyled } from './styles';

interface StrongTextProps {}

export const StrongText: React.FC<StrongTextProps> = ( children ) => {
  return <StrongTextStyled>{Object.values(children)[0]}</StrongTextStyled>;
};
