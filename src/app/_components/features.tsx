import Image from "next/image";

export const FeaturesSection = () => {
  return (
    <section id="features" className="bg-secondary-light rounded-lg">
      <div className="container mx-auto grid place-items-center">
        <h2 className="text-h1 max-w-[880px] py-24 text-center font-semibold">
          Arianne è una{" "}
          <strong className="bg-secondary text-secondary-foreground rounded-lg px-2">
            piattaforma integrata
          </strong>{" "}
          con un&apos;app per i pazienti e una dashboard per i terapeuti
        </h2>
        <Image
          src="/images/placeholder-computer.png"
          alt="Piattaforma Arianne"
          width={1268}
          height={510}
          className="w-full"
        />
      </div>
    </section>
  );
};
