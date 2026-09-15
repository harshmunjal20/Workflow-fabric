import { cn } from '../lib/utils';
import {Button} from '../components/ui/button';
import prisma  from '../lib/db';

const Page = async () => {
  const users = await prisma.user.findMany();

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center ">
      <Button variant = "secondary">
        {JSON.stringify(users)}
      </Button>
    </div>
  )
};

export default Page;