import { useState, useEffect, useRef, useLayoutEffect, memo } from 'react';
import { CircleSlider } from 'react-circle-slider';
import 'slider-color-picker';
import Tooltip from '@mui/material/Tooltip';

const buttonShadow = {
  off: {
    shadow: 'shadow-[20px_20px_60px_#23262b,-20px_-20px_60px_#2f343b]',
    bg: 'linear-gradient(145deg, #2c3037, #25292e)',
    signal: 'rgb(107, 114, 128)'
  },
  on: {
    shadow: 'shadow-[20px_20px_60px_#23262b,-20px_-20px_60px_#2f343b]',
    bg: 'linear-gradient(145deg, #25292e, #2c3037)',
    signal: 'rgb(74, 222, 128)'
  }
}

const prefixName = {
  'RELAY': 'Relay',
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function ButtonPush(props) {
  const [click, setClick] = useState(() => props.status === 'ON' ? true : false );
  const [state, setState] = useState(buttonShadow.on);
  const [title, setTitle] = useState(props.model in prefixName ? `${prefixName[props.model]} ${props.title}` : props.title);

  useEffect(() => {
    if(click) {
      setState(buttonShadow.on);
      props.btnClick({ model: props.model, idDevice: props.idDevice, pins: [{ status: 'ON', val: props.val, gpio: props.gpio }] });
    }else {
      setState(buttonShadow.off);
      props.btnClick({ model: props.model, idDevice: props.idDevice, pins: [{ status: 'OFF', val: props.val, gpio: props.gpio }] });
    }
  }, [click])

  useEffect(() => {
    if(props.status === 'ON') {
      setState(buttonShadow.on);
    }else {
      setState(buttonShadow.off);
    }
  }, [props.status])

  return (
    <div className='bg-[#292d33] rounded p-2.5 animate-[load-smooth_200ms_ease-in-out_alternate]'>
      <div className='mb-2 px-2 text-center text-sm flex items-center justify-between'>
        <img className='block w-8 h-auto' src={`${process.env.REACT_APP_SERVER_API_HOST}/static/common/button.svg`} alt={'button'} />
        <Tooltip title={ title } placement="top">
          <p className='cursor-help'>{ title }</p>
        </Tooltip>
        <p className={`w-2.5 h-2.5 m-0 rounded-full transition-colors shadow-md`} style={{ background: state.signal }}></p>
      </div>
      <div onClick={ () => { setClick(state => { return !state }) } } className="overflow-hidden m-auto flex items-center justify-center rounded-full " style={{ height: `${props.size || 140}px`, width: `${props.size || 140}px` }}>
        <div style={{ background: state.bg }} className={`transition-shadow w-4/5 h-4/5 rounded-full bg-[#292d33] ${state.shadow}`}> {/* shadow-inner shadow-gray-700 => ON && shadow-xl	 */}</div>
      </div>
    </div>
  ) 
}

export function Slider(props) {
  return (
    <div className='bg-[#292d33] rounded p-2.5 animate-[load-smooth_200ms_ease-in-out_alternate]'>
      <div className='cursor-help mb-2 text-center text-sm flex items-center justify-center'>
      <Tooltip title={ props.title } placement="top">
        <p className='cursor-help'>{ props.title }</p>
      </Tooltip>
      </div>
      <div className='flex items-center justify-center'>
        <CircleSlider value={54} progressColor="#6C7290" showTooltip={true} size={170} showPercentage={true} tooltipColor="white" knobColor="#292d33" />
      </div>
    </div>
  )
}

export function ColorPicker(props) {
  const colorPicker = useRef();
  const [color, setColor] = useState(() => (props?.mode === 'color-off') ? `#000` : (props?.color ? rgbToHex(...props?.color) : rgbToHex(0, 0, 0) ));

  const onColorChange = (event) => {
    setColor(event.target.value);
  };
  
  useEffect(() => {
    const colorRgb = hexToRgb(color) ? [hexToRgb(color).r, hexToRgb(color).g, hexToRgb(color).b] : [0, 0, 0];
    // console.log(colorRgb);
    props.pickColor({ model: 'RGB-CHAIN', idDevice: props.idDevice, pins: [{ val: props.val, gpio: props.gpio, mode: 'color-single', payload: colorRgb }]});
  }, [color])

  useLayoutEffect(() => {
    colorPicker.current.addEventListener("change", onColorChange);
  }, [colorPicker])

  return (
    <div className='bg-[#292d33] rounded p-2.5 animate-[load-smooth_200ms_ease-in-out_alternate]'>
      <div className='mb-2 text-center text-lg flex items-center justify-center'>
        <img className='block w-6 h-auto mr-2' src={`${process.env.REACT_APP_SERVER_API_HOST}/static/common/rgb.svg`} alt={'rgb'} />
        <Tooltip title={ props.title } placement="top">
          <div className='cursor-help text-sm whitespace-nowrap overflow-ellipsis overflow-hidden max-w-[138px]'>{ props.title }</div>
        </Tooltip>
        <div className='w-5 h-5 rounded-full ml-2' style={{ backgroundColor: `${color}`, boxShadow: `0 0 10px ${color}` }}></div>
      </div>
      <div className='flex items-center justify-center'>
        <slider-color-picker
          color={color}
          ref={colorPicker}
          onChange={onColorChange}
        ></slider-color-picker>
      </div>
    </div>
  )
}
