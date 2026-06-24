import { syncCultureEvents } from "@/lib/services/eventService";

async function runTest() {
  console.log("Starting culture sync test...");

  try {
    const result = await syncCultureEvents();
    console.log("Culture sync test succeeded", result);
  } catch (error) {
    console.error("Culture sync test failed", error);
  }
}

runTest();
