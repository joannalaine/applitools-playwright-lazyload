import { test } from "@playwright/test";
import {
  BatchInfo,
  Configuration,
  EyesRunner,
  ClassicRunner,
  VisualGridRunner,
  BrowserType,
  DeviceName,
  ScreenOrientation,
  Eyes,
  Target,
} from "@applitools/eyes-playwright";

export const USE_ULTRAFAST_GRID: boolean = false;

export let Batch: BatchInfo;
export let Config: Configuration;
export let Runner: EyesRunner;

test.beforeAll(async () => {
  if (USE_ULTRAFAST_GRID) {
    Runner = new VisualGridRunner({ testConcurrency: 1 });
  } else {
    Runner = new ClassicRunner();
  }

  const runnerName = USE_ULTRAFAST_GRID ? "Ultrafast Grid" : "Classic runner";
  Batch = new BatchInfo({ name: `Applitools Homepage: ${runnerName}` });
  Config = new Configuration();
  Config.setBatch(Batch);

  if (USE_ULTRAFAST_GRID) {
    Config.addBrowser(800, 600, BrowserType.SAFARI);
    Config.addBrowser(1600, 1200, BrowserType.CHROME);
    Config.addDeviceEmulation(
      DeviceName.iPhone_11_Pro,
      ScreenOrientation.PORTRAIT
    );
  }
});

test.describe("Applitools Homepage", () => {
  let eyes: Eyes;

  test.beforeEach(async ({ page }) => {
    eyes = new Eyes(Runner, Config);

    await eyes.open(page, "Applitools", test.info().title, {
      width: 1440,
      height: 768,
    });
  });

  test("view homepage", async ({ page }) => {
    await page.goto("https://applitools.com/");
    // await eyes.check("Home page", Target.window().fully().layout()); // Captures screenshot
    await eyes.check("Home page", Target.window().lazyLoad()); // Does not capture screenshot
  });

  test.afterEach(async () => {
    await eyes.close();
  });
});

test.afterAll(async () => {
  const results = await Runner.getAllTestResults();
  console.log("Visual test results", results);
});
