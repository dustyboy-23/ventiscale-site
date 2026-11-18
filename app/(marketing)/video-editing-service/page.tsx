import { ServicePage, serviceMetadata } from "@/components/marketing/service-page";

export const metadata = serviceMetadata("video");

export default function VideoPage() {
  return <ServicePage id="video" />;
}
