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
        if(node._id === action.payload.id) {
          state.value[index] = action.payload.value;
          return true;
        }else {
          return false;
        }
      })
    },
    setProviderSensors: (state, action) => {
      state.provider.sensors = action.payload.reduce(
        (oldPayload, newPayload) => {
          if (newPayload.sensor.typeModel === "DHT21") {
            return [
              ...oldPayload,
              {
                name: "Nhiệt độ",
                id: newPayload.sensor._id,
                model: newPayload.sensor.typeModel + "-temperature",
                value: newPayload?.sampleSensor?.value.temperature,
                unit: "°C",
              },
              {
                name: "Độ ẩm",
                id: newPayload.sensor._id,
                model: newPayload.sensor.typeModel + "-humidity",
                value: newPayload?.sampleSensor?.value.humidity,
                unit: "%",
              },
            ];
          } else {
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
          }
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
      if (action.payload.model === "DHT21") {
        state.provider.sensors = state.provider.sensors.map((sensor) => {
          if (sensor.model.includes("DHT21-temperature")) {
            return {
              ...sensor,
              value: action.payload.value.temperature,
            };
          } else if (sensor.model.includes("DHT21-humidity")) {
            return {
              ...sensor,
              value: action.payload.value.humidity,
            };
          } else {
            return sensor;
          }
        });
      }
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
  setStatusNode,
  updateNode,
} = nodesSlice.actions;

export default nodesSlice.reducer;
