// import { HydrateClient } from "~/trpc/server";
import { HeroSection } from "./_components/hero";
import { FeaturesSection } from "./_components/features";
import { PriceSection } from "./_components/price";
import { FaqSection } from "./_components/faq";
import { AdvantagesSection } from "./_components/advantages";

export default function PatientsPage() {
  return (
    // <HydrateClient>
    <main className="min-h-safe">
      <HeroSection />
      <FeaturesSection />
      <AdvantagesSection />
      <PriceSection />
      <FaqSection />
    </main>
    // </HydrateClient>
  );
}
