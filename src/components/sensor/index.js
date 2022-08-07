import ProgressBar from 'react-customizable-progressbar';
import { useEffect, useState } from 'react';

const colorStart = {
  h: 124,
  s: 100,
  l: 65
};

const getPercent = (value, ladder) => {
  return Math.floor((value / ladder) * 100);
}

export function SensorDefault(props) {
  const [color, setColor] = useState(colorStart);
  const [percentProgress, setPercentProgress] = useState(0);

  useEffect(() => {
    let percentParse = getPercent(props.value, props.ladder || 100);
    setPercentProgress(percentParse);
    percentParse = props.reverseColor ? (props.ladder || 100) - percentParse : percentParse;
    setColor({ ...color, h: Math.floor((percentParse * colorStart.h) / 100) });
  }, [props.value])

  return (
    <div style={{ width: `${props.size}px`, height: `${props.size}px` }}>
      <ProgressBar
        { ...props }
        progress={percentProgress}
        radius={100}
        strokeWidth={18}
        strokeColor={`hsl(${color.h}, ${color.s}%, ${color.l}%)`}
        strokeLinecap="round"
        trackStrokeWidth={18}
        counterClockwise
      >
        <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
          <div className="lg:text-3xl md:text-base md:font-bold	 text-center">{props.value}{props.unit}</div>
          <div className="text-md text-center">{props.title}</div>
        </div>
      </ProgressBar>
    </div>
  );
}
