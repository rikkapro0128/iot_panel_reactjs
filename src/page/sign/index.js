import { FlexboxGrid } from 'rsuite';
import { Outlet } from "react-router-dom";

function Sign() {
  return (
    <div className='h-screen flex justify-center items-center'>
      <FlexboxGrid.Item colspan={12}>
        <Outlet />
      </FlexboxGrid.Item>
    </div>
  )
}

export default Sign;