import { useEffect } from "react";
import { SensorDefault } from '@/components/sensor';

function Node(props) {
  useEffect(() => {
    props.modifyStatus(props["node-payload"].status);
  }, [props["node-payload"].path]);

  return (
    <div className="">
      <SensorDefault size="180" value={24} unit={'%'} title={'Nhiệt độ'}/>
    </div>
  );
}

export { Node };
