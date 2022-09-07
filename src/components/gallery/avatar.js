import { cacheImage } from "@/utils";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState, memo } from "react";

 function GalleryAvatar({ srcImages = [], size = 100 }) {
  const [stateList, setStateList] = useState(() => srcImages.map(() => false));

  useEffect(() => {
    srcImages.forEach((src, indexSrc) => {
      cacheImage(src, () => {
        setStateList((list) => {
          return list.map((state, indexState) => {
            if (indexSrc === indexState) {
              return true;
            } else {
              return state;
            }
          });
        });
      });
    });
  }, [srcImages]);

  return (
    <div className="flex max-w-3xl w-fit max-h-[500px] flex-wrap justify-center -m-2">
      {srcImages.map((src, index) => {
        return (
          <Avatar key={src} sx={{ width: size, height: size, margin: '0.5rem' }}>
            {stateList[index] ? (
              <img src={`${process.env.REACT_APP_SERVER_API_HOST}/static/avatar/${srcImages[index]}.svg`} alt="avatar-loaded" />
            ) : (
              <CircularProgress />
            )}
          </Avatar>
        );
      })}
    </div>
  );
}

export default memo(GalleryAvatar);