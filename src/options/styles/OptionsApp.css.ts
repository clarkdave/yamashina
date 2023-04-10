import { style } from '@vanilla-extract/css'

export const page = style({
  background: '#edeff5',
  height: '100vh',
})

export const floatingContainer = style({
  maxWidth: 600,
  position: 'relative',
  top: '200px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'white',
  display: 'flex',
  flexDirection: 'column',
  boxShadow:
    '0 0 1px rgba(67, 90, 111, 0.3), 0 2px 4px -2px rgba(67, 90, 111, 0.47)',
})

export const topBar = style({
  background: '#121827',
  borderTopLeftRadius: 'inherit',
  borderTopRightRadius: 'inherit',
  padding: '10px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: 32,
})

export const navBar = style({
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
})

export const navLink = style({
  fontSize: '13px',
  color: 'white',
  padding: '8px 12px',
  borderRadius: '5px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
})

export const navLinkActive = style({
  background: '#1f2a38',
})

export const formContainer = style({
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
})

export const formActions = style({
  display: 'flex',
  gap: 20,
})
