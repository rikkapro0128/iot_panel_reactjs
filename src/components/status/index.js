function Status({ name, status }) {
  return (
    <div className="flex items-center py-2 px-4 rounded-full bg-[#1A1D27] w-fit">
      <p className="mr-2.5">Trạng thái { name }</p>
      <div className={`w-2 h-2 rounded-full ${ status === 'online' ? 'bg-green-400' : 'bg-gray-300' }`}></div>
    </div>
  )
}

export {
  Status,
}
