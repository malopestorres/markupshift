import { createSocialImage } from "@/components/social-image";

export const dynamic = "force-static";

export function GET() {
  return createSocialImage();
}
