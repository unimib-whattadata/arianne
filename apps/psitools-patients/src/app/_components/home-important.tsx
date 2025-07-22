import { Button } from '@/components/ui/button';

export const HomeImportant = () => {
  return (
    <section className="grid-rows-4 gap-x-8 gap-y-8">
      <div className="col-span-2 flex flex-col gap-4 rounded-lg bg-orange-200 px-10 py-8">
        <h2 className="text-2xl text-orange-500">Importante!</h2>
        <p className="overflow-hidden text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum."
        </p>
        <Button className="mr-auto rounded-sm bg-orange-500 font-normal">
          Vai alla Sezione
        </Button>
      </div>
    </section>
  );
};
