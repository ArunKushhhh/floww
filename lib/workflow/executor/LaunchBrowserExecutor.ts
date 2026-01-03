import { waitFor } from "@/lib/helper/waitFor";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    // console.log("Env: ", JSON.stringify(environment, null, 4));
    const websiteUrl = environment.getInput("Website Url");
    console.log("Website Url: ", websiteUrl);
    const browser = await puppeteer.launch({
      headless: false, // for testing, we need to see if the browser is launched
    });
    await waitFor(3000);
    await browser.close();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
