import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { CircleSlider } from 'react-circle-slider';
import 'slider-color-picker';

const buttonShadow = {
  off: {
    shadow: 'shadow-[20px_20px_60px_#23262b,-20px_-20px_60px_#2f343b]',
    bg: 'linear-gradient(145deg, #2c3037, #25292e)',
    signal: 'gray'
  },
  on: {
    shadow: 'shadow-[20px_20px_60px_#23262b,-20px_-20px_60px_#2f343b]',
    bg: 'linear-gradient(145deg, #25292e, #2c3037)',
    signal: 'green'
  }
}

export function ButtonPush(props) {
  const [click, setClick] = useState(true);
  const [state, setState] = useState(buttonShadow.on);

  useEffect(() => {
    if(click) {
      setState(buttonShadow.on);
    }else {
      setState(buttonShadow.off);
    }
  }, [click])

  return (
    <div className='bg-[#292d33] rounded p-2.5'>
      <div className='mb-2 text-center text-lg flex items-center justify-center'>
        {props.title}
        <p className={`w-2.5 h-2.5 rounded-full transition-colors	 bg-${state.signal}-500 ml-2 shadow-${state.signal}-500 shadow-md`}></p>
      </div>
      <div onClick={ () => { setClick(!click) } } className="overflow-hidden m-auto flex items-center justify-center rounded-full " style={{ height: `${props.size || 140}px`, width: `${props.size || 140}px` }}>
        <div style={{ background: state.bg }} className={`transition-shadow w-4/5 h-4/5 rounded-full bg-[#292d33] ${state.shadow}`}> {/* shadow-inner shadow-gray-700 => ON && shadow-xl	 */}</div>
      </div>
    </div>
  ) 
}

export function Slider(props) {
  return (
    <div className='bg-[#292d33] rounded p-2.5'>
      <div className='mb-2 text-center text-lg flex items-center justify-center'>
        {props.title}
      </div>
      <div className='flex items-center justify-center'>
        <CircleSlider value={54} progressColor="#6C7290" showTooltip={true} size={170} showPercentage={true} tooltipColor="white" knobColor="#292d33" />

      </div>
    </div>
  )
}

export function ColorPicker(props) {
  const colorPicker = useRef();
  const [color, setColor] = useState('');

  const onColorChange = (event) => {
    setColor(event.target.value);
  };

  useLayoutEffect(() => {
    setColor(colorPicker.current.value);
    colorPicker.current.addEventListener("change", onColorChange);
  }, [colorPicker])

  return (
    <div className='bg-[#292d33] rounded p-2.5'>
      <div className='mb-2 text-center text-lg flex items-center justify-center'>
        {props.title}
        <div className='w-5 h-5 rounded-full ml-2' style={{ backgroundColor: `${color}`, boxShadow: `0 0 10px ${color}` }}></div>
      </div>
      <div className='flex items-center justify-center'>
        <slider-color-picker
          ref={colorPicker}
          onChange={onColorChange}
        ></slider-color-picker>
      </div>
    </div>
  )
}
