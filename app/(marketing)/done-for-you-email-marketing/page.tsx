import { ServicePage, serviceMetadata } from "@/components/marketing/service-page";

export const metadata = serviceMetadata("email");

export default function EmailPage() {
  return <ServicePage id="email" />;
}
