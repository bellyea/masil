import { EventCategory, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.event.deleteMany();

  const categories = [
    EventCategory.EXHIBITION,
    EventCategory.THEATER,
    EventCategory.FESTIVAL,
    EventCategory.PERFORMANCE,
  ] as const;

  const events = Array.from({ length: 50 }, (_, i) => ({
    title: `테스트 이벤트 ${i + 1}`,

    description: `테스트 설명 ${i + 1}`,

    category: categories[i % categories.length],

    venueName: `장소 ${i + 1}`,

    images: [],

    website: "https://example.com",

    startDate: new Date("2026-06-01"),

    endDate: new Date("2026-12-31"),

    isFeatured: i < 5,
  }));

  await prisma.event.createMany({
    data: events,
  });

  console.log("✅ Seed 완료");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });