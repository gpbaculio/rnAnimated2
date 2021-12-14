import React, {useState} from 'react';
import styled from 'styled-components/native';

import BarChart from './BarChart';
import Counties from './Counties';
import Globe from './Globe';
import WebChart from './WebChart';

const D3Chart = () => {
  const [enableScroll, setEnableScroll] = useState(true);
  const handleScroll = (b: boolean) => {
    setEnableScroll(b);
  };
  return (
    <Container scrollEnabled={enableScroll}>
      <BarChart />
      <WebChart handleScroll={handleScroll} />
      <Counties handleScroll={handleScroll} />
      <Globe />
    </Container>
  );
};

export default D3Chart;

const Container = styled.ScrollView`
  background-color: #f5f5f5;
`;
