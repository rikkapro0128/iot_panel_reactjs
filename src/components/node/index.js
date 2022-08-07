import { useEffect } from "react";
import { SensorDefault } from '@/components/sensor';

function Node(props) {
  useEffect(() => {
    props.modifyStatus(props["node-payload"].status);
  }, [props["node-payload"].path]);

  return (
    <div className="flex">
      <SensorDefault reverseColor={true} ladder={100} size={ 150 } value={56} unit={'°C'} title={'Nhiệt độ'}/>
      <SensorDefault size={ 150 } value={69} unit={'%'} title={'Độ ẩm'}/>
      <SensorDefault size={ 150 } value={355} ladder={1000} unit={'ppm'} title={'Oxi'}/>
      <SensorDefault reverseColor={true} size={ 150 } value={35} unit={'dB'} title={'Âm thanh'}/>
      <SensorDefault reverseColor={true} size={ 150 } value={5} unit={'LPG'} title={'Khí ga'}/>
    </div>
  );
}

export { Node };
