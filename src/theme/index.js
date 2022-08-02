import { CustomProvider } from 'rsuite';

function Theme(props) {
  return <CustomProvider theme="dark">{props.children}</CustomProvider>;
}

export default Theme;