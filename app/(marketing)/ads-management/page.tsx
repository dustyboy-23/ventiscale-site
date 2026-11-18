import { ServicePage, serviceMetadata } from "@/components/marketing/service-page";

export const metadata = serviceMetadata("ads");

export default function AdsPage() {
  return <ServicePage id="ads" />;
}
