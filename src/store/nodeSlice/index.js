import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
  status: 'offline',
  provider: {
    sensors: [],
    devices: [],
  }
}

export const nodesSlice = createSlice({
  name: 'nodes',
  initialState,
  reducers: {
    setNodes: (state, action) => {
      state.value = action.payload;
    },
    addNode: (state, action) => {
      state.value.push(action.payload);
    },
    removeNode: (state, action) => {
      state.value = state.value.filter(node => node._id !== action.payload.id);
    },
    setProvider: (state, action) => {

      state.provider.sensors = action.payload.sensors.reduce((oldPayload, newPayload) => {
        if(newPayload.sensor.typeModel === 'DHT21') {
          return [
            ...oldPayload,
            {
              name: 'Nhiệt độ',
              id: newPayload.sensor._id,
              model: newPayload.sensor.typeModel + '-temperature',
              value: newPayload?.sampleSensor?.value.temperature,
              unit: '°C'
            },
            {
              name: 'Độ ẩm',
              id: newPayload.sensor._id,
              model: newPayload.sensor.typeModel + '-humidity',
              value: newPayload?.sampleSensor?.value.humidity,
              unit: '%'
            }
          ]
        }else {
          return [
            ...oldPayload,
            {
              name: newPayload.sensor.name,
              id: newPayload.sensor._id,
              model: newPayload.sensor.typeModel,
              value: newPayload?.sampleSensor?.value || 'unset',
              unit: (newPayload.sensor.unit === 'Percent' ? undefined : newPayload.sensor.unit) || '%'
            }
          ]
        }
      }, [])

      state.provider.devices = action.payload.devices.reduce((oldPayload, newPayload) => {
        if(newPayload.device.typeModel === 'RELAY') {
          return [
            ...oldPayload,
            ...newPayload.sampleDevice.map((sample) => {
              return {
                id: sample.bindDevice,
                model: newPayload.device.typeModel,
                unit: newPayload.device.unit,
                name: `Relay ${sample.val}`,
                val: sample.val,
                gpio: sample.gpio,
                status: sample.status,
              }
            })
          ]
        }else {
          return [
            ...oldPayload,
            ...newPayload.sampleDevice.map(sample => {
              return {
                id: sample.bindDevice,
                model: newPayload.device.typeModel,
                unit: newPayload.device.unit,
                name: `${newPayload.device.name}`,
                mode: sample?.mode,
                val: sample.val,
                gpio: sample.gpio,
                payload: sample?.payload,
              }
            })
          ]
        }
      }, [])
    },
    updateSensor: (state, action) => {
      if(action.payload.model === 'DHT21') {
        state.provider.sensors = state.provider.sensors.map(sensor => {
          if(sensor.model.includes('DHT21-temperature')) {
            return {
              ...sensor,
              value: action.payload.value.temperature
            }
          }else if(sensor.model.includes('DHT21-humidity')) {
            return {
              ...sensor,
              value: action.payload.value.humidity
            }
          }else {
            return sensor;
          }
        })
      }
    },
    setStatusNode: (state, action) => {
      state.status = action.payload;
    }
  }
});

export const { setNodes, addNode, removeNode, setProvider, updateSensor, setStatusNode } = nodesSlice.actions;

export default nodesSlice.reducer;
