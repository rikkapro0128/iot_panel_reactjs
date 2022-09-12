import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
  status: "offline",
  provider: {
    sensors: [],
    devices: [],
  },
};

export const nodesSlice = createSlice({
  name: "nodes",
  initialState,
  reducers: {
    setNodes: (state, action) => {
      state.value = action.payload;
    },
    addNode: (state, action) => {
      state.value.push(action.payload);
    },
    removeNode: (state, action) => {
      console.log(action.payload);
      state.value = state.value.filter(
        (node) => node._id !== action.payload.id
      );
    },
    updateNode: (state, action) => {
      state.value.some((node, index) => {
        if (node._id === action.payload.id) {
          state.value[index] = action.payload.value;
          return true;
        } else {
          return false;
        }
      });
    },
    setProviderSensors: (state, action) => {
      state.provider.sensors = action.payload.reduce(
        (oldPayload, newPayload) => {
          return [
            ...oldPayload,
            {
              name: newPayload.sensor.name,
              id: newPayload.sensor._id,
              model: newPayload.sensor.typeModel,
              value: newPayload?.sampleSensor?.value || "unset",
              unit:
                (newPayload.sensor.unit === "Percent"
                  ? undefined
                  : newPayload.sensor.unit) || "%",
            },
          ];
        },
        []
      );
    },
    setProviderDevices: (state, action) => {
      state.provider.devices = action.payload.reduce(
        (oldPayload, newPayload) => {
          // name, id, status, model, val, gpio,
          return [
            ...oldPayload,
            ...newPayload.pins.map((pin) => {
              return {
                id: newPayload?._id,
                name: newPayload?.name,
                model: newPayload?.typeModel,
                unit: newPayload?.unit,
                ...pin,
              };
            }),
          ];
        },
        []
      );
    },
    updateSensor: (state, action) => {
      state.provider.sensors = state.provider.sensors.map((sensor) => {
        return (action.payload.model === sensor.model) ? {
          ...sensor,
          ...action.payload,
          id: action.payload.idSensor,
        } : sensor;
      });
    },
    updateDevice: (state, action) => {
      const typeModel = action.payload.model;
      action.payload.pins.forEach(payload => {
        state.provider.devices = state.provider.devices.map(device => {
          return (payload.gpio === device.gpio && typeModel === device.model) ? { ...device, ...payload } : device;
        });
      });
    },
    setStatusNode: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const {
  setNodes,
  addNode,
  removeNode,
  setProviderSensors,
  setProviderDevices,
  updateSensor,
  updateDevice,
  setStatusNode,
  updateNode,
} = nodesSlice.actions;

export default nodesSlice.reducer;
