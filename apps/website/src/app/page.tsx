// import { HydrateClient } from "~/trpc/server";
import { HeroSection } from "./_components/hero";
import { FeaturesSection } from "./_components/features";
import { BenefitsSection } from "./_components/beneficts";
import { ContactsSection } from "./_components/contacts";
import { CollaborationSection } from "./_components/collaboration";

export default async function Home() {
  return (
    // <HydrateClient>
    <main className="min-h-safe">
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <CollaborationSection />
      <ContactsSection />
    </main>
    // </HydrateClient>
  );
}
