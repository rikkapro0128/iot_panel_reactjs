import ProgressBar from 'react-customizable-progressbar';
import { useEffect, useState } from 'react';

import Tooltip from '@mui/material/Tooltip';

import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TimelineIcon from '@mui/icons-material/Timeline';
import InfoIcon from '@mui/icons-material/Info';

import MenuPopover from '@/components/popover';

const colorStart = {
  h: 124,
  s: 100,
  l: 65
};

const payloadDropDown = [
  {
    eventKey: 'hidden',
    name: 'Ẩn đi',
    Icon: <VisibilityOffIcon />,
  },
  {
    eventKey: 'view-chart',
    name: 'Xem biểu đồ',
    Icon: <TimelineIcon />,
  },
  {
    eventKey: 'detail-sensor',
    name: 'Chi tiết về sensor',
    Icon: <InfoIcon />,
  },
]

const getPercent = (value, ladder) => {
  return Math.floor((value / ladder) * 100);
}

export function SensorDefault(props) {
  const [color, setColor] = useState(colorStart);
  const [percentProgress, setPercentProgress] = useState(0);

  function handleSelectMenu({ eventKey, actions }) {
    // hanlde selection is here
    props.handleOptions({ eventKey, actions });
  }

  useEffect(() => {
    let percentParse = getPercent(props.value, props.ladder || 100);
    setPercentProgress(percentParse);
    percentParse = props.reverseColor ? (props.ladder || 100) - percentParse : percentParse;
    setColor({ ...color, h: Math.floor((percentParse * colorStart.h) / 100) });
  }, [props.value])

  return (
    <div className="bg-[#292d33] rounded p-2.5 animate-[load-smooth_200ms_ease-in-out_alternate]">
      <div className='flex justify-between	'>
        <p className="text-lg text-center">{props.title}</p>
        <MenuPopover
          id={'controll-id-user-dropdown'}
          target={'user-dropdown'}
          placement={'bottomEnd'}
          dataDropDown={payloadDropDown}
          handleSelect={handleSelectMenu}
        >
          <Tooltip title="Chi tiết" placement="bottom-end">
            <IconButton aria-label="view-more" size="small">
              <MoreVertIcon className='text-white	' color='inherit' />
            </IconButton>
          </Tooltip>
        </MenuPopover>
      </div>
      <div className='m-auto' style={{ width: `${props.size}px`, height: `${props.size}px` }}>
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
            <div className="lg:text-3xl md:text-2xl md:font-bold	 text-center">{props.value}{props.unit}</div>
          </div>
        </ProgressBar>
      </div>
    </div>
  );
}
