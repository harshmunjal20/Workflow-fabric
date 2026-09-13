import { cn } from '../lib/utils';
import {Button} from '../components/ui/button';

const Page = () => {
  const something = true;

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center ">
      <Button variant = "secondary">
        Click me
      </Button>
    </div>
  )
};

export default Page;