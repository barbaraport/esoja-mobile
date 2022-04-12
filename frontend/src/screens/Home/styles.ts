import styled from "styled-components/native";
import { MenuCard } from "../../components/MenuCard";
import { RFFontSize, RFHeight, RFWidth } from "../../utils/getResponsiveSizes";

export const HomeContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary};
  padding-top: 48px;
`;

export const HomeMenuContainer = styled.View`
  position: relative;
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: ${RFHeight(32)}px;
  background-color: ${({ theme }) => theme.colors.background};
  border-top-left-radius: ${RFHeight(24)}px;
  border-top-right-radius: ${RFHeight(24)}px;
`;

export const HomeMenuCardWidgetContainer = styled.View`
  flex-direction: row;
  position: absolute;
  top: -${RFHeight(40)}px;
  justify-content: space-evenly;
  width: 100%;
`;

export const HomeMenuContentContainer = styled.View`
  flex: 1;
  width: 100%;
  margin: ${RFHeight(60)}px 0;
  padding: 0 ${RFHeight(16)}px;
`;

export const MenuCardContainer = styled.View`
  flex: 1;
  width: 100%;
  margin-top: ${RFHeight(40)}px;
`;
