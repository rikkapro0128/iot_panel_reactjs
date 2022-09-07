import FileUploadIcon from '@mui/icons-material/FileUpload';
import IconButton from '@mui/material/IconButton';
import PermMediaIcon from '@mui/icons-material/PermMedia';

import { IconUploadImage } from '@/icons';

function UploadFile() {

  return (
    <div className="w-full cursor-pointer relative border-dashed border-spacing-2 rounded-md mt-5 sx:min-h-[150px] lg:min-h-[200px] box-border">
      <div className="flex flex-col items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <IconUploadImage className="w-12 h-12" />
        <h5 className='mr-2.5 text-lg'>Kéo thả file vào đây hoặc, <span className='text-green-400'>tải lên</span>!</h5>
        <span >(Hỗ trợ: <span className='italic'>svg, jpeg, png</span>)</span>
      </div>
    </div>
  )

}

export default UploadFile;
