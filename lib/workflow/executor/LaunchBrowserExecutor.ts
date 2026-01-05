import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    // console.log("Env: ", JSON.stringify(environment, null, 4));
    const websiteUrl = environment.getInput("Website Url");
    // console.log("Website Url: ", websiteUrl);
    const browser = await puppeteer.launch({
      headless: true, // for testing, we need to see if the browser is launched; made ot true for production as we the browser to be launched in the background
    });
    environment.log.info("Browser launched successfully");
    
    environment.setBrowser(browser);
    const page = await browser.newPage();
    await page.goto(websiteUrl);
    environment.setPage(page); // we are setting both browser and page as once everything's is done, we want to close the browser
    environment.log.info(`Opened page at: ${websiteUrl}`);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
