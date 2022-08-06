function Logo ({ size }) {
  return (
    <div className="flex items-center">
      <img className={`object-cover ${size || 'w-9'}`} src="https://www.iotforall.com/wp-content/uploads/2017/05/IoT-For-All-Logo.png" alt="logo" />
      <h3 className="text-lg whitespace-nowrap ml-2 capitalize">manga node</h3>
    </div>
  );

}

export { Logo };