import icon from '../../assets/icon.svg';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// import './App.css';
import { Button } from '@mui/material';

/**
 * Default View is the main view that the react router loads.
 * 
 * @returns React component.
 */
const Tap = (props: any) => {

  console.log(props)

  return (
    <div>

      <Button variant="outlined">Hello</Button>

    </div>
  );
};

export default Tap
// export default function App() {
//   return (
//     <Tap />
//   );
// }
