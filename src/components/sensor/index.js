import ProgressBar from 'react-customizable-progressbar';
import { useEffect, useState } from 'react';

import Tooltip from '@mui/material/Tooltip';
import iconSensorByModel from '@/utils/iconSensorByModel.js';

import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TimelineIcon from '@mui/icons-material/Timeline';
import InfoIcon from '@mui/icons-material/Info';

import { MuiMenu } from "@/components/popover";

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
  const [anchorMenu, setAnchorMenu] = useState(null);
  const [percentProgress, setPercentProgress] = useState(0);

  function handleSelectMenu({ eventKey }) {
    // hanlde selection is here
    props.handleOptions({ eventKey });
  }

  useEffect(() => {
    let percentParse = getPercent(props.value, props.ladder || 100);
    setPercentProgress(percentParse);
    percentParse = props.reverseColor ? (props.ladder || 100) - percentParse : percentParse;
    setColor({ ...color, h: Math.floor((percentParse * colorStart.h) / 100) });
  }, [props.value])

  return (
    <div className="bg-[#292d33] rounded p-2.5 animate-[load-smooth_200ms_ease-in-out_alternate]">
      {/* menu on mobile */}
      <MuiMenu id='account' anchorEl={anchorMenu} payload={payloadDropDown} onEventKey={ handleSelectMenu } onClose={() => { setAnchorMenu(null) }} onClick={() => { setAnchorMenu(null) }} />
      <div className='flex justify-between items-center'>
        <img className='block w-10 h-auto mr-2' src={props.model in iconSensorByModel ? `${process.env.REACT_APP_SERVER_API_HOST}/static/common/${iconSensorByModel[props.model]}.svg` : ''} alt={props.model} />
        <Tooltip title={ props.title } placement="top">
          <p className="cursor-help text-sm text-center whitespace-nowrap">
            { props.title }
          </p>
        </Tooltip>
        <Tooltip title="Chi tiết" placement="bottom-end">
          <IconButton onClick={ (event) => { setAnchorMenu(event.currentTarget) } } aria-label="view-more" size="small">
            <MoreVertIcon className='text-white	' color='inherit' />
          </IconButton>
        </Tooltip>
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
