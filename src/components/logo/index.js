import { useNavigate } from "react-router-dom";

function Logo (props) {
  const navigate = useNavigate();
  return (
    <div onClick={ () => { navigate('/') } } { ...props } className={`flex items-center cursor-pointer ${props.className || ''}`}>
      <img className={`object-cover ${props.size || 'w-9'}`} src="https://www.iotforall.com/wp-content/uploads/2017/05/IoT-For-All-Logo.png" alt="logo" />
      <h3 className="text-lg whitespace-nowrap ml-2 capitalize">manga node</h3>
    </div>
  );

}

export { Logo };