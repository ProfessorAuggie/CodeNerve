import React from 'react';
import { WhimsicalMindMap } from './WhimsicalMindMap';

interface DsaMindMapGraphProps {
  fitScreen?: boolean;
}

export const DsaMindMapGraph: React.FC<DsaMindMapGraphProps> = ({ fitScreen = true }) => {
  return <WhimsicalMindMap fitScreen={fitScreen} />;
};

export default DsaMindMapGraph;
