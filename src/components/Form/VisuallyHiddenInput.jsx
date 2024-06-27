import { styled } from '@mui/material/styles'

/**
 * Custom input file ở đây:
 * Lưu ý thành phần bọc cái VisuallyHiddenInput này phải có chứa component="label" như docs hướng dẫn:
 * https://mui.com/material-ui/react-button/#file-upload
 * ...
 * https://github.com/viclafouch/mui-file-input
 */
const HiddenInputStyles = styled('input')({
  display: 'none'
})

function VisuallyHiddenInput(props) {
  return <HiddenInputStyles {...props} />
}

export default VisuallyHiddenInput