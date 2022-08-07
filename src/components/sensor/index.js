import ProgressBar from 'react-customizable-progressbar';

export function SensorDefault(props) {
  return (
    <div className={`w-[${props.size}px] h-[${props.size}px]`}>
      <ProgressBar
        { ...props }
        radius={100}
        progress={80}
        strokeWidth={18}
        strokeColor="#a0d468"
        strokeLinecap="round"
        trackStrokeWidth={18}
        counterClockwise
      >
        <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
          <div className="text-3xl text-center">{props.value}{props.unit}</div>
          <div className="text-md text-center">{props.title}</div>
        </div>
      </ProgressBar>
    </div>
  );
}
