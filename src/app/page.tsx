import { HydrateClient } from "~/trpc/server";
import { HeroSection } from "./_components/hero";
import { FeaturesSection } from "./_components/features";
import { BenefitsSection } from "./_components/beneficts";
import { ContactsSection } from "./_components/contacts";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="min-h-safe">
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
        <ContactsSection />
      </main>
    </HydrateClient>
  );
}
