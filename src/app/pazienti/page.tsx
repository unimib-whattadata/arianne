import { HydrateClient } from "~/trpc/server";
import { HeroSection } from "./_components/hero";
import { FeaturesSection } from "./_components/features";
import { PriceSection } from "./_components/price";
import { EfficacySection } from "./_components/efficacy";

export default function PatientsPage() {
  return (
    <HydrateClient>
      <main className="min-h-safe">
        <HeroSection />
        <FeaturesSection />
        <PriceSection />
        <EfficacySection />
      </main>
    </HydrateClient>
  );
}
