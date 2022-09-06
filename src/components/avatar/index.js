import { cacheImage } from '@/utils';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px #292d33`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

function AvatarRipple({ src, size = 50 }) {

  const [img, setImg] = useState(undefined);

  useEffect(() => {
    cacheImage(src, () => {
      setImg(src);
    })
  }, [src])

  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
      className='cursor-pointer'
    >
      <Avatar sx={{ width: size, height: size }} alt="avatar">
        { img ? <img src={img} alt="avatar" /> : <CircularProgress size={24} /> }
      </Avatar>
    </StyledBadge>
  )
}

export {
  AvatarRipple,
}
